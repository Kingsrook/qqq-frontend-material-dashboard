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

import {styled} from "@mui/material";

export default styled("span")(({theme}) =>
{
   const {palette, typography, functions} = theme;

   const {white} = palette;
   const {size, fontWeightMedium} = typography;
   const {pxToRem} = functions;

   return {
      color: white.main,
      fontSize: size.xl,
      padding: `${pxToRem(9)} ${pxToRem(6)} ${pxToRem(8)}`,
      marginLeft: pxToRem(40),
      fontWeight: fontWeightMedium,
      cursor: "pointer",
      lineHeight: 0,
   };
});
