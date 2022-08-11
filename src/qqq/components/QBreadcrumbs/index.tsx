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

import {ReactNode} from "react";

import {Link} from "react-router-dom";
import {Breadcrumbs as MuiBreadcrumbs} from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

interface Props {
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

function QBreadcrumbs({
   icon, title, route, light,
}: Props): JSX.Element
{
   const routes: string[] | any = route.slice(0, -1);

   let pageTitle = "Nutrifresh One";
   const fullRoutes: string[] = [];
   let accumulatedPath = "";
   for (let i = 0; i < routes.length; i++)
   {
      accumulatedPath = `${accumulatedPath}/${routes[i]}`;
      fullRoutes.push(accumulatedPath);
      pageTitle = `${routeToLabel(routes[i])} | ${pageTitle}`;
   }

   document.title = `${ucFirst(title)} | ${pageTitle}`;

   return (
      <MDBox mr={{xs: 0, xl: 8}}>
         <MuiBreadcrumbs
            sx={{
               "& .MuiBreadcrumbs-separator": {
                  color: ({palette: {white, grey}}) => (light ? white.main : grey[600]),
               },
            }}
         >
            <Link to="/">
               <MDTypography
                  component="span"
                  variant="body2"
                  color={light ? "white" : "dark"}
                  opacity={light ? 0.8 : 0.5}
                  sx={{lineHeight: 0}}
               >
                  <Icon>{icon}</Icon>
               </MDTypography>
            </Link>
            {fullRoutes.map((fullRoute: string) => (
               <Link to={fullRoute} key={fullRoute}>
                  <MDTypography
                     component="span"
                     variant="button"
                     fontWeight="regular"
                     textTransform="capitalize"
                     color={light ? "white" : "dark"}
                     opacity={light ? 0.8 : 0.5}
                     sx={{lineHeight: 0}}
                  >
                     {routeToLabel(fullRoute.replace(/.*\//, ""))}
                  </MDTypography>
               </Link>
            ))}
            <MDTypography
               variant="button"
               fontWeight="regular"
               textTransform="capitalize"
               color={light ? "white" : "dark"}
               sx={{lineHeight: 0}}
            >
               {routeToLabel(title)}
            </MDTypography>
         </MuiBreadcrumbs>
         <MDTypography
            fontWeight="bold"
            textTransform="capitalize"
            variant="h6"
            color={light ? "white" : "dark"}
            noWrap
         >
            {routeToLabel(title)}
         </MDTypography>
      </MDBox>
   );
}

QBreadcrumbs.defaultProps = {
   light: false,
};

export default QBreadcrumbs;
