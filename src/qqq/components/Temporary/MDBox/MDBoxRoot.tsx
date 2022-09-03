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

import Box from "@mui/material/Box";
import {styled, Theme} from "@mui/material/styles";

export default styled(Box)(({theme, ownerState}: { theme?: Theme | any; ownerState: any }) =>
{
   const {palette, functions, borders, boxShadows} = theme;
   const {variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow} = ownerState;

   const {gradients, grey, white} = palette;
   const {linearGradient} = functions;
   const {borderRadius: radius} = borders;
   const {colored} = boxShadows;

   const greyColors: { [key: string]: string } = {
      "grey-100": grey[100],
      "grey-200": grey[200],
      "grey-300": grey[300],
      "grey-400": grey[400],
      "grey-500": grey[500],
      "grey-600": grey[600],
      "grey-700": grey[700],
      "grey-800": grey[800],
      "grey-900": grey[900],
   };

   const validGradients = [
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
   ];

   const validColors = [
      "transparent",
      "white",
      "black",
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "text",
      "grey-100",
      "grey-200",
      "grey-300",
      "grey-400",
      "grey-500",
      "grey-600",
      "grey-700",
      "grey-800",
      "grey-900",
   ];

   const validBorderRadius = ["xs", "sm", "md", "lg", "xl", "xxl", "section"];
   const validBoxShadows = ["xs", "sm", "md", "lg", "xl", "xxl", "inset"];

   // background value
   let backgroundValue = bgColor;

   if (variant === "gradient")
   {
      backgroundValue = validGradients.find((el) => el === bgColor)
         ? linearGradient(gradients[bgColor].main, gradients[bgColor].state)
         : white.main;
   }
   else if (validColors.find((el) => el === bgColor))
   {
      backgroundValue = palette[bgColor] ? palette[bgColor].main : greyColors[bgColor];
   }
   else
   {
      backgroundValue = bgColor;
   }

   // color value
   let colorValue = color;

   if (validColors.find((el) => el === color))
   {
      colorValue = palette[color] ? palette[color].main : greyColors[color];
   }

   // borderRadius value
   let borderRadiusValue = borderRadius;

   if (validBorderRadius.find((el) => el === borderRadius))
   {
      borderRadiusValue = radius[borderRadius];
   }

   // boxShadow value
   let boxShadowValue = "none";

   if (validBoxShadows.find((el) => el === shadow))
   {
      boxShadowValue = boxShadows[shadow];
   }
   else if (coloredShadow)
   {
      boxShadowValue = colored[coloredShadow] ? colored[coloredShadow] : "none";
   }

   return {
      opacity,
      background: backgroundValue,
      color: colorValue,
      borderRadius: borderRadiusValue,
      boxShadow: boxShadowValue,
   };
});
