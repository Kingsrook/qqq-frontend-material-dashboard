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

interface Types {
  labels: string[];
  datasets: {
    label: string;
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    data: number[];
  }[];
}

const carrierVolumeLineChartData: Types = {
   labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
   datasets: [
      {
         label: " AxleHire",
         color: "dark",
         data: [500, 200, 110, 150, 440, 670, 100, 150, 300],
      },
      {
         label: " CDL",
         color: "info",
         data: [1000, 3000, 4000, 1200, 1500, 2200, 2800, 3500, 4500],
      },
      {
         label: " DHL",
         color: "primary",
         data: [3489, 5932, 4332, 8234, 9239, 10823, 9483, 11909, 11808],
      },
      {
         label: " FedEx",
         color: "success",
         data: [20388, 21008, 19323, 17934, 18399, 22090, 23909, 25800, 28833],
      },
      {
         label: " LSO",
         color: "error",
         data: [100, 300, 400, 1200, 1500, 2200, 2800, 2500, 2800],
      },
      {
         label: " OnTrac",
         color: "secondary",
         data: [3489, 5932, 4332, 8234, 9239, 10823, 9483, 11909, 11808],
      },
      {
         label: " UPS",
         color: "warning",
         data: [19348, 18008, 20844, 16034, 24000, 23480, 26809, 27888, 27909],
      },
   ],
};

"warning"


export default carrierVolumeLineChartData;
