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
import Grid from "@mui/material/Grid";
import {useMaterialUIController} from "context";
import MDBadgeDot from "qqq/components/Temporary/MDBadgeDot";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import shipmentsByCarrierPieChartData from "qqq/pages/dashboards/Widgets/Data/ShipmentsByCarrierPieChartData";
import PieChart from "qqq/pages/dashboards/Widgets/PieChart";

function ShipmentsByCarrierPieChart(): JSX.Element
{
   const [controller] = useMaterialUIController();
   const {darkMode} = controller;

   return (
      <Card sx={{height: "100%"}}>
         <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
            <MDTypography variant="h6">Shipments By Carrier YTD</MDTypography>
         </MDBox>
         <MDBox mt={3}>
            <Grid container alignItems="center">
               <Grid item xs={7}>
                  <PieChart chart={shipmentsByCarrierPieChartData} height="12.5rem" />
               </Grid>
               <Grid item xs={5}>
                  <MDBox pr={1}>
                     <MDBox mb={1}>
                        <MDBadgeDot color="dark" size="sm" badgeContent="AxleHire" />
                     </MDBox>
                     <MDBox mb={1}>
                        <MDBadgeDot color="info" size="sm" badgeContent="CDL" />
                     </MDBox>
                     <MDBox mb={1}>
                        <MDBadgeDot color="primary" size="sm" badgeContent="DHL" />
                     </MDBox>
                     <MDBox mb={1}>
                        <MDBadgeDot color="success" size="sm" badgeContent="FedEx" />
                     </MDBox>
                     <MDBox mb={1}>
                        <MDBadgeDot color="error" size="sm" badgeContent="LSO" />
                     </MDBox>
                     <MDBox mb={1}>
                        <MDBadgeDot color="secondary" size="sm" badgeContent="OnTrac" />
                     </MDBox>
                     <MDBox mb={1}>
                        <MDBadgeDot color="warning" size="sm" badgeContent="UPS" />
                     </MDBox>
                  </MDBox>
               </Grid>
            </Grid>
         </MDBox>
         <MDBox
            pt={4}
            pb={2}
            px={2}
            display="flex"
            flexDirection={{xs: "column", sm: "row"}}
            mt="auto"
         >
            <MDBox width={{xs: "100%", sm: "60%"}} lineHeight={1}>
               <MDTypography variant="button" color="text" fontWeight="light">
                  More than <strong>1,200,000</strong> sales are made using referral marketing, and{" "}
                  <strong>700,000</strong> are from social media.
               </MDTypography>
            </MDBox>
         </MDBox>
      </Card>
   );
}

export default ShipmentsByCarrierPieChart;
