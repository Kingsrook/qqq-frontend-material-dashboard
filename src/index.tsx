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

import {Auth0Provider} from "@auth0/auth0-react";
import {QAuthenticationMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAuthenticationMetaData";
import React from "react";
import {render} from "react-dom";
import {BrowserRouter, useNavigate, useSearchParams} from "react-router-dom";
import App from "App";
import "qqq/styles/qqq-override-styles.css";
import {MaterialUIControllerProvider} from "context";
import HandleAuthorizationError from "HandleAuthorizationError";
import ProtectedRoute from "qqq/auth0/protected-route";
import QClient from "qqq/utils/QClient";

const qController = QClient.getInstance();

if(document.location.search && document.location.search.indexOf("clearAuthenticationMetaDataLocalStorage") > -1)
{
   qController.clearAuthenticationMetaDataLocalStorage()
}

const authenticationMetaDataPromise: Promise<QAuthenticationMetaData> = qController.getAuthenticationMetaData()

authenticationMetaDataPromise.then((authenticationMetaData) =>
{
   // @ts-ignore
   function Auth0ProviderWithRedirectCallback({children, ...props})
   {
      const navigate = useNavigate();
      const [searchParams] = useSearchParams();

      // @ts-ignore
      const onRedirectCallback = (appState) =>
      {
         navigate((appState && appState.returnTo) || window.location.pathname);
      };
      if (searchParams.get("error"))
      {
         return (
            // @ts-ignore
            <Auth0Provider {...props}>
               <HandleAuthorizationError errorMessage={searchParams.get("error_description")} />
            </Auth0Provider>
         );
      }
      else
      {
         return (
            // @ts-ignore
            <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
               {children}
            </Auth0Provider>
         );
      }
   }

   if (authenticationMetaData.type === "AUTH_0")
   {
      // @ts-ignore
      let domain: string = authenticationMetaData.data.baseUrl;

      // @ts-ignore
      const clientId = authenticationMetaData.data.clientId;

      if(!domain || !clientId)
      {
         render(
            <div>Error:  AUTH0 authenticationMetaData is missing domain [{domain}] and/or clientId [{clientId}].</div>,
            document.getElementById("root"),
         );
         return;
      }

      if(domain.endsWith("/"))
      {
         /////////////////////////////////////////////////////////////////////////////////////
         // auth0 lib fails if we have a trailing slash.  be a bit more graceful than that. //
         /////////////////////////////////////////////////////////////////////////////////////
         domain = domain.replace(/\/$/, "");
      }

      render(
         <BrowserRouter>
            <Auth0ProviderWithRedirectCallback
               domain={domain}
               clientId={clientId}
               redirectUri={`${window.location.origin}/dashboards/overview`}
            >
               <MaterialUIControllerProvider>
                  <ProtectedRoute component={App} />
               </MaterialUIControllerProvider>
            </Auth0ProviderWithRedirectCallback>
         </BrowserRouter>,
         document.getElementById("root"),
      );
   }
   else
   {
      render(
         <BrowserRouter>
            <MaterialUIControllerProvider>
               <App />
            </MaterialUIControllerProvider>
         </BrowserRouter>
         , document.getElementById("root"));
   }

})
