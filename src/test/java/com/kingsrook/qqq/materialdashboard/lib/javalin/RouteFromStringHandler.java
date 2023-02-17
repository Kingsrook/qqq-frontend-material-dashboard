package com.kingsrook.qqq.materialdashboard.lib.javalin;


import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.apache.commons.lang3.tuple.Pair;
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
   public RouteFromStringHandler(QSeleniumJavalin qSeleniumJavalin, Pair<String, String> routeToStringPath)
   {
      this.qSeleniumJavalin = qSeleniumJavalin;
      this.route = routeToStringPath.getKey();
      this.responseString = routeToStringPath.getValue();
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
