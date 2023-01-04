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

import {useAuth0} from "@auth0/auth0-react";
import React from "react";
import CodeSnippet from "qqq/authorization/auth0/CodeSnippet";

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
