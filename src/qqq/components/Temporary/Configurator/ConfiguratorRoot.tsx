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

import Drawer from "@mui/material/Drawer";
import {styled, Theme} from "@mui/material/styles";

export default styled(Drawer)(({theme, ownerState}: { theme?: Theme; ownerState: any }) => 
{
   const {boxShadows, functions, transitions} = theme;
   const {openConfigurator} = ownerState;

   const configuratorWidth = 360;
   const {lg} = boxShadows;
   const {pxToRem} = functions;

   // drawer styles when openConfigurator={true}
   const drawerOpenStyles = () => ({
      width: configuratorWidth,
      left: "initial",
      right: 0,
      transition: transitions.create("right", {
         easing: transitions.easing.sharp,
         duration: transitions.duration.short,
      }),
   });

   // drawer styles when openConfigurator={false}
   const drawerCloseStyles = () => ({
      left: "initial",
      right: pxToRem(-350),
      transition: transitions.create("all", {
         easing: transitions.easing.sharp,
         duration: transitions.duration.short,
      }),
   });

   return {
      "& .MuiDrawer-paper": {
         height: "100vh",
         margin: 0,
         padding: `0 ${pxToRem(10)}`,
         borderRadius: 0,
         boxShadow: lg,
         overflowY: "auto",
         ...(openConfigurator ? drawerOpenStyles() : drawerCloseStyles()),
      },
   };
});
