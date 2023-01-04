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
import {QException} from "@kingsrook/qqq-frontend-core/lib/exceptions/QException";

/*******************************************************************************
 ** client wrapper of qqq backend
 **
 *******************************************************************************/
class Client
{
   private static qController: QController;

   private static handleException(exception: QException)
   {
      // todo - check for 401 and clear cookie et al & logout?
      console.log(`Caught Exception: ${JSON.stringify(exception)}`);
      throw (exception);
   }

   public static getInstance()
   {
      if (this.qController == null)
      {
         this.qController = new QController("", this.handleException);
      }

      return this.qController;
   }
}

export default Client;
