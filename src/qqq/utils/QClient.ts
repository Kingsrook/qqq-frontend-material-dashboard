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

import { QFieldMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import { QQueryFilter } from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";

/*******************************************************************************
 ** client wrapper of qqq backend
 **
 *******************************************************************************/
class QClient
{
   private static qController: QController;

   private static getInstance()
   {
      if (this.qController == null)
      {
         this.qController = new QController("");
      }

      return this.qController;
   }

   public static loadTableMetaData(tableName: string)
   {
      return this.getInstance().loadTableMetaData(tableName);
   }

   public static loadMetaData()
   {
      return this.getInstance().loadMetaData();
   }

   public static query(tableName: string, filter: QQueryFilter, limit: number, skip: number)
   {
      return this.getInstance()
         .query(tableName, filter, limit, skip)
         .catch((error) =>
         {
            throw error;
         });
   }

   public static count(tableName: string, filter: QQueryFilter)
   {
      return this.getInstance().count(tableName, filter);
   }
}

export default QClient;
