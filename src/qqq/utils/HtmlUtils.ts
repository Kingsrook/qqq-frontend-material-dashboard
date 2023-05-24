/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2023.  Kingsrook, LLC
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

import Client from "qqq/utils/qqq/Client";

/*******************************************************************************
 ** Utility functions for basic html/webpage/browser things.
 *******************************************************************************/
export default class HtmlUtils
{

   /*******************************************************************************
    ** Since our pages are set (w/ style on the HTML element) to smooth scroll,
    ** if you ever want to do an "auto" scroll (e.g., instant, not smooth), you can
    ** call this method, which will remove that style, and then put it back.
    *******************************************************************************/
   static autoScroll = (top: number, left: number = 0) =>
   {
      let htmlElement = document.querySelector("html");
      const initialScrollBehavior = htmlElement.style.scrollBehavior;
      htmlElement.style.scrollBehavior = "auto";
      setTimeout(() =>
      {
         window.scrollTo({top: top, left: left, behavior: "auto"});
         htmlElement.style.scrollBehavior = initialScrollBehavior;
      });
   };

   /*******************************************************************************
    ** Download a client-side generated file (e.g., csv).
    *******************************************************************************/
   static download = (filename: string, text: string) =>
   {
      var element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
   };

   /*******************************************************************************
    ** Download a server-side generated file.
    *******************************************************************************/
   static downloadUrlViaIFrame = (url: string) =>
   {
      if (document.getElementById("downloadIframe"))
      {
         document.body.removeChild(document.getElementById("downloadIframe"));
      }

      const iframe = document.createElement("iframe");
      iframe.setAttribute("id", "downloadIframe");
      iframe.setAttribute("name", "downloadIframe");
      iframe.style.display = "none";
      // todo - onload event handler to let us know when done?
      document.body.appendChild(iframe);

      const form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action", url);
      form.setAttribute("target", "downloadIframe");
      iframe.appendChild(form);

      const authorizationInput = document.createElement("input");
      authorizationInput.setAttribute("type", "hidden");
      authorizationInput.setAttribute("id", "authorizationInput");
      authorizationInput.setAttribute("name", "Authorization");
      authorizationInput.setAttribute("value", Client.getInstance().getAuthorizationHeaderValue());
      form.appendChild(authorizationInput);

      const downloadInput = document.createElement("input");
      downloadInput.setAttribute("type", "hidden");
      downloadInput.setAttribute("name", "download");
      downloadInput.setAttribute("value", "1");
      form.appendChild(downloadInput);

      form.submit();
   };

   /*******************************************************************************
    ** Open a server-side generated file from a url in a new window.
    *******************************************************************************/
   static openInNewWindow = (url: string, filename: string) =>
   {
      const openInWindow = window.open("", "_blank");
      openInWindow.document.write(`<html lang="en">
            <head>
               <style>
                  * { font-family: "Roboto","Helvetica","Arial",sans-serif; }
               </style>
               <title>${filename}</title>
               <script>
                  setTimeout(() =>
                  {
                     document.getElementById("exportForm").submit();
                  }, 1);
               </script>
            </head>
            <body>
               Opening ${filename}...
               <form id="exportForm" method="post" action="${url}" >
                  <input type="hidden" name="Authorization" value="${Client.getInstance().getAuthorizationHeaderValue()}">
               </form>
            </body>
         </html>`);
   };


}