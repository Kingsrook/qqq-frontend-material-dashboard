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

import {QFieldType} from "@qrunio/qqq-frontend-core/lib/model/metaData/QFieldType";


/*******************************************************************************
 ** put a unique key value in all the pivot table group-by and value objects,
 ** to help react rendering be sane.
 *******************************************************************************/
export class PivotObjectKey
{
   private static value = new Date().getTime();

   static next(): number
   {
      return PivotObjectKey.value++;
   }
}


/*******************************************************************************
 ** Full definition of pivot table
 *******************************************************************************/
export class PivotTableDefinition
{
   rows: PivotTableGroupBy[];
   columns: PivotTableGroupBy[];
   values: PivotTableValue[];
}


/*******************************************************************************
 ** A field that the pivot table is grouped by, either as a row or column
 *******************************************************************************/
export class PivotTableGroupBy
{
   fieldName: string;
   key: number;

   constructor()
   {
      this.key = PivotObjectKey.next();
   }
}


/*******************************************************************************
 ** A field & function that serves as the computed values in the pivot table
 *******************************************************************************/
export class PivotTableValue
{
   fieldName: string;
   function: PivotTableFunction;

   key: number;

   constructor()
   {
      this.key = PivotObjectKey.next();
   }
}


/*******************************************************************************
 ** Functions that can be applied to pivot table values
 *******************************************************************************/
export enum PivotTableFunction
{
   SUM = "SUM",
   COUNT = "COUNT",
   AVERAGE = "AVERAGE",
   MAX = "MAX",
   MIN = "MIN",
   PRODUCT = "PRODUCT",

   ///////////////////////////////////////////////////////////////////////////////
   // i don't think we have a useful version of count-nums --unless we allowed  //
   // it on string fields, and counted if they looked like numbers? is that     //
   // what we should do? ... leave here as zombie in case that request comes in //
   ///////////////////////////////////////////////////////////////////////////////
   // COUNT_NUMS = "COUNT_NUMS",

   STD_DEV = "STD_DEV",
   STD_DEVP = "STD_DEVP",
   VAR = "VAR",
   VARP = "VARP",
}

const allFunctions = [
   PivotTableFunction.SUM,
   PivotTableFunction.COUNT,
   PivotTableFunction.AVERAGE,
   PivotTableFunction.MAX,
   PivotTableFunction.MIN,
   PivotTableFunction.PRODUCT,
   // PivotTableFunction.COUNT_NUMS,
   PivotTableFunction.STD_DEV,
   PivotTableFunction.STD_DEVP,
   PivotTableFunction.VAR,
   PivotTableFunction.VARP
];

const onlyCount = [PivotTableFunction.COUNT];

const functionsForDates = [PivotTableFunction.COUNT, PivotTableFunction.AVERAGE, PivotTableFunction.MAX, PivotTableFunction.MIN];

export const functionsPerFieldType: { [type: string]: PivotTableFunction[] } = {};
functionsPerFieldType[QFieldType.STRING] = onlyCount;
functionsPerFieldType[QFieldType.BOOLEAN] = onlyCount;
functionsPerFieldType[QFieldType.BLOB] = onlyCount;
functionsPerFieldType[QFieldType.HTML] = onlyCount;
functionsPerFieldType[QFieldType.PASSWORD] = onlyCount;
functionsPerFieldType[QFieldType.TEXT] = onlyCount;
functionsPerFieldType[QFieldType.TIME] = onlyCount;

functionsPerFieldType[QFieldType.INTEGER] = allFunctions;
functionsPerFieldType[QFieldType.DECIMAL] = allFunctions;
// functionsPerFieldType[QFieldType.LONG] = allFunctions;

functionsPerFieldType[QFieldType.DATE] = functionsForDates;
functionsPerFieldType[QFieldType.DATE_TIME] = functionsForDates;


//////////////////////////////////////
// labels for pivot table functions //
//////////////////////////////////////
export const pivotTableFunctionLabels =
   {
      "SUM": "Sum",
      "COUNT": "Count",
      "AVERAGE": "Average",
      "MAX": "Max",
      "MIN": "Min",
      "PRODUCT": "Product",
      // "COUNT_NUMS": "Count Numbers",
      "STD_DEV": "StdDev",
      "STD_DEVP": "StdDevp",
      "VAR": "Var",
      "VARP": "Varp"
   };
