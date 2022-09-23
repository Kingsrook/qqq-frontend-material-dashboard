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

import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import Grid from "@mui/material/Grid";
import React, {useEffect, useState} from "react";
import MDBadgeDot from "qqq/components/Temporary/MDBadgeDot";
import MDBox from "qqq/components/Temporary/MDBox";
import BarChart from "qqq/pages/dashboards/Widgets/BarChart";
import LineChart from "qqq/pages/dashboards/Widgets/LineChart";
import QuickSightChart from "qqq/pages/dashboards/Widgets/QuickSightChart";
import TableCard from "qqq/pages/dashboards/Widgets/TableCard";
import QClient from "qqq/utils/QClient";

const qController = QClient.getInstance();

interface Props
{
   widgetNameList: string[];
   entityPrimaryKey?: string;
}

DashboardWidgets.defaultProps = {
   widgetNameList: null,
   entityPrimaryKey: null
};

function DashboardWidgets({widgetNameList, entityPrimaryKey}: Props): JSX.Element
{
   const [qInstance, setQInstance] = useState(null as QInstance);
   const [widgets, setWidgets] = useState([] as any[]);
   const [widgetNames, setWidgetNames] = useState([] as any[]);
   const [widgetCounter, setWidgetCounter] = useState(0);

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

      for (let i = 0; i < widgetNameList.length; i++)
      {
         widgets[i] = {};
         (async () =>
         {
            widgets[i] = await qController.widget(widgetNameList[i], `id=${entityPrimaryKey}`);
            setWidgetCounter(widgetCounter + 1);
         })();
      }
      setWidgets(widgets);
   }, [qInstance, widgetNames]);

   const widgetCount = widgets ? widgets.length : 0;

   const handleDropdownOnChange = (value: string, index: number) =>
   {
      setTimeout(async () =>
      {
         widgets[index] = await qController.widget(widgetNameList[index]);
      }, 1);
   };

   console.log(`primarkey ${entityPrimaryKey}`);
   console.log(`widgets: ${JSON.stringify(widgets)}`);

   return (
      widgetCount > 0 ? (
         <Grid item xs={12} lg={12}>
            <Grid container spacing={3}>
               {
                  widgets.map((widget, i) => (
                     <Grid key={`${i}`} item xs={12} lg={12}>
                        <MDBox mb={3}>
                           {
                              widget.type === "table" && (
                                 <TableCard
                                    color="info"
                                    title={widget.title}
                                    data={widget}
                                    dropdownOptions={widget.dropdownOptions}
                                    dropdownOnChange={handleDropdownOnChange}
                                    widgetIndex={i}
                                 />
                              )
                           }
                        </MDBox>
                     </Grid>
                  ))
               }
            </Grid>
            <Grid item xs={12} lg={widgetCount === 1 ? 3 : 6}>
               {
                  widgets.map((widget, i) => (
                     <Grid key={`${i}`} item xs={12} lg={widgetCount === 1 ? 12 : 6}>
                        {
                           widget.type === "quickSightChart" && (
                              <MDBox mb={3}>
                                 <QuickSightChart url={widget.url} label={widget.label} />
                              </MDBox>
                           )
                        }
                        {
                           widget.type === "barChart" && (
                              <MDBox mb={3}>
                                 <BarChart
                                    color="info"
                                    title={widget.title}
                                    date={`As of ${new Date().toDateString()}`}
                                    data={widget.chartData}
                                 />
                              </MDBox>
                           )
                        }
                        {
                           widget.type === "lineChart" && (
                              <MDBox mb={3}>
                                 <LineChart
                                    title={widget.title}
                                    description={(
                                       <MDBox display="flex" justifyContent="space-between">
                                          <MDBox display="flex" ml={-1}>
                                             {
                                                widget.lineChartData.datasets.map((dataSet: any) => (
                                                   <MDBadgeDot key={dataSet.label} color={dataSet.color} size="sm" badgeContent={dataSet.label} />
                                                ))
                                             }
                                          </MDBox>
                                          <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem" />
                                       </MDBox>
                                    )}
                                    chart={widget.lineChartData as { labels: string[]; datasets: { label: string; color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark"; data: number[]; }[]; }}
                                 />
                              </MDBox>
                           )
                        }
                     </Grid>
                  ))
               }
            </Grid>
         </Grid>
      ) : null
   );
}

export default DashboardWidgets;
