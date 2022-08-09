// react components
import {useParams, useNavigate, useLocation} from "react-router-dom";
import React, {useReducer, useState} from "react";

// misc components
import * as Yup from "yup";
import {
   Form, Formik, useFormik, useFormikContext,
} from "formik";

// qqq components
import DynamicFormUtils from "qqq/components/QDynamicForm/utils/DynamicFormUtils";
import QDynamicForm from "qqq/components/QDynamicForm";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {Alert} from "@mui/material";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import QClient from "qqq/utils/QClient";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QCancelButton, QSaveButton} from "qqq/components/QButtons";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import QRecordSidebar from "qqq/components/QRecordSidebar";
import QTableUtils from "qqq/utils/QTableUtils";

interface Props
{
   id?: string;
   table?: QTableMetaData;
}

function EntityForm({table, id}: Props): JSX.Element
{
   const qController = QClient.getInstance();
   const tableNameParam = useParams().tableName;
   const tableName = table === null ? tableNameParam : table.name;

   const [validations, setValidations] = useState({});
   const [initialValues, setInitialValues] = useState({} as { [key: string]: string });
   const [formFields, setFormFields] = useState(null as Map<string, any>);
   const [t1sectionName, setT1SectionName] = useState(null as string);

   const [alertContent, setAlertContent] = useState("");

   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [formValues, setFormValues] = useState({} as { [key: string]: string });
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [record, setRecord] = useState(null as QRecord);
   const [tableSections, setTableSections] = useState(null as any);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const navigate = useNavigate();
   const location = useLocation();

   function getFormSection(values: any, touched: any, formFields: any, errors: any): JSX.Element
   {
      const formData: any = {};
      formData.values = values;
      formData.touched = touched;
      formData.errors = errors;
      formData.formFields = {};
      console.log(formFields);
      for (let i = 0; i < formFields.length; i++)
      {
         formData.formFields[formFields[i].name] = formFields[i];
      }

      if (!Object.keys(formFields).length)
      {
         return <div>Loading...</div>;
      }
      return <QDynamicForm formData={formData} primaryKeyId={tableMetaData.primaryKeyField} />;
   }

   if (!asyncLoadInited)
   {
      setAsyncLoadInited(true);
      (async () =>
      {
         const tableMetaData = await qController.loadTableMetaData(tableName);
         setTableMetaData(tableMetaData);

         /////////////////////////////////////////////////
         // define the sections, e.g., for the left-bar //
         /////////////////////////////////////////////////
         const tableSections = QTableUtils.getSectionsForRecordSidebar(tableMetaData);
         setTableSections(tableSections);

         const fieldArray = [] as QFieldMetaData[];
         const sortedKeys = [...tableMetaData.fields.keys()].sort();
         sortedKeys.forEach((key) =>
         {
            const fieldMetaData = tableMetaData.fields.get(key);
            fieldArray.push(fieldMetaData);
         });

         /////////////////////////////////////////////////////////////////////////////////
         // if doing an edit, fetch the record and pre-populate the form values from it //
         /////////////////////////////////////////////////////////////////////////////////
         if (id !== null)
         {
            const record = await qController.get(tableName, id);
            setRecord(record);

            tableMetaData.fields.forEach((fieldMetaData, key) =>
            {
               initialValues[key] = record.values.get(key);
            });

            setFormValues(formValues);
         }
         setInitialValues(initialValues);

         /////////////////////////////////////////////////////////
         // get formField and formValidation objects for Formik //
         /////////////////////////////////////////////////////////
         const {
            dynamicFormFields,
            formValidations,
         } = DynamicFormUtils.getFormData(fieldArray);

         /////////////////////////////////////
         // group the formFields by section //
         /////////////////////////////////////
         const dynamicFormFieldsBySection = new Map<string, any>();
         let t1sectionName;
         for (let i = 0; i < tableSections.length; i++)
         {
            const section = tableSections[i];
            const sectionDynamicFormFields: any[] = [];

            for (let j = 0; j < section.fieldNames.length; j++)
            {
               const fieldName = section.fieldNames[j];
               const field = tableMetaData.fields.get(fieldName);
               if (id !== null || field.isEditable)
               {
                  sectionDynamicFormFields.push(dynamicFormFields[fieldName]);
               }
            }

            if (sectionDynamicFormFields.length === 0)
            {
               ////////////////////////////////////////////////////////////////////////////////////////////////
               // in case there are no active fields in this section, remove it from the tableSections array //
               ////////////////////////////////////////////////////////////////////////////////////////////////
               tableSections.splice(i, 1);
               i--;
            }
            else
            {
               dynamicFormFieldsBySection.set(section.name, sectionDynamicFormFields);
            }

            //////////////////////////////////////
            // capture the tier1 section's name //
            //////////////////////////////////////
            if (section.tier === "T1")
            {
               t1sectionName = section.name;
            }
         }
         setT1SectionName(t1sectionName);
         setFormFields(dynamicFormFieldsBySection);
         setValidations(Yup.object().shape(formValidations));

         forceUpdate();
      })();
   }

   const handleCancelClicked = () =>
   {
      if (id !== null)
      {
         const path = `${location.pathname.replace(/\/edit$/, "")}`;
         navigate(path, {replace: true});
      }
      else
      {
         const path = `${location.pathname.replace(/\/create$/, "")}`;
         navigate(path, {replace: true});
      }
   };

   const handleSubmit = async (values: any, actions: any) =>
   {
      actions.setSubmitting(true);
      await (async () =>
      {
         if (id !== null)
         {
            await qController
               .update(tableName, id, values)
               .then((record) =>
               {
                  const path = `${location.pathname.replace(/\/edit$/, "")}?updateSuccess=true`;
                  navigate(path);
               })
               .catch((error) =>
               {
                  setAlertContent(error.response.data.error);
               });
         }
         else
         {
            await qController
               .create(tableName, values)
               .then((record) =>
               {
                  const path = `${location.pathname.replace(/create$/, record.values.get(tableMetaData.primaryKeyField))}?createSuccess=true`;
                  navigate(path);
               })
               .catch((error) =>
               {
                  setAlertContent(error.response.data.error);
               });
         }
      })();
   };

   let formTitle = "";
   if (tableMetaData)
   {
      if (id == null)
      {
         formTitle = `Create new ${tableMetaData?.label}`;
      }
      else if (record != null)
      {
         formTitle = `Edit ${tableMetaData?.label}: ${record?.recordLabel}`;
      }
   }

   const formId = id != null ? `edit-${tableMetaData?.name}-form` : `create-${tableMetaData?.name}-form`;

   return (
      <MDBox mb={3}>
         <Grid container spacing={3}>
            <Grid item xs={12}>
               {alertContent ? (
                  <MDBox mb={3}>
                     <Alert severity="error">{alertContent}</Alert>
                  </MDBox>
               ) : ("")}
            </Grid>
         </Grid>
         <Grid container spacing={3}>
            <Grid item xs={12} lg={3}>
               <QRecordSidebar tableSections={tableSections} />
            </Grid>
            <Grid item xs={12} lg={9}>

               <Formik
                  initialValues={initialValues}
                  validationSchema={validations}
                  onSubmit={handleSubmit}
               >
                  {({
                     values,
                     errors,
                     touched,
                     isSubmitting,
                  }) => (
                     <Form id={formId} autoComplete="off">

                        <MDBox pb={3} pt={0}>
                           <Card id={`${t1sectionName}`} sx={{overflow: "visible"}}>
                              <MDBox display="flex" p={3} pb={1}>
                                 <MDBox mr={1.5}>
                                    <Avatar sx={{bgcolor: "rgb(26, 115, 232)"}}>
                                       <Icon>
                                          {tableMetaData?.iconName}
                                       </Icon>
                                    </Avatar>
                                 </MDBox>
                                 <MDBox display="flex" alignItems="center">
                                    <MDTypography variant="h5">{formTitle}</MDTypography>
                                 </MDBox>
                              </MDBox>
                              {
                                 t1sectionName && formFields ? (
                                    <MDBox pb={3} px={3}>
                                       <MDBox p={3} width="100%">
                                          {getFormSection(values, touched, formFields.get(t1sectionName), errors)}
                                       </MDBox>
                                    </MDBox>
                                 ) : null
                              }
                           </Card>
                        </MDBox>
                        {tableSections && formFields ? tableSections.map((section: any) => (section.name !== t1sectionName
                           ? (
                              <MDBox key={`edit-card-${section.name}`} pb={3}>
                                 <Card id={section.name} sx={{overflow: "visible"}}>
                                    <MDTypography variant="h5" p={3} pb={1}>
                                       {section.label}
                                    </MDTypography>
                                    <MDBox pb={3} px={3}>
                                       <MDBox p={3} width="100%">
                                          {
                                             getFormSection(values, touched, formFields.get(section.name), errors)
                                          }
                                       </MDBox>
                                    </MDBox>
                                 </Card>
                              </MDBox>
                           ) : null)) : null}

                        <MDBox component="div" p={3}>
                           <Grid container justifyContent="flex-end" spacing={3}>
                              <QCancelButton onClickHandler={handleCancelClicked} />
                              <QSaveButton />
                           </Grid>
                        </MDBox>

                     </Form>
                  )}
               </Formik>

            </Grid>
         </Grid>
      </MDBox>
   );
}

EntityForm.defaultProps = {
   id: null,
   table: null,
};

export default EntityForm;
