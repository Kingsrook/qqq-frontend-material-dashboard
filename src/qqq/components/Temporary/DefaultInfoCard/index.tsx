/* QQQ - Low-code Application Framework for Engineers.
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

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import {ReactNode} from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  icon: ReactNode;
  title: string;
  description?: string;
  value?: string | number;
  [key: string]: any;
}

function DefaultInfoCard({color, icon, title, description, value}: Props): JSX.Element
{
   return (
      <Card>
         <MDBox p={2} mx={3} display="flex" justifyContent="center">
            <MDBox
               display="grid"
               justifyContent="center"
               alignItems="center"
               bgColor={color}
               color="white"
               width="4rem"
               height="4rem"
               shadow="md"
               borderRadius="lg"
               variant="gradient"
            >
               <Icon>{icon}</Icon>
            </MDBox>
         </MDBox>
         <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
            <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
               {title}
            </MDTypography>
            {description && (
               <MDTypography variant="caption" color="text" fontWeight="regular">
                  {description}
               </MDTypography>
            )}
            {description && !value ? null : <Divider />}
            {value && (
               <MDTypography variant="h5" fontWeight="medium">
                  {value}
               </MDTypography>
            )}
         </MDBox>
      </Card>
   );
}

// Declaring default props for DefaultInfoCard
DefaultInfoCard.defaultProps = {
   color: "info",
   value: "",
   description: "",
};

export default DefaultInfoCard;
