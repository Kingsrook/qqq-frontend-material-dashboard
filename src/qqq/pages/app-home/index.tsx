/* QQQ - Low-code Application Framework for Engineers.
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

import {QAppMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppMetaData";
import {QAppNodeType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppNodeType";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QReportMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QReportMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {Icon} from "@mui/material";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import BaseLayout from "qqq/components/BaseLayout";
import DashboardWidgets from "qqq/components/DashboardWidgets";
import ProcessLinkCard from "qqq/components/ProcessLinkCard";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import MiniStatisticsCard from "qqq/components/Temporary/MiniStatisticsCard";
import QClient from "qqq/utils/QClient";

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
   const [reports, setReports] = useState([] as QReportMetaData[]);
   const [childApps, setChildApps] = useState([] as QAppMetaData[]);
   const [tableCounts, setTableCounts] = useState(new Map<string, { isLoading: boolean, value: number }>());
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
      const newReports: QReportMetaData[] = [];
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
            case QAppNodeType.REPORT:
               newReports.push(qInstance.reports.get(child.name));
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
      setReports(newReports);
      setChildApps(newChildApps);

      const tableCounts = new Map<string, { isLoading: boolean, value: number }>();
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

      if (app.widgets)
      {
         ///////////////////////////
         // load widget meta data //
         ///////////////////////////
         const matchingWidgets: QWidgetMetaData[] = [];
         app.widgets.forEach((widgetName) =>
         {
            const widget = qInstance.widgets.get(widgetName);
            matchingWidgets.push(widget);
         });
         setWidgets(matchingWidgets);
      }
   }, [qInstance, location]);

   const widgetCount = widgets ? widgets.length : 0;

   // eslint-disable-next-line no-nested-ternary
   const tileSizeLg = (widgetCount === 0 ? 3 : widgetCount === 1 ? 4 : 6);

   const handleDropdownOnChange = (value: string, index: number) =>
   {
      setTimeout(async () =>
      {
         widgets[index] = await qController.widget(app.widgets[index]);
      }, 1);
   };


   return (
      <BaseLayout>
         <MDBox mt={4}>
            {app.widgets && (
               <Grid container spacing={3}>
                  <DashboardWidgets widgetMetaDataList={widgets} />
               </Grid>
            )}
            <Grid container spacing={3}>
               {
                  app.sections ? (
                     <Grid item xs={12} lg={widgetCount === 0 ? 12 : widgetCount === 1 ? 9 : 6}>
                        {app.sections.map((section) => (
                           <MDBox key={section.name} mb={3}>
                              <Card sx={{overflow: "visible"}}>
                                 <MDBox p={3}>
                                    <MDTypography variant="h5">{section.label}</MDTypography>
                                 </MDBox>
                                 {
                                    section.processes ? (
                                       <MDBox p={3} pl={5} pt={0}>
                                          <MDTypography variant="h6">Actions</MDTypography>
                                       </MDBox>
                                    ) : null
                                 }
                                 {
                                    section.processes ? (
                                       <Grid container spacing={3} padding={3} paddingTop={0}>
                                          {
                                             section.processes.map((processName) =>
                                             {
                                                let process = app.childMap.get(processName);
                                                return (
                                                   <Grid key={process.name} item xs={12} md={12} lg={tileSizeLg}>
                                                      <Link to={process.name}>
                                                         <ProcessLinkCard
                                                            icon={process.iconName || app.iconName}
                                                            title={process.label}
                                                         />
                                                      </Link>
                                                   </Grid>
                                                );
                                             })
                                          }
                                       </Grid>
                                    ) : null
                                 }
                                 {
                                    section.processes && section.reports ? (
                                       <Divider />
                                    ) : null
                                 }
                                 {
                                    section.reports ? (
                                       <MDBox p={3} pl={5} pt={0}>
                                          <MDTypography variant="h6">Reports</MDTypography>
                                       </MDBox>
                                    ) : null
                                 }
                                 {
                                    section.reports ? (
                                       <Grid container spacing={3} padding={3} paddingTop={0}>
                                          {
                                             section.reports.map((reportName) =>
                                             {
                                                let report = app.childMap.get(reportName);
                                                return (
                                                   <Grid key={report.name} item xs={12} md={12} lg={tileSizeLg}>
                                                      <Link to={report.name}>
                                                         <ProcessLinkCard
                                                            icon={report.iconName || app.iconName}
                                                            title={report.label}
                                                            isReport={true}
                                                         />
                                                      </Link>
                                                   </Grid>
                                                );
                                             })
                                          }
                                       </Grid>
                                    ) : null
                                 }
                                 {
                                    section.reports && section.tables ? (
                                       <Divider />
                                    ) : null
                                 }
                                 {
                                    section.tables ? (
                                       <MDBox p={3} pl={5} pb={0} pt={0}>
                                          <MDTypography variant="h6">Data</MDTypography>
                                       </MDBox>
                                    ) : null
                                 }
                                 {
                                    section.tables ? (
                                       <Grid container spacing={3} padding={3} paddingBottom={0} paddingTop={0}>
                                          {
                                             section.tables.map((tableName) =>
                                             {
                                                let table = app.childMap.get(tableName);
                                                return (
                                                   <Grid key={table.name} item xs={12} md={12} lg={tileSizeLg}>
                                                      <Link to={table.name}>
                                                         <MDBox mb={3}>
                                                            <MiniStatisticsCard
                                                               title={{fontWeight: "bold", text: table.label}}
                                                               count={!tableCounts.has(table.name) || tableCounts.get(table.name).isLoading ? "..." : tableCounts.get(table.name).value.toLocaleString()}
                                                               percentage={{color: "info", text: (!tableCounts.has(table.name) || tableCounts.get(table.name).isLoading ? "" : (tableCounts.get(table.name).value === 1 ? "total record" : "total records"))}}
                                                               icon={{color: "info", component: <Icon>{table.iconName || app.iconName}</Icon>}}
                                                               direction="right"
                                                            />
                                                         </MDBox>
                                                      </Link>
                                                   </Grid>
                                                );
                                             })
                                          }
                                       </Grid>
                                    ) : null
                                 }
                              </Card>
                           </MDBox>
                        ))}
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
