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

package com.kingsrook.qqq.frontend.materialdashboard.selenium.lib.javalin;


import io.javalin.http.Context;


/*******************************************************************************
 ** data copied from a javalin context, e.g., for inspection by a test
 *******************************************************************************/
public class CapturedContext
{
   private String method;
   private String path;
   private String body;



   /*******************************************************************************
    **
    *******************************************************************************/
   public CapturedContext(Context context)
   {
      path = context.path();
      method = context.method().name();
      body = context.body();
   }



   /*******************************************************************************
    ** Getter for method
    **
    *******************************************************************************/
   public String getMethod()
   {
      return method;
   }



   /*******************************************************************************
    ** Setter for method
    **
    *******************************************************************************/
   public void setMethod(String method)
   {
      this.method = method;
   }



   /*******************************************************************************
    ** Getter for path
    **
    *******************************************************************************/
   public String getPath()
   {
      return path;
   }



   /*******************************************************************************
    ** Setter for path
    **
    *******************************************************************************/
   public void setPath(String path)
   {
      this.path = path;
   }



   /*******************************************************************************
    ** Getter for body
    **
    *******************************************************************************/
   public String getBody()
   {
      return body;
   }



   /*******************************************************************************
    ** Setter for body
    **
    *******************************************************************************/
   public void setBody(String body)
   {
      this.body = body;
   }
}
