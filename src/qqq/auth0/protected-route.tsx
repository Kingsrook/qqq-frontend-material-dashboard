import {withAuthenticationRequired} from "@auth0/auth0-react";
import React from "react";
import Loader from "./loader";

// @ts-ignore
function ProtectedRoute({component}) : JSX.Element
{
   const Component = withAuthenticationRequired(component, {
      // eslint-disable-next-line react/no-unstable-nested-components
      onRedirecting: () => <Loader />,
   });

   return <Component />;
}

export default ProtectedRoute;
