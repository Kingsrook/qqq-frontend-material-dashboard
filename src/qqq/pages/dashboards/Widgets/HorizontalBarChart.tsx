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
import {Bar} from "react-chartjs-2";
import colors from "qqq/components/Temporary/colors";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import configs from "qqq/pages/dashboards/Widgets/Configs/HorizontalBarChartConfigs"

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
         color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
         data: number[];
      }[];
   };

   [key: string]: any;
}

function HorizontalBarChart({icon, title, description, height, chart}: Props): JSX.Element
{
   const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
         ...dataset,
         weight: 5,
         borderWidth: 0,
         borderRadius: 4,
         backgroundColor: colors[dataset.color]
            ? colors[dataset.color || "dark"].main
            : colors.dark.main,
         fill: false,
         maxBarThickness: 35,
      }))
      : [];

   const {data, options} = configs(chart.labels || [], chartDatasets);

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
                  {title && <MDTypography variant="h6">{title}</MDTypography>}
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
                  <Bar data={data} options={options} />
               </MDBox>
            ),
            [chart, height]
         )}
      </MDBox>
   );

   return title || description ? <Card>{renderChart}</Card> : renderChart;
}

HorizontalBarChart.defaultProps = {
   icon: {color: "info", component: ""},
   title: "",
   description: "",
   height: "19.125rem",
};

export default HorizontalBarChart;
