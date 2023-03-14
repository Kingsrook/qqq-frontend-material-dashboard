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

import {Collapse, Theme} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {SxProps} from "@mui/system";
import {Field, Form, Formik} from "formik";
import React, {useState} from "react";
import MDInput from "qqq/components/legacy/MDInput";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";


export interface DropdownOption
{
   id: string;
   label: string;
}

/////////////////////////
// inputs and defaults //
/////////////////////////
interface Props
{
   name: string;
   defaultValue?: any;
   label?: string;
   dropdownOptions?: DropdownOption[];
   onChangeCallback?: (dropdownLabel: string, data: any) => void;
   sx?: SxProps<Theme>;
}

interface StartAndEndDate
{
   startDate?: string,
   endDate?: string
}

function parseCustomTimeValuesFromDefaultValue(defaultValue: any): StartAndEndDate
{
   const customTimeValues: StartAndEndDate = {};
   if(defaultValue && defaultValue.id)
   {
      var parts = defaultValue.id.split(",");
      if(parts.length >= 2)
      {
         customTimeValues["startDate"] = ValueUtils.formatDateTimeValueForForm(parts[1]);
      }
      if(parts.length >= 3)
      {
         customTimeValues["endDate"] = ValueUtils.formatDateTimeValueForForm(parts[2]);
      }
   }

   return (customTimeValues);
}

function makeBackendValuesFromFrontendValues(frontendDefaultValues: StartAndEndDate): StartAndEndDate
{
   const backendTimeValues: StartAndEndDate = {};
   if(frontendDefaultValues && frontendDefaultValues.startDate)
   {
      backendTimeValues.startDate = FilterUtils.frontendLocalZoneDateTimeStringToUTCStringForBackend(frontendDefaultValues.startDate);
   }
   if(frontendDefaultValues && frontendDefaultValues.endDate)
   {
      backendTimeValues.endDate = FilterUtils.frontendLocalZoneDateTimeStringToUTCStringForBackend(frontendDefaultValues.endDate);
   }
   return (backendTimeValues);
}

function DropdownMenu({name, defaultValue, label, dropdownOptions, onChangeCallback, sx}: Props): JSX.Element
{
   const [customTimesVisible, setCustomTimesVisible] = useState(defaultValue && defaultValue.id && defaultValue.id.startsWith("custom,"));
   const [customTimeValuesFrontend, setCustomTimeValuesFrontend] = useState(parseCustomTimeValuesFromDefaultValue(defaultValue) as StartAndEndDate);
   const [customTimeValuesBackend, setCustomTimeValuesBackend] = useState(makeBackendValuesFromFrontendValues(customTimeValuesFrontend) as StartAndEndDate);
   const [debounceTimeout, setDebounceTimeout] = useState(null as any);

   const handleOnChange = (event: any, newValue: any, reason: string) =>
   {
      const isTimeframeCustom = name == "timeframe" && newValue && newValue.id == "custom"
      setCustomTimesVisible(isTimeframeCustom);

      if(isTimeframeCustom)
      {
         callOnChangeCallbackIfCustomTimeframeHasDateValues();
      }
      else
      {
         onChangeCallback(label, newValue);
      }
   };

   const callOnChangeCallbackIfCustomTimeframeHasDateValues = () =>
   {
      if(customTimeValuesBackend["startDate"] && customTimeValuesBackend["endDate"])
      {
         onChangeCallback(label, {id: `custom,${customTimeValuesBackend["startDate"]},${customTimeValuesBackend["endDate"]}`, label: "Custom"});
      }
   }

   let customTimes = <></>;
   if (name == "timeframe")
   {
      const handleSubmit = async (values: any, actions: any) =>
      {
      };

      const dateChanged = (fieldName: "startDate" | "endDate", event: any) =>
      {
         customTimeValuesFrontend[fieldName] = event.target.value;
         customTimeValuesBackend[fieldName] = FilterUtils.frontendLocalZoneDateTimeStringToUTCStringForBackend(event.target.value);

         clearTimeout(debounceTimeout);
         const newDebounceTimeout = setTimeout(() =>
         {
            callOnChangeCallbackIfCustomTimeframeHasDateValues();
         }, 500);
         setDebounceTimeout(newDebounceTimeout);
      };

      customTimes = <Box sx={{display: "inline-block", position: "relative", top: "-7px"}}>
         <Collapse orientation="horizontal" in={customTimesVisible}>
            <Formik initialValues={customTimeValuesFrontend} onSubmit={handleSubmit}>
               {({}) => (
                  <Form id="timeframe-form" autoComplete="off">
                     <Field name="startDate" type="datetime-local" as={MDInput} variant="standard" label="Custom Timeframe Start" InputLabelProps={{shrink: true}} InputProps={{size: "small"}} sx={{ml: 2, width: 198}} onChange={(event: any) => dateChanged("startDate", event)} />
                     <Field name="endDate" type="datetime-local" as={MDInput} variant="standard" label="Custom Timeframe End" InputLabelProps={{shrink: true}} InputProps={{size: "small"}} sx={{ml: 2, width: 198}} onChange={(event: any) => dateChanged("endDate", event)} />
                  </Form>
               )}
            </Formik>
         </Collapse>
      </Box>;
   }

   return (
      dropdownOptions ? (
         <span style={{whiteSpace: "nowrap", display: "flex"}} className="dashboardDropdownMenu">
            <Autocomplete
               defaultValue={defaultValue}
               size="small"
               disablePortal
               id={`${label}-combo-box`}
               options={dropdownOptions}
               sx={{...sx, cursor: "pointer", display: "inline-block"}}
               onChange={handleOnChange}
               isOptionEqualToValue={(option, value) => option.id === value.id}
               renderInput={(params: any) => <TextField {...params} label={label} />}
               renderOption={(props, option: DropdownOption) => (
                  <li {...props} style={{whiteSpace: "normal"}}>{option.label}</li>
               )}
            />
            {customTimes}
         </span>
      ) : null
   );
}

export default DropdownMenu;
