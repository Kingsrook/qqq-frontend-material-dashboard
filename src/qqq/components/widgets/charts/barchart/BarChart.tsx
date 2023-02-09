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

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import parse from "html-react-parser";
import {useMemo} from "react";
import {Bar} from "react-chartjs-2";
import MDTypography from "qqq/components/legacy/MDTypography";
import {GenericChartDataSingleDataset} from "qqq/components/widgets/charts/datastructures/GenericChartDataSingleDataset";


///////////////////////////
// options for bar chart //
///////////////////////////
const options = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
      legend: {
         display: false,
      },
   },
   interaction: {
      intersect: false,
      mode: "index",
   },
   scales: {
      y: {
         grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "rgba(255, 255, 255, .2)",
         },
         ticks: {
            suggestedMin: 0,
            suggestedMax: 500,
            beginAtZero: true,
            padding: 10,
            font: {
               size: 14,
               weight: 300,
               family: "Roboto",
               style: "normal",
               lineHeight: 2,
            },
            color: "#fff",
         },
      },
      x: {
         grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "rgba(255, 255, 255, .2)",
         },
         ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
               size: 14,
               weight: 300,
               family: "Roboto",
               style: "normal",
               lineHeight: 2,
            },
         },
      },
   },
};


////////////////////////////////////
// define properties and defaults //
////////////////////////////////////
interface Props
{
   color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
   title: string;
   description?: string;
   date: string;
   data: GenericChartDataSingleDataset;
}

BarChart.defaultProps = {
   color: "dark",
   description: "",
};

function getChartData(labels: any, dataset: any)
{
   return {
      chartData: {
         labels,
         datasets: [
            {
               label: dataset?.label,
               tension: 0.4,
               borderWidth: 0,
               borderRadius: 4,
               borderSkipped: false,
               backgroundColor: "rgba(255, 255, 255, 0.8)",
               data: dataset?.data,
               maxBarThickness: 6,
            },
         ],
      }
   };
}

function BarChart({color, title, description, date, data}: Props): JSX.Element
{
   /////////////////////////////////////////////////////////
   // enrich data with expected customizations and styles //
   /////////////////////////////////////////////////////////
   const {chartData} = getChartData(data?.labels, data?.dataset);
   return (

      <Box mt={3} sx={{flexGrow: 1, display: "flex"}}>
         <Card sx={{flexGrow: 1, display: "flex", height: "100%"}}>
            <Box padding="1rem">
               {useMemo(
                  () => (
                     <Box
                        borderRadius="10px"
                        py={2}
                        pr={0.5}
                        mt={-5}
                        height="12.5rem"
                        sx={{backgroundColor: color}}
                     >
                        <Bar data={chartData} options={options} />
                     </Box>
                  ),
                  [data, color]
               )}
               <Box pt={3} pb={1} px={1}>
                  <MDTypography variant="h6" textTransform="capitalize">
                     {title}
                  </MDTypography>
                  <MDTypography component="div" variant="button" color="text" fontWeight="light">
                     {parse(description)}
                  </MDTypography>
                  <Divider />
                  <Box display="flex" alignItems="center">
                     <MDTypography variant="button" color="text" lineHeight={1} sx={{mt: 0.15, mr: 0.5}}>
                        <Icon>schedule</Icon>
                     </MDTypography>
                     <MDTypography variant="button" color="text" fontWeight="light">
                        {date}
                     </MDTypography>
                  </Box>
               </Box>
            </Box>
         </Card>
      </Box>
   );
}

export default BarChart;
