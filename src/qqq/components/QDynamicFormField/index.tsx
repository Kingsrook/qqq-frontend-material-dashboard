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

import {InputAdornment, InputLabel} from "@mui/material";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import {ErrorMessage, Field, useFormikContext} from "formik";
import React, {SyntheticEvent, useState} from "react";
import QBooleanFieldSwitch from "qqq/components/QDynamicFormField/QBooleanFieldSwitch";
import MDBox from "qqq/components/Temporary/MDBox";
import MDInput from "qqq/components/Temporary/MDInput";
import MDTypography from "qqq/components/Temporary/MDTypography";

// Declaring props types for FormField
interface Props
{
   label: string;
   name: string;
   displayFormat: string;
   value: any;
   type: string;
   isEditable?: boolean;
   [key: string]: any;
   bulkEditMode?: boolean;
   bulkEditSwitchChangeHandler?: any
}

function QDynamicFormField({
   label, name, displayFormat, value, bulkEditMode, bulkEditSwitchChangeHandler, type, isEditable, ...rest
}: Props): JSX.Element
{
   const [ switchChecked, setSwitchChecked ] = useState(false);
   const [ isDisabled, setIsDisabled ] = useState(!isEditable || bulkEditMode);

   const {setFieldValue} = useFormikContext();

   const inputLabelProps = {};
   if (type.toLowerCase().match("(date|time)"))
   {
      // @ts-ignore
      inputLabelProps.shrink = true;
   }

   const inputProps = {};
   if (displayFormat && displayFormat.startsWith("$"))
   {
      // @ts-ignore
      inputProps.startAdornment = <InputAdornment position="start">$</InputAdornment>;
   }
   if (displayFormat && displayFormat.endsWith("%%"))
   {
      // @ts-ignore
      inputProps.endAdornment = <InputAdornment position="end">%</InputAdornment>;
   }

   const field = () =>
      (type == "checkbox" ?
         <QBooleanFieldSwitch name={name} label={label} value={value} isDisabled={isDisabled} /> :
         <>
            <Field {...rest} name={name} type={type} as={MDInput} variant="standard" label={label} InputLabelProps={inputLabelProps} InputProps={inputProps} fullWidth disabled={isDisabled} />
            <MDBox mt={0.75}>
               <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  {!isDisabled && <div className="fieldErrorMessage"><ErrorMessage name={name} /></div>}
               </MDTypography>
            </MDBox>
         </>
      );

   const bulkEditSwitchChanged = () =>
   {
      const newSwitchValue = !switchChecked;
      setSwitchChecked(newSwitchValue);
      setIsDisabled(!newSwitchValue);
      bulkEditSwitchChangeHandler(name, newSwitchValue);
   };

   if (bulkEditMode)
   {
      return (
         <Box mb={1.5} display="flex" flexDirection="row">
            <Box alignItems="baseline" pt={1}>
               <Switch
                  id={`bulkEditSwitch-${name}`}
                  checked={switchChecked}
                  onClick={bulkEditSwitchChanged}
               />
            </Box>
            <Box width="100%">
               {/* for checkboxes, if we put the whole thing in a label, we get bad overly aggressive toggling of the outer switch... */}
               {(type == "checkbox" ?
                  field() :
                  <label htmlFor={`bulkEditSwitch-${name}`}>
                     {field()}
                  </label>
               )}
            </Box>
         </Box>
      );
   }
   else
   {
      return (
         <MDBox mb={1.5}>
            {field()}
         </MDBox>
      );
   }
}

QDynamicFormField.defaultProps = {
   bulkEditMode: false,
   isEditable: true,
   bulkEditSwitchChangeHandler: () =>
   {
   },
};

export default QDynamicFormField;
