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


import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {Chip} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, {SyntheticEvent} from "react";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import {OperatorOption, ValueMode} from "qqq/components/query/FilterCriteriaRow";

interface Props
{
   operatorOption: OperatorOption;
   criteria: QFilterCriteriaWithId;
   fieldType?: QFieldType;
   valueChangeHandler: (event: React.ChangeEvent | SyntheticEvent, valueIndex?: number | "all", newValue?: any) => void;
}

FilterCriteriaRowValues.defaultProps = {
};

function FilterCriteriaRowValues({operatorOption, criteria, fieldType, valueChangeHandler}: Props): JSX.Element
{
   if(!operatorOption)
   {
      return <br />
   }

   const makeTextField = (valueIndex: number = 0, label = "Value", idPrefix="value-") =>
   {
      let type = "search"
      const inputLabelProps: any = {};

      if(fieldType == QFieldType.INTEGER)
      {
         type = "number";
      }
      else if(fieldType == QFieldType.DATE)
      {
         type = "date";
         inputLabelProps.shrink = true;
      }
      else if(fieldType == QFieldType.DATE_TIME)
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
      case ValueMode.PVS_SINGLE:
         break;
      case ValueMode.PVS_MULTI:
         break;
   }

   return (<br />);
}

export default FilterCriteriaRowValues;