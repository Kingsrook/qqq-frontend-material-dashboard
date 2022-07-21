/**
 =========================================================
 * Material Dashboard 2 PRO React TS - v1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import {useEffect, useState} from "react";

// formik components
import {Formik, Form} from "formik";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// ProcessRun layout schemas for form and form fields
import * as Yup from "yup";
import {QController} from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFrontendStepMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import {useLocation, useParams} from "react-router-dom";
import DynamicFormUtils from "qqq/components/QDynamicForm/utils/DynamicFormUtils";
import {QJobStarted} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobStarted";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QJobRunning} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobRunning";
import {
   DataGridPro, GridColDef, GridRowParams, GridRowsProp,
} from "@mui/x-data-grid-pro";
import QDynamicForm from "../../components/QDynamicForm";
import MDTypography from "../../../components/MDTypography";

function getDynamicStepContent(
   stepIndex: number,
   step: any,
   formData: any,
   processError: string,
   processValues: any,
   recordConfig: any,
): JSX.Element
{
   const {
      formFields, values, errors, touched,
   } = formData;
   // console.log(`in getDynamicStepContent: step label ${step?.label}`);

   if (processError)
   {
      return (
         <>
            <MDTypography color="error" variant="h3">
               Error
            </MDTypography>
            <div>{processError}</div>
         </>
      );
   }

   if (step === null)
   {
      console.log("in getDynamicStepContent.  No step yet, so returning 'loading'");
      return <div>Loading...</div>;
   }

   console.log(`in getDynamicStepContent. the step looks like: ${JSON.stringify(step)}`);

   return (
      <>
         {step.formFields && <QDynamicForm formData={formData} formLabel={step.label} />}
         {step.viewFields && (
            <div>
               {step.viewFields.map((field: QFieldMetaData) => (
                  <div key={field.name}>
                     <b>
                        {field.label}
                        :
                     </b>
                     {" "}
                     {processValues[field.name]}
                  </div>
               ))}
            </div>
         )}
         {step.recordListFields && (
            <div>
               <b>Records</b>
               {" "}
               <br />
               <MDBox height="100%">
                  <DataGridPro
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
                     paginationMode="server"
                     pagination
                     density="compact"
                     loading={recordConfig.loading}
                  />
               </MDBox>
            </div>
         )}
      </>
   );
}

function trace(name: string, isComponent: boolean = false)
{
   if (isComponent)
   {
      console.log(`COMPONENT: ${name}`);
   }
   else
   {
      console.log(`  function: ${name}`);
   }
}

const qController = new QController("");

function ProcessRun(): JSX.Element
{
   const {processName} = useParams();
   const [processUUID, setProcessUUID] = useState(null as string);
   const [jobUUID, setJobUUID] = useState(null as string);
   const [activeStepIndex, setActiveStepIndex] = useState(0);
   const [activeStep, setActiveStep] = useState(null as QFrontendStepMetaData);
   const [newStep, setNewStep] = useState(null);
   const [steps, setSteps] = useState([] as QFrontendStepMetaData[]);
   const [needInitialLoad, setNeedInitialLoad] = useState(true);
   const [processMetaData, setProcessMetaData] = useState(null);
   const [processValues, setProcessValues] = useState({} as any);
   const [lastProcessResponse, setLastProcessResponse] = useState(
      null as QJobStarted | QJobComplete | QJobError | QJobRunning,
   );
   const [formId, setFormId] = useState("");
   const [formFields, setFormFields] = useState({});
   const [initialValues, setInitialValues] = useState({});
   const [validationScheme, setValidationScheme] = useState(null);
   const [validationFunction, setValidationFunction] = useState(null);
   const [needToCheckJobStatus, setNeedToCheckJobStatus] = useState(false);
   const [needRecords, setNeedRecords] = useState(false);
   const [processError, setProcessError] = useState(null as string);
   const [recordConfig, setRecordConfig] = useState({} as any);
   const onLastStep = activeStepIndex === steps.length - 2;
   const noMoreSteps = activeStepIndex === steps.length - 1;

   trace("ProcessRun", true);

   function buildNewRecordConfig()
   {
      const newRecordConfig = {} as any;
      newRecordConfig.pageNo = 1;
      newRecordConfig.rowsPerPage = 20;
      newRecordConfig.columns = [] as GridColDef[];
      newRecordConfig.rows = [];
      newRecordConfig.totalRecords = 0;
      newRecordConfig.handleRowsPerPageChange = null;
      newRecordConfig.handlePageChange = null;
      newRecordConfig.handleRowClick = null;
      newRecordConfig.loading = true;
      return (newRecordConfig);
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle moving to another step in the process - e.g., after the backend told us what screen to show next. //
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      trace("updateActiveStep");

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

         ////////////////////////////////////////////////////////////////////////////////////////////
         // if there are fields to load, build a record config, and set the needRecords state flag //
         ////////////////////////////////////////////////////////////////////////////////////////////
         if (activeStep.recordListFields)
         {
            const newRecordConfig = buildNewRecordConfig();
            activeStep.recordListFields.forEach((field) =>
            {
               newRecordConfig.columns.push({field: field.name, headerName: field.label, width: 200});
            });
            setRecordConfig(newRecordConfig);
            setNeedRecords(true);
         }
      }
   }, [newStep]);

   // when we need to load records, do so, async
   useEffect(() =>
   {
      if (needRecords)
      {
         setNeedRecords(false);
         (async () =>
         {
            const records = await qController.processRecords(
               processName,
               processUUID,
               recordConfig.rowsPerPage * (recordConfig.pageNo - 1),
               recordConfig.rowsPerPage,
            );

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
               if (!row.id)
               {
                  row.id = ++rowId;
               }
               newRecordConfig.rows.push(row);
            });
            // todo count?
            newRecordConfig.totalRecords = records.length;
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
         trace("handleProcessResponse");
         setLastProcessResponse(null);
         if (lastProcessResponse instanceof QJobComplete)
         {
            const qJobComplete = lastProcessResponse as QJobComplete;
            console.log("Setting new step.");
            setNewStep(qJobComplete.nextStep);
            setProcessValues(qJobComplete.values);
            // console.log(`Updated process values: ${JSON.stringify(qJobComplete.values)}`);
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
            setNeedToCheckJobStatus(true);
         }
         else if (lastProcessResponse instanceof QJobError)
         {
            const qJobError = lastProcessResponse as QJobError;
            console.log(`Got an error from the backend... ${qJobError.error}`);
            setProcessError(qJobError.error);
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
         trace("checkJobStatus");
         setNeedToCheckJobStatus(false);
         (async () =>
         {
            setTimeout(async () =>
            {
               const processResponse = await qController.processJobStatus(
                  processName,
                  processUUID,
                  jobUUID,
               );
               setLastProcessResponse(processResponse);
            }, 1500);
         })();
      }
   }, [needToCheckJobStatus]);

   //////////////////////////////////////////////////////////////////////////////////////////
   // do the initial load of data for the process - that is, meta data, plus the init step //
   //////////////////////////////////////////////////////////////////////////////////////////
   if (needInitialLoad)
   {
      trace("initialLoad");
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

         const processMetaData = await qController.loadProcessMetaData(processName);
         // console.log(processMetaData);
         setProcessMetaData(processMetaData);
         setSteps(processMetaData.frontendSteps);

         const processResponse = await qController.processInit(processName, queryStringForInit);
         setProcessUUID(processResponse.processUUID);
         setLastProcessResponse(processResponse);
      // console.log(processResponse);
      })();
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle the back button - todo - not really done at all                                           //
   // e.g., qqq needs to say when back is or isn't allowed, and we need to hit the backend upon backs. //
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   const handleBack = () =>
   {
      trace("handleBack");
      setNewStep(activeStepIndex - 1);
   };

   //////////////////////////////////////////////////////////////////////////////////////////
   // handle user submitting the form - which in qqq means moving forward from any screen. //
   //////////////////////////////////////////////////////////////////////////////////////////
   const handleSubmit = async (values: any, actions: any) =>
   {
      trace("handleSubmit");

      // todo - post?
      let queryString = "";
      Object.keys(values).forEach((key) =>
      {
         queryString += `${key}=${encodeURIComponent(values[key])}&`;
      });

      actions.setSubmitting(false);
      actions.resetForm();

      const processResponse = await qController.processStep(
         processName,
         processUUID,
         activeStep.name,
         queryString,
      );
      setLastProcessResponse(processResponse);
   };

   return (
      <DashboardLayout>
         <DashboardNavbar />
         <MDBox py={3} mb={20} height="65vh">
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
                           <Card sx={{height: "100%"}}>
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
                                       {noMoreSteps || processError ? (
                                          <MDBox />
                                       ) : (
                                          <MDButton
                                             disabled={isSubmitting}
                                             type="submit"
                                             variant="gradient"
                                             color="dark"
                                          >
                                             {onLastStep ? "submit" : "next"}
                                          </MDButton>
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
         <Footer />
      </DashboardLayout>
   );
}

export default ProcessRun;
