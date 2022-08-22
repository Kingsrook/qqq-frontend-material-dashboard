import React, {
   JSXElementConstructor, Key, ReactElement, useEffect, useState,
} from "react";

// react-router components
import {
   Navigate, Route, Routes, useLocation,
} from "react-router-dom";

import {useAuth0} from "@auth0/auth0-react";

// @mui material components
import {LicenseInfo} from "@mui/x-license-pro";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS exampless
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 PRO React TS themes
import theme from "assets/theme";

// Material Dashboard 2 PRO React TS Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 PRO React TS contexts
import {setMiniSidenav, setOpenConfigurator, useMaterialUIController} from "context";

// Images
import nfLogo from "assets/images/nutrifresh_one_icon_white.png";
import {Md5} from "ts-md5/dist/md5";
import {useCookies} from "react-cookie";
import EntityCreate from "./qqq/pages/entity-create";
import EntityList from "./qqq/pages/entity-list";
import EntityView from "./qqq/pages/entity-view";
import EntityEdit from "./qqq/pages/entity-edit";
import ProcessRun from "./qqq/pages/process-run";
import AppHome from "qqq/pages/app-home";
import MDAvatar from "./components/MDAvatar";
import ProfileOverview from "./layouts/pages/profile/profile-overview";
import Settings from "./layouts/pages/account/settings";
import Analytics from "./layouts/dashboards/analytics";
import Sales from "./layouts/dashboards/sales";
import QClient from "./qqq/utils/QClient";
import {QAppNodeType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppNodeType";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import QProcessUtils from "qqq/utils/QProcessUtils";
import {QAppTreeNode} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppTreeNode";

///////////////////////////////////////////////////////////////////////////////////////////////
// define the parts of the nav that are static - before the qqq tables etc get dynamic added //
///////////////////////////////////////////////////////////////////////////////////////////////
function getStaticRoutes()
{
   return [
      {type: "divider", key: "divider-0"},
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
      {type: "divider", key: "divider-1"},
   ];
}

export const SESSION_ID_COOKIE_NAME = "sessionId";
LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIAL_UI_LICENSE_KEY);

export default function App()
{
   const [, setCookie] = useCookies([SESSION_ID_COOKIE_NAME]);
   const {
      user, getAccessTokenSilently, getIdTokenClaims, logout, loginWithRedirect,
   } = useAuth0();
   const [loadingToken, setLoadingToken] = useState(false);
   const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);
   const [profileRoutes, setProfileRoutes] = useState({});

   useEffect(() =>
   {
      if (loadingToken)
      {
         return;
      }
      setLoadingToken(true);
      (async () =>
      {
         try
         {
            console.log("Loading token...");
            await getAccessTokenSilently();
            const idToken = await getIdTokenClaims();
            setCookie(SESSION_ID_COOKIE_NAME, idToken.__raw, {path: "/"});
            setIsFullyAuthenticated(true);
            console.log("Token load complete.");
         }
         catch (e)
         {
            console.log(`Error loading token: ${JSON.stringify(e)}`);
            logout();
         }
      })();
   }, [loadingToken]);

   const [controller, dispatch] = useMaterialUIController();
   const {
      miniSidenav,
      direction,
      layout,
      openConfigurator,
      sidenavColor,
      darkMode,
   } = controller;
   const [onMouseEnter, setOnMouseEnter] = useState(false);
   const {pathname} = useLocation();

   const [needToLoadRoutes, setNeedToLoadRoutes] = useState(true);
   const [sideNavRoutes, setSideNavRoutes] = useState(getStaticRoutes());
   const [appRoutes, setAppRoutes] = useState(null as any);

   ////////////////////////////////////////////
   // load qqq meta data to make more routes //
   ////////////////////////////////////////////
   useEffect(() =>
   {
      if (!needToLoadRoutes || !isFullyAuthenticated)
      {
         return;
      }
      setNeedToLoadRoutes(false);

      (async () =>
      {
         function addAppToSideNavList(app: QAppTreeNode, appList: any[], parentPath: string, depth: number)
         {
            const path = `${parentPath}/${app.name}`;
            if (app.type !== QAppNodeType.APP)
            {
               return;
            }

            if (depth > 2)
            {
               console.warn("App depth is greater than 2 - not including app in side nav...");
               return;
            }

            const childList: any[] = [];
            app.children.forEach((child: QAppTreeNode) =>
            {
               addAppToSideNavList(child, childList, path, depth + 1);
            });

            if (childList.length === 0)
            {
               if (depth === 0)
               {
                  /////////////////////////////////////////////////////
                  // at level 0, the entry must always be a collapse //
                  /////////////////////////////////////////////////////
                  appList.push({
                     type: "collapse",
                     name: app.label,
                     key: app.name,
                     route: path,
                     icon: <Icon fontSize="medium">{app.iconName}</Icon>,
                     noCollapse: true,
                     component: <AppHome />,
                  });
               }
               else
               {
                  appList.push({
                     name: app.label,
                     key: app.name,
                     route: path,
                     icon: <Icon fontSize="medium">{app.iconName}</Icon>,
                     component: <AppHome />,
                  });
               }
            }
            else
            {
               appList.push({
                  type: "collapse",
                  name: app.label,
                  key: app.name,
                  dropdown: true,
                  icon: <Icon fontSize="medium">{app.iconName}</Icon>,
                  collapse: childList,
               });
            }
         }

         function addAppToAppRoutesList(metaData: QInstance, app: QAppTreeNode, routeList: any[], parentPath: string, depth: number)
         {
            const path = `${parentPath}/${app.name}`;
            if (app.type === QAppNodeType.APP)
            {
               app.children.forEach((child: QAppTreeNode) =>
               {
                  addAppToAppRoutesList(metaData, child, routeList, path, depth + 1);
               });

               routeList.push({
                  name: `${app.label}`,
                  key: app.name,
                  route: path,
                  component: <AppHome app={metaData.apps.get(app.name)} />,
               });
            }
            else if (app.type === QAppNodeType.TABLE)
            {
               const table = metaData.tables.get(app.name);
               routeList.push({
                  name: `${app.label}`,
                  key: app.name,
                  route: path,
                  component: <EntityList table={table} />,
               });

               routeList.push({
                  name: `${app.label} Create`,
                  key: `${app.name}.create`,
                  route: `${path}/create`,
                  component: <EntityCreate table={table} />,
               });

               routeList.push({
                  name: `${app.label} View`,
                  key: `${app.name}.view`,
                  route: `${path}/:id`,
                  component: <EntityView table={table} />,
               });

               routeList.push({
                  name: `${app.label}`,
                  key: `${app.name}.edit`,
                  route: `${path}/:id/edit`,
                  component: <EntityEdit table={table} />,
               });

               const processesForTable = QProcessUtils.getProcessesForTable(metaData, table.name, true);
               processesForTable.forEach((process) =>
               {
                  routeList.push({
                     name: process.label,
                     key: process.name,
                     route: `${path}/${process.name}`,
                     component: <ProcessRun process={process} />,
                  });
               });
            }
            else if (app.type === QAppNodeType.PROCESS)
            {
               const process = metaData.processes.get(app.name);
               routeList.push({
                  name: `${app.label}`,
                  key: app.name,
                  route: path,
                  component: <ProcessRun process={process} />,
               });
            }
         }

         try
         {
            const metaData = await QClient.getInstance().loadMetaData();

            let profileRoutes = {};
            const gravatarBase = "http://www.gravatar.com/avatar/";
            const hash = Md5.hashStr(user.email);
            const profilePicture = `${gravatarBase}${hash}`;
            profileRoutes = {
               type: "collapse",
               name: user.name,
               key: user.name,
               icon: <MDAvatar src={profilePicture} alt="{user.name}" size="sm" />,
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
               ],
            };
            setProfileRoutes(profileRoutes);

            const sideNavAppList = [] as any[];
            const appRoutesList = [] as any[];
            for (let i = 0; i < metaData.appTree.length; i++)
            {
               const app = metaData.appTree[i];
               addAppToSideNavList(app, sideNavAppList, "", 0);
               addAppToAppRoutesList(metaData, app, appRoutesList, "", 0);
            }

            const newSideNavRoutes = getStaticRoutes();
            // @ts-ignore
            newSideNavRoutes.unshift(profileRoutes);
            for (let i = 0; i < sideNavAppList.length; i++)
            {
               newSideNavRoutes.push(sideNavAppList[i]);
            }

            setSideNavRoutes(newSideNavRoutes);
            setAppRoutes(appRoutesList);
         }
         catch (e)
         {
            if (e.toString().indexOf("status code 401") !== -1)
            {
               logout();
            }
         }
      })();
   }, [needToLoadRoutes, isFullyAuthenticated]);

   // Open sidenav when mouse enter on mini sidenav
   const handleOnMouseEnter = () =>
   {
      if (miniSidenav && !onMouseEnter)
      {
         setMiniSidenav(dispatch, false);
         setOnMouseEnter(true);
      }
   };

   // Close sidenav when mouse leave mini sidenav
   const handleOnMouseLeave = () =>
   {
      if (onMouseEnter)
      {
         setMiniSidenav(dispatch, true);
         setOnMouseEnter(false);
      }
   };

   // Change the openConfigurator state
   const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

   // Setting the dir attribute for the body element
   useEffect(() =>
   {
      document.body.setAttribute("dir", direction);
   }, [direction]);

   // Setting page scroll to 0 when changing the route
   useEffect(() =>
   {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
   }, [pathname]);

   ///////////////////////////////////////////////////////////////////////////////////////////
   // convert an object that works for the Sidenav into one that works for the react-router //
   ///////////////////////////////////////////////////////////////////////////////////////////
   const getRoutes = (allRoutes: any[]): any => allRoutes.map(
      (route: {
         collapse: any;
         route: string;
         component: ReactElement<any, string | JSXElementConstructor<any>>;
         key: Key;
      }) =>
      {
         if (route.collapse)
         {
            return getRoutes(route.collapse);
         }

         if (route.route)
         {
            return <Route path={route.route} element={route.component} key={route.key} />;
         }

         return null;
      },
   );

   const configsButton = (
      <MDBox
         display="flex"
         justifyContent="center"
         alignItems="center"
         width="3.25rem"
         height="3.25rem"
         bgColor="white"
         shadow="sm"
         borderRadius="50%"
         position="fixed"
         right="2rem"
         bottom="2rem"
         zIndex={99}
         color="dark"
         sx={{cursor: "pointer"}}
         onClick={handleConfiguratorOpen}
      >
         <Icon fontSize="small" color="inherit">
            settings
         </Icon>
      </MDBox>
   );

   return (
      appRoutes && (
         <ThemeProvider theme={darkMode ? themeDark : theme}>
            <CssBaseline />
            {layout === "dashboard" && (
               <>
                  <Sidenav
                     color={sidenavColor}
                     brand={nfLogo}
                     brandName="Nutrifresh One"
                     routes={sideNavRoutes}
                     onMouseEnter={handleOnMouseEnter}
                     onMouseLeave={handleOnMouseLeave}
                  />
                  <Configurator />
               </>
            )}
            <Routes>
               <Route path="*" element={<Navigate to="/dashboards/analytics" />} />
               {appRoutes && getRoutes(appRoutes)}
               {getRoutes(getStaticRoutes())}
               {profileRoutes && getRoutes([profileRoutes])}
            </Routes>
         </ThemeProvider>
      )
   );
}
