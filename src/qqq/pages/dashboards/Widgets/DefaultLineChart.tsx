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
import React, {ReactNode, useMemo} from "react";
import {Line} from "react-chartjs-2";
import colors from "assets/theme/base/colors";
import MDBadgeDot from "qqq/components/Temporary/MDBadgeDot";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

//////////////////////////////////////////
// structure of default line chart data //
//////////////////////////////////////////
export interface DefaultLineChartData
{
   labels: string[];
   lineLabels?: string[];
   datasets: {
      label: string;
      color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
      data: number[];
   }[];
};

/////////////////////
// display options //
/////////////////////
const options = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
      legend: {
         display: false,
      },
      tooltip: {
         enabled: true,
         callbacks: {
            label: function(context:any)
            {
               return(" " + Number(context.parsed.y).toLocaleString());
            }
         }
      }
   },
   interaction: {
      intersect: false,
      mode: "index",
   },
   scales: {
      y: {
         beginAtZero: true,
         grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "#c1c4ce5c",
         },
         ticks: {
            display: true,
            padding: 10,
            color: "#9ca2b7",
            font: {
               size: 14,
               weight: 300,
               family: "Roboto",
               style: "normal",
               lineHeight: 2,
            },
            callback: function(value: any, index: any, values: any)
            {
               return value.toLocaleString();
            }
         },
      },
      x: {
         grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
            borderDash: [5, 5],
            color: "#c1c4ce5c",
         },
         ticks: {
            display: true,
            color: "#9ca2b7",
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

/////////////////////////
// inputs and defaults //
/////////////////////////
interface Props
{
   icon?: {
      color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
      component: ReactNode;
   };
   title?: string;
   height?: string | number;
   isYAxisCurrency?: boolean;
   isChild?: boolean;
   data: DefaultLineChartData;

   [key: string]: any;
}

DefaultLineChart.defaultProps = {
   icon: {color: "info", component: ""},
   title: "",
   height: "19.125rem",
};


function DefaultLineChart({icon, title, height, data, isYAxisCurrency, isChild}: Props): JSX.Element
{
   const allBackgroundColors = ["info", "warning", "primary", "success", "error", "secondary", "dark"];
   if (data && data.datasets)
   {
      data.datasets.forEach((ds, index) =>
      {
         // @ts-ignore
         ds.color = allBackgroundColors[index];
      });
   }

   const chartDatasets = data && data.datasets
      ? data.datasets.map((dataset) => ({
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

   let customOptions = options;
   if(isYAxisCurrency)
   {
      customOptions.scales.y.ticks =
         {
            ... customOptions.scales.y.ticks,
            callback: function(value: any, index: any, values: any)
            {
               return value.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 0});
            }
         }
      customOptions.plugins.tooltip.callbacks =
         {
            ... customOptions.plugins.tooltip.callbacks,
            label: function(context:any)
            {
               return " " + context.parsed.y.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
            }
         }
   }

   let fullData = {};
   if (data)
   {
      fullData = {
         labels: data.labels,
         datasets: chartDatasets
      };
   }

   const renderChart = (
      <MDBox py={2} pr={2} pl={icon.component ? 1 : 2}>

         {title ? (
            <MDBox display="flex" px={0} pt={0}>
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
                  {isChild ? (
                     title && <MDTypography variant="h6">{title}</MDTypography>
                  ) : (
                     title && <MDTypography variant="h5">{title}</MDTypography>
                  )
                  }
                  <MDBox mb={2}>
                     <MDTypography component="div" variant="button" color="text">
                        <MDBox display="flex" justifyContent="space-between">
                           <MDBox display="flex" ml={-1}>
                              {
                                 data && data.lineLabels ? (
                                    (data.lineLabels.map((label: string, index: number) => (

                                       <MDBox key={index}>
                                          <MDBadgeDot color={allBackgroundColors[index]} size="sm" badgeContent={label} />
                                       </MDBox>
                                    )
                                    ))) : null
                              }
                           </MDBox>
                        </MDBox>
                     </MDTypography>
                  </MDBox>
               </MDBox>
            </MDBox>
         ) : null}
         {useMemo(
            () => (
               <MDBox height={height}>
                  <Line data={fullData} options={options} />
               </MDBox>
            ),

            [data, height]
         )}
      </MDBox>
   );

   return title ?
      <Card sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>
         {renderChart}
      </Card>
      : renderChart;
}

export default DefaultLineChart;
