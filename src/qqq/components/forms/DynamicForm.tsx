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

import {AdornmentType} from "@qrunio/qqq-frontend-core/lib/model/metaData/AdornmentType";
import {QFieldMetaData} from "@qrunio/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QRecord} from "@qrunio/qqq-frontend-core/lib/model/QRecord";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useFormikContext} from "formik";
import QDynamicFormField from "qqq/components/forms/DynamicFormField";
import DynamicFormUtils from "qqq/components/forms/DynamicFormUtils";
import DynamicSelect from "qqq/components/forms/DynamicSelect";
import FileInputField from "qqq/components/forms/FileInputField";
import MDTypography from "qqq/components/legacy/MDTypography";
import HelpContent from "qqq/components/misc/HelpContent";
import Client from "qqq/utils/qqq/Client";
import React, {useEffect, useState} from "react";

const qController = Client.getInstance();

interface Props
{
   formLabel?: string;
   formData: any;
   bulkEditMode?: boolean;
   bulkEditSwitchChangeHandler?: any;
   record?: QRecord;
   helpRoles?: string[];
   helpContentKeyPrefix?: string;
}

function QDynamicForm({formData, formLabel, bulkEditMode, bulkEditSwitchChangeHandler, record, helpRoles, helpContentKeyPrefix}: Props): JSX.Element
{
   const {formFields: origFormFields, errors, touched} = formData;
   const {setFieldValue, values} = useFormikContext<Record<string, any>>();

   const [formAdjustmentCounter, setFormAdjustmentCounter] = useState(0)

   const [formFields, setFormFields] = useState(origFormFields as {[key: string]: any});

   const bulkEditSwitchChanged = (name: string, value: boolean) =>
   {
      bulkEditSwitchChangeHandler(name, value);
   };


   /////////////////////////////////////////
   // run on-load handlers if we have any //
   /////////////////////////////////////////
   useEffect(() =>
   {
      for (let fieldName in formFields)
      {
         const field = formFields[fieldName];

         const materialDashboardFieldMetaData = field.fieldMetaData?.supplementalFieldMetaData?.get("materialDashboard");
         if(materialDashboardFieldMetaData?.onLoadFormAdjuster)
         {
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            // todo consider cases with multiple - do they need to list a sequenceNo? do they need to run serially? //
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            considerRunningFormAdjuster("onLoad", fieldName, values[fieldName]);
         }
      }
   }, []);


   /***************************************************************************
    **
    ***************************************************************************/
   const handleFieldChange = async (fieldName: string, newValue: any) =>
   {
      const field = formFields[fieldName];
      if (!field)
      {
         return;
      }

      //////////////////////////////////////////////////////////////////////
      // map possible-value objects to ids - also capture their labels... //
      //////////////////////////////////////////////////////////////////////
      let actualNewValue = newValue;
      let possibleValueLabel: string = null;
      if (field.possibleValueProps)
      {
         actualNewValue = newValue ? newValue.id : null;
         possibleValueLabel = newValue ? newValue.label : null;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////
      // make sure formik has the value - and that we capture the possible-value label if needed //
      /////////////////////////////////////////////////////////////////////////////////////////////
      setFieldValue(fieldName, actualNewValue);
      if (field.possibleValueProps)
      {
         field.possibleValueProps.initialDisplayValue = possibleValueLabel;
      }

      ///////////////////////////////////////////
      // run onChange adjuster if there is one //
      ///////////////////////////////////////////
      considerRunningFormAdjuster("onChange", fieldName, actualNewValue);
   }


   /***************************************************************************
    **
    ***************************************************************************/
   const considerRunningFormAdjuster = async (event: "onChange" | "onLoad", fieldName: string, newValue: any) =>
   {
      const field = formFields[fieldName];
      if (!field)
      {
         return;
      }

      const materialDashboardFieldMetaData = field.fieldMetaData?.supplementalFieldMetaData?.get("materialDashboard");
      const adjuster = event == "onChange" ? materialDashboardFieldMetaData?.onChangeFormAdjuster : materialDashboardFieldMetaData?.onLoadFormAdjuster;
      if (!adjuster)
      {
         return;
      }

      console.log(`Running form adjuster for field ${fieldName} ${event} (value is: ${newValue})`);

      //////////////////////////////////////////////////////////////////
      // disable fields temporarily while waiting on backend response //
      //////////////////////////////////////////////////////////////////
      const fieldNamesToTempDisable: string[] = materialDashboardFieldMetaData?.fieldsToDisableWhileRunningAdjusters ?? []
      const previousIsEditableValues: {[key: string]: boolean} = {};
      if(fieldNamesToTempDisable.length > 0)
      {
         for (let oldFieldName in formFields)
         {
            if (fieldNamesToTempDisable.indexOf(oldFieldName) > -1)
            {
               previousIsEditableValues[oldFieldName] = formFields[oldFieldName].isEditable;
               formFields[oldFieldName].isEditable = false;
            }
         }

         setFormAdjustmentCounter(formAdjustmentCounter + 1);
         setFormFields({...formFields});
      }

      ////////////////////////////////////////////////////
      // build request to backend for field adjustments //
      ////////////////////////////////////////////////////
      const postBody = new FormData();
      postBody.append("event", event);
      postBody.append("fieldName", fieldName);
      postBody.append("newValue", newValue);
      postBody.append("allValues", JSON.stringify(values));
      const response = await qController.axiosRequest(
         {
            method: "post",
            url: `/material-dashboard-backend/form-adjuster/${encodeURIComponent(materialDashboardFieldMetaData.formAdjusterIdentifier)}/${event}`,
            data: postBody,
            headers: qController.defaultMultipartFormDataHeaders()
         });
      console.log("Form adjuster response: " + JSON.stringify(response));

      ////////////////////////////////////////////////////
      // un-disable any temp disabled fields from above //
      ////////////////////////////////////////////////////
      if(fieldNamesToTempDisable.length > 0)
      {
         for (let oldFieldName in formFields)
         {
            if (fieldNamesToTempDisable.indexOf(oldFieldName) > -1)
            {
               formFields[oldFieldName].isEditable = previousIsEditableValues[oldFieldName];
            }
         }
         setFormFields({...formFields});
      }

      ///////////////////////////////////////////////////
      // replace field definitions, if we have updates //
      ///////////////////////////////////////////////////
      const updatedFields: { [fieldName: string]: QFieldMetaData } = response.updatedFieldMetaData;
      if(updatedFields)
      {
         for (let updatedFieldName in updatedFields)
         {
            const updatedField = new QFieldMetaData(updatedFields[updatedFieldName]);
            const dynamicField = DynamicFormUtils.getDynamicField(updatedField); // todo dynamicallyDisabledFields? second param...

            const dynamicFieldInObject: any = {};
            dynamicFieldInObject[updatedFieldName] = dynamicField;
            let tableName = null;
            let processName = null;
            let displayValues = new Map();

            DynamicFormUtils.addPossibleValueProps(dynamicFieldInObject, [updatedFields[updatedFieldName]], tableName, processName, displayValues);
            for (let oldFieldName in formFields)
            {
               if (oldFieldName == updatedFieldName)
               {
                  formFields[updatedFieldName] = dynamicField;
               }
            }
         }

         setFormAdjustmentCounter(formAdjustmentCounter + 2);
         setFormFields({...formFields});
      }

      /////////////////////////
      // update field values //
      /////////////////////////
      const updatedFieldValues: {[fieldName: string]: any} = response?.updatedFieldValues ?? {};
      for (let fieldNameToUpdate in updatedFieldValues)
      {
         setFieldValue(fieldNameToUpdate, updatedFieldValues[fieldNameToUpdate]);
         ///////////////////////////////////////////////////////////////////////////////////////
         // todo - track if a pvs field gets a value, but not a display value, and fetch it?? //
         ///////////////////////////////////////////////////////////////////////////////////////
      }

      /////////////////////////////////////////////////
      // set display values in PVS's if we have them //
      /////////////////////////////////////////////////
      const updatedFieldDisplayValues: {[fieldName: string]: any} = response?.updatedFieldDisplayValues ?? {};
      for (let fieldNameToUpdate in updatedFieldDisplayValues)
      {
         const fieldToUpdate = formFields[fieldNameToUpdate];
         if(fieldToUpdate?.possibleValueProps)
         {
            fieldToUpdate.possibleValueProps.initialDisplayValue = updatedFieldDisplayValues[fieldNameToUpdate];
         }
      }

      ////////////////////////////////////////
      // clear field values if we have them //
      ////////////////////////////////////////
      const fieldsToClear: string[] = response?.fieldsToClear ?? [];
      for (let fieldToClear of fieldsToClear)
      {
         setFieldValue(fieldToClear, "");
      }
   };


   return (
      <Box>
         <Box lineHeight={0}>
            <MDTypography variant="h5">{formLabel}</MDTypography>
         </Box>
         <Box mt={1.625}>
            <Grid container lg={12} display="flex" spacing={3}>
               {formFields
                  && Object.keys(formFields).length > 0
                  && Object.keys(formFields).map((fieldName: any) =>
                  {
                     const field = formFields[fieldName];
                     if (field.omitFromQDynamicForm)
                     {
                        return null;
                     }

                     const display = field.fieldMetaData?.isHidden ? "none" : "initial";

                     if (values[fieldName] === undefined)
                     {
                        values[fieldName] = "";
                     }

                     let formattedHelpContent = <HelpContent helpContents={field?.fieldMetaData?.helpContents} roles={helpRoles} helpContentKey={`${helpContentKeyPrefix ?? ""}field:${fieldName}`} />;
                     if (formattedHelpContent)
                     {
                        formattedHelpContent = <Box color="#757575" fontSize="0.875rem" mt="-0.25rem">{formattedHelpContent}</Box>;
                     }

                     const labelElement = <DynamicFormFieldLabel name={field.name} label={field.label} />;

                     let itemLG = (field?.fieldMetaData?.gridColumns && field?.fieldMetaData?.gridColumns > 0) ? field.fieldMetaData.gridColumns : 6;
                     let itemXS = 12;
                     let itemSM = 6;

                     /////////////
                     // files!! //
                     /////////////
                     if (field.type === "file")
                     {
                        const fileUploadAdornment = field.fieldMetaData?.getAdornment(AdornmentType.FILE_UPLOAD);
                        const width = fileUploadAdornment?.values?.get("width") ?? "half";

                        if (width == "full")
                        {
                           itemSM = 12;
                           itemLG = 12;
                        }

                        return (
                           <Grid item lg={itemLG} xs={itemXS} sm={itemSM} flexDirection="column" key={fieldName + "-" + formAdjustmentCounter}>
                              {labelElement}
                              <FileInputField field={field} record={record} errorMessage={errors[fieldName]} />
                           </Grid>
                        );
                     }

                     ///////////////////////
                     // possible values!! //
                     ///////////////////////
                     else if (field.possibleValueProps)
                     {
                        const otherValuesMap = field.possibleValueProps.otherValues ?? new Map<string, any>();
                        Object.keys(values).forEach((key) =>
                        {
                           otherValuesMap.set(key, values[key]);
                        });

                        return (
                           <Grid item display={display} lg={itemLG} xs={itemXS} sm={itemSM} key={fieldName + "-" + formAdjustmentCounter}>
                              {labelElement}
                              <DynamicSelect
                                 fieldPossibleValueProps={field.possibleValueProps}
                                 isEditable={field.isEditable}
                                 fieldLabel=""
                                 initialValue={values[fieldName]}
                                 bulkEditMode={bulkEditMode}
                                 bulkEditSwitchChangeHandler={bulkEditSwitchChanged}
                                 otherValues={otherValuesMap}
                                 useCase="form"
                                 onChange={(newValue: any) => handleFieldChange(fieldName, newValue)}
                              />
                              {formattedHelpContent}
                           </Grid>
                        );
                     }

                     ///////////////////////
                     // everything else!! //
                     ///////////////////////
                     return (
                        <Grid item display={display} lg={itemLG} xs={itemXS} sm={itemSM} key={fieldName + "-" + formAdjustmentCounter}>
                           {labelElement}
                           <QDynamicFormField
                              id={field.name}
                              type={field.type}
                              label=""
                              isEditable={field.isEditable}
                              name={fieldName}
                              displayFormat={field.displayFormat}
                              value={values[fieldName]}
                              error={errors[fieldName] && touched[fieldName]}
                              bulkEditMode={bulkEditMode}
                              bulkEditSwitchChangeHandler={bulkEditSwitchChanged}
                              success={`${values[fieldName]}` !== "" && !errors[fieldName] && touched[fieldName]}
                              formFieldObject={field}
                              onChangeCallback={(newValue) => handleFieldChange(fieldName, newValue)}
                           />
                           {formattedHelpContent}
                        </Grid>
                     );
                  })}
            </Grid>
         </Box>
      </Box>
   );
}

QDynamicForm.defaultProps = {
   formLabel: undefined,
   bulkEditMode: false,
   helpRoles: ["ALL_SCREENS"],
   bulkEditSwitchChangeHandler: () =>
   {
   },
};


interface DynamicFormFieldLabelProps
{
   name: string;
   label: string;
}

export function DynamicFormFieldLabel({name, label}: DynamicFormFieldLabelProps): JSX.Element
{
   return (<Box fontSize="1rem" fontWeight="500" marginBottom="0.25rem">
      <label htmlFor={name}>{label}</label>
   </Box>);
}


export default QDynamicForm;
