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
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {Skeleton} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import parse from "html-react-parser";
import React, {useEffect, useReducer, useState} from "react";
import {useLocation} from "react-router-dom";
import MDBadgeDot from "qqq/components/Temporary/MDBadgeDot";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import BarChart from "qqq/pages/dashboards/Widgets/BarChart";
import LineChart from "qqq/pages/dashboards/Widgets/LineChart";
import MultiStatisticsCard from "qqq/pages/dashboards/Widgets/MultiStatisticsCard";
import QuickSightChart from "qqq/pages/dashboards/Widgets/QuickSightChart";
import RecordGridWidget from "qqq/pages/dashboards/Widgets/RecordGridWidget";
import StepperCard from "qqq/pages/dashboards/Widgets/StepperCard";
import TableCard from "qqq/pages/dashboards/Widgets/TableCard";
import QClient from "qqq/utils/QClient";

const qController = QClient.getInstance();

interface Props
{
   widgetMetaDataList: QWidgetMetaData[];
   entityPrimaryKey?: string;
   omitWrappingGridContainer: boolean;
}

DashboardWidgets.defaultProps = {
   widgetMetaDataList: null,
   entityPrimaryKey: null,
   omitWrappingGridContainer: false
};

function DashboardWidgets({widgetMetaDataList, entityPrimaryKey, omitWrappingGridContainer}: Props): JSX.Element
{
   const location = useLocation();
   const [qInstance, setQInstance] = useState(null as QInstance);
   const [widgetData, setWidgetData] = useState([] as any[]);
   const [widgetCounter, setWidgetCounter] = useState(0);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

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

      forceUpdate();
      for (let i = 0; i < widgetMetaDataList.length; i++)
      {
         widgetData[i] = {};
         (async () =>
         {
            widgetData[i] = await qController.widget(widgetMetaDataList[i].name, `id=${entityPrimaryKey}`);
            setWidgetCounter(widgetCounter + 1);
            forceUpdate();
         })();
      }
      setWidgetData(widgetData);
   }, [qInstance, widgetMetaDataList]);

   useEffect(() =>
   {
      setWidgetData([] as any[]);
   }, [location.pathname]);

   const handleDropdownOnChange = (value: string, index: number) =>
   {
      setTimeout(async () =>
      {
         widgetData[index] = await qController.widget(widgetMetaDataList[index].name);
      }, 1);
   };

   const widgetCount = widgetMetaDataList ? widgetMetaDataList.length : 0;
   // console.log(JSON.stringify(widgetMetaDataList));
   // console.log(widgetCount);

   const renderWidget = (widgetMetaData: QWidgetMetaData, i: number): JSX.Element =>
   {
      return (
         <>
            {
               widgetMetaData.type === "table" && (
                  <MDBox sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px", width: "100%"}}>
                     <TableCard
                        color="info"
                        title={widgetMetaData.label}
                        linkText={widgetData[i]?.linkText}
                        linkURL={widgetData[i]?.linkURL}
                        noRowsFoundHTML={widgetData[i]?.noRowsFoundHTML}
                        data={widgetData[i]}
                        dropdownOptions={widgetData[i]?.dropdownOptions}
                        dropdownOnChange={handleDropdownOnChange}
                        widgetIndex={i}
                     />
                  </MDBox>
               )
            }
            {
               widgetMetaData.type === "stepper" && (
                  <MDBox sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>
                     <Card sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>
                        <MDBox padding="1rem">
                           {
                              widgetMetaData.label && (
                                 <MDTypography variant="h5" textTransform="capitalize">
                                    {widgetMetaData.label}
                                 </MDTypography>
                              )
                           }
                           <StepperCard data={widgetData[i]} />
                        </MDBox>
                     </Card>
                  </MDBox>
               )
            }
            {
               widgetMetaData.type === "html" && (
                  <MDBox sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>
                     <Card sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>
                        <MDBox padding="1rem">
                           <MDTypography variant="h5" textTransform="capitalize">
                              {widgetMetaData.label}
                           </MDTypography>
                           <MDTypography component="div" variant="button" color="text" fontWeight="light">
                              {
                                 widgetData && widgetData[i] && widgetData[i].html ? (
                                    parse(widgetData[i].html)
                                 ) : <Skeleton />
                              }
                           </MDTypography>
                        </MDBox>
                     </Card>
                  </MDBox>
               )
            }
            {
               widgetMetaData.type === "multiStatistics" && (
                  <MDBox sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>
                     <MultiStatisticsCard
                        color="info"
                        title={widgetMetaData.label}
                        data={widgetData[i]}
                     />
                  </MDBox>
               )
            }
            {
               widgetMetaData.type === "quickSightChart" && (
                  <MDBox sx={{display: "flex"}}>
                     <QuickSightChart url={widgetData[i]?.url} label={widgetMetaData.label} />
                  </MDBox>
               )
            }
            {
               widgetMetaData.type === "barChart" && (
                  <MDBox mb={3} sx={{display: "flex"}}>
                     <BarChart
                        color="info"
                        title={widgetMetaData.label}
                        date={`As of ${new Date().toDateString()}`}
                        data={widgetData[i]?.chartData}
                     />
                  </MDBox>
               )
            }
            {
               widgetMetaData.type === "lineChart" && (
                  widgetData && widgetData[i] ? (
                     <MDBox mb={3}>
                        <LineChart
                           title={widgetData[i].title}
                           description={(
                              <MDBox display="flex" justifyContent="space-between">
                                 <MDBox display="flex" ml={-1}>
                                    {
                                       widgetData[i].lineChartData.datasets.map((dataSet: any) => (
                                          <MDBadgeDot key={dataSet.label} color={dataSet.color} size="sm" badgeContent={dataSet.label} />
                                       ))
                                    }
                                 </MDBox>
                                 <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem" />
                              </MDBox>
                           )}
                           chart={widgetData[i].lineChartData as { labels: string[]; datasets: { label: string; color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark"; data: number[]; }[]; }}
                        />
                     </MDBox>
                  ) : null
               )
            }
            {
               widgetMetaData.type === "childRecordList" && (
                  widgetData && widgetData[i] &&
                  <MDBox sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px", width: "100%"}}>
                     <RecordGridWidget
                        title={widgetMetaData.label}
                        data={widgetData[i]}
                     />
                  </MDBox>
               )
            }
         </>
      );
   }

   const body: JSX.Element =
      (
         <>
            {
               widgetMetaDataList.map((widgetMetaData, i) => (
                  omitWrappingGridContainer
                     ? renderWidget(widgetMetaData, i)
                     :
                     <Grid id={widgetMetaData.name} key={`${i}`} item lg={widgetMetaData.gridColumns ? widgetMetaData.gridColumns : 12} xs={12} sx={{display: "flex", alignItems: "stretch", scrollMarginTop: "100px"}}>
                        {renderWidget(widgetMetaData, i)}
                     </Grid>
               ))
            }
         </>
      );

   return (
      widgetCount > 0 ? (
         omitWrappingGridContainer ? body :
            (
               <Grid container spacing={3} pb={4}>
                  {body}
               </Grid>
            )
      ) : null
   );
}

export default DashboardWidgets;
