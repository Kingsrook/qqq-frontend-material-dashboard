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

import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";

/*******************************************************************************
 ** Utility class for working with QQQ Filters
 **
 *******************************************************************************/
class QFilterUtils
{
   /*******************************************************************************
    ** Convert a grid operator to a QQQ Criteria Operator.
    *******************************************************************************/
   public static gridCriteriaOperatorToQQQ = (operator: string): QCriteriaOperator =>
   {
      switch (operator)
      {
         case "contains":
            return QCriteriaOperator.CONTAINS;
         case "startsWith":
            return QCriteriaOperator.STARTS_WITH;
         case "endsWith":
            return QCriteriaOperator.ENDS_WITH;
         case "is":
         case "equals":
         case "=":
         case "isTrue":
         case "isFalse":
            return QCriteriaOperator.EQUALS;
         case "isNot":
         case "!=":
            return QCriteriaOperator.NOT_EQUALS;
         case "after":
         case ">":
            return QCriteriaOperator.GREATER_THAN;
         case "onOrAfter":
         case ">=":
            return QCriteriaOperator.GREATER_THAN_OR_EQUALS;
         case "before":
         case "<":
            return QCriteriaOperator.LESS_THAN;
         case "onOrBefore":
         case "<=":
            return QCriteriaOperator.LESS_THAN_OR_EQUALS;
         case "isEmpty":
            return QCriteriaOperator.IS_BLANK;
         case "isNotEmpty":
            return QCriteriaOperator.IS_NOT_BLANK;
         case "isAnyOf":
            return QCriteriaOperator.IN;
         case "isNone": // todo - verify - not seen in UI
            return QCriteriaOperator.NOT_IN;
         default:
            return QCriteriaOperator.EQUALS;
      }
   };

   /*******************************************************************************
    ** Convert a qqq criteria operator to one expected by the grid.
    *******************************************************************************/
   public static qqqCriteriaOperatorToGrid = (operator: QCriteriaOperator, fieldType: QFieldType = QFieldType.STRING): string =>
   {
      switch (operator)
      {
         case QCriteriaOperator.EQUALS:
            switch (fieldType)
            {
               case QFieldType.INTEGER:
               case QFieldType.DECIMAL:
                  return ("=");
               case QFieldType.DATE:
               case QFieldType.TIME:
               case QFieldType.DATE_TIME:
                  return ("equals");
               case QFieldType.BOOLEAN:
               case QFieldType.STRING:
               case QFieldType.TEXT:
               case QFieldType.HTML:
               case QFieldType.PASSWORD:
               case QFieldType.BLOB:
               default:
                  return ("is");
            }
         case QCriteriaOperator.NOT_EQUALS:
            switch (fieldType)
            {
               case QFieldType.INTEGER:
               case QFieldType.DECIMAL:
                  return ("!=");
               case QFieldType.DATE:
               case QFieldType.TIME:
               case QFieldType.DATE_TIME:
               case QFieldType.BOOLEAN:
               case QFieldType.STRING:
               case QFieldType.TEXT:
               case QFieldType.HTML:
               case QFieldType.PASSWORD:
               case QFieldType.BLOB:
               default:
                  return ("isNot");
            }
         case QCriteriaOperator.IN:
            return ("isAnyOf");
         case QCriteriaOperator.NOT_IN:
            return ("isNone"); // todo verify - not seen in UI
         case QCriteriaOperator.STARTS_WITH:
            return ("startsWith");
         case QCriteriaOperator.ENDS_WITH:
            return ("endsWith");
         case QCriteriaOperator.CONTAINS:
            return ("contains");
         case QCriteriaOperator.NOT_STARTS_WITH:
            return (""); // todo - not supported in grid?
         case QCriteriaOperator.NOT_ENDS_WITH:
            return (""); // todo - not supported in grid?
         case QCriteriaOperator.NOT_CONTAINS:
            return (""); // todo - not supported in grid?
         case QCriteriaOperator.LESS_THAN:
            switch (fieldType)
            {
               case QFieldType.DATE:
               case QFieldType.TIME:
               case QFieldType.DATE_TIME:
                  return ("before");
               default:
                  return ("<");
            }
         case QCriteriaOperator.LESS_THAN_OR_EQUALS:
            switch (fieldType)
            {
               case QFieldType.DATE:
               case QFieldType.TIME:
               case QFieldType.DATE_TIME:
                  return ("onOrBefore");
               default:
                  return ("<=");
            }
         case QCriteriaOperator.GREATER_THAN:
            switch (fieldType)
            {
               case QFieldType.DATE:
               case QFieldType.TIME:
               case QFieldType.DATE_TIME:
                  return ("after");
               default:
                  return (">");
            }
         case QCriteriaOperator.GREATER_THAN_OR_EQUALS:
            switch (fieldType)
            {
               case QFieldType.DATE:
               case QFieldType.TIME:
               case QFieldType.DATE_TIME:
                  return ("onOrAfter");
               default:
                  return (">=");
            }
         case QCriteriaOperator.IS_BLANK:
            return ("isEmpty");
         case QCriteriaOperator.IS_NOT_BLANK:
            return ("isNotEmpty");
         case QCriteriaOperator.BETWEEN:
            return (""); // todo - not supported in grid?
         case QCriteriaOperator.NOT_BETWEEN:
            return (""); // todo - not supported in grid?
         default:
            console.warn(`Unhandled criteria operator: ${operator}`);
            return ("=");
      }
   };

   /*******************************************************************************
    ** the values object needs handled differently based on cardinality of the operator.
    ** that is - qqq always wants a list, but the grid provides it differently per-operator.
    ** for single-values (the default), we must wrap it in an array.
    ** for non-values (e.g., blank), set it to null.
    ** for list-values, it's already in an array, so don't wrap it.
    *******************************************************************************/
   public static gridCriteriaValueToQQQ = (operator: QCriteriaOperator, value: any, gridOperatorValue: string): any[] =>
   {
      if(gridOperatorValue === "isTrue")
      {
         return [true];
      }
      else if(gridOperatorValue === "isFalse")
      {
         return [false];
      }

      if (operator === QCriteriaOperator.IS_BLANK || operator === QCriteriaOperator.IS_NOT_BLANK)
      {
         return (null);
      }
      else if (operator === QCriteriaOperator.IN || operator === QCriteriaOperator.NOT_IN)
      {
         return (value);
      }

      return ([value]);
   };

   /*******************************************************************************
    **
    *******************************************************************************/
   public static qqqCriteriaValuesToGrid = (operator: QCriteriaOperator, values: any[]): any | any[] =>
   {
      if (operator === QCriteriaOperator.IS_BLANK || operator === QCriteriaOperator.IS_NOT_BLANK)
      {
         return (null); // todo - verify
      }
      else if (operator === QCriteriaOperator.IN || operator === QCriteriaOperator.NOT_IN)
      {
         return (values);
      }

      return (values[0]);
   };
}

export default QFilterUtils;
