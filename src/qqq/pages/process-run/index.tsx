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

import {QComponentType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QComponentType";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFrontendComponent} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendComponent";
import {QFrontendStepMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QJobRunning} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobRunning";
import {QJobStarted} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobStarted";
import {CircularProgress, TablePagination} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import {DataGridPro, GridColDef} from "@mui/x-data-grid-pro";
import FormData from "form-data";
import {Form, Formik, useFormikContext} from "formik";
import React, {useEffect, useState, Fragment} from "react";
import {useLocation, useParams} from "react-router-dom";
import * as Yup from "yup";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import BaseLayout from "qqq/components/BaseLayout";
import DynamicFormUtils from "qqq/components/QDynamicForm/utils/DynamicFormUtils";
import QClient from "qqq/utils/QClient";
import MDTypography from "../../../components/MDTypography";
import QDynamicForm from "../../components/QDynamicForm";

interface Props
{
   process?: QProcessMetaData;
}

function ProcessRun({process}: Props): JSX.Element
{
   const processNameParam = useParams().processName;
   const processName = process === null ? processNameParam : process.name;

   ///////////////////
   // process state //
   ///////////////////
   const [processUUID, setProcessUUID] = useState(null as string);
   const [jobUUID, setJobUUID] = useState(null as string);
   const [qJobRunning, setQJobRunning] = useState(null as QJobRunning);
   const [qJobRunningDate, setQJobRunningDate] = useState(null as Date);
   const [activeStepIndex, setActiveStepIndex] = useState(0);
   const [activeStep, setActiveStep] = useState(null as QFrontendStepMetaData);
   const [newStep, setNewStep] = useState(null);
   const [steps, setSteps] = useState([] as QFrontendStepMetaData[]);
   const [needInitialLoad, setNeedInitialLoad] = useState(true);
   const [processMetaData, setProcessMetaData] = useState(null);
   const [processValues, setProcessValues] = useState({} as any);
   const [processError, setProcessError] = useState(null as string);
   const [needToCheckJobStatus, setNeedToCheckJobStatus] = useState(false);
   const [lastProcessResponse, setLastProcessResponse] = useState(
      null as QJobStarted | QJobComplete | QJobError | QJobRunning,
   );
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

   //////////////////////////////
   // state for bulk edit form //
   //////////////////////////////
   const [disabledBulkEditFields, setDisabledBulkEditFields] = useState({} as any);

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
         return <span>∅</span>;
      }

      if (typeof value === "string")
      {
         return (
            <>
               {value.split(/\n/).map((value: string, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={index}>
                     <span>{value}</span>
                     <br />
                  </Fragment>
               ))}
            </>
         );
      }

      return (<span>{value}</span>);
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
   ): JSX.Element =>
   {
      if (processError)
      {
         return (
            <>
               <MDTypography color="error" variant="h5">
                  Error
               </MDTypography>
               <MDTypography color="body" variant="button">
                  {processError}
               </MDTypography>
            </>
         );
      }

      if (qJobRunning)
      {
         return (
            <>
               <MDTypography variant="h5">
                  {" "}
                  Working
               </MDTypography>
               <Grid container>
                  <Grid item padding={1}>
                     <CircularProgress color="info" />
                  </Grid>
                  <Grid item>
                     <MDTypography color="body" variant="button">
                        {qJobRunning?.message}
                        <br />
                        {qJobRunning.current && qJobRunning.total && (
                           <div>{`${qJobRunning.current.toLocaleString()} of ${qJobRunning.total.toLocaleString()}`}</div>
                        )}
                        <i>
                           {`Updated at ${qJobRunningDate.toLocaleTimeString()}`}
                        </i>
                     </MDTypography>
                  </Grid>
               </Grid>
            </>
         );
      }

      if (step === null)
      {
         console.log("in getDynamicStepContent.  No step yet, so returning 'loading'");
         return <div>Loading...</div>;
      }

      return (
         <>
            <MDTypography variation="h5" fontWeight="bold">{step?.label}</MDTypography>
            {step.components && (
               step.components.map((component: QFrontendComponent, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index}>
                     {
                        component.type === QComponentType.HELP_TEXT && (
                           <MDTypography variant="button" color="info">
                              {component.values.text}
                           </MDTypography>
                        )
                     }
                  </div>
               )))}
            {step.formFields && (
               <QDynamicForm
                  formData={formData}
                  bulkEditMode={doesStepHaveComponent(activeStep, QComponentType.BULK_EDIT_FORM)}
                  bulkEditSwitchChangeHandler={bulkEditSwitchChanged}
               />
            )}
            {step.viewFields && (
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
            )}
            {(step.recordListFields && recordConfig.columns) && (
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
            )}
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

      // console.log(`Steps are: ${steps}`);
      // console.log(`Setting step to ${newStep}`);
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
      }
      setActiveStepIndex(newIndex);

      if (steps)
      {
         const activeStep = steps[newIndex];
         setActiveStep(activeStep);
         setFormId(activeStep.name);

         ///////////////////////////////////////////////////
         // if this step has form fields, set up the form //
         ///////////////////////////////////////////////////
         if (activeStep.formFields)
         {
            const {dynamicFormFields, formValidations} = DynamicFormUtils.getFormData(
               activeStep.formFields,
            );

            const initialValues: any = {};
            activeStep.formFields.forEach((field) =>
            {
               initialValues[field.name] = processValues[field.name];
            });

            ////////////////////////////////////////////////////
            // disable all fields if this is a bulk edit form //
            ////////////////////////////////////////////////////
            if (doesStepHaveComponent(activeStep, QComponentType.BULK_EDIT_FORM))
            {
               const newDisabledBulkEditFields: any = {};
               activeStep.formFields.forEach((field) =>
               {
                  newDisabledBulkEditFields[field.name] = true;
                  dynamicFormFields[field.name].isRequired = false;
                  formValidations[field.name] = null;
               });
               setDisabledBulkEditFields(newDisabledBulkEditFields);
            }

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
      if (activeStep && activeStep.formFields)
      {
         console.log("In useEffect for disabledBulkEditFields");
         console.log(disabledBulkEditFields);

         const newDynamicFormFields: any = {};
         const newFormValidations: any = {};
         activeStep.formFields.forEach((field) =>
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
         setQJobRunning(null);

         if (lastProcessResponse instanceof QJobComplete)
         {
            const qJobComplete = lastProcessResponse as QJobComplete;
            console.log("Setting new step.");
            setJobUUID(null);
            setNewStep(qJobComplete.nextStep);
            setProcessValues(qJobComplete.values);
            // console.log(`Updated process values: ${JSON.stringify(qJobComplete.values)}`);
         }
         else if (lastProcessResponse instanceof QJobStarted)
         {
            const qJobStarted = lastProcessResponse as QJobStarted;
            setJobUUID(qJobStarted.jobUUID);
            console.log("setting need to check because started");
            setNeedToCheckJobStatus(true);
         }
         else if (lastProcessResponse instanceof QJobRunning)
         {
            const qJobRunning = lastProcessResponse as QJobRunning;
            setQJobRunning(qJobRunning);
            setQJobRunningDate(new Date());
            console.log("setting need to check because running");
            setNeedToCheckJobStatus(true);
         }
         else if (lastProcessResponse instanceof QJobError)
         {
            const qJobError = lastProcessResponse as QJobError;
            console.log(`Got an error from the backend... ${qJobError.error}`);
            setJobUUID(null);
            setProcessError(qJobError.error);
         }
      }
   }, [lastProcessResponse]);

   /////////////////////////////////////////////////////////////////////////
   // while a backend async job is running, periodically check its status //
   /////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      console.log("In effect for checking status");
      if (needToCheckJobStatus)
      {
         console.log("  and the bool was true");
         setNeedToCheckJobStatus(false);
         if (jobUUID)
         {
            (async () =>
            {
               setTimeout(async () =>
               {
                  const processResponse = await QClient.getInstance().processJobStatus(
                     processName,
                     processUUID,
                     jobUUID,
                  );
                  setLastProcessResponse(processResponse);
               }, 1500);
            })();
         }
      }
   }, [needToCheckJobStatus]);

   //////////////////////////////////////////////////////////////////////////////////////////
   // do the initial load of data for the process - that is, meta data, plus the init step //
   //////////////////////////////////////////////////////////////////////////////////////////
   if (needInitialLoad)
   {
      setNeedInitialLoad(false);
      (async () =>
      {
         const {search} = useLocation();
         const urlSearchParams = new URLSearchParams(search);
         let queryStringForInit = null;
         if (urlSearchParams.get("recordIds"))
         {
            queryStringForInit = `recordsParam=recordIds&recordIds=${urlSearchParams.get(
               "recordIds",
            )}`;
         }
         else if (urlSearchParams.get("filterJSON"))
         {
            queryStringForInit = `recordsParam=filterJSON&filterJSON=${urlSearchParams.get(
               "filterJSON",
            )}`;
         }
         // todo once saved filters exist
         //else if(urlSearchParams.get("filterId")) {
         //   queryStringForInit = `recordsParam=filterId&filterId=${urlSearchParams.get("filterId")}`
         // }

         console.log(`@dk: Query String for init: ${queryStringForInit}`);

         try
         {
            const processMetaData = await QClient.getInstance().loadProcessMetaData(processName);
            setProcessMetaData(processMetaData);
            setSteps(processMetaData.frontendSteps);
         }
         catch (e)
         {
            setProcessError("Error loading process definition.");
            return;
         }

         try
         {
            const processResponse = await QClient.getInstance().processInit(processName, queryStringForInit);
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
         activeStep.formFields.forEach((field) =>
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

      setLastProcessResponse(new QJobRunning({message: "Working..."}));

      setTimeout(async () =>
      {
         console.log("Calling processStep...");
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

   return (
      <BaseLayout>
         <MDBox py={3} mb={20}>
            <Grid
               container
               justifyContent="center"
               alignItems="center"
               sx={{height: "100%", mt: 8}}
            >
               <Grid item xs={12} lg={8}>
                  <Formik
                     enableReinitialize
                     initialValues={initialValues}
                     validationSchema={validationScheme}
                     validation={validationFunction}
                     onSubmit={handleSubmit}
                  >
                     {({
                        values, errors, touched, isSubmitting,
                     }) => (
                        <Form id={formId} autoComplete="off">
                           <Card sx={{minHeight: "calc(100vh - 400px)"}}>
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
                                    )}
                                    {/********************************
                                     ** back &| next/submit buttons **
                                     ********************************/}
                                    <MDBox
                                       mt={2}
                                       width="100%"
                                       display="flex"
                                       justifyContent="space-between"
                                    >
                                       {true || activeStepIndex === 0 ? (
                                          <MDBox />
                                       ) : (
                                          <MDButton
                                             variant="gradient"
                                             color="light"
                                             onClick={handleBack}
                                          >
                                             back
                                          </MDButton>
                                       )}
                                       {noMoreSteps || processError || qJobRunning ? (
                                          <MDBox />
                                       ) : (
                                          <>
                                             {formError && (
                                                <MDTypography component="div" variant="caption" color="error" fontWeight="regular" align="right" fullWidth>
                                                   {formError}
                                                </MDTypography>
                                             )}
                                             <MDButton
                                                disabled={isSubmitting}
                                                type="submit"
                                                variant="gradient"
                                                color="dark"
                                             >
                                                {onLastStep ? "submit" : "next"}
                                             </MDButton>
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
};

export default ProcessRun;
