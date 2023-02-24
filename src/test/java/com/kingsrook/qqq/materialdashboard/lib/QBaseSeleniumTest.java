package com.kingsrook.qqq.materialdashboard.lib;


import com.kingsrook.qqq.materialdashboard.lib.javalin.QSeleniumJavalin;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;


/*******************************************************************************
 ** Base class for Selenium tests
 *******************************************************************************/
public class QBaseSeleniumTest
{
   private static ChromeOptions chromeOptions;

   protected WebDriver        driver;
   protected QSeleniumJavalin qSeleniumJavalin;
   protected QSeleniumLib     qSeleniumLib;



   /*******************************************************************************
    **
    *******************************************************************************/
   @BeforeAll
   static void beforeAll()
   {
      chromeOptions = new ChromeOptions();
      chromeOptions.setAcceptInsecureCerts(true);
      chromeOptions.addArguments("--ignore-certificate-errors");

      String headless = System.getenv("QQQ_SELENIUM_HEADLESS");
      if("true".equals(headless))
      {
         chromeOptions.setHeadless(true);
      }

      WebDriverManager.chromiumdriver().setup();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @BeforeEach
   void beforeEach()
   {
      driver = new ChromeDriver(chromeOptions);
      driver.manage().window().setSize(new Dimension(1600, 1200));
      qSeleniumLib = new QSeleniumLib(driver);

      qSeleniumJavalin = new QSeleniumJavalin();
      addJavalinRoutes(qSeleniumJavalin);
      qSeleniumJavalin.start();
   }



   /*******************************************************************************
    ** meant for sub-classes to define their own javalin routes, if they need to
    *******************************************************************************/
   protected void addJavalinRoutes(QSeleniumJavalin qSeleniumJavalin)
   {
      qSeleniumJavalin
         .withRouteToFile("/metaData", "metaData/index.json")
         .withRouteToFile("/metaData/authentication", "metaData/authentication.json")
         .withRouteToFile("/metaData/table/person", "metaData/table/person.json")
         .withRouteToFile("/metaData/table/city", "metaData/table/person.json");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @AfterEach
   void afterEach()
   {
      qSeleniumLib.takeScreenshotToFile();

      if(driver != null)
      {
         driver.quit();
      }

      if(qSeleniumJavalin != null)
      {
         qSeleniumJavalin.stop();
      }
   }

}
