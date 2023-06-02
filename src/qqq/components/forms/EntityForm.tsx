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
import {QPossibleValue} from "@kingsrook/qqq-frontend-core/lib/model/QPossibleValue";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Alert, Box} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import {Form, Formik} from "formik";
import React, {useContext, useReducer, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as Yup from "yup";
import QContext from "QContext";
import {QCancelButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";
import QDynamicForm from "qqq/components/forms/DynamicForm";
import DynamicFormUtils from "qqq/components/forms/DynamicFormUtils";
import MDTypography from "qqq/components/legacy/MDTypography";
import QRecordSidebar from "qqq/components/misc/RecordSidebar";
import HtmlUtils from "qqq/utils/HtmlUtils";
import Client from "qqq/utils/qqq/Client";
import TableUtils from "qqq/utils/qqq/TableUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface Props
{
   id?: string;
   isModal: boolean;
   table?: QTableMetaData;
   closeModalHandler?: (event: object, reason: string) => void;
   defaultValues: { [key: string]: string };
   disabledFields: { [key: string]: boolean } | string[];
}

EntityForm.defaultProps = {
   id: null,
   isModal: false,
   table: null,
   closeModalHandler: null,
   defaultValues: {},
   disabledFields: {},
};

function EntityForm(props: Props): JSX.Element
{
   const qController = Client.getInstance();
   const tableNameParam = useParams().tableName;
   const tableName = props.table === null ? tableNameParam : props.table.name;
   const {accentColor} = useContext(QContext);

   const [formTitle, setFormTitle] = useState("");
   const [validations, setValidations] = useState({});
   const [initialValues, setInitialValues] = useState({} as { [key: string]: string });
   const [formFields, setFormFields] = useState(null as Map<string, any>);
   const [t1sectionName, setT1SectionName] = useState(null as string);
   const [nonT1Sections, setNonT1Sections] = useState([] as QTableSection[]);

   const [alertContent, setAlertContent] = useState("");
   const [warningContent, setWarningContent] = useState("");

   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [record, setRecord] = useState(null as QRecord);
   const [tableSections, setTableSections] = useState(null as QTableSection[]);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [notAllowedError, setNotAllowedError] = useState(null as string);

   const {pageHeader, setPageHeader} = useContext(QContext);

   const navigate = useNavigate();
   const location = useLocation();

   ////////////////////////////////////////////////////////////////////
   // first take defaultValues and disabledFields from props         //
   // but, also allow them to be sent in the hash, in the format of: //
   // #/defaultValues={jsonName=value}/disabledFields={jsonName=any} //
   ////////////////////////////////////////////////////////////////////
   let defaultValues = props.defaultValues;
   let disabledFields = props.disabledFields;

   const hashParts = location.hash.split("/");
   for (let i = 0; i < hashParts.length; i++)
   {
      try
      {
         const parts = hashParts[i].split("=")
         if (parts.length > 1 && parts[0] == "defaultValues")
         {
            defaultValues = JSON.parse(decodeURIComponent(parts[1])) as { [key: string]: any };
         }

         if (parts.length > 1 && parts[0] == "disabledFields")
         {
            disabledFields = JSON.parse(decodeURIComponent(parts[1])) as { [key: string]: any };
         }
      }
      catch (e)
      {}
   }

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
         const tableSections = TableUtils.getSectionsForRecordSidebar(tableMetaData, [...tableMetaData.fields.keys()]);
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
         let defaultDisplayValues = new Map<string, string>();
         if (props.id !== null)
         {
            record = await qController.get(tableName, props.id);
            setRecord(record);
            setFormTitle(`Edit ${tableMetaData?.label}: ${record?.recordLabel}`);

            if (!props.isModal)
            {
               setPageHeader(`Edit ${tableMetaData?.label}: ${record?.recordLabel}`);
            }

            tableMetaData.fields.forEach((fieldMetaData, key) =>
            {
               initialValues[key] = record.values.get(key);
            });

            if (!tableMetaData.capabilities.has(Capability.TABLE_UPDATE))
            {
               setNotAllowedError("Records may not be edited in this table");
            }
            else if (!tableMetaData.editPermission)
            {
               setNotAllowedError(`You do not have permission to edit ${tableMetaData.label} records`);
            }
         }
         else
         {
            ///////////////////////////////////////////
            // else handle preparing to do an insert //
            ///////////////////////////////////////////
            setFormTitle(`Creating New ${tableMetaData?.label}`);

            if (!props.isModal)
            {
               setPageHeader(`Creating New ${tableMetaData?.label}`);
            }

            if (!tableMetaData.capabilities.has(Capability.TABLE_INSERT))
            {
               setNotAllowedError("Records may not be created in this table");
            }
            else if (!tableMetaData.insertPermission)
            {
               setNotAllowedError(`You do not have permission to create ${tableMetaData.label} records`);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // if default values were supplied for a new record, then populate initialValues, for formik. //
            ////////////////////////////////////////////////////////////////////////////////////////////////
            if(defaultValues)
            {
               for (let i = 0; i < fieldArray.length; i++)
               {
                  const fieldMetaData = fieldArray[i];
                  const fieldName = fieldMetaData.name;
                  if (defaultValues[fieldName])
                  {
                     initialValues[fieldName] = defaultValues[fieldName];

                     ///////////////////////////////////////////////////////////////////////////////////////////
                     // we need to set the initialDisplayValue for possible value fields with a default value //
                     // so, look them up here now if needed                                                   //
                     ///////////////////////////////////////////////////////////////////////////////////////////
                     if (fieldMetaData.possibleValueSourceName)
                     {
                        const results: QPossibleValue[] = await qController.possibleValues(tableName, null, fieldName, null, [initialValues[fieldName]]);
                        if (results && results.length > 0)
                        {
                           defaultDisplayValues.set(fieldName, results[0].label);
                        }
                     }
                  }
               }
            }
         }

         /////////////////////////////////////////////////////////////////////
         // make sure all initialValues are properly formatted for the form //
         /////////////////////////////////////////////////////////////////////
         for (let i = 0; i < fieldArray.length; i++)
         {
            const fieldMetaData = fieldArray[i];
            if (fieldMetaData.type == QFieldType.DATE_TIME && initialValues[fieldMetaData.name])
            {
               initialValues[fieldMetaData.name] = ValueUtils.formatDateTimeValueForForm(initialValues[fieldMetaData.name]);
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
         DynamicFormUtils.addPossibleValueProps(dynamicFormFields, fieldArray, tableName, null, record ? record.displayValues : defaultDisplayValues);

         if(disabledFields)
         {
            if(Array.isArray(disabledFields))
            {
               for (let i = 0; i < disabledFields.length; i++)
               {
                  dynamicFormFields[disabledFields[i]].isEditable = false;
               }
            }
            else
            {
               for (let fieldName in disabledFields)
               {
                  dynamicFormFields[fieldName].isEditable = false;
               }
            }
         }

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

            if (section.isHidden || !section.fieldNames)
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
               if (props.id !== null || field.isEditable)
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
      if (props.id !== null)
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
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // (1) convert date-time fields from user's time-zone into UTC                                              //
         // (2) if there's an initial value which matches the value (e.g., from the form), then remove that field    //
         // from the set of values that we'll submit to the backend.  This is to deal with the fact that our         //
         // date-times in the UI (e.g., the form field) only go to the minute - so they kinda always end up          //
         // changing from, say, 12:15:30 to just 12:15:00... this seems to get around that, for cases when the       //
         // user didn't change the value in the field (but if the user did change the value, then we will submit it) //
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////
         for(let fieldName of tableMetaData.fields.keys())
         {
            const fieldMetaData = tableMetaData.fields.get(fieldName);
            if(fieldMetaData.type === QFieldType.DATE_TIME && values[fieldName])
            {
               console.log(`DateTime ${fieldName}: Initial value: [${initialValues[fieldName]}] -> [${values[fieldName]}]`)
               if (initialValues[fieldName] == values[fieldName])
               {
                  console.log(" - Is the same, so, deleting from the post");
                  delete (values[fieldName]);
               }
               else
               {
                  values[fieldName] = ValueUtils.frontendLocalZoneDateTimeStringToUTCStringForBackend(values[fieldName]);
               }
            }
         }

         if (props.id !== null)
         {
            await qController
               .update(tableName, props.id, values)
               .then((record) =>
               {
                  if (props.isModal)
                  {
                     props.closeModalHandler(null, "recordUpdated");
                  }
                  else
                  {
                     const path = location.pathname.replace(/\/edit$/, "");
                     navigate(path, {state: {updateSuccess: true}});
                  }
               })
               .catch((error) =>
               {
                  console.log("Caught:");
                  console.log(error);

                  if(error.message.toLowerCase().startsWith("warning"))
                  {
                     const path = location.pathname.replace(/\/edit$/, "");
                     navigate(path, {state: {updateSuccess: true, warning: error.message}});
                  }
                  else
                  {
                     setAlertContent(error.message);
                     HtmlUtils.autoScroll(0);
                  }
               });
         }
         else
         {
            await qController
               .create(tableName, values)
               .then((record) =>
               {
                  if (props.isModal)
                  {
                     props.closeModalHandler(null, "recordCreated");
                  }
                  else
                  {
                     const path = location.pathname.replace(/create$/, record.values.get(tableMetaData.primaryKeyField));
                     navigate(path, {state: {createSuccess: true}});
                  }
               })
               .catch((error) =>
               {
                  if(error.message.toLowerCase().startsWith("warning"))
                  {
                     const path = location.pathname.replace(/create$/, record.values.get(tableMetaData.primaryKeyField));
                     navigate(path);
                     navigate(path, {state: {createSuccess: true, warning: error.message}});
                  }
                  else
                  {
                     setAlertContent(error.message);
                     HtmlUtils.autoScroll(0);
                  }
               });
         }
      })();
   };

   const formId = props.id != null ? `edit-${tableMetaData?.name}-form` : `create-${tableMetaData?.name}-form`;

   let body;
   if (notAllowedError)
   {
      body = (
         <Box mb={3}>
            <Grid container spacing={3}>
               <Grid item xs={12}>
                  <Box mb={3}>
                     <Alert severity="error">{notAllowedError}</Alert>
                     {props.isModal &&
                        <Box mt={5}>
                           <QCancelButton onClickHandler={props.isModal ? props.closeModalHandler : handleCancelClicked} label="Close" disabled={false} />
                        </Box>
                     }
                  </Box>
               </Grid>
            </Grid>
         </Box>
      );
   }
   else
   {
      const cardElevation = props.isModal ? 3 : 1;
      body = (
         <Box mb={3}>
            <Grid container spacing={3}>
               <Grid item xs={12}>
                  {alertContent ? (
                     <Box mb={3}>
                        <Alert severity="error" onClose={() => setAlertContent(null)}>{alertContent}</Alert>
                     </Box>
                  ) : ("")}
                  {warningContent ? (
                     <Box mb={3}>
                        <Alert severity="warning" onClose={() => setWarningContent(null)}>{warningContent}</Alert>
                     </Box>
                  ) : ("")}
               </Grid>
            </Grid>
            <Grid container spacing={3}>
               {
                  !props.isModal &&
                  <Grid item xs={12} lg={3}>
                     <QRecordSidebar tableSections={tableSections} />
                  </Grid>
               }
               <Grid item xs={12} lg={props.isModal ? 12 : 9}>

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

                           <Box pb={3} pt={0}>
                              <Card id={`${t1sectionName}`} sx={{overflow: "visible", pb: 2, scrollMarginTop: "100px"}} elevation={cardElevation}>
                                 <Box display="flex" p={3} pb={1}>
                                    <Box mr={1.5}>
                                       <Avatar sx={{bgcolor: accentColor}}>
                                          <Icon>
                                             {tableMetaData?.iconName}
                                          </Icon>
                                       </Avatar>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                       <MDTypography variant="h5">{formTitle}</MDTypography>
                                    </Box>
                                 </Box>
                                 {
                                    t1sectionName && formFields ? (
                                       <Box pb={1} px={3}>
                                          <Box p={3} width="100%">
                                             {getFormSection(values, touched, formFields.get(t1sectionName), errors)}
                                          </Box>
                                       </Box>
                                    ) : null
                                 }
                              </Card>
                           </Box>
                           {formFields && nonT1Sections.length ? nonT1Sections.map((section: QTableSection) => (
                              <Box key={`edit-card-${section.name}`} pb={3}>
                                 <Card id={section.name} sx={{overflow: "visible", scrollMarginTop: "100px"}} elevation={cardElevation}>
                                    <MDTypography variant="h6" p={3} pb={1}>
                                       {section.label}
                                    </MDTypography>
                                    <Box pb={1} px={3}>
                                       <Box p={3} width="100%">
                                          {getFormSection(values, touched, formFields.get(section.name), errors)}
                                       </Box>
                                    </Box>
                                 </Card>
                              </Box>
                           )) : null}

                           <Box component="div" p={3}>
                              <Grid container justifyContent="flex-end" spacing={3}>
                                 <QCancelButton onClickHandler={props.isModal ? props.closeModalHandler : handleCancelClicked} disabled={isSubmitting} />
                                 <QSaveButton disabled={isSubmitting} />
                              </Grid>
                           </Box>

                        </Form>
                     )}
                  </Formik>

               </Grid>
            </Grid>
         </Box>
      );
   }

   if (props.isModal)
   {
      return (
         <Box sx={{position: "absolute", overflowY: "auto", maxHeight: "100%", width: "100%"}}>
            <Card sx={{my: 5, mx: "auto", p: 6, pb: 0, maxWidth: "1024px"}}>
               {body}
            </Card>
         </Box>
      );
   }
   else
   {
      return (body);
   }
}

export default EntityForm;
