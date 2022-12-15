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
import DashboardWidgets from "qqq/components/DashboardWidgets";
import Widget from "qqq/pages/dashboards/Widgets/Widget";
import QClient from "qqq/utils/QClient";


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
   icon?: string;
}


////////////////////////////////////
// define properties and defaults //
////////////////////////////////////
interface Props
{
   widgetIndex: number;
   label: string;
   icon?: string;
   data: ParentWidgetData;
   reloadWidgetCallback?: (widgetIndex: number, params: string) => void;
   entityPrimaryKey?: string;
   tableName?: string;
}


const qController = QClient.getInstance();
function ParentWidget({widgetIndex, label, icon, data, reloadWidgetCallback, entityPrimaryKey, tableName}: Props, ): JSX.Element
{
   const [childUrlParams, setChildUrlParams] = useState("");
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
   }, [qInstance, data]);

   const parentReloadWidgetCallback = (data: string) =>
   {
      setChildUrlParams(data);

      reloadWidgetCallback(widgetIndex, data);
   }

   // @ts-ignore
   return (
      <Widget
         icon={icon}
         label={label}
         widgetData={data}
         reloadWidgetCallback={parentReloadWidgetCallback}
      >
         <Box px={3} sx={{width: "100%"}}>
            <DashboardWidgets widgetMetaDataList={widgets} entityPrimaryKey={entityPrimaryKey} tableName={tableName} childUrlParams={childUrlParams} areChildren={true}/>
         </Box>
      </Widget>
   );
}

export default ParentWidget;
