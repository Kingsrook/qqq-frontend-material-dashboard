// react components
import { useParams } from "react-router-dom";
import React, { useReducer, useState } from "react";

// misc components
import * as Yup from "yup";
import { Form, Formik } from "formik";

// qqq components
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import DynamicFormUtils from "qqq/components/QDynamicForm/utils/DynamicFormUtils";
import QDynamicForm from "qqq/components/QDynamicForm";
import { QFieldMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Alert } from "@mui/material";

// Material Dashboard 2 PRO React TS components
import MDAlert from "components/MDAlert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "../../../components/MDButton";

// Declaring props types for EntityForm
interface Props {
  id?: string;
}

function EntityForm({ id }: Props): JSX.Element {
  const qController = new QController("");
  const { tableName } = useParams();

  const [validations, setValidations] = useState({});
  const [initialValues, setInitialValues] = useState({} as { [key: string]: string });
  const [formFields, setFormFields] = useState({});
  const [alertContent, setAlertContent] = useState("");

  const [asyncLoadInited, setAsyncLoadInited] = useState(false);
  const [formValues, setFormValues] = useState({} as { [key: string]: string });
  const [tableMetaData, setTableMetaData] = useState(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function getDynamicStepContent(formData: any): JSX.Element {
    const { formFields, values, errors, touched } = formData;

    if (!Object.keys(formFields).length) {
      return <div>Loading...</div>;
    }

    return <QDynamicForm formData={formData} primaryKeyId={tableMetaData.primaryKeyField} />;
  }

  if (!asyncLoadInited) {
    setAsyncLoadInited(true);
    (async () => {
      const tableMetaData = await qController.loadTableMetaData(tableName);
      setTableMetaData(tableMetaData);

      const fieldArray = [] as QFieldMetaData[];
      const sortedKeys = [...tableMetaData.fields.keys()].sort();
      sortedKeys.forEach((key) => {
        const fieldMetaData = tableMetaData.fields.get(key);
        fieldArray.push(fieldMetaData);
      });

      if (id !== null) {
        const record = await qController.get(tableName, id);

        tableMetaData.fields.forEach((fieldMetaData, key) => {
          initialValues[key] = record.values.get(key);
        });

        setFormValues(formValues);
      }

      const { dynamicFormFields, formValidations } = DynamicFormUtils.getFormData(fieldArray);
      setInitialValues(initialValues);
      setFormFields(dynamicFormFields);
      setValidations(Yup.object().shape(formValidations));

      forceUpdate();
    })();
  }

  const handleSubmit = async (values: any, actions: any) => {
    actions.setSubmitting(true);
    await (async () => {
      if (id !== null) {
        await qController
          .update(tableName, id, values)
          .then((record) => {
            window.location.href = `/${tableName}/${record.values.get(
              tableMetaData.primaryKeyField
            )}`;
          })
          .catch((error) => {
            setAlertContent(error.response.data.error);
          });
      } else {
        await qController
          .create(tableName, values)
          .then((record) => {
            window.location.href = `/${tableName}/${record.values.get(
              tableMetaData.primaryKeyField
            )}`;
          })
          .catch((error) => {
            setAlertContent(error.response.data.error);
          });
      }
    })();
  };

  const formTitle =
    id != null ? `Edit ${tableMetaData?.label} (${id})` : `Create New ${tableMetaData?.label}`;
  const formId =
    id != null ? `edit-${tableMetaData?.label}-form` : `create-${tableMetaData?.label}-form`;

  return (
    <MDBox mb={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {alertContent ? (
            <MDBox mb={3}>
              <Alert severity="error">{alertContent}</Alert>
            </MDBox>
          ) : (
            ""
          )}
          <Card id="edit-form-container" sx={{ overflow: "visible" }}>
            <MDBox p={3}>
              <MDTypography variant="h5">{formTitle}</MDTypography>
            </MDBox>
            <MDBox pb={3} px={3}>
              <Grid key="fields-grid" container spacing={3}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validations}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, isSubmitting }) => (
                    <Form id={formId} autoComplete="off">
                      <MDBox p={3} width="100%">
                        {/***************************************************************************
                         ** step content - e.g., the appropriate form or other screen for the step **
                         ***************************************************************************/}
                        {getDynamicStepContent({
                          values,
                          touched,
                          formFields,
                          errors,
                        })}
                        <Grid key="buttonGrid" container spacing={3}>
                          <MDBox mt={5} ml="auto">
                            <MDButton type="submit" variant="gradient" color="dark" size="small">
                              save {tableMetaData?.label}
                            </MDButton>
                          </MDBox>
                        </Grid>
                      </MDBox>
                    </Form>
                  )}
                </Formik>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}

// Declaring default props for DefaultCell
EntityForm.defaultProps = {
  id: null,
};

export default EntityForm;
