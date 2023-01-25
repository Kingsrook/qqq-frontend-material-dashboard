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


export default class DeveloperModeUtils
{

   public static revToColor = (fieldName: string, recordId: string | number, rev: number): string =>
   {
      let hash = 0;
      let idFactor = 1;
      try
      {
         idFactor = Number(recordId);
      }
      catch (e)
      {
      }
      const string = `${fieldName} ${90210 * idFactor * rev}`;
      for (let i = 0; i < string.length; i += 1)
      {
         hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = "#";
      for (let i = 0; i < 3; i += 1)
      {
         const value = (hash >> (i * 8)) & 0xff;
         color += `00${value.toString(16)}`.slice(-2);
      }
      return color;
   };

}