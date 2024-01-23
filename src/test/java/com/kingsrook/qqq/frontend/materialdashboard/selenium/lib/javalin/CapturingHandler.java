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
import io.javalin.http.Handler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


/*******************************************************************************
 ** javalin handler that captures the context, for later review, e.g., of the
 ** query string or posted body
 *******************************************************************************/
public class CapturingHandler implements Handler
{
   Logger LOG = LogManager.getLogger(CapturingHandler.class);

   private final QSeleniumJavalin qSeleniumJavalin;



   /*******************************************************************************
    ** Constructor
    **
    *******************************************************************************/
   public CapturingHandler(QSeleniumJavalin qSeleniumJavalin)
   {
      this.qSeleniumJavalin = qSeleniumJavalin;
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void handle(Context context) throws Exception
   {
      if(qSeleniumJavalin.capturing)
      {
         LOG.info("Capturing request for path [" + context.path() + "]");
         qSeleniumJavalin.captured.add(new CapturedContext(context));
      }
      else
      {
         LOG.trace("Not capturing request for path [" + context.path() + "]");
      }
   }
}
