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

import Fade from "@mui/material/Fade";
import {useState, ReactNode} from "react";
import MDAlertCloseIcon from "qqq/components/Temporary/MDAlert/MDAlertCloseIcon";
import MDAlertRoot from "qqq/components/Temporary/MDAlert/MDAlertRoot";
import MDBox from "qqq/components/Temporary/MDBox";

// Declaring props types for MDAlert
interface Props
{
   color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
   dismissible?: boolean;
   children: ReactNode;

   [key: string]: any;
}

function MDAlert({color, dismissible, children, ...rest}: Props): JSX.Element | null
{
   const [alertStatus, setAlertStatus] = useState("mount");

   const handleAlertStatus = () => setAlertStatus("fadeOut");

   // The base template for the alert
   const alertTemplate: any = (mount: boolean = true) => (
      <Fade in={mount} timeout={300}>
         <MDAlertRoot ownerState={{color}} {...rest}>
            <MDBox display="flex" alignItems="center" color="white">
               {children}
            </MDBox>
            {dismissible ? (
               <MDAlertCloseIcon onClick={mount ? handleAlertStatus : undefined}>
                  &times;
               </MDAlertCloseIcon>
            ) : null}
         </MDAlertRoot>
      </Fade>
   );

   switch (true)
   {
      case alertStatus === "mount":
         return alertTemplate();
      case alertStatus === "fadeOut":
         setTimeout(() => setAlertStatus("unmount"), 400);
         return alertTemplate(false);
      default:
         alertTemplate();
         break;
   }

   return null;
}

// Declaring default props for MDAlert
MDAlert.defaultProps = {
   color: "info",
   dismissible: false,
};

export default MDAlert;
