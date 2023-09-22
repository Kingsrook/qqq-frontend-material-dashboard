/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
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

package com.kingsrook.qqq.materialdashboard.tests;


import com.kingsrook.qqq.materialdashboard.lib.QBaseSeleniumTest;
import com.kingsrook.qqq.materialdashboard.lib.javalin.QSeleniumJavalin;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;


/*******************************************************************************
 ** Test for Associated Record Scripts functionality.
 *******************************************************************************/
public class ClickLinkOnRecordThenEditShortcutTest extends QBaseSeleniumTest
{

   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   protected void addJavalinRoutes(QSeleniumJavalin qSeleniumJavalin)
   {
      super.addJavalinRoutes(qSeleniumJavalin);
      qSeleniumJavalin.withRouteToFile("/data/script/1", "data/script/1.json");
      qSeleniumJavalin.withRouteToFile("/data/scriptRevision/100", "data/scriptRevision/100.json");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Test
   void testClickLinkOnRecordThenEditShortcutTest()
   {
      qSeleniumLib.gotoAndWaitForBreadcrumbHeader("/developer/script/1", "Hello, Script");
      qSeleniumLib.waitForSelectorContaining("A", "100").click();

      qSeleniumLib.waitForSelectorContaining("BUTTON", "actions").sendKeys("e");
      assertTrue(qSeleniumLib.driver.getCurrentUrl().endsWith("/scriptRevision/100/edit"));
   }

}
