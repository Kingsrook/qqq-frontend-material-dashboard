import ReactDOM from "react-dom";
import {BrowserRouter, useNavigate, useSearchParams} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import App from "App";

// Material Dashboard 2 PRO React TS Context Provider
import {MaterialUIControllerProvider} from "context";
import "./qqq/styles/qqq-override-styles.css";
import ProtectedRoute from "qqq/auth0/protected-route";
import React from "react";
import HandleAuthorizationError from "HandleAuthorizationError";

// Auth0 params from env
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

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
         <HandleAuthorizationError errorMessage={searchParams.get("error_description")} />
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

ReactDOM.render(
   <BrowserRouter>
      <Auth0ProviderWithRedirectCallback
         domain={domain}
         clientId={clientId}
         redirectUri={`${window.location.origin}/dashboards/analytics`}
      >
         <MaterialUIControllerProvider>
            <ProtectedRoute component={App} />
         </MaterialUIControllerProvider>
      </Auth0ProviderWithRedirectCallback>
   </BrowserRouter>,
   document.getElementById("root"),
);
