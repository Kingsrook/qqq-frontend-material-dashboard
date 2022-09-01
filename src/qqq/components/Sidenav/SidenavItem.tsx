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
import ListItemText from "@mui/material/ListItemText";
import {Theme} from "@mui/material/styles";
import {ReactNode} from "react";
import {useMaterialUIController} from "context";
import {item, itemContent, itemArrow} from "qqq/components/Sidenav/styles/sidenavItem"
import MDBox from "qqq/components/Temporary/MDBox";

// Declaring props types for SidenavCollapse
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  name: string;
  active?: boolean | string;
  nested?: boolean;
  children?: ReactNode;
  open?: boolean;
  [key: string]: any;
}

function SidenavItem({color, name, active, nested, children, open, ...rest}: Props): JSX.Element
{
   const [controller] = useMaterialUIController();
   const {miniSidenav, transparentSidenav, whiteSidenav, darkMode} = controller;

   return (
      <>
         <ListItem
            {...rest}
            component="li"
            sx={(theme) => item(theme, {active, color, transparentSidenav, whiteSidenav, darkMode})}
         >
            <MDBox
               sx={(theme: Theme): any =>
                  itemContent(theme, {
                     active,
                     miniSidenav,
                     name,
                     open,
                     nested,
                     transparentSidenav,
                     whiteSidenav,
                     darkMode,
                  })
               }
            >
               <ListItemText primary={name} />
               {children && (
                  <Icon
                     component="i"
                     sx={(theme) =>
                        itemArrow(theme, {open, miniSidenav, transparentSidenav, whiteSidenav, darkMode})
                     }
                  >
              expand_less
                  </Icon>
               )}
            </MDBox>
         </ListItem>
         {children && (
            <Collapse in={open} timeout="auto" unmountOnExit {...rest}>
               {children}
            </Collapse>
         )}
      </>
   );
}

// Declaring default props for SidenavItem
SidenavItem.defaultProps = {
   color: "info",
   active: false,
   nested: false,
   children: false,
   open: false,
};

export default SidenavItem;
