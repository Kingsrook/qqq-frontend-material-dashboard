import React, {
   useState,
   useEffect,
   JSXElementConstructor,
   Key,
   ReactElement,
} from "react";
import {SESSION_ID_COOKIE_NAME} from "App";
import {useCookies} from "react-cookie";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";

interface Props
{
   errorMessage?: string;
}

export default function HandleAuthorizationError({errorMessage}: Props)
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
