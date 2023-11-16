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
import colors from "qqq/assets/theme/base/colors";

function navbar(theme: Theme | any, ownerState: any)
{
   const {
      palette, boxShadows, functions, transitions, breakpoints, borders,
   } = theme;
   const {
      transparentNavbar, absolute, light, darkMode,
   } = ownerState;

   const {
      dark, white, text, transparent, background,
   } = palette;
   const {navbarBoxShadow} = boxShadows;
   const {rgba, pxToRem} = functions;
   const {borderRadius} = borders;

   return {
      boxShadow: transparentNavbar || absolute ? "none" : navbarBoxShadow,
      backdropFilter: transparentNavbar || absolute ? "none" : `saturate(200%) blur(${pxToRem(30)})`,
      backgroundColor:
         transparentNavbar || absolute
            ? `${transparent.main} !important`
            : rgba(darkMode ? background.default : white.main, 0.8),

      color: () =>
      {
         let color;

         if (light)
         {
            color = white.main;
         }
         else if (transparentNavbar)
         {
            color = text.main;
         }
         else
         {
            color = dark.main;
         }

         return color;
      },
      top: absolute ? 0 : pxToRem(12),
      minHeight: pxToRem(75),
      display: "grid",
      alignItems: "center",
      borderRadius: borderRadius.xl,
      paddingTop: pxToRem(8),
      paddingBottom: pxToRem(8),
      paddingRight: absolute ? pxToRem(8) : 0,
      paddingLeft: absolute ? pxToRem(16) : 0,

      "& > *": {
         transition: transitions.create("all", {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
         }),
      },

      "& .MuiToolbar-root": {
         display: "flex",
         justifyContent: "space-between",
         alignItems: "center",

         [breakpoints.up("sm")]: {
            minHeight: "auto",
            padding: `${pxToRem(4)} ${pxToRem(16)}`,
         },
      },
   };
}

const navbarContainer = ({breakpoints}: Theme): any => ({
   flexDirection: "column",
   alignItems: "flex-start",
   justifyContent: "space-between",

   [breakpoints.up("md")]: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: "0",
      paddingBottom: "0",
   },
});

const navbarRow = ({breakpoints}: Theme, {isMini}: any) => ({
   display: "flex",
   alignItems: "center",
   width: "100%",

   [breakpoints.up("md")]: {
      justifyContent: "stretch",
      width: isMini ? "100%" : "max-content",
   },

   [breakpoints.up("xl")]: {
      justifyContent: "stretch !important",
      width: "max-content !important",
   },
});

const navbarIconButton = ({typography: {size}, breakpoints}: Theme) => ({
   px: 1,

   "& .material-icons, .material-icons-round": {
      fontSize: `${size.xl} !important`,
   },

   "& .MuiTypography-root": {
      display: "none",

      [breakpoints.up("sm")]: {
         display: "inline-block",
         lineHeight: 1.2,
         ml: 0.5,
      },
   },
});

const navbarDesktopMenu = ({breakpoints}: Theme) => ({
   display: "none !important",
   cursor: "pointer",

   [breakpoints.down("sm")]: {
      display: "inline-block !important",
   },
});

const recentlyViewedMenu = ({breakpoints}: Theme) => ({
   "& .MuiInputLabel-root": {
      color: colors.gray.main,
      fontWeight: "500",
      fontSize: "1rem"
   },
   "& .MuiInputAdornment-root": {
      marginTop: "0.5rem",
      color: colors.gray.main,
      fontSize: "1rem"
   },
   "& .MuiOutlinedInput-root": {
      borderRadius: "0",
      padding: "0"
   },
   "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: "0"
   },
   display: "block",
   [breakpoints.down("md")]: {
      display: "none !important",
   },
});

const navbarMobileMenu = ({breakpoints}: Theme) => ({
   left: "-0.75rem",
   display: "inline-block",
   lineHeight: 0,

   [breakpoints.up("xl")]: {
      display: "none",
   },
});

export {
   navbar,
   navbarContainer,
   navbarRow,
   navbarIconButton,
   navbarDesktopMenu,
   navbarMobileMenu,
   recentlyViewedMenu
};
