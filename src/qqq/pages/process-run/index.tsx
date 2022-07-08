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

import { useEffect, useReducer, useState } from "react";

// formik components
import { Formik, Form } from "formik";

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
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import { QFrontendStepMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import { useParams } from "react-router-dom";
import DynamicFormUtils from "qqq/components/QDynamicForm/utils/DynamicFormUtils";
import { QJobStarted } from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobStarted";
import { QJobComplete } from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import { QJobError } from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import { QJobRunning } from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobRunning";
import QDynamicForm from "../../components/QDynamicForm";
import MDTypography from "../../../components/MDTypography";

function getDynamicStepContent(
  stepIndex: number,
  step: any,
  formData: any,
  processError: string
): JSX.Element {
  const { formFields, values, errors, touched } = formData;
  // console.log(`in getDynamicStepContent: step label ${step?.label}`);

  if (!Object.keys(formFields).length) {
    // console.log("in getDynamicStepContent.  No fields yet, so returning 'loading'");
    return <div>Loading...</div>;
  }

  if (processError) {
    return (
      <>
        <MDTypography color="error" variant="h3">
          Error
        </MDTypography>
        <div>{processError}</div>
      </>
    );
  }

  return <QDynamicForm formData={formData} formLabel={step.label} />;
}

function trace(name: string, isComponent: boolean = false) {
  if (isComponent) {
    console.log(`COMPONENT: ${name}`);
  } else {
    console.log(`  function: ${name}`);
  }
}

const qController = new QController("");

function ProcessRun(): JSX.Element {
  const { processName } = useParams();
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
    null as QJobStarted | QJobComplete | QJobError | QJobRunning
  );
  const [formId, setFormId] = useState("");
  const [formFields, setFormFields] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [validations, setValidations] = useState({});
  const [needToCheckJobStatus, setNeedToCheckJobStatus] = useState(false);
  const [processError, setProcessError] = useState(null as string);
  const onLastStep = activeStepIndex === steps.length - 2;
  const noMoreSteps = activeStepIndex === steps.length - 1;

  trace("ProcessRun", true);

  useEffect(() => {
    trace("updateActiveStep");

    if (!processMetaData) {
      console.log("No process meta data yet, so returning early");
      return;
    }

    // console.log(`Steps are: ${steps}`);
    // console.log(`Setting step to ${newStep}`);
    let newIndex = null;
    if (typeof newStep === "number") {
      newIndex = newStep as number;
    } else if (typeof newStep === "string") {
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].name === newStep) {
          newIndex = i;
          break;
        }
      }
    }
    if (newIndex === null) {
      setProcessError(`Unknown process step ${newStep}.`);
    }
    setActiveStepIndex(newIndex);

    if (steps) {
      const activeStep = steps[newIndex];
      setActiveStep(activeStep);
      setFormId(activeStep.name);

      const initialValues: any = {};
      activeStep.formFields.forEach((field) => {
        initialValues[field.name] = processValues[field.name];
      });

      const { dynamicFormFields, formValidations } = DynamicFormUtils.getFormData(
        activeStep.formFields
      );

      setFormFields(dynamicFormFields);
      setInitialValues(initialValues);
      setValidations(Yup.object().shape(formValidations));
      // console.log(`in updateActiveStep: formFields ${JSON.stringify(dynamicFormFields)}`);
      // console.log(`in updateActiveStep: initialValues ${JSON.stringify(initialValues)}`);
    }
  }, [newStep]);

  useEffect(() => {
    if (lastProcessResponse) {
      trace("handleProcessResponse");
      setLastProcessResponse(null);
      if (lastProcessResponse instanceof QJobComplete) {
        const qJobComplete = lastProcessResponse as QJobComplete;
        console.log("Setting new step.");
        setNewStep(qJobComplete.nextStep);
        setProcessValues(qJobComplete.values);
        // console.log(`Updated process values: ${JSON.stringify(qJobComplete.values)}`);
      } else if (lastProcessResponse instanceof QJobStarted) {
        const qJobStarted = lastProcessResponse as QJobStarted;
        setJobUUID(qJobStarted.jobUUID);
        setNeedToCheckJobStatus(true);
      } else if (lastProcessResponse instanceof QJobRunning) {
        const qJobRunning = lastProcessResponse as QJobRunning;
        setNeedToCheckJobStatus(true);
      } else if (lastProcessResponse instanceof QJobError) {
        const qJobError = lastProcessResponse as QJobError;
        console.log(`Got an error from the backend... ${qJobError.error}`);
        setProcessError(qJobError.error);
      }
    }
  }, [lastProcessResponse]);

  useEffect(() => {
    if (needToCheckJobStatus) {
      trace("checkJobStatus");
      setNeedToCheckJobStatus(false);
      (async () => {
        const processResponse = await qController.processJobStatus(
          processName,
          processUUID,
          jobUUID
        );
        setLastProcessResponse(processResponse);
      })();
    }
  }, [needToCheckJobStatus]);

  if (needInitialLoad) {
    trace("initialLoad");
    setNeedInitialLoad(false);
    (async () => {
      const processMetaData = await qController.loadProcessMetaData(processName);
      // console.log(processMetaData);
      setProcessMetaData(processMetaData);
      setSteps(processMetaData.frontendSteps);

      const processResponse = await qController.processInit(processName);
      setProcessUUID(processResponse.processUUID);
      setLastProcessResponse(processResponse);
      // console.log(processResponse);
    })();
  }

  const handleBack = () => {
    trace("handleBack");
    setNewStep(activeStepIndex - 1);
  };

  const handleSubmit = async (values: any, actions: any) => {
    trace("handleSubmit");
    // eslint-disable-next-line no-alert
    // alert(JSON.stringify(values, null, 2));

    let queryString = "";
    Object.keys(values).forEach((key) => {
      queryString += `${key}=${encodeURIComponent(values[key])}&`;
    });
    // eslint-disable-next-line no-alert
    // alert(queryString);

    actions.setSubmitting(false);
    actions.resetForm();

    const processResponse = await qController.processStep(
      processName,
      processUUID,
      activeStep.name,
      queryString
    );
    setLastProcessResponse(processResponse);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} mb={20} height="65vh">
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          <Grid item xs={12} lg={8}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validations}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form id={formId} autoComplete="off">
                  <Card sx={{ height: "100%" }}>
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
                          processError
                        )}
                        {/********************************
                         ** back &| next/submit buttons **
                         ********************************/}
                        <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                          {true || activeStepIndex === 0 ? (
                            <MDBox />
                          ) : (
                            <MDButton variant="gradient" color="light" onClick={handleBack}>
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
