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

function configs(labels: any, datasets: any) 
{
   return {
      data: {
         labels,
         datasets: [...datasets],
      },
      options: {
         indexAxis: "y",
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: false,
            },
         },
         scales: {
            y: {
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
               },
            },
            x: {
               grid: {
                  drawBorder: false,
                  display: false,
                  drawOnChartArea: true,
                  drawTicks: true,
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
      },
   };
}

export default configs;
