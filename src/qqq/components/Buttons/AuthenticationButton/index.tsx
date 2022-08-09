import {useAuth0} from "@auth0/auth0-react";
import React from "react";
import {Button} from "@mui/material";

function AuthenticationButton()
{
   const {loginWithRedirect, logout, isAuthenticated} = useAuth0();

   if (isAuthenticated)
   {
      return <Button onClick={() => logout({returnTo: window.location.origin})}>Log Out</Button>;
   }

   return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
}

export default AuthenticationButton;
