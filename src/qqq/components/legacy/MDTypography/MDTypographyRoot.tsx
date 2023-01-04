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

import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export default styled(Typography)(({theme, ownerState}: any): any => 
{
   const {palette, typography, functions}: any = theme;
   const {color, textTransform, verticalAlign, fontWeight, opacity, textGradient, darkMode} =
    ownerState;

   const {gradients, transparent, white} = palette;
   const {fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold} = typography;
   const {linearGradient} = functions;

   // fontWeight styles
   const fontWeights: { [key: string]: number } = {
      light: fontWeightLight,
      regular: fontWeightRegular,
      medium: fontWeightMedium,
      bold: fontWeightBold,
   };

   // styles for the typography with textGradient={true}
   const gradientStyles = () => ({
      backgroundImage:
      color !== "inherit" && color !== "text" && color !== "white" && gradients[color]
         ? linearGradient(gradients[color].main, gradients[color].state)
         : linearGradient(gradients.dark.main, gradients.dark.state),
      display: "inline-block",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: transparent.main,
      position: "relative",
      zIndex: 1,
   });

   // color value
   let colorValue = color === "inherit" || !palette[color] ? "inherit" : palette[color].main;

   if (darkMode && (color === "inherit" || !palette[color])) 
   {
      colorValue = "inherit";
   }
   else if (darkMode && color === "dark") colorValue = white.main;

   return {
      opacity,
      textTransform,
      verticalAlign,
      textDecoration: "none",
      color: colorValue,
      fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
      ...(textGradient && gradientStyles()),
   };
});
