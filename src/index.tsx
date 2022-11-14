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
import React from "react";
import {render} from "react-dom";
import {BrowserRouter, useNavigate, useSearchParams} from "react-router-dom";
import App from "App";
import "qqq/styles/qqq-override-styles.css";
import {MaterialUIControllerProvider} from "context";
import HandleAuthorizationError from "HandleAuthorizationError";
import ProtectedRoute from "qqq/auth0/protected-route";

export const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;

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

render(
   <BrowserRouter>
      <Auth0ProviderWithRedirectCallback
         domain={AUTH0_DOMAIN}
         clientId={AUTH0_CLIENT_ID}
         redirectUri={`${window.location.origin}/dashboards/overview`}
      >
         <MaterialUIControllerProvider>
            <ProtectedRoute component={App} />
         </MaterialUIControllerProvider>
      </Auth0ProviderWithRedirectCallback>
   </BrowserRouter>,
   document.getElementById("root"),
);
