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

import {Card} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import parse from "html-react-parser";
import React, {useMemo} from "react";
import {Pie} from "react-chartjs-2";
import {useNavigate} from "react-router-dom";
import MDTypography from "qqq/components/legacy/MDTypography";
import {chartColors} from "qqq/components/widgets/charts/DefaultChartData";
import configs from "qqq/components/widgets/charts/piechart/PieChartConfigs";

//////////////////////////////////////////
// structure of expected bar chart data //
//////////////////////////////////////////
export interface PieChartData
{
   labels: string[];
   dataset: {
      label: string;
      backgroundColors?: string[];
      data: number[];
      urls?: string[];
   };
}


// Declaring props types for PieChart
interface Props
{
   description?: string;
   chartData: PieChartData;

   [key: string]: any;
}


function PieChart({description, chartData}: Props): JSX.Element
{
   const navigate = useNavigate();

   if (chartData && chartData.dataset)
   {
      chartData.dataset.backgroundColors = chartColors;
   }

   const {data, options} = configs(chartData?.labels || [], chartData?.dataset || {});

   const handleClick = (e: Array<{}>) =>
   {
      if(e && e.length > 0 && chartData?.dataset?.urls && chartData?.dataset?.urls.length)
      {
         // @ts-ignore
         navigate(chartData.dataset.urls[e[0]["index"]]);
      }
   }

   return (
      <Card sx={{boxShadow: "none", height: "100%", width: "100%", display: "flex", flexGrow: 1}}>
         <Box mt={3}>
            <Grid container alignItems="center">
               <Grid item xs={12} justifyContent="center">
                  <Box width="100%" height="80%" py={2} pr={2} pl={2}>
                     {useMemo(
                        () => (
                           <Pie data={data} options={options} getElementsAtEvent={handleClick} />
                        ),
                        [chartData]
                     )}
                  </Box>
               </Grid>
            </Grid>
            <Divider />
            {
               description && (
                  <Grid container>
                     <Grid item xs={12}>
                        <Box pb={2} px={2} display="flex" flexDirection={{xs: "column", sm: "row"}} mt="auto">
                           <MDTypography variant="button" color="text" fontWeight="light">
                              {parse(description)}
                           </MDTypography>
                        </Box>
                     </Grid>
                  </Grid>
               )
            }
         </Box>
      </Card>
   );
}

// Declaring default props for PieChart
PieChart.defaultProps = {
   icon: {color: "info", component: ""},
   title: "",
   description: "",
   height: "19.125rem",
};

export default PieChart;
