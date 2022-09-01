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

import Badge from "@mui/material/Badge";
import {styled, Theme} from "@mui/material/styles";

export default styled(Badge)(({theme, ownerState}: { theme?: Theme; ownerState: any }) =>
{
   const {palette, typography, borders, functions} = theme;
   const {color, circular, border, size, indicator, variant, container, children} = ownerState;

   const {white, dark, gradients, badgeColors} = palette;
   const {size: fontSize, fontWeightBold} = typography;
   const {borderRadius, borderWidth} = borders;
   const {pxToRem, linearGradient} = functions;

   // padding values
   const paddings: { [key: string]: string } = {
      xs: "0.45em 0.775em",
      sm: "0.55em 0.9em",
      md: "0.65em 1em",
      lg: "0.85em 1.375em",
   };

   // fontSize value
   const fontSizeValue = size === "xs" ? fontSize.xxs : fontSize.xs;

   // border value
   const borderValue = border ? `${borderWidth[3]} solid ${white.main}` : "none";

   // borderRadius value
   const borderRadiusValue = circular ? borderRadius.section : borderRadius.md;

   // styles for the badge with indicator={true}
   const indicatorStyles = (sizeProp: string) =>
   {
      let widthValue = pxToRem(20);
      let heightValue = pxToRem(20);

      if (sizeProp === "medium")
      {
         widthValue = pxToRem(24);
         heightValue = pxToRem(24);
      }
      else if (sizeProp === "large")
      {
         widthValue = pxToRem(32);
         heightValue = pxToRem(32);
      }

      return {
         width: widthValue,
         height: heightValue,
         display: "grid",
         placeItems: "center",
         textAlign: "center",
         borderRadius: "50%",
         padding: 0,
         border: borderValue,
      };
   };

   // styles for the badge with variant="gradient"
   const gradientStyles = (colorProp: string) =>
   {
      const backgroundValue = gradients[colorProp]
         ? linearGradient(gradients[colorProp].main, gradients[colorProp].state)
         : linearGradient(gradients.info.main, gradients.info.state);
      const colorValue = colorProp === "light" ? dark.main : white.main;

      return {
         background: backgroundValue,
         color: colorValue,
      };
   };

   // styles for the badge with variant="contained"
   const containedStyles = (colorProp: string) =>
   {
      const backgroundValue = badgeColors[colorProp]
         ? badgeColors[colorProp].background
         : badgeColors.info.background;
      let colorValue = badgeColors[colorProp] ? badgeColors[colorProp].text : badgeColors.info.text;

      if (colorProp === "light")
      {
         colorValue = dark.main;
      }
      return {
         background: backgroundValue,
         color: colorValue,
      };
   };

   // styles for the badge with no children and container={false}
   const standAloneStyles = () => ({
      position: "static",
      marginLeft: pxToRem(8),
      transform: "none",
      fontSize: pxToRem(9),
   });

   // styles for the badge with container={true}
   const containerStyles = () => ({
      position: "relative",
      transform: "none",
   });

   return {
      "& .MuiBadge-badge": {
         height: "auto",
         padding: paddings[size] || paddings.xs,
         fontSize: fontSizeValue,
         fontWeight: fontWeightBold,
         textTransform: "uppercase",
         lineHeight: 1,
         textAlign: "center",
         whiteSpace: "nowrap",
         verticalAlign: "baseline",
         border: borderValue,
         borderRadius: borderRadiusValue,
         ...(indicator && indicatorStyles(size)),
         ...(variant === "gradient" && gradientStyles(color)),
         ...(variant === "contained" && containedStyles(color)),
         ...(!children && !container && standAloneStyles()),
         ...(container && containerStyles()),
      },
   };
});
