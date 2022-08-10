import React, {useEffect} from "react";
import {SESSION_ID_COOKIE_NAME} from "App";
import {useCookies} from "react-cookie";

interface Props
{
   errorMessage?: string;
}

function HandleAuthorizationError({errorMessage}: Props)
{
   const [, , removeCookie] = useCookies([SESSION_ID_COOKIE_NAME]);

   useEffect(() =>
   {
      removeCookie(SESSION_ID_COOKIE_NAME, {path: "/"});
   });

   return (
      <div>{errorMessage}</div>
   );
}

HandleAuthorizationError.defaultProps = {
   errorMessage: "User authorization error.",
};

export default HandleAuthorizationError;
