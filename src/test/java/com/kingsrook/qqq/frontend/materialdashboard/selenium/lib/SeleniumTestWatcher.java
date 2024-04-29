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

package com.kingsrook.qqq.frontend.materialdashboard.selenium.lib;


import java.util.Optional;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;


/*******************************************************************************
 **
 *******************************************************************************/
public class SeleniumTestWatcher implements TestWatcher
{
   private static QSeleniumLib qSeleniumLib;



   /*******************************************************************************
    **
    *******************************************************************************/
   public static void setCurrentSeleniumLib(QSeleniumLib qSeleniumLib)
   {
      SeleniumTestWatcher.qSeleniumLib = qSeleniumLib;
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void testFailed(ExtensionContext context, Throwable cause)
   {
      if(qSeleniumLib != null)
      {
         System.out.println("Dumping browser console after failed test: " + context.getDisplayName());
         System.out.println("----------------------------------------------------------------------------");
         try
         {
            qSeleniumLib.dumpConsole();
         }
         catch(Exception e)
         {
            System.out.println("Error dumping console:");
            e.printStackTrace();
         }
         System.out.println("----------------------------------------------------------------------------");
      }

      tryToQuitSelenium();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   private void tryToQuitSelenium()
   {
      if(qSeleniumLib != null)
      {
         try
         {
            qSeleniumLib.driver.quit();
         }
         catch(Exception e)
         {
            System.err.println("Error quiting selenium driver: " + e.getMessage());
         }
      }
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void testSuccessful(ExtensionContext context)
   {
      tryToQuitSelenium();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void testAborted(ExtensionContext context, Throwable cause)
   {
      tryToQuitSelenium();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void testDisabled(ExtensionContext context, Optional<String> reason)
   {
      tryToQuitSelenium();
   }
}
