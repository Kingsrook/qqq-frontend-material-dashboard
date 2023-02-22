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

import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import parse from "html-react-parser";
import React, {useContext, useEffect, useReducer, useState} from "react";
import {useLocation} from "react-router-dom";
import QContext from "QContext";
import MDTypography from "qqq/components/legacy/MDTypography";
import BarChart from "qqq/components/widgets/charts/barchart/BarChart";
import HorizontalBarChart from "qqq/components/widgets/charts/barchart/HorizontalBarChart";
import DefaultLineChart from "qqq/components/widgets/charts/linechart/DefaultLineChart";
import SmallLineChart from "qqq/components/widgets/charts/linechart/SmallLineChart";
import PieChart from "qqq/components/widgets/charts/piechart/PieChart";
import StackedBarChart from "qqq/components/widgets/charts/StackedBarChart";
import DataBagViewer from "qqq/components/widgets/misc/DataBagViewer";
import DividerWidget from "qqq/components/widgets/misc/Divider";
import FieldValueListWidget from "qqq/components/widgets/misc/FieldValueListWidget";
import QuickSightChart from "qqq/components/widgets/misc/QuickSightChart";
import RecordGridWidget from "qqq/components/widgets/misc/RecordGridWidget";
import StepperCard from "qqq/components/widgets/misc/StepperCard";
import USMapWidget from "qqq/components/widgets/misc/USMapWidget";
import ParentWidget from "qqq/components/widgets/ParentWidget";
import MultiStatisticsCard from "qqq/components/widgets/statistics/MultiStatisticsCard";
import StatisticsCard from "qqq/components/widgets/statistics/StatisticsCard";
import TableCard from "qqq/components/widgets/tables/TableCard";
import Widget, {WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT} from "qqq/components/widgets/Widget";
import ProcessRun from "qqq/pages/processes/ProcessRun";
import Client from "qqq/utils/qqq/Client";


const qController = Client.getInstance();

interface Props
{
   widgetMetaDataList: QWidgetMetaData[];
   tableName?: string;
   entityPrimaryKey?: string;
   omitWrappingGridContainer: boolean;
   areChildren?: boolean
   childUrlParams?: string
   parentWidgetMetaData?: QWidgetMetaData
}

DashboardWidgets.defaultProps = {
   widgetMetaDataList: null,
   tableName: null,
   entityPrimaryKey: null,
   omitWrappingGridContainer: false,
   areChildren: false,
   childUrlParams: "",
   parentWidgetMetaData: null
};

function DashboardWidgets({widgetMetaDataList, tableName, entityPrimaryKey, omitWrappingGridContainer, areChildren, childUrlParams, parentWidgetMetaData}: Props): JSX.Element
{
   const location = useLocation();
   const [widgetData, setWidgetData] = useState([] as any[]);
   const [widgetCounter, setWidgetCounter] = useState(0);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [currentUrlParams, setCurrentUrlParams] = useState(null as string);
   const [haveLoadedParams, setHaveLoadedParams] = useState(false);
   const {accentColor} = useContext(QContext);

   useEffect(() =>
   {
      for (let i = 0; i < widgetMetaDataList.length; i++)
      {
         const widgetMetaData = widgetMetaDataList[i];
         const urlParams = getQueryParams(widgetMetaData, null);
         setCurrentUrlParams(urlParams);
         setHaveLoadedParams(true);

         widgetData[i] = {};
         (async () =>
         {
            widgetData[i] = await qController.widget(widgetMetaData.name, urlParams);
            setWidgetCounter(widgetCounter + 1);
            forceUpdate();
         })();
      }
      setWidgetData(widgetData);
   }, [widgetMetaDataList]);

   const reloadWidget = async (index: number, data: string) =>
   {
      widgetData[index] = await qController.widget(widgetMetaDataList[index].name, getQueryParams(null, data));
      forceUpdate();
   };

   function getQueryParams(widgetMetaData: QWidgetMetaData, extraParams: string): string
   {
      let ampersand = "";
      let params = "";
      if(entityPrimaryKey)
      {
         params += `${ampersand}id=${entityPrimaryKey}`;
         ampersand = "&";
      }
      if(tableName)
      {
         params += `${ampersand}tableName=${tableName}`;
         ampersand = "&";
      }
      if(extraParams)
      {
         params += `${ampersand}${extraParams}`;
         ampersand = "&";
      }
      if(childUrlParams)
      {
         params += `${ampersand}${childUrlParams}`;
         ampersand = "&";
      }

      /////////////////////////////////////////////////////////////////////////////
      // see if local storage is used for any widget dropdowns, if so, look them //
      // up and append to the query string                                       //
      /////////////////////////////////////////////////////////////////////////////
      let thisWidgetHasDropdowns = widgetMetaData && widgetMetaData.storeDropdownSelections && widgetMetaData.dropdowns;
      let parentWidgetHasDropdowns = parentWidgetMetaData && parentWidgetMetaData.storeDropdownSelections && parentWidgetMetaData.dropdowns;
      if(thisWidgetHasDropdowns || parentWidgetHasDropdowns)
      {
         const metaDataToUse = (thisWidgetHasDropdowns) ? widgetMetaData : parentWidgetMetaData;
         for(let i = 0; i< metaDataToUse.dropdowns.length; i++)
         {
            const dropdownName = metaDataToUse.dropdowns[i].possibleValueSourceName;
            const localStorageKey = `${WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT}.${metaDataToUse.name}.${dropdownName}`;
            const json = JSON.parse(localStorage.getItem(localStorageKey));
            if(json)
            {
               params += `${ampersand}${dropdownName}=${json.id}`;
               ampersand = "&";
            }
         }
      }

      return params;
   }

   const widgetCount = widgetMetaDataList ? widgetMetaDataList.length : 0;

   const renderWidget = (widgetMetaData: QWidgetMetaData, i: number): JSX.Element =>
   {
      return (
         <Box key={`${widgetMetaData.name}-${i}`} sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px", width: "100%", height: "100%"}}>
            {
               haveLoadedParams && widgetMetaData.type === "parentWidget" && (
                  <ParentWidget
                     urlParams={currentUrlParams}
                     entityPrimaryKey={entityPrimaryKey}
                     tableName={tableName}
                     widgetIndex={i}
                     widgetMetaData={widgetMetaData}
                     data={widgetData[i]}
                     reloadWidgetCallback={() => 
                     {}}
                     storeDropdownSelections={widgetMetaData.storeDropdownSelections}
                  />
               )
            }
            {
               widgetMetaData.type === "usaMap" && (
                  <USMapWidget
                     widgetIndex={i}
                     label={widgetMetaData.label}
                     data={widgetData[i]}
                     reloadWidgetCallback={reloadWidget}
                  />
               )
            }
            {
               widgetMetaData.type === "table" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                  >
                     <TableCard
                        noRowsFoundHTML={widgetData[i]?.noRowsFoundHTML}
                        rowsPerPage={widgetData[i]?.rowsPerPage}
                        hidePaginationDropdown={widgetData[i]?.hidePaginationDropdown}
                        data={widgetData[i]}
                     />
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "stackedBarChart" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                  >
                     <StackedBarChart data={widgetData[i]?.chartData}/>
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "process" && widgetData[i]?.processMetaData && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}>
                     <div className="widgetProcessMidDiv" style={{height: "100%"}}>
                        <ProcessRun process={widgetData[i]?.processMetaData} defaultProcessValues={widgetData[i]?.defaultValues} isWidget={true} forceReInit={widgetCounter} />
                     </div>
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "stepper" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}>
                     <Box sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>
                        <Box padding="1rem" sx={{width: "100%"}}>
                           <StepperCard data={widgetData[i]} />
                        </Box>
                     </Box>
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "html" && (
                  <Widget widgetMetaData={widgetMetaData}>
                     <Box px={3} pt={0} pb={2}>
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
               widgetMetaData.type === "smallLineChart" && (
                  <SmallLineChart
                     color="dark"
                     title={widgetMetaData.label}
                     description={widgetData[i]?.description}
                     date=""
                     chart={widgetData[i]?.chartData}
                  />
               )
            }
            {
               widgetMetaData.type === "statistics" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     isChild={areChildren}

                     // reloadWidgetCallback={(data) => reloadWidget(i, data)}
                  >
                     <StatisticsCard
                        data={widgetData[i]}
                        increaseIsGood={true}
                     />
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
               widgetMetaData.type === "quickSightChart" && (
                  <QuickSightChart url={widgetData[i]?.url} label={widgetMetaData.label} />
               )
            }
            {
               widgetMetaData.type === "barChart" && (
                  <BarChart
                     color={accentColor}
                     title={widgetData[i]?.title}
                     date={`As of ${new Date().toDateString()}`}
                     description={widgetData[i]?.description}
                     data={widgetData[i]?.chartData}
                  />
               )
            }
            {
               widgetMetaData.type === "pieChart" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     isChild={areChildren}
                  >
                     <div>
                        <PieChart
                           chartData={widgetData[i]?.chartData}
                           description={widgetData[i]?.description}
                        />
                     </div>
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "divider" && (
                  <Box>
                     <DividerWidget />
                  </Box>
               )
            }
            {
               widgetMetaData.type === "horizontalBarChart" && (
                  <HorizontalBarChart
                     height={widgetData[i]?.height}
                     title={widgetMetaData.label}
                     data={widgetData[i]?.chartData}
                     isCurrency={widgetData[i]?.isCurrency}
                  />
               )
            }
            {
               widgetMetaData.type === "lineChart" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     isChild={areChildren}>
                     <DefaultLineChart sx={{alignItems: "center"}}
                        data={widgetData[i]?.chartData}
                        isYAxisCurrency={widgetData[i]?.isYAxisCurrency}
                     />
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "childRecordList" && (
                  widgetData && widgetData[i] &&
                  <RecordGridWidget
                     widgetMetaData={widgetMetaData}
                     data={widgetData[i]}
                  />
               )

            }
            {
               widgetMetaData.type === "fieldValueList" && (
                  widgetData && widgetData[i] &&
                     <FieldValueListWidget
                        widgetMetaData={widgetMetaData}
                        data={widgetData[i]}
                        reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     />
               )
            }
            {
               widgetMetaData.type === "dataBagViewer" && (
                  widgetData && widgetData[i] && widgetData[i].queryParams &&
                  <Widget widgetMetaData={widgetMetaData}>
                     <DataBagViewer dataBagId={widgetData[i].queryParams.id} />
                  </Widget>
               )
            }
         </Box>
      );
   }

   const body: JSX.Element =
      (
         <>
            {
               widgetMetaDataList.map((widgetMetaData, i) => (
                  omitWrappingGridContainer
                     ? widgetMetaData && renderWidget(widgetMetaData, i)
                     :
                     widgetMetaData && <Grid id={widgetMetaData.name} key={`${widgetMetaData.name}-${i}`} item lg={widgetMetaData.gridColumns ? widgetMetaData.gridColumns : 12} xs={12} sx={{display: "flex", alignItems: "stretch", scrollMarginTop: "100px"}}>
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
