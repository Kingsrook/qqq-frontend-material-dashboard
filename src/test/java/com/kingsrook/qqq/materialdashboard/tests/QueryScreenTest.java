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
import com.kingsrook.qqq.materialdashboard.lib.QQQMaterialDashboardSelectors;
import com.kingsrook.qqq.materialdashboard.lib.QSeleniumLib;
import com.kingsrook.qqq.materialdashboard.lib.javalin.CapturedContext;
import com.kingsrook.qqq.materialdashboard.lib.javalin.QSeleniumJavalin;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import static org.assertj.core.api.Assertions.assertThat;


/*******************************************************************************
 ** Test for the record query screen
 *******************************************************************************/
public class QueryScreenTest extends QBaseSeleniumTest
{

   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   protected void addJavalinRoutes(QSeleniumJavalin qSeleniumJavalin)
   {
      super.addJavalinRoutes(qSeleniumJavalin);
      qSeleniumJavalin
         .withRouteToFile("/data/person/count", "data/person/count.json")
         .withRouteToFile("/data/person/query", "data/person/index.json")
         .withRouteToFile("/processes/querySavedFilter/init", "processes/querySavedFilter/init.json");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Test
   void testBasicQueryAndClearFilters()
   {
      qSeleniumLib.gotoAndWaitForBreadcrumbHeader("/peopleApp/greetingsApp/person", "Person");
      qSeleniumLib.waitForSelector(QQQMaterialDashboardSelectors.QUERY_GRID_CELL);
      qSeleniumLib.waitForSelectorContaining(".MuiDataGrid-toolbarContainer BUTTON", "Filter").click();

      /////////////////////////////////////////////////////////////////////
      // open the filter window, enter a value, wait for query to re-run //
      /////////////////////////////////////////////////////////////////////
      WebElement filterInput = qSeleniumLib.waitForSelector(QQQMaterialDashboardSelectors.QUERY_FILTER_INPUT);
      qSeleniumLib.waitForElementToHaveFocus(filterInput);
      filterInput.sendKeys("id");
      filterInput.sendKeys("\t");
      driver.switchTo().activeElement().sendKeys("\t");
      qSeleniumJavalin.beginCapture();
      driver.switchTo().activeElement().sendKeys("1");

      ///////////////////////////////////////////////////////////////////
      // assert that query & count both have the expected filter value //
      ///////////////////////////////////////////////////////////////////
      String idEquals1FilterSubstring = """
         {"fieldName":"id","operator":"EQUALS","values":["1"]}""";
      CapturedContext capturedCount = qSeleniumJavalin.waitForCapturedPath("/data/person/count");
      CapturedContext capturedQuery = qSeleniumJavalin.waitForCapturedPath("/data/person/query");
      assertThat(capturedCount).extracting("body").asString().contains(idEquals1FilterSubstring);
      assertThat(capturedQuery).extracting("body").asString().contains(idEquals1FilterSubstring);
      qSeleniumJavalin.endCapture();

      ///////////////////////////////////////
      // click away from the filter window //
      ///////////////////////////////////////
      qSeleniumLib.waitForSeconds(1); // todo grr.
      qSeleniumLib.waitForSelector(QQQMaterialDashboardSelectors.BREADCRUMB_HEADER).click();
      qSeleniumLib.waitForSelectorContaining(".MuiBadge-root", "1");

      ///////////////////////////////////////////////////////////////////
      // click the 'x' clear icon, then yes, then expect another query //
      ///////////////////////////////////////////////////////////////////
      qSeleniumJavalin.beginCapture();
      qSeleniumLib.tryMultiple(3, () -> qSeleniumLib.waitForSelector("#clearFiltersButton").click());
      qSeleniumLib.waitForSelectorContaining("BUTTON", "Yes").click();

      ////////////////////////////////////////////////////////////////////
      // assert that query & count both no longer have the filter value //
      ////////////////////////////////////////////////////////////////////
      capturedCount = qSeleniumJavalin.waitForCapturedPath("/data/person/count");
      capturedQuery = qSeleniumJavalin.waitForCapturedPath("/data/person/query");
      assertThat(capturedCount).extracting("body").asString().doesNotContain(idEquals1FilterSubstring);
      assertThat(capturedQuery).extracting("body").asString().doesNotContain(idEquals1FilterSubstring);
      qSeleniumJavalin.endCapture();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Test
   void testMultiCriteriaQueryWithOr()
   {
      qSeleniumLib.gotoAndWaitForBreadcrumbHeader("/peopleApp/greetingsApp/person", "Person");
      qSeleniumLib.waitForSelector(QQQMaterialDashboardSelectors.QUERY_GRID_CELL);
      qSeleniumLib.waitForSelectorContaining(".MuiDataGrid-toolbarContainer BUTTON", "Filter").click();

      qSeleniumJavalin.beginCapture();
      addQueryFilterInput(qSeleniumLib, 0, "First Name", "contains", "Dar", "Or");
      addQueryFilterInput(qSeleniumLib, 1, "First Name", "contains", "Jam", "Or");

      String expectedFilterContents0 = """
         {"fieldName":"firstName","operator":"CONTAINS","values":["Dar"]}""";
      String expectedFilterContents1 = """
         {"fieldName":"firstName","operator":"CONTAINS","values":["Jam"]}""";
      String expectedFilterContents2 = """
         "booleanOperator":"OR\"""";

      qSeleniumJavalin.waitForCapturedPathWithBodyContaining("/data/person/query", expectedFilterContents0);
      qSeleniumJavalin.waitForCapturedPathWithBodyContaining("/data/person/query", expectedFilterContents1);
      qSeleniumJavalin.waitForCapturedPathWithBodyContaining("/data/person/query", expectedFilterContents2);
      qSeleniumJavalin.endCapture();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   static void addQueryFilterInput(QSeleniumLib qSeleniumLib, int index, String fieldLabel, String operator, String value, String booleanOperator)
   {
      if(index > 0)
      {
         qSeleniumLib.waitForSelectorContaining("BUTTON", "Add condition").click();
      }

      WebElement subFormForField = qSeleniumLib.waitForSelectorAll(".filterCriteriaRow", index + 1).get(index);

      if(index == 1)
      {
         WebElement booleanOperatorInput = subFormForField.findElement(By.cssSelector(".booleanOperatorColumn .MuiInput-input"));
         booleanOperatorInput.click();
         qSeleniumLib.waitForMillis(100);

         subFormForField.findElement(By.cssSelector(".booleanOperatorColumn .MuiInput-input"));
         qSeleniumLib.waitForSelectorContaining("li", booleanOperator).click();
         qSeleniumLib.waitForMillis(100);
      }

      WebElement fieldInput = subFormForField.findElement(By.cssSelector(".fieldColumn INPUT"));
      fieldInput.click();
      qSeleniumLib.waitForMillis(100);
      fieldInput.clear();
      fieldInput.sendKeys(fieldLabel);
      qSeleniumLib.waitForMillis(100);
      fieldInput.sendKeys("\n");
      qSeleniumLib.waitForMillis(100);

      WebElement operatorInput = subFormForField.findElement(By.cssSelector(".operatorColumn INPUT"));
      operatorInput.click();
      qSeleniumLib.waitForMillis(100);
      operatorInput.sendKeys(Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, Keys.BACK_SPACE, operator);
      qSeleniumLib.waitForMillis(100);
      operatorInput.sendKeys("\n");
      qSeleniumLib.waitForMillis(100);

      WebElement valueInput = subFormForField.findElement(By.cssSelector(".filterValuesColumn INPUT"));
      valueInput.click();
      valueInput.sendKeys(value);
      qSeleniumLib.waitForMillis(100);
   }

}
