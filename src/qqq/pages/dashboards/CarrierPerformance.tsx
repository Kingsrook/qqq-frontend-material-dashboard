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

import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {Icon} from "@mui/material";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, {useContext, useEffect, useState} from "react";
import QContext from "QContext";
import DashboardLayout from "qqq/components/DashboardLayout";
import Footer from "qqq/components/Footer";
import Navbar from "qqq/components/Navbar";
import {TableDataInput} from "qqq/components/Temporary/DataTable";
import MDBox from "qqq/components/Temporary/MDBox";
import ShipmentsByWarehouseTable from "qqq/pages/dashboards/Tables/ShipmentsByWarehouseTable";
import {GenericChartData} from "qqq/pages/dashboards/Widgets/Data/GenericChartData";
import smallShipmentsByWarehouseData from "qqq/pages/dashboards/Widgets/Data/SmallShipmentsByWarehouseData";
import DefaultLineChart, {DefaultLineChartData} from "qqq/pages/dashboards/Widgets/DefaultLineChart";
import HorizontalBarChart from "qqq/pages/dashboards/Widgets/HorizontalBarChart";
import {PieChartData} from "qqq/pages/dashboards/Widgets/PieChart";
import PieChartCard from "qqq/pages/dashboards/Widgets/PieChartCard";
import SimpleStatisticsCard from "qqq/pages/dashboards/Widgets/SimpleStatisticsCard";
import {StatisticsCardData} from "qqq/pages/dashboards/Widgets/StatisticsCard";
import TableCard from "qqq/pages/dashboards/Widgets/TableCard";
import QClient from "qqq/utils/QClient";

const qController = QClient.getInstance();


function CarrierPerformance(): JSX.Element
{
   const openArrowIcon = "arrow_drop_down";
   const closeArrowIcon = "arrow_drop_up";
   const [shipmentsDropdownValue, setShipmentsDropdownValue] = useState<string>("Last 30 Days");
   const [deliveriesDropdownValue, setDeliveriesDropdownValue] = useState<string>("Last 30 Days");
   const [failuresDropdownValue, setFailuresDropdownValue] = useState<string>("Last 30 Days");

   const [shipmentsDropdown, setShipmentsDropdown] = useState<string | null>(null);
   const [deliveriesDropdown, setDeliveriesDropdown] = useState<string | null>(null);
   const [failuresDropdown, setFailuresDropdown] = useState<string | null>(null);

   const [shipmentsDropdownIcon, setShipmentsDropdownIcon] = useState<string>(openArrowIcon);
   const [deliveriesDropdownIcon, setDeliveriesDropdownIcon] = useState<string>(openArrowIcon);
   const [failuresDropdownIcon, setFailuresDropdownIcon] = useState<string>(openArrowIcon);

   const openShipmentsDropdown = ({currentTarget}: any) =>
   {
      setShipmentsDropdown(currentTarget);
      setShipmentsDropdownIcon(closeArrowIcon);
   };
   const closeShipmentsDropdown = ({currentTarget}: any) =>
   {
      setShipmentsDropdown(null);
      setShipmentsDropdownValue(currentTarget.innerText || shipmentsDropdownValue);
      setShipmentsDropdownIcon(openArrowIcon);
   };
   const openDeliveriesDropdown = ({currentTarget}: any) =>
   {
      setDeliveriesDropdown(currentTarget);
      setDeliveriesDropdownIcon(closeArrowIcon);
   };
   const closeDeliveriesDropdown = ({currentTarget}: any) =>
   {
      setDeliveriesDropdown(null);
      setDeliveriesDropdownValue(currentTarget.innerText || shipmentsDropdownValue);
      setDeliveriesDropdownIcon(openArrowIcon);
   };
   const openFailuresDropdown = ({currentTarget}: any) =>
   {
      setFailuresDropdown(currentTarget);
      setFailuresDropdownIcon(closeArrowIcon);
   };
   const closeFailuresDropdown = ({currentTarget}: any) =>
   {
      setFailuresDropdown(null);
      setFailuresDropdownValue(currentTarget.innerText || shipmentsDropdownValue);
      setFailuresDropdownIcon(openArrowIcon);
   };


   const [totalShipmentsData, setTotalShipmentsData] = useState({} as StatisticsCardData);
   const [successfulDeliveriesData, setSuccessfulDeliveriesData] = useState({} as StatisticsCardData);
   const [serviceFailuresData, setServiceFailuresData] = useState({} as StatisticsCardData);

   const [shipmentsByCarrierTitle, setShipmentsByCarrierTitle] = useState("");
   const [shipmentsByCarrierDescription, setShipmentsByCarrierDescription] = useState("");
   const [shipmentsByCarrierData, setShipmentsByCarrierData] = useState({} as PieChartData);

   const [carrierVolumeTitle, setCarrierVolumeTitle] = useState("");
   const [carrierVolumeData, setCarrierVolumeData] = useState({} as DefaultLineChartData);

   const [spendByCarrierTitle, setSpendByCarrierTitle] = useState("");
   const [spendByCarrierData, setSpendByCarrierData] = useState({columns: [], rows: []} as TableDataInput);

   const [timeInTransitTitle, setTimeInTransitTitle] = useState("");
   const [timeInTransitData, setTimeInTransitData] = useState({} as GenericChartData);

   const [qInstance, setQInstance] = useState(null as QInstance);
   const [dataLoaded, setDataLoaded] = useState(false);
   const {pageHeader, setPageHeader} = useContext(QContext);

   //////////////////////////
   // load meta data first //
   //////////////////////////
   useEffect(() =>
   {
      setPageHeader("Carrier Performance");

      (async () =>
      {
         const newQInstance = await qController.loadMetaData();
         setQInstance(newQInstance);
      })();
   }, []);


   ///////////////////////////////////////////////////
   // once meta data has loaded, load widgets' data //
   ///////////////////////////////////////////////////
   useEffect(() =>
   {
      if (!qInstance || dataLoaded)
      {
         return;
      }

      setDataLoaded(true);
      loadYTDShipmentsByCarrierData();
      loadTotalShipmentsData();
      loadSuccessfulDeliveriesData();
      loadServiceFailuresData();
      loadCarrierVolumeData();
      loadSpendByCarrierData();
      loadTimeInTransitData();

   }, [qInstance]);


   function loadTotalShipmentsData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("TotalShipmentsStatisticsCard");
         setTotalShipmentsData(widgetData);
      })();
   }

   function loadSuccessfulDeliveriesData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("SuccessfulDeliveriesStatisticsCard");
         setSuccessfulDeliveriesData(widgetData);
      })();
   }

   function loadServiceFailuresData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("ServiceFailuresStatisticsCard");
         setServiceFailuresData(widgetData);
      })();
   }

   function loadCarrierVolumeData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("CarrierVolumeLineChart");
         setCarrierVolumeTitle(widgetData.title);
         setCarrierVolumeData(widgetData.chartData);
      })();
   }

   function loadYTDShipmentsByCarrierData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("YTDShipmentsByCarrierPieChart");
         setShipmentsByCarrierTitle(widgetData.title);
         setShipmentsByCarrierDescription(widgetData.description);
         setShipmentsByCarrierData(widgetData.chartData);
      })();
   }

   function loadSpendByCarrierData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("YTDSpendByCarrierTable");
         setSpendByCarrierTitle(widgetData.title);
         setSpendByCarrierData(widgetData);
      })();
   }

   function loadTimeInTransitData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("TimeInTransitBarChart");
         setTimeInTransitTitle(widgetData.title);

         ///////////////////////////////////////////////////////////////////
         // todo: need to make it so all charts can use multiple datasets //
         ///////////////////////////////////////////////////////////////////
         const data = {
            labels: widgetData.chartData.labels,
            datasets: [
               widgetData.chartData.dataset
            ]
         };
         setTimeInTransitData(data);
      })();
   }

   const renderMenu = (state: any, open: any, close: any, icon: string) => (
      <span style={{whiteSpace: "nowrap"}}>
         <Icon onClick={open} fontSize={"medium"} style={{cursor: "pointer", float: "right"}}>{icon}</Icon>
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
      </span>
   );

   return (
      <DashboardLayout>
         <Navbar />
         <MDBox py={3}>
            <MDBox mb={3}>
               <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                     <SimpleStatisticsCard
                        title={qInstance?.widgets.get("TotalShipmentsStatisticsCard").label}
                        data={totalShipmentsData}
                        increaseIsGood={true}
                        dropdown={{
                           action: openShipmentsDropdown,
                           menu: renderMenu(shipmentsDropdown, openShipmentsDropdown, closeShipmentsDropdown, shipmentsDropdownIcon),
                           value: shipmentsDropdownValue,
                        }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <SimpleStatisticsCard
                        title={qInstance?.widgets.get("SuccessfulDeliveriesStatisticsCard").label}
                        data={successfulDeliveriesData}
                        increaseIsGood={true}
                        dropdown={{
                           action: openDeliveriesDropdown,
                           menu: renderMenu(deliveriesDropdown, openDeliveriesDropdown, closeDeliveriesDropdown, deliveriesDropdownIcon),
                           value: deliveriesDropdownValue,
                        }}

                     />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <SimpleStatisticsCard
                        title={qInstance?.widgets.get("ServiceFailuresStatisticsCard").label}
                        data={serviceFailuresData}
                        increaseIsGood={false}
                        dropdown={{
                           action: openFailuresDropdown,
                           menu: renderMenu(failuresDropdown, openFailuresDropdown, closeFailuresDropdown, failuresDropdownIcon),
                           value: failuresDropdownValue,
                        }}
                     />
                  </Grid>
               </Grid>
            </MDBox>
            <MDBox mb={3}>
               <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={8}>
                     <DefaultLineChart
                        title={qInstance?.widgets.get("CarrierVolumeLineChart").label}
                        data={carrierVolumeData}
                     />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mb={3}>
                        <PieChartCard
                           title={shipmentsByCarrierTitle}
                           description={shipmentsByCarrierDescription}
                           data={shipmentsByCarrierData}
                        />
                     </MDBox>
                  </Grid>
               </Grid>
            </MDBox>
            <Grid container spacing={3} mb={3}>
               <Grid item xs={12}>
                  <TableCard
                     title={spendByCarrierTitle}
                     data={spendByCarrierData}
                  />
               </Grid>
            </Grid>
            <MDBox mb={3}>
               <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                     <HorizontalBarChart height={250} title={timeInTransitTitle} data={timeInTransitData} />
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
