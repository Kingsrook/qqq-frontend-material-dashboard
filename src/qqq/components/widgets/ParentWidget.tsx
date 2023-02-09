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
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {Box} from "@mui/material";
import React, {useEffect, useState} from "react";
import DashboardWidgets from "qqq/components/widgets/DashboardWidgets";
import Widget from "qqq/components/widgets/Widget";
import Client from "qqq/utils/qqq/Client";


//////////////////////////////////////////////
// structure of expected parent widget data //
//////////////////////////////////////////////
export interface ParentWidgetData
{
   dropdownLabelList: string[];
   dropdownNameList: string[];
   dropdownDataList: {
      id: string,
      label: string
   }[][];
   childWidgetNameList: string[];
   dropdownNeedsSelectedText?: string;
   storeDropdownSelections?: boolean;
   icon?: string;
}


////////////////////////////////////
// define properties and defaults //
////////////////////////////////////
interface Props
{
   urlParams?: string;
   widgetMetaData?: QWidgetMetaData;
   widgetIndex: number;
   data: ParentWidgetData;
   reloadWidgetCallback?: (widgetIndex: number, params: string) => void;
   entityPrimaryKey?: string;
   tableName?: string;
   storeDropdownSelections?: boolean;
}


const qController = Client.getInstance();
function ParentWidget({urlParams, widgetMetaData, widgetIndex, data, reloadWidgetCallback, entityPrimaryKey, tableName, storeDropdownSelections}: Props, ): JSX.Element
{
   const [childUrlParams, setChildUrlParams] = useState((urlParams) ? urlParams : "");
   const [qInstance, setQInstance] = useState(null as QInstance);
   const [widgets, setWidgets] = useState([] as any[]);

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
      if(qInstance && data && data.childWidgetNameList)
      {
         let widgetMetaDataList = [] as QWidgetMetaData[];
         data?.childWidgetNameList.forEach((widgetName: string) =>
         {
            widgetMetaDataList.push(qInstance.widgets.get(widgetName));
         })
         setWidgets(widgetMetaDataList);
      }
   }, [qInstance, data, childUrlParams]);

   const parentReloadWidgetCallback = (data: string) =>
   {
      setChildUrlParams(data);
      reloadWidgetCallback(widgetIndex, data);
   }

   // @ts-ignore
   return (
      qInstance && data ? (
         <Widget
            widgetMetaData={widgetMetaData}
            widgetData={data}
            storeDropdownSelections={storeDropdownSelections}
            reloadWidgetCallback={parentReloadWidgetCallback}
         >
            <Box sx={{height: "100%", width: "100%"}}>
               <DashboardWidgets widgetMetaDataList={widgets} entityPrimaryKey={entityPrimaryKey} tableName={tableName} childUrlParams={childUrlParams} areChildren={true} parentWidgetMetaData={widgetMetaData}/>
            </Box>
         </Widget>
      ) : null
   );
}

export default ParentWidget;
