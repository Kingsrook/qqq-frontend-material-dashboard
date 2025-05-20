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

import {AdornmentType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/AdornmentType";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import QDynamicFormField from "qqq/components/forms/DynamicFormField";
import DynamicSelect from "qqq/components/forms/DynamicSelect";
import FileInputField from "qqq/components/forms/FileInputField";
import MDTypography from "qqq/components/legacy/MDTypography";
import HelpContent from "qqq/components/misc/HelpContent";
import React from "react";

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
   const {formFields, values, errors, touched} = formData;

   const bulkEditSwitchChanged = (name: string, value: boolean) =>
   {
      bulkEditSwitchChangeHandler(name, value);
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
                           <Grid item lg={itemLG} xs={itemXS} sm={itemSM} flexDirection="column" key={fieldName}>
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
                           <Grid item lg={itemLG} xs={itemXS} sm={itemSM} key={fieldName}>
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
                              />
                              {formattedHelpContent}
                           </Grid>
                        );
                     }

                     ///////////////////////
                     // everything else!! //
                     ///////////////////////
                     return (
                        <Grid item lg={itemLG} xs={itemXS} sm={itemSM} key={fieldName}>
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
