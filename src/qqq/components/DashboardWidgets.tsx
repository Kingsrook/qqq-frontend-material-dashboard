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
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import parse from "html-react-parser";
import React, {useEffect, useReducer, useState} from "react";
import {useLocation} from "react-router-dom";
import MDBadgeDot from "qqq/components/Temporary/MDBadgeDot";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import BarChart from "qqq/pages/dashboards/Widgets/BarChart";
import DefaultLineChart from "qqq/pages/dashboards/Widgets/DefaultLineChart";
import FieldValueListWidget from "qqq/pages/dashboards/Widgets/FieldValueListWidget";
import HorizontalBarChart from "qqq/pages/dashboards/Widgets/HorizontalBarChart";
import MultiStatisticsCard from "qqq/pages/dashboards/Widgets/MultiStatisticsCard";
import ParentWidget from "qqq/pages/dashboards/Widgets/ParentWidget";
import QuickSightChart from "qqq/pages/dashboards/Widgets/QuickSightChart";
import RecordGridWidget from "qqq/pages/dashboards/Widgets/RecordGridWidget";
import SimpleStatisticsCard from "qqq/pages/dashboards/Widgets/SimpleStatisticsCard";
import StepperCard from "qqq/pages/dashboards/Widgets/StepperCard";
import TableCard from "qqq/pages/dashboards/Widgets/TableCard";
import Widget from "qqq/pages/dashboards/Widgets/Widget";
import ProcessRun from "qqq/pages/process-run";
import QClient from "qqq/utils/QClient";


const qController = QClient.getInstance();

interface Props
{
   widgetMetaDataList: QWidgetMetaData[];
   entityPrimaryKey?: string;
   omitWrappingGridContainer: boolean;
   areChildren?: boolean
   childUrlParams?: string
}

DashboardWidgets.defaultProps = {
   widgetMetaDataList: null,
   entityPrimaryKey: null,
   omitWrappingGridContainer: false,
   areChildren: false,
   childUrlParams: ""
};

function DashboardWidgets({widgetMetaDataList, entityPrimaryKey, omitWrappingGridContainer, areChildren, childUrlParams}: Props): JSX.Element
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
            widgetData[i] = await qController.widget(widgetMetaDataList[i].name, `id=${entityPrimaryKey}&${childUrlParams}`);
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

   const reloadWidget = (index: number, data: string) =>
   {
      setTimeout(async () =>
      {
         widgetData[index] = await qController.widget(widgetMetaDataList[index].name, `id=${entityPrimaryKey}&${data}`);
         setWidgetCounter(widgetCounter + 1);
      }, 1);
   };

   const widgetCount = widgetMetaDataList ? widgetMetaDataList.length : 0;

   const renderWidget = (widgetMetaData: QWidgetMetaData, i: number): JSX.Element =>
   {
      return (
         <MDBox key={`${widgetMetaData.name}-${i}`} sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px", width: "100%", height: "100%"}}>
            {
               widgetMetaData.type === "parentWidget" && (
                  <ParentWidget
                     entityPrimaryKey={entityPrimaryKey}
                     widgetIndex={i}
                     label={widgetMetaData.label}
                     data={widgetData[i]}
                     reloadWidgetCallback={reloadWidget}
                  />
               )
            }
            {
               widgetMetaData.type === "table" && (
                  <TableCard
                     color="info"
                     title={widgetMetaData.label}
                     linkText={widgetData[i]?.linkText}
                     linkURL={widgetData[i]?.linkURL}
                     noRowsFoundHTML={widgetData[i]?.noRowsFoundHTML}
                     data={widgetData[i]}
                     dropdownOptions={widgetData[i]?.dropdownOptions}
                     reloadWidgetCallback={reloadWidget}
                     widgetIndex={i}
                  />
               )
            }
            {
               widgetMetaData.type === "process" && widgetData[i]?.processMetaData && (
                  <ProcessRun process={widgetData[i]?.processMetaData} defaultProcessValues={widgetData[i]?.defaultValues} isWidget={true} />
               )
            }
            {
               widgetMetaData.type === "stepper" && (
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
               )
            }
            {
               widgetMetaData.type === "html" && (
                  <Widget label={widgetMetaData.label}>
                     <Box px={1} pt={0} pb={2}>
                        <MDTypography component="div" variant="button" color="text" fontWeight="light">
                           {
                              widgetData && widgetData[i] && widgetData[i].html ? (
                                 parse(widgetData[i].html)
                              ) : <Skeleton />
                           }
                        </MDTypography>
                     </Box>
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "multiStatistics" && (
                  <MultiStatisticsCard
                     color="info"
                     title={widgetMetaData.label}
                     data={widgetData[i]}
                  />
               )
            }
            {
               widgetMetaData.type === "statistics" && (
                  widgetData && widgetData[i] && (
                     <SimpleStatisticsCard
                        title={widgetMetaData.label}
                        data={widgetData[i]}
                        increaseIsGood={true}
                        isCurrency={widgetData[i].isCurrency}
                     />
                  )
               )
            }
            {
               widgetMetaData.type === "quickSightChart" && (
                  <QuickSightChart url={widgetData[i]?.url} label={widgetMetaData.label} />
               )
            }
            {
               widgetMetaData.type === "barChart" && (
                  <BarChart
                     color="info"
                     title={widgetMetaData.label}
                     date={`As of ${new Date().toDateString()}`}
                     data={widgetData[i]?.chartData}
                  />
               )
            }
            {
               widgetMetaData.type === "horizontalBarChart" && (
                  widgetData && widgetData[i] && widgetData[i].chartData && (
                     <HorizontalBarChart
                        height={widgetData[i].height}
                        title={widgetMetaData.label}
                        data={widgetData[i]?.chartData}
                        isCurrency={widgetData[i].isCurrency}
                     />
                  )
               )
            }
            {
               widgetMetaData.type === "lineChart" && (
                  widgetData && widgetData[i] && widgetData[i].chartData && widgetData[i].chartData?.datasets ? (
                     <DefaultLineChart sx={{alignItems: "center"}}
                        title={widgetData[i].title}
                        description={(
                           <MDBox display="flex" justifyContent="space-between">
                              <MDBox display="flex" ml={-1}>
                                 {
                                    widgetData[i].chartData.datasets.map((dataSet: any) => (
                                       <MDBadgeDot key={dataSet.label} color={dataSet.color} size="sm" badgeContent={dataSet.label} />
                                    ))
                                 }
                              </MDBox>
                              <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem" />
                           </MDBox>
                        )}
                        data={widgetData[i].chartData as { labels: string[]; datasets: { label: string; color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark"; data: number[]; }[]; }}
                        isYAxisCurrency={widgetData[i].isYAxisCurrency}
                        isChild={areChildren}
                     />
                  ) : null
               )
            }
            {
               widgetMetaData.type === "childRecordList" && (
                  widgetData && widgetData[i] &&
                  <RecordGridWidget
                     title={widgetMetaData.label}
                     data={widgetData[i]}
                     reloadWidgetCallback={reloadWidget}
                  />
               )
            }
            {
               widgetMetaData.type === "fieldValueList" && (
                  widgetData && widgetData[i] &&
                     <FieldValueListWidget
                        title={widgetMetaData.label}
                        data={widgetData[i]}
                     />
               )
            }
         </MDBox>
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
                     <Grid id={widgetMetaData.name} key={`${widgetMetaData.name}-${i}`} item lg={widgetMetaData.gridColumns ? widgetMetaData.gridColumns : 12} xs={12} sx={{display: "flex", alignItems: "stretch", scrollMarginTop: "100px"}}>
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
