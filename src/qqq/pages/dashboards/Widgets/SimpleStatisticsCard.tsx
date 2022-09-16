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
import Grid from "@mui/material/Grid";
import {ReactNode} from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import {StatisticsCardData} from "qqq/pages/dashboards/Widgets/StatisticsCard";

interface Props
{
   data: StatisticsCardData;
   increaseIsGood: boolean;
   dropdown?: {
      action: (...args: any) => void;
      menu: ReactNode;
      value: string;
   };

   [key: string]: any;
}

function SimpleStatisticsCard({data, increaseIsGood, dropdown}: Props): JSX.Element
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

   let percentColor: string;
   if (increaseIsGood)
   {
      percentColor = (percentageAmount > 0) ? "success" : "warning";
   }
   else
   {
      percentColor = (percentageAmount < 0) ? "success" : "warning";
   }

   return (
      <Card>
         <MDBox p={2}>
            <Grid container>
               <Grid item xs={7}>
                  <MDBox mb={0.5} lineHeight={1}>
                     <MDTypography
                        variant="button"
                        fontWeight="medium"
                        color="text"
                        textTransform="capitalize"
                     >
                        {title}
                     </MDTypography>
                  </MDBox>
                  <MDBox lineHeight={1}>
                     {
                        count ? (
                           <MDTypography variant="h5" fontWeight="bold">
                              {count.toLocaleString()}
                           </MDTypography>
                        ) : null
                     }
                     <MDTypography variant="button" fontWeight="bold" color={percentColor}>
                        {percentageString}&nbsp;
                        <MDTypography
                           variant="button"
                           fontWeight="regular"
                           color={"secondary"}
                        >
                           {percentageLabel}
                        </MDTypography>
                     </MDTypography>
                  </MDBox>
               </Grid>
               <Grid item xs={5}>
                  {dropdown && (
                     <MDBox width="100%" textAlign="right" lineHeight={1}>
                        <MDTypography
                           variant="caption"
                           color="secondary"
                           fontWeight="regular"
                           sx={{cursor: "pointer"}}
                           onClick={dropdown.action}
                        >
                           {dropdown.value}
                        </MDTypography>
                        {dropdown.menu}
                     </MDBox>
                  )}
               </Grid>
            </Grid>
         </MDBox>
      </Card>
   );
}

SimpleStatisticsCard.defaultProps = {
   percentage: {
      color: "success",
      value: "",
      label: "",
   },
   dropdown: false,
};

export default SimpleStatisticsCard;
