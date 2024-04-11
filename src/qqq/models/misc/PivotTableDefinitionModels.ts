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


/*******************************************************************************
 ** put a unique key value in all the pivot table group-by and value objects,
 ** to help react rendering be sane.
 *******************************************************************************/
export class PivotObjectKey
{
   private static value = new Date().getTime();

   static next(): number
   {
      return PivotObjectKey.value++
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
      this.key = PivotObjectKey.next()
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
      this.key = PivotObjectKey.next()
   }
}


/*******************************************************************************
 ** Functions that can be appplied to pivot table values
 *******************************************************************************/
export enum PivotTableFunction
{
   AVERAGE = "AVERAGE",
   COUNT = "COUNT",
   COUNT_NUMS = "COUNT_NUMS",
   MAX = "MAX",
   MIN = "MIN",
   PRODUCT = "PRODUCT",
   STD_DEV = "STD_DEV",
   STD_DEVP = "STD_DEVP",
   SUM = "SUM",
   VAR = "VAR",
   VARP = "VARP",
}

//////////////////////////////////////
// labels for pivot table functions //
//////////////////////////////////////
export const pivotTableFunctionLabels =
   {
      "AVERAGE": "Average",
      "COUNT": "Count Values (COUNTA)",
      "COUNT_NUMS": "Count Numbers (COUNT)",
      "MAX": "Max",
      "MIN": "Min",
      "PRODUCT": "Product",
      "STD_DEV": "StdDev",
      "STD_DEVP": "StdDevp",
      "SUM": "Sum",
      "VAR": "Var",
      "VARP": "Varp"
   };
