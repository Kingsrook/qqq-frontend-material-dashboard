/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// types
interface Types {
  labels: string[];
  datasets: {
    label: string;
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    data: number[];
  }[];
}

const timeInTransitBarChartData: Types = {
   labels: ["<1", "1", "2", "3", "3+"],
   datasets: [
      {
         label: " time in transit",
         color: "dark",
         data: [150, 2088, 8888, 5883, 203],
      },
   ],
};

export default timeInTransitBarChartData;
