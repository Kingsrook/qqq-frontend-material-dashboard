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

import {Card, Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import parse from "html-react-parser";
import React, {useEffect, useMemo, useState} from "react";
import {Pie} from "react-chartjs-2";
import {useNavigate} from "react-router-dom";
import MDTypography from "qqq/components/legacy/MDTypography";
import {chartColors} from "qqq/components/widgets/charts/DefaultChartData";
import configs from "qqq/components/widgets/charts/piechart/PieChartConfigs";
import ChartSubheaderWithData, {ChartSubheaderData} from "qqq/components/widgets/components/ChartSubheaderWithData";

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
   chartSubheaderData?: ChartSubheaderData;

   [key: string]: any;
}


function PieChart({description, chartData, chartSubheaderData}: Props): JSX.Element
{
   const navigate = useNavigate();
   const [dataLoaded, setDataLoaded] = useState(false);

   if (chartData && chartData.dataset)
   {
      if(!chartData.dataset.backgroundColors)
      {
         chartData.dataset.backgroundColors = chartColors;
      }
   }
   const {data, options} = configs(chartData?.labels || [], chartData?.dataset || {});

   useEffect(() =>
   {
      if (chartData)
      {
         setDataLoaded(true);
      }
   }, [chartData]);

   const handleClick = (e: Array<{}>) =>
   {
      if (e && e.length > 0 && chartData?.dataset?.urls && chartData?.dataset?.urls.length)
      {
         // @ts-ignore
         navigate(chartData.dataset.urls[e[0]["index"]]);
      }
   };

   return (
      <Card sx={{boxShadow: "none", height: "100%", width: "100%", display: "flex", flexGrow: 1, border: 0}}>
         <Box>
            <Box>
               {chartSubheaderData && (<ChartSubheaderWithData chartSubheaderData={chartSubheaderData} />)}
            </Box>
            <Box width="100%" height="300px">
               {useMemo(
                  () => (
                     <Pie data={data} options={options} getElementsAtEvent={handleClick} />
                  ),
                  [chartData]
               )}
            </Box>
            {
               !chartData && (
                  <Box sx={{
                     position: "absolute",
                     top: "40%",
                     left: "50%",
                     transform: "translate(-50%, -50%)",
                     display: "flex",
                     justifyContent: "center"
                  }}>
                     <Skeleton sx={{width: "150px", height: "150px"}} variant="circular" />
                  </Box>
               )
            }
            {
               description && (
                  <>
                     <Divider />
                     <Box display="flex" flexDirection={{xs: "column", sm: "row"}} mt="auto">
                        <MDTypography variant="button" color="text" fontWeight="light">
                           {parse(description)}
                        </MDTypography>
                     </Box>
                  </>
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
