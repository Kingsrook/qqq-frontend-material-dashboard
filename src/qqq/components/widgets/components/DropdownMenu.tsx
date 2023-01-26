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

import {Theme} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {SxProps} from "@mui/system";
import React from "react";


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
   defaultValue?: any;
   localStorageKey?: string;
   label?: string;
   dropdownOptions?: DropdownOption[];
   onChangeCallback?: (dropdownLabel: string, data: any) => void;
   sx?: SxProps<Theme>;
}

function DropdownMenu({localStorageKey, defaultValue, label, dropdownOptions, onChangeCallback, sx}: Props): JSX.Element
{
   const handleOnChange = (event: any, value: any, reason: string) =>
   {
      onChangeCallback(label, value);
   }

   return (
      dropdownOptions ? (
         <span style={{whiteSpace: "nowrap"}}>
            <Autocomplete
               defaultValue={defaultValue}
               size="small"
               disablePortal
               id={`${label}-combo-box`}
               options={dropdownOptions}
               sx={{...sx, cursor: "pointer"}}
               onChange={handleOnChange}
               isOptionEqualToValue={(option, value) => option.id === value.id}
               renderInput={(params: any) => <TextField {...params} label={label} />}
               renderOption={(props, option: DropdownOption) => (
                  <li {...props} style={{whiteSpace: "normal"}}>{option.label}</li>
               )}
            />
         </span>
      ) : null
   )
}

export default DropdownMenu;
