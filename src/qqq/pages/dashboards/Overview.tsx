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

import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import booking1 from "assets/images/products/product-1-min.jpg";
import booking2 from "assets/images/products/product-2-min.jpg";
import booking3 from "assets/images/products/product-3-min.jpg";
import DashboardLayout from "qqq/components/DashboardLayout";
import Footer from "qqq/components/Footer";
import Navbar from "qqq/components/Navbar";
import BookingCard from "qqq/components/Temporary/BookingCard";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import BarChart from "qqq/pages/dashboards/Widgets/BarChart";
import shipmentsByDayBarChartData from "qqq/pages/dashboards/Widgets/Data/ShipmentsByDayBarChartData";
import shipmentsByMonthLineChartData from "qqq/pages/dashboards/Widgets/Data/ShipmentsByMonthLineChartData";
import ShipmentsByCarrierPieChart from "qqq/pages/dashboards/Widgets/ShipmentsByChannelPieChart";
import ShipmentsByWarehouse from "qqq/pages/dashboards/Widgets/ShipmentsByWarehouse";
import SmallLineChart from "qqq/pages/dashboards/Widgets/SmallLineChart";
import StatisticsCard from "qqq/pages/dashboards/Widgets/StatisticsCard";

function Overview(): JSX.Element
{
   const actionButtons = (
      <>
         <Tooltip title="Refresh" placement="bottom">
            <MDTypography
               variant="body1"
               color="primary"
               lineHeight={1}
               sx={{cursor: "pointer", mx: 3}}
            >
               <Icon color="inherit">refresh</Icon>
            </MDTypography>
         </Tooltip>
         <Tooltip title="Edit" placement="bottom">
            <MDTypography variant="body1" color="info" lineHeight={1} sx={{cursor: "pointer", mx: 3}}>
               <Icon color="inherit">edit</Icon>
            </MDTypography>
         </Tooltip>
      </>
   );

   return (
      <DashboardLayout>
         <Navbar />
         <MDBox py={3}>
            <Grid container>
               <ShipmentsByWarehouse />
            </Grid>
            <MDBox mt={6}>
               <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mb={3}>
                        <BarChart
                           color="info"
                           title="Total Shipments by Day"
                           description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at auctor leo. Aliquam luctus est purus, ut placerat libero aliquet sed. Quisque consequat sem vitae iaculis tempus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. "
                           date="Updated 3 minutes ago"
                           chart={shipmentsByDayBarChartData}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mb={3}>
                        <ShipmentsByCarrierPieChart />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mb={3}>
                        <SmallLineChart
                           color="dark"
                           title="shipments by month"
                           description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at auctor leo. Aliquam luctus est purus, ut placerat libero aliquet sed. Quisque consequat sem vitae iaculis tempus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. "
                           date="Just updated"
                           chart={shipmentsByMonthLineChartData}
                        />
                     </MDBox>
                  </Grid>
               </Grid>
            </MDBox>
            <MDBox mt={1.5}>
               <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={3}>
                     <MDBox mb={1.5}>
                        <StatisticsCard
                           icon="widgets"
                           title="Today's Shipments"
                           count="2,813"
                           percentage={{
                              color: "success",
                              amount: "+15%",
                              label: "than lask week",
                           }}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                     <MDBox mb={1.5}>
                        <StatisticsCard
                           icon="local_shipping"
                           title="Shipments In Transit"
                           count="1,023"
                           percentage={{
                              color: "success",
                              amount: "+1%",
                              label: "than yesterday",
                           }}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                     <MDBox mb={1.5}>
                        <StatisticsCard
                           color="warning"
                           icon="receipt"
                           title="Open Orders"
                           count="213"
                           percentage={{
                              color: "error",
                              amount: "+3%",
                              label: "than last week",
                           }}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                     <MDBox mb={1.5}>
                        <StatisticsCard
                           color="error"
                           icon="error"
                           title="Shipping Exceptions"
                           count="28"
                           percentage={{
                              color: "success",
                              amount: "-12%",
                              label: "than yesterday",
                           }}
                        />
                     </MDBox>
                  </Grid>
               </Grid>
            </MDBox>
            <MDBox mt={2}>
               <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mt={3}>
                        <BookingCard
                           image={booking1}
                           title="Warehouse Performance Report"
                           description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
                           price="99% SLA"
                           location="Edison, NJ"
                           action={actionButtons}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mt={3}>
                        <BookingCard
                           image={booking3}
                           title="Warehouse Performance Report"
                           description='The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Milan.'
                           price="98% SLA"
                           location="Patterson, CA"
                           action={actionButtons}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mt={3}>
                        <BookingCard
                           image={booking2}
                           title="Warehouse Performance Report"
                           description='The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the night life in London, UK.'
                           price="95% SLA"
                           location="Stockton, CA"
                           action={actionButtons}
                        />
                     </MDBox>
                  </Grid>
               </Grid>
            </MDBox>
         </MDBox>
         <Footer />
      </DashboardLayout>
   );
}

export default Overview;
