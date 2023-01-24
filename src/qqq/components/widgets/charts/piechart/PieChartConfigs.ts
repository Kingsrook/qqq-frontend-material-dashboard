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

import colors from "qqq/assets/theme/base/colors";

const {gradients, dark} = colors;

function configs(labels: any, datasets: any)
{
   const backgroundColors = [];

   if (datasets.backgroundColors)
   {
      datasets.backgroundColors.forEach((color: string) =>
         gradients[color]
            ? backgroundColors.push(gradients[color].state)
            : backgroundColors.push(dark.main)
      );
   }
   else
   {
      backgroundColors.push(dark.main);
   }

   return {
      data: {
         labels,
         datasets: [
            {
               label: datasets.label,
               weight: 9,
               cutout: 0,
               tension: 0.9,
               pointRadius: 2,
               borderWidth: 2,
               backgroundColor: backgroundColors,
               fill: false,
               data: datasets.data,
            },
         ],
      },
      options: {
         responsive: true,
         maintainAspectRatio: true,
         plugins: {
            legend: {
               display: false,
            },
         },
         scales: {
            y: {
               grid: {
                  drawBorder: false,
                  display: false,
                  drawOnChartArea: false,
                  drawTicks: false,
               },
               ticks: {
                  display: false,
               },
            },
            x: {
               grid: {
                  drawBorder: false,
                  display: false,
                  drawOnChartArea: false,
                  drawTicks: false,
               },
               ticks: {
                  display: false,
               },
            },
         },
      },
   };
}

export default configs;
