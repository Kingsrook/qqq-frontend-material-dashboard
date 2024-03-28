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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QueryJoin} from "@kingsrook/qqq-frontend-core/lib/model/query/QueryJoin";

/*******************************************************************************
 ** Utility class for working with QQQ Tables
 **
 *******************************************************************************/
class TableUtils
{
   /*******************************************************************************
    **
    *******************************************************************************/
   public static getSectionsForRecordSidebar(tableMetaData: QTableMetaData, allowedKeys: any = null): QTableSection[]
   {
      if (tableMetaData.sections)
      {
         if (allowedKeys)
         {
            const allowedKeySet = new Set<string>();
            allowedKeys.forEach((k: string) => allowedKeySet.add(k));

            const allowedSections: QTableSection[] = [];

            for (let i = 0; i < tableMetaData.sections.length; i++)
            {
               const section = tableMetaData.sections[i];
               if (section.fieldNames)
               {
                  for (let j = 0; j < section.fieldNames.length; j++)
                  {
                     if (allowedKeySet.has(section.fieldNames[j]))
                     {
                        allowedSections.push(section);
                        break;
                     }
                  }
               }
            }

            return (allowedSections);
         }
         else
         {
            return (tableMetaData.sections);
         }
      }
      else
      {
         let fieldNames = [...tableMetaData.fields.keys()];
         if (allowedKeys)
         {
            fieldNames = [];
            for (const fieldName in tableMetaData.fields.keys())
            {
               if (allowedKeys[fieldName])
               {
                  fieldNames.push(fieldName);
               }
            }
         }
         return ([new QTableSection({
            iconName: "description", label: "All Fields", name: "allFields", fieldNames: [...fieldNames],
         })]);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static getFieldAndTable(tableMetaData: QTableMetaData, fieldName: string): [QFieldMetaData, QTableMetaData]
   {
      if (fieldName.indexOf(".") > -1)
      {
         const nameParts = fieldName.split(".", 2);
         for (let i = 0; i < tableMetaData?.exposedJoins?.length; i++)
         {
            const join = tableMetaData?.exposedJoins[i];
            if (join?.joinTable.name == nameParts[0])
            {
               return ([join.joinTable.fields.get(nameParts[1]), join.joinTable]);
            }
         }
      }
      else
      {
         return ([tableMetaData.fields.get(fieldName), tableMetaData]);
      }

      return [null, null];
   }


   /*******************************************************************************
    ** for a field that might be from a join table, get its label - either the field's
    ** label, if it's from "this" table - or the table's label: field's label, if it's
    ** from a join table.
    *******************************************************************************/
   public static getFieldFullLabel(tableMetaData: QTableMetaData, fieldName: string): string
   {
      try
      {
         const [field, fieldTable] = TableUtils.getFieldAndTable(tableMetaData, fieldName);
         if (fieldTable.name == tableMetaData.name)
         {
            return (field.label);
         }
         return `${fieldTable.label}: ${field.label}`;
      }
      catch (e)
      {
         console.log(`Error getting full field label for ${fieldName} in table ${tableMetaData?.name}: ${e}`);
         return fieldName;
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public static getQueryJoins(tableMetaData: QTableMetaData, visibleJoinTables: Set<string>): QueryJoin[]
   {
      const queryJoins = [];
      for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
      {
         const join = tableMetaData.exposedJoins[i];
         if (visibleJoinTables.has(join.joinTable.name))
         {
            let joinName = null;
            if (join.joinPath && join.joinPath.length == 1 && join.joinPath[0].name)
            {
               joinName = join.joinPath[0].name;
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // todo - what about a join with a longer path?  it would be nice to pass such joinNames through there too, //
            // but what, that would actually be multiple queryJoins?  needs a fair amount of thought.                   //
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            queryJoins.push(new QueryJoin(join.joinTable.name, true, "LEFT", null, null, joinName));
         }
      }

      return queryJoins;
   }


}

export default TableUtils;
