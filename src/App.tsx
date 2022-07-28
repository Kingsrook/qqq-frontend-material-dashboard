import React, {
   useState,
   useEffect,
   JSXElementConstructor,
   Key,
   ReactElement,
} from "react";

// react-router components
import {
   Routes, Route, Navigate, useLocation,
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
import {useMaterialUIController, setMiniSidenav, setOpenConfigurator} from "context";

// Images
import nfLogo from "assets/images/nutrifresh_one_icon_white.png";
import {Md5} from "ts-md5/dist/md5";
import AuthenticationButton from "qqq/components/buttons/AuthenticationButton";
import {useCookies} from "react-cookie";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import EntityCreate from "./qqq/pages/entity-create";
import EntityList from "./qqq/pages/entity-list";
import EntityView from "./qqq/pages/entity-view";
import EntityEdit from "./qqq/pages/entity-edit";
import ProcessRun from "./qqq/pages/process-run";
import MDAvatar from "./components/MDAvatar";
import ProfileOverview from "./layouts/pages/profile/profile-overview";
import Settings from "./layouts/pages/account/settings";
import SignInBasic from "./layouts/authentication/sign-in/basic";
import Analytics from "./layouts/dashboards/analytics";
import Sales from "./layouts/dashboards/sales";
import QClient from "./qqq/utils/QClient";

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
      {type: "title", title: "Tables", key: "title-docs"},
   ];
}

const SESSION_ID_COOKIE_NAME = "sessionId";
LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIAL_UI_LICENSE_KEY);

export default function App()
{
   const [, setCookie] = useCookies([SESSION_ID_COOKIE_NAME]);
   const {
      user, getAccessTokenSilently, getIdTokenClaims, logout,
   } = useAuth0();
   const [loadingToken, setLoadingToken] = useState(false);
   const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);

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
            const accessToken = await getAccessTokenSilently();
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
      transparentSidenav,
      whiteSidenav,
      darkMode,
   } = controller;
   const [onMouseEnter, setOnMouseEnter] = useState(false);
   const {pathname} = useLocation();

   const [needToLoadRoutes, setNeedToLoadRoutes] = useState(true);
   const [routes, setRoutes] = useState(getStaticRoutes());

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
         try
         {
            console.log("ok now loading qqq things");
            const metaData = await QClient.loadMetaData();

            // get the keys sorted
            const keys = [...metaData.tables.keys()].sort((a, b): number =>
            {
               const labelA = metaData.tables.get(a).label;
               const labelB = metaData.tables.get(b).label;
               return (labelA.localeCompare(labelB));
            });
            const tableList = [] as any[];
            keys.forEach((key) =>
            {
               const table = metaData.tables.get(key);
               if (!table.isHidden)
               {
                  tableList.push({
                     name: `${table.label}`,
                     key: table.name,
                     route: `/${table.name}`,
                     component: <EntityList table={table} />,
                  });
               }
            });

            let profileRoute = {};
            const gravatarBase = "http://www.gravatar.com/avatar/";
            const hash = Md5.hashStr(user.email);
            const profilePicture = `${gravatarBase}${hash}`;
            profileRoute = {
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
                  {
                     name: "Logout",
                     key: "logout",
                     route: "/authentication/sign-in/basic",
                     component: <SignInBasic />,
                  },
               ],
            };

            const tables = {
               type: "collapse",
               name: "Tables",
               key: "tables",
               icon: <Icon fontSize="medium">dashboard</Icon>,
               collapse: tableList,
            };

            const newDynamicRoutes = getStaticRoutes();
            // @ts-ignore
            newDynamicRoutes.unshift(profileRoute);
            newDynamicRoutes.push(tables);
            setRoutes(newDynamicRoutes);
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

   const authButton = (
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
      >
         <AuthenticationButton />
      </MDBox>
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

   const entityListElement = <EntityList />;
   const entityCreateElement = <EntityCreate />;
   const entityViewElement = <EntityView />;
   const entityEditElement = <EntityEdit />;
   const processRunElement = <ProcessRun />;

   return (
      <ThemeProvider theme={darkMode ? themeDark : theme}>
         <CssBaseline />
         {layout === "dashboard" && (
            <>
               <Sidenav
                  color={sidenavColor}
                  brand={nfLogo}
                  brandName="Nutrifresh One"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
               />
               <Configurator />
               {configsButton}
               {authButton}
            </>
         )}
         <Routes>
            <Route path="*" element={<Navigate to="/dashboards/analytics" />} />
            <Route path="/:tableName" element={entityListElement} key="entity-list" />
            <Route path="/:tableName/create" element={entityCreateElement} key="entity-create" />
            <Route path="/processes/:processName" element={processRunElement} key="process-run" />
            <Route path="/:tableName/:id" element={entityViewElement} key="entity-view" />
            <Route path="/:tableName/:id/edit" element={entityEditElement} key="entity-edit" />
            {getRoutes(routes)}
         </Routes>
      </ThemeProvider>
   );
}
