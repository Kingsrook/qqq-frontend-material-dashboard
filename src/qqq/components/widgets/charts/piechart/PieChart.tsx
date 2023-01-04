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
import Icon from "@mui/material/Icon";
import parse from "html-react-parser";
import {ReactNode, useMemo} from "react";
import {Pie} from "react-chartjs-2";
import MDTypography from "qqq/components/legacy/MDTypography";
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
   };
}


// Declaring props types for PieChart
interface Props
{
   icon?: {
      color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
      component: ReactNode;
   };
   title?: string;
   description?: string;
   height?: string | number;
   chart: PieChartData;

   [key: string]: any;
}

function PieChart({icon, title, description, height, chart}: Props): JSX.Element
{
   const {data, options} = configs(chart?.labels || [], chart?.dataset || {});

   const renderChart = (
      <Box py={2} pr={2} pl={icon.component ? 1 : 2}>
         {title || description ? (
            <Box display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
               {icon.component && (
                  <Box
                     width="4rem"
                     height="4rem"
                     borderRadius="xl"
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     color="white"
                     mt={-5}
                     mr={2}
                     sx={{backgroundColor: icon.color || "info"}}
                  >
                     <Icon fontSize="medium">{icon.component}</Icon>
                  </Box>
               )}
               <Box mt={icon.component ? -2 : 0}>
                  {title && <MDTypography variant="h6">{title}</MDTypography>}
                  <Box mb={2}>
                     <MDTypography component="div" variant="button" color="text">
                        {parse(description)}
                     </MDTypography>
                  </Box>
               </Box>
            </Box>
         ) : null}
         {useMemo(
            () => (
               <Box height={height}>
                  <Pie data={data} options={options} />
               </Box>
            ),
            [chart, height]
         )}
      </Box>
   );

   return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Declaring default props for PieChart
PieChart.defaultProps = {
   icon: {color: "info", component: ""},
   title: "",
   description: "",
   height: "19.125rem",
};

export default PieChart;
