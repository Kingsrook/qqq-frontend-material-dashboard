/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {QException} from "@kingsrook/qqq-frontend-core/lib/exceptions/QException";
import {QComponentType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QComponentType";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFrontendComponent} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendComponent";
import {QFrontendStepMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QJobRunning} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobRunning";
import {QJobStarted} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobStarted";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Button, Icon, CircularProgress, TablePagination} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import {DataGridPro, GridColDef} from "@mui/x-data-grid-pro";
import FormData from "form-data";
import {Form, Formik} from "formik";
import React, {useEffect, useState} from "react";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import BaseLayout from "qqq/components/BaseLayout";
import {QCancelButton, QSubmitButton} from "qqq/components/QButtons";
import QDynamicForm from "qqq/components/QDynamicForm";
import DynamicFormUtils from "qqq/components/QDynamicForm/utils/DynamicFormUtils";
import MDBox from "qqq/components/Temporary/MDBox";
import MDButton from "qqq/components/Temporary/MDButton";
import MDProgress from "qqq/components/Temporary/MDProgress";
import MDTypography from "qqq/components/Temporary/MDTypography";
import {QGoogleDriveFolderPicker} from "qqq/pages/process-run/components/QGoogleDriveFolderPicker";
import QValidationReview from "qqq/pages/process-run/components/QValidationReview";
import QClient from "qqq/utils/QClient";
import QValueUtils from "qqq/utils/QValueUtils";
import QProcessSummaryResults from "./components/QProcessSummaryResults";

interface Props
{
   process?: QProcessMetaData;
   defaultProcessValues?: any;
}

const INITIAL_RETRY_MILLIS = 1_500;
const RETRY_MAX_MILLIS = 12_000;
const BACKOFF_AMOUNT = 1.5;

function ProcessRun({process, defaultProcessValues}: Props): JSX.Element
{
   const processNameParam = useParams().processName;
   const processName = process === null ? processNameParam : process.name;

   ///////////////////
   // process state //
   ///////////////////
   const [processUUID, setProcessUUID] = useState(null as string);
   const [retryMillis, setRetryMillis] = useState(INITIAL_RETRY_MILLIS);
   const [jobUUID, setJobUUID] = useState(null as string);
   const [qJobRunning, setQJobRunning] = useState(null as QJobRunning);
   const [qJobRunningDate, setQJobRunningDate] = useState(null as Date);
   const [activeStepIndex, setActiveStepIndex] = useState(0);
   const [activeStep, setActiveStep] = useState(null as QFrontendStepMetaData);
   const [newStep, setNewStep] = useState(null);
   const [steps, setSteps] = useState([] as QFrontendStepMetaData[]);
   const [needInitialLoad, setNeedInitialLoad] = useState(true);
   const [processMetaData, setProcessMetaData] = useState(null);
   const [tableMetaData, setTableMetaData] = useState(null);
   const [qInstance, setQInstance] = useState(null as QInstance);
   const [processValues, setProcessValues] = useState({} as any);
   const [processError, setProcessError] = useState(null as string);
   const [needToCheckJobStatus, setNeedToCheckJobStatus] = useState(false);
   const [lastProcessResponse, setLastProcessResponse] = useState(
      null as QJobStarted | QJobComplete | QJobError | QJobRunning,
   );
   const [showErrorDetail, setShowErrorDetail] = useState(false);
   const [showFullHelpText, setShowFullHelpText] = useState(false);

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // the validation screen - it can change whether next is actually the final step or not... so, use this state field to track that. //
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   const [overrideOnLastStep, setOverrideOnLastStep] = useState(null as boolean);

   const onLastStep = activeStepIndex === steps.length - 2;
   const noMoreSteps = activeStepIndex === steps.length - 1;

   ////////////////
   // form state //
   ////////////////
   const [formId, setFormId] = useState("");
   const [formFields, setFormFields] = useState({});
   const [initialValues, setInitialValues] = useState({});
   const [validationScheme, setValidationScheme] = useState(null);
   const [validationFunction, setValidationFunction] = useState(null);
   const [formError, setFormError] = useState(null as string);

   ///////////////////////
   // record list state //
   ///////////////////////
   const [needRecords, setNeedRecords] = useState(false);
   const [recordConfig, setRecordConfig] = useState({} as any);
   const [pageNumber, setPageNumber] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [records, setRecords] = useState([] as QRecord[]);

   //////////////////////////////
   // state for bulk edit form //
   //////////////////////////////
   const [disabledBulkEditFields, setDisabledBulkEditFields] = useState({} as any);

   const navigate = useNavigate();
   const location = useLocation();

   const doesStepHaveComponent = (step: QFrontendStepMetaData, type: QComponentType): boolean =>
   {
      if (step.components)
      {
         for (let i = 0; i < step.components.length; i++)
         {
            if (step.components[i].type === type)
            {
               return (true);
            }
         }
      }
      return (false);
   };

   // @ts-ignore
   const defaultLabelDisplayedRows = ({from, to, count}) => `${from.toLocaleString()}–${to.toLocaleString()} of ${count !== -1 ? count.toLocaleString() : `more than ${to.toLocaleString()}`}`;

   // @ts-ignore
   // eslint-disable-next-line react/no-unstable-nested-components
   function CustomPagination()
   {
      return (
         <TablePagination
            component="div"
            count={recordConfig.totalRecords}
            page={pageNumber}
            rowsPerPageOptions={[10, 25, 50]}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, value) => recordConfig.handlePageChange(value)}
            onRowsPerPageChange={(event) => recordConfig.handleRowsPerPageChange(Number(event.target.value))}
            labelDisplayedRows={defaultLabelDisplayedRows}
         />
      );
   }

   //////////////////////////////////////////////////////////////
   // event handler for the bulk-edit field-enabled checkboxes //
   //////////////////////////////////////////////////////////////
   const bulkEditSwitchChanged = (name: string, switchValue: boolean) =>
   {
      const newDisabledBulkEditFields = JSON.parse(JSON.stringify(disabledBulkEditFields));
      newDisabledBulkEditFields[name] = !switchValue;
      setDisabledBulkEditFields(newDisabledBulkEditFields);
   };

   const formatViewValue = (value: any): JSX.Element =>
   {
      if (value === null || value === undefined)
      {
         return <span>&nbsp;</span>;
      }

      if (typeof value === "string")
      {
         return QValueUtils.breakTextIntoLines(value);
      }

      return (<span>{value}</span>);
   };

   const toggleShowErrorDetail = () =>
   {
      setShowErrorDetail(!showErrorDetail);
   };

   const toggleShowFullHelpText = () =>
   {
      setShowFullHelpText(!showFullHelpText);
   };

   ////////////////////////////////////////////////////
   // generate the main form body content for a step //
   ////////////////////////////////////////////////////
   const getDynamicStepContent = (
      stepIndex: number,
      step: any,
      formData: any,
      processError: string,
      processValues: any,
      recordConfig: any,
      setFieldValue: any,
   ): JSX.Element =>
   {
      if (processError)
      {
         return (
            <>
               <MDTypography color="error" variant="h3" component="div">
                  Error
               </MDTypography>
               <MDTypography color="body" variant="button">
                  An error occurred while running the process:
                  {" "}
                  {process.label}
                  <MDBox mt={3} display="flex" justifyContent="center">
                     <MDBox display="flex" flexDirection="column" alignItems="center">
                        <Button onClick={toggleShowErrorDetail} startIcon={<Icon>{showErrorDetail ? "expand_less" : "expand_more"}</Icon>}>
                           {showErrorDetail ? "Hide " : "Show "}
                           detailed error message
                        </Button>
                        <MDBox mt={1} style={{display: showErrorDetail ? "block" : "none"}}>
                           {processError}
                        </MDBox>
                     </MDBox>
                  </MDBox>
               </MDTypography>
            </>
         );
      }

      if (qJobRunning || step === null)
      {
         return (
            <Grid m={3} mt={9} container>
               <Grid item xs={0} lg={3} />
               <Grid item xs={12} lg={6}>
                  <Card>
                     <MDBox p={3}>
                        <MDTypography variant="h5" component="div">
                           Working
                        </MDTypography>
                        <Grid container>
                           <Grid item padding={2}>
                              <CircularProgress color="info" />
                           </Grid>
                           <Grid item padding={1}>
                              <MDTypography color="body" variant="button">
                                 {qJobRunning?.message}
                                 <br />
                                 {qJobRunning?.current && qJobRunning?.total && (
                                    <>
                                       <div>{`${qJobRunning.current.toLocaleString()} of ${qJobRunning.total.toLocaleString()}`}</div>
                                       <MDBox width="20rem">
                                          <MDProgress variant="gradient" value={100 * (qJobRunning.current / qJobRunning.total)} color="success" />
                                       </MDBox>
                                    </>
                                 )}
                                 {
                                    qJobRunningDate && (<i>{`Updated at ${qJobRunningDate?.toLocaleTimeString()}`}</i>)
                                 }
                              </MDTypography>
                           </Grid>
                        </Grid>
                     </MDBox>
                  </Card>
               </Grid>
            </Grid>
         );
      }

      return (
         <>
            <MDTypography variation="h5" component="div" fontWeight="bold">{step?.label}</MDTypography>
            {step.components && (
               step.components.map((component: QFrontendComponent, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index}>
                     {
                        component.type === QComponentType.HELP_TEXT && (
                           component.values.previewText ?
                              <>
                                 <Box mt={1}>
                                    <Button onClick={toggleShowFullHelpText} startIcon={<Icon>{showFullHelpText ? "expand_less" : "expand_more"}</Icon>} sx={{pl: 1}} >
                                       {showFullHelpText ? "Hide " : "Show "}
                                       {component.values.previewText}
                                    </Button>
                                 </Box>
                                 <MDBox mt={1} style={{display: showFullHelpText ? "block" : "none"}}>
                                    <Typography variant="body2" color="info">
                                       {QValueUtils.breakTextIntoLines(component.values.text)}
                                    </Typography>
                                 </MDBox>
                              </>
                              :
                              <MDTypography variant="button" color="info">
                                 {QValueUtils.breakTextIntoLines(component.values.text)}
                              </MDTypography>
                        )
                     }
                     {
                        component.type === QComponentType.BULK_EDIT_FORM && (
                           <QDynamicForm formData={formData} bulkEditMode bulkEditSwitchChangeHandler={bulkEditSwitchChanged} />
                        )
                     }
                     {
                        component.type === QComponentType.EDIT_FORM && (
                           <QDynamicForm formData={formData} />
                        )
                     }
                     {
                        component.type === QComponentType.VIEW_FORM && step.viewFields && (
                           <div>
                              {step.viewFields.map((field: QFieldMetaData) => (
                                 <MDBox key={field.name} display="flex" py={1} pr={2}>
                                    <MDTypography variant="button" fontWeight="bold">
                                       {field.label}
                                       : &nbsp;
                                    </MDTypography>
                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                       {formatViewValue(processValues[field.name])}
                                    </MDTypography>
                                 </MDBox>
                              ))}
                           </div>
                        )
                     }
                     {
                        component.type === QComponentType.DOWNLOAD_FORM && (
                           <Grid container display="flex" justifyContent="center">
                              <Grid item xs={12} sm={12} xl={8} m={3} p={3} sx={{border: "1px solid gray", borderRadius: "1rem"}}>
                                 <MDBox mt={-5} mb={1} p={1} sx={{width: "fit-content"}} bgColor="success" borderRadius=".25em" width="initial" color="white">
                                    <MDBox display="flex" alignItems="center" color="white">
                                       Download
                                    </MDBox>
                                 </MDBox>
                                 <MDBox display="flex" py={1} pr={2}>
                                    <MDTypography variant="button" fontWeight="bold">
                                       <Link target="_blank" download href={`/download/${processValues.downloadFileName}?filePath=${processValues.serverFilePath}`} display="flex" alignItems="center">
                                          <Icon fontSize="large">download_for_offline</Icon>
                                          <Box pl={1}>
                                             {processValues.downloadFileName}
                                          </Box>
                                       </Link>
                                    </MDTypography>
                                 </MDBox>
                              </Grid>
                           </Grid>
                        )
                     }
                     {
                        component.type === QComponentType.VALIDATION_REVIEW_SCREEN && (
                           <QValidationReview
                              qInstance={qInstance}
                              process={processMetaData}
                              table={tableMetaData}
                              processValues={processValues}
                              step={step}
                              previewRecords={records}
                              formValues={formData.values}
                              doFullValidationRadioChangedHandler={(event: any) =>
                              {
                                 const {value} = event.currentTarget;

                                 //////////////////////////////////////////////////////////////
                                 // call the formik function to set the value in this field. //
                                 //////////////////////////////////////////////////////////////
                                 setFieldValue("doFullValidation", value);

                                 setOverrideOnLastStep(value !== "true");
                              }}
                           />
                        )
                     }
                     {
                        component.type === QComponentType.PROCESS_SUMMARY_RESULTS && (
                           <QProcessSummaryResults qInstance={qInstance} process={processMetaData} table={tableMetaData} processValues={processValues} step={step} />
                        )
                     }
                     {
                        component.type === QComponentType.GOOGLE_DRIVE_SELECT_FOLDER && (
                           <QGoogleDriveFolderPicker />
                        )
                     }
                     {
                        component.type === QComponentType.RECORD_LIST && step.recordListFields && recordConfig.columns && (
                           <div>
                              <MDTypography variant="button" fontWeight="bold">Records</MDTypography>
                              {" "}
                              <br />
                              <MDBox height="100%">
                                 <DataGridPro
                                    components={{Pagination: CustomPagination}}
                                    page={recordConfig.pageNo}
                                    disableSelectionOnClick
                                    autoHeight
                                    rows={recordConfig.rows}
                                    columns={recordConfig.columns}
                                    rowBuffer={10}
                                    rowCount={recordConfig.totalRecords}
                                    pageSize={recordConfig.rowsPerPage}
                                    rowsPerPageOptions={[10, 25, 50]}
                                    onPageSizeChange={recordConfig.handleRowsPerPageChange}
                                    onPageChange={recordConfig.handlePageChange}
                                    onRowClick={recordConfig.handleRowClick}
                                    getRowId={(row) => row.__idForDataGridPro__}
                                    paginationMode="server"
                                    pagination
                                    density="compact"
                                    loading={recordConfig.loading}
                                    disableColumnFilter
                                 />
                              </MDBox>
                           </div>
                        )
                     }
                  </div>
               )))}
         </>
      );
   };

   const handlePageChange = (page: number) =>
   {
      setPageNumber(page);
   };

   const handleRowsPerPageChange = (size: number) =>
   {
      setRowsPerPage(size);
   };

   function buildNewRecordConfig()
   {
      const newRecordConfig = {} as any;
      newRecordConfig.pageNo = pageNumber;
      newRecordConfig.rowsPerPage = rowsPerPage;
      newRecordConfig.columns = [] as GridColDef[];
      newRecordConfig.rows = [];
      newRecordConfig.totalRecords = 0;
      newRecordConfig.handleRowsPerPageChange = handleRowsPerPageChange;
      newRecordConfig.handlePageChange = handlePageChange;
      newRecordConfig.handleRowClick = null;
      newRecordConfig.loading = true;
      return (newRecordConfig);
   }

   const getFullFieldList = (activeStep: QFrontendStepMetaData, processValues: any) =>
   {
      let rs: QFieldMetaData[] = [];

      if(activeStep && activeStep.formFields)
      {
         for(let i = 0; i<activeStep.formFields.length; i++)
         {
            rs.push(activeStep.formFields[i]);
         }
      }

      if(processValues.inputFieldList)
      {
         for(let i = 0; i<processValues.inputFieldList.length; i++)
         {
            let inputField = new QFieldMetaData(processValues.inputFieldList[i]);
            rs.push(inputField);
         }
      }

      return (rs);
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle moving to another step in the process - e.g., after the backend told us what screen to show next. //
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (!processMetaData)
      {
         console.log("No process meta data yet, so returning early");
         return;
      }

      let newIndex = null;
      if (typeof newStep === "number")
      {
         newIndex = newStep as number;
      }
      else if (typeof newStep === "string")
      {
         for (let i = 0; i < steps.length; i++)
         {
            if (steps[i].name === newStep)
            {
               newIndex = i;
               break;
            }
         }
      }
      if (newIndex === null)
      {
         setProcessError(`Unknown process step ${newStep}.`);
         return;
      }
      setActiveStepIndex(newIndex);
      setOverrideOnLastStep(null);

      if (steps)
      {
         const activeStep = steps[newIndex];
         setActiveStep(activeStep);
         setFormId(activeStep.name);

         let dynamicFormFields: any = {};
         let formValidations: any = {};
         let initialValues: any = {};

         ///////////////////////////////////////////////////
         // if this step has form fields, set up the form //
         ///////////////////////////////////////////////////
         if (activeStep.formFields || processValues.inputFieldList)
         {
            let fullFieldList = getFullFieldList(activeStep, processValues);
            const formData = DynamicFormUtils.getFormData(fullFieldList);
            dynamicFormFields = formData.dynamicFormFields;
            formValidations = formData.formValidations;

            fullFieldList.forEach((field) =>
            {
               initialValues[field.name] = processValues[field.name];
            });

            ////////////////////////////////////////////////////
            // disable all fields if this is a bulk edit form //
            ////////////////////////////////////////////////////
            if (doesStepHaveComponent(activeStep, QComponentType.BULK_EDIT_FORM))
            {
               const newDisabledBulkEditFields: any = {};
               fullFieldList.forEach((field) =>
               {
                  newDisabledBulkEditFields[field.name] = true;
                  dynamicFormFields[field.name].isRequired = false;
                  formValidations[field.name] = null;
               });
               setDisabledBulkEditFields(newDisabledBulkEditFields);
            }
         }

         ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // define an inner function here, for adding more fields to the form, if any components have form fields built into them //
         ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         const addField = (fieldName: string, dynamicFormValue: any, initialValue: any, validation: any) =>
         {
            dynamicFormFields[fieldName] = dynamicFormValue;
            initialValues[fieldName] = initialValue;
            formValidations[fieldName] = validation;
         }

         if (doesStepHaveComponent(activeStep, QComponentType.VALIDATION_REVIEW_SCREEN))
         {
            addField("doFullValidation", {type: "radio"}, "true", null);
            setOverrideOnLastStep(false);
         }

         if (doesStepHaveComponent(activeStep, QComponentType.GOOGLE_DRIVE_SELECT_FOLDER))
         {
            addField("googleDriveAccessToken", {type: "hidden", omitFromQDynamicForm: true}, null, null);
            addField("googleDriveFolderId", {type: "hidden", omitFromQDynamicForm: true}, null, null);
            addField("googleDriveFolderName", {type: "hidden", omitFromQDynamicForm: true}, null, null);
         }

         if(Object.keys(dynamicFormFields).length > 0)
         {
            ///////////////////////////////////////////
            // if there are form fields, set them up //
            ///////////////////////////////////////////
            setFormFields(dynamicFormFields);
            setInitialValues(initialValues);
            setValidationScheme(Yup.object().shape(formValidations));
            setValidationFunction(null);
         }
         else
         {
            /////////////////////////////////////////////////////////////////////////
            // if there are no form fields, set a null validationScheme (Yup), and //
            // instead use a validation function that always says true.            //
            /////////////////////////////////////////////////////////////////////////
            setValidationScheme(null);
            setValidationFunction(() => true);
         }
      }
   }, [newStep]);

   /////////////////////////////////////////////////////////////////////////////////////////////
   // if there are records to load: build a record config, and set the needRecords state flag //
   /////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (activeStep && activeStep.recordListFields)
      {
         const newRecordConfig = buildNewRecordConfig();
         activeStep.recordListFields.forEach((field) =>
         {
            newRecordConfig.columns.push({
               field: field.name, headerName: field.label, width: 200, sortable: false,
            });
         });
         setRecordConfig(newRecordConfig);
         setNeedRecords(true);
      }
   }, [activeStep, rowsPerPage, pageNumber]);

   /////////////////////////////////////////////////////
   // handle a bulk-edit enabled-switch being checked //
   /////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (activeStep && (activeStep.formFields || processValues.inputFieldList))
      {
         let fullFieldList = getFullFieldList(activeStep, processValues);
         const newDynamicFormFields: any = {};
         const newFormValidations: any = {};
         fullFieldList.forEach((field) =>
         {
            const fieldName = field.name;
            const isDisabled = disabledBulkEditFields[fieldName];

            newDynamicFormFields[field.name] = DynamicFormUtils.getDynamicField(field);
            newFormValidations[field.name] = DynamicFormUtils.getValidationForField(field);

            if (isDisabled)
            {
               newDynamicFormFields[field.name].isRequired = false;
               newFormValidations[field.name] = null;
            }
         });

         setFormFields(newDynamicFormFields);
         setValidationScheme(Yup.object().shape(newFormValidations));
      }
   }, [disabledBulkEditFields]);

   ////////////////////////////////////////////////
   // when we need to load records, do so, async //
   ////////////////////////////////////////////////
   useEffect(() =>
   {
      if (needRecords)
      {
         setNeedRecords(false);
         (async () =>
         {
            const response = await QClient.getInstance().processRecords(
               processName,
               processUUID,
               recordConfig.rowsPerPage * recordConfig.pageNo,
               recordConfig.rowsPerPage,
            );

            const {records} = response;
            setRecords(records);

            /////////////////////////////////////////////////////////////////////////////////////////
            // re-construct the recordConfig object, so the setState call triggers a new rendering //
            /////////////////////////////////////////////////////////////////////////////////////////
            const newRecordConfig = buildNewRecordConfig();
            newRecordConfig.loading = false;
            newRecordConfig.columns = recordConfig.columns;
            newRecordConfig.rows = [];
            let rowId = 0;
            records.forEach((record) =>
            {
               const row = Object.fromEntries(record.values.entries());
               row.__idForDataGridPro__ = ++rowId;
               newRecordConfig.rows.push(row);
            });

            newRecordConfig.totalRecords = response.totalRecords;
            setRecordConfig(newRecordConfig);
         })();
      }
   }, [needRecords]);

   //////////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle a response from the server - e.g., after starting a backend job, or getting its status/result //
   //////////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (lastProcessResponse)
      {
         setLastProcessResponse(null);
         setRetryMillis(INITIAL_RETRY_MILLIS);

         if (lastProcessResponse instanceof QJobComplete)
         {
            const qJobComplete = lastProcessResponse as QJobComplete;
            setJobUUID(null);
            setNewStep(qJobComplete.nextStep);
            setProcessValues(qJobComplete.values);
            setQJobRunning(null);

            if (activeStep && activeStep.recordListFields)
            {
               setNeedRecords(true);
            }
         }
         else if (lastProcessResponse instanceof QJobStarted)
         {
            const qJobStarted = lastProcessResponse as QJobStarted;
            setJobUUID(qJobStarted.jobUUID);
            setNeedToCheckJobStatus(true);
         }
         else if (lastProcessResponse instanceof QJobRunning)
         {
            const qJobRunning = lastProcessResponse as QJobRunning;
            setQJobRunning(qJobRunning);
            setQJobRunningDate(new Date());
            setNeedToCheckJobStatus(true);
         }
         else if (lastProcessResponse instanceof QJobError)
         {
            const qJobError = lastProcessResponse as QJobError;
            console.log(`Got an error from the backend... ${qJobError.error}`);
            setJobUUID(null);
            setProcessError(qJobError.error);
            setQJobRunning(null);
         }
      }
   }, [lastProcessResponse]);

   /////////////////////////////////////////////////////////////////////////
   // while a backend async job is running, periodically check its status //
   /////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (needToCheckJobStatus)
      {
         setNeedToCheckJobStatus(false);
         if (!processUUID || !jobUUID)
         {
            console.log(`Missing processUUID[${processUUID}] or jobUUID[${jobUUID}], so returning without checking job status`);
            return;
         }

         (async () =>
         {
            setTimeout(async () =>
            {
               try
               {
                  const processResponse = await QClient.getInstance().processJobStatus(
                     processName,
                     processUUID,
                     jobUUID,
                  );
                  setLastProcessResponse(processResponse);
               }
               catch (e)
               {
                  if (e instanceof QException)
                  {
                     const qException = e as QException;
                     const status = Number(qException.status);
                     if (status !== undefined && !Number.isNaN(status) && status >= 500 && status <= 600)
                     {
                        if (retryMillis < RETRY_MAX_MILLIS)
                        {
                           console.log(`500 error, attempting to retry in ${retryMillis + retryMillis} millis`);
                           setRetryMillis(retryMillis * BACKOFF_AMOUNT);
                           setNeedToCheckJobStatus(true);
                           return;
                        }

                        console.log(`Retry millis [${retryMillis}] is greater or equal to the max retry limit [${RETRY_MAX_MILLIS}], giving up...`);
                        setProcessError("Could not connect to server");
                     }
                  }

                  throw (e);
               }
            }, retryMillis);
         })();
      }
   }, [needToCheckJobStatus, retryMillis]);

   //////////////////////////////////////////////////////////////////////////////////////////
   // do the initial load of data for the process - that is, meta data, plus the init step //
   //////////////////////////////////////////////////////////////////////////////////////////
   if (needInitialLoad)
   {
      setNeedInitialLoad(false);
      (async () =>
      {
         const urlSearchParams = new URLSearchParams(location.search);
         let queryStringPairsForInit = [];
         if (urlSearchParams.get("recordIds"))
         {
            queryStringPairsForInit.push("recordsParam=recordIds");
            queryStringPairsForInit.push(`recordIds=${urlSearchParams.get("recordIds")}`);
         }
         else if (urlSearchParams.get("filterJSON"))
         {
            queryStringPairsForInit.push("recordsParam=filterJSON");
            queryStringPairsForInit.push(`filterJSON=${urlSearchParams.get("filterJSON")}`);
         }
         // todo once saved filters exist
         //else if(urlSearchParams.get("filterId")) {
         //   queryStringPairsForInit.push("recordsParam=filterId");
         //   queryStringPairsForInit.push(`filterId=${urlSearchParams.get("filterId")}`);
         // }

         try
         {
            const qInstance = await QClient.getInstance().loadMetaData();
            setQInstance(qInstance);
         }
         catch (e)
         {
            setProcessError("Error loading process definition.");
            return;
         }

         try
         {
            const processMetaData = await QClient.getInstance().loadProcessMetaData(processName);
            setProcessMetaData(processMetaData);
            setSteps(processMetaData.frontendSteps);
            if (processMetaData.tableName)
            {
               try
               {
                  const tableMetaData = await QClient.getInstance().loadTableMetaData(processMetaData.tableName);
                  setTableMetaData(tableMetaData);
               }
               catch (e)
               {
                  setProcessError("Error loading process's table definition.");
                  return;
               }
            }
         }
         catch (e)
         {
            setProcessError("Error loading process definition.");
            return;
         }

         if(defaultProcessValues)
         {
            for(let key in defaultProcessValues)
            {
               queryStringPairsForInit.push(`${key}=${encodeURIComponent(defaultProcessValues[key])}`);
            }
         }

         try
         {
            const processResponse = await QClient.getInstance().processInit(processName, queryStringPairsForInit.join("&"));
            setProcessUUID(processResponse.processUUID);
            setLastProcessResponse(processResponse);
         }
         catch (e)
         {
            setProcessError("Error initializing process.");
         }
      })();
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle the back button - todo - not really done at all                                           //
   // e.g., qqq needs to say when back is or isn't allowed, and we need to hit the backend upon backs. //
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   const handleBack = () =>
   {
      setNewStep(activeStepIndex - 1);
   };

   //////////////////////////////////////////////////////////////////////////////////////////
   // handle user submitting the form - which in qqq means moving forward from any screen. //
   //////////////////////////////////////////////////////////////////////////////////////////
   const handleSubmit = async (values: any, actions: any) =>
   {
      setFormError(null);

      const formData = new FormData();
      Object.keys(values).forEach((key) =>
      {
         formData.append(key, values[key]);
      });

      if (doesStepHaveComponent(activeStep, QComponentType.BULK_EDIT_FORM))
      {
         const bulkEditEnabledFields: string[] = [];
         let fullFieldList = getFullFieldList(activeStep, processValues);
         fullFieldList.forEach((field) =>
         {
            if (!disabledBulkEditFields[field.name])
            {
               bulkEditEnabledFields.push(field.name);
            }
         });

         if (bulkEditEnabledFields.length === 0)
         {
            setFormError("You must edit at least one field to continue.");
            return;
         }
         formData.append("bulkEditEnabledFields", bulkEditEnabledFields.join(","));
      }

      const formDataHeaders = {
         "content-type": "multipart/form-data; boundary=--------------------------320289315924586491558366",
      };

      setProcessValues({});
      setRecords([]);
      setOverrideOnLastStep(null);
      setLastProcessResponse(new QJobRunning({message: "Working..."}));

      setTimeout(async () =>
      {
         const processResponse = await QClient.getInstance().processStep(
            processName,
            processUUID,
            activeStep.name,
            formData,
            formDataHeaders,
         );
         setLastProcessResponse(processResponse);
      });
   };

   const handleCancelClicked = () =>
   {
      const pathParts = location.pathname.split(/\//);
      pathParts.pop();
      const path = pathParts.join("/");
      navigate(path, {replace: true});
   };

   const mainCardStyles: any = {};
   mainCardStyles.minHeight = "calc(100vh - 400px)";
   if (!processError && (qJobRunning || activeStep === null))
   {
      mainCardStyles.background = "none";
      mainCardStyles.boxShadow = "none";
   }

   let nextButtonLabel = "Next";
   let nextButtonIcon = "arrow_forward";
   if (overrideOnLastStep !== null)
   {
      if (overrideOnLastStep)
      {
         nextButtonLabel = "Submit";
         nextButtonIcon = "check";
      }
   }
   else if (onLastStep)
   {
      nextButtonLabel = "Submit";
      nextButtonIcon = "check";
   }

   return (
      <BaseLayout>
         <MDBox py={3} mb={20}>
            <Grid container justifyContent="center" alignItems="center" sx={{height: "100%", mt: 8}}>
               <Grid item xs={12} lg={10} xl={8}>
                  <Formik
                     enableReinitialize
                     initialValues={initialValues}
                     validationSchema={validationScheme}
                     validation={validationFunction}
                     onSubmit={handleSubmit}
                  >
                     {({
                        values, errors, touched, isSubmitting, setFieldValue,
                     }) => (
                        <Form id={formId} autoComplete="off">
                           <Card sx={mainCardStyles}>
                              <MDBox mx={2} mt={-3}>
                                 <Stepper activeStep={activeStepIndex} alternativeLabel>
                                    {steps.map((step) => (
                                       <Step key={step.name}>
                                          <StepLabel>{step.label}</StepLabel>
                                       </Step>
                                    ))}
                                 </Stepper>
                              </MDBox>

                              <MDBox p={3}>
                                 <MDBox>
                                    {/***************************************************************************
                                     ** step content - e.g., the appropriate form or other screen for the step **
                                     ***************************************************************************/}
                                    {getDynamicStepContent(
                                       activeStepIndex,
                                       activeStep,
                                       {
                                          values,
                                          touched,
                                          formFields,
                                          errors,
                                       },
                                       processError,
                                       processValues,
                                       recordConfig,
                                       setFieldValue,
                                    )}
                                    {/********************************
                                     ** back &| next/submit buttons **
                                     ********************************/}
                                    <MDBox mt={6} width="100%" display="flex" justifyContent="space-between">
                                       {true || activeStepIndex === 0 ? (
                                          <MDBox />
                                       ) : (
                                          <MDButton variant="gradient" color="light" onClick={handleBack}>back</MDButton>
                                       )}
                                       {processError || qJobRunning || !activeStep ? (
                                          <MDBox />
                                       ) : (
                                          <>
                                             {formError && (
                                                <MDTypography component="div" variant="caption" color="error" fontWeight="regular" align="right" fullWidth>
                                                   {formError}
                                                </MDTypography>
                                             )}
                                             {
                                                noMoreSteps && <QCancelButton onClickHandler={handleCancelClicked} label="Return" iconName="arrow_back" disabled={isSubmitting} />
                                             }
                                             {
                                                !noMoreSteps && (
                                                   <MDBox component="div" py={3}>
                                                      <Grid container justifyContent="flex-end" spacing={3}>
                                                         <QCancelButton onClickHandler={handleCancelClicked} disabled={isSubmitting} />
                                                         <QSubmitButton label={nextButtonLabel} iconName={nextButtonIcon} disabled={isSubmitting} />
                                                      </Grid>
                                                   </MDBox>
                                                )
                                             }
                                          </>
                                       )}
                                    </MDBox>
                                 </MDBox>
                              </MDBox>
                           </Card>
                        </Form>
                     )}
                  </Formik>
               </Grid>
            </Grid>
         </MDBox>
      </BaseLayout>
   );
}

ProcessRun.defaultProps = {
   process: null,
   defaultProcessValues: {}
};

export default ProcessRun;
