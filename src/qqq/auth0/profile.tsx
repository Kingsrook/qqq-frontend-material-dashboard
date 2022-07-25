import {useAuth0} from "@auth0/auth0-react";
import React from "react";
import CodeSnippet from "./code-snippet";

export function Profile()
{
   const {user} = useAuth0();

   if (!user)
   {
      console.log("no user");
      return null;
   }

   return (
      <div className="content-layout">
         <div className="content__body">
            <div className="profile-grid">
               <div className="profile__details">
                  <CodeSnippet
                     title="Decoded ID Token"
                     code={JSON.stringify(user, null, 2)}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

export default Profile;
