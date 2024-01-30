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
import {NowExpression} from "@kingsrook/qqq-frontend-core/lib/model/query/NowExpression";
import {NowWithOffsetExpression} from "@kingsrook/qqq-frontend-core/lib/model/query/NowWithOffsetExpression";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QFilterOrderBy} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {ThisOrLastPeriodExpression} from "@kingsrook/qqq-frontend-core/lib/model/query/ThisOrLastPeriodExpression";
import {GridSortModel} from "@mui/x-data-grid-pro";
import TableUtils from "qqq/utils/qqq/TableUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

/*******************************************************************************
 ** Utility class for working with QQQ Filters
 **
 *******************************************************************************/
class FilterUtils
{

   /*******************************************************************************
    ** Helper method - take a list of values, which may be possible values, and
    ** either return the original list, or a new list that is just the ids of the
    ** possible values (if it was a list of possible values).
    **
    ** Or, if the values are date-times, convert them to UTC.
    *******************************************************************************/
   public static cleanseCriteriaValueForQQQ = (param: any[], fieldMetaData: QFieldMetaData): number[] | string[] =>
   {
      if (param === null || param === undefined)
      {
         return (param);
      }

      if (FilterUtils.gridCriteriaValueToExpression(param))
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
    **
    *******************************************************************************/
   public static async cleanupValuesInFilerFromQueryString(qController: QController, tableMetaData: QTableMetaData, queryFilter: QQueryFilter)
   {
      for (let i = 0; i < queryFilter?.criteria?.length; i++)
      {
         const criteria = queryFilter.criteria[i];
         let [field, fieldTable] = TableUtils.getFieldAndTable(tableMetaData, criteria.fieldName);

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
               values = await qController.possibleValues(fieldTable.name, null, field.name, "", values);
            }

            ////////////////////////////////////////////
            // log message if no values were returned //
            ////////////////////////////////////////////
            if (!values || values.length === 0)
            {
               console.warn("WARNING: No possible values were returned for [" + field.possibleValueSourceName + "] for values [" + criteria.values + "].");
            }
         }

         //////////////////////////////////////////////////////////////////////////
         // replace objects that look like expressions with expression instances //
         //////////////////////////////////////////////////////////////////////////
         if (values && values.length)
         {
            for (let i = 0; i < values.length; i++)
            {
               const expression = this.gridCriteriaValueToExpression(values[i]);
               if (expression)
               {
                  values[i] = expression;
               }
            }
         }

         criteria.values = values;
      }
   }


   /*******************************************************************************
    ** given a table, and a field name (which may be prefixed with an exposed-join
    ** table name (from the table) - return the corresponding field-meta-data, and
    ** the table that the field is from (e.g., may be a join table!)
    *******************************************************************************/
   public static getField(tableMetaData: QTableMetaData, fieldName: string): [QFieldMetaData, QTableMetaData]
   {
      if (fieldName == null)
      {
         return ([null, null]);
      }

      if (fieldName.indexOf(".") > -1)
      {
         let parts = fieldName.split(".", 2);
         if (tableMetaData.exposedJoins && tableMetaData.exposedJoins.length)
         {
            for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
            {
               const joinTable = tableMetaData.exposedJoins[i].joinTable;
               if (joinTable.name == parts[0])
               {
                  return ([joinTable.fields.get(parts[1]), joinTable]);
               }
            }
         }

         console.log(`Failed to find join field: ${fieldName}`);
         return ([null, null]);
      }
      else
      {
         return ([tableMetaData.fields.get(fieldName), tableMetaData]);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   private static gridCriteriaValueToExpression(value: any)
   {
      if (value && value.length)
      {
         value = value[0];
      }

      if (value && value.type)
      {
         if (value.type == "NowWithOffset")
         {
            return (new NowWithOffsetExpression(value));
         }
         else if (value.type == "Now")
         {
            return (new NowExpression(value));
         }
         else if (value.type == "ThisOrLastPeriod")
         {
            return (new ThisOrLastPeriodExpression(value));
         }
      }

      return (null);
   }


   /*******************************************************************************
    ** edit the input filter object, replacing any values which have {id,label} attributes
    ** to instead just have the id part.
    *******************************************************************************/
   public static convertFilterPossibleValuesToIds(inputFilter: QQueryFilter): QQueryFilter
   {
      const filter = Object.assign({}, inputFilter);

      if (filter.criteria)
      {
         for (let i = 0; i < filter.criteria.length; i++)
         {
            const criteria = filter.criteria[i];
            if (criteria.values)
            {
               for (let j = 0; j < criteria.values.length; j++)
               {
                  let value = criteria.values[j];
                  if (value && value.id && value.label)
                  {
                     criteria.values[j] = value.id;
                  }
               }
            }
         }
      }

      return (filter);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static canFilterWorkAsBasic(tableMetaData: QTableMetaData, filter: QQueryFilter): { canFilterWorkAsBasic: boolean; reasonsWhyItCannot?: string[] }
   {
      const reasonsWhyItCannot: string[] = [];

      if(filter == null)
      {
         return ({canFilterWorkAsBasic: true});
      }

      if(filter.booleanOperator == "OR")
      {
         reasonsWhyItCannot.push("Filter uses the 'OR' operator.")
      }

      if(filter.criteria)
      {
         const usedFields: {[name: string]: boolean} = {};
         const warnedFields: {[name: string]: boolean} = {};
         for (let i = 0; i < filter.criteria.length; i++)
         {
            const criteriaName = filter.criteria[i].fieldName;
            if(!criteriaName)
            {
               continue;
            }

            if(usedFields[criteriaName])
            {
               if(!warnedFields[criteriaName])
               {
                  const [field, tableForField] = TableUtils.getFieldAndTable(tableMetaData, criteriaName);
                  let fieldLabel = field.label;
                  if(tableForField.name != tableMetaData.name)
                  {
                     let fieldLabel = `${tableForField.label}: ${field.label}`;
                  }
                  reasonsWhyItCannot.push(`Filter contains more than 1 condition for the field: ${fieldLabel}`);
                  warnedFields[criteriaName] = true;
               }
            }
            usedFields[criteriaName] = true;
         }
      }

      if(reasonsWhyItCannot.length == 0)
      {
         return ({canFilterWorkAsBasic: true});
      }
      else
      {
         return ({canFilterWorkAsBasic: false, reasonsWhyItCannot: reasonsWhyItCannot});
      }
   }

   /*******************************************************************************
    ** get the values associated with a criteria as a string, e.g., for showing
    ** in a tooltip.
    *******************************************************************************/
   public static getValuesString(fieldMetaData: QFieldMetaData, criteria: QFilterCriteria, maxValuesToShow: number = 3): string
   {
      let valuesString = "";
      if (criteria.values && criteria.values.length && fieldMetaData.type !== QFieldType.BOOLEAN)
      {
         let labels = [] as string[];

         let maxLoops = criteria.values.length;
         if (maxLoops > (maxValuesToShow + 2))
         {
            maxLoops = maxValuesToShow;
         }

         for (let i = 0; i < maxLoops; i++)
         {
            if (criteria.values[i] && criteria.values[i].label)
            {
               labels.push(criteria.values[i].label);
            }
            else
            {
               labels.push(criteria.values[i]);
            }
         }

         if (maxLoops < criteria.values.length)
         {
            labels.push(" and " + (criteria.values.length - maxLoops) + " other values.");
         }

         valuesString = (labels.join(", "));
      }
      return valuesString;
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static buildQFilterFromJSONObject(object: any): QQueryFilter
   {
      const queryFilter = new QQueryFilter();

      queryFilter.criteria = [];
      for (let i = 0; i < object.criteria?.length; i++)
      {
         const criteriaObject = object.criteria[i];
         queryFilter.criteria.push(new QFilterCriteria(criteriaObject.fieldName, criteriaObject.operator, criteriaObject.values));
      }

      queryFilter.orderBys = [];
      for (let i = 0; i < object.orderBys?.length; i++)
      {
         const orderByObject = object.orderBys[i];
         queryFilter.orderBys.push(new QFilterOrderBy(orderByObject.fieldName, orderByObject.isAscending));
      }

      queryFilter.booleanOperator = object.booleanOperator;
      queryFilter.skip = object.skip;
      queryFilter.limit = object.limit;

      return (queryFilter);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static getGridSortFromQueryFilter(queryFilter: QQueryFilter): GridSortModel
   {
      const gridSortModel: GridSortModel = [];
      for (let i = 0; i < queryFilter?.orderBys?.length; i++)
      {
         const orderBy = queryFilter.orderBys[i];
         gridSortModel.push({field: orderBy.fieldName, sort: orderBy.isAscending ? "asc" : "desc"})
      }
      return (gridSortModel);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static operatorToHumanString(criteria: QFilterCriteria): string
   {
      if(criteria == null || criteria.operator == null)
      {
         return (null);
      }

      try
      {
         switch(criteria.operator)
         {
            case QCriteriaOperator.EQUALS:
               return ("equals");
            case QCriteriaOperator.NOT_EQUALS:
            case QCriteriaOperator.NOT_EQUALS_OR_IS_NULL:
               return ("does not equal");
            case QCriteriaOperator.IN:
               return ("is any of");
            case QCriteriaOperator.NOT_IN:
               return ("is none of");
            case QCriteriaOperator.STARTS_WITH:
               return ("starts with");
            case QCriteriaOperator.ENDS_WITH:
               return ("ends with");
            case QCriteriaOperator.CONTAINS:
               return ("contains");
            case QCriteriaOperator.NOT_STARTS_WITH:
               return ("does not start with");
            case QCriteriaOperator.NOT_ENDS_WITH:
               return ("does not end with");
            case QCriteriaOperator.NOT_CONTAINS:
               return ("does not contain");
            case QCriteriaOperator.LESS_THAN:
               return ("less than");
            case QCriteriaOperator.LESS_THAN_OR_EQUALS:
               return ("less than or equals");
            case QCriteriaOperator.GREATER_THAN:
               return ("greater than or equals");
            case QCriteriaOperator.GREATER_THAN_OR_EQUALS:
               return ("greater than or equals");
            case QCriteriaOperator.IS_BLANK:
               return ("is blank");
            case QCriteriaOperator.IS_NOT_BLANK:
               return ("is not blank");
            case QCriteriaOperator.BETWEEN:
               return ("is between");
            case QCriteriaOperator.NOT_BETWEEN:
               return ("is not between");
         }
      }
      catch(e)
      {
         console.log(`Error getting operator human string for ${JSON.stringify(criteria)}: ${e}`);
         return criteria?.operator
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static criteriaToHumanString(table: QTableMetaData, criteria: QFilterCriteria, styled = false): string | JSX.Element
   {
      if(criteria == null)
      {
         return (null);
      }

      const [field, fieldTable] = TableUtils.getFieldAndTable(table, criteria.fieldName);
      const fieldLabel = TableUtils.getFieldFullLabel(table, criteria.fieldName);
      const valuesString = FilterUtils.getValuesString(field, criteria);

      if(styled)
      {
         return (<>
            <b>{fieldLabel}</b> {FilterUtils.operatorToHumanString(criteria)} <span style={{color: "#0062FF"}}>{valuesString}</span>&nbsp;
         </>);
      }
      else
      {
         return (`${fieldLabel} ${FilterUtils.operatorToHumanString(criteria)} ${valuesString}`);
      }
   }

}

export default FilterUtils;
