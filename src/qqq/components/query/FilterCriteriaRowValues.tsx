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
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, {SyntheticEvent} from "react";
import DynamicSelect from "qqq/components/forms/DynamicSelect";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import {OperatorOption, ValueMode} from "qqq/components/query/FilterCriteriaRow";

interface Props
{
   operatorOption: OperatorOption;
   criteria: QFilterCriteriaWithId;
   field: QFieldMetaData;
   table: QTableMetaData;
   valueChangeHandler: (event: React.ChangeEvent | SyntheticEvent, valueIndex?: number | "all", newValue?: any) => void;
}

FilterCriteriaRowValues.defaultProps = {
};

function FilterCriteriaRowValues({operatorOption, criteria, field, table, valueChangeHandler}: Props): JSX.Element
{
   if(!operatorOption)
   {
      return <br />
   }

   const makeTextField = (valueIndex: number = 0, label = "Value", idPrefix="value-") =>
   {
      let type = "search"
      const inputLabelProps: any = {};

      if(field.type == QFieldType.INTEGER)
      {
         type = "number";
      }
      else if(field.type == QFieldType.DATE)
      {
         type = "date";
         inputLabelProps.shrink = true;
      }
      else if(field.type == QFieldType.DATE_TIME)
      {
         type = "datetime-local";
         inputLabelProps.shrink = true;
      }

      return <TextField
         id={`${idPrefix}${criteria.id}`}
         label={label}
         variant="standard"
         autoComplete="off"
         type={type}
         onChange={(event) => valueChangeHandler(event, valueIndex)}
         value={criteria.values[valueIndex]}
         InputLabelProps={inputLabelProps}
         fullWidth
         // todo - x to clear value?
      />
   }

   switch (operatorOption.valueMode)
   {
      case ValueMode.NONE:
         return <br />
      case ValueMode.SINGLE:
         return makeTextField();
      case ValueMode.SINGLE_DATE:
         return makeTextField();
      case ValueMode.SINGLE_DATE_TIME:
         return makeTextField();
      case ValueMode.DOUBLE:
         return <Box>
            <Box width="50%" display="inline-block">
               { makeTextField(0, "From", "from-") }
            </Box>
            <Box width="50%" display="inline-block">
               { makeTextField(1, "To", "to-") }
            </Box>
         </Box>;
      case ValueMode.MULTI:
         let values = criteria.values;
         if(values && values.length == 1 && values[0] == "")
         {
            values = [];
         }
         return <Autocomplete
            renderInput={(params) => (<TextField {...params} variant="standard" label="Values" />)}
            options={[]}
            multiple
            freeSolo // todo - no debounce after enter?
            selectOnFocus
            clearOnBlur
            limitTags={5}
            value={values}
            onChange={(event, value) => valueChangeHandler(event, "all", value)}
         />
         // todo - need the Paste button
      case ValueMode.PVS_SINGLE:
         let selectedPossibleValue = null;
         if(criteria.values && criteria.values.length > 0)
         {
            selectedPossibleValue = criteria.values[0];
         }
         return <Box mb={-1.5}>
            <DynamicSelect
               tableName={table.name}
               fieldName={field.name}
               fieldLabel="Value"
               initialValue={selectedPossibleValue?.id}
               initialDisplayValue={selectedPossibleValue?.label}
               inForm={false}
               onChange={(value: any) => valueChangeHandler(null, 0, value)}
            />
         </Box>
      case ValueMode.PVS_MULTI:
         // todo - values not sticking when re-opening filter panel
         return <Box mb={-1.5}>
            <DynamicSelect
               tableName={table.name}
               fieldName={field.name}
               isMultiple
               fieldLabel="Values"
               initialValues={criteria.values || []}
               inForm={false}
               onChange={(value: any) => valueChangeHandler(null, "all", value)}
            />
         </Box>
   }

   return (<br />);
}

export default FilterCriteriaRowValues;