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
import {QException} from "@kingsrook/qqq-frontend-core/lib/exceptions/QException";
import {QAppNodeType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppNodeType";
import {QAppTreeNode} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppTreeNode";
import {QAuthenticationMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAuthenticationMetaData";
import {QBrandingMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QBrandingMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import {ThemeProvider} from "@mui/material/styles";
import {LicenseInfo} from "@mui/x-license-pro";
import React, {JSXElementConstructor, Key, ReactElement, useEffect, useState,} from "react";
import {useCookies} from "react-cookie";
import {Navigate, Route, Routes, useLocation,} from "react-router-dom";
import {Md5} from "ts-md5/dist/md5";
import CommandMenu from "CommandMenu";
import DNDTest from "DNDTest";
import QContext from "QContext";
import Sidenav from "qqq/components/horseshoe/sidenav/SideNav";
import theme from "qqq/components/legacy/Theme";
import {setMiniSidenav, setOpenConfigurator, useMaterialUIController} from "qqq/context";
import AppHome from "qqq/pages/apps/Home";
import NoApps from "qqq/pages/apps/NoApps";
import ProcessRun from "qqq/pages/processes/ProcessRun";
import ReportRun from "qqq/pages/processes/ReportRun";
import EntityCreate from "qqq/pages/records/create/RecordCreate";
import TableDeveloperView from "qqq/pages/records/developer/TableDeveloperView";
import EntityEdit from "qqq/pages/records/edit/RecordEdit";
import RecordQuery from "qqq/pages/records/query/RecordQuery";
import RecordDeveloperView from "qqq/pages/records/view/RecordDeveloperView";
import RecordView from "qqq/pages/records/view/RecordView";
import Client from "qqq/utils/qqq/Client";
import ProcessUtils from "qqq/utils/qqq/ProcessUtils";


const qController = Client.getInstance();
export const SESSION_UUID_COOKIE_NAME = "sessionUUID";

export default function App()
{
   const [, setCookie, removeCookie] = useCookies([SESSION_UUID_COOKIE_NAME]);
   const {user, getAccessTokenSilently, logout} = useAuth0();
   const [loadingToken, setLoadingToken] = useState(false);
   const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);
   const [profileRoutes, setProfileRoutes] = useState({});
   const [branding, setBranding] = useState({} as QBrandingMetaData);
   const [metaData, setMetaData] = useState({} as QInstance);
   const [needLicenseKey, setNeedLicenseKey] = useState(true);
   const [loggedInUser, setLoggedInUser] = useState({} as { name?: string, email?: string });
   const [defaultRoute, setDefaultRoute] = useState("/no-apps");

   const decodeJWT = (jwt: string): any =>
   {
      const base64Url = jwt.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(window.atob(base64).split("").map(function (c)
      {
         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));

      return JSON.parse(jsonPayload);
   };

   const shouldStoreNewToken = (newToken: string, oldToken: string): boolean =>
   {
      if (!oldToken)
      {
         return (true);
      }

      try
      {
         const oldJSON = decodeJWT(oldToken);
         const newJSON = decodeJWT(newToken);

         ////////////////////////////////////////////////////////////////////////////////////
         // if the old (local storage) token is expired, then we need to store the new one //
         ////////////////////////////////////////////////////////////////////////////////////
         const oldExp = oldJSON["exp"];
         if(oldExp * 1000 < (new Date().getTime()))
         {
            console.log("Access token in local storage was expired.");
            return (true);
         }

         ////////////////////////////////////////////////////////////////////////////////////////////////
         // remove the exp & iat values from what we compare - as they are always different from auth0 //
         // note, this is only deleting them from what we compare, not from what we'd store.           //
         ////////////////////////////////////////////////////////////////////////////////////////////////
         delete newJSON["exp"]
         delete newJSON["iat"]
         delete oldJSON["exp"]
         delete oldJSON["iat"]

         const different = JSON.stringify(newJSON) !== JSON.stringify(oldJSON);
         if(different)
         {
            console.log("Latest access token from auth0 has changed vs localStorage.");
         }
         return (different);
      }
      catch(e)
      {
         console.log("Caught in shouldStoreNewToken: " + e)
      }

      return (true);
   };

   useEffect(() =>
   {
      if (loadingToken)
      {
         return;
      }
      setLoadingToken(true);

      (async () =>
      {
         const authenticationMetaData: QAuthenticationMetaData = await qController.getAuthenticationMetaData();

         if (authenticationMetaData.type === "AUTH_0")
         {
            /////////////////////////////////////////
            // use auth0 if auth type is ... auth0 //
            /////////////////////////////////////////
            try
            {
               console.log("Loading token from auth0...");
               const accessToken = await getAccessTokenSilently();

               const lsAccessToken = localStorage.getItem("accessToken");
               if (shouldStoreNewToken(accessToken, lsAccessToken))
               {
                  console.log("Sending accessToken to backend, requesting a sessionUUID...");
                  const newSessionUuid = await qController.manageSession(accessToken, null);
                  setCookie(SESSION_UUID_COOKIE_NAME, newSessionUuid, {path: "/"});
                  localStorage.setItem("accessToken", accessToken);
               }

               /*
               ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // todo#authHeader - this is our quick rollback plan - if we feel the need to stop using the cookie approach. //
               // we turn off the shouldStoreNewToken block above, and turn on these 2 lines.                                //
               ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               removeCookie(SESSION_UUID_COOKIE_NAME, {path: "/"});
               localStorage.removeItem("accessToken");
               */

               setIsFullyAuthenticated(true);
               qController.setGotAuthentication();
               qController.setAuthorizationHeaderValue("Bearer " + accessToken);

               setLoggedInUser(user);
               console.log("Token load complete.");
            }
            catch (e)
            {
               console.log(`Error loading token: ${JSON.stringify(e)}`);
               qController.clearAuthenticationMetaDataLocalStorage();
               localStorage.removeItem("accessToken")
               removeCookie(SESSION_UUID_COOKIE_NAME, {path: "/"});
               logout();
               return;
            }
         }
         else if (authenticationMetaData.type === "FULLY_ANONYMOUS" || authenticationMetaData.type === "MOCK")
         {
            /////////////////////////////////////////////
            // use a random token if anonymous or mock //
            /////////////////////////////////////////////
            console.log("Generating random token...");
            qController.setAuthorizationHeaderValue(Md5.hashStr(`${new Date()}`));
            setIsFullyAuthenticated(true);
            setCookie(SESSION_UUID_COOKIE_NAME, Md5.hashStr(`${new Date()}`), {path: "/"});
            console.log("Token generation complete.");
            return;
         }
         else
         {
            console.log(`Unrecognized authenticationMetaData.type: ${authenticationMetaData.type}`);
            qController.clearAuthenticationMetaDataLocalStorage();
         }

      })();
   }, [loadingToken]);

   if (needLicenseKey)
   {
      (async () =>
      {
         const metaData: QInstance = await qController.loadMetaData();
         LicenseInfo.setLicenseKey(metaData.environmentValues.get("MATERIAL_UI_LICENSE_KEY") || process.env.REACT_APP_MATERIAL_UI_LICENSE_KEY);
         setNeedLicenseKey(false);
      })();
   }

   const [controller, dispatch] = useMaterialUIController();
   const {miniSidenav, direction, layout, openConfigurator, sidenavColor} = controller;
   const [onMouseEnter, setOnMouseEnter] = useState(false);
   const {pathname} = useLocation();

   const [needToLoadRoutes, setNeedToLoadRoutes] = useState(true);
   const [sideNavRoutes, setSideNavRoutes] = useState([]);
   const [appRoutes, setAppRoutes] = useState(null as any);
   const [pathToLabelMap, setPathToLabelMap] = useState({} as { [path: string]: string });

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
            if (app.children)
            {
               app.children.forEach((child: QAppTreeNode) =>
               {
                  addAppToSideNavList(child, childList, path, depth + 1);
               });
            }

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

         let foundFirstApp = false;

         function addAppToAppRoutesList(metaData: QInstance, app: QAppTreeNode, routeList: any[], parentPath: string, depth: number)
         {
            const path = `${parentPath}/${app.name}`;
            if (app.type === QAppNodeType.APP)
            {
               if (app.children)
               {
                  app.children.forEach((child: QAppTreeNode) =>
                  {
                     addAppToAppRoutesList(metaData, child, routeList, path, depth + 1);
                  });
               }

               routeList.push({
                  name: `${app.label}`,
                  key: app.name,
                  route: path,
                  component: <AppHome app={metaData.apps.get(app.name)} />,
               });

               if (!foundFirstApp)
               {
                  /////////////////////////////////////////////////////////////////////////////////////////////////////
                  // keep track of what the top-most app the user has access to is.  set that as their default route //
                  /////////////////////////////////////////////////////////////////////////////////////////////////////
                  foundFirstApp = true;
                  setDefaultRoute(path);
                  console.log("Set default route to: " + path);
               }
            }
            else if (app.type === QAppNodeType.TABLE)
            {
               const table = metaData.tables.get(app.name);
               routeList.push({
                  name: `${app.label}`,
                  key: app.name,
                  route: path,
                  component: <RecordQuery table={table} key={table.name} />,
               });

               routeList.push({
                  name: `${app.label}`,
                  key: app.name,
                  route: `${path}/savedFilter/:id`,
                  component: <RecordQuery table={table} key={table.name} />,
               });

               routeList.push({
                  name: `${app.label} Create`,
                  key: `${app.name}.create`,
                  route: `${path}/create`,
                  component: <EntityCreate table={table} />,
               });

               routeList.push({
                  name: `${app.label}`,
                  key: `${app.name}.dev`,
                  route: `${path}/dev`,
                  component: <TableDeveloperView table={table} />,
               });

               ///////////////////////////////////////////////////////////////////////////////////////////////////////
               // this is the path to open a modal-form when viewing a record, to create a different (child) record //
               // it can also be done with a hash like: #/createChild=:childTableName                               //
               ///////////////////////////////////////////////////////////////////////////////////////////////////////
               routeList.push({
                  key: `${app.name}.createChild`,
                  route: `${path}/:id/createChild/:childTableName`,
                  component: <RecordView table={table} />,
               });

               routeList.push({
                  name: `${app.label} View`,
                  key: `${app.name}.view`,
                  route: `${path}/:id`,
                  component: <RecordView table={table} />,
               });

               routeList.push({
                  name: `${app.label}`,
                  key: `${app.name}.edit`,
                  route: `${path}/:id/edit`,
                  component: <EntityEdit table={table} isCopy={false} />,
               });

               routeList.push({
                  name: `${app.label}`,
                  key: `${app.name}.copy`,
                  route: `${path}/:id/copy`,
                  component: <EntityEdit table={table} isCopy={true} />,
               });

               routeList.push({
                  name: `${app.label}`,
                  key: `${app.name}.record.dev`,
                  route: `${path}/:id/dev`,
                  component: <RecordDeveloperView table={table} />,
               });

               const processesForTable = ProcessUtils.getProcessesForTable(metaData, table.name, true);
               processesForTable.forEach((process) =>
               {
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  // paths to open modal process under its owning table.                                                                           //
                  // note, processes can also be launched (at least initially on entityView screen) with a hash like: #/launchProcess=:processName //
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  routeList.push({
                     name: process.label,
                     key: process.name,
                     route: `${path}/${process.name}`,
                     component: <RecordQuery table={table} key={`${table.name}-${process.name}`} launchProcess={process} />,
                  });

                  routeList.push({
                     name: process.label,
                     key: `${app.name}/${process.name}`,
                     route: `${path}/:id/${process.name}`,
                     component: <RecordView table={table} key={`${table.name}-${process.name}`} launchProcess={process} />,
                  });
               });

               const runRecordScriptProcess = metaData.processes.get("runRecordScript");
               if (runRecordScriptProcess)
               {
                  const process = runRecordScriptProcess;
                  routeList.push({
                     name: process.label,
                     key: process.name,
                     route: `${path}/${process.name}`,
                     component: <RecordQuery table={table} key={`${table.name}-${process.name}`} launchProcess={process} />,
                  });

                  routeList.push({
                     name: process.label,
                     key: `${app.name}/${process.name}`,
                     route: `${path}/:id/${process.name}`,
                     component: <RecordView table={table} launchProcess={process} />,
                  });
               }

               const reportsForTable = ProcessUtils.getReportsForTable(metaData, table.name, true);
               reportsForTable.forEach((report) =>
               {
                  // todo - do we need some table/report routes here, that would go to RecordQuery and/or RecordView
                  routeList.push({
                     name: report.label,
                     key: report.name,
                     route: `${path}/${report.name}`,
                     component: <ReportRun report={report} />,
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
            else if (app.type === QAppNodeType.REPORT)
            {
               const report = metaData.reports.get(app.name);
               routeList.push({
                  name: `${app.label}`,
                  key: app.name,
                  route: path,
                  component: <ReportRun report={report} />,
               });
            }
         }

         try
         {
            const metaData = await Client.getInstance().loadMetaData();
            setMetaData(metaData);
            if (metaData.branding)
            {
               setBranding(metaData.branding);
               const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
               const appleIcon = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement;
               if (favicon)
               {
                  favicon.href = metaData.branding.icon;
               }
               if (appleIcon)
               {
                  appleIcon.href = metaData.branding.icon;
               }
               if (metaData.branding.accentColor)
               {
                  setAccentColor(metaData.branding.accentColor);
               }
            }

            let profileRoutes = {};
            const gravatarBase = "https://www.gravatar.com/avatar/";
            const hash = Md5.hashStr(loggedInUser?.email || "user");
            const profilePicture = `${gravatarBase}${hash}`;
            profileRoutes = {
               type: "collapse",
               name: loggedInUser?.name ?? "Anonymous",
               key: "username",
               noCollapse: true,
               icon: <Avatar src={profilePicture} alt="{user?.name}" />,
            };
            setProfileRoutes(profileRoutes);

            const sideNavAppList = [] as any[];
            const appRoutesList = [] as any[];

            //////////////////////////////////////////////////////////////////////////////////
            // iterate through the list to find the 'main dashboard so we can put it first' //
            //////////////////////////////////////////////////////////////////////////////////
            if (metaData.appTree && metaData.appTree.length)
            {
               for (let i = 0; i < metaData.appTree.length; i++)
               {
                  const app = metaData.appTree[i];
                  addAppToSideNavList(app, sideNavAppList, "", 0);
                  addAppToAppRoutesList(metaData, app, appRoutesList, "", 0);
               }
            }
            else
            {
               ///////////////////////////////////////////////////////////////////
               // if the user doesn't have access to any apps, push this route. //
               ///////////////////////////////////////////////////////////////////
               appRoutesList.push({
                  name: "No Apps",
                  key: "no-apps",
                  route: "/no-apps",
                  component: <NoApps />,
               });
            }

            const pathToLabelMap: {[path: string]: string} = {}
            for (let i = 0; i < appRoutesList.length; i++)
            {
               const route = appRoutesList[i];
               pathToLabelMap[route.route] = route.name;
            }
            setPathToLabelMap(pathToLabelMap);

            const newSideNavRoutes = [];
            // @ts-ignore
            newSideNavRoutes.unshift(profileRoutes);
            newSideNavRoutes.push({type: "divider", key: "divider-1"});
            for (let i = 0; i < sideNavAppList.length; i++)
            {
               newSideNavRoutes.push(sideNavAppList[i]);
            }

            setSideNavRoutes(newSideNavRoutes);
            setAppRoutes(appRoutesList);
         }
         catch (e)
         {
            console.error(e);
            if (e instanceof QException)
            {
               if ((e as QException).status === "401")
               {
                  console.log("Exception is a QException with status = 401.  Clearing some of localStorage & cookies");
                  qController.clearAuthenticationMetaDataLocalStorage();
                  localStorage.removeItem("accessToken")
                  removeCookie(SESSION_UUID_COOKIE_NAME, {path: "/"});

                  //////////////////////////////////////////////////////
                  // todo - this is auth0 logout... make more generic //
                  //////////////////////////////////////////////////////
                  logout();
                  return;
               }
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

   const [pageHeader, setPageHeader] = useState("" as string | JSX.Element);
   const [accentColor, setAccentColor] = useState("#0062FF");
   const [tableMetaData, setTableMetaData] = useState(null);
   const [tableProcesses, setTableProcesses] = useState(null);
   const [dotMenuOpen, setDotMenuOpen] = useState(false);
   const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
   return (

      appRoutes && (
         <QContext.Provider value={{
            pageHeader: pageHeader,
            accentColor: accentColor,
            tableMetaData: tableMetaData,
            tableProcesses: tableProcesses,
            dotMenuOpen: dotMenuOpen,
            keyboardHelpOpen: keyboardHelpOpen,
            setPageHeader: (header: string | JSX.Element) => setPageHeader(header),
            setAccentColor: (accentColor: string) => setAccentColor(accentColor),
            setTableMetaData: (tableMetaData: QTableMetaData) => setTableMetaData(tableMetaData),
            setTableProcesses: (tableProcesses: QProcessMetaData[]) => setTableProcesses(tableProcesses),
            setDotMenuOpen: (dotMenuOpent: boolean) => setDotMenuOpen(dotMenuOpent),
            setKeyboardHelpOpen: (keyboardHelpOpen: boolean) => setKeyboardHelpOpen(keyboardHelpOpen),
            pathToLabelMap: pathToLabelMap,
            branding: branding
         }}>
            <ThemeProvider theme={theme}>
               <CssBaseline />
               <CommandMenu metaData={metaData} />
               <Sidenav
                  color={sidenavColor}
                  icon={branding.icon}
                  logo={branding.logo}
                  appName={branding.appName}
                  branding={branding}
                  routes={sideNavRoutes}
                  pathToLabelMap={pathToLabelMap}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
               />
               <Routes>
                  <Route path="*" element={<Navigate to={defaultRoute} />} />
                  {appRoutes && getRoutes(appRoutes)}
                  {profileRoutes && getRoutes([profileRoutes])}
               </Routes>
            </ThemeProvider>
         </QContext.Provider>
      )
   );
}
