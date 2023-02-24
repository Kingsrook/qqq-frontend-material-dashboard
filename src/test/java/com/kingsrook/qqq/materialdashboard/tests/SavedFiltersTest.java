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


import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.kingsrook.qqq.materialdashboard.lib.QBaseSeleniumTest;
import com.kingsrook.qqq.materialdashboard.lib.javalin.CapturedContext;
import com.kingsrook.qqq.materialdashboard.lib.javalin.QSeleniumJavalin;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import static com.kingsrook.qqq.materialdashboard.tests.QueryScreenTest.addQueryFilterInput;
import static org.junit.jupiter.api.Assertions.assertTrue;


/*******************************************************************************
 ** Test for Saved Filters functionality on the Query screen.
 *******************************************************************************/
public class SavedFiltersTest extends QBaseSeleniumTest
{

   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   protected void addJavalinRoutes(QSeleniumJavalin qSeleniumJavalin)
   {
      addStandardRoutesForThisTest(qSeleniumJavalin);
      qSeleniumJavalin.withRouteToFile("/processes/querySavedFilter/init", "processes/querySavedFilter/init.json");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   private void addStandardRoutesForThisTest(QSeleniumJavalin qSeleniumJavalin)
   {
      super.addJavalinRoutes(qSeleniumJavalin);
      qSeleniumJavalin.withRouteToFile("/data/person/count", "data/person/count.json");
      qSeleniumJavalin.withRouteToFile("/data/person/query", "data/person/index.json");
      qSeleniumJavalin.withRouteToFile("/data/person/*", "data/person/1701.json");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Test
   void testNavigatingBackAndForth()
   {
      qSeleniumLib.gotoAndWaitForBreadcrumbHeader("/peopleApp/greetingsApp/person", "Person");
      qSeleniumLib.waitForSelectorContaining("BUTTON", "Saved Filters").click();
      qSeleniumLib.waitForSelectorContaining("LI", "Some People");

      ////////////////////////////////////////
      // need to only return id=2 next time //
      ////////////////////////////////////////
      qSeleniumJavalin.stop();
      qSeleniumJavalin.clearRoutes();
      addStandardRoutesForThisTest(qSeleniumJavalin);
      qSeleniumJavalin.withRouteToFile("/processes/querySavedFilter/init", "processes/querySavedFilter/init-id=2.json");
      qSeleniumJavalin.restart();

      ///////////////////////////////////////////////////////
      // go to a specific filter - assert that it's loaded //
      ///////////////////////////////////////////////////////
      qSeleniumLib.waitForSelectorContaining("LI", "Some People").click();
      qSeleniumLib.waitForCondition("Current URL should have filter id", () -> driver.getCurrentUrl().endsWith("/person/savedFilter/2"));
      qSeleniumLib.waitForSelectorContaining("DIV", "Current Filter: Some People");

      //////////////////////////////
      // click into a view screen //
      //////////////////////////////
      qSeleniumLib.waitForSelectorContaining("DIV", "Jonny").click();
      qSeleniumLib.waitForSelectorContaining("H5", "Viewing Person: John Doe");

      /////////////////////////////////////////////////////
      // take breadcrumb back to table query             //
      // assert the previously selected filter is loaded //
      /////////////////////////////////////////////////////
      qSeleniumLib.waitForSelectorContaining("A", "Person").click();
      qSeleniumLib.waitForCondition("Current URL should have filter id", () -> driver.getCurrentUrl().endsWith("/person/savedFilter/2"));
      qSeleniumLib.waitForSelectorContaining("DIV", "Current Filter: Some People");
      qSeleniumLib.waitForSelectorContaining(".MuiBadge-badge", "1");

      //////////////////////
      // modify the query //
      //////////////////////
      qSeleniumLib.waitForSelectorContaining(".MuiDataGrid-toolbarContainer BUTTON", "Filters").click();
      addQueryFilterInput(qSeleniumLib, 1, "First Name", "contains", "Jam", "Or");
      qSeleniumLib.waitForSelectorContaining("H5", "Person").click();
      qSeleniumLib.waitForSelectorContaining("DIV", "Current Filter: Some People")
         .findElement(By.cssSelector("CIRCLE"));
      qSeleniumLib.waitForSelectorContaining(".MuiBadge-badge", "2");

      //////////////////////////////
      // click into a view screen //
      //////////////////////////////
      qSeleniumLib.waitForSelectorContaining("DIV", "Jonny").click();
      qSeleniumLib.waitForSelectorContaining("H5", "Viewing Person: John Doe");

      ///////////////////////////////////////////////////////////////////////////////
      // take breadcrumb back to table query                                       //
      // assert the previously selected filter, with modification, is still loaded //
      ///////////////////////////////////////////////////////////////////////////////
      qSeleniumJavalin.beginCapture();
      qSeleniumLib.waitForSelectorContaining("A", "Person").click();
      qSeleniumLib.waitForCondition("Current URL should have filter id", () -> driver.getCurrentUrl().endsWith("/person/savedFilter/2"));
      qSeleniumLib.waitForSelectorContaining("DIV", "Current Filter: Some People")
         .findElement(By.cssSelector("CIRCLE"));
      qSeleniumLib.waitForSelectorContaining(".MuiBadge-badge", "2");
      CapturedContext capturedContext = qSeleniumJavalin.waitForCapturedPath("/data/person/query");
      assertTrue(capturedContext.getBody().contains("Jam"));
      qSeleniumJavalin.endCapture();

      ////////////////////////////////////////////////////
      // navigate to the table with a filter in the URL //
      ////////////////////////////////////////////////////
      String filter = """
         {
            "criteria":
            [
               {
                  "fieldName": "id",
                  "operator": "LESS_THAN",
                  "values": [10]
               }
            ]
         }
         """.replace('\n', ' ').replaceAll(" ", "");
      qSeleniumLib.gotoAndWaitForBreadcrumbHeader("/peopleApp/greetingsApp/person?filter=" + URLEncoder.encode(filter, StandardCharsets.UTF_8), "Person");
      qSeleniumLib.waitForSelectorContaining(".MuiBadge-badge", "1");
      qSeleniumLib.waitForSelectorContainingToNotExist("DIV", "Current Filter");

      //////////////////////////////
      // click into a view screen //
      //////////////////////////////
      qSeleniumLib.waitForSelectorContaining("DIV", "Jonny").click();
      qSeleniumLib.waitForSelectorContaining("H5", "Viewing Person: John Doe");

      /////////////////////////////////////////////////////////////////////////////////
      // take breadcrumb back to table query                                         //
      // assert the filter previously given on the URL is what is loaded & requested //
      /////////////////////////////////////////////////////////////////////////////////
      qSeleniumJavalin.beginCapture();
      qSeleniumLib.waitForSelectorContaining("A", "Person").click();
      qSeleniumLib.waitForCondition("Current URL should not have filter id", () -> !driver.getCurrentUrl().endsWith("/person/savedFilter/2"));
      qSeleniumLib.waitForSelectorContaining(".MuiBadge-badge", "1");
      capturedContext = qSeleniumJavalin.waitForCapturedPath("/data/person/query");
      assertTrue(capturedContext.getBody().matches("(?s).*id.*LESS_THAN.*10.*"));
      qSeleniumJavalin.endCapture();
   }

}
