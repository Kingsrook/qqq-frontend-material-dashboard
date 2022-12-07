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
import {Box, Typography} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import React, {useEffect, useState} from "react";
import DashboardWidgets from "qqq/components/DashboardWidgets";
import DropdownMenu from "qqq/pages/dashboards/Widgets/Components/DropdownMenu";
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
}


////////////////////////////////////
// define properties and defaults //
////////////////////////////////////
interface Props
{
   widgetIndex: number;
   label: string;
   data: ParentWidgetData;
   reloadWidgetCallback?: (widgetIndex: number, params: string) => void;
   entityPrimaryKey?: string;
}


const qController = QClient.getInstance();
function ParentWidget({widgetIndex, label, data, reloadWidgetCallback, entityPrimaryKey}: Props, ): JSX.Element
{
   const [childUrlParams, setChildUrlParams] = useState("");
   const [qInstance, setQInstance] = useState(null as QInstance);
   const [dropdownData, setDropdownData] = useState([]);
   const [widgets, setWidgets] = useState([] as any[]);
   const [counter, setCounter] = useState(0);

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
         console.log(`SETTINGWIDGETS...${widgetMetaDataList.length}`)
      }
   }, [qInstance, data]);

   function doit()
   {
      reloadWidgetCallback(0, "ok");
   }

   function handleDataChange(dropdownLabel: string, changedData: any)
   {
      if(dropdownData)
      {
         ///////////////////////////////////////////
         // find the index base on selected label //
         ///////////////////////////////////////////
         const tableName = dropdownLabel.replace("Select ", "");
         let index = -1;
         for (let i = 0; i < data.dropdownLabelList.length; i++)
         {
            if (tableName === data.dropdownLabelList[i])
            {
               index = i;
               break;
            }
         }

         if (index < 0)
         {
            throw(`Could not find table name for label ${tableName}`);
         }

         dropdownData[index] = (changedData) ? changedData.id : null;
         setDropdownData(dropdownData);
         setCounter(counter + 1);
      }
   }

   useEffect(() =>
   {
      if(dropdownData)
      {
         console.log(JSON.stringify(data));

         let params = "";
         for (let i = 0; i < dropdownData.length; i++)
         {
            if (i > 0)
            {
               params += "&";
            }
            params += `${data.dropdownNameList[i]}=`;
            if(dropdownData[i])
            {
               params += `${dropdownData[i]}`;

            }
         }
         console.log(params);
         reloadWidgetCallback(widgetIndex, params);
         setChildUrlParams(params)
      }
   }, [counter]);


   return (
      <Card className="parentWidgetCard" sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>

         <Grid container>
            <Grid item xs={4}>
               <Box pt={3} px={3}>
                  {
                     label && (
                        <Typography variant="h5" textTransform="capitalize">
                           {label}
                        </Typography>
                     )
                  }
               </Box>
            </Grid>
            <Grid item xs={8}>
               <Box mb={3} p={3}>
                  {
                     data?.dropdownDataList?.map((dropdownData: any, index: number) =>
                        <DropdownMenu
                           key={`dropdown-${data.dropdownLabelList[index]}-${index}`}
                           label={`Select ${data.dropdownLabelList[index]}`}
                           sx={{width: 200, marginLeft: "15px", float: "right"}}
                           dropdownOptions={dropdownData}
                           onChangeCallback={handleDataChange}
                        />
                     )
                  }
               </Box>
            </Grid>
         </Grid>
         <Box pr={3} pl={3}>
            <DashboardWidgets widgetMetaDataList={widgets} entityPrimaryKey={entityPrimaryKey} childUrlParams={childUrlParams} areChildren={true}/>
         </Box>
      </Card>
   );
}

export default ParentWidget;
