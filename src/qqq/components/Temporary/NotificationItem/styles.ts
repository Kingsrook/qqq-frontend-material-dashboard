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

import {Theme} from "@mui/material/styles";

function menuItem(theme: Theme) 
{
   const {palette, borders, transitions} = theme;

   const {secondary, light, dark} = palette;
   const {borderRadius} = borders;

   return {
      display: "flex",
      alignItems: "center",
      width: "100%",
      color: secondary.main,
      borderRadius: borderRadius.md,
      transition: transitions.create("background-color", {
         easing: transitions.easing.easeInOut,
         duration: transitions.duration.standard,
      }),

      "& *": {
         transition: "color 100ms linear",
      },

      "&:not(:last-child)": {
         mb: 1,
      },

      "&:hover": {
         backgroundColor: light.main,

         "& *": {
            color: dark.main,
         },
      },
   };
}

export default menuItem;
