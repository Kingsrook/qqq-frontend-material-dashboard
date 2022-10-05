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
import Icon from "@mui/material/Icon";
import {ReactNode, useMemo} from "react";
import {Line} from "react-chartjs-2";
import colors from "qqq/components/Temporary/colors";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import configs from "qqq/pages/dashboards/Widgets/Configs/LineChartConfigs";


///////////////////////////////////////////
// structure of expected line chart data //
///////////////////////////////////////////
export interface LineChartData
{
   labels: string[];
   datasets: {
      label: string;
      color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
      data: number[];
   }[];
};


////////////////////////
// line chart options //
////////////////////////
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
      x: {
         grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
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


//////////////////////////////////////////
// define input properties and defaults //
//////////////////////////////////////////
interface Props
{
   icon?: {
      color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
      component: ReactNode;
   };
   title?: string;
   description?: string | ReactNode;
   height?: string | number;
   chart: {
      labels: string[];
      datasets: {
         label: string;
         color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
         data: number[];
      }[];
   };

   [key: string]: any;
}

LineChart.defaultProps = {
   icon: {color: "info", component: ""},
   title: "",
   description: "",
   height: "19.125rem",
};

function LineChart({icon, title, description, height, chart}: Props): JSX.Element
{
   const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
         ...dataset,
         tension: 0,
         pointRadius: 3,
         borderWidth: 4,
         backgroundColor: "transparent",
         fill: true,
         pointBackgroundColor: colors[dataset.color]
            ? colors[dataset.color || "dark"].main
            : colors.dark.main,
         borderColor: colors[dataset.color]
            ? colors[dataset.color || "dark"].main
            : colors.dark.main,
         maxBarThickness: 6,
      }))
      : [];

   const {data} = configs(chart.labels || [], chartDatasets);

   const renderChart = (
      <MDBox py={2} pr={2} pl={icon.component ? 1 : 2}>
         {title || description ? (
            <MDBox display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
               {icon.component && (
                  <MDBox
                     width="4rem"
                     height="4rem"
                     bgColor={icon.color || "info"}
                     variant="gradient"
                     coloredShadow={icon.color || "info"}
                     borderRadius="xl"
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     color="white"
                     mt={-5}
                     mr={2}
                  >
                     <Icon fontSize="medium">{icon.component}</Icon>
                  </MDBox>
               )}
               <MDBox mt={icon.component ? -2 : 0}>
                  {title && <MDTypography variant="h5">{title}</MDTypography>}
                  <MDBox mb={2}>
                     <MDTypography component="div" variant="button" color="text">
                        {description}
                     </MDTypography>
                  </MDBox>
               </MDBox>
            </MDBox>
         ) : null}
         {useMemo(
            () => (
               <MDBox height={height}>
                  <Line data={data} options={options} />
               </MDBox>
            ),
            [chart, height]
         )}
      </MDBox>
   );

   return title || description ? <Card>{renderChart}</Card> : renderChart;
}


export default LineChart;
