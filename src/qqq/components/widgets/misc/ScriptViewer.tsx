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

import {QException} from "@kingsrook/qqq-frontend-core/lib/exceptions/QException";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QFilterOrderBy} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React, {useReducer, useState} from "react";
import AceEditor from "react-ace";
import {Link} from "react-router-dom";
import TabPanel from "qqq/components/misc/TabPanel";
import ScriptDocsForm from "qqq/components/scripts/ScriptDocsForm";
import ScriptEditor, {ScriptEditorProps} from "qqq/components/scripts/ScriptEditor";
import ScriptLogsView from "qqq/components/scripts/ScriptLogsView";
import ScriptTestForm from "qqq/components/scripts/ScriptTestForm";
import CustomWidthTooltip from "qqq/components/tooltips/CustomWidthTooltip";
import {LoadingState} from "qqq/models/LoadingState";
import DeveloperModeUtils from "qqq/utils/DeveloperModeUtils";
import Client from "qqq/utils/qqq/Client";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const qController = Client.getInstance();

// Declaring props types for ViewForm
interface Props
{
   scriptId: number,
   associatedScriptTableName?: string,
   associatedScriptFieldName?: string,
   associatedScriptRecordId?: any,
   testInputFields?: QFieldMetaData[],
   testOutputFields?: QFieldMetaData[],
}

ScriptViewer.defaultProps =
   {
      associatedScriptTableName: null,
      associatedScriptFieldName: null,
      associatedScriptRecordId: null,
      testInputFields: null,
      testOutputFields: null,
   };

export default function ScriptViewer({scriptId, associatedScriptTableName, associatedScriptFieldName, associatedScriptRecordId, testInputFields, testOutputFields}: Props): JSX.Element
{
   const [metaData, setMetaData] = useState(null as QInstance);
   const [scriptRecord, setScriptRecord] = useState(null as QRecord);
   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [versionRecordList, setVersionRecordList] = useState(null as QRecord[]);
   const [selectedVersionRecord, setSelectedVersionRecord] = useState(null as QRecord);
   const [scriptLogs, setScriptLogs] = useState({} as any);
   const [scriptTypeRecord, setScriptTypeRecord] = useState(null as QRecord)
   const [testScriptDefinitionObject, setTestScriptDefinitionObject] = useState({} as any)
   const [currentVersionId , setCurrentVersionId] = useState(null as number);
   const [notFoundMessage, setNotFoundMessage] = useState(null);
   const [selectedTab, setSelectedTab] = useState(0);
   const [editorProps, setEditorProps] = useState(null as ScriptEditorProps);
   const [successText, setSuccessText] = useState(null as string);
   const [failText, setFailText] = useState(null as string)
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [loadingSelectedVersion, _] = useState(new LoadingState(forceUpdate, "loading"));

   if (!asyncLoadInited)
   {
      setAsyncLoadInited(true);

      (async () =>
      {
         try
         {
            setMetaData(await qController.loadMetaData());

            const scriptRecord = await qController.get("script", scriptId);
            setScriptRecord(scriptRecord);

            setScriptTypeRecord(await qController.get("scriptType", scriptRecord.values.get("scriptTypeId")));

            if(testInputFields !== null || testOutputFields !== null)
            {
               setTestScriptDefinitionObject({testInputFields: testInputFields, testOutputFields: testOutputFields});
            }
            else
            {
               setTestScriptDefinitionObject({testInputFields: [
                  new QFieldMetaData({name: "recordPrimaryKeyList", label: "Record Primary Key List"})
               ], testOutputFields: []})
            }

            const criteria = [new QFilterCriteria("scriptId", QCriteriaOperator.EQUALS, [scriptId])];
            const orderBys = [new QFilterOrderBy("sequenceNo", false)];
            const filter = new QQueryFilter(criteria, orderBys);
            const versions = await qController.query("scriptRevision", filter, 25, 0);
            console.log("Fetched versions:");
            console.log(versions);
            setVersionRecordList(versions);

            if(versions && versions.length > 0)
            {
               setCurrentVersionId(versions[0].values.get("id"));
               const latestVersion = await qController.get("scriptRevision", versions[0].values.get("id"));
               console.log("Fetched latestVersion:");
               console.log(latestVersion);
               setSelectedVersionRecord(latestVersion);
               loadingSelectedVersion.setNotLoading();
               forceUpdate();
            }
         }
         catch (e)
         {
            if (e instanceof QException)
            {
               if ((e as QException).status === "404")
               {
                  setNotFoundMessage("Script code could not be found.");
                  return;
               }
            }
            setNotFoundMessage("Error loading Script code: " + e);
         }
      })();
   }

   const editData = (selectedVersionRecord: QRecord) =>
   {
      const editorProps = {} as ScriptEditorProps;
      editorProps.title = (selectedVersionRecord ? "Editing Code for Script: " : "Initializing Code for Script: ") + scriptRecord?.values?.get("name");
      editorProps.scriptRevisionRecord = selectedVersionRecord;
      editorProps.scriptId = scriptId;
      editorProps.tableName = associatedScriptTableName;
      editorProps.fieldName = associatedScriptFieldName;
      editorProps.recordId = associatedScriptRecordId;
      editorProps.scriptDefinition = testScriptDefinitionObject;
      editorProps.scriptTypeRecord = scriptTypeRecord;
      setEditorProps(editorProps);
   };

   const closeEditingScript = (event: object, reason: string, alert: string = null) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      if (reason === "saved")
      {
         setAsyncLoadInited(false);
         forceUpdate();

         if (alert)
         {
            setSuccessText(alert);
         }
      }
      else if (reason === "failed")
      {
         setAsyncLoadInited(false);
         forceUpdate();

         if (alert)
         {
            setFailText(alert);
         }
      }

      setEditorProps(null);
   };

   const changeTab = (newValue: number) =>
   {
      setSelectedTab(newValue);
      forceUpdate();
   };

   const selectVersion = (version: QRecord) =>
   {
      (async () =>
      {
         setCurrentVersionId(version.values.get("id"));
         loadingSelectedVersion.setLoading();

         // fetch the full version
         const selectedVersion = await qController.get("scriptRevision", version.values.get("id"));
         console.log("Fetched selectedVersion:");
         console.log(selectedVersion);
         setSelectedVersionRecord(selectedVersion);
         loadingSelectedVersion.setNotLoading();
         forceUpdate();
      })();
   };

   function getVersionsList(versionRecordList: QRecord[], selectedVersionRecord: QRecord)
   {
      return <List sx={{pl: 3, height: "400px", overflow: "auto"}}>
         {
            (versionRecordList == null || versionRecordList.length == 0) ?
               <Typography variant="body2">
                  There are not any versions of this script.
               </Typography>
               : <></>
         }
         {
            versionRecordList?.map((version: any) =>
            {
               const timeAuthorLine = `${ValueUtils.formatDateTime(version.values.get("createDate"))} by ${version.values.get("author")}`;
               const apiLine = `API: ${version.displayValues.get("apiName") ?? "None"} version ${version.displayValues.get("apiVersion") ?? "None"}`;

               return (
                  <React.Fragment key={version.values.get("id")}>
                     <ListItem sx={{p: 1}} alignItems="flex-start" selected={selectedVersionRecord?.values?.get("id") == version.values.get("id")} onClick={(event) => selectVersion(version)}>
                        <ListItemAvatar>
                           <Avatar sx={{bgcolor: DeveloperModeUtils.revToColor("", scriptId, version.values.get("sequenceNo"))}}>{`${version.values.get("sequenceNo")}`}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                           primaryTypographyProps={{fontSize: "1rem"}}
                           secondaryTypographyProps={{fontSize: ".85rem"}}
                           primary={
                              <div style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} title={version.values.get("commitMessage")}>
                                 {scriptRecord.values.get("currentScriptRevisionId") == version?.values?.get("id") && <Chip label="CURRENT" color="success" variant="outlined" size="small" sx={{mr: 1, fontSize: "0.75rem"}} />}
                                 {version.values.get("commitMessage")}
                              </div>
                           }
                           secondary={
                              <>
                                 <div style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} title={timeAuthorLine}>
                                    {timeAuthorLine}
                                 </div>
                                 {
                                    (version.displayValues.get("apiName") || version.displayValues.get("apiVersion")) &&
                                    <div style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} title={apiLine}>
                                       {apiLine}
                                    </div>
                                 }
                              </>
                           }
                        />
                     </ListItem>
                     <Divider sx={{my: 0.5}} variant="inset" component="li" />
                  </React.Fragment>
               );
            })
         }
      </List>;
   }

   const getScriptLogs = (scriptRevisionId: number) =>
   {
      if(!scriptLogs[scriptRevisionId])
      {
         (async () =>
         {
            scriptLogs[scriptRevisionId] = await qController.query("scriptLog", new QQueryFilter([new QFilterCriteria("scriptRevisionId", QCriteriaOperator.EQUALS, [scriptRevisionId])]), 100, 0);
            setScriptLogs(scriptLogs);
            forceUpdate();
         })();
         return <Typography variant="body2" p={3}>Loading...</Typography>;
      }

      const logs = scriptLogs[scriptRevisionId] as any[];
      if (logs === null || logs === undefined)
      {
         return <Typography variant="body2" p={3}>Loading...</Typography>;
      }

      if (logs.length === 0)
      {
         return <Typography variant="body2" p={3}>No logs available for this version.</Typography>;
      }

      return (<ScriptLogsView logs={logs} />);
   }

   let editButtonTooltip = "";
   let editButtonText = "Create New Version";
   if (currentVersionId)
   {
      if (currentVersionId === scriptRecord?.values?.get("currentScriptRevisionId"))
      {
         editButtonTooltip = "If you make any changes to this script, a new version will be created when you hit Save.";
         editButtonText = "Edit";
      }
      else
      {
         editButtonTooltip = "If you want to make this previous version active, bring up the Edit window, make any changes " +
            "to the old version if they are needed, then click Save. A new version will be created, and set as current.";
         editButtonText = "Edit and Activate";
      }
   }

   function buildScriptLogFilter(scriptRevisionId: any)
   {
      return JSON.stringify(new QQueryFilter([new QFilterCriteria("scriptRevisionId", QCriteriaOperator.EQUALS, [scriptRevisionId])]));
   }

   /*
    position: relative;
    left: -356px;
    width: calc(100% + 380px);
   */

   return (
      <Grid container>
         <Grid item xs={12}>
            <Box>
               {
                  notFoundMessage
                     ?
                     <Box>{notFoundMessage}</Box>
                     :
                     <Box>
                        {
                           successText ? (
                              <Snackbar open={successText !== null && successText !== ""} autoHideDuration={6000} onClose={() => setSuccessText(null)} anchorOrigin={{vertical: "top", horizontal: "center"}}>
                                 <Alert color="success" onClose={() => setSuccessText(null)}>
                                    {successText}
                                 </Alert>
                              </Snackbar>
                           ) : ("")
                        }
                        {
                           failText ? (
                              <Snackbar open={failText !== null && failText !== ""} autoHideDuration={6000} onClose={() => setFailText(null)} anchorOrigin={{vertical: "top", horizontal: "center"}}>
                                 <Alert color="error" onClose={() => setFailText(null)}>
                                    {failText}
                                 </Alert>
                              </Snackbar>
                           ) : ("")
                        }

                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <>
                                 <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mt={-6}>
                                    <Typography variant="h5" p={2}></Typography>
                                    <Tabs
                                       sx={{m: 1}}
                                       value={selectedTab}
                                       onChange={(event, newValue) => changeTab(newValue)}
                                       variant="standard"
                                    >
                                       <Tab label="Code" id="simple-tab-0" aria-controls="simple-tabpanel-0" sx={{width: "100px"}} />
                                       <Tab label="Logs" id="simple-tab-1" aria-controls="simple-tabpanel-1" sx={{width: "100px"}} />
                                       <Tab label="Test" id="simple-tab-1" aria-controls="simple-tabpanel-2" sx={{width: "100px"}} />
                                       <Tab label="Docs" id="simple-tab-1" aria-controls="simple-tabpanel-3" sx={{width: "100px"}} />
                                    </Tabs>
                                 </Box>

                                 <TabPanel index={0} value={selectedTab}>
                                    <Grid container>
                                       <Grid item xs={4}>
                                          <Box display="flex" alignItems="center" gap={2} pb={1} height="40px">
                                             <Typography variant="h6" pl={3}>Versions</Typography>
                                          </Box>
                                          {getVersionsList(versionRecordList, selectedVersionRecord)}
                                       </Grid>

                                       <Grid item xs={8}>
                                          <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} pb={1} height="40px">
                                             {
                                                selectedVersionRecord ?
                                                   <Typography variant="h6">
                                                      Version {selectedVersionRecord.values.get("sequenceNo")}
                                                      {
                                                         currentVersionId === scriptRecord.values.get("currentScriptRevisionId")
                                                            ? (<> (Current)</>)
                                                            : <></>
                                                      }
                                                   </Typography>
                                                   : <></>
                                             }
                                             <CustomWidthTooltip title={editButtonTooltip}>
                                                <Button sx={{py: 0}} onClick={() => editData(selectedVersionRecord)}>
                                                   {editButtonText}
                                                </Button>
                                             </CustomWidthTooltip>
                                          </Box>
                                          {
                                             loadingSelectedVersion.isNotLoading() && selectedVersionRecord && selectedVersionRecord.values.get("contents") ? (
                                                <>
                                                   <AceEditor
                                                      mode="javascript"
                                                      theme="github"
                                                      name={"viewData"}
                                                      readOnly
                                                      highlightActiveLine={false}
                                                      editorProps={{$blockScrolling: true}}
                                                      setOptions={{useWorker: false}}
                                                      width="100%"
                                                      height="400px"
                                                      value={selectedVersionRecord?.values?.get("contents")}
                                                   />
                                                </>
                                             ) : null
                                          }
                                          {
                                             loadingSelectedVersion.isLoadingSlow() && <Box fontSize="14px" pl={3}>Loading...</Box>
                                          }
                                       </Grid>
                                    </Grid>
                                 </TabPanel>

                                 <TabPanel index={1} value={selectedTab}>
                                    <Grid container height="440px">
                                       <Grid item xs={4}>
                                          <Box display="flex" alignItems="center" gap={2} pb={1} height="40px">
                                             <Typography variant="h6" pl={3}>Versions</Typography>
                                          </Box>
                                          {getVersionsList(versionRecordList, selectedVersionRecord)}
                                       </Grid>
                                       <Grid item xs={8}>
                                          {
                                             selectedVersionRecord ? (
                                                <>
                                                   <Box display="flex" alignItems="center" gap={2} pb={1} height="40px">
                                                      <Typography variant="h6">Script Logs (Version {selectedVersionRecord?.values.get("sequenceNo")})</Typography>
                                                      <Link style={{fontSize: "1rem"}} to={`${metaData.getTablePathByName("scriptLog")}?filter=${buildScriptLogFilter(selectedVersionRecord?.values.get("id"))}`}>View All</Link>
                                                   </Box>
                                                   <Box height="400px" overflow="auto">
                                                      {getScriptLogs(selectedVersionRecord.values.get("id"))}
                                                   </Box>
                                                </>
                                             ) : <Box>Select a version to view logs</Box>
                                          }
                                       </Grid>
                                    </Grid>
                                 </TabPanel>

                                 <TabPanel index={2} value={selectedTab}>
                                    <Box sx={{height: "455px"}} px={2} pb={1}>
                                       <ScriptTestForm scriptId={scriptId}
                                          scriptDefinition={testScriptDefinitionObject}
                                          tableName={associatedScriptTableName}
                                          fieldName={associatedScriptFieldName}
                                          recordId={associatedScriptRecordId}
                                          code={selectedVersionRecord?.values.get("contents")}
                                          apiName={selectedVersionRecord?.values.get("apiName")}
                                          apiVersion={selectedVersionRecord?.values.get("apiVersion")} />
                                    </Box>
                                 </TabPanel>

                                 <TabPanel index={3} value={selectedTab}>
                                    <Box sx={{height: "455px"}} px={2} pb={1}>
                                       <ScriptDocsForm helpText={scriptTypeRecord?.values.get("helpText")} exampleCode={scriptTypeRecord?.values.get("sampleCode")} />
                                    </Box>
                                 </TabPanel>
                              </>
                           </Grid>
                        </Grid>

                        {
                           editorProps &&
                           <Modal open={editorProps !== null} onClose={(event, reason) => closeEditingScript(event, reason)}>
                              <ScriptEditor
                                 closeCallback={closeEditingScript}
                                 {... editorProps}
                              />
                           </Modal>
                        }

                     </Box>
               }
            </Box>
         </Grid>
      </Grid>
   );
}
