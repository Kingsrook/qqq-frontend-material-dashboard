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

import Icon from "@mui/material/Icon";
import React from "react";
import BlockElementWrapper from "qqq/components/widgets/blocks/BlockElementWrapper";
import {StandardBlockComponentProps} from "qqq/components/widgets/blocks/BlockModels";


/*******************************************************************************
 ** Block that renders an up/down icon, a number, and some context
 **
 ** ${icon} ${number} ${context}
 *
 ** or, if style.isStacked:
 *
 ** ${icon} ${number}
 ** ${context}
 *******************************************************************************/
export default function UpOrDownNumberBlock({widgetMetaData, data}: StandardBlockComponentProps): JSX.Element
{
   if (!data.styles)
   {
      data.styles = {};
   }

   if (!data.values)
   {
      data.values = {};
   }

   const UP_ICON = "arrow_drop_up";
   const DOWN_ICON = "arrow_drop_down";

   const defaultGreenColor = "#2BA83F";
   const defaultRedColor = "#FB4141";

   const goodOrBadColor = data.styles.colorOverride ?? (data.values.isGood ? defaultGreenColor : defaultRedColor);
   const iconName = data.values.isUp ? UP_ICON : DOWN_ICON;

   return (
      <>
         <div style={{display: "flex", flexDirection: data.styles.isStacked ? "column" : "row", alignItems: data.styles.isStacked ? "flex-end" : "baseline", marginLeft: "auto"}}>

            <div style={{display: "flex", alignItems: "baseline", fontWeight: 700, fontSize: ".875rem"}}>
               <BlockElementWrapper metaData={widgetMetaData} data={data} slot="number">
                  <>
                     <Icon sx={{color: goodOrBadColor, alignSelf: "flex-end", fontSize: "2.25rem !important", lineHeight: "0.875rem", height: "1rem", width: "2rem",}}>{iconName}</Icon>
                     <span style={{color: goodOrBadColor}}>{data.values.number}</span>
                  </>
               </BlockElementWrapper>
            </div>

            <div style={{fontWeight: 500, fontSize: "0.875rem", color: "#7b809a", marginLeft: "0.25rem"}}>
               <BlockElementWrapper metaData={widgetMetaData} data={data} slot="context">
                  <span>{data.values.context}</span>
               </BlockElementWrapper>
            </div>

         </div>
      </>
   );
}
