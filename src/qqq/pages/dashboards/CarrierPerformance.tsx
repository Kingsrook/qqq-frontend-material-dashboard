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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import {useState} from "react";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import Footer from "qqq/components/Footer";
import Navbar from "qqq/components/Navbar";
import MDBadgeDot from "qqq/components/Temporary/MDBadgeDot";
import MDBox from "qqq/components/Temporary/MDBox";
import MDButton from "qqq/components/Temporary/MDButton";
import MDTypography from "qqq/components/Temporary/MDTypography";
import ShipmentsByWarehouseTable from "qqq/pages/dashboards/Tables/ShipmentsByWarehouseTable";
import carrierSpendData from "qqq/pages/dashboards/Widgets/Data/CarrierSpendData";
import carrierVolumeLineChartData from "qqq/pages/dashboards/Widgets/Data/CarrierVolumeLineChartData";
import smallShipmentsByWarehouseData from "qqq/pages/dashboards/Widgets/Data/SmallShipmentsByWarehouseData";
import timeInTransitBarChartData from "qqq/pages/dashboards/Widgets/Data/timeInTransitBarChartData";
import ShipmentsByCarrierPieChart from "qqq/pages/dashboards/Widgets/ShipmentsByChannelPieChart";
import SimpleStatisticsCard from "qqq/pages/dashboards/Widgets/SimpleStatisticsCard";
import HorizontalBarChart from "./Widgets/HorizontalBarChart";

function CarrierPerformance(): JSX.Element
{
   const [salesDropdownValue, setSalesDropdownValue] = useState<string>("Last 30 Days");
   const [customersDropdownValue, setCustomersDropdownValue] = useState<string>("Last 30 Days");
   const [revenueDropdownValue, setRevenueDropdownValue] = useState<string>("Last 30 Days");

   const [salesDropdown, setSalesDropdown] = useState<string | null>(null);
   const [customersDropdown, setCustomersDropdown] = useState<string | null>(null);
   const [revenueDropdown, setRevenueDropdown] = useState<string | null>(null);

   const openSalesDropdown = ({currentTarget}: any) => setSalesDropdown(currentTarget);
   const closeSalesDropdown = ({currentTarget}: any) =>
   {
      setSalesDropdown(null);
      setSalesDropdownValue(currentTarget.innerText || salesDropdownValue);
   };
   const openCustomersDropdown = ({currentTarget}: any) => setCustomersDropdown(currentTarget);
   const closeCustomersDropdown = ({currentTarget}: any) =>
   {
      setCustomersDropdown(null);
      setCustomersDropdownValue(currentTarget.innerText || salesDropdownValue);
   };
   const openRevenueDropdown = ({currentTarget}: any) => setRevenueDropdown(currentTarget);
   const closeRevenueDropdown = ({currentTarget}: any) =>
   {
      setRevenueDropdown(null);
      setRevenueDropdownValue(currentTarget.innerText || salesDropdownValue);
   };

   // Dropdown menu template for the DefaultStatisticsCard
   const renderMenu = (state: any, close: any) => (
      <Menu
         anchorEl={state}
         transformOrigin={{vertical: "top", horizontal: "center"}}
         open={Boolean(state)}
         onClose={close}
         keepMounted
         disableAutoFocusItem
      >
         <MenuItem onClick={close}>Last 7 days</MenuItem>
         <MenuItem onClick={close}>Last week</MenuItem>
         <MenuItem onClick={close}>Last 30 days</MenuItem>
      </Menu>
   );

   return (
      <DashboardLayout>
         <Navbar />
         <MDBox py={3}>
            <MDBox mb={3}>
               <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                     <SimpleStatisticsCard
                        title="total shipments"
                        count="50,234"
                        percentage={{
                           color: "success",
                           value: "+5%",
                           label: "since last month",
                        }}
                        dropdown={{
                           action: openSalesDropdown,
                           menu: renderMenu(salesDropdown, closeSalesDropdown),
                           value: salesDropdownValue,
                        }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <SimpleStatisticsCard
                        title="Successful deliveries"
                        count="49,234"
                        percentage={{
                           color: "success",
                           value: "+12%",
                           label: "since last month",
                        }}
                        dropdown={{
                           action: openCustomersDropdown,
                           menu: renderMenu(customersDropdown, closeCustomersDropdown),
                           value: customersDropdownValue,
                        }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <SimpleStatisticsCard
                        title="service failures"
                        count="832"
                        percentage={{
                           color: "error",
                           value: "+1.2%",
                           label: "since last month",
                        }}
                        dropdown={{
                           action: openRevenueDropdown,
                           menu: renderMenu(revenueDropdown, closeRevenueDropdown),
                           value: revenueDropdownValue,
                        }}
                     />
                  </Grid>
               </Grid>
            </MDBox>
            <MDBox mb={3}>
               <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={4}>
                     <ShipmentsByCarrierPieChart />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={8}>
                     <DefaultLineChart
                        title="Carrier Volume by Month"
                        description={
                           <MDBox display="flex" justifyContent="space-between">
                              <MDBox display="flex" ml={-1}>
                                 <MDBadgeDot color="dark" size="sm" badgeContent="AxleHire" />
                                 <MDBadgeDot color="info" size="sm" badgeContent="CDL" />
                                 <MDBadgeDot color="primary" size="sm" badgeContent="DHL" />
                                 <MDBadgeDot color="success" size="sm" badgeContent="FedEx" />
                                 <MDBadgeDot color="error" size="sm" badgeContent="LSO" />
                                 <MDBadgeDot color="secondary" size="sm" badgeContent="OnTrac" />
                                 <MDBadgeDot color="warning" size="sm" badgeContent="UPS" />
                              </MDBox>
                           </MDBox>
                        }
                        chart={carrierVolumeLineChartData}
                     />
                  </Grid>
               </Grid>
            </MDBox>
            <Grid container spacing={3} mb={3}>
               <Grid item xs={12}>
                  <Card>
                     <MDBox pt={3} px={3}>
                        <MDTypography variant="h6" fontWeight="medium">
                           Spend by Carrier YTD
                        </MDTypography>
                     </MDBox>
                     <MDBox py={1}>
                        <DataTable
                           table={carrierSpendData}
                           entriesPerPage={false}
                           showTotalEntries={false}
                           isSorted={false}
                           noEndBorder
                        />
                     </MDBox>
                  </Card>
               </Grid>
            </Grid>
            <MDBox mb={3}>
               <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                     <HorizontalBarChart title="Time in Transit Last 30 Days" chart={timeInTransitBarChartData} />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                     <ShipmentsByWarehouseTable title="Shipments by Warehouse" rows={smallShipmentsByWarehouseData} />
                  </Grid>
               </Grid>
            </MDBox>
         </MDBox>
         <Footer />
      </DashboardLayout>
   );
}

export default CarrierPerformance;
