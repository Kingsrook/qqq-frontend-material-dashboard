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

import {InputLabel} from "@mui/material";
import Stack from "@mui/material/Stack";
import {styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import {useFormikContext} from "formik";
import React, {SyntheticEvent} from "react";

const AntSwitch = styled(Switch)(({theme}) => ({
   width: 28,
   height: 16,
   padding: 0,
   display: "flex",
   "&:active": {
      "& .MuiSwitch-thumb": {
         width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
         transform: "translateX(9px)",
      },
   },
   "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
         transform: "translateX(12px)",
         color: "#fff",
         "& + .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
         },
      },
   },
   "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create([ "width" ], {
         duration: 200,
      }),
   },
   "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
         theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
   },
}));

interface Props
{
   name: string;
   label: string;
   value: boolean;
   isDisabled: boolean;
}


function BooleanFieldSwitch({name, label, value, isDisabled}: Props) : JSX.Element
{
   const {setFieldValue} = useFormikContext();

   const setSwitch = (event: SyntheticEvent, newValue: boolean) =>
   {
      if(!isDisabled)
      {
         setFieldValue(name, newValue);
         event.stopPropagation();
      }
   }

   const toggleSwitch = () =>
   {
      setFieldValue(name, !value);
   }

   return (
      <>
         <InputLabel shrink={true}>{label}</InputLabel>
         <Stack direction="row" spacing={1} alignItems="center">
            <Typography
               fontSize="0.875rem"
               color={value === false ? "auto" : "#bfbfbf" }
               onClick={(e) => setSwitch(e, false)}
               sx={{cursor: value === false || isDisabled ? "inherit" : "pointer"}}>
         No
            </Typography>
            <AntSwitch name={name} checked={value} onClick={toggleSwitch} disabled={isDisabled} />
            <Typography
               fontSize="0.875rem"
               color={value === true ? "auto" : "#bfbfbf"}
               onClick={(e) => setSwitch(e, true)}
               sx={{cursor: value === true || isDisabled ? "inherit" : "pointer"}}>
         Yes
            </Typography>
         </Stack>
      </>
   );
}

export default BooleanFieldSwitch
