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
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {QPossibleValue} from "@kingsrook/qqq-frontend-core/lib/model/QPossibleValue";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Alert} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import {Form, Formik, FormikErrors, FormikTouched, FormikValues, useFormikContext} from "formik";
import QContext from "QContext";
import {QCancelButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";
import QDynamicForm from "qqq/components/forms/DynamicForm";
import DynamicFormUtils from "qqq/components/forms/DynamicFormUtils";
import MDTypography from "qqq/components/legacy/MDTypography";
import HelpContent from "qqq/components/misc/HelpContent";
import QRecordSidebar from "qqq/components/misc/RecordSidebar";
import DynamicFormWidget from "qqq/components/widgets/misc/DynamicFormWidget";
import FilterAndColumnsSetupWidget from "qqq/components/widgets/misc/FilterAndColumnsSetupWidget";
import PivotTableSetupWidget from "qqq/components/widgets/misc/PivotTableSetupWidget";
import RecordGridWidget, {ChildRecordListData} from "qqq/components/widgets/misc/RecordGridWidget";
import {FieldRule, FieldRuleAction, FieldRuleTrigger} from "qqq/models/fields/FieldRules";
import HtmlUtils from "qqq/utils/HtmlUtils";
import Client from "qqq/utils/qqq/Client";
import TableUtils from "qqq/utils/qqq/TableUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";
import React, {useContext, useEffect, useReducer, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Value} from "sass";
import * as Yup from "yup";

interface Props
{
   id?: string;
   isModal: boolean;
   table?: QTableMetaData;
   closeModalHandler?: (event: object, reason: string) => void;
   defaultValues: { [key: string]: string };
   disabledFields: { [key: string]: boolean } | string[];
   isCopy?: boolean;
   onSubmitCallback?: (values: any) => void;
   overrideHeading?: string;
}

EntityForm.defaultProps = {
   id: null,
   isModal: false,
   table: null,
   closeModalHandler: null,
   defaultValues: {},
   disabledFields: {},
   isCopy: false,
   onSubmitCallback: null,
};


////////////////////////////////////////////////////////////////////////////
// define a function that we can make referenes to, which we'll overwrite //
// with formik's setFieldValue function, once we're inside formik.        //
////////////////////////////////////////////////////////////////////////////
let formikSetFieldValueFunction = (field: string, value: any, shouldValidate?: boolean): void =>
{
};

function EntityForm(props: Props): JSX.Element
{
   const qController = Client.getInstance();
   const tableNameParam = useParams().tableName;
   const tableName = props.table === null ? tableNameParam : props.table.name;
   const {accentColor, recordAnalytics} = useContext(QContext);

   const [formTitle, setFormTitle] = useState("");
   const [validations, setValidations] = useState({});
   const [initialValues, setInitialValues] = useState({} as { [key: string]: any });
   const [formFields, setFormFields] = useState(null as Map<string, any>);
   const [t1section, setT1Section] = useState(null as QTableSection);
   const [t1sectionName, setT1SectionName] = useState(null as string);
   const [nonT1Sections, setNonT1Sections] = useState([] as QTableSection[]);

   const [alertContent, setAlertContent] = useState("");
   const [warningContent, setWarningContent] = useState("");

   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [fieldRules, setFieldRules] = useState([] as FieldRule[]);
   const [metaData, setMetaData] = useState(null as QInstance);
   const [record, setRecord] = useState(null as QRecord);
   const [tableSections, setTableSections] = useState(null as QTableSection[]);
   const [renderedWidgetSections, setRenderedWidgetSections] = useState({} as { [name: string]: JSX.Element });
   const [childListWidgetData, setChildListWidgetData] = useState({} as { [name: string]: ChildRecordListData });
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [showEditChildForm, setShowEditChildForm] = useState(null as any);
   const [modalDataChangedCounter, setModalDataChangedCount] = useState(0);

   const [notAllowedError, setNotAllowedError] = useState(null as string);

   const [formValuesJSON, setFormValuesJSON] = useState("");
   const [formValues, setFormValues] = useState({} as { [name: string]: any });

   const {pageHeader, setPageHeader} = useContext(QContext);

   const navigate = useNavigate();
   const location = useLocation();

   const cardElevation = props.isModal ? 3 : 0;

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
         const parts = hashParts[i].split("=");
         if (parts.length > 1)
         {
            const name = parts[0].replace(/^#/, "");
            const value = parts[1];
            if (name == "defaultValues")
            {
               defaultValues = JSON.parse(decodeURIComponent(value)) as { [key: string]: any };
            }

            if (name == "disabledFields")
            {
               disabledFields = JSON.parse(decodeURIComponent(value)) as { [key: string]: any };
            }
         }
      }
      catch (e)
      {
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function openAddChildRecord(name: string, widgetData: any)
   {
      let defaultValues = widgetData.defaultValuesForNewChildRecords;

      let disabledFields = widgetData.disabledFieldsForNewChildRecords;
      if (!disabledFields)
      {
         disabledFields = widgetData.defaultValuesForNewChildRecords;
      }

      doOpenEditChildForm(name, widgetData.childTableMetaData, null, defaultValues, disabledFields);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function openEditChildRecord(name: string, widgetData: any, rowIndex: number)
   {
      let defaultValues = widgetData.queryOutput.records[rowIndex].values;

      let disabledFields = widgetData.disabledFieldsForNewChildRecords;
      if (!disabledFields)
      {
         disabledFields = widgetData.defaultValuesForNewChildRecords;
      }

      doOpenEditChildForm(name, widgetData.childTableMetaData, rowIndex, defaultValues, disabledFields);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   const deleteChildRecord = (name: string, widgetData: any, rowIndex: number) =>
   {
      updateChildRecordList(name, "delete", rowIndex);
   };


   /*******************************************************************************
    **
    *******************************************************************************/
   function doOpenEditChildForm(widgetName: string, table: QTableMetaData, rowIndex: number, defaultValues: any, disabledFields: any)
   {
      const showEditChildForm: any = {};
      showEditChildForm.widgetName = widgetName;
      showEditChildForm.table = table;
      showEditChildForm.rowIndex = rowIndex;
      showEditChildForm.defaultValues = defaultValues;
      showEditChildForm.disabledFields = disabledFields;
      setShowEditChildForm(showEditChildForm);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   const closeEditChildForm = (event: object, reason: string) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      setShowEditChildForm(null);
   };


   /*******************************************************************************
    **
    *******************************************************************************/
   function submitEditChildForm(values: any)
   {
      updateChildRecordList(showEditChildForm.widgetName, showEditChildForm.rowIndex == null ? "insert" : "edit", showEditChildForm.rowIndex, values);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   async function updateChildRecordList(widgetName: string, action: "insert" | "edit" | "delete", rowIndex?: number, values?: any)
   {
      const metaData = await qController.loadMetaData();
      const widgetMetaData = metaData.widgets.get(widgetName);

      const newChildListWidgetData: { [name: string]: ChildRecordListData } = Object.assign({}, childListWidgetData);
      if (!newChildListWidgetData[widgetName].queryOutput.records)
      {
         newChildListWidgetData[widgetName].queryOutput.records = [];
      }

      switch (action)
      {
         case "insert":
            newChildListWidgetData[widgetName].queryOutput.records.push({values: values});
            break;
         case "edit":
            newChildListWidgetData[widgetName].queryOutput.records[rowIndex] = {values: values};
            break;
         case "delete":
            newChildListWidgetData[widgetName].queryOutput.records.splice(rowIndex, 1);
            break;
      }
      newChildListWidgetData[widgetName].totalRows = newChildListWidgetData[widgetName].queryOutput.records.length;
      setChildListWidgetData(newChildListWidgetData);

      const newRenderedWidgetSections = Object.assign({}, renderedWidgetSections);
      newRenderedWidgetSections[widgetName] = getWidgetSection(widgetMetaData, newChildListWidgetData[widgetName]);
      setRenderedWidgetSections(newRenderedWidgetSections);
      forceUpdate();

      setModalDataChangedCount(modalDataChangedCounter + 1);

      setShowEditChildForm(null);
   }


   /*******************************************************************************
    ** Watch the record values - if they change, re-render widgets
    *******************************************************************************/
   useEffect(() =>
   {
      const newRenderedWidgetSections: { [name: string]: JSX.Element } = {};
      for (let widgetName in renderedWidgetSections)
      {
         const widgetMetaData = metaData.widgets.get(widgetName);
         newRenderedWidgetSections[widgetName] = getWidgetSection(widgetMetaData, childListWidgetData[widgetName]);
      }
      setRenderedWidgetSections(newRenderedWidgetSections);
   }, [formValuesJSON]);


   /*******************************************************************************
    ** render a section (full of fields) as a form
    *******************************************************************************/
   function getFormSection(section: QTableSection, values: any, touched: any, formFields: any, errors: any, omitWrapper = false): JSX.Element
   {
      const formData: any = {};
      formData.values = values;
      formData.touched = touched;
      formData.errors = errors;
      formData.formFields = {};
      for (let i = 0; i < formFields.length; i++)
      {
         formData.formFields[formFields[i].name] = formFields[i];

         if (formFields[i].possibleValueProps)
         {
            formFields[i].possibleValueProps.otherValues = formFields[i].possibleValueProps.otherValues ?? new Map<string, any>();
            Object.keys(formFields).forEach((otherKey) =>
            {
               formFields[i].possibleValueProps.otherValues.set(otherKey, values[otherKey]);
            });
         }
      }

      if (!Object.keys(formFields).length)
      {
         return <div>Error: No form fields in section {section.name}</div>;
      }

      const helpRoles = [props.id ? "EDIT_SCREEN" : "INSERT_SCREEN", "WRITE_SCREENS", "ALL_SCREENS"];

      if (omitWrapper)
      {
         return <QDynamicForm formData={formData} record={record} helpRoles={helpRoles} helpContentKeyPrefix={`table:${tableName};`} />;
      }

      return <Card id={section.name} sx={{overflow: "visible", scrollMarginTop: "100px"}} elevation={cardElevation}>
         <MDTypography variant="h6" p={3} pb={1}>
            {section.label}
         </MDTypography>
         {getSectionHelp(section)}
         <Box pb={1} px={3}>
            <Box pb={"0.75rem"} width="100%">
               <QDynamicForm formData={formData} record={record} helpRoles={helpRoles} helpContentKeyPrefix={`table:${tableName};`} />
            </Box>
         </Box>
      </Card>;
   }


   /*******************************************************************************
    ** if we have a widget that wants to set form-field values, they can take this
    ** function in as a callback, and then call it with their values.
    *******************************************************************************/
   function setFormFieldValuesFromWidget(values: { [name: string]: any })
   {
      for (let key in values)
      {
         formikSetFieldValueFunction(key, values[key]);
      }
   }


   /*******************************************************************************
    ** render a section as a widget
    *******************************************************************************/
   function getWidgetSection(widgetMetaData: QWidgetMetaData, widgetData: any): JSX.Element
   {
      if (widgetMetaData.type == "childRecordList")
      {
         widgetData.viewAllLink = null;
         widgetMetaData.showExportButton = false;

         return <RecordGridWidget
            key={`${formValues["tableName"]}-${modalDataChangedCounter}`}
            widgetMetaData={widgetMetaData}
            data={widgetData}
            disableRowClick
            allowRecordEdit
            allowRecordDelete
            addNewRecordCallback={() => openAddChildRecord(widgetMetaData.name, widgetData)}
            editRecordCallback={(rowIndex) => openEditChildRecord(widgetMetaData.name, widgetData, rowIndex)}
            deleteRecordCallback={(rowIndex) => deleteChildRecord(widgetMetaData.name, widgetData, rowIndex)}
         />;
      }

      if (widgetMetaData.type == "filterAndColumnsSetup")
      {
         /////////////////////////////////////////////////////////////////////////////////////////////////////////
         // if the widget metadata specifies a table name, set form values to that so widget knows which to use //
         // (for the case when it is not being specified by a separate field in the record)                     //
         /////////////////////////////////////////////////////////////////////////////////////////////////////////
         if (widgetMetaData?.defaultValues?.has("tableName"))
         {
            formValues["tableName"] = widgetMetaData?.defaultValues.get("tableName");
         }

         return <FilterAndColumnsSetupWidget
            key={formValues["tableName"]} // todo, is this good?  it was added so that editing values actually re-renders...
            isEditable={true}
            widgetMetaData={widgetMetaData}
            recordValues={formValues}
            onSaveCallback={setFormFieldValuesFromWidget}
         />;
      }

      if (widgetMetaData.type == "pivotTableSetup")
      {
         return <PivotTableSetupWidget
            key={formValues["tableName"]} // todo, is this good?  it was added so that editing values actually re-renders...
            isEditable={true}
            widgetMetaData={widgetMetaData}
            recordValues={formValues}
            onSaveCallback={setFormFieldValuesFromWidget}
         />;
      }

      if (widgetMetaData.type == "dynamicForm")
      {
         return <DynamicFormWidget
            key={formValues["savedReportId"]} // todo - pull this from the metaData (could do so above too...)
            isEditable={true}
            widgetMetaData={widgetMetaData}
            widgetData={widgetData}
            recordValues={formValues}
            record={record}
            onSaveCallback={setFormFieldValuesFromWidget}
         />;
      }

      return (<Box>Unsupported widget type: {widgetMetaData.type}</Box>);
   }


   /*******************************************************************************
    ** render a form section
    *******************************************************************************/
   function renderSection(section: QTableSection, values: FormikValues | Value, touched: FormikTouched<FormikValues> | Value, formFields: Map<string, any>, errors: FormikErrors<FormikValues> | Value)
   {
      if (section.fieldNames && section.fieldNames.length > 0)
      {
         return getFormSection(section, values, touched, formFields.get(section.name), errors);
      }
      else
      {
         return renderedWidgetSections[section.widgetName] ?? <Box>Loading {section.label}...</Box>;
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function setupFieldRules(tableMetaData: QTableMetaData)
   {
      const mdbMetaData = tableMetaData?.supplementalTableMetaData?.get("materialDashboard");
      if (!mdbMetaData)
      {
         return;
      }

      if (mdbMetaData.fieldRules)
      {
         const newFieldRules: FieldRule[] = [];
         for (let i = 0; i < mdbMetaData.fieldRules.length; i++)
         {
            newFieldRules.push(mdbMetaData.fieldRules[i]);
         }
         setFieldRules(newFieldRules);
      }
   }


   //////////////////
   // initial load //
   //////////////////
   if (!asyncLoadInited)
   {
      setAsyncLoadInited(true);
      (async () =>
      {
         const tableMetaData = await qController.loadTableMetaData(tableName);
         setTableMetaData(tableMetaData);
         recordAnalytics({location: window.location, title: (props.isCopy ? "Copy" : props.id ? "Edit" : "New") + ": " + tableMetaData.label});

         setupFieldRules(tableMetaData);

         const metaData = await qController.loadMetaData();
         setMetaData(metaData);

         /////////////////////////////////////////////////
         // define the sections, e.g., for the left-bar //
         /////////////////////////////////////////////////
         const tableSections = TableUtils.getSectionsForRecordSidebar(tableMetaData, [...tableMetaData.fields.keys()], (section: QTableSection) =>
         {
            const widget = metaData.widgets.get(section.widgetName);
            if (widget)
            {
               if (widget.type == "childRecordList" && widget.defaultValues?.has("manageAssociationName"))
               {
                  return (true);
               }

               if (widget.type == "filterAndColumnsSetup" || widget.type == "pivotTableSetup" || widget.type == "dynamicForm")
               {
                  return (true);
               }
            }

            return (false);
         });
         setTableSections(tableSections);

         const fieldArray = [] as QFieldMetaData[];
         const sortedKeys = [...tableMetaData.fields.keys()].sort();
         sortedKeys.forEach((key) =>
         {
            const fieldMetaData = tableMetaData.fields.get(key);
            fieldArray.push(fieldMetaData);
         });

         /////////////////////////////////////////////////////////////////////////////////////////
         // if doing an edit or copy, fetch the record and pre-populate the form values from it //
         /////////////////////////////////////////////////////////////////////////////////////////
         let record: QRecord = null;
         let defaultDisplayValues = new Map<string, string>();
         if (props.id !== null)
         {
            record = await qController.get(tableName, props.id);
            setRecord(record);
            recordAnalytics({category: "tableEvents", action: props.isCopy ? "copy" : "edit", label: tableMetaData?.label + " / " + record?.recordLabel});

            const titleVerb = props.isCopy ? "Copy" : "Edit";
            setFormTitle(`${titleVerb} ${tableMetaData?.label}: ${record?.recordLabel}`);

            if (!props.isModal)
            {
               setPageHeader(`${titleVerb} ${tableMetaData?.label}: ${record?.recordLabel}`);
            }

            tableMetaData.fields.forEach((fieldMetaData, key) =>
            {
               if (props.isCopy && fieldMetaData.name == tableMetaData.primaryKeyField)
               {
                  return;
               }
               initialValues[key] = record.values.get(key);
            });

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // these checks are only for updating records, if copying, it is actually an insert, which is checked after this block //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (!props.isCopy)
            {
               if (!tableMetaData.capabilities.has(Capability.TABLE_UPDATE))
               {
                  setNotAllowedError("Records may not be edited in this table");
               }
               else if (!tableMetaData.editPermission)
               {
                  setNotAllowedError(`You do not have permission to edit ${tableMetaData.label} records`);
               }
            }
         }
         else
         {
            ///////////////////////////////////////////
            // else handle preparing to do an insert //
            ///////////////////////////////////////////
            setFormTitle(`Creating New ${tableMetaData?.label}`);
            recordAnalytics({category: "tableEvents", action: "new", label: tableMetaData?.label});

            if (!props.isModal)
            {
               setPageHeader(`Creating New ${tableMetaData?.label}`);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // if default values were supplied for a new record, then populate initialValues, for formik. //
            ////////////////////////////////////////////////////////////////////////////////////////////////
            for (let i = 0; i < fieldArray.length; i++)
            {
               const fieldMetaData = fieldArray[i];
               const fieldName = fieldMetaData.name;
               const defaultValue = (defaultValues && defaultValues[fieldName]) ? defaultValues[fieldName] : fieldMetaData.defaultValue;
               if (defaultValue)
               {
                  initialValues[fieldName] = defaultValue;

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

         ///////////////////////////////////////////////////
         // if an override heading was passed in, use it. //
         ///////////////////////////////////////////////////
         if (props.overrideHeading)
         {
            setFormTitle(props.overrideHeading);
            if (!props.isModal)
            {
               setPageHeader(props.overrideHeading);
            }
         }

         //////////////////////////////////////
         // check capabilities & permissions //
         //////////////////////////////////////
         if (props.isCopy || !props.id)
         {
            if (!tableMetaData.capabilities.has(Capability.TABLE_INSERT))
            {
               setNotAllowedError("Records may not be created in this table");
            }
            else if (!tableMetaData.insertPermission)
            {
               setNotAllowedError(`You do not have permission to create ${tableMetaData.label} records`);
            }
         }
         else
         {
            if (!tableMetaData.capabilities.has(Capability.TABLE_UPDATE))
            {
               setNotAllowedError("Records may not be edited in this table");
            }
            else if (!tableMetaData.editPermission)
            {
               setNotAllowedError(`You do not have permission to edit ${tableMetaData.label} records`);
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
         } = DynamicFormUtils.getFormData(fieldArray, disabledFields);
         DynamicFormUtils.addPossibleValueProps(dynamicFormFields, fieldArray, tableName, null, record ? record.displayValues : defaultDisplayValues);

         /////////////////////////////////////
         // group the formFields by section //
         /////////////////////////////////////
         const dynamicFormFieldsBySection = new Map<string, any>();
         let t1sectionName;
         let t1section;
         const nonT1Sections: QTableSection[] = [];
         const newRenderedWidgetSections: { [name: string]: JSX.Element } = {};
         const newChildListWidgetData: { [name: string]: ChildRecordListData } = {};

         for (let i = 0; i < tableSections.length; i++)
         {
            const section = tableSections[i];
            const sectionDynamicFormFields: any[] = [];

            if (section.isHidden)
            {
               continue;
            }

            const hasFields = section.fieldNames && section.fieldNames.length > 0;
            if (hasFields)
            {
               for (let j = 0; j < section.fieldNames.length; j++)
               {
                  const fieldName = section.fieldNames[j];
                  const field = tableMetaData.fields.get(fieldName);

                  if (!field)
                  {
                     console.log(`Omitting un-found field ${fieldName} from form`);
                     continue;
                  }

                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  // if id !== null (and we're not copying) - means we're on the edit screen -- show all fields on the edit screen. //
                  // || (or) we're on the insert screen in which case, only show editable fields.                                   //
                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  if ((props.id !== null && !props.isCopy) || field.isEditable)
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
            }
            else
            {
               const widgetMetaData = metaData.widgets.get(section.widgetName);
               const widgetData = await qController.widget(widgetMetaData.name, makeQueryStringWithIdAndObject(tableMetaData, defaultValues));

               newRenderedWidgetSections[section.widgetName] = getWidgetSection(widgetMetaData, widgetData);
               newChildListWidgetData[section.widgetName] = widgetData;
            }

            //////////////////////////////////////
            // capture the tier1 section's name //
            //////////////////////////////////////
            if (section.tier === "T1")
            {
               t1sectionName = section.name;
               t1section = section;
            }
            else
            {
               nonT1Sections.push(section);
            }
         }

         setT1SectionName(t1sectionName);
         setT1Section(t1section);
         setNonT1Sections(nonT1Sections);
         setFormFields(dynamicFormFieldsBySection);
         setValidations(Yup.object().shape(formValidations));
         setRenderedWidgetSections(newRenderedWidgetSections);
         setChildListWidgetData(newChildListWidgetData);

         forceUpdate();
      })();
   }


   //////////////////////////////////////////////////////////////////
   // watch widget data - if they change, re-render those sections //
   //////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (childListWidgetData)
      {
         const newRenderedWidgetSections: { [name: string]: JSX.Element } = {};
         for (let name in childListWidgetData)
         {
            const widgetMetaData = metaData.widgets.get(name);
            newRenderedWidgetSections[name] = getWidgetSection(widgetMetaData, childListWidgetData[name]);
         }
         setRenderedWidgetSections(newRenderedWidgetSections);
      }
   }, [childListWidgetData]);


   const handleCancelClicked = () =>
   {
      ///////////////////////////////////////////////////////////////////////////////////////
      // todo - we might have rather just done a navigate(-1) (to keep history clean)      //
      //  but if the user used the anchors on the page, this doesn't effectively cancel... //
      //  what we have here pushed a new history entry (I think?), so could be better      //
      ///////////////////////////////////////////////////////////////////////////////////////
      if (props.id !== null && props.isCopy)
      {
         const path = `${location.pathname.replace(/\/copy$/, "")}`;
         navigate(path, {replace: true});
      }
      else if (props.id !== null)
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


   /*******************************************************************************
    ** event handler for the (Formik) Form.
    *******************************************************************************/
   const handleSubmit = async (values: any, actions: any) =>
   {
      actions.setSubmitting(true);

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // if there's a callback (e.g., for a modal nested on another create/edit screen), then just pass our data back there anre return. //
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (props.onSubmitCallback)
      {
         props.onSubmitCallback(values);
         return;
      }

      await (async () =>
      {
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // we will be manipulating the values sent to the backend, so clone values so they remained unchanged for the form widgets //
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         const valuesToPost = JSON.parse(JSON.stringify(values));

         for (let fieldName of tableMetaData.fields.keys())
         {
            const fieldMetaData = tableMetaData.fields.get(fieldName);

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // (1) convert date-time fields from user's time-zone into UTC                                              //
            // (2) if there's an initial value which matches the value (e.g., from the form), then remove that field    //
            // from the set of values that we'll submit to the backend.  This is to deal with the fact that our         //
            // date-times in the UI (e.g., the form field) only go to the minute - so they kinda always end up          //
            // changing from, say, 12:15:30 to just 12:15:00... this seems to get around that, for cases when the       //
            // user didn't change the value in the field (but if the user did change the value, then we will submit it) //
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (fieldMetaData.type === QFieldType.DATE_TIME && valuesToPost[fieldName])
            {
               console.log(`DateTime ${fieldName}: Initial value: [${initialValues[fieldName]}] -> [${valuesToPost[fieldName]}]`);
               if (initialValues[fieldName] == valuesToPost[fieldName])
               {
                  console.log(" - Is the same, so, deleting from the post");
                  delete (valuesToPost[fieldName]);
               }
               else
               {
                  valuesToPost[fieldName] = ValueUtils.frontendLocalZoneDateTimeStringToUTCStringForBackend(valuesToPost[fieldName]);
               }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // for BLOB fields, there are 3 possible cases:                                                               //
            // 1) they are a File object - in which case, cool, send them through to the backend to have bytes stored.    //
            // 2) they are null - in which case, cool, send them through to the backend to be set to null.                //
            // 3) they are a String, which is their URL path to download them... in that case, don't submit them to       //
            // the backend at all, so they'll stay what they were.  do that by deleting them from the values object here. //
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (fieldMetaData.type === QFieldType.BLOB)
            {
               if (typeof valuesToPost[fieldName] === "string")
               {
                  console.log(`${fieldName} value was a string, so, we're deleting it from the values array, to not submit it to the backend, to not change it.`);
                  delete (valuesToPost[fieldName]);
               }
               else
               {
                  valuesToPost[fieldName] = values[fieldName];
               }
            }
         }

         const associationsToPost: any = {};
         let haveAssociationsToPost = false;
         for (let name of Object.keys(childListWidgetData))
         {
            const manageAssociationName = metaData.widgets.get(name)?.defaultValues?.get("manageAssociationName");
            if (!manageAssociationName)
            {
               console.log(`Cannot send association data to backend - missing a manageAssociationName defaultValue in widget meta data for widget name ${name}`);
            }
            associationsToPost[manageAssociationName] = [];
            haveAssociationsToPost = true;
            for (let i = 0; i < childListWidgetData[name].queryOutput?.records?.length; i++)
            {
               associationsToPost[manageAssociationName].push(childListWidgetData[name].queryOutput.records[i].values);
            }
         }
         if (haveAssociationsToPost)
         {
            valuesToPost["associations"] = JSON.stringify(associationsToPost);
         }

         if (props.id !== null && !props.isCopy)
         {
            recordAnalytics({category: "tableEvents", action: "saveEdit", label: tableMetaData?.label});

            ///////////////////////
            // perform an update //
            ///////////////////////
            await qController
               .update(tableName, props.id, valuesToPost)
               .then((record) =>
               {
                  if (props.isModal)
                  {
                     props.closeModalHandler(null, "recordUpdated");
                  }
                  else
                  {
                     let warningMessage = null;
                     if (record.warnings && record.warnings.length && record.warnings.length > 0)
                     {
                        warningMessage = record.warnings[0];
                     }

                     const path = location.pathname.replace(/\/edit$/, "");
                     navigate(path, {state: {updateSuccess: true, warning: warningMessage}});
                  }
               })
               .catch((error) =>
               {
                  console.log("Caught:");
                  console.log(error);

                  if (error.message.toLowerCase().startsWith("warning"))
                  {
                     const path = location.pathname.replace(/\/edit$/, "");
                     navigate(path, {state: {updateSuccess: true, warning: error.message}});
                  }
                  else
                  {
                     setAlertContent(error.message);
                     scrollToTopToShowAlert();
                  }
               });
         }
         else
         {
            recordAnalytics({category: "tableEvents", action: props.isCopy ? "saveCopy" : "saveNew", label: tableMetaData?.label});

            /////////////////////////////////
            // perform an insert           //
            // todo - audit if it's a dupe //
            /////////////////////////////////
            await qController
               .create(tableName, valuesToPost)
               .then((record) =>
               {
                  if (props.isModal)
                  {
                     props.closeModalHandler(null, "recordCreated");
                  }
                  else
                  {
                     let warningMessage = null;
                     if (record.warnings && record.warnings.length && record.warnings.length > 0)
                     {
                        warningMessage = record.warnings[0];
                     }

                     const path = props.isCopy ?
                        location.pathname.replace(new RegExp(`/${props.id}/copy$`), "/" + record.values.get(tableMetaData.primaryKeyField))
                        : location.pathname.replace(/create$/, record.values.get(tableMetaData.primaryKeyField));
                     navigate(path, {state: {createSuccess: true, warning: warningMessage}});
                  }
               })
               .catch((error) =>
               {
                  if (error.message.toLowerCase().startsWith("warning"))
                  {
                     const path = props.isCopy ?
                        location.pathname.replace(new RegExp(`/${props.id}/copy$`), "/" + record.values.get(tableMetaData.primaryKeyField))
                        : location.pathname.replace(/create$/, record.values.get(tableMetaData.primaryKeyField));
                     navigate(path, {state: {createSuccess: true, warning: error.message}});
                  }
                  else
                  {
                     setAlertContent(error.message);
                     scrollToTopToShowAlert();
                  }
               });
         }
      })();
   };


   /*******************************************************************************
    **
    *******************************************************************************/
   function scrollToTopToShowAlert()
   {
      if (props.isModal)
      {
         document.getElementById("modalTopReference")?.scrollIntoView();
      }
      else
      {
         HtmlUtils.autoScroll(0);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function makeQueryStringWithIdAndObject(tableMetaData: QTableMetaData, object: { [key: string]: any })
   {
      const queryParamsArray: string[] = [];
      if (props.id)
      {
         queryParamsArray.push(`${tableMetaData.primaryKeyField}=${encodeURIComponent(props.id)}`);
      }

      if (object)
      {
         for (let key in object)
         {
            queryParamsArray.push(`${key}=${encodeURIComponent(object[key])}`);
         }
      }

      return (queryParamsArray.join("&"));
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   async function reloadWidget(widgetName: string, additionalQueryParamsForWidget: { [key: string]: any })
   {
      const widgetData = await qController.widget(widgetName, makeQueryStringWithIdAndObject(tableMetaData, additionalQueryParamsForWidget));
      const widgetMetaData = metaData.widgets.get(widgetName);

      /////////////////////////////////////////////////////////////////////////////////////////////////////
      // todo - rename this - it holds all widget dta, not just child-lists.  also, the type is wrong... //
      /////////////////////////////////////////////////////////////////////////////////////////////////////
      const newChildListWidgetData: { [name: string]: ChildRecordListData } = Object.assign({}, childListWidgetData);
      newChildListWidgetData[widgetName] = widgetData;
      setChildListWidgetData(newChildListWidgetData);

      const newRenderedWidgetSections = Object.assign({}, renderedWidgetSections);
      newRenderedWidgetSections[widgetName] = getWidgetSection(widgetMetaData, widgetData);
      setRenderedWidgetSections(newRenderedWidgetSections);
      forceUpdate();
   }


   /*******************************************************************************
    ** process a form-field having a changed value (e.g., apply field rules).
    *******************************************************************************/
   function handleChangedFieldValue(fieldName: string, oldValue: any, newValue: any, valueChangesToMake: { [fieldName: string]: any })
   {
      for (let fieldRule of fieldRules)
      {
         if (fieldRule.trigger == FieldRuleTrigger.ON_CHANGE && fieldRule.sourceField == fieldName)
         {
            switch (fieldRule.action)
            {
               case FieldRuleAction.CLEAR_TARGET_FIELD:
                  console.log(`Clearing value from [${fieldRule.targetField}] due to change in [${fieldName}]`);
                  valueChangesToMake[fieldRule.targetField] = null;
                  break;
               case FieldRuleAction.RELOAD_WIDGET:
                  const additionalQueryParamsForWidget: { [key: string]: any } = {};
                  additionalQueryParamsForWidget[fieldRule.sourceField] = newValue;
                  reloadWidget(fieldRule.targetWidget, additionalQueryParamsForWidget);
            }
         }
      }
   }

   const formId = props.id != null ? `edit-${tableMetaData?.name}-form` : `create-${tableMetaData?.name}-form`;

   let body;

   const getSectionHelp = (section: QTableSection) =>
   {
      const helpRoles = [props.id ? "EDIT_SCREEN" : "INSERT_SCREEN", "WRITE_SCREENS", "ALL_SCREENS"];
      const formattedHelpContent = <HelpContent helpContents={section.helpContents} roles={helpRoles} helpContentKey={`table:${tableMetaData.name};section:${section.name}`} />;

      return formattedHelpContent && (
         <Box px={"1.5rem"} fontSize={"0.875rem"}>
            {formattedHelpContent}
         </Box>
      );
   };

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
      body = (
         <Box mb={3} className="entityForm">
            {
               (alertContent || warningContent) &&
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
            }
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
                        setFieldValue,
                        dirty
                     }) =>
                     {
                        /////////////////////////////////////////////////
                        // if we have values from formik, look at them //
                        /////////////////////////////////////////////////
                        if (values)
                        {
                           ////////////////////////////////////////////////////////////////////////
                           // use stringified values as cheap/easy way to see if any are changed //
                           ////////////////////////////////////////////////////////////////////////
                           const newFormValuesJSON = JSON.stringify(values);
                           if (formValuesJSON != newFormValuesJSON)
                           {
                              const valueChangesToMake: { [fieldName: string]: any } = {};

                              ////////////////////////////////////////////////////////////////////
                              // if the form is dirty (e.g., we're not doing the initial load), //
                              // then process rules for any changed fields                      //
                              ////////////////////////////////////////////////////////////////////
                              if (dirty)
                              {
                                 for (let fieldName in values)
                                 {
                                    if (formValues[fieldName] != values[fieldName])
                                    {
                                       handleChangedFieldValue(fieldName, formValues[fieldName], values[fieldName], valueChangesToMake);
                                    }
                                    formValues[fieldName] = values[fieldName];
                                 }
                              }
                              else
                              {
                                 /////////////////////////////////////////////////////////////////////////////////////
                                 // if the form is clean, make sure the formValues object has all form values in it //
                                 /////////////////////////////////////////////////////////////////////////////////////
                                 for (let fieldName in values)
                                 {
                                    formValues[fieldName] = values[fieldName];
                                 }
                              }

                              /////////////////////////////////////////////////////////////////////////////
                              // if there were any changes to be made from the rule evaluation,          //
                              // make those changes in the formValues map, and in formik (setFieldValue) //
                              /////////////////////////////////////////////////////////////////////////////
                              for (let fieldName in valueChangesToMake)
                              {
                                 formValues[fieldName] = valueChangesToMake[fieldName];
                                 setFieldValue(fieldName, valueChangesToMake[fieldName], false);
                              }

                              setFormValues(formValues);
                              setFormValuesJSON(JSON.stringify(values));
                           }
                        }

                        ///////////////////////////////////////////////////////////////////
                        // once we're in the formik form, use its setFieldValue function //
                        // over top of the default one we created globally               //
                        ///////////////////////////////////////////////////////////////////
                        formikSetFieldValueFunction = setFieldValue;

                        return (
                           <Form id={formId} autoComplete="off">
                              <ScrollToFirstError />

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
                                    {t1section && getSectionHelp(t1section)}
                                    {
                                       t1sectionName && formFields ? (
                                          <Box px={3}>
                                             <Box pb={"0.25rem"} width="100%">
                                                {getFormSection(t1section, values, touched, formFields.get(t1sectionName), errors, true)}
                                             </Box>
                                          </Box>
                                       ) : null
                                    }
                                 </Card>
                              </Box>
                              {formFields && nonT1Sections.length ? nonT1Sections.map((section: QTableSection) => (
                                 <Box key={`edit-card-${section.name}`} pb={3}>
                                    {renderSection(section, values, touched, formFields, errors)}
                                 </Box>
                              )) : null}

                              <Box component="div" p={3}>
                                 <Grid container justifyContent="flex-end" spacing={3}>
                                    <QCancelButton onClickHandler={props.isModal ? props.closeModalHandler : handleCancelClicked} disabled={isSubmitting} />
                                    <QSaveButton disabled={isSubmitting} />
                                 </Grid>
                              </Box>

                           </Form>
                        );
                     }}
                  </Formik>

                  {
                     showEditChildForm &&
                     <Modal open={showEditChildForm as boolean} onClose={(event, reason) => closeEditChildForm(event, reason)}>
                        <div className="modalEditForm">
                           <EntityForm
                              isModal={true}
                              closeModalHandler={closeEditChildForm}
                              table={showEditChildForm.table}
                              defaultValues={showEditChildForm.defaultValues}
                              disabledFields={showEditChildForm.disabledFields}
                              onSubmitCallback={submitEditChildForm}
                              overrideHeading={`${showEditChildForm.rowIndex != null ? "Editing" : "Creating New"} ${showEditChildForm.table.label}`}
                           />
                        </div>
                     </Modal>
                  }

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
               <span id="modalTopReference"></span>
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

function ScrollToFirstError(): JSX.Element
{
   const {submitCount, isValid} = useFormikContext();

   useEffect(() =>
   {
      /////////////////////////////////////////////////////////////////////////////
      // Wrap the code in setTimeout to make sure it runs after the DOM has been //
      // updated and has the error message elements.                             //
      /////////////////////////////////////////////////////////////////////////////
      setTimeout(() =>
      {
         ////////////////////////////////////////
         // Only run on submit or if not valid //
         ////////////////////////////////////////
         if (submitCount === 0 || isValid)
         {
            return;
         }

         //////////////////////////////////
         // Find the first error message //
         //////////////////////////////////
         const errorMessageSelector = "[data-field-error]";
         const firstErrorMessage = document.querySelector(errorMessageSelector);
         if (!firstErrorMessage)
         {
            console.warn(`Form failed validation but no error field was found with selector: ${errorMessageSelector}`);
            return;
         }
         firstErrorMessage.scrollIntoView({block: "center"});

      }, 100);
   }, [submitCount, isValid]);

   return null;
}


export default EntityForm;
