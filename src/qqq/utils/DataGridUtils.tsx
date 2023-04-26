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
import {getGridDateOperators, GridColDef, GridRowsProp} from "@mui/x-data-grid-pro";
import {GridFilterOperator} from "@mui/x-data-grid/models/gridFilterOperator";
import React from "react";
import {Link} from "react-router-dom";
import {buildQGridPvsOperators, QGridBooleanOperators, QGridNumericOperators, QGridStringOperators} from "qqq/pages/records/query/GridFilterOperators";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

export default class DataGridUtils
{

   /*******************************************************************************
    **
    *******************************************************************************/
   public static makeRows = (results: QRecord[], tableMetaData: QTableMetaData): GridRowsProp[] =>
   {
      const fields = [ ...tableMetaData.fields.values() ];
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

               const fields = [ ...join.joinTable.fields.values() ];
               fields.forEach((field) =>
               {
                  let fieldName = join.joinTable.name + "." + field.name;
                  row[fieldName] = ValueUtils.getDisplayValue(field, record, "query", fieldName);
               });
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

      if(tableMetaData.exposedJoins)
      {
         for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
         {
            const join = tableMetaData.exposedJoins[i];

            let joinLinkBase = null;
            if(metaData)
            {
               joinLinkBase = metaData.getTablePath(join.joinTable);
               joinLinkBase += joinLinkBase.endsWith("/") ? "" : "/";
            }

            this.addColumnsForTable(join.joinTable, joinLinkBase, columns, columnSort, join.joinTable.name + ".", join.label + ": ");
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
         sortedKeys.sort((a: string, b: string): number =>
         {
            return (tableMetaData.fields.get(a).label.localeCompare(tableMetaData.fields.get(b).label))
         })
      }

      sortedKeys.forEach((key) =>
      {
         const field = tableMetaData.fields.get(key);
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
               <Link to={`${linkBase}${cellValues.value}`} onClick={(e) => e.stopPropagation()}>{cellValues.value}</Link>
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
      let columnWidth = 200;
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
               columnWidth = 100;

               if (field.name === tableMetaData.primaryKeyField && field.label.length < 3)
               {
                  columnWidth = 75;
               }

               filterOperators = QGridNumericOperators;
               break;
            case QFieldType.DATE:
               columnType = "date";
               columnWidth = 100;
               filterOperators = getGridDateOperators();
               break;
            case QFieldType.DATE_TIME:
               columnType = "dateTime";
               columnWidth = 200;
               filterOperators = getGridDateOperators(true);
               break;
            case QFieldType.BOOLEAN:
               columnType = "string"; // using boolean gives an odd 'no' for nulls.
               columnWidth = 75;
               filterOperators = QGridBooleanOperators;
               break;
            default:
            // noop - leave as string
         }
      }

      if (field.hasAdornment(AdornmentType.SIZE))
      {
         const sizeAdornment = field.getAdornment(AdornmentType.SIZE);
         const width: string = sizeAdornment.getValue("width");
         const widths: Map<string, number> = new Map<string, number>([
            ["small", 100],
            ["medium", 200],
            ["large", 400],
            ["xlarge", 600]
         ]);
         if (widths.has(width))
         {
            columnWidth = widths.get(width);
         }
         else
         {
            console.log("Unrecognized size.width adornment value: " + width);
         }
      }

      let headerName = labelPrefix ? labelPrefix + field.label : field.label;
      let fieldName = namePrefix ? namePrefix + field.name : field.name;

      const column = {
         field: fieldName,
         type: columnType,
         headerName: headerName,
         width: columnWidth,
         renderCell: null as any,
         filterOperators: filterOperators,
      };

      column.renderCell = (cellValues: any) => (
         (cellValues.value)
      );

      return (column);
   }
}

