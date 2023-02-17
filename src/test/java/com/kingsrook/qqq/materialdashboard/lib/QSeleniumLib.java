package com.kingsrook.qqq.materialdashboard.lib;


import java.io.File;
import java.time.Duration;
import java.util.List;
import java.util.Objects;
import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;


/*******************************************************************************
 ** Library working with Selenium!
 *******************************************************************************/
public class QSeleniumLib
{
   Logger LOG = LogManager.getLogger(QSeleniumLib.class);

   public final WebDriver driver;

   private long    WAIT_SECONDS        = 10;
   private String  BASE_URL            = "https://localhost:3001";
   private boolean SCREENSHOTS_ENABLED = true;
   private String  SCREENSHOTS_PATH    = "/tmp/";



   /*******************************************************************************
    ** Constructor
    **
    *******************************************************************************/
   public QSeleniumLib(WebDriver webDriver)
   {
      this.driver = webDriver;
   }



   /*******************************************************************************
    ** Fluent setter for waitSeconds
    **
    *******************************************************************************/
   public QSeleniumLib withWaitSeconds(int waitSeconds)
   {
      WAIT_SECONDS = waitSeconds;
      return (this);
   }



   /*******************************************************************************
    ** Fluent setter for screenshotsEnabled
    **
    *******************************************************************************/
   public QSeleniumLib withScreenshotsEnabled(boolean screenshotsEnabled)
   {
      SCREENSHOTS_ENABLED = screenshotsEnabled;
      return (this);
   }



   /*******************************************************************************
    ** Fluent setter for screenshotsPath
    **
    *******************************************************************************/
   public QSeleniumLib withScreenshotsPath(String screenshotsPath)
   {
      SCREENSHOTS_PATH = screenshotsPath;
      return (this);
   }



   /*******************************************************************************
    ** Fluent setter for baseUrl
    **
    *******************************************************************************/
   public QSeleniumLib withBaseUrl(String baseUrl)
   {
      BASE_URL = baseUrl;
      return (this);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void waitForSeconds(int n)
   {
      try
      {
         new WebDriverWait(driver, Duration.ofSeconds(n))
            .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".wontEverBePresent")));
      }
      catch(Exception e)
      {
         ///////////////////
         // okay, resume. //
         ///////////////////
      }
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void waitForever()
   {
      // todo - if env says we're in CIRCLECI, then... just do a hard fail (or just not wait forever?)

      LOG.warn("Going into a waitForever...");
      new WebDriverWait(driver, Duration.ofHours(1))
         .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".wontEverBePresent")));
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void gotoAndWaitForBreadcrumbHeader(String path, String headerText)
   {
      driver.get(BASE_URL + path);

      WebElement header = new WebDriverWait(driver, Duration.ofSeconds(WAIT_SECONDS))
         .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(QQQMaterialDashboardSelectors.BREADCRUMB_HEADER)));

      LOG.debug("Navigated to [" + path + "].  Breadcrumb Header: " + header.getText());
      assertEquals(headerText, header.getText());
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public WebElement waitForSelector(String cssSelector)
   {
      return (waitForSelectorAll(cssSelector, 1).get(0));
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public List<WebElement> waitForSelectorAll(String cssSelector, int minCount)
   {
      LOG.debug("Waiting for element matching selector [" + cssSelector + "]");
      long start = System.currentTimeMillis();

      do
      {
         List<WebElement> elements = driver.findElements(By.cssSelector(cssSelector));
         if(elements.size() >= minCount)
         {
            LOG.debug("Found [" + elements.size() + "] element(s) matching selector [" + cssSelector + "]");
            return (elements);
         }

         sleepABit();
      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());

      fail("Failed to find element matching selector [" + cssSelector + "] after [" + WAIT_SECONDS + "] seconds.");
      return (null);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void waitForSelectorToNotExist(String cssSelector)
   {
      LOG.debug("Waiting for non-existence of element matching selector [" + cssSelector + "]");
      long start = System.currentTimeMillis();

      do
      {
         List<WebElement> elements = driver.findElements(By.cssSelector(cssSelector));
         if(elements.size() == 0)
         {
            LOG.debug("Found non-existence of element(s) matching selector [" + cssSelector + "]");
            return;
         }

         sleepABit();
      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());

      fail("Failed for non-existence of element matching selector [" + cssSelector + "] after [" + WAIT_SECONDS + "] seconds.");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public static void sleepABit()
   {
      try
      {
         Thread.sleep(100);
      }
      catch(InterruptedException e)
      {
         // resume
      }
   }



   @FunctionalInterface
   public interface Code<T>
   {
      public T run();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public boolean waitForCondition(String message, Code<Boolean> c)
   {
      LOG.debug("Waiting for condition: " + message);
      long start = System.currentTimeMillis();
      do
      {
         Boolean b = c.run();
         if(b != null && b)
         {
            LOG.debug("Condition became true: " + message);
            return (true);
         }

         sleepABit();
      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());
      LOG.warn("Failed for condition to become true: " + message);
      return (false);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public <T> T waitLoop(String message, Code<T> c)
   {
      LOG.debug("Waiting for: " + message);
      long start = System.currentTimeMillis();
      do
      {
         T t = c.run();
         if(t != null)
         {
            LOG.debug("Found: " + message);
            return (t);
         }

         sleepABit();
      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());
      LOG.warn("Failed to match while waiting for: " + message);
      return (null);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public WebElement waitForSelectorContaining(String cssSelector, String textContains)
   {
      LOG.debug("Waiting for element matching selector [" + cssSelector + "] containing text [" + textContains + "].");
      long start = System.currentTimeMillis();

      do
      {
         List<WebElement> elements = driver.findElements(By.cssSelector(cssSelector));
         for(WebElement element : elements)
         {
            try
            {
               if(element.getText() != null && element.getText().toLowerCase().contains(textContains.toLowerCase()))
               {
                  LOG.debug("Found element matching selector [" + cssSelector + "] containing text [" + textContains + "].");
                  Actions actions = new Actions(driver);
                  actions.moveToElement(element);
                  return (element);
               }
            }
            catch(StaleElementReferenceException sere)
            {
               LOG.debug("Caught a StaleElementReferenceException - will retry.");
            }
         }

         sleepABit();

      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());

      fail("Failed to find element matching selector [" + cssSelector + "] containing text [" + textContains + "] after [" + WAIT_SECONDS + "] seconds.");
      return (null);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public WebElement waitForSelectorContainingV2(String cssSelector, String textContains)
   {
      return (waitLoop("element matching selector [" + cssSelector + "] containing text [" + textContains + "].", () ->
      {
         List<WebElement> elements = driver.findElements(By.cssSelector(cssSelector));
         for(WebElement element : elements)
         {
            try
            {
               if(element.getText() != null && element.getText().toLowerCase().contains(textContains.toLowerCase()))
               {
                  return (element);
               }
            }
            catch(StaleElementReferenceException sere)
            {
               LOG.debug("Caught a StaleElementReferenceException - will retry.");
            }
         }
         return (null);
      }));
   }



   /*******************************************************************************
    ** Take a screenshot, putting it in the SCREENSHOTS_PATH, with a subdirectory
    ** for the test class simple name, filename = methodName.png.
    *******************************************************************************/
   public void takeScreenshotToFile()
   {
      StackTraceElement[] stackTrace     = new Exception().getStackTrace();
      StackTraceElement   caller         = stackTrace[1];
      String              filePathSuffix = caller.getClassName().substring(caller.getClassName().lastIndexOf(".") + 1) + "/" + caller.getMethodName() + ".png";
      takeScreenshotToFile(filePathSuffix);
   }



   /*******************************************************************************
    ** Take a screenshot, and give it a path/name of your choosing (under SCREENSHOTS_PATH)
    *******************************************************************************/
   public void takeScreenshotToFile(String filePathSuffix)
   {
      if(SCREENSHOTS_ENABLED)
      {
         try
         {
            File outputFile = driver.findElement(By.cssSelector("html")).getScreenshotAs(OutputType.FILE);
            File destFile   = new File(SCREENSHOTS_PATH + filePathSuffix);
            destFile.mkdirs();
            if(destFile.exists())
            {
               destFile.delete();
            }
            FileUtils.moveFile(outputFile, destFile);
            LOG.info("Made screenshot at: " + destFile);
         }
         catch(Exception e)
         {
            LOG.warn("Error taking screenshot to file: " + e.getMessage());
         }
      }
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void assertElementHasFocus(WebElement element)
   {
      long start = System.currentTimeMillis();
      do
      {
         if(Objects.equals(driver.switchTo().activeElement(), element))
         {
            return;
         }
         sleepABit();
      }
      while(start + (1000 * WAIT_SECONDS) > System.currentTimeMillis());

      fail("Failed to see that element [" + element + "] has focus.");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @FunctionalInterface
   public interface VoidVoidFunction
   {
      /*******************************************************************************
       **
       *******************************************************************************/
      void run();
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   public void tryMultiple(int noOfTries, VoidVoidFunction f)
   {
      for(int i = 0; i < noOfTries; i++)
      {
         try
         {
            f.run();
            return;
         }
         catch(Exception e)
         {
            if(i < noOfTries - 1)
            {
               LOG.debug("On try [" + i + " of " + noOfTries + "] caught: " + e.getMessage());
            }
            else
            {
               throw (e);
            }
         }
      }
   }

}
