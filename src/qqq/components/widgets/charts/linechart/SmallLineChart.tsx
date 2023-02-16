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
import parse from "html-react-parser";
import {useMemo} from "react";
import {Line} from "react-chartjs-2";
import colors from "qqq/assets/theme/base/colors";
import MDTypography from "qqq/components/legacy/MDTypography";
import configs from "qqq/components/widgets/charts/linechart/LineChartConfigs";

//////////////////////////////////////////
// structure of expected bar chart data //
//////////////////////////////////////////
export interface SmallLineChartData
{
   labels: string[];
   dataset: {
      label: string;
      data: number[];
   };
}


interface Props
{
   color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
   title: string;
   description?: string;
   date: string;
   chart: SmallLineChartData;

   [key: string]: any;
}

function SmallLineChart({color, title, description, date, chart}: Props): JSX.Element
{
   const {data, options} = configs(chart?.labels || [], chart?.dataset || {});

   return (

      <Box mt={3} sx={{flexGrow: 1, display: "flex"}}>
         <Card sx={{height: "100%", flexGrow: 1, display: "flex"}}>
            <Box padding="1rem">

               {useMemo(
                  () => (
                     <Box
                        py={2}
                        pr={0.5}
                        mt={-5}
                        height="18.5rem"
                        sx={{borderRadius: "10px", backgroundColor: colors.dark.focus}}
                     >
                        <Line data={data} options={options} />
                     </Box>
                  ),
                  [chart, color]
               )}
               <Box pt={3} pb={1} px={1}>
                  <MDTypography variant="h6" textTransform="capitalize">
                     {title}
                  </MDTypography>
                  <MDTypography component="div" variant="button" color="text" fontWeight="light">
                     {parse(description)}
                  </MDTypography>
               </Box>
            </Box>
         </Card>
      </Box>
   );
}

SmallLineChart.defaultProps = {
   color: "dark",
   description: "",
};

export default SmallLineChart;
