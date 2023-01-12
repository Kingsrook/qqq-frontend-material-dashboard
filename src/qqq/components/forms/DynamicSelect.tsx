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
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QPossibleValue} from "@kingsrook/qqq-frontend-core/lib/model/QPossibleValue";
import {Chip, CircularProgress, FilterOptionsState, Icon} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import {useFormikContext} from "formik";
import React, {useEffect, useState} from "react";
import Client from "qqq/utils/qqq/Client";

interface Props
{
   tableName: string;
   fieldName: string;
   fieldLabel: string;
   inForm: boolean;
   initialValue?: any;
   initialDisplayValue?: string;
   onChange?: any;
   isEditable?: boolean;
   bulkEditMode?: boolean;
   bulkEditSwitchChangeHandler?: any;
}

DynamicSelect.defaultProps = {
   inForm: true,
   initialValue: null,
   initialDisplayValue: null,
   onChange: null,
   isEditable: true,
   bulkEditMode: false,
   bulkEditSwitchChangeHandler: () =>
   {
   },
};

const qController = Client.getInstance();

function DynamicSelect({tableName, fieldName, fieldLabel, inForm, initialValue, initialDisplayValue, onChange, isEditable, bulkEditMode, bulkEditSwitchChangeHandler}: Props)
{
   const [ open, setOpen ] = useState(false);
   const [ options, setOptions ] = useState<readonly QPossibleValue[]>([]);
   const [ searchTerm, setSearchTerm ] = useState(null);
   const [ firstRender, setFirstRender ] = useState(true);
   // @ts-ignore
   const [defaultValue, _] = useState(initialValue && initialDisplayValue ? [{id: initialValue, label: initialDisplayValue}] : null);
   // const loading = open && options.length === 0;
   const [loading, setLoading] = useState(false);
   const [ switchChecked, setSwitchChecked ] = useState(false);
   const [ isDisabled, setIsDisabled ] = useState(!isEditable || bulkEditMode);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);

   let setFieldValueRef: (field: string, value: any, shouldValidate?: boolean) => void = null;
   if(inForm)
   {
      const {setFieldValue} = useFormikContext();
      setFieldValueRef = setFieldValue;
   }

   useEffect(() =>
   {
      if(firstRender)
      {
         // console.log("First render, so not searching...");
         setFirstRender(false);
         return;
      }
      // console.log("Use effect for searchTerm - searching!");

      let active = true;

      setLoading(true);
      (async () =>
      {
         // console.log(`doing a search with ${searchTerm}`);
         const results: QPossibleValue[] = await qController.possibleValues(tableName, fieldName, searchTerm ?? "");

         if(tableMetaData == null)
         {
            let tableMetaData: QTableMetaData = await qController.loadTableMetaData(tableName);
            setTableMetaData(tableMetaData);
         }

         setLoading(false);
         // console.log("Results:")
         // console.log(`${results}`);
         if (active)
         {
            setOptions([ ...results ]);
         }
      })();

      return () =>
      {
         active = false;
      };
   }, [ searchTerm ]);

   const inputChanged = (event: React.SyntheticEvent, value: string, reason: string) =>
   {
      console.log(`input changed.  Reason: ${reason}, setting search term to ${value}`);
      if(reason !== "reset")
      {
         // console.log(` -> setting search term to ${value}`);
         setSearchTerm(value);
      }
   };

   const handleBlur = (x: any) =>
   {
      setSearchTerm(null);
   }

   const handleChanged = (event: React.SyntheticEvent, value: any | any[], reason: string, details?: string) =>
   {
      // console.log("handleChanged.  value is:");
      // console.log(value);
      setSearchTerm(null);

      if(onChange)
      {
         onChange(value ? new QPossibleValue(value) : null);
      }
      else if(setFieldValueRef)
      {
         setFieldValueRef(fieldName, value ? value.id : null);
      }
   };

   const filterOptions = (options: { id: any; label: string; }[], state: FilterOptionsState<{ id: any; label: string; }>): { id: any; label: string; }[] =>
   {
      /////////////////////////////////////////////////////////////////////////////////
      // this looks like a no-op, but it's important to have, otherwise, we can only //
      // get options whose text/label matches the input (e.g., not ids that match)   //
      /////////////////////////////////////////////////////////////////////////////////
      return (options);
   }

   const renderOption = (props: Object, option: any) =>
   {
      let content = (<>{option.label}</>);

      try
      {
         const field = tableMetaData.fields.get(fieldName)
         if(field)
         {
            const adornment = field.getAdornment(AdornmentType.CHIP);
            if(adornment)
            {
               const color = adornment.getValue("color." + option.id) ?? "default"
               const iconName = adornment.getValue("icon." + option.id) ?? "circle";
               const iconElement = iconName ? <Icon>{iconName}</Icon> : null;
               content = (<Chip label={option.label} color={color} icon={iconElement} size="small" variant="outlined" sx={{fontWeight: 500}} />);
            }
         }
      }
      catch(e)
      { }

      ///////////////////////////////////////////////////////////////////////////////////////////////
      // we provide a custom renderOption method, to prevent a bug we saw during development,      //
      // where if multiple options had an identical label, then the widget would ... i don't know, //
      // show more options than it should - it was odd to see, and it could be fixed by changing   //
      // a PVS's format to include id - so the idea came, that maybe the LI's needed unique key    //
      // attributes.  so, doing this, w/ key=id, seemed to fix it.                                 //
      ///////////////////////////////////////////////////////////////////////////////////////////////
      return (
         <li {...props} key={option.id}>
            {content}
         </li>
      );
   }

   const bulkEditSwitchChanged = () =>
   {
      const newSwitchValue = !switchChecked;
      setSwitchChecked(newSwitchValue);
      setIsDisabled(!newSwitchValue);
      bulkEditSwitchChangeHandler(fieldName, newSwitchValue);
   };

   const autocomplete = (
      <Autocomplete
         id={fieldName}
         sx={{background: isDisabled ? "#f0f2f5!important" : "initial"}}
         open={open}
         fullWidth
         onOpen={() =>
         {
            setOpen(true);
            // console.log("setting open...");
            if(options.length == 0)
            {
               // console.log("no options yet, so setting search term to ''...");
               setSearchTerm("");
            }
         }}
         onClose={() =>
         {
            setOpen(false);
         }}
         isOptionEqualToValue={(option, value) => option.id === value.id}
         getOptionLabel={(option) =>
         {
            // @ts-ignore
            if(option && option.length)
            {
               // @ts-ignore
               option = option[0];
            }
            // @ts-ignore
            return option.label
         }}
         options={options}
         loading={loading}
         onInputChange={inputChanged}
         onBlur={handleBlur}
         defaultValue={defaultValue}
         // @ts-ignore
         onChange={handleChanged}
         noOptionsText={"No matches found"}
         onKeyPress={e =>
         {
            if (e.key === "Enter")
            {
               e.preventDefault();
            }
         }}
         renderOption={renderOption}
         filterOptions={filterOptions}
         disabled={isDisabled}
         renderInput={(params) => (
            <TextField
               {...params}
               label={fieldLabel}
               variant="standard"
               autoComplete="off"
               type="search"
               InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                     <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                     </React.Fragment>
                  ),
               }}
            />
         )}
      />
   );


   if (bulkEditMode)
   {
      return (
         <Box mb={1.5} display="flex" flexDirection="row">
            <Box alignItems="baseline" pt={1}>
               <Switch
                  id={`bulkEditSwitch-${fieldName}`}
                  checked={switchChecked}
                  onClick={bulkEditSwitchChanged}
               />
            </Box>
            <Box width="100%">
               {autocomplete}
            </Box>
         </Box>
      );
   }
   else
   {
      return (
         <Box mb={1.5}>
            {autocomplete}
         </Box>
      );
   }


}

export default DynamicSelect;
