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
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {getGridDateOperators, GridColDef, GridRowsProp} from "@mui/x-data-grid-pro";
import {GridFilterOperator} from "@mui/x-data-grid/models/gridFilterOperator";
import {Link} from "react-router-dom";
import {buildQGridPvsOperators, QGridBooleanOperators, QGridNumericOperators, QGridStringOperators} from "qqq/pages/records/query/GridFilterOperators";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

export default class DataGridUtils
{

   /*******************************************************************************
    **
    *******************************************************************************/
   public static makeRows = (results: QRecord[], tableMetaData: QTableMetaData): {rows: GridRowsProp[], columnsToRender: any} =>
   {
      const fields = [ ...tableMetaData.fields.values() ];
      const rows = [] as any[];
      const columnsToRender = {} as any;
      results.forEach((record: QRecord) =>
      {
         const row: any = {};
         fields.forEach((field) =>
         {
            const value = ValueUtils.getDisplayValue(field, record, "query");
            if (typeof value !== "string")
            {
               columnsToRender[field.name] = true;
            }
            row[field.name] = value;
         });

         if(!row["id"])
         {
            row["id"] = record.values.get(tableMetaData.primaryKeyField) ?? row[tableMetaData.primaryKeyField];
         }

         rows.push(row);
      });

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // do this secondary check for columnsToRender - in case we didn't have any rows above, and our check for string isn't enough. //
      // ... shouldn't this be just based on the field definition anyway... ?  plus adornments?                                      //
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      fields.forEach((field) =>
      {
         if(field.possibleValueSourceName)
         {
            columnsToRender[field.name] = true;
         }
      });

      return ({rows, columnsToRender});
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   public static setupGridColumns = (tableMetaData: QTableMetaData, columnsToRender: any, linkBase: string = ""): GridColDef[] =>
   {
      const columns = [] as GridColDef[];
      const sortedKeys: string[] = [];

      for (let i = 0; i < tableMetaData.sections.length; i++)
      {
         const section = tableMetaData.sections[i];
         if(!section.fieldNames)
         {
            continue;
         }

         for (let j = 0; j < section.fieldNames.length; j++)
         {
            sortedKeys.push(section.fieldNames[j]);
         }
      }

      sortedKeys.forEach((key) =>
      {
         const field = tableMetaData.fields.get(key);
         const column = this.makeColumnFromField(field, tableMetaData, columnsToRender);

         if (key === tableMetaData.primaryKeyField && linkBase)
         {
            columns.splice(0, 0, column);
            column.renderCell = (cellValues: any) => (
               <Link to={`${linkBase}${cellValues.value}`}>{cellValues.value}</Link>
            );
         }
         else
         {
            columns.push(column);
         }
      });

      return (columns);
   };



   /*******************************************************************************
    **
    *******************************************************************************/
   public static makeColumnFromField = (field: QFieldMetaData, tableMetaData: QTableMetaData, columnsToRender: any): GridColDef =>
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

      const column = {
         field: field.name,
         type: columnType,
         headerName: field.label,
         width: columnWidth,
         renderCell: null as any,
         filterOperators: filterOperators,
      };

      /////////////////////////////////////////////////////////////////////////////////////////
      // looks like, maybe we can just always render all columns, and remove this parameter? //
      /////////////////////////////////////////////////////////////////////////////////////////
      if (columnsToRender == null || columnsToRender[field.name])
      {
         column.renderCell = (cellValues: any) => (
            (cellValues.value)
         );
      }

      return (column);
   }
}

