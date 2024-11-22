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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Alert, Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import parse from "html-react-parser";
import QContext from "QContext";
import EntityForm from "qqq/components/forms/EntityForm";
import MDTypography from "qqq/components/legacy/MDTypography";
import TabPanel from "qqq/components/misc/TabPanel";
import BarChart from "qqq/components/widgets/charts/barchart/BarChart";
import HorizontalBarChart from "qqq/components/widgets/charts/barchart/HorizontalBarChart";
import DefaultLineChart from "qqq/components/widgets/charts/linechart/DefaultLineChart";
import SmallLineChart from "qqq/components/widgets/charts/linechart/SmallLineChart";
import PieChart from "qqq/components/widgets/charts/piechart/PieChart";
import StackedBarChart from "qqq/components/widgets/charts/StackedBarChart";
import CompositeWidget from "qqq/components/widgets/CompositeWidget";
import DataBagViewer from "qqq/components/widgets/misc/DataBagViewer";
import DividerWidget from "qqq/components/widgets/misc/Divider";
import DynamicFormWidget from "qqq/components/widgets/misc/DynamicFormWidget";
import FieldValueListWidget from "qqq/components/widgets/misc/FieldValueListWidget";
import FilterAndColumnsSetupWidget from "qqq/components/widgets/misc/FilterAndColumnsSetupWidget";
import PivotTableSetupWidget from "qqq/components/widgets/misc/PivotTableSetupWidget";
import QuickSightChart from "qqq/components/widgets/misc/QuickSightChart";
import RecordGridWidget, {ChildRecordListData} from "qqq/components/widgets/misc/RecordGridWidget";
import ScriptViewer from "qqq/components/widgets/misc/ScriptViewer";
import StepperCard from "qqq/components/widgets/misc/StepperCard";
import USMapWidget from "qqq/components/widgets/misc/USMapWidget";
import ParentWidget from "qqq/components/widgets/ParentWidget";
import MultiStatisticsCard from "qqq/components/widgets/statistics/MultiStatisticsCard";
import StatisticsCard from "qqq/components/widgets/statistics/StatisticsCard";
import Widget, {HeaderIcon, LabelComponent, WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT, WidgetData} from "qqq/components/widgets/Widget";
import WidgetBlock from "qqq/components/widgets/WidgetBlock";
import ProcessRun from "qqq/pages/processes/ProcessRun";
import Client from "qqq/utils/qqq/Client";
import React, {useContext, useEffect, useReducer, useState} from "react";
import TableWidget from "./tables/TableWidget";


const qController = Client.getInstance();

interface Props
{
   widgetMetaDataList: QWidgetMetaData[];
   tableName?: string;
   entityPrimaryKey?: string;
   record?: QRecord;
   omitWrappingGridContainer: boolean;
   areChildren?: boolean;
   childUrlParams?: string;
   parentWidgetMetaData?: QWidgetMetaData;
   wrapWidgetsInTabPanels: boolean;
   actionCallback?: (data: any, eventValues?: { [name: string]: any }) => boolean;
   initialWidgetDataList: any[];
   values?: { [key: string]: any };
}

DashboardWidgets.defaultProps = {
   widgetMetaDataList: null,
   tableName: null,
   entityPrimaryKey: null,
   omitWrappingGridContainer: false,
   areChildren: false,
   childUrlParams: "",
   parentWidgetMetaData: null,
   wrapWidgetsInTabPanels: false,
   actionCallback: null,
   initialWidgetDataList: null,
   values: {}
};

function DashboardWidgets({widgetMetaDataList, tableName, entityPrimaryKey, record, omitWrappingGridContainer, areChildren, childUrlParams, parentWidgetMetaData, wrapWidgetsInTabPanels, actionCallback, initialWidgetDataList, values}: Props): JSX.Element
{
   const [widgetData, setWidgetData] = useState(initialWidgetDataList == null ? [] as any[] : initialWidgetDataList);
   const [widgetCounter, setWidgetCounter] = useState(0);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [currentUrlParams, setCurrentUrlParams] = useState(null as string);
   const [haveLoadedParams, setHaveLoadedParams] = useState(false);
   const {accentColor} = useContext(QContext);

   /////////////////////////
   // modal form controls //
   /////////////////////////
   const [showEditChildForm, setShowEditChildForm] = useState(null as any);

   let initialSelectedTab = 0;
   let selectedTabKey: string = null;
   if (parentWidgetMetaData && wrapWidgetsInTabPanels)
   {
      selectedTabKey = `qqq.widgets.selectedTabs.${parentWidgetMetaData.name}`;
      if (localStorage.getItem(selectedTabKey))
      {
         initialSelectedTab = Number(localStorage.getItem(selectedTabKey));
      }
   }
   const [selectedTab, setSelectedTab] = useState(initialSelectedTab);

   const changeTab = (newValue: number) =>
   {
      setSelectedTab(newValue);
      localStorage.setItem(selectedTabKey, String(newValue));
   };

   useEffect(() =>
   {
      if (initialWidgetDataList && initialWidgetDataList.length > 0)
      {
         // todo actually, should this check each element of the array, down in the loop?  yeah, when we need to, do it that way.
         console.log("We already have initial widget data, so not fetching from backend.");
         return;
      }

      setWidgetData([]);

      for (let i = 0; i < widgetMetaDataList.length; i++)
      {
         const widgetMetaData = widgetMetaDataList[i];
         const urlParams = getQueryParams(widgetMetaData, null);
         setCurrentUrlParams(urlParams);
         setHaveLoadedParams(true);

         widgetData[i] = {};
         (async () =>
         {
            try
            {
               widgetData[i] = await qController.widget(widgetMetaData.name, urlParams);
               setWidgetData(widgetData);
               setWidgetCounter(widgetCounter + 1);
               if (widgetData[i])
               {
                  widgetData[i]["errorLoading"] = false;
               }
            }
            catch (e)
            {
               console.error(e);
               if (widgetData[i])
               {
                  widgetData[i]["errorLoading"] = true;
               }
            }

            forceUpdate();
         })();
      }
   }, [widgetMetaDataList]);

   const reloadWidget = async (index: number, data: string) =>
   {
      await (async () =>
      {
         const urlParams = getQueryParams(widgetMetaDataList[index], data);
         setCurrentUrlParams(urlParams);
         widgetData[index] = {};

         try
         {
            widgetData[index] = await qController.widget(widgetMetaDataList[index].name, urlParams);
            setWidgetCounter(widgetCounter + 1);
            setWidgetData(widgetData);

            if (widgetData[index])
            {
               widgetData[index]["errorLoading"] = false;
            }
         }
         catch (e)
         {
            console.error(e);
            if (widgetData[index])
            {
               widgetData[index]["errorLoading"] = true;
            }
         }

         forceUpdate();
      })();
   };

   function getQueryParams(widgetMetaData: QWidgetMetaData, extraParams: string): string
   {
      let paramMap = new Map<string, string>();

      /////////////////////////////////////////////////////////////////////////////
      // see if local storage is used for any widget dropdowns, if so, look them //
      // up and append to the query string                                       //
      /////////////////////////////////////////////////////////////////////////////
      let thisWidgetHasDropdowns = widgetMetaData && widgetMetaData.storeDropdownSelections && widgetMetaData.dropdowns;
      let parentWidgetHasDropdowns = parentWidgetMetaData && parentWidgetMetaData.storeDropdownSelections && parentWidgetMetaData.dropdowns;
      if (thisWidgetHasDropdowns || parentWidgetHasDropdowns)
      {
         const metaDataToUse = (thisWidgetHasDropdowns) ? widgetMetaData : parentWidgetMetaData;
         for (let i = 0; i < metaDataToUse.dropdowns.length; i++)
         {
            const dropdownName = metaDataToUse.dropdowns[i].possibleValueSourceName ?? metaDataToUse.dropdowns[i].name;
            const localStorageKey = `${WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT}.${metaDataToUse.name}.${dropdownName}`;
            const json = JSON.parse(localStorage.getItem(localStorageKey));
            if (json)
            {
               paramMap.set(dropdownName, json.id);
            }
         }
      }

      if (entityPrimaryKey)
      {
         paramMap.set("id", entityPrimaryKey);
      }

      if (tableName)
      {
         paramMap.set("tableName", tableName);
      }

      if (extraParams)
      {
         let pairs = extraParams.split("&");
         for (let i = 0; i < pairs.length; i++)
         {
            let nameValue = pairs[i].split("=");
            if (nameValue.length == 2)
            {
               paramMap.set(nameValue[0], nameValue[1]);
            }
         }
      }

      if (childUrlParams)
      {
         let pairs = childUrlParams.split("&");
         for (let i = 0; i < pairs.length; i++)
         {
            let nameValue = pairs[i].split("=");
            if (nameValue.length == 2)
            {
               paramMap.set(nameValue[0], nameValue[1]);
            }
         }
      }

      let paramsFromMap = "";
      for (let key of paramMap.keys())
      {
         paramsFromMap += `${key}=${paramMap.get(key)}&`;
      }

      return paramsFromMap;
   }

   const widgetCount = widgetMetaDataList ? widgetMetaDataList.length : 0;


   /*******************************************************************************
    ** helper function, to convert values from a QRecord values map to a regular old
    ** js object
    *******************************************************************************/
   function convertQRecordValuesFromMapToObject(record: QRecord): { [name: string]: any }
   {
      const rs: { [name: string]: any } = {};

      if (record && record.values)
      {
         record.values.forEach((value, key) => rs[key] = value);
      }

      return (rs);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   const closeEditChildForm = (event: object, reason: string) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      setShowEditChildForm(null);
   };


   /*******************************************************************************
    **
    *******************************************************************************/
   function deleteChildRecord(name: string, widgetIndex: number, rowIndex: number)
   {
      updateChildRecordList(name, "delete", rowIndex);
      actionCallback(widgetData[widgetIndex]);
   };


   /*******************************************************************************
    **
    *******************************************************************************/
   function openEditChildRecord(name: string, widgetData: any, rowIndex: number)
   {
      let defaultValues = widgetData.queryOutput.records[rowIndex].values;

      let disabledFields = widgetData.disabledFieldsForNewChildRecords;
      if (!disabledFields)
      {
         disabledFields = widgetData.defaultValuesForNewChildRecords;
      }

      doOpenEditChildForm(name, widgetData.childTableMetaData, rowIndex, defaultValues, disabledFields);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function openAddChildRecord(name: string, widgetData: any)
   {
      let defaultValues = widgetData.defaultValuesForNewChildRecords;

      let disabledFields = widgetData.disabledFieldsForNewChildRecords;
      if (!disabledFields)
      {
         disabledFields = widgetData.defaultValuesForNewChildRecords;
      }

      doOpenEditChildForm(name, widgetData.childTableMetaData, null, defaultValues, disabledFields);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function doOpenEditChildForm(widgetName: string, table: QTableMetaData, rowIndex: number, defaultValues: any, disabledFields: any)
   {
      const showEditChildForm: any = {};
      showEditChildForm.widgetName = widgetName;
      showEditChildForm.table = table;
      showEditChildForm.rowIndex = rowIndex;
      showEditChildForm.defaultValues = defaultValues;
      showEditChildForm.disabledFields = disabledFields;
      setShowEditChildForm(showEditChildForm);
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   function submitEditChildForm(values: any)
   {
      updateChildRecordList(showEditChildForm.widgetName, showEditChildForm.rowIndex == null ? "insert" : "edit", showEditChildForm.rowIndex, values);
      let widgetIndex = determineChildRecordListIndex(showEditChildForm.widgetName);
      actionCallback(widgetData[widgetIndex]);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function determineChildRecordListIndex(widgetName: string): number
   {
      let widgetIndex = -1;
      for (var i = 0; i < widgetMetaDataList.length; i++)
      {
         const widgetMetaData = widgetMetaDataList[i];
         if (widgetMetaData.name == widgetName)
         {
            widgetIndex = i;
            break;
         }
      }
      return (widgetIndex);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function updateChildRecordList(widgetName: string, action: "insert" | "edit" | "delete", rowIndex?: number, values?: any)
   {
      ////////////////////////////////////////////////
      // find the correct child record widget index //
      ////////////////////////////////////////////////
      let widgetIndex = determineChildRecordListIndex(widgetName);

      if (!widgetData[widgetIndex].queryOutput.records)
      {
         widgetData[widgetIndex].queryOutput.records = [];
      }

      const newChildListWidgetData: ChildRecordListData = widgetData[widgetIndex];
      if (!newChildListWidgetData.queryOutput.records)
      {
         newChildListWidgetData.queryOutput.records = [];
      }

      switch (action)
      {
         case "insert":
            newChildListWidgetData.queryOutput.records.push({values: values});
            break;
         case "edit":
            newChildListWidgetData.queryOutput.records[rowIndex] = {values: values};
            break;
         case "delete":
            newChildListWidgetData.queryOutput.records.splice(rowIndex, 1);
            break;
      }
      newChildListWidgetData.totalRows = newChildListWidgetData.queryOutput.records.length;
      widgetData[widgetIndex] = newChildListWidgetData;
      setWidgetData(widgetData);

      setShowEditChildForm(null);
   }


   const renderWidget = (widgetMetaData: QWidgetMetaData, i: number): JSX.Element =>
   {
      const labelAdditionalComponentsRight: LabelComponent[] = [];
      if (widgetMetaData && widgetMetaData.icons)
      {
         const topRightInsideCardIcon = widgetMetaData.icons.get("topRightInsideCard");
         if (topRightInsideCardIcon)
         {
            labelAdditionalComponentsRight.push(new HeaderIcon(topRightInsideCardIcon.name, topRightInsideCardIcon.path, topRightInsideCardIcon.color, "topRightInsideCard"));
         }
      }

      const labelAdditionalComponentsLeft: LabelComponent[] = [];
      if (widgetMetaData && widgetMetaData.icons)
      {
         const topLeftInsideCardIcon = widgetMetaData.icons.get("topLeftInsideCard");
         if (topLeftInsideCardIcon)
         {
            labelAdditionalComponentsLeft.push(new HeaderIcon(topLeftInsideCardIcon.name, topLeftInsideCardIcon.path, topLeftInsideCardIcon.color, "topLeftInsideCard"));
         }
      }

      return (
         <Box key={`${widgetMetaData.name}-${i}`} sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px", width: "100%", height: "100%", flexDirection: widgetMetaData.type == "multiTable" ? "column" : "row"}}>
            {
               haveLoadedParams && widgetMetaData.type === "parentWidget" && (
                  <ParentWidget
                     urlParams={currentUrlParams}
                     entityPrimaryKey={entityPrimaryKey}
                     tableName={tableName}
                     widgetIndex={i}
                     widgetMetaData={widgetMetaData}
                     data={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     storeDropdownSelections={widgetMetaData.storeDropdownSelections}
                  />
               )
            }
            {
               widgetMetaData.type === "alert" && widgetData[i]?.html && !widgetData[i]?.hideWidget && (
                  <Widget
                     omitPadding={true}
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
                     <Alert severity={widgetData[i]?.alertType?.toLowerCase()}>
                        {parse(widgetData[i]?.html)}
                        {widgetData[i]?.bulletList && (
                           <div style={{fontSize: "14px"}}>
                              {widgetData[i].bulletList.map((bullet: string, index: number) =>
                                 <li key={`widget-${i}-${index}`}>{parse(bullet)}</li>
                              )}
                           </div>
                        )}
                     </Alert>
                  </Widget>
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
                  <TableWidget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                  />
               )
            }
            {
               widgetMetaData.type === "multiTable" && (
                  widgetData[i]?.tableDataList?.map((tableData: WidgetData, index: number) =>
                     <Box pb={3} key={`${widgetMetaData.type}-${index}`}>
                        <TableWidget
                           widgetMetaData={widgetMetaData}
                           widgetData={tableData}
                           reloadWidgetCallback={(data) => reloadWidget(i, data)}
                           isChild={areChildren}
                        />
                     </Box>
                  )
               )
            }
            {
               widgetMetaData.type === "stackedBarChart" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
                     <StackedBarChart data={widgetData[i]?.chartData} chartSubheaderData={widgetData[i]?.chartSubheaderData} />
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "process" && widgetData[i]?.processMetaData && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     showReloadControl={false}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
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
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
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
                  <Widget
                     widgetMetaData={widgetMetaData}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     widgetData={widgetData[i]}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
                     <Box>
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
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
                     <StatisticsCard
                        widgetMetaData={widgetMetaData}
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
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
                     <div>
                        <PieChart
                           chartData={widgetData[i]?.chartData}
                           chartSubheaderData={widgetData[i]?.chartSubheaderData}
                           description={widgetData[i]?.description}
                        />
                     </div>
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "divider" && (
                  <DividerWidget />
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
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
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
                     disableRowClick={widgetData[i]?.disableRowClick}
                     allowRecordEdit={widgetData[i]?.allowRecordEdit}
                     allowRecordDelete={widgetData[i]?.allowRecordDelete}
                     deleteRecordCallback={(rowIndex) => deleteChildRecord(widgetMetaData.name, i, rowIndex)}
                     editRecordCallback={(rowIndex) => openEditChildRecord(widgetMetaData.name, widgetData[i], rowIndex)}
                     addNewRecordCallback={widgetData[i]?.isInProcess ? () => openAddChildRecord(widgetMetaData.name, widgetData[i]) : null}
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
               widgetMetaData.type === "composite" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
                     <CompositeWidget widgetMetaData={widgetMetaData} data={widgetData[i]} actionCallback={actionCallback} values={values} />
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "block" && (
                  <Widget
                     widgetMetaData={widgetMetaData}
                     widgetData={widgetData[i]}
                     reloadWidgetCallback={(data) => reloadWidget(i, data)}
                     isChild={areChildren}
                     labelAdditionalComponentsRight={labelAdditionalComponentsRight}
                     labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
                  >
                     <WidgetBlock widgetMetaData={widgetMetaData} block={widgetData[i]} />
                  </Widget>
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
            {
               widgetMetaData.type === "scriptViewer" && (
                  widgetData && widgetData[i] && widgetData[i].queryParams &&
                  <Widget widgetMetaData={widgetMetaData}>
                     <ScriptViewer scriptId={widgetData[i].queryParams.id} />
                  </Widget>
               )
            }
            {
               widgetMetaData.type === "filterAndColumnsSetup" && (
                  widgetData && widgetData[i] &&
                  <FilterAndColumnsSetupWidget isEditable={false} widgetMetaData={widgetMetaData} widgetData={widgetData[i]} recordValues={convertQRecordValuesFromMapToObject(record)} onSaveCallback={() =>
                  {
                  }} />
               )
            }
            {
               widgetMetaData.type === "pivotTableSetup" && (
                  widgetData && widgetData[i] && widgetData[i].queryParams &&
                  <PivotTableSetupWidget isEditable={false} widgetMetaData={widgetMetaData} recordValues={convertQRecordValuesFromMapToObject(record)} onSaveCallback={() =>
                  {
                  }} />
               )
            }
            {
               widgetMetaData.type === "dynamicForm" && (
                  widgetData && widgetData[i] &&
                  <DynamicFormWidget isEditable={false} widgetMetaData={widgetMetaData} widgetData={widgetData[i]} record={record} recordValues={convertQRecordValuesFromMapToObject(record)} />
               )
            }
         </Box>
      );
   };

   if (wrapWidgetsInTabPanels)
   {
      omitWrappingGridContainer = true;
   }

   const body: JSX.Element =
      (
         <>
            {
               widgetMetaDataList.map((widgetMetaData, i) =>
               {
                  let renderedWidget = widgetMetaData ? renderWidget(widgetMetaData, i) : (<></>);

                  if (!omitWrappingGridContainer)
                  {
                     const gridProps: { [key: string]: any } = {};

                     for (let size of ["xs", "sm", "md", "lg", "xl", "xxl"])
                     {
                        const key = `gridCols:sizeClass:${size}`;
                        if (widgetMetaData?.defaultValues?.has(key))
                        {
                           gridProps[size] = widgetMetaData?.defaultValues.get(key);
                        }
                     }

                     if (!gridProps["xxl"])
                     {
                        gridProps["xxl"] = widgetMetaData.gridColumns ? widgetMetaData.gridColumns : 12;
                     }

                     if (!gridProps["xs"])
                     {
                        gridProps["xs"] = 12;
                     }

                     renderedWidget = (<Grid id={widgetMetaData.name} item {...gridProps} sx={{display: "flex", alignItems: "stretch", scrollMarginTop: "100px"}}>
                        {renderedWidget}
                     </Grid>);
                  }

                  if (wrapWidgetsInTabPanels)
                  {
                     renderedWidget = (<TabPanel index={i} value={selectedTab} style={{
                        padding: 0,
                        margin: "-1rem",
                        width: "calc(100% + 2rem)"
                     }}>
                        {renderedWidget}
                     </TabPanel>);
                  }

                  return (<React.Fragment key={`${widgetMetaData.name}-${i}`}>{renderedWidget}</React.Fragment>);
               })
            }
         </>
      );

   const tabs = widgetMetaDataList && wrapWidgetsInTabPanels ?
      <Tabs
         sx={{
            m: 0, mb: 1.5, ml: -2, mr: -2, mt: -3,
            "& .MuiTabs-scroller": {
               ml: 0
            }
         }}
         value={selectedTab}
         onChange={(event, newValue) => changeTab(newValue)}
         variant="standard"
      >
         {widgetMetaDataList.map((widgetMetaData, i) => (
            <Tab key={widgetMetaData.name} label={widgetMetaData.label} />
         ))}
      </Tabs>
      : <></>;

   return (
      widgetCount > 0 ? (
         <>
            {tabs}
            {
               omitWrappingGridContainer ? body : (
                  <Grid container spacing={2.5}>
                     {body}
                  </Grid>
               )
            }
            {
               showEditChildForm &&
               <Modal open={showEditChildForm as boolean} onClose={(event, reason) => closeEditChildForm(event, reason)}>
                  <div className="modalEditForm">
                     <EntityForm
                        isModal={true}
                        closeModalHandler={closeEditChildForm}
                        table={showEditChildForm.table}
                        defaultValues={showEditChildForm.defaultValues}
                        disabledFields={showEditChildForm.disabledFields}
                        onSubmitCallback={submitEditChildForm}
                        overrideHeading={`${showEditChildForm.rowIndex != null ? "Editing" : "Creating New"} ${showEditChildForm.table.label}`}
                     />
                  </div>
               </Modal>
            }
         </>
      ) : null
   );
}

export default DashboardWidgets;
