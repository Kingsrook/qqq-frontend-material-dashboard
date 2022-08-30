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
import {useMemo, ReactNode} from "react";
import {Bar} from "react-chartjs-2";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import configs from "qqq/components/Widgets/Configs/BarChartConfig";

// Declaring props types for ReportsBarChart
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  title: string;
  description?: string | ReactNode;
  date: string;
  chart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    };
  };
  [key: string]: any;
}

function ReportsBarChart({color, title, description, date, chart}: Props): JSX.Element
{
   const {data, options} = configs(chart.labels || [], chart.datasets || {});

   return (
      <Card sx={{height: "100%"}}>
         <MDBox padding="1rem">
            {useMemo(
               () => (
                  <MDBox
                     variant="gradient"
                     bgColor={color}
                     borderRadius="lg"
                     coloredShadow={color}
                     py={2}
                     pr={0.5}
                     mt={-5}
                     height="12.5rem"
                  >
                     <Bar data={data} options={options} />
                  </MDBox>
               ),
               [chart, color]
            )}
            <MDBox pt={3} pb={1} px={1}>
               <MDTypography variant="h6" textTransform="capitalize">
                  {title}
               </MDTypography>
               <MDTypography component="div" variant="button" color="text" fontWeight="light">
                  {description}
               </MDTypography>
               <Divider />
               <MDBox display="flex" alignItems="center">
                  <MDTypography variant="button" color="text" lineHeight={1} sx={{mt: 0.15, mr: 0.5}}>
                     <Icon>schedule</Icon>
                  </MDTypography>
                  <MDTypography variant="button" color="text" fontWeight="light">
                     {date}
                  </MDTypography>
               </MDBox>
            </MDBox>
         </MDBox>
      </Card>
   );
}

// Setting default values for the props of ReportsBarChart
ReportsBarChart.defaultProps = {
   color: "dark",
   description: "",
};

export default ReportsBarChart;
