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

import {styled, Theme} from "@mui/material";
import Box from "@mui/material/Box";

export default styled(Box)(({theme, ownerState}: { theme?: Theme; ownerState: any }) =>
{
   const {palette, typography, borders, functions} = theme;
   const {color} = ownerState;

   const {white, gradients} = palette;
   const {size, fontWeightMedium} = typography;
   const {borderRadius} = borders;
   const {pxToRem, linearGradient} = functions;

   // backgroundImage value
   const backgroundImageValue = gradients[color]
      ? linearGradient(gradients[color].main, gradients[color].state)
      : linearGradient(gradients.info.main, gradients.info.state);

   return {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: pxToRem(60),
      backgroundImage: backgroundImageValue,
      color: white.main,
      position: "relative",
      padding: pxToRem(16),
      marginBottom: pxToRem(16),
      borderRadius: borderRadius.md,
      fontSize: size.md,
      fontWeight: fontWeightMedium,
   };
});
