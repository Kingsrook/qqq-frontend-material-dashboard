/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2023.  Kingsrook, LLC
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
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {Select, SelectChangeEvent, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import React, {useContext, useState} from "react";
import {useParams} from "react-router-dom";
import QContext from "QContext";
import BaseLayout from "qqq/layouts/BaseLayout";
import {RapiDocReact} from "qqq/pages/records/developer/RapiDocReact";
import Client from "qqq/utils/qqq/Client";

const qController = Client.getInstance();

interface Props
{
   table?: QTableMetaData;
}

TableDeveloperView.defaultProps =
   {
      table: null,
   };

function TableDeveloperView({table}: Props): JSX.Element
{
   const {id} = useParams();

   const {getAccessTokenSilently} = useAuth0();
   const [accessToken, setAccessToken] = useState(null as string);

   const tableName = table.name;
   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [noApis, setNoApis] = useState(null as boolean);
   const [tableMetaData, setTableMetaData] = useState(null);
   const [metaData, setMetaData] = useState(null as QInstance);
   const [supportedApis, setSupportedApis] = useState([] as any)
   const [supportedVersions, setSupportedVersions] = useState([] as string[]);
   const [selectedApi, setSelectedApi] = useState(null as any);
   const [selectedVersion, setSelectedVersion] = useState(null as string);

   const {setPageHeader} = useContext(QContext);

   (async () =>
   {
      const accessToken = await getAccessTokenSilently();
      setAccessToken(accessToken);
   })();

   if (!asyncLoadInited)
   {
      setAsyncLoadInited(true);

      (async () =>
      {
         /////////////////////////////////////////////////////////////////////
         // load the full table meta-data (the one we took in is a partial) //
         /////////////////////////////////////////////////////////////////////
         const tableMetaData = await qController.loadTableMetaData(tableName);
         setTableMetaData(tableMetaData);

         //////////////////////////////
         // load top-level meta-data //
         //////////////////////////////
         const metaData = await qController.loadMetaData();
         setMetaData(metaData);

         setPageHeader(tableMetaData.label + " Developer Mode");

         const apisResponse = await fetch("/apis.json?tableName=" + tableName);
         const apisJson = await apisResponse.json();
         console.log(apisJson);

         if(!apisJson["apis"] || apisJson["apis"].length == 0)
         {
            setNoApis(true);
            return;
         }

         setSupportedApis(apisJson["apis"]);

         const selectedApi = apisJson["apis"][0];
         setSelectedApi(selectedApi);

         const versionsResponse = await fetch(selectedApi["path"] + "versions.json");
         const versionsJson = await versionsResponse.json();
         console.log(versionsJson);

         setSupportedVersions(versionsJson.supportedVersions);
         if (versionsJson.currentVersion)
         {
            setSelectedVersion(versionsJson.currentVersion);
         }
      })();
   }

   const beforeTry = (e: any) =>
   {
      e.detail.request.headers.append("Authorization", "Bearer " + accessToken);
   };

   const selectApi = async (event: SelectChangeEvent) =>
   {
      setSelectedApi(null);
      setSelectedVersion(null);

      const name = event.target.value;
      for(let i = 0; i < supportedApis.length; i++)
      {
         if(name == supportedApis[i].name)
         {
            const selectedApi = supportedApis[i];
            setSelectedApi(selectedApi);

            const versionsResponse = await fetch(selectedApi["path"] + "versions.json");
            const versionsJson = await versionsResponse.json();
            console.log(versionsJson);

            setSupportedVersions(versionsJson.supportedVersions);
            if (versionsJson.currentVersion)
            {
               setSelectedVersion(versionsJson.currentVersion);
            }
            break;
         }
      }
   };

   const selectVersion = (event: SelectChangeEvent) =>
   {
      setSelectedVersion(event.target.value);
   };

   return (
      <BaseLayout>
         <Box>
            <Grid container>
               <Grid item xs={12}>
                  <Box mb={3}>
                     {
                        <Card sx={{pb: 1}}>
                           <Box display="flex" alignItems="center">
                              <Typography variant="h6" p={2} pl={3} pb={1}>API Docs & Playground</Typography>

                              {
                                 supportedApis?.length > 0 &&
                                 <Box display="inline-block" pl={2}>
                                    <Typography fontSize="0.875rem" display="inline-block" pr={0.5} position="relative" top="2px">API:</Typography>
                                    <Select
                                       native
                                       value={selectedApi?.name}
                                       onChange={selectApi}
                                       size="small"
                                       inputProps={{id: "select-native"}}>
                                       {supportedApis.map((api: any) => (<option key={api.name} value={api.name}>{api.label}</option>))}
                                    </Select>
                                 </Box>
                              }

                              {
                                 supportedVersions?.length > 0 &&
                                 <Box display="inline-block" pl={2}>
                                    <Typography fontSize="0.875rem" display="inline-block" pr={0.5} position="relative" top="2px">Version:</Typography>
                                    <Select
                                       native
                                       value={selectedVersion}
                                       onChange={selectVersion}
                                       size="small"
                                       inputProps={{id: "select-native",}}>
                                       {supportedVersions.map((v) => (<option key={v} value={v}>{v}</option>))}
                                    </Select>
                                 </Box>
                              }
                           </Box>

                           {noApis == true && <Box p={3}>This table is not available in any APIs.</Box>}

                           {
                              accessToken && metaData && selectedApi && selectedVersion &&
                              <RapiDocReact
                                 spec-url={`${selectedApi?.path}${selectedVersion}/${tableName}/openapi.json`}
                                 regular-font="Roboto,Helvetica,Arial,sans-serif"
                                 mono-font="Monaco, Menlo, Consolas, source-code-pro, monospace"
                                 primary-color={metaData.branding.accentColor || "blue"}
                                 font-size="large"
                                 render-style="view"
                                 show-header={false}
                                 allow-authentication={false}
                                 allow-server-selection={false}
                                 allow-spec-file-download={true}
                                 sort-endpoints-by="method"
                                 beforeTry={beforeTry}
                                 css-file={"/api/rapi-doc.css"}
                                 css-classes={"qqq-rapi-doc"}
                              ></RapiDocReact>
                           }
                        </Card>
                     }
                  </Box>
               </Grid>
            </Grid>
         </Box>
      </BaseLayout>
   );
}

export default TableDeveloperView;
