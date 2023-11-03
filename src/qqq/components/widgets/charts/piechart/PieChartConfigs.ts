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
      {
         if (gradients[color])
         {
            backgroundColors.push(gradients[color].state);
         }
         else
         {
            backgroundColors.push(color);
         }
      });
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
         maintainAspectRatio: false,
         responsive: true,
         plugins: {
            tooltip: {
               callbacks: {
                  label: function(context: any)
                  {
                     ////////////////////////////////////////////////////////////////////////////////
                     // our labels already have the value in them - so just use the label in the   //
                     // tooltip (lib by default puts label + value, so we were duplicating value!) //
                     ////////////////////////////////////////////////////////////////////////////////
                     return context.label;
                  }
               }
            },
            legend: {
               position: "bottom",
               labels: {
                  usePointStyle: true,
                  pointStyle: "circle",
                  padding: 12,
                  boxHeight: 8,
                  boxWidth: 8,
                  font: {
                     size: 14
                  }
               }
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
