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

import {CircularProgress, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import React, {ReactNode} from "react";
import {NavLink} from "react-router-dom";
import MDTypography from "qqq/components/legacy/MDTypography";

///////////////////////////////////////////
// structure of expected stats card data //
///////////////////////////////////////////
export interface StatisticsCardData
{
   count: number;
   countFontSize: string;
   countURL?: string;
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
   const {count, percentageAmount, percentageLabel} = data;

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

      <Box mt={0} sx={{height: "100%", flexGrow: 1, flexDirection: "column", display: "flex", paddingTop: "0px"}}>
         <Box mt={0} display="flex" justifyContent="center">
            {
               count !== undefined ? (
                  <Typography mt={0} sx={{color: "#344767", display: "flex", alignContent: "flex-end", fontSize: data?.countFontSize ? data?.countFontSize : "40px"}}>
                     {
                        data.countURL ? (
                           <NavLink to={data.countURL}>{count.toLocaleString()}</NavLink>
                        ) : (
                           count.toLocaleString()
                        )
                     }
                  </Typography>
               ) : (
                  <CircularProgress sx={{marginTop: "1rem", marginBottom: "20px"}} color="inherit" size={data?.countFontSize ? data.countFontSize : 30}/>
               )
            }
         </Box>
         {
            percentageAmount !== undefined && percentageAmount !== 0 ? (
               <Box pb={2}>

                  <Divider sx={{marginTop: "0px"}} />
                  <MDTypography pl={3} component="p" variant="button" color="text" display="flex">
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
               </Box>
            ) : null
         }
      </Box>
   );
}


export default StatisticsCard;
