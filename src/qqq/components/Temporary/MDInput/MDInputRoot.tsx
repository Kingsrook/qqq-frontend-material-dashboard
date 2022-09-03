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

import {styled, Theme} from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export default styled(TextField)(({theme, ownerState}: { theme?: Theme; ownerState: any }) =>
{
   const {palette, functions} = theme;
   const {error, success, disabled} = ownerState;

   const {grey, transparent, error: colorError, success: colorSuccess} = palette;
   const {pxToRem} = functions;

   // styles for the input with error={true}
   const errorStyles = () => ({
      backgroundImage:
         "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23F44335' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23F44335' stroke='none'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: `right ${pxToRem(12)} center`,
      backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,

      "& .Mui-focused": {
         "& .MuiOutlinedInput-notchedOutline, &:after": {
            borderColor: colorError.main,
         },
      },

      "& .MuiInputLabel-root.Mui-focused": {
         color: colorError.main,
      },
   });

   // styles for the input with success={true}
   const successStyles = () => ({
      backgroundImage:
         "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8'%3E%3Cpath fill='%234CAF50' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: `right ${pxToRem(12)} center`,
      backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,

      "& .Mui-focused": {
         "& .MuiOutlinedInput-notchedOutline, &:after": {
            borderColor: colorSuccess.main,
         },
      },

      "& .MuiInputLabel-root.Mui-focused": {
         color: colorSuccess.main,
      },
   });

   return {
      backgroundColor: disabled ? `${grey[200]} !important` : transparent.main,
      pointerEvents: disabled ? "none" : "auto",
      ...(error && errorStyles()),
      ...(success && successStyles()),
   };
});
