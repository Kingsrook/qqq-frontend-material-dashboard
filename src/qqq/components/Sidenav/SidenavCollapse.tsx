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

import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {ReactNode} from "react";
import {useMaterialUIController} from "context";
import {collapseItem, collapseIconBox, collapseIcon, collapseText, collapseArrow,} from "qqq/components/Sidenav/styles/sidenavCollapse";
import MDBox from "qqq/components/Temporary/MDBox";

// Declaring props types for SidenavCollapse
interface Props {
  icon: ReactNode;
  name: string;
  children?: ReactNode;
  active?: Boolean;
  noCollapse?: Boolean;
  open?: Boolean;
  [key: string]: any;
}

function SidenavCollapse({
   icon,
   name,
   children,
   active,
   noCollapse,
   open,
   ...rest
}: Props): JSX.Element
{
   const [controller] = useMaterialUIController();
   const {miniSidenav, transparentSidenav, whiteSidenav, darkMode} = controller;

   return (
      <>
         <ListItem component="li">
            <MDBox
               {...rest}
               sx={(theme: any) =>
                  collapseItem(theme, {active, transparentSidenav, whiteSidenav, darkMode})
               }
            >
               <ListItemIcon
                  sx={(theme) => collapseIconBox(theme, {transparentSidenav, whiteSidenav, darkMode})}
               >
                  {typeof icon === "string" ? (
                     <Icon sx={(theme) => collapseIcon(theme, {active})}>{icon}</Icon>
                  ) : (
                     icon
                  )}
               </ListItemIcon>

               <ListItemText
                  primary={name}
                  sx={(theme) =>
                     collapseText(theme, {
                        miniSidenav,
                        transparentSidenav,
                        whiteSidenav,
                        active,
                     })
                  }
               />

               <Icon
                  sx={(theme) =>
                     collapseArrow(theme, {
                        noCollapse,
                        transparentSidenav,
                        whiteSidenav,
                        miniSidenav,
                        open,
                        active,
                        darkMode,
                     })
                  }
               >
            expand_less
               </Icon>
            </MDBox>
         </ListItem>
         {children && (
            <Collapse in={Boolean(open)} unmountOnExit>
               {children}
            </Collapse>
         )}
      </>
   );
}

// Declaring default props for SidenavCollapse
SidenavCollapse.defaultProps = {
   active: false,
   noCollapse: false,
   children: false,
   open: false,
};

export default SidenavCollapse;
