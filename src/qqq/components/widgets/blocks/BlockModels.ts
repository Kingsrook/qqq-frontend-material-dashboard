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


export interface BlockData
{
   blockTypeName: string;

   tooltip?: BlockTooltip;
   link?: BlockLink;
   tooltipMap?: {[slot: string]: BlockTooltip};
   linkMap?: {[slot: string]: BlockLink};

   values: any;
   styles?: any;
}


export interface BlockTooltip
{
   title: string;
   placement: string;
}


export interface BlockLink
{
   href: string;
   target: string;
}


export interface StandardBlockComponentProps
{
   widgetMetaData: QWidgetMetaData;
   data: BlockData;
}

