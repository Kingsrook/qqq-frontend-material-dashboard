import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import App from "App";

// Material Dashboard 2 PRO React TS Context Provider
import {MaterialUIControllerProvider} from "context";
import "./qqq/styles/qqq-override-styles.css";
import ProtectedRoute from "qqq/auth0/protected-route";
import React from "react";

// Auth0 params from env
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

ReactDOM.render(
   <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={`${window.location.origin}/dashboards/analytics`}
   >
      <BrowserRouter>
         <MaterialUIControllerProvider>
            <ProtectedRoute component={App} />
         </MaterialUIControllerProvider>
      </BrowserRouter>
   </Auth0Provider>,
   document.getElementById("root"),
);
export * from "components/MDButton";
