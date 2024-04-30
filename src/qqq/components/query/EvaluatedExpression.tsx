/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2023.  Kingsrook, LLC
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
import {Expression} from "qqq/components/query/CriteriaDateField";
import ValueUtils from "qqq/utils/qqq/ValueUtils";
import React, {useEffect, useState} from "react";

/*******************************************************************************
 ** Helper component to show value inside tooltips that ticks up every second.
 ** Without this, changing state on the higher-level component caused the tooltip to flicker.
 *******************************************************************************/
interface EvaluatedExpressionProps
{
   field: QFieldMetaData;
   expression: any;
}


export function EvaluatedExpression({field, expression}: EvaluatedExpressionProps)
{
   const [timeForEvaluations, setTimeForEvaluations] = useState(new Date());

   useEffect(() =>
   {
      const interval = setInterval(() =>
      {
         setTimeForEvaluations(new Date());
      }, 1000);

      return () => clearInterval(interval);
   }, []);

   return <>{`${evaluateExpression(timeForEvaluations, field, expression)}`}</>;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const evaluateExpression = (time: Date, field: QFieldMetaData, expression: Expression): string =>
{
   if (expression.type == "FilterVariableExpression")
   {
      return (expression.toString());
   }

   let rs: Date = null;
   if (expression.type == "NowWithOffset")
   {
      rs = time;
      let amount = Number(expression.amount);
      switch (expression.timeUnit)
      {
         case "MINUTES":
         {
            amount = amount * 60 * 1000;
            break;
         }
         case "HOURS":
         {
            amount = amount * HOUR_MS;
            break;
         }
         case "DAYS":
         {
            amount = amount * DAY_MS;
            break;
         }
         case "YEARS":
         {
            amount = amount * 365 * DAY_MS;
            break;
         }
         default:
         {
            console.log("Unrecognized time unit: " + expression.timeUnit);
         }
      }

      if (expression.operator == "MINUS")
      {
         amount = -amount;
      }

      rs.setTime(rs.getTime() + amount);

      if (expression.timeUnit == "YEARS")
      {
         //////////////////////
         // handle leap year //
         //////////////////////
         const today = time;
         while (today.getDate() != rs.getDate())
         {
            rs.setTime(rs.getTime() - DAY_MS);
         }
      }
   }
   else if (expression.type == "Now")
   {
      rs = time;
   }
   else if (expression.type == "ThisOrLastPeriod")
   {
      rs = time;
      rs.setSeconds(0);
      rs.setMinutes(0);
      if (expression.timeUnit == "HOURS")
      {
         if (expression.operator == "LAST")
         {
            rs.setTime(rs.getTime() - HOUR_MS);
         }
      }
      else
      {
         rs.setHours(0);
         if (expression.timeUnit == "DAYS")
         {
            if (expression.operator == "LAST")
            {
               rs.setTime(rs.getTime() - DAY_MS);
            }
         }
         else if (expression.timeUnit == "WEEKS")
         {
            while (rs.getDay() != 0)
            {
               rs.setTime(rs.getTime() - DAY_MS);
            }

            if (expression.operator == "LAST")
            {
               rs.setTime(rs.getTime() - 7 * DAY_MS);
            }
         }
         else if (expression.timeUnit == "MONTHS")
         {
            rs.setDate(1);

            if (expression.operator == "LAST")
            {
               rs.setTime(rs.getTime() - DAY_MS);
               rs.setDate(1);
            }
         }
         else if (expression.timeUnit == "YEARS")
         {
            rs.setDate(1);
            rs.setMonth(0);

            if (expression.operator == "LAST")
            {
               rs.setTime(rs.getTime() - 365 * DAY_MS);
            }
         }
      }
   }

   if (rs)
   {
      if (field.type == QFieldType.DATE)
      {
         return (ValueUtils.formatDate(rs));
      }
      else
      {
         return (ValueUtils.formatDateTime(rs));
      }
   }

   return null;
};



