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

import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

// Material Dashboard 2 PRO React TS examples components
import QClient from "qqq/utils/QClient";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QAppMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppMetaData";
import BaseLayout from "qqq/components/BaseLayout";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import {Icon} from "@mui/material";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import MDBadgeDot from "components/MDBadgeDot";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QAppNodeType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppNodeType";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import ProcessLinkCard from "qqq/components/ProcessLinkCard";

const qController = QClient.getInstance();

interface Props
{
   app?: QAppMetaData;
}

function AppHome({app}: Props): JSX.Element
{
   const [qInstance, setQInstance] = useState(null as QInstance);
   const [tables, setTables] = useState([] as QTableMetaData[]);
   const [processes, setProcesses] = useState([] as QProcessMetaData[]);
   const [childApps, setChildApps] = useState([] as QAppMetaData[]);

   const location = useLocation();

   useEffect(() =>
   {
      (async () =>
      {
         const newQInstance = await qController.loadMetaData();
         setQInstance(newQInstance);
      })();
   }, []);

   useEffect(() =>
   {
      if (!qInstance)
      {
         return;
      }

      const newTables: QTableMetaData[] = [];
      const newProcesses: QProcessMetaData[] = [];
      const newChildApps: QAppMetaData[] = [];

      app.children.forEach((child) =>
      {
         switch (child.type)
         {
            // todo - filter out hidden
            case QAppNodeType.TABLE:
               newTables.push(qInstance.tables.get(child.name));
               break;
            case QAppNodeType.PROCESS:
               newProcesses.push(qInstance.processes.get(child.name));
               break;
            case QAppNodeType.APP:
               newChildApps.push(qInstance.apps.get(child.name));
               break;
            default:
               console.log(`Unexpected child type: ${child.type}`);
         }
      });

      setTables(newTables);
      setProcesses(newProcesses);
      setChildApps(newChildApps);
   }, [qInstance, location]);

   const reportsBarChartData = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: {label: "Sales", data: [50, 20, 10, 22, 50, 10, 40]},
   };

   interface Types {
      labels: string[];
      datasets: {
         label: string;
         color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
         data: number[];
      }[];
   }

   const demoLineChartData: Types = {
      labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
         {
            label: "Facebook Ads",
            color: "info",
            data: [50, 100, 200, 190, 400, 350, 500, 450, 700],
         },
         {
            label: "Google Ads",
            color: "dark",
            data: [10, 30, 40, 120, 150, 220, 280, 250, 280],
         },
      ],
   };

   return (
      <BaseLayout>
         <MDBox mt={4}>
            <Grid container spacing={3}>

               <Grid item xs={6} lg={6}>
                  <Grid container spacing={3}>

                     <Grid item xs={6} lg={6}>
                        <MDBox mb={3}>
                           <MDBox mb={3}>
                              <ReportsBarChart
                                 color="info"
                                 title="Packages Shipped"
                                 description="Total outbound shipments"
                                 date="Updated at 7:04 a.m. ET"
                                 chart={reportsBarChartData}
                              />
                           </MDBox>
                        </MDBox>
                     </Grid>

                     <Grid item xs={6} lg={6}>
                        <DefaultLineChart
                           title="Revenue"
                           description={(
                              <MDBox display="flex" justifyContent="space-between">
                                 <MDBox display="flex" ml={-1}>
                                    <MDBadgeDot color="info" size="sm" badgeContent="UPS" />
                                    <MDBadgeDot color="dark" size="sm" badgeContent="FedEx" />
                                 </MDBox>
                                 <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem" />
                              </MDBox>
                           )}
                           chart={demoLineChartData}
                        />
                     </Grid>

                  </Grid>
               </Grid>

               <Grid item xs={6} lg={6}>
                  {
                     tables.length ? (
                        <MDBox mb={3}>
                           <Card id="basic-info" sx={{overflow: "visible"}}>
                              <MDBox p={3}>
                                 <MDTypography variant="h5">Tables</MDTypography>
                              </MDBox>
                              <Grid container spacing={3} padding={3} paddingTop={0}>
                                 {tables.map((table) => (
                                    <Grid key={table.name} item xs={12} md={12} lg={6}>
                                       <Link to={table.name}>
                                          <MDBox mb={3}>
                                             <MiniStatisticsCard
                                                title={{fontWeight: "bold", text: table.label}}
                                                count="17,013"
                                                percentage={{color: "info", text: "total records"}}
                                                icon={{color: "info", component: <Icon>{table.iconName || app.iconName}</Icon>}}
                                                direction="right"
                                             />
                                          </MDBox>
                                       </Link>
                                    </Grid>
                                 ))}
                              </Grid>
                           </Card>
                        </MDBox>
                     ) : null
                  }

                  {
                     processes.length ? (
                        <MDBox mb={3}>
                           <Card id="basic-info" sx={{overflow: "visible"}}>
                              <MDBox p={3}>
                                 <MDTypography variant="h5">Processes</MDTypography>
                              </MDBox>
                              <Grid container spacing={3} padding={3} paddingTop={3}>
                                 {processes.map((process) => (
                                    <Grid key={process.name} item xs={12} md={12} lg={6}>
                                       <Link to={process.name}>
                                          <ProcessLinkCard
                                             icon={process.iconName || app.iconName}
                                             title={process.label}
                                          />
                                       </Link>
                                    </Grid>
                                 ))}
                              </Grid>
                           </Card>
                        </MDBox>
                     ) : null
                  }

                  {
                     childApps.length ? (
                        <MDBox mb={3}>
                           <Card id="basic-info" sx={{overflow: "visible"}}>
                              <Grid container spacing={3} padding={3} paddingTop={3}>
                                 {childApps.map((childApp) => (
                                    <Grid key={childApp.name} item xs={12} md={12} lg={6}>
                                       <Link to={childApp.name}>
                                          <DefaultInfoCard
                                             icon={childApp.iconName || app.iconName}
                                             title={childApp.label}
                                          />
                                       </Link>
                                    </Grid>
                                 ))}
                              </Grid>
                           </Card>
                        </MDBox>
                     ) : null
                  }
               </Grid>

            </Grid>
         </MDBox>
      </BaseLayout>
   );
}

AppHome.defaultProps = {
   app: null,
};

export default AppHome;
