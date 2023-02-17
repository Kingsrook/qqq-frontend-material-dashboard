package com.kingsrook.qqq.materialdashboard.lib.javalin;


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
