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


import java.nio.charset.StandardCharsets;
import java.util.List;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


/*******************************************************************************
 ** javalin handler for returning content from a "fixtures" file
 *******************************************************************************/
public class RouteFromFileHandler implements Handler
{
   Logger LOG = LogManager.getLogger(RouteFromFileHandler.class);

   private final String           route;
   private final String           filePath;
   private final QSeleniumJavalin qSeleniumJavalin;



   /*******************************************************************************
    ** Constructor
    **
    *******************************************************************************/
   public RouteFromFileHandler(QSeleniumJavalin qSeleniumJavalin, String route, String filePath)
   {
      this.qSeleniumJavalin = qSeleniumJavalin;
      this.route = route;
      this.filePath = filePath;
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void handle(Context context) throws Exception
   {
      try
      {
         qSeleniumJavalin.routeFilesServed.add(this.route);
         LOG.debug("Serving route [" + this.route + "] via file [" + this.filePath + "]");
         List<String> lines = IOUtils.readLines(getClass().getResourceAsStream("/fixtures/" + this.filePath), StandardCharsets.UTF_8);
         context.result(String.join("\n", lines));
      }
      catch(Exception e)
      {
         throw new IllegalStateException("Error reading file [" + this.filePath + "]");
      }
   }
}
