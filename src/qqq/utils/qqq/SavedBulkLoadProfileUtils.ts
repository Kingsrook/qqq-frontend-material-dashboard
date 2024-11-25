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

import {BulkLoadField, BulkLoadMapping, BulkLoadTableStructure, FileDescription} from "qqq/models/processes/BulkLoadModels";

type FieldMapping = { [name: string]: BulkLoadField }

/***************************************************************************
 ** Utillity methods for working with saved bulk load profiles.
 ***************************************************************************/
export class SavedBulkLoadProfileUtils
{

   /***************************************************************************
    **
    ***************************************************************************/
   private static diffFieldContents = (fileDescription: FileDescription, baseFieldsMap: FieldMapping, compareFieldsMap: FieldMapping, orderedFieldArray: BulkLoadField[]): string[] =>
   {
      const rs: string[] = [];

      for (let bulkLoadField of orderedFieldArray)
      {
         const fieldName = bulkLoadField.field.name;
         const compareField = compareFieldsMap[fieldName];
         const baseField = baseFieldsMap[fieldName];

         if (baseField)
         {
            if (baseField.valueType != compareField.valueType)
            {
               /////////////////////////////////////////////////////////////////
               // if we changed from a default value to a column, report that //
               /////////////////////////////////////////////////////////////////
               if (compareField.valueType == "column")
               {
                  const column = fileDescription.getColumnNames()[compareField.columnIndex];
                  rs.push(`Changed ${compareField.getQualifiedLabel()} from using a default value (${baseField.defaultValue}) to using a file column (${column})`);
               }
               else if (compareField.valueType == "defaultValue")
               {
                  const column = fileDescription.getColumnNames()[baseField.columnIndex];
                  rs.push(`Changed ${compareField.getQualifiedLabel()} from using a file column (${column}) to using a default value (${compareField.defaultValue})`);
               }
            }
            else if (baseField.valueType == compareField.valueType && baseField.valueType == "defaultValue")
            {
               //////////////////////////////////////////////////
               // if we changed the default value, report that //
               //////////////////////////////////////////////////
               if (baseField.defaultValue != compareField.defaultValue)
               {
                  rs.push(`Changed ${compareField.getQualifiedLabel()} default value from (${baseField.defaultValue}) to (${compareField.defaultValue})`);
               }
            }
            else if (baseField.valueType == compareField.valueType && baseField.valueType == "column")
            {
               ///////////////////////////////////////////
               // if we changed the column, report that //
               ///////////////////////////////////////////
               if (fileDescription.hasHeaderRow)
               {
                  if (baseField.headerName != compareField.headerName)
                  {
                     const baseColumn = fileDescription.getColumnNames()[baseField.columnIndex];
                     const compareColumn = fileDescription.getColumnNames()[compareField.columnIndex];
                     rs.push(`Changed ${compareField.getQualifiedLabel()} file column from (${baseColumn}) to (${compareColumn})`);
                  }
               }
               else
               {
                  if (baseField.columnIndex != compareField.columnIndex)
                  {
                     const baseColumn = fileDescription.getColumnNames()[baseField.columnIndex];
                     const compareColumn = fileDescription.getColumnNames()[compareField.columnIndex];
                     rs.push(`Changed ${compareField.getQualifiedLabel()} file column from (${baseColumn}) to (${compareColumn})`);
                  }
               }

               /////////////////////////////////////////////////////////////////////////////////////////////////////
               // if the do-value-mapping field changed, report that (note, only if was and still is column-type) //
               /////////////////////////////////////////////////////////////////////////////////////////////////////
               if ((baseField.doValueMapping == true) != (compareField.doValueMapping == true))
               {
                  rs.push(`Changed ${compareField.getQualifiedLabel()} to ${compareField.doValueMapping ? "" : "not"} map values`);
               }
            }
         }
      }

      return (rs);
   };

   /***************************************************************************
    **
    ***************************************************************************/
   private static diffFieldSets = (baseFieldsMap: FieldMapping, compareFieldsMap: FieldMapping, messagePrefix: string, orderedFieldArray: BulkLoadField[]): string[] =>
   {
      const fieldLabels: string[] = [];

      for (let bulkLoadField of orderedFieldArray)
      {
         const fieldName = bulkLoadField.field.name;
         const compareField = compareFieldsMap[fieldName];

         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // else - we're not checking for changes to individual fields - rather - we're just checking if fields were added or removed. //
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if (!baseFieldsMap[fieldName])
         {
            fieldLabels.push(compareField.getQualifiedLabel());
         }
      }

      if (fieldLabels.length)
      {
         const s = fieldLabels.length == 1 ? "" : "s";
         return ([`${messagePrefix} mapping${s} for ${fieldLabels.length} field${s}: ${fieldLabels.join(", ")}`]);
      }
      else
      {
         return ([]);
      }
   };


   /***************************************************************************
    **
    ***************************************************************************/
   private static getOrderedActiveFields(mapping: BulkLoadMapping): BulkLoadField[]
   {
      return [...(mapping.requiredFields ?? []), ...(mapping.additionalFields ?? [])]
   }


   /***************************************************************************
    **
    ***************************************************************************/
   private static extractUsedFieldMapFromMapping(mapping: BulkLoadMapping): FieldMapping
   {
      let rs: { [name: string]: BulkLoadField } = {};
      for (let bulkLoadField of this.getOrderedActiveFields(mapping))
      {
         rs[bulkLoadField.getQualifiedNameWithWideSuffix()] = bulkLoadField;
      }
      return (rs);
   }


   /***************************************************************************
    **
    ***************************************************************************/
   public static diffBulkLoadMappings = (tableStructure: BulkLoadTableStructure, fileDescription: FileDescription, baseMapping: BulkLoadMapping, activeMapping: BulkLoadMapping): string[] =>
   {
      const diffs: string[] = [];

      const baseFieldsMap = this.extractUsedFieldMapFromMapping(baseMapping);
      const activeFieldsMap = this.extractUsedFieldMapFromMapping(activeMapping);

      const orderedBaseFields = this.getOrderedActiveFields(baseMapping);
      const orderedActiveFields = this.getOrderedActiveFields(activeMapping);

      ////////////////////////
      // header-level diffs //
      ////////////////////////
      if ((baseMapping.hasHeaderRow == true) != (activeMapping.hasHeaderRow == true))
      {
         diffs.push(`Changed does the file have a header row? from ${baseMapping.hasHeaderRow ? "Yes" : "No"} to ${activeMapping.hasHeaderRow ? "Yes" : "No"}`);
      }

      if (baseMapping.layout != activeMapping.layout)
      {
         const format = (layout: string) => (layout ?? " ").substring(0, 1) + (layout ?? " ").substring(1).toLowerCase();
         diffs.push(`Changed layout from ${format(baseMapping.layout)} to ${format(activeMapping.layout)}`);
      }

      ///////////////////////
      // field-level diffs //
      ///////////////////////
      // todo - keep sorted like screen is by ... idk, loop over fields in mapping first
      diffs.push(...this.diffFieldSets(baseFieldsMap, activeFieldsMap, "Added", orderedActiveFields));
      diffs.push(...this.diffFieldSets(activeFieldsMap, baseFieldsMap, "Removed", orderedBaseFields));
      diffs.push(...this.diffFieldContents(fileDescription, baseFieldsMap, activeFieldsMap, orderedActiveFields));

      for (let bulkLoadField of orderedActiveFields)
      {
         try
         {
            const fieldName = bulkLoadField.field.name;

            if (JSON.stringify(baseMapping.valueMappings[fieldName] ?? []) != JSON.stringify(activeMapping.valueMappings[fieldName] ?? []))
            {
               diffs.push(`Changed value mapping for ${bulkLoadField.getQualifiedLabel()}`)
            }

            if (baseMapping.valueMappings[fieldName] && activeMapping.valueMappings[fieldName])
            {
               // todo - finish this - better version than just the JSON diff!
            }
         }
         catch(e)
         {
            console.log(`Error diffing profiles: ${e}`);
         }
      }

      return diffs;
   };

}