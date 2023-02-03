package com.kingsrook.qqq.materialdashbaord.lib.javalin;


import java.nio.charset.StandardCharsets;
import java.util.List;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.tuple.Pair;


/*******************************************************************************
 ** javalin handler for returning content from a "fixtures" file
 *******************************************************************************/
public class RouteFromFileHandler implements Handler
{
   private final String           route;
   private final String           filePath;
   private final QSeleniumJavalin qSeleniumJavalin;



   /*******************************************************************************
    ** Constructor
    **
    *******************************************************************************/
   public RouteFromFileHandler(QSeleniumJavalin qSeleniumJavalin, Pair<String, String> routeToFilePath)
   {
      this.qSeleniumJavalin = qSeleniumJavalin;
      this.route = routeToFilePath.getKey();
      this.filePath = routeToFilePath.getValue();
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
         System.out.println("Serving route [" + this.route + "] via file [" + this.filePath + "]");
         List<String> lines = IOUtils.readLines(getClass().getResourceAsStream("/fixtures/" + this.filePath), StandardCharsets.UTF_8);
         context.result(String.join("\n", lines));
      }
      catch(Exception e)
      {
         throw new IllegalStateException("Error reading file [" + this.filePath + "]");
      }
   }
}
