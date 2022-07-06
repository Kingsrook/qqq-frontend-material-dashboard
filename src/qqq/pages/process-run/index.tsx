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

import { useReducer, useState } from "react";

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

// ProcessRun page components
import UserInfo from "layouts/pages/users/new-user/components/UserInfo";
import Address from "layouts/pages/users/new-user/components/Address";
import Socials from "layouts/pages/users/new-user/components/Socials";
import Profile from "layouts/pages/users/new-user/components/Profile";

// ProcessRun layout schemas for form and form fields
import * as Yup from "yup";
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import { QFrontendStepMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import { useParams } from "react-router-dom";
import QDynamicForm from "../../components/QDynamicForm";

function getDynamicStepContent(stepIndex: number, stepParam: any, formData: any): JSX.Element {
  const { formFields, values, errors, touched } = formData;
  const { step } = stepParam;
  // console.log(`in getDynamicStepContent: step label ${step?.label}`);

  if (!Object.keys(formFields).length) {
    console.log("in getDynamicStepContent.  No fields yet, so returning 'loading'");
    return <div>Loading...</div>;
  }

  return <QDynamicForm formData={formData} step={step} />;
}

const qController = new QController("");
console.log(qController);

function ProcessRun(): JSX.Element {
  const { processName } = useParams();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(null as QFrontendStepMetaData);
  const [steps, setSteps] = useState([] as QFrontendStepMetaData[]);
  const [loadCounter, setLoadCounter] = useState(0);
  const [processMetaData, setProcessMetaData] = useState(null);
  const [formId, setFormId] = useState("");
  const [formFields, setFormFields] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [validations, setValidations] = useState({});
  // const currentValidation = validations[activeStepIndex];
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const isLastStep = activeStepIndex === steps.length - 1;

  console.log("In the function");

  const updateActiveStep = (newIndex: number, steps: QFrontendStepMetaData[]) => {
    console.log(`Steps are: ${steps}`);
    console.log(`Setting step to ${newIndex}`);
    setActiveStepIndex(newIndex);

    if (steps) {
      const activeStep = steps[newIndex];
      setActiveStep(activeStep);
      setFormId(activeStep.name);

      const formFields: any = {};
      const initialValues: any = {};
      const validations: any = {};

      activeStep.formFields.forEach((field) => {
        formFields[field.name] = {
          name: field.name,
          label: field.label,
          type: "text", // todo better
          // todo invalidMsg: "Zipcode is not valid (e.g. 70000).",
        };

        // todo - not working - also, needs real value.
        initialValues[field.name] = "Hi";

        // todo - all this based on type and other metadata.
        //  see src/layouts/pages/users/new-user/schemas/validations.ts
        validations[field.name] = Yup.string().required(`${field.label} is required.`);
        // validations[field.name] = Yup.string().optional();
      });

      setFormFields(formFields);
      setInitialValues(initialValues);
      setValidations(Yup.object().shape(validations));
      console.log(`in updateActiveStep: formFields ${JSON.stringify(formFields)}`);
      console.log(`in updateActiveStep: initialValues ${JSON.stringify(initialValues)}`);
    }
  };

  const doInitialLoad = async () => {
    console.log("Starting doInitialLoad");
    const processMetaData = await qController.loadProcessMetaData(processName);
    console.log(processMetaData);
    setProcessMetaData(processMetaData);
    setSteps(processMetaData.frontendSteps);
    updateActiveStep(0, processMetaData.frontendSteps);
    console.log("Done with doInitialLoad");
  };

  if (loadCounter === 0) {
    setLoadCounter(1);
    doInitialLoad();
  }

  const sleep = (ms: any) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  const handleBack = () => updateActiveStep(activeStepIndex - 1, processMetaData.frontendSteps);

  const submitForm = async (values: any, actions: any) => {
    await sleep(1000);

    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));

    actions.setSubmitting(false);
    actions.resetForm();

    updateActiveStep(0, processMetaData.frontendSteps);
  };

  const handleSubmit = (values: any, actions: any) => {
    submitForm(values, actions);

    // if (isLastStep) {
    //   submitForm(values, actions);
    // } else {
    //   updateActiveStep(activeStepIndex + 1, processMetaData.frontendSteps);
    //   actions.setTouched({});
    //   actions.setSubmitting(false);
    // }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} mb={20} height="65vh">
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          <Grid item xs={12} lg={8}>
            <Formik
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
                          { step: activeStep },
                          {
                            values,
                            touched,
                            formFields,
                            errors,
                          }
                        )}
                        {/********************************
                         ** back &| next/submit buttons **
                         ********************************/}
                        <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                          {activeStepIndex === 0 ? (
                            <MDBox />
                          ) : (
                            <MDButton variant="gradient" color="light" onClick={handleBack}>
                              back
                            </MDButton>
                          )}
                          <MDButton
                            disabled={isSubmitting}
                            type="submit"
                            variant="gradient"
                            color="dark"
                          >
                            {isLastStep ? "submit" : "next"}
                          </MDButton>
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
