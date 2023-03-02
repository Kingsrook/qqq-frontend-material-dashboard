package com.kingsrook.qqq.materialdashboard.lib.javalin;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.kingsrook.qqq.materialdashboard.lib.QSeleniumLib;
import io.javalin.Javalin;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.HttpConnectionFactory;
import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.post;
import static org.junit.jupiter.api.Assertions.fail;


/*******************************************************************************
 ** Javalin server manager for use with by Selenium tests!!
 *******************************************************************************/
public class QSeleniumJavalin
{
   Logger LOG = LogManager.getLogger(QSeleniumJavalin.class);

   private long WAIT_SECONDS = 10;

   private List<Pair<String, String>> routesToFiles   = new ArrayList<>();
   private List<Pair<String, String>> routesToStrings = new ArrayList<>();

   private Javalin javalin;

   ////////////////////////////////////////////////////////////////////////////////////////
   // multiple javalin threads will be running and hitting these structures in parallel, //
   // so it's critical to wrap collections in synchronized versions!!                    //
   ////////////////////////////////////////////////////////////////////////////////////////
   List<String> routeFilesServed = Collections.synchronizedList(new ArrayList<>());
   List<String> pathsThat404ed   = Collections.synchronizedList(new ArrayList<>());

   boolean               capturing = false;
   List<CapturedContext> captured  = Collections.synchronizedList(new ArrayList<>());



   /*******************************************************************************
    ** Constructor
    **
    *******************************************************************************/
   public QSeleniumJavalin()
   {
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void clearRoutes()
   {
      this.routesToFiles.clear();
      this.routesToStrings.clear();
   }



   /*******************************************************************************
    ** Fluent setter for routeToFile
    **
    *******************************************************************************/
   public QSeleniumJavalin withRouteToFile(String path, String fixtureFilePath)
   {
      if(this.routesToFiles == null)
      {
         this.routesToFiles = new ArrayList<>();
      }
      this.routesToFiles.add(Pair.of(path, fixtureFilePath));
      return (this);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public QSeleniumJavalin withRouteToString(String path, String responseString)
   {
      if(this.routesToStrings == null)
      {
         this.routesToStrings = new ArrayList<>();
      }
      this.routesToStrings.add(Pair.of(path, responseString));
      return (this);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public QSeleniumJavalin start()
   {
      javalin = Javalin.create().start(8001);

      if(routesToFiles != null)
      {
         javalin.routes(() ->
         {
            for(Pair<String, String> routeToFile : routesToFiles)
            {
               LOG.debug("Setting up route for [" + routeToFile.getKey() + "] => [" + routeToFile.getValue() + "]");
               get(routeToFile.getKey(), new RouteFromFileHandler(this, routeToFile));
               post(routeToFile.getKey(), new RouteFromFileHandler(this, routeToFile));
            }
         });
      }

      if(routesToStrings != null)
      {
         javalin.routes(() ->
         {
            for(Pair<String, String> routeToString : routesToStrings)
            {
               LOG.debug("Setting up route for [" + routeToString.getKey() + "] => [" + routeToString.getValue() + "]");
               get(routeToString.getKey(), new RouteFromStringHandler(this, routeToString));
               post(routeToString.getKey(), new RouteFromStringHandler(this, routeToString));
            }
         });
      }

      javalin.before(new CapturingHandler(this));

      javalin.error(404, context -> {
         LOG.warn("Returning 404 for [" + context.method() + " " + context.path() + "]");
         pathsThat404ed.add(context.path());
      });

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // to accept "large" access tokens in Authorization: Bearer <token> headers (e.g., with 100s of permissions), //
      // we need a larger size allowed for HTTP headers (javalin/jetty default is 8K)                               //
      // making this too large can waste resources and open one up to various DOS attacks, supposedly.              //
      // (Note, this must happen after the javalin service.start call)                                              //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      for(Connector connector : javalin.jettyServer().server().getConnectors())
      {
         connector.getConnectionFactory(HttpConnectionFactory.class).getHttpConfiguration().setRequestHeaderSize(65535);
      }

      return (this);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void stop()
   {
      if(javalin != null)
      {
         javalin.stop();
         javalin = null;
      }
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void restart()
   {
      stop();
      start();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void report()
   {
      LOG.info("Paths that 404'ed:");
      pathsThat404ed.forEach(s -> LOG.info(" - " + s));

      LOG.info("Routes served as static files:");
      routeFilesServed.forEach(s -> LOG.info(" - " + s));
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void beginCapture()
   {
      LOG.info("Beginning to capture requests now");
      capturing = true;
      captured.clear();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void endCapture()
   {
      LOG.info("Ending capturing of requests now");
      capturing = false;
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public List<CapturedContext> getCaptured()
   {
      return (captured);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public CapturedContext waitForCapturedPath(String path)
   {
      LOG.debug("Waiting for captured request for path [" + path + "]");
      long start = System.currentTimeMillis();

      do
      {
         // LOG.debug("  captured paths: " + captured.stream().map(CapturedContext::getPath).collect(Collectors.joining(",")));
         for(CapturedContext context : captured)
         {
            if(context.getPath().equals(path))
            {
               LOG.debug("Found captured request for path [" + path + "]");
               return (context);
            }
         }

         QSeleniumLib.sleepABit();
      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());

      fail("Failed to capture a request for path [" + path + "] after [" + WAIT_SECONDS + "] seconds.");
      return (null);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public CapturedContext waitForCapturedPathWithBodyContaining(String path, String bodyContaining)
   {
      LOG.debug("Waiting for captured request for path [" + path + "] with body containing [" + bodyContaining + "]");
      long start = System.currentTimeMillis();

      do
      {
         // LOG.debug("  captured paths: " + captured.stream().map(CapturedContext::getPath).collect(Collectors.joining(",")));
         for(CapturedContext context : captured)
         {
            if(context.getPath().equals(path))
            {
               if(context.getBody() != null && context.getBody().contains(bodyContaining))
               {
                  LOG.debug("Found captured request for path [" + path + "] with body containing [" + bodyContaining + "]");
                  return (context);
               }
            }
         }

         QSeleniumLib.sleepABit();
      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());

      fail("Failed to capture a request for path [" + path + "] with body containing [" + bodyContaining + "] after [" + WAIT_SECONDS + "] seconds.");
      return (null);
   }

}
