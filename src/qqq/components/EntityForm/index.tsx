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

import {Capability} from "@kingsrook/qqq-frontend-core/lib/model/metaData/Capability";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Alert} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import {Form, Formik} from "formik";
import React, {useContext, useReducer, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as Yup from "yup";
import QContext from "QContext";
import {QCancelButton, QSaveButton} from "qqq/components/QButtons";
import QDynamicForm from "qqq/components/QDynamicForm";
import DynamicFormUtils from "qqq/components/QDynamicForm/utils/DynamicFormUtils";
import QRecordSidebar from "qqq/components/QRecordSidebar";
import colors from "qqq/components/Temporary/colors";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import QClient from "qqq/utils/QClient";
import QTableUtils from "qqq/utils/QTableUtils";
import QValueUtils from "qqq/utils/QValueUtils";

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

   const [formTitle, setFormTitle] = useState("");
   const [validations, setValidations] = useState({});
   const [initialValues, setInitialValues] = useState({} as { [key: string]: string });
   const [formFields, setFormFields] = useState(null as Map<string, any>);
   const [t1sectionName, setT1SectionName] = useState(null as string);
   const [nonT1Sections, setNonT1Sections] = useState([] as QTableSection[]);

   const [alertContent, setAlertContent] = useState("");

   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [formValues, setFormValues] = useState({} as { [key: string]: string });
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [record, setRecord] = useState(null as QRecord);
   const [tableSections, setTableSections] = useState(null as QTableSection[]);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [noCapabilityError, setNoCapabilityError] = useState(null as string);

   const {pageHeader, setPageHeader} = useContext(QContext);

   const navigate = useNavigate();
   const location = useLocation();

   function getFormSection(values: any, touched: any, formFields: any, errors: any): JSX.Element
   {
      const formData: any = {};
      formData.values = values;
      formData.touched = touched;
      formData.errors = errors;
      formData.formFields = {};
      for (let i = 0; i < formFields.length; i++)
      {
         formData.formFields[formFields[i].name] = formFields[i];
      }

      if (!Object.keys(formFields).length)
      {
         return <div>Loading...</div>;
      }
      return <QDynamicForm formData={formData} />;
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
         let record: QRecord = null;
         if (id !== null)
         {
            record = await qController.get(tableName, id);
            setRecord(record);
            setFormTitle(`Edit ${tableMetaData?.label}: ${record?.recordLabel}`);
            setPageHeader(`Edit ${tableMetaData?.label}: ${record?.recordLabel}`);

            tableMetaData.fields.forEach((fieldMetaData, key) =>
            {
               initialValues[key] = record.values.get(key);
               if(fieldMetaData.type == QFieldType.DATE_TIME)
               {
                  initialValues[key] = QValueUtils.formatDateTimeValueForForm(record.values.get(key));
               }
            });

            setFormValues(formValues);

            if(!tableMetaData.capabilities.has(Capability.TABLE_UPDATE))
            {
               setNoCapabilityError("You may not edit records in this table");
            }
         }
         else
         {
            setFormTitle(`Creating New ${tableMetaData?.label}`);
            setPageHeader(`Creating New ${tableMetaData?.label}`);

            if(!tableMetaData.capabilities.has(Capability.TABLE_INSERT))
            {
               setNoCapabilityError("You may not create records in this table");
            }
         }
         setInitialValues(initialValues);

         /////////////////////////////////////////////////////////
         // get formField and formValidation objects for Formik //
         /////////////////////////////////////////////////////////
         const {
            dynamicFormFields,
            formValidations,
         } = DynamicFormUtils.getFormData(fieldArray);
         DynamicFormUtils.addPossibleValueProps(dynamicFormFields, fieldArray, tableName, record?.displayValues);

         /////////////////////////////////////
         // group the formFields by section //
         /////////////////////////////////////
         const dynamicFormFieldsBySection = new Map<string, any>();
         let t1sectionName;
         const nonT1Sections: QTableSection[] = [];
         for (let i = 0; i < tableSections.length; i++)
         {
            const section = tableSections[i];
            const sectionDynamicFormFields: any[] = [];

            if(section.isHidden)
            {
               continue;
            }

            if(!section.fieldNames)
            {
               continue;
            }

            for (let j = 0; j < section.fieldNames.length; j++)
            {
               const fieldName = section.fieldNames[j];
               const field = tableMetaData.fields.get(fieldName);

               ////////////////////////////////////////////////////////////////////////////////////////////
               // if id !== null - means we're on the edit screen -- show all fields on the edit screen. //
               // || (or) we're on the insert screen in which case, only show editable fields.           //
               ////////////////////////////////////////////////////////////////////////////////////////////
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
               continue;
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
            else
            {
               nonT1Sections.push(section);
            }
         }
         setT1SectionName(t1sectionName);
         setNonT1Sections(nonT1Sections);
         setFormFields(dynamicFormFieldsBySection);
         setValidations(Yup.object().shape(formValidations));

         forceUpdate();
      })();
   }

   const handleCancelClicked = () =>
   {
      ///////////////////////////////////////////////////////////////////////////////////////
      // todo - we might have rather just done a navigate(-1) (to keep history clean)      //
      //  but if the user used the anchors on the page, this doesn't effectively cancel... //
      //  what we have here pushed a new history entry (I think?), so could be better      //
      ///////////////////////////////////////////////////////////////////////////////////////
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
                  console.log("Caught:");
                  console.log(error);
                  setAlertContent(error.message);
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
                  setAlertContent(error.message);
               });
         }
      })();
   };

   const formId = id != null ? `edit-${tableMetaData?.name}-form` : `create-${tableMetaData?.name}-form`;

   if(noCapabilityError)
   {
      return <MDBox mb={3}>
         <Grid container spacing={3}>
            <Grid item xs={12}>
               <MDBox mb={3}>
                  <Alert severity="error">{noCapabilityError}</Alert>
               </MDBox>
            </Grid>
         </Grid>
      </MDBox>;
   }

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
                           <Card id={`${t1sectionName}`} sx={{overflow: "visible", pb: 2, scrollMarginTop: "100px"}}>
                              <MDBox display="flex" p={3} pb={1}>
                                 <MDBox mr={1.5}>
                                    <Avatar sx={{bgcolor: colors.info.main}}>
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
                                    <MDBox pb={1} px={3}>
                                       <MDBox p={3} width="100%">
                                          {getFormSection(values, touched, formFields.get(t1sectionName), errors)}
                                       </MDBox>
                                    </MDBox>
                                 ) : null
                              }
                           </Card>
                        </MDBox>
                        {formFields && nonT1Sections.length ? nonT1Sections.map((section: QTableSection) => (
                           <MDBox key={`edit-card-${section.name}`} pb={3}>
                              <Card id={section.name} sx={{overflow: "visible", scrollMarginTop: "100px"}}>
                                 <MDTypography variant="h5" p={3} pb={1}>
                                    {section.label}
                                 </MDTypography>
                                 <MDBox pb={1} px={3}>
                                    <MDBox p={3} width="100%">
                                       {
                                          getFormSection(values, touched, formFields.get(section.name), errors)
                                       }
                                    </MDBox>
                                 </MDBox>
                              </Card>
                           </MDBox>
                        )) : null}

                        <MDBox component="div" p={3}>
                           <Grid container justifyContent="flex-end" spacing={3}>
                              <QCancelButton onClickHandler={handleCancelClicked} disabled={isSubmitting} />
                              <QSaveButton disabled={isSubmitting} />
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
