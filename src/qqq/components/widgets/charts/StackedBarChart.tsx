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
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from "chart.js";
import React from "react";
import {Bar} from "react-chartjs-2";
import colors from "qqq/assets/theme/base/colors";
import {chartColors, DefaultChartData} from "qqq/components/widgets/charts/DefaultChartData";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

export const options = {
   responsive: true,
   scales: {
      x: {
         stacked: true,
      },
      y: {
         stacked: true,
      },
   },
};

interface Props
{
   data: DefaultChartData;
}

const {gradients} = colors;
function StackedBarChart({data}: Props): JSX.Element
{
   const handleClick = (e: Array<{}>) =>
   {
      /*
      if(e && e.length > 0 && data?.dataset?.urls && data?.dataset?.urls.length)
      {
         // @ts-ignore
         navigate(chartData.dataset.urls[e[0]["index"]]);

      }

       */
      console.log(e);
   }

   data?.datasets.forEach((dataset: any, index: number) =>
   {
      if(! dataset.backgroundColor)
      {
         dataset.backgroundColor = gradients[chartColors[index]].state;
      }
   });

   return <Box p={3}><Bar data={data} options={options} getElementsAtEvent={handleClick} /></Box>;
}

export default StackedBarChart;
