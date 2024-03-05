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

import BlockElementWrapper from "qqq/components/widgets/blocks/BlockElementWrapper";
import {StandardBlockComponentProps} from "qqq/components/widgets/blocks/BlockModels";


/*******************************************************************************
 ** Block that renders a label & value, meant to be used as a detail-row in a
 ** sub-row within a table widget
 **
 ** ${label} ${value}
 *******************************************************************************/
export default function TableSubRowDetailRowBlock({widgetMetaData, data}: StandardBlockComponentProps): JSX.Element
{
   return (
      <div style={{display: "flex", maxWidth: "calc(100% - 24px)", justifyContent: "space-between"}}>

         {
            data.values.label &&
            <div style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
               <BlockElementWrapper metaData={widgetMetaData} data={data} slot="label">
                  <span style={{color: data.styles.labelColor}}>{data.values.label}</span>
               </BlockElementWrapper>
            </div>
         }

         {
            data.values.value &&
            <BlockElementWrapper metaData={widgetMetaData} data={data} slot="value">
               <span style={{color: data.styles.valueColor}}>{data.values.value}</span>
            </BlockElementWrapper>
         }
      </div>
   );
}
