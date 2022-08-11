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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import {useFormikContext} from "formik";
import React from "react";
import QDynamicFormField from "qqq/components/QDynamicFormField";

interface Props {
  formLabel?: string;
  formData: any;
  bulkEditMode?: boolean;
  bulkEditSwitchChangeHandler?: any
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

   const fileChanged = (event: React.FormEvent<HTMLInputElement>, field: any) =>
   {
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

               if (field.type === "file")
               {
                  return (
                     <Grid item xs={12} sm={6} key={fieldName}>
                        <MDBox mb={1.5}>
                           <input
                              id={fieldName}
                              name={fieldName}
                              type="file"
                              onChange={(event: React.FormEvent<HTMLInputElement>) => fileChanged(event, field)}
                           />
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
   {},
};

export default QDynamicForm;
