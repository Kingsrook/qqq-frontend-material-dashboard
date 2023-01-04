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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";

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
}

export default TableUtils;
