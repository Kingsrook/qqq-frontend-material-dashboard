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
   const [tableCounts, setTableCounts] = useState(new Map<string, { isLoading: boolean, value: number}>());
   const [updatedTableCounts, setUpdatedTableCounts] = useState(new Date());
   const [widgets, setWidgets] = useState([] as any[]);

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

      const tableCounts = new Map<string, { isLoading: boolean, value: number}>();
      newTables.forEach((table) =>
      {
         tableCounts.set(table.name, {isLoading: true, value: null});

         setTimeout(async () =>
         {
            const count = await qController.count(table.name);
            tableCounts.set(table.name, {isLoading: false, value: count});
            setTableCounts(tableCounts);
            setUpdatedTableCounts(new Date());
         }, 1);
      });
      setTableCounts(tableCounts);

      console.log(app.widgets);
      if (app.widgets)
      {
         const widgets: any[] = [];
         for (let i = 0; i < app.widgets.length; i++)
         {
            widgets[i] = {};
            setTimeout(async () =>
            {
               const widget = await qController.widget(app.widgets[i]);
               widgets[i] = widget;
               setUpdatedTableCounts(new Date());
            }, 1);
         }
         setWidgets(widgets);
      }
   }, [qInstance, location]);

   /*
   const charts = [
      {
         type: "barChart",
         title: "Parcel Invoice Lines per Month",
         barChartData: {
            labels: ["Feb 22", "Mar 22", "Apr 22", "May 22", "Jun 22", "Jul 22", "Aug 22"],
            datasets: {label: "Parcel Invoice Lines", data: [50000, 22000, 11111, 22333, 40404, 9876, 2355]},
         },
      },
      {
         type: "lineChart",
         title: "Total Charges by Carrier per Month",
         lineChartData: {
            labels: ["Feb 22", "Mar 22", "Apr 22", "May 22", "Jun 22", "Jul 22", "Aug 22"],
            datasets: [
               {label: "UPS", color: "info", data: [50000, 22000, 11111, 22333, 40404, 9876, 2355]},
               {label: "FedEx", color: "dark", data: [5000, 22000, 31111, 32333, 20404, 19876, 24355]},
               {label: "LSO", color: "error", data: [500, 2200, 1111, 2333, 404, 17876, 2355]},
            ],
         },
      },
   ];
   */

   console.log(`Widgets: ${widgets} and tables: ${tables}`);

   const haveWidgets = widgets && widgets.length;
   const widgetCount = widgets ? widgets.length : 0;

   // eslint-disable-next-line no-nested-ternary
   const tileSizeLg = (widgetCount === 0 ? 3 : widgetCount === 1 ? 4 : 6);

   return (
      <BaseLayout>
         <MDBox mt={4}>
            <Grid container spacing={3}>
               {
                  widgetCount > 0 ? (
                     <Grid item xs={12} lg={widgetCount === 1 ? 3 : 6}>
                        <Grid container spacing={3}>
                           {
                              widgets.map((chart) => (
                                 <Grid key={`${chart.type}-${chart.title}`} item xs={12} lg={widgetCount === 1 ? 12 : 6}>
                                    <MDBox mb={3}>
                                       {
                                          chart.type === "barChart" && (
                                             <ReportsBarChart
                                                color="info"
                                                title={chart.title}
                                                date={`As of ${new Date().toDateString()}`}
                                                chart={chart.barChartData}
                                             />
                                          )
                                       }
                                       {
                                          chart.type === "lineChart" && (
                                             <DefaultLineChart
                                                title={chart.title}
                                                description={(
                                                   <MDBox display="flex" justifyContent="space-between">
                                                      <MDBox display="flex" ml={-1}>
                                                         {
                                                            chart.lineChartData.datasets.map((dataSet: any) => (
                                                               <MDBadgeDot key={dataSet.label} color={dataSet.color} size="sm" badgeContent={dataSet.label} />
                                                            ))
                                                         }
                                                      </MDBox>
                                                      <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem" />
                                                   </MDBox>
                                                )}
                                                chart={chart.lineChartData as { labels: string[]; datasets: { label: string; color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark"; data: number[]; }[]; }}
                                             />
                                          )
                                       }
                                    </MDBox>
                                 </Grid>
                              ))
                           }
                        </Grid>
                     </Grid>
                  ) : null
               }

               {
                  tables.length > 0 || processes.length > 0 || childApps.length > 0 ? (
                     // eslint-disable-next-line no-nested-ternary
                     <Grid item xs={12} lg={widgetCount === 0 ? 12 : widgetCount === 1 ? 9 : 6}>
                        {
                           tables.length ? (
                              <MDBox mb={3}>
                                 <Card id="basic-info" sx={{overflow: "visible"}}>
                                    <MDBox p={3}>
                                       <MDTypography variant="h5">Tables</MDTypography>
                                    </MDBox>
                                    <Grid container spacing={3} padding={3} paddingTop={0}>
                                       {tables.map((table) => (
                                          <Grid key={table.name} item xs={12} md={12} lg={tileSizeLg}>
                                             <Link to={table.name}>
                                                <MDBox mb={3}>
                                                   <MiniStatisticsCard
                                                      title={{fontWeight: "bold", text: table.label}}
                                                      count={!tableCounts.has(table.name) || tableCounts.get(table.name).isLoading ? "..." : tableCounts.get(table.name).value.toLocaleString()}
                                                      percentage={{color: "info", text: (!tableCounts.has(table.name) || tableCounts.get(table.name).isLoading ? "" : "total records")}}
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
                                          <Grid key={process.name} item xs={12} md={12} lg={tileSizeLg}>
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
                                    <MDBox p={3}>
                                       <MDTypography variant="h5">Apps</MDTypography>
                                    </MDBox>
                                    <Grid container spacing={3} padding={3} paddingTop={3}>
                                       {childApps.map((childApp) => (
                                          <Grid key={childApp.name} item xs={12} md={12} lg={tileSizeLg}>
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
                  ) : null
               }

            </Grid>
         </MDBox>
      </BaseLayout>
   );
}

AppHome.defaultProps = {
   app: null,
};

export default AppHome;
