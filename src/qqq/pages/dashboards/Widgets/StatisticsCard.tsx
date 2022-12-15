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

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import {ReactNode} from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

///////////////////////////////////////////
// structure of expected stats card data //
///////////////////////////////////////////
export interface StatisticsCardData
{
   title: string;
   count: number;
   percentageAmount: number;
   percentageLabel: string;
}

/////////////////////////
// inputs and defaults //
/////////////////////////
interface Props
{
   data: StatisticsCardData;
   color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
   icon: ReactNode;
   increaseIsGood: boolean;
   dropdown?: {
      action: (...args: any) => void;
      menu: ReactNode;
      value: string;
   };

   [key: string]: any;
}

StatisticsCard.defaultProps = {
   color: "info",
   increaseIsGood: true
};

function StatisticsCard({data, color, icon, increaseIsGood}: Props): JSX.Element
{
   const {title, count, percentageAmount, percentageLabel} = data;

   let percentageString = "";
   if (percentageAmount)
   {
      percentageString = percentageAmount.toLocaleString() + "%";
      if (percentageAmount > 0)
      {
         percentageString = "+" + percentageString;
      }
   }

   let percentColor = "dark";
   if (percentageAmount !== 0)
   {
      if (increaseIsGood)
      {
         percentColor = (percentageAmount > 0) ? "success" : "warning";
      }
      else
      {
         percentColor = (percentageAmount < 0) ? "success" : "warning";
      }
   }

   return (

      <Card sx={{height: "100%", alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: 3, paddingTop: "0px"}}>
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
               <MDTypography variant="button" fontWeight="light" color="text">
                  {title}
               </MDTypography>
               {
                  count !== undefined ? (
                     <MDTypography variant="h4">{count.toLocaleString()}</MDTypography>
                  ) : null
               }
            </MDBox>
         </MDBox>
         {
            percentageAmount !== undefined && percentageAmount !== 0 ? (
               <MDBox px={2}>
                  <Divider />
                  <MDTypography component="p" variant="button" color="text" display="flex">
                     <MDTypography
                        component="span"
                        variant="button"
                        fontWeight="bold"
                        color={percentColor}
                     >
                        {percentageString}
                     </MDTypography>
                     &nbsp;{percentageLabel}
                  </MDTypography>
               </MDBox>
            ) : null
         }
      </Card>
   );
}


export default StatisticsCard;
