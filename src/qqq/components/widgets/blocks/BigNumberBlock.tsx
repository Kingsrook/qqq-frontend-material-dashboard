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
import UpOrDownNumberBlock from "qqq/components/widgets/blocks/UpOrDownNumberBlock";



/*******************************************************************************
 ** Block that renders ... a big number, optionally with some other stuff.
 **
 ** ${heading}
 ** ${number} ${context}
 *******************************************************************************/
export default function BigNumberBlock({widgetMetaData, data}: StandardBlockComponentProps): JSX.Element
{
   let flexJustifyContent = "normal";
   let flexAlignItems = "baseline";

   return (
      <div style={{width: data.styles.width ?? "auto"}}>

         <div style={{fontWeight: "700", fontSize: "0.875rem", color: "#3D3D3D", marginBottom: "-0.5rem"}}>
            <BlockElementWrapper data={data} slot="heading">
               <span>{data.values.heading}</span>
            </BlockElementWrapper>
         </div>

         <div style={{display: "flex", alignItems: flexAlignItems, justifyContent: flexJustifyContent}}>

            <div style={{display: "flex", alignItems: "baseline"}}>
               <div style={{fontWeight: "700", fontSize: "2rem", marginRight: "0.25rem"}}>
                  <BlockElementWrapper data={data} slot="number">
                     <span style={{color: data.styles.numberColor}}>{data.values.number}</span>
                  </BlockElementWrapper>
               </div>
               {
                  data.values.context &&
                  <div style={{fontWeight: "500", fontSize: "0.875rem", color: "#7b809a"}}>
                     <BlockElementWrapper data={data} slot="context">
                        <span>{data.values.context}</span>
                     </BlockElementWrapper>
                  </div>
               }
            </div>

         </div>
      </div>
   );
}
