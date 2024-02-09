/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2024.  Kingsrook, LLC
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


import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import React, {useContext} from "react";
import QContext from "QContext";
import colors from "qqq/assets/theme/base/colors";

interface XIconProps
{
   onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
   position: "forQuickFilter" | "forAdvancedQueryPreview" | "default";
   shade: "default" | "accent" | "accentLight"
}

XIcon.defaultProps = {
   position: "default",
   shade: "default"
};

export default function XIcon({onClick, position, shade}: XIconProps): JSX.Element
{
   const {accentColor, accentColorLight} = useContext(QContext)

   //////////////////////////
   // for default position //
   //////////////////////////
   let rest: any = {
      top: "-0.75rem",
      left: "-0.5rem",
   }

   if(position == "forQuickFilter")
   {
      rest = {
         left: "-1.125rem",
      }
   }
   else if(position == "forAdvancedQueryPreview")
   {
      rest = {
         top: "-0.5rem",
         left: "-0.75rem",
      }
   }

   let color;
   switch (shade)
   {
      case "default":
         color = colors.gray.main;
         break;
      case "accent":
         color = accentColor;
         break;
      case "accentLight":
         color = accentColorLight;
         break;
   }

   return (
      <span style={{position: "relative"}}><IconButton sx={{
         fontSize: "0.75rem",
         border: `1px solid ${color}`,
         color: color,
         padding: "0",
         background: "#FFFFFF !important",
         position: "absolute",
         ... rest
      }} onClick={onClick}><Icon>close</Icon></IconButton></span>
   )
}
