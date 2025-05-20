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

import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import Client from "qqq/utils/qqq/Client";
import ReactGA from "react-ga4";


export interface PageView
{
   location: Location;
   title: string;
}

export interface UserEvent
{
   action: string;
   category: string;
   label?: string;
}

export type AnalyticsModel = PageView | UserEvent;

const qController = Client.getInstance();

/*******************************************************************************
 ** Utilities for working with Google Analytics (through react-ga4)^
 *******************************************************************************/
export default class GoogleAnalyticsUtils
{
   private metaData: QInstance = null;
   private active: boolean = false;


   /*******************************************************************************
    **
    *******************************************************************************/
   constructor()
   {
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   private send = (model: AnalyticsModel) =>
   {
      if(!this.active)
      {
         return;
      }

      if(model.hasOwnProperty("location"))
      {
         const pageView = model as PageView;
         ReactGA.send({hitType: "pageview", page: pageView.location.pathname + pageView.location.search, title: pageView.title});
      }
      else if(model.hasOwnProperty("action") || model.hasOwnProperty("category") || model.hasOwnProperty("label"))
      {
         const userEvent = model as UserEvent;
         ReactGA.event({action: userEvent.action, category: userEvent.category, label: userEvent.label})
      }
      else
      {
         console.log("Unrecognizable analytics model", model);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   private setup = async (): Promise<void> =>
   {
      this.metaData = await qController.loadMetaData();

      let sessionValues: {[key: string]: any} = null;
      try
      {
         sessionValues = JSON.parse(localStorage.getItem("sessionValues"));
      }
      catch(e)
      {
         console.log("Error reading session values from localStorage: " + e);
      }

      if (this.metaData.environmentValues?.get("GOOGLE_ANALYTICS_ENABLED") == "true" && this.metaData.environmentValues?.get("GOOGLE_ANALYTICS_TRACKING_ID"))
      {
         this.active = true;

         if(sessionValues && sessionValues["googleAnalyticsValues"])
         {
            ReactGA.gtag("set", "user_properties", sessionValues["googleAnalyticsValues"]);
         }

         ReactGA.initialize(this.metaData.environmentValues.get("GOOGLE_ANALYTICS_TRACKING_ID"),
            {
               gaOptions: {},
               gtagOptions: {}
            });
      }
      else
      {
         this.active = false;
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   public recordAnalytics = (model: AnalyticsModel) =>
   {
      if(this.metaData == null)
      {
         (async () =>
         {
            await this.setup();
         })()
      }

      this.send(model);
   }

}