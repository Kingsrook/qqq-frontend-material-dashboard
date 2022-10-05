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
import Icon from "@mui/material/Icon";
import {VectorMap} from "@react-jvectormap/core";
import {usAea} from "@react-jvectormap/unitedstates";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import ShipmentsByWarehouseTable from "qqq/pages/dashboards/Tables/ShipmentsByWarehouseTable";
import shipmentsByWarehouseData from "qqq/pages/dashboards/Widgets/Data/ShipmentsByWarehouseData";

function ShipmentsByWarehouseData(): JSX.Element
{
   return (
      <Card sx={{width: "100%"}}>
         <MDBox display="flex">
            <MDBox
               display="flex"
               justifyContent="center"
               alignItems="center"
               width="4rem"
               height="4rem"
               variant="gradient"
               bgColor="info"
               color="white"
               shadow="md"
               borderRadius="xl"
               ml={3}
               mt={-2}
            >
               <Icon fontSize="medium" color="inherit">
                  warehouse
               </Icon>
            </MDBox>
            <MDTypography variant="h5" sx={{mt: 2, mb: 1, ml: 2}}>
               Shipments by Warehouse
            </MDTypography>
         </MDBox>
         <MDBox p={2}>
            <Grid container>
               <Grid item xs={12} md={7} lg={6}>
                  <ShipmentsByWarehouseTable rows={shipmentsByWarehouseData} shadow={false} />
               </Grid>
               <Grid item xs={12} md={5} lg={6} sx={{mt: {xs: 5, lg: 0}}}>
                  <VectorMap
                     map={usAea}
                     zoomOnScroll={false}
                     zoomButtons={false}
                     markersSelectable
                     backgroundColor="transparent"
                     markers={[
                        {
                           name: "edison",
                           latLng: [40.5274, -74.3933],
                        },
                        {
                           name: "stockton",
                           latLng: [37.975556, -121.300833],
                        },
                        {
                           name: "patterson",
                           latLng: [37.473056, -121.132778],
                        },
                     ]}
                     regionStyle={{
                        initial: {
                           fill: "#dee2e7",
                           "fill-opacity": 1,
                           stroke: "none",
                           "stroke-width": 0,
                           "stroke-opacity": 0,
                        },
                     }}
                     markerStyle={{
                        initial: {
                           fill: "#e91e63",
                           stroke: "#ffffff",
                           "stroke-width": 5,
                           "stroke-opacity": 0.5,
                           r: 7,
                        },
                        hover: {
                           fill: "E91E63",
                           stroke: "#ffffff",
                           "stroke-width": 5,
                           "stroke-opacity": 0.5,
                        },
                        selected: {
                           fill: "E91E63",
                           stroke: "#ffffff",
                           "stroke-width": 5,
                           "stroke-opacity": 0.5,
                        },
                     }}
                     style={{
                        marginTop: "-1.5rem",
                     }}
                     onRegionTipShow={() => false}
                     onMarkerTipShow={() => false}
                  />
               </Grid>
            </Grid>
         </MDBox>
      </Card>
   );
}

export default ShipmentsByWarehouseData;
