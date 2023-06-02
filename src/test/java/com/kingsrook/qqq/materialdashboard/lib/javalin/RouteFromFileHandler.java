package com.kingsrook.qqq.materialdashboard.lib.javalin;


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
