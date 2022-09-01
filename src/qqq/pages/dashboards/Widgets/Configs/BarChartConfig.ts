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
         datasets: [
            {
               label: datasets.label,
               tension: 0.4,
               borderWidth: 0,
               borderRadius: 4,
               borderSkipped: false,
               backgroundColor: "rgba(255, 255, 255, 0.8)",
               data: datasets.data,
               maxBarThickness: 6,
            },
         ],
      },
      options: {
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
                  suggestedMin: 0,
                  suggestedMax: 500,
                  beginAtZero: true,
                  padding: 10,
                  font: {
                     size: 14,
                     weight: 300,
                     family: "Roboto",
                     style: "normal",
                     lineHeight: 2,
                  },
                  color: "#fff",
               },
            },
            x: {
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
         },
      },
   };
}

export default configs;
