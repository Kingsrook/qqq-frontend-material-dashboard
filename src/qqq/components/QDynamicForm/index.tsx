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

import {colors} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {useFormikContext} from "formik";
import React, {useState} from "react";
import QDynamicFormField from "qqq/components/QDynamicFormField";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

interface Props
{
   formLabel?: string;
   formData: any;
   bulkEditMode?: boolean;
   bulkEditSwitchChangeHandler?: any;
}

function QDynamicForm(props: Props): JSX.Element
{
   const {
      formData, formLabel, bulkEditMode, bulkEditSwitchChangeHandler,
   } = props;
   const {
      formFields, values, errors, touched,
   } = formData;

   const formikProps = useFormikContext();
   const [fileName, setFileName] = useState(null as string);

   const fileChanged = (event: React.FormEvent<HTMLInputElement>, field: any) =>
   {
      setFileName(null)
      if(event.currentTarget.files && event.currentTarget.files[0])
      {
         setFileName(event.currentTarget.files[0].name)
      }

      formikProps.setFieldValue(field.name, event.currentTarget.files[0]);
   };

   const bulkEditSwitchChanged = (name: string, value: boolean) =>
   {
      bulkEditSwitchChangeHandler(name, value);
   };

   return (
      <MDBox>
         <MDBox lineHeight={0}>
            <MDTypography variant="h5">{formLabel}</MDTypography>
            {/* TODO - help text
        <MDTypography variant="button" color="text">
          Mandatory information
        </MDTypography>
        */}
         </MDBox>
         <MDBox mt={1.625}>
            <Grid container spacing={3}>
               {formFields
                  && Object.keys(formFields).length > 0
                  && Object.keys(formFields).map((fieldName: any) =>
                  {
                     const field = formFields[fieldName];
                     if (values[fieldName] === undefined)
                     {
                        values[fieldName] = "";
                     }

                     if (field.omitFromQDynamicForm)
                     {
                        return null;
                     }

                     if (field.type === "file")
                     {
                        return (
                           <Grid item xs={12} sm={6} key={fieldName}>
                              <MDBox mb={1.5}>

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

                                 <MDBox mt={0.75}>
                                    <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                                       {errors[fieldName] && <span>You must select a file to proceed</span>}
                                    </MDTypography>
                                 </MDBox>
                              </MDBox>
                           </Grid>
                        );
                     }

                     // todo? inputProps={{ autoComplete: "" }}
                     // todo? placeholder={password.placeholder}
                     return (
                        <Grid item xs={12} sm={6} key={fieldName}>
                           <QDynamicFormField
                              type={field.type}
                              label={field.label}
                              isEditable={field.isEditable}
                              name={fieldName}
                              displayFormat={field.displayFormat}
                              value={values[fieldName]}
                              error={errors[fieldName] && touched[fieldName]}
                              bulkEditMode={bulkEditMode}
                              bulkEditSwitchChangeHandler={bulkEditSwitchChanged}
                              success={`${values[fieldName]}` !== "" && !errors[fieldName] && touched[fieldName]}
                           />
                        </Grid>
                     );
                  })}
            </Grid>
         </MDBox>
      </MDBox>
   );
}

QDynamicForm.defaultProps = {
   formLabel: undefined,
   bulkEditMode: false,
   bulkEditSwitchChangeHandler: () =>
   {
   },
};

export default QDynamicForm;
