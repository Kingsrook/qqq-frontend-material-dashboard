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

import Avatar from "@mui/material/Avatar";
import {styled, Theme} from "@mui/material/styles";

export default styled(Avatar)(({theme, ownerState}: { theme?: Theme | any; ownerState: any }) =>
{
   const {palette, functions, typography, boxShadows} = theme;
   const {shadow, bgColor, size} = ownerState;

   const {gradients, transparent, white} = palette;
   const {pxToRem, linearGradient} = functions;
   const {size: fontSize, fontWeightRegular} = typography;

   // backgroundImage value
   const backgroundValue =
    bgColor === "transparent"
       ? transparent.main
       : linearGradient(gradients[bgColor].main, gradients[bgColor].state);

   // size value
   let sizeValue;

   switch (size)
   {
      case "xs":
         sizeValue = {
            width: pxToRem(24),
            height: pxToRem(24),
            fontSize: fontSize.xs,
         };
         break;
      case "sm":
         sizeValue = {
            width: pxToRem(36),
            height: pxToRem(36),
            fontSize: fontSize.sm,
         };
         break;
      case "lg":
         sizeValue = {
            width: pxToRem(58),
            height: pxToRem(58),
            fontSize: fontSize.sm,
         };
         break;
      case "xl":
         sizeValue = {
            width: pxToRem(74),
            height: pxToRem(74),
            fontSize: fontSize.md,
         };
         break;
      case "xxl":
         sizeValue = {
            width: pxToRem(110),
            height: pxToRem(110),
            fontSize: fontSize.md,
         };
         break;
      default: {
         sizeValue = {
            width: pxToRem(48),
            height: pxToRem(48),
            fontSize: fontSize.md,
         };
      }
   }

   return {
      background: backgroundValue,
      color: white.main,
      fontWeight: fontWeightRegular,
      boxShadow: boxShadows[shadow],
      ...sizeValue,
   };
});
