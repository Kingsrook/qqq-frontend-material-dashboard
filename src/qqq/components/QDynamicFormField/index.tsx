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
import {ErrorMessage, Field, FieldProps, useFormikContext} from "formik";
import React, {useState} from "react";
import AceEditor from "react-ace";
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
   bulkEditSwitchChangeHandler?: any;
   formFieldObject: any; // is the type returned by DynamicFormUtils.getDynamicField
}

function QDynamicFormField({
   label, name, displayFormat, value, bulkEditMode, bulkEditSwitchChangeHandler, type, isEditable, formFieldObject, ...rest
}: Props): JSX.Element
{
   const [switchChecked, setSwitchChecked] = useState(false);
   const [isDisabled, setIsDisabled] = useState(!isEditable || bulkEditMode);

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

   // @ts-ignore
   const handleOnWheel = (e) =>
   {
      if (type.toLowerCase().match("number"))
      {
         e.target.blur();
      }
   };

   let field;
   let getsBulkEditHtmlLabel = true;
   if (type === "checkbox")
   {
      getsBulkEditHtmlLabel = false;
      field = (<QBooleanFieldSwitch name={name} label={label} value={value} isDisabled={isDisabled} />);
   }
   else if (type === "ace")
   {
      let mode = "text";
      if(formFieldObject && formFieldObject.languageMode)
      {
         mode = formFieldObject.languageMode;
      }

      getsBulkEditHtmlLabel = false;
      field = (
         <>
            <InputLabel shrink={true}>{label}</InputLabel>
            <AceEditor
               mode={mode}
               theme="github"
               name="editor"
               editorProps={{$blockScrolling: true}}
               onChange={(value: string, event: any) =>
               {
                  setFieldValue(name, value, false);
               }}
               width="100%"
               height="300px"
               value={value}
               style={{border: "1px solid gray"}}
            />
         </>
      );
   }
   else
   {
      field = (
         <>
            <Field {...rest} onWheel={handleOnWheel} name={name} type={type} as={MDInput} variant="standard" label={label} InputLabelProps={inputLabelProps} InputProps={inputProps} fullWidth disabled={isDisabled}
               onKeyPress={(e: any) =>
               {
                  if (e.key === "Enter")
                  {
                     e.preventDefault();
                  }
               }}
            />
            <MDBox mt={0.75}>
               <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  {!isDisabled && <div className="fieldErrorMessage"><ErrorMessage name={name} /></div>}
               </MDTypography>
            </MDBox>
         </>
      );
   }

   const bulkEditSwitchChanged = () =>
   {
      setBulkEditSwitch(!switchChecked);
   };

   const setBulkEditSwitch = (value: boolean) =>
   {
      const newSwitchValue = value;
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
            <Box width="100%" sx={{background: (type == "checkbox" && isDisabled) ? "#f0f2f5!important" : "initial"}}>
               {
                  getsBulkEditHtmlLabel
                     ? (<label htmlFor={`bulkEditSwitch-${name}`}>
                        {field}
                     </label>)
                     : <div onClick={() => setBulkEditSwitch(true)}>{field}</div>
               }
            </Box>
         </Box>
      );
   }
   else
   {
      return (
         <MDBox mb={1.5}>
            {field}
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
