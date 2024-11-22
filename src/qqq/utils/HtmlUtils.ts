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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";

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
    ** Download a server-side generated file (or the contents of a data: url)
    **
    ** todo - this could be simplified (i think?)
    ** it was originally built like this when we had to submit full access token to backend...
    **
    *******************************************************************************/
   static downloadUrlViaIFrame = (field: QFieldMetaData, url: string, filename: string) =>
   {
      if (url.startsWith("data:") || url.startsWith("http"))
      {
         if (url.startsWith("http"))
         {
            const separator = url.includes("?") ? "&" : "?";
            url += encodeURIComponent(`${separator}response-content-disposition=attachment; ${filename}`);
         }

         const link = document.createElement("a");
         link.download = filename;
         link.href = url;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         return;
      }

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

      var method = "get";
      if (QFieldType.BLOB == field.type)
      {
         method = "post";
      }

      const form = document.createElement("form");
      form.setAttribute("method", method);
      form.setAttribute("action", url);
      form.setAttribute("target", "downloadIframe");
      iframe.appendChild(form);

      const downloadInput = document.createElement("input");
      downloadInput.setAttribute("type", "hidden");
      downloadInput.setAttribute("name", "download");
      downloadInput.setAttribute("value", "1");
      form.appendChild(downloadInput);

      form.submit();
   };

   /*******************************************************************************
    ** Open a server-side generated file from a url in a new window (or a data: url)
    **
    ** todo - this could be simplified (i think?)
    ** it was originally built like this when we had to submit full access token to backend...
    **
    *******************************************************************************/
   static openInNewWindow = (url: string, filename: string) =>
   {
      if (url.startsWith("data:"))
      {
         /////////////////////////////////////////////////////////////////////////////////////////////
         /////////////////////////////////////////////////////////////////////////////////////////////
         const openInWindow = window.open("", "_blank");
         openInWindow.document.write(`<html lang="en">
            <body style="margin: 0">
               <iframe src="${url}" width="100%" height="100%" style="border: 0">
            </body>
         `);
         return;
      }

      const openInWindow = window.open("", "_blank");
      openInWindow.document.write(`<html lang="en">
            <head>
               <style>
                  * { font-family: "SF Pro Display","Roboto","Helvetica","Arial",sans-serif; }
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
               </form>
            </body>
         </html>`);
   };


}
