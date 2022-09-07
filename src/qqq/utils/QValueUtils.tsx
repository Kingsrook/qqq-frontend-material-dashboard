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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import "datejs";
import React, {Fragment} from "react";

/*******************************************************************************
 ** Utility class for working with QQQ Values
 **
 *******************************************************************************/
class QValueUtils
{
   public static getDisplayValue(field: QFieldMetaData, record: QRecord): string
   {
      const displayValue = record.displayValues ? record.displayValues.get(field.name) : undefined;
      const rawValue = record.values ? record.values.get(field.name) : undefined;

      if (field.type === QFieldType.DATE_TIME)
      {
         if (!rawValue)
         {
            return ("");
         }
         const date = new Date(rawValue);
         // @ts-ignore
         return (`${date.toString("yyyy-MM-dd hh:mm:ss")} ${date.getHours() < 12 ? "AM" : "PM"} ${date.getTimezone()}`);
      }
      else if (field.type === QFieldType.DATE)
      {
         // unclear if we need any customization for DATE or TIME, but leaving blocks for them just in case
         return (displayValue);
      }
      else if (field.type === QFieldType.TIME)
      {
         return (displayValue);
      }

      if (displayValue === undefined && rawValue !== undefined)
      {
         return (rawValue);
      }

      return (displayValue);
   }

   public static getFormattedNumber(n: number): string
   {
      try
      {
         if(n !== null && n !== undefined)
         {
            return (n.toLocaleString());
         }
         else
         {
            return ("");
         }
      }
      catch(e)
      {
         return (String(n));
      }
   }



   public static breakTextIntoLines(value: string): JSX.Element
   {
      return (
         <Fragment>
            {value.split(/\n/).map((value: string, index: number) => (
               // eslint-disable-next-line react/no-array-index-key
               <Fragment key={index}>
                  <span>{value}</span>
                  <br />
               </Fragment>
            ))}
         </Fragment>
      );
   }
}

export default QValueUtils;
