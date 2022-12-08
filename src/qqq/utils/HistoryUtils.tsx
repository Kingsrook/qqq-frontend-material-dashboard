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

export interface QHistoryEntry
{
   iconName: string;
   label: string;
   path: string;
   date?: Date;
}

export interface QHistory
{
   entries: QHistoryEntry[];
}


export default class HistoryUtils
{
   private static LS_KEY = "qqq.history";


   /*******************************************************************************
    ** Push an entry into the history
    *******************************************************************************/
   public static push = (entry: QHistoryEntry) =>
   {
      const history = HistoryUtils.get();

      if(!entry.date)
      {
         entry.date = new Date()
      }

      for (let i = 0; i < history.entries.length; i++)
      {
         if(history.entries[i].path == entry.path)
         {
            history.entries.splice(i, 1);
         }
      }

      history.entries.push(entry);

      if(history.entries.length > 20)
      {
         history.entries.splice(0, history.entries.length - 3);
      }

      localStorage.setItem(HistoryUtils.LS_KEY, JSON.stringify(history));
   };



   /*******************************************************************************
    ** Get the history
    *******************************************************************************/
   public static get = (): QHistory =>
   {
      const existingJSON = localStorage.getItem(HistoryUtils.LS_KEY);
      const history: QHistory = existingJSON ? JSON.parse(existingJSON) : {}
      if(!history.entries)
      {
         history.entries = [];
      }

      return (history);
   };


   /*******************************************************************************
    ** make sure a specific path isn't in the history (e.g., after a 404)
    *******************************************************************************/
   public static ensurePathNotInHistory(path: string)
   {
      const history = HistoryUtils.get();

      for (let i = 0; i < history.entries.length; i++)
      {
         if(history.entries[i].path == path)
         {
            history.entries.splice(i, 1);
         }
      }

      localStorage.setItem(HistoryUtils.LS_KEY, JSON.stringify(history));
   }
}

