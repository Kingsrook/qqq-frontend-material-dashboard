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

import {Breadcrumbs as MuiBreadcrumbs} from "@mui/material";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import {ReactNode, useContext} from "react";
import {Link} from "react-router-dom";
import QContext from "QContext";
import colors from "qqq/assets/theme/base/colors";
import MDTypography from "qqq/components/legacy/MDTypography";

interface Props
{
   icon: ReactNode;
   title: string;
   route: string | string[];
   light?: boolean;

   [key: string]: any;
}

const ucFirst = (input: string): string =>
{
   if (!input)
   {
      return (input);
   }
   return (input.substring(0, 1).toUpperCase() + input.substring(1));
};

export const routeToLabel = (route: string): string =>
{
   const label = ucFirst(route
      .replace(".", " ")
      .replace("-", " ")
      .replace("_", " ")
      .replace(/([a-z])([A-Z]+)/g, "$1 $2") // transform personUSA => person USA
      .replace(/^([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")); // transform USAPerson => USA Person
   return (label);
};

function QBreadcrumbs({icon, title, route, light}: Props): JSX.Element
{
   ///////////////////////////////////////////////////////////////////////
   // strip away empty elements of the route (e.g., trailing slash(es)) //
   ///////////////////////////////////////////////////////////////////////
   if (route.length)
   {
      // @ts-ignore
      route = route.filter(r => r != "");
   }

   const routes: string[] | any = route.slice(0, -1);
   const {pathToLabelMap, branding} = useContext(QContext);

   const fullPathToLabel = (fullPath: string, route: string): string =>
   {
      if (fullPath.endsWith("/"))
      {
         fullPath = fullPath.replace(/\/+$/, "");
      }

      if (pathToLabelMap && pathToLabelMap[fullPath])
      {
         return pathToLabelMap[fullPath];
      }

      return (routeToLabel(route));
   };

   let pageTitle = branding?.appName ?? "";
   const fullRoutes: string[] = [];
   let accumulatedPath = "";
   for (let i = 0; i < routes.length; i++)
   {
      ////////////////////////////////////////////////////////
      // avoid showing "saved view" as a breadcrumb element //
      // e.g., if at /app/table/savedView/1                 //
      ////////////////////////////////////////////////////////
      if (routes[i] === "savedView" && i == routes.length - 1)
      {
         continue;
      }

      ///////////////////////////////////////////////////////////////////////
      // avoid showing the table name if it's the element before savedView //
      // e.g., when at /app/table/savedView/1 (so where i==1)              //
      // we want to just be showing "App"                                  //
      ///////////////////////////////////////////////////////////////////////
      if (i < routes.length - 1 && routes[i + 1] == "savedView" && i == 1)
      {
         continue;
      }

      if (routes[i] === "")
      {
         continue;
      }

      accumulatedPath = `${accumulatedPath}/${routes[i]}`;
      fullRoutes.push(accumulatedPath);
      pageTitle = `${fullPathToLabel(accumulatedPath, routes[i])} | ${pageTitle}`;
   }

   document.title = `${ucFirst(title)} | ${pageTitle}`;

   return (
      <Box mr={{xs: 0, xl: 8}}>
         <MuiBreadcrumbs
            sx={{
               fontSize: "1.125rem",
               fontWeight: "500",
               color: colors.dark.main,
               "& li": {
                  lineHeight: "unset!important"
               },
               "& a": {
                  color: colors.gray.main
               },
               "& .MuiBreadcrumbs-separator": {
                  fontSize: "1.125rem",
                  fontWeight: "500",
                  color: colors.dark.main
               },
            }}
         >
            <Link to="/">
               <Icon sx={{fontSize: "1.25rem!important", position: "relative", top: "0.25rem"}}>{icon}</Icon>
            </Link>
            {fullRoutes.map((fullRoute: string) => (
               <Link to={fullRoute} key={fullRoute}>
                  {fullPathToLabel(fullRoute, fullRoute.replace(/.*\//, ""))}
               </Link>
            ))}
         </MuiBreadcrumbs>
      </Box>
   );
}

QBreadcrumbs.defaultProps = {
   light: false,
};

export default QBreadcrumbs;
