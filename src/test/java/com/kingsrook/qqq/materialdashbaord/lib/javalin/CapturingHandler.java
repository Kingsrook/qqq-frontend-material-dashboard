package com.kingsrook.qqq.materialdashbaord.lib.javalin;


import io.javalin.http.Context;
import io.javalin.http.Handler;


/*******************************************************************************
 ** javalin handler that captures the context, for later review, e.g., of the
 ** query string or posted body
 *******************************************************************************/
public class CapturingHandler implements Handler
{
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
         System.out.println("Capturing request for path [" + context.path() + "]");
         qSeleniumJavalin.captured.add(new CapturedContext(context));
      }
      else
      {
         System.out.println("Not capturing request for path [" + context.path() + "]");
      }
   }
}
