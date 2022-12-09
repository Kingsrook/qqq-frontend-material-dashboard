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
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import {useContext, useEffect, useState} from "react";
import QContext from "QContext";
import DashboardLayout from "qqq/components/DashboardLayout";
import Footer from "qqq/components/Footer";
import Navbar from "qqq/components/Navbar";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import BarChart from "qqq/pages/dashboards/Widgets/BarChart";
import {GenericChartDataSingleDataset} from "qqq/pages/dashboards/Widgets/Data/GenericChartDataSingleDataset";
import LocationCard, {LocationCardData} from "qqq/pages/dashboards/Widgets/LocationCard";
import {PieChartData} from "qqq/pages/dashboards/Widgets/PieChart";
import PieChartCard from "qqq/pages/dashboards/Widgets/PieChartCard";
import ShipmentsByWarehouse from "qqq/pages/dashboards/Widgets/ShipmentsByWarehouse";
import SmallLineChart from "qqq/pages/dashboards/Widgets/SmallLineChart";
import StatisticsCard, {StatisticsCardData} from "qqq/pages/dashboards/Widgets/StatisticsCard";
import QClient from "qqq/utils/QClient";

const qController = QClient.getInstance();

function Overview(): JSX.Element
{
   //////////////////////////////////
   // shipments by day widget data //
   //////////////////////////////////
   const [shipmentsByDayTitle, setShipmentsByDayTitle] = useState("");
   const [shipmentsByDayDescription, setShipmentsByDayDescription] = useState("");
   const [shipmentsByDayData, setShipmentsByDayData] = useState({} as GenericChartDataSingleDataset);

   const [shipmentsByMonthTitle, setShipmentsByMonthTitle] = useState("");
   const [shipmentsByMonthDescription, setShipmentsByMonthDescription] = useState("");
   const [shipmentsByMonthData, setShipmentsByMonthData] = useState({} as GenericChartDataSingleDataset);

   const [shipmentsByCarrierTitle, setShipmentsByCarrierTitle] = useState("");
   const [shipmentsByCarrierDescription, setShipmentsByCarrierDescription] = useState("");
   const [shipmentsByCarrierData, setShipmentsByCarrierData] = useState({} as PieChartData);

   const [todaysShipmentsData, setTodaysShipmentsData] = useState({} as StatisticsCardData);
   const [shipmentsInTransitData, setShipmentsInTransitData] = useState({} as StatisticsCardData);
   const [openOrdersData, setOpenOrdersData] = useState({} as StatisticsCardData);
   const [shippingExceptionsData, setShippingExceptionsData] = useState({} as StatisticsCardData);

   const [warehouseData, setWarehouseData] = useState([] as LocationCardData[]);

   const [qInstance, setQInstance] = useState(null as QInstance);
   const {pageHeader, setPageHeader} = useContext(QContext);


   //////////////////////////
   // load meta data first //
   //////////////////////////
   useEffect(() =>
   {
      setPageHeader("Overview");

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
      if (!qInstance)
      {
         return;
      }

      loadShipmentsByDayData();
      loadShipmentsByMonthData();
      loadYTDShipmentsByCarrierData();

      loadTodaysShipmentsData();
      loadShipmentsInTransitData();
      loadOpenOrdersData();
      loadShippingExceptionsData();

      loadWarehouseData();

   }, [qInstance]);


   function loadShipmentsByDayData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("TotalShipmentsByDayBarChart");

         ////////////////////////////////////////////////////////////
         // calculate average and number of days over that average //
         ////////////////////////////////////////////////////////////
         let dataValues = widgetData.chartData.dataset.data;
         let totalShipments = 0;
         for (let i = 0; i < dataValues.length; i++)
         {
            totalShipments += dataValues[i];
         }

         let daysOverAverage = 0;
         let average = Math.floor(totalShipments / 7);
         for (let i = 0; i < dataValues.length; i++)
         {
            if (dataValues[i] > average)
            {
               daysOverAverage++;
            }
         }

         const description = "Over the last week there have been <strong>" + daysOverAverage.toLocaleString() + (daysOverAverage == 1 ? " day" : " days") + "</strong> with total shipments greater than the daily average of <strong>" + average.toLocaleString() + " shipments</strong>.";
         setShipmentsByDayTitle(widgetData.title);
         setShipmentsByDayData(widgetData.chartData);
         setShipmentsByDayDescription(description);
      })();
   }

   function loadShipmentsByMonthData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("TotalShipmentsByMonthLineChart");

         /////////////////////////////////////////////
         // calculate if 'increasing or decreasing' //
         /////////////////////////////////////////////
         let dataValues = widgetData.chartData.dataset.data;
         let firstHalf = 0;
         let secondHalf = 0;
         for (let i = 0; i < dataValues.length; i++)
         {
            if (i < dataValues.length / 2)
            {
               firstHalf += dataValues[i];
            }
            else
            {
               secondHalf += dataValues[i];
            }
         }

         const description = "Total shipments have been <strong>" + ((secondHalf >= firstHalf) ? "increasing" : "decreasing") + "</strong> over the last eight months.";
         setShipmentsByMonthTitle(widgetData.title);
         setShipmentsByMonthDescription(description);
         setShipmentsByMonthData(widgetData.chartData);
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


   function loadTodaysShipmentsData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("TodaysShipmentsStatisticsCard");
         setTodaysShipmentsData(widgetData);
      })();
   }


   function loadShipmentsInTransitData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("ShipmentsInTransitStatisticsCard");
         setShipmentsInTransitData(widgetData);
      })();
   }


   function loadOpenOrdersData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("OpenOrdersStatisticsCard");
         setOpenOrdersData(widgetData);
      })();
   }

   function loadShippingExceptionsData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("ShippingExceptionsStatisticsCard");
         setShippingExceptionsData(widgetData);
      })();
   }

   function loadWarehouseData()
   {
      (async () =>
      {
         const widgetData = await qController.widget("WarehouseLocationCards");
         setWarehouseData(widgetData);
      })();
   }


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
                           title={qInstance?.widgets?.get("TotalShipmentsByDayBarChart").label}
                           description={shipmentsByDayDescription}
                           date="Updated 3 minutes ago"
                           data={shipmentsByDayData}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mb={3}>
                        <PieChartCard
                           title={qInstance?.widgets?.get("YTDShipmentsByCarrierPieChart").label}
                           description={shipmentsByCarrierDescription}
                           data={shipmentsByCarrierData}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                     <MDBox mb={3}>
                        <SmallLineChart
                           color="dark"
                           title={qInstance?.widgets?.get("TotalShipmentsByMonthLineChart").label}
                           description={shipmentsByMonthDescription}
                           date=""
                           chart={shipmentsByMonthData}
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
                           data={todaysShipmentsData}
                           increaseIsGood={true}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                     <MDBox mb={1.5}>
                        <StatisticsCard
                           icon="local_shipping"
                           data={shipmentsInTransitData}
                           increaseIsGood={true}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                     <MDBox mb={1.5}>
                        <StatisticsCard
                           color="warning"
                           icon="receipt"
                           data={openOrdersData}
                           increaseIsGood={true}
                        />
                     </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                     <MDBox mb={1.5}>
                        <StatisticsCard
                           color="error"
                           icon="error"
                           data={shippingExceptionsData}
                           increaseIsGood={false}
                        />
                     </MDBox>
                  </Grid>
               </Grid>
            </MDBox>
            <MDBox mt={2}>
               <Grid container spacing={3}>
                  {
                     // @ts-ignore
                     warehouseData && warehouseData.locationDataList?.map((data) => (
                        <Grid item xs={12} md={6} lg={4} key={data.title}>
                           <MDBox mt={3}>
                              <LocationCard
                                 locationData={data}
                                 action={actionButtons}
                              />
                           </MDBox>
                        </Grid>
                     ))
                  }
               </Grid>
            </MDBox>
         </MDBox>
         <Footer />
      </DashboardLayout>
   );
}

export default Overview;
