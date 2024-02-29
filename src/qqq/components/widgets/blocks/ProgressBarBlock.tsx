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

import Typography from "@mui/material/Typography";
import BlockElementWrapper from "qqq/components/widgets/blocks/BlockElementWrapper";
import {StandardBlockComponentProps} from "qqq/components/widgets/blocks/BlockModels";


/*******************************************************************************
 ** Block that renders a progress bar!
 **
 ** Values:
 **    ${heading}
 **    [${percent}===___] ${value ?? percent}
 **
 ** Slots:
 **    ${heading}
 **    ${bar}             ${value}
 *******************************************************************************/
export default function ProgressBarBlock({data}: StandardBlockComponentProps): JSX.Element
{
   return (
      <Typography component="div" variant="button" color="text" fontWeight="light" sx={{textTransform: "none"}}>
         {
            data.values.heading &&
            <div style={{marginBottom: "0.25rem", fontWeight: 500, color: "#3D3D3D"}}>
               <BlockElementWrapper data={data} slot="heading">
                  <span>{data.values.heading}</span>
               </BlockElementWrapper>
            </div>
         }

         <div style={{display: "flex", alignItems: "center", marginBottom: "0.75rem"}}>

            <BlockElementWrapper data={data} slot="bar" linkProps={{style: {width: "100%"}}}>
               <div style={{background: "#E0E0E0", width: "100%", borderRadius: "0.5rem", height: "1rem"}}>
                  {
                     data.values.percent > 0 ? <div style={{background: data.styles.barColor ?? "#0062ff", minWidth: "1rem", width: `${data.values.percent}%`, borderRadius: "0.5rem", height: "1rem"}}></div> : <></>
                  }
               </div>
            </BlockElementWrapper>

            <div style={{width: "60px", textAlign: "right", fontWeight: 600, color: "#3D3D3D"}}>
               <BlockElementWrapper data={data} slot="value">
                  <span>{data.values.value ?? `${(data.values.percent as number).toFixed(1)}%`}</span>
               </BlockElementWrapper>
            </div>

         </div>
      </Typography>);

}
