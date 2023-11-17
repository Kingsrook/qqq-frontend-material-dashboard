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
import {ReactNode, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {setLayout, useMaterialUIController} from "qqq/context";

function DashboardLayout({children}: { children: ReactNode }): JSX.Element
{
   const [controller, dispatch] = useMaterialUIController();
   const {miniSidenav} = controller;
   const {pathname} = useLocation();

   useEffect(() =>
   {
      setLayout(dispatch, "dashboard");
   }, [pathname]);

   return (
      <Box
         sx={({breakpoints, transitions, functions: {pxToRem}}) => ({
            p: "20px",
            position: "relative",

            [breakpoints.up("xl")]: {
               marginLeft: miniSidenav ? pxToRem(120) : pxToRem(245),
               transition: transitions.create(["margin-left", "margin-right"], {
                  easing: transitions.easing.easeInOut,
                  duration: transitions.duration.standard,
               }),
            },
         })}
      >
         {children}
      </Box>
   );
}

export default DashboardLayout;
