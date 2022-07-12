/**
 =========================================================
 * Material Dashboard 2 PRO React TS - v1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

/**
 All of the routes for the Material Dashboard 2 PRO React are added here,
 You can add a new route, customize the routes and delete the routes here.

 Once you add a new route on this file it will be visible automatically on
 the Sidenav.

 For adding a new route you can follow the existing routes in the routes array.
 1. The `type` key with the `collapse` value is used for a route.
 2. The `type` key with the `title` value is used for a title inside the Sidenav.
 3. The `type` key with the `divider` value is used for a divider between Sidenav items.
 4. The `name` key is used for the name of the route on the Sidenav.
 5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
 6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
 7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
 inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
 8. The `route` key is used to store the route location which is used for the react router.
 9. The `href` key is used to store the external links location.
 10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
 10. The `component` key is used to store the component of its route.
 */

// Material Dashboard 2 PRO React layouts
import Analytics from "layouts/dashboards/analytics";
import Sales from "layouts/dashboards/sales";
import ProfileOverview from "layouts/pages/profile/profile-overview";
import Settings from "layouts/pages/account/settings";
import SignInBasic from "layouts/authentication/sign-in/basic";

// Material Dashboard 2 PRO React TS components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "assets/images/team-3.jpg";

// QQQ
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import EntityList from "./pages/entity-list";

const qqqRoutes = [
   {
      type: "collapse",
      name: "Brooklyn Alice",
      key: "brooklyn-alice",
      icon: <MDAvatar src={profilePicture} alt="Brooklyn Alice" size="sm" />,
      collapse: [
         {
            name: "My Profile",
            key: "my-profile",
            route: "/pages/profile/profile-overview",
            component: <ProfileOverview />,
         },
         {
            name: "Settings",
            key: "profile-settings",
            route: "/pages/account/settings",
            component: <Settings />,
         },
         {
            name: "Logout",
            key: "logout",
            route: "/authentication/sign-in/basic",
            component: <SignInBasic />,
         },
      ],
   },
   { type: "divider", key: "divider-0" },
   {
      type: "collapse",
      name: "Dashboards",
      key: "dashboards",
      icon: <Icon fontSize="medium">dashboard</Icon>,
      collapse: [
         {
            name: "Analytics",
            key: "analytics",
            route: "/dashboards/analytics",
            component: <Analytics />,
         },
         {
            name: "Sales",
            key: "sales",
            route: "/dashboards/sales",
            component: <Sales />,
         },
      ],
   },
   { type: "divider", key: "divider-1" },
   { type: "title", title: "Tables", key: "title-docs" },
];

const qController = new QController("");

(async () =>
{
   const metaData = await qController.loadMetaData();

   // get the keys sorted
   const keys = [...metaData.tables.keys()].sort();
   const tableList = [] as any[];
   keys.forEach((key) =>
   {
      const table = metaData.tables.get(key);
      tableList.push({
         name: `${table.label}`,
         key: table.name,
         route: `/${table.name}`,
         component: <EntityList table={table} />,
      });
   });

   const tables = {
      type: "collapse",
      name: "Tables",
      key: "tables",
      icon: <Icon fontSize="medium">dashboard</Icon>,
      collapse: tableList,
   };
   qqqRoutes.push(tables);
})();

export default qqqRoutes;
