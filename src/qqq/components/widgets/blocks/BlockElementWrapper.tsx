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


import {Tooltip} from "@mui/material";
import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {BlockData, BlockLink, BlockTooltip} from "qqq/components/widgets/blocks/BlockModels";

interface BlockElementWrapperProps
{
   data: BlockData;
   slot: string
   linkProps?: any;
   children: ReactElement;
}

/*******************************************************************************
 ** For Blocks - wrap their "slot" elements with an optional tooltip and/or link
 *******************************************************************************/
export default function BlockElementWrapper({data, slot, linkProps, children}: BlockElementWrapperProps): JSX.Element
{
   let link: BlockLink;
   let tooltip: BlockTooltip;

   if(slot)
   {
      link = data.linkMap && data.linkMap[slot.toUpperCase()];
      if(!link)
      {
         link = data.link;
      }

      tooltip = data.tooltipMap && data.tooltipMap[slot.toUpperCase()];
      if(!tooltip)
      {
         tooltip = data.tooltip;
      }
   }
   else
   {
      link = data.link;
      tooltip = data.tooltip;
   }

   let rs = children;

   if(link)
   {
      rs = <Link to={link.href} target={link.target} style={{color: "#546E7A"}} {...linkProps}>{rs}</Link>
   }

   if(tooltip)
   {
      let placement = tooltip.placement ? tooltip.placement.toLowerCase() : "bottom"

      // @ts-ignore - placement possible values
      rs = <Tooltip title={tooltip.title} placement={placement}>{rs}</Tooltip>
   }

   return (rs);
}
