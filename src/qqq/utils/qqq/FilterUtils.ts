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

import {QController} from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QFilterOrderBy} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {GridFilterModel, GridLinkOperator, GridSortItem} from "@mui/x-data-grid-pro";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

const CURRENT_SAVED_FILTER_ID_LOCAL_STORAGE_KEY_ROOT = "qqq.currentSavedFilterId";

/*******************************************************************************
 ** Utility class for working with QQQ Filters
 **
 *******************************************************************************/
class FilterUtils
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
         case "notContains":
            return QCriteriaOperator.NOT_CONTAINS;
         case "startsWith":
            return QCriteriaOperator.STARTS_WITH;
         case "notStartsWith":
            return QCriteriaOperator.NOT_STARTS_WITH;
         case "endsWith":
            return QCriteriaOperator.ENDS_WITH;
         case "notEndsWith":
            return QCriteriaOperator.NOT_ENDS_WITH;
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
         case "isNone":
            return QCriteriaOperator.NOT_IN;
         case "between":
            return QCriteriaOperator.BETWEEN;
         case "notBetween":
            return QCriteriaOperator.NOT_BETWEEN;
         default:
            return QCriteriaOperator.EQUALS;
      }
   };

   /*******************************************************************************
    ** Convert a qqq criteria operator to one expected by the grid.
    *******************************************************************************/
   public static qqqCriteriaOperatorToGrid = (operator: QCriteriaOperator, field: QFieldMetaData, criteriaValues: any[]): string =>
   {
      const fieldType = field.type;
      switch (operator)
      {
         case QCriteriaOperator.EQUALS:

            if (field.possibleValueSourceName)
            {
               return ("is");
            }

            switch (fieldType)
            {
               case QFieldType.INTEGER:
               case QFieldType.DECIMAL:
                  return ("=");
               case QFieldType.DATE:
               case QFieldType.TIME:
               case QFieldType.DATE_TIME:
               case QFieldType.STRING:
               case QFieldType.TEXT:
               case QFieldType.HTML:
               case QFieldType.PASSWORD:
               case QFieldType.BLOB:
                  return ("equals");
               case QFieldType.BOOLEAN:
                  if (criteriaValues && criteriaValues[0] === true)
                  {
                     return ("isTrue");
                  }
                  else if (criteriaValues && criteriaValues[0] === false)
                  {
                     return ("isFalse");
                  }
                  return ("is");
               default:
                  return ("is");
            }
         case QCriteriaOperator.NOT_EQUALS:

            if (field.possibleValueSourceName)
            {
               return ("isNot");
            }

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
            return ("isNone");
         case QCriteriaOperator.STARTS_WITH:
            return ("startsWith");
         case QCriteriaOperator.ENDS_WITH:
            return ("endsWith");
         case QCriteriaOperator.CONTAINS:
            return ("contains");
         case QCriteriaOperator.NOT_STARTS_WITH:
            return ("notStartsWith");
         case QCriteriaOperator.NOT_ENDS_WITH:
            return ("notEndsWith");
         case QCriteriaOperator.NOT_CONTAINS:
            return ("notContains");
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
            return ("between");
         case QCriteriaOperator.NOT_BETWEEN:
            return ("notBetween");
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
   public static gridCriteriaValueToQQQ = (operator: QCriteriaOperator, value: any, gridOperatorValue: string, fieldMetaData: QFieldMetaData): any[] =>
   {
      if (gridOperatorValue === "isTrue")
      {
         return [true];
      }
      else if (gridOperatorValue === "isFalse")
      {
         return [false];
      }

      if (operator === QCriteriaOperator.IS_BLANK || operator === QCriteriaOperator.IS_NOT_BLANK)
      {
         return (null);
      }
      else if (operator === QCriteriaOperator.IN || operator === QCriteriaOperator.NOT_IN || operator === QCriteriaOperator.BETWEEN || operator === QCriteriaOperator.NOT_BETWEEN)
      {
         if (value == null && (operator === QCriteriaOperator.BETWEEN || operator === QCriteriaOperator.NOT_BETWEEN))
         {
            /////////////////////////////////////////////////////////////////////////////////////////////////
            // if we send back null, we get a 500 - bad look every time you try to set up a BETWEEN filter //
            // but array of 2 nulls?  comes up sunshine.                                                   //
            /////////////////////////////////////////////////////////////////////////////////////////////////
            return ([null, null]);
         }
         return (FilterUtils.prepFilterValuesForBackend(value, fieldMetaData));
      }

      return (FilterUtils.prepFilterValuesForBackend([value], fieldMetaData));
   };


   /*******************************************************************************
    ** Helper method - take a list of values, which may be possible values, and
    ** either return the original list, or a new list that is just the ids of the
    ** possible values (if it was a list of possible values).
    **
    ** Or, if the values are date-times, convert them to UTC.
    *******************************************************************************/
   private static prepFilterValuesForBackend = (param: any[], fieldMetaData: QFieldMetaData): number[] | string[] =>
   {
      if (param === null || param === undefined)
      {
         return (param);
      }

      let rs = [];
      for (let i = 0; i < param.length; i++)
      {
         console.log(param[i]);
         if (param[i] && param[i].id && param[i].label)
         {
            /////////////////////////////////////////////////////////////
            // if the param looks like a possible value, return its id //
            /////////////////////////////////////////////////////////////
            rs.push(param[i].id);
         }
         else
         {
            if (fieldMetaData?.type == QFieldType.DATE_TIME)
            {
               try
               {
                  let toPush = ValueUtils.frontendLocalZoneDateTimeStringToUTCStringForBackend(param[i]);
                  rs.push(toPush);
               }
               catch (e)
               {
                  console.log("Error converting date-time to UTC: ", e);
                  rs.push(param[i]);
               }
            }
            else
            {
               rs.push(param[i]);
            }
         }
      }
      return (rs);
   };


   /*******************************************************************************
    ** Convert a filter field's value from the style that qqq uses, to the style that
    ** the grid uses.
    *******************************************************************************/
   public static qqqCriteriaValuesToGrid = (operator: QCriteriaOperator, values: any[], field: QFieldMetaData): any | any[] =>
   {
      const fieldType = field.type;
      if (operator === QCriteriaOperator.IS_BLANK || operator === QCriteriaOperator.IS_NOT_BLANK)
      {
         return null;
      }
      else if (operator === QCriteriaOperator.IN || operator === QCriteriaOperator.NOT_IN || operator === QCriteriaOperator.BETWEEN || operator === QCriteriaOperator.NOT_BETWEEN)
      {
         return (values);
      }

      if (values.length > 0)
      {
         ////////////////////////////////////////////////////////////////////////////////////////////////
         // make sure dates are formatted for the grid the way it expects - not the way we pass it in. //
         ////////////////////////////////////////////////////////////////////////////////////////////////
         if (fieldType === QFieldType.DATE_TIME)
         {
            values[0] = ValueUtils.formatDateTimeValueForForm(values[0]);
         }
      }

      return (values[0]);
   };


   /*******************************************************************************
    ** Get the default filter to use on the page - either from given filter string, query string param, or
    ** local storage, or a default (empty).
    *******************************************************************************/
   public static async determineFilterAndSortModels(qController: QController, tableMetaData: QTableMetaData, filterString: string, searchParams: URLSearchParams, filterLocalStorageKey: string, sortLocalStorageKey: string): Promise<{ filter: GridFilterModel, sort: GridSortItem[] }>
   {
      let defaultFilter = {items: []} as GridFilterModel;
      let defaultSort = [] as GridSortItem[];

      if (tableMetaData.fields !== undefined)
      {
         if (filterString != null || (searchParams && searchParams.has("filter")))
         {
            try
            {
               const filterJSON = (filterString !== null) ? JSON.parse(filterString) : JSON.parse(searchParams.get("filter"));
               const qQueryFilter = filterJSON as QQueryFilter;

               //////////////////////////////////////////////////////////////////
               // translate from a qqq-style filter to one that the grid wants //
               //////////////////////////////////////////////////////////////////
               let id = 1;
               for (let i = 0; i < qQueryFilter?.criteria?.length; i++)
               {
                  const criteria = qQueryFilter.criteria[i];
                  const field = tableMetaData.fields.get(criteria.fieldName);
                  let values = criteria.values;
                  if (field.possibleValueSourceName)
                  {
                     //////////////////////////////////////////////////////////////////////////////////
                     // possible-values in query-string are expected to only be their id values.     //
                     // e.g., ...values=[1]...                                                       //
                     // but we need them to be possibleValue objects (w/ id & label) so the label    //
                     // can be shown in the filter dropdown.  So, make backend call to look them up. //
                     //////////////////////////////////////////////////////////////////////////////////
                     if (values && values.length > 0)
                     {
                        values = await qController.possibleValues(tableMetaData.name, null, field.name, "", values);
                     }

                     ////////////////////////////////////////////
                     // log message if no values were returned //
                     ////////////////////////////////////////////
                     if (!values || values.length === 0)
                     {
                        console.warn("WARNING: No possible values were returned for [" + field.possibleValueSourceName + "] for values [" + criteria.values + "].");
                     }
                  }

                  if (field && field.type == "DATE_TIME" && !values)
                  {
                     try
                     {
                        const criteria = filterJSON.criteria[i];
                        if (criteria && criteria.expression)
                        {
                           let value = new Date();
                           let amount = Number(criteria.expression.amount);
                           switch (criteria.expression.timeUnit)
                           {
                              case "MINUTES":
                              {
                                 amount = amount * 60;
                                 break;
                              }
                              case "HOURS":
                              {
                                 amount = amount * 60 * 60;
                                 break;
                              }
                              case "DAYS":
                              {
                                 amount = amount * 60 * 60 * 24;
                                 break;
                              }
                              default:
                              {
                                 console.log("Unrecognized time unit: " + criteria.expression.timeUnit);
                              }
                           }

                           if (criteria.expression.operator == "MINUS")
                           {
                              amount = -amount;
                           }

                           value.setTime(value.getTime() + 1000 * amount);
                           values = [ValueUtils.formatDateTimeISO8601(value)];
                        }
                     }
                     catch (e)
                     {
                        console.log(e);
                     }
                  }

                  defaultFilter.items.push({
                     columnField: criteria.fieldName,
                     operatorValue: FilterUtils.qqqCriteriaOperatorToGrid(criteria.operator, field, values),
                     value: FilterUtils.qqqCriteriaValuesToGrid(criteria.operator, values, field),
                     id: id++, // not sure what this id is!!
                  });
               }

               defaultFilter.linkOperator = GridLinkOperator.And;
               if (qQueryFilter.booleanOperator === "OR")
               {
                  defaultFilter.linkOperator = GridLinkOperator.Or;
               }

               //////////////////////////////////////////////////////////////////
               // translate from a qqq-style filter to one that the grid wants //
               //////////////////////////////////////////////////////////////////
               if (qQueryFilter.orderBys && qQueryFilter.orderBys.length > 0)
               {
                  for (let i = 0; i < qQueryFilter.orderBys.length; i++)
                  {
                     const orderBy = qQueryFilter.orderBys[i];
                     defaultSort.push({
                        field: orderBy.fieldName,
                        sort: orderBy.isAscending ? "asc" : "desc"
                     });
                  }
               }

               if (searchParams && searchParams.has("filter"))
               {
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  // if we're setting the filter based on a filter query-string param, then make sure we don't have a currentSavedFilter in local storage. //
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  localStorage.removeItem(`${CURRENT_SAVED_FILTER_ID_LOCAL_STORAGE_KEY_ROOT}.${tableMetaData.name}`);
                  localStorage.setItem(filterLocalStorageKey, JSON.stringify(defaultFilter));
                  localStorage.setItem(sortLocalStorageKey, JSON.stringify(defaultSort));
               }

               return ({filter: defaultFilter, sort: defaultSort});
            }
            catch (e)
            {
               console.warn("Error parsing filter from query string", e);
            }
         }

         if (localStorage.getItem(filterLocalStorageKey))
         {
            defaultFilter = JSON.parse(localStorage.getItem(filterLocalStorageKey));
            console.log(`Got default from LS: ${JSON.stringify(defaultFilter)}`);
         }

         if (localStorage.getItem(sortLocalStorageKey))
         {
            defaultSort = JSON.parse(localStorage.getItem(sortLocalStorageKey));
            console.log(`Got default from LS: ${JSON.stringify(defaultSort)}`);
         }
      }

      return ({filter: defaultFilter, sort: defaultSort});
   }


   /*******************************************************************************
    ** build a qqq filter from a grid and column sort model
    *******************************************************************************/
   public static buildQFilterFromGridFilter(tableMetaData: QTableMetaData, filterModel: GridFilterModel, columnSortModel: GridSortItem[]): QQueryFilter
   {
      console.log("Building q filter with model:");
      console.log(filterModel);

      const qFilter = new QQueryFilter();
      if (columnSortModel)
      {
         columnSortModel.forEach((gridSortItem) =>
         {
            qFilter.addOrderBy(new QFilterOrderBy(gridSortItem.field, gridSortItem.sort === "asc"));
         });
      }

      if (filterModel)
      {
         let foundFilter = false;
         filterModel.items.forEach((item) =>
         {
            /////////////////////////////////////////////////////////////////////////
            // set the values for these operators that otherwise don't have values //
            /////////////////////////////////////////////////////////////////////////
            if (item.operatorValue === "isTrue")
            {
               item.value = [true];
            }
            else if (item.operatorValue === "isFalse")
            {
               item.value = [false];
            }

            ////////////////////////////////////////////////////////////////////////////////
            // if no value set and not 'empty' or 'not empty' operators, skip this filter //
            ////////////////////////////////////////////////////////////////////////////////
            if ((!item.value || item.value.length == 0) && item.operatorValue !== "isEmpty" && item.operatorValue !== "isNotEmpty")
            {
               return;
            }

            var fieldMetadata = tableMetaData?.fields.get(item.columnField);

            const operator = FilterUtils.gridCriteriaOperatorToQQQ(item.operatorValue);
            const values = FilterUtils.gridCriteriaValueToQQQ(operator, item.value, item.operatorValue, fieldMetadata);
            qFilter.addCriteria(new QFilterCriteria(item.columnField, operator, values));
            foundFilter = true;
         });

         qFilter.booleanOperator = "AND";
         if (filterModel.linkOperator == "or")
         {
            ///////////////////////////////////////////////////////////////////////////////////////////
            // by default qFilter uses AND - so only  if we see linkOperator=or do we need to set it //
            ///////////////////////////////////////////////////////////////////////////////////////////
            qFilter.booleanOperator = "OR";
         }
      }

      return qFilter;
   };

}

export default FilterUtils;
