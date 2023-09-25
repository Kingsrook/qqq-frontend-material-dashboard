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

import {AdornmentType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/AdornmentType";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {GridColDef, GridFilterItem, GridRowsProp} from "@mui/x-data-grid-pro";
import {GridFilterOperator} from "@mui/x-data-grid/models/gridFilterOperator";
import React from "react";
import {Link} from "react-router-dom";
import {buildQGridPvsOperators, QGridBlobOperators, QGridBooleanOperators, QGridNumericOperators, QGridStringOperators} from "qqq/pages/records/query/GridFilterOperators";
import ValueUtils from "qqq/utils/qqq/ValueUtils";


const emptyApplyFilterFn = (filterItem: GridFilterItem, column: GridColDef): null => null;

function NullInputComponent()
{
   return (<React.Fragment />);
}

const makeGridFilterOperator = (value: string, label: string, takesValues: boolean = false): GridFilterOperator =>
{
   const rs: GridFilterOperator = {value: value, label: label, getApplyFilterFn: emptyApplyFilterFn};
   if (takesValues)
   {
      rs.InputComponent = NullInputComponent;
   }
   return (rs);
};

////////////////////////////////////////////////////////////////////////////////////////
// at this point, these may only be used to drive the toolitp on the FILTER button... //
////////////////////////////////////////////////////////////////////////////////////////
const QGridDateOperators = [
   makeGridFilterOperator("equals", "equals", true),
   makeGridFilterOperator("isNot", "does not equal", true),
   makeGridFilterOperator("after", "is after", true),
   makeGridFilterOperator("onOrAfter", "is on or after", true),
   makeGridFilterOperator("before", "is before", true),
   makeGridFilterOperator("onOrBefore", "is on or before", true),
   makeGridFilterOperator("isEmpty", "is empty"),
   makeGridFilterOperator("isNotEmpty", "is not empty"),
   makeGridFilterOperator("between", "is between", true),
   makeGridFilterOperator("notBetween", "is not between", true),
];

const QGridDateTimeOperators = [
   makeGridFilterOperator("equals", "equals", true),
   makeGridFilterOperator("isNot", "does not equal", true),
   makeGridFilterOperator("after", "is after", true),
   makeGridFilterOperator("onOrAfter", "is at or after", true),
   makeGridFilterOperator("before", "is before", true),
   makeGridFilterOperator("onOrBefore", "is at or before", true),
   makeGridFilterOperator("isEmpty", "is empty"),
   makeGridFilterOperator("isNotEmpty", "is not empty"),
   makeGridFilterOperator("between", "is between", true),
   makeGridFilterOperator("notBetween", "is not between", true),
];

export default class DataGridUtils
{

   /*******************************************************************************
    **
    *******************************************************************************/
   public static makeRows = (results: QRecord[], tableMetaData: QTableMetaData): GridRowsProp[] =>
   {
      const fields = [...tableMetaData.fields.values()];
      const rows = [] as any[];
      let rowIndex = 0;
      results.forEach((record: QRecord) =>
      {
         const row: any = {};
         row.__rowIndex = rowIndex++;

         fields.forEach((field) =>
         {
            row[field.name] = ValueUtils.getDisplayValue(field, record, "query");
         });

         if(tableMetaData.exposedJoins)
         {
            for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
            {
               const join = tableMetaData.exposedJoins[i];

               if(join?.joinTable?.fields?.values())
               {
                  const fields = [...join.joinTable.fields.values()];
                  fields.forEach((field) =>
                  {
                     let fieldName = join.joinTable.name + "." + field.name;
                     row[fieldName] = ValueUtils.getDisplayValue(field, record, "query", fieldName);
                  });
               }
            }
         }

         if(!row["id"])
         {
            row["id"] = record.values.get(tableMetaData.primaryKeyField) ?? row[tableMetaData.primaryKeyField];
            if(row["id"] === null || row["id"] === undefined)
            {
               /////////////////////////////////////////////////////////////////////////////////////////
               // DataGrid gets very upset about a null or undefined here, so, try to make it happier //
               /////////////////////////////////////////////////////////////////////////////////////////
               row["id"] = "--";
            }
         }

         rows.push(row);
      });

      return (rows);
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   public static setupGridColumns = (tableMetaData: QTableMetaData, linkBase: string = "", metaData?: QInstance, columnSort: "bySection" | "alphabetical" = "alphabetical"): GridColDef[] =>
   {
      const columns = [] as GridColDef[];
      this.addColumnsForTable(tableMetaData, linkBase, columns, columnSort, null, null);

      if(metaData)
      {
         if(tableMetaData.exposedJoins)
         {
            for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
            {
               const join = tableMetaData.exposedJoins[i];
               let joinTableName = join.joinTable.name;
               if(metaData.tables.has(joinTableName) && metaData.tables.get(joinTableName).readPermission)
               {
                  let joinLinkBase = null;
                  joinLinkBase = metaData.getTablePath(join.joinTable);
                  if(joinLinkBase)
                  {
                     joinLinkBase += joinLinkBase.endsWith("/") ? "" : "/";
                  }

                  if(join?.joinTable?.fields?.values())
                  {
                     this.addColumnsForTable(join.joinTable, joinLinkBase, columns, columnSort, joinTableName + ".", join.label + ": ");
                  }
               }
            }
         }
      }

      return (columns);
   };


   /*******************************************************************************
    **
    *******************************************************************************/
   private static addColumnsForTable(tableMetaData: QTableMetaData, linkBase: string, columns: GridColDef[], columnSort: "bySection" | "alphabetical" = "alphabetical", namePrefix?: string, labelPrefix?: string)
   {
      const sortedKeys: string[] = [];

      ////////////////////////////////////////////////////////////////////////
      // this sorted by sections - e.g., manual sorting by the meta-data... //
      ////////////////////////////////////////////////////////////////////////
      if(columnSort === "bySection")
      {
         for (let i = 0; i < tableMetaData.sections.length; i++)
         {
            const section = tableMetaData.sections[i];
            if (!section.fieldNames)
            {
               continue;
            }

            for (let j = 0; j < section.fieldNames.length; j++)
            {
               sortedKeys.push(section.fieldNames[j]);
            }
         }
      }
      else // columnSort = "alphabetical"
      {
         ///////////////////////////
         // sort by labels... mmm //
         ///////////////////////////
         sortedKeys.push(...tableMetaData.fields.keys())
         sortedKeys.sort((a: string, b: string): number =>
         {
            return (tableMetaData.fields.get(a).label.localeCompare(tableMetaData.fields.get(b).label))
         })
      }

      sortedKeys.forEach((key) =>
      {
         const field = tableMetaData.fields.get(key);
         if(field.isHeavy)
         {
            if(field.type == QFieldType.BLOB)
            {
               ////////////////////////////////////////////////////////
               // assume we DO want heavy blobs - as download links. //
               ////////////////////////////////////////////////////////
            }
            else
            {
               ///////////////////////////////////////////////////
               // otherwise, skip heavy fields on query screen. //
               ///////////////////////////////////////////////////
               return;
            }
         }

         const column = this.makeColumnFromField(field, tableMetaData, namePrefix, labelPrefix);

         if(key === tableMetaData.primaryKeyField && linkBase && namePrefix == null)
         {
            columns.splice(0, 0, column);
         }
         else
         {
            columns.push(column);
         }

         if (key === tableMetaData.primaryKeyField && linkBase)
         {
            column.renderCell = (cellValues: any) => (
               <Link to={`${linkBase}${encodeURIComponent(cellValues.value)}`} onClick={(e) => e.stopPropagation()}>{cellValues.value}</Link>
            );
         }
      });
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static makeColumnFromField = (field: QFieldMetaData, tableMetaData: QTableMetaData, namePrefix?: string, labelPrefix?: string): GridColDef =>
   {
      let columnType = "string";
      let filterOperators: GridFilterOperator<any>[] = QGridStringOperators;

      if (field.possibleValueSourceName)
      {
         filterOperators = buildQGridPvsOperators(tableMetaData.name, field);
      }
      else
      {
         switch (field.type)
         {
            case QFieldType.DECIMAL:
            case QFieldType.INTEGER:
               columnType = "number";
               filterOperators = QGridNumericOperators;
               break;
            case QFieldType.DATE:
               columnType = "date";
               filterOperators = QGridDateOperators;
               break;
            case QFieldType.DATE_TIME:
               columnType = "dateTime";
               filterOperators = QGridDateTimeOperators;
               break;
            case QFieldType.BOOLEAN:
               columnType = "string"; // using boolean gives an odd 'no' for nulls.
               filterOperators = QGridBooleanOperators;
               break;
            case QFieldType.BLOB:
               filterOperators = QGridBlobOperators;
               break;
            default:
            // noop - leave as string
         }
      }

      let headerName = labelPrefix ? labelPrefix + field.label : field.label;
      let fieldName = namePrefix ? namePrefix + field.name : field.name;

      const column: GridColDef = {
         field: fieldName,
         type: columnType,
         headerName: headerName,
         width: DataGridUtils.getColumnWidthForField(field, tableMetaData),
         renderCell: null as any,
         filterOperators: filterOperators,
      };

      column.renderCell = (cellValues: any) => (
         (cellValues.value)
      );

      return (column);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static getColumnWidthForField = (field: QFieldMetaData, table?: QTableMetaData): number =>
   {
      if (field.hasAdornment(AdornmentType.SIZE))
      {
         const sizeAdornment = field.getAdornment(AdornmentType.SIZE);
         const width: string = sizeAdornment.getValue("width");
         const widths: Map<string, number> = new Map<string, number>([
            ["small", 100],
            ["medium", 200],
            ["medlarge", 300],
            ["large", 400],
            ["xlarge", 600]
         ]);
         if (widths.has(width))
         {
            return widths.get(width);
         }
         else
         {
            console.log("Unrecognized size.width adornment value: " + width);
         }
      }

      if(field.possibleValueSourceName)
      {
         return (200);
      }

      switch (field.type)
      {
         case QFieldType.DECIMAL:
         case QFieldType.INTEGER:

            if (table && field.name === table.primaryKeyField && field.label.length < 3)
            {
               return (75);
            }

            return (100);
         case QFieldType.DATE:
            return (100);
         case QFieldType.DATE_TIME:
            return (200);
         case QFieldType.BOOLEAN:
            return (75);
      }

      return (200);
   }
}

