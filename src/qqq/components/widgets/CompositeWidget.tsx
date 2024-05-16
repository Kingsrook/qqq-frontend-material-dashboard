/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2024.  Kingsrook, LLC
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
import {Box, Skeleton} from "@mui/material";
import {BlockData} from "qqq/components/widgets/blocks/BlockModels";
import WidgetBlock from "qqq/components/widgets/WidgetBlock";
import React from "react";


interface CompositeData
{
   blocks: BlockData[];
   styleOverrides?: any;
   layout?: string;
}


interface CompositeWidgetProps
{
   widgetMetaData: QWidgetMetaData;
   data: CompositeData;
}


/*******************************************************************************
 ** Widget which is a list of Blocks.
 *******************************************************************************/
export default function CompositeWidget({widgetMetaData, data}: CompositeWidgetProps): JSX.Element
{
   if (!data || !data.blocks)
   {
      return (<Skeleton />);
   }

   ////////////////////////////////////////////////////////////////////////////////////
   // note - these layouts are defined in qqq in the CompositeWidgetData.Layout enum //
   ////////////////////////////////////////////////////////////////////////////////////
   let layout = data?.layout;
   let boxStyle: any = {};
   if (layout == "FLEX_COLUMN")
   {
      boxStyle.display = "flex";
      boxStyle.flexDirection = "column";
      boxStyle.flexWrap = "wrap";
      boxStyle.gap = "0.5rem";
   }
   else if (layout == "FLEX_ROW_WRAPPED")
   {
      boxStyle.display = "flex";
      boxStyle.flexDirection = "row";
      boxStyle.flexWrap = "wrap";
      boxStyle.gap = "0.5rem";
   }
   else if (layout == "FLEX_ROW_SPACE_BETWEEN")
   {
      boxStyle.display = "flex";
      boxStyle.flexDirection = "row";
      boxStyle.justifyContent = "space-between";
      boxStyle.gap = "0.25rem";
   }
   else if (layout == "TABLE_SUB_ROW_DETAILS")
   {
      boxStyle.display = "flex";
      boxStyle.flexDirection = "column";
      boxStyle.fontSize = "0.875rem";
      boxStyle.fontWeight = 400;
      boxStyle.borderRight = "1px solid #D0D0D0";
   }
   else if (layout == "BADGES_WRAPPER")
   {
      boxStyle.display = "flex";
      boxStyle.gap = "0.25rem";
      boxStyle.padding = "0 0.25rem";
      boxStyle.fontSize = "0.875rem";
      boxStyle.fontWeight = 400;
      boxStyle.border = "1px solid gray";
      boxStyle.borderRadius = "0.5rem";
      boxStyle.background = "#FFFFFF";
   }

   if (data?.styleOverrides)
   {
      boxStyle = {...boxStyle, ...data.styleOverrides};
   }

   return (<Box sx={boxStyle} className="compositeWidget">
      {
         data.blocks.map((block: BlockData, index) => (
            <React.Fragment key={index}>
               <WidgetBlock widgetMetaData={widgetMetaData} block={block} />
            </React.Fragment>
         ))
      }
   </Box>);

}
