/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2023.  Kingsrook, LLC
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
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import Autocomplete, {AutocompleteRenderOptionState} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, {ReactNode, useState} from "react";

interface FieldAutoCompleteProps
{
   id: string;
   metaData: QInstance;
   tableMetaData: QTableMetaData;
   handleFieldChange: (event: any, newValue: any, reason: string) => void;
   defaultValue?: {field: QFieldMetaData, table: QTableMetaData, fieldName: string};
   autoFocus?: boolean;
   forceOpen?: boolean;
   hiddenFieldNames?: string[];
   variant?: "standard" | "filled" | "outlined"
   label?: string
   textFieldSX?: any
}

FieldAutoComplete.defaultProps =
   {
      defaultValue: null,
      autoFocus: false,
      forceOpen: null,
      hiddenFieldNames: [],
      variant: "standard",
      label: "Field",
      textFieldSX: null,
   };

function makeFieldOptionsForTable(tableMetaData: QTableMetaData, fieldOptions: any[], isJoinTable: boolean, hiddenFieldNames: string[], selectedFieldName: string)
{
   const sortedFields = [...tableMetaData.fields.values()].sort((a, b) => a.label.localeCompare(b.label));
   for (let i = 0; i < sortedFields.length; i++)
   {
      const fieldName = isJoinTable ? `${tableMetaData.name}.${sortedFields[i].name}` : sortedFields[i].name;

      if(hiddenFieldNames && hiddenFieldNames.indexOf(fieldName) > -1 && fieldName != selectedFieldName)
      {
         continue;
      }

      fieldOptions.push({field: sortedFields[i], table: tableMetaData, fieldName: fieldName});
   }
}


/*******************************************************************************
 ** Component for rendering a list of field names from a table as an auto-complete.
 *******************************************************************************/
export default function FieldAutoComplete({id, metaData, tableMetaData, handleFieldChange, defaultValue, autoFocus, forceOpen, hiddenFieldNames, variant, label, textFieldSX}: FieldAutoCompleteProps): JSX.Element
{
   const [selectedFieldName, setSelectedFieldName] = useState(defaultValue ? defaultValue.fieldName : null)

   const fieldOptions: any[] = [];
   makeFieldOptionsForTable(tableMetaData, fieldOptions, false, hiddenFieldNames, selectedFieldName);
   let fieldsGroupBy = null;

   if (tableMetaData.exposedJoins && tableMetaData.exposedJoins.length > 0)
   {
      for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
      {
         const exposedJoin = tableMetaData.exposedJoins[i];
         if (metaData.tables.has(exposedJoin.joinTable.name))
         {
            fieldsGroupBy = (option: any) => `${option.table.label} fields`;
            makeFieldOptionsForTable(exposedJoin.joinTable, fieldOptions, true, hiddenFieldNames, selectedFieldName);
         }
      }
   }


   function getFieldOptionLabel(option: any)
   {
      /////////////////////////////////////////////////////////////////////////////////////////
      // note - we're using renderFieldOption below for the actual select-box options, which //
      // are always jut field label (as they are under groupings that show their table name) //
      /////////////////////////////////////////////////////////////////////////////////////////
      if (option && option.field && option.table)
      {
         if (option.table.name == tableMetaData.name)
         {
            return (option.field.label);
         }
         else
         {
            return (option.table.label + ": " + option.field.label);
         }
      }

      return ("");
   }


   //////////////////////////////////////////////////////////////////////////////////////////////
   // for options, we only want the field label (contrast with what we show in the input box,  //
   // which comes out of getFieldOptionLabel, which is the table-label prefix for join fields) //
   //////////////////////////////////////////////////////////////////////////////////////////////
   function renderFieldOption(props: React.HTMLAttributes<HTMLLIElement>, option: any, state: AutocompleteRenderOptionState): ReactNode
   {
      let label = "";
      if (option && option.field)
      {
         label = (option.field.label);
      }

      return (<li {...props}>{label}</li>);
   }


   function isFieldOptionEqual(option: any, value: any)
   {
      return option.fieldName === value.fieldName;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////
   // seems like, if we always add the open attribute, then if its false or null, then the autocomplete //
   // doesn't open at all... so, only add the attribute at all, if forceOpen is true                    //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////
   const alsoOpen: {[key: string]: any} = {}
   if(forceOpen)
   {
      alsoOpen["open"] = forceOpen;
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function onChange(event: any, newValue: any, reason: string)
   {
      setSelectedFieldName(newValue ? newValue.fieldName : null)
      handleFieldChange(event, newValue, reason);
   }

   return (
      <Autocomplete
         id={id}
         renderInput={(params) => (<TextField {...params} autoFocus={autoFocus} label={label} variant={variant} sx={textFieldSX} autoComplete="off" type="search" InputProps={{...params.InputProps}} />)}
         // @ts-ignore
         defaultValue={defaultValue}
         options={fieldOptions}
         onChange={onChange}
         isOptionEqualToValue={(option, value) => isFieldOptionEqual(option, value)}
         groupBy={fieldsGroupBy}
         getOptionLabel={(option) => getFieldOptionLabel(option)}
         renderOption={(props, option, state) => renderFieldOption(props, option, state)}
         autoSelect={true}
         autoHighlight={true}
         slotProps={{popper: {className: "filterCriteriaRowColumnPopper", style: {padding: 0, width: "250px"}}}}
         {...alsoOpen}
      />

   );
}
