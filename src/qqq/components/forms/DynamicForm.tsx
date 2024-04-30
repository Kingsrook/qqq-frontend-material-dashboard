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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {colors, Icon, InputLabel} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import {useFormikContext} from "formik";
import React, {useState} from "react";
import QDynamicFormField from "qqq/components/forms/DynamicFormField";
import DynamicSelect from "qqq/components/forms/DynamicSelect";
import MDTypography from "qqq/components/legacy/MDTypography";
import HelpContent from "qqq/components/misc/HelpContent";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

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

   const formikProps = useFormikContext();
   const [fileName, setFileName] = useState(null as string);

   const fileChanged = (event: React.FormEvent<HTMLInputElement>, field: any) =>
   {
      setFileName(null);
      if (event.currentTarget.files && event.currentTarget.files[0])
      {
         setFileName(event.currentTarget.files[0].name);
      }

      formikProps.setFieldValue(field.name, event.currentTarget.files[0]);
   };

   const removeFile = (fieldName: string) =>
   {
      setFileName(null);
      formikProps.setFieldValue(fieldName, null);
      record?.values.delete(fieldName)
      record?.displayValues.delete(fieldName)
   };

   const bulkEditSwitchChanged = (name: string, value: boolean) =>
   {
      bulkEditSwitchChangeHandler(name, value);
   };


   return (
      <Box>
         <Box lineHeight={0}>
            <MDTypography variant="h5">{formLabel}</MDTypography>
            {/* TODO - help text
        <MDTypography variant="button" color="text">
          Mandatory information
        </MDTypography>
        */}
         </Box>
         <Box mt={1.625}>
            <Grid container spacing={3}>
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

                     let formattedHelpContent = <HelpContent helpContents={field.fieldMetaData.helpContents} roles={helpRoles} helpContentKey={`${helpContentKeyPrefix ?? ""}field:${fieldName}`} />;
                     if(formattedHelpContent)
                     {
                        formattedHelpContent = <Box color="#757575" fontSize="0.875rem" mt="-0.25rem">{formattedHelpContent}</Box>
                     }

                     const labelElement = <Box fontSize="1rem" fontWeight="500" marginBottom="0.25rem">
                        <label htmlFor={field.name}>{field.label}</label>
                     </Box>

                     if (field.type === "file")
                     {
                        const pseudoField = new QFieldMetaData({name: fieldName, type: QFieldType.BLOB});
                        return (
                           <Grid item xs={12} sm={6} key={fieldName}>
                              <Box mb={1.5}>
                                 {labelElement}
                                 {
                                    record && record.values.get(fieldName) && <Box fontSize="0.875rem" pb={1}>
                                       Current File:
                                       <Box display="inline-flex" pl={1}>
                                          {ValueUtils.getDisplayValue(pseudoField, record, "view")}
                                          <Tooltip placement="bottom" title="Remove current file">
                                             <Icon className="blobIcon" fontSize="small" onClick={(e) => removeFile(fieldName)}>delete</Icon>
                                          </Tooltip>
                                       </Box>
                                    </Box>
                                 }
                                 <Box display="flex" alignItems="center">
                                    <Button variant="outlined" component="label">
                                       <span style={{color: colors.lightBlue[500]}}>Choose file to upload</span>
                                       <input
                                          id={fieldName}
                                          name={fieldName}
                                          type="file"
                                          hidden
                                          onChange={(event: React.FormEvent<HTMLInputElement>) => fileChanged(event, field)}
                                       />
                                    </Button>
                                    <Box ml={1} fontSize={"1rem"}>
                                       {fileName}
                                    </Box>
                                 </Box>

                                 <Box mt={0.75}>
                                    <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                                       {errors[fieldName] && <span>You must select a file to proceed</span>}
                                    </MDTypography>
                                 </Box>
                              </Box>
                           </Grid>
                        );
                     }

                     // possible values!!
                     if (field.possibleValueProps)
                     {
                        const otherValuesMap = field.possibleValueProps.otherValues ?? new Map<string, any>();
                        Object.keys(values).forEach((key) =>
                        {
                           otherValuesMap.set(key, values[key]);
                        })

                        return (
                           <Grid item xs={12} sm={6} key={fieldName}>
                              {labelElement}
                              <DynamicSelect
                                 tableName={field.possibleValueProps.tableName}
                                 processName={field.possibleValueProps.processName}
                                 possibleValueSourceName={field.possibleValueProps.possibleValueSourceName}
                                 fieldName={field.possibleValueProps.fieldName}
                                 isEditable={field.isEditable}
                                 fieldLabel=""
                                 initialValue={values[fieldName]}
                                 initialDisplayValue={field.possibleValueProps.initialDisplayValue}
                                 bulkEditMode={bulkEditMode}
                                 bulkEditSwitchChangeHandler={bulkEditSwitchChanged}
                                 otherValues={otherValuesMap}
                              />
                              {formattedHelpContent}
                           </Grid>
                        );
                     }

                     // todo? inputProps={{ autoComplete: "" }}
                     // todo? placeholder={password.placeholder}
                     return (
                        <Grid item xs={12} sm={6} key={fieldName}>
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

export default QDynamicForm;
