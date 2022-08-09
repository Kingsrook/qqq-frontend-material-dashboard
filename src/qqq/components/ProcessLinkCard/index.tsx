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
import {ReactNode} from "react";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  title: string;
  percentage?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "white";
    amount: string | number;
    label: string;
  };
  icon: ReactNode;
  [key: string]: any;
}

function ProcessLinkCard({
   color, title, percentage, icon,
}: Props): JSX.Element
{
   return (
      <Card>
         <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
            <MDBox
               variant="gradient"
               bgColor={color}
               color={color === "light" ? "dark" : "white"}
               coloredShadow={color}
               borderRadius="xl"
               display="flex"
               justifyContent="center"
               alignItems="center"
               width="4rem"
               height="4rem"
               mt={-3}
            >
               <Icon fontSize="medium" color="inherit">
                  {icon}
               </Icon>
            </MDBox>
            <MDBox textAlign="right" lineHeight={1.25}>
               <MDTypography variant="button" fontWeight="bold" color="text">
                  {title}
               </MDTypography>
            </MDBox>
         </MDBox>
         <Divider />
         <MDBox pb={2} px={2}>
            <MDTypography component="p" variant="button" color="text" display="flex">
               <MDTypography
                  component="span"
                  variant="button"
                  fontWeight="bold"
                  color={percentage.color}
               >
                  {percentage.amount}
               </MDTypography>
               Click here to run the process called
               {" "}
               {title}
               .
               {percentage.label}
            </MDTypography>
         </MDBox>
      </Card>
   );
}

ProcessLinkCard.defaultProps = {
   color: "info",
   percentage: {
      color: "success",
      text: "",
      label: "",
   },
};

export default ProcessLinkCard;
