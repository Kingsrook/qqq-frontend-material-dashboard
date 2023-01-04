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

// @mui material components
import {Theme} from "@mui/material/styles";

export default function sidenavLogoLabel(theme: Theme, ownerState: any) 
{
   const {functions, transitions, typography, breakpoints} = theme;
   const {miniSidenav} = ownerState;

   const {pxToRem} = functions;
   const {fontWeightMedium} = typography;

   return {
      ml: 0.5,
      fontWeight: fontWeightMedium,
      wordSpacing: pxToRem(-1),
      transition: transitions.create("opacity", {
         easing: transitions.easing.easeInOut,
         duration: transitions.duration.standard,
      }),

      [breakpoints.up("xl")]: {
         opacity: miniSidenav ? 0 : 1,
      },
   };
}
