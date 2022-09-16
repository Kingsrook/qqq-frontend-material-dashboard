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
import MDButton from "qqq/components/Temporary/MDButton";


// @ts-ignore
export default styled(MDButton)(({theme, ownerState}: { theme?: Theme; ownerState: any }) =>
{
   const {borders, functions, typography, palette} = theme;
   const {variant, paginationSize, active} = ownerState;

   const {borderColor} = borders;
   const {pxToRem} = functions;
   const {fontWeightRegular, size: fontSize} = typography;
   const {light} = palette;

   // width, height, minWidth and minHeight values
   let sizeValue = pxToRem(36);

   if (paginationSize === "small")
   {
      sizeValue = pxToRem(30);
   }
   else if (paginationSize === "large")
   {
      sizeValue = pxToRem(46);
   }

   return {
      borderColor,
      margin: `0 ${pxToRem(2)}`,
      pointerEvents: active ? "none" : "auto",
      fontWeight: fontWeightRegular,
      fontSize: fontSize.sm,
      width: sizeValue,
      minWidth: sizeValue,
      height: sizeValue,
      minHeight: sizeValue,

      "&:hover, &:focus, &:active": {
         transform: "none",
         boxShadow: (variant !== "gradient" || variant !== "contained") && "none !important",
         opacity: "1 !important",
      },

      "&:hover": {
         backgroundColor: light.main,
         borderColor,
      },
   };
});
