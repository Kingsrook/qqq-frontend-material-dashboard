package com.kingsrook.qqq.materialdashboard.lib.javalin;


import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


/*******************************************************************************
 ** javalin handler for returning a static string for a route
 *******************************************************************************/
public class RouteFromStringHandler implements Handler
{
   Logger LOG = LogManager.getLogger(RouteFromStringHandler.class);

   private final String           route;
   private final String           responseString;
   private final QSeleniumJavalin qSeleniumJavalin;



   /*******************************************************************************
    ** Constructor
    **
    *******************************************************************************/
   public RouteFromStringHandler(QSeleniumJavalin qSeleniumJavalin, String route, String responseString)
   {
      this.qSeleniumJavalin = qSeleniumJavalin;
      this.route = route;
      this.responseString = responseString;
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void handle(Context context)
   {
      qSeleniumJavalin.routeFilesServed.add(this.route);
      LOG.debug("Serving route [" + this.route + "] via static String");
      context.result(this.responseString);
   }
}
