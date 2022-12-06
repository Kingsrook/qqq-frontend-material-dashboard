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
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Alert, Chip, Icon, ListItem, ListItemAvatar, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, {useContext, useReducer, useState} from "react";
import AceEditor from "react-ace";
import {useParams} from "react-router-dom";
import QContext from "QContext";
import BaseLayout from "qqq/components/BaseLayout";
import CustomWidthTooltip from "qqq/components/CustomWidthTooltip/CustomWidthTooltip";
import AssociatedScriptEditor from "qqq/components/ScriptComponents/AssociatedScriptEditor";
import ScriptDocsForm from "qqq/components/ScriptComponents/ScriptDocsForm";
import ScriptLogsView from "qqq/components/ScriptComponents/ScriptLogsView";
import ScriptTestForm from "qqq/components/ScriptComponents/ScriptTestForm";
import TabPanel from "qqq/components/TabPanel/TabPanel";
import MDBox from "qqq/components/Temporary/MDBox";
import DeveloperModeUtils from "qqq/utils/DeveloperModeUtils";
import QClient from "qqq/utils/QClient";
import QValueUtils from "qqq/utils/QValueUtils";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const qController = QClient.getInstance();

// Declaring props types for ViewForm
interface Props
{
   table?: QTableMetaData;
}

EntityDeveloperView.defaultProps =
   {
      table: null,
   };

function EntityDeveloperView({table}: Props): JSX.Element
{
   const {id} = useParams();

   const tableName = table.name;
   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [tableMetaData, setTableMetaData] = useState(null);

   const [record, setRecord] = useState(null as QRecord);
   const [recordJSON, setRecordJSON] = useState("");
   const [associatedScripts, setAssociatedScripts] = useState([] as any[]);
   const [notFoundMessage, setNotFoundMessage] = useState(null);

   const [selectedTabs, setSelectedTabs] = useState({} as any);
   const [viewingRevisions, setViewingRevisions] = useState({} as any);
   const [scriptLogs, setScriptLogs] = useState({} as any);

   const [editingScript, setEditingScript] = useState(null as any);
   const [alertText, setAlertText] = useState(null as string);

   const {setPageHeader} = useContext(QContext);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

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
         QValueUtils.qInstance = metaData;

         /////////////////////
         // load the record //
         /////////////////////
         let record: QRecord;
         try
         {
            const developerModeData = await qController.getRecordDeveloperMode(tableName, id);
            record = new QRecord(developerModeData.record);
            console.log("Loaded record developer mode.");
            setRecord(record);

            setAssociatedScripts(developerModeData.associatedScripts);

            const recordJSONObject = {} as any;
            for (let key of record.values.keys())
            {
               recordJSONObject[key] = record.values.get(key);
            }
            setRecordJSON(JSON.stringify(recordJSONObject, null, 3));
         }
         catch (e)
         {
            if (e instanceof QException)
            {
               if ((e as QException).status === "404")
               {
                  setNotFoundMessage(`${tableMetaData.label} ${id} could not be found.`);
                  return;
               }
            }
         }

         setPageHeader(record.recordLabel + " Developer Mode");

         forceUpdate();
      })();
   }

   const editScript = (fieldName: string, code: string, object: any) =>
   {
      const editingScript = {} as any;
      editingScript.fieldName = fieldName;
      editingScript.titlePrefix = code ? "Editing Script" : "Creating New Script";
      editingScript.code = code;
      editingScript.scriptDefinitionObject = object;
      setEditingScript(editingScript);
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
         setAssociatedScripts([]);
         viewingRevisions[editingScript.fieldName] = null;
         setViewingRevisions(viewingRevisions);
         forceUpdate();
      }

      if (alert)
      {
         setAlertText(alert);
      }

      setEditingScript(null);
   };

   const changeTab = (newValue: number, fieldName: string) =>
   {
      selectedTabs[fieldName] = newValue;
      setSelectedTabs(selectedTabs);
      forceUpdate();
   };

   const selectRevision = (fieldName: string, revisionId: number) =>
   {
      viewingRevisions[fieldName] = revisionId;
      setViewingRevisions(viewingRevisions);

      scriptLogs[revisionId] = null;
      setScriptLogs(scriptLogs);

      loadRevisionLogs(fieldName, revisionId);

      forceUpdate();
   };

   const loadRevisionLogs = (fieldName: string, revisionId: number) =>
   {
      (async () =>
      {
         const rs = await qController.getRecordAssociatedScriptLogs(tableName, id, fieldName, revisionId);
         scriptLogs[revisionId] = [];
         if (rs["scriptLogRecords"])
         {
            scriptLogs[revisionId] = rs["scriptLogRecords"];
         }
         console.log("Script logs:");
         console.log(scriptLogs[revisionId]);
         setScriptLogs(scriptLogs);
         forceUpdate();
      })();
   };

   function getRevisionsList(scriptRevisions: any, fieldName: any, currentScriptRevisionId: any)
   {
      return <List sx={{pl: 3, height: "400px", overflow: "auto"}}>
         {
            scriptRevisions ? <></> :
               <Typography variant="body2">
                  There are not any versions of this script.
               </Typography>
         }
         {
            scriptRevisions?.map((revision: any) => (
               <React.Fragment key={revision.values.id}>
                  <ListItem sx={{p: 1}} alignItems="flex-start" selected={viewingRevisions[fieldName] == revision.values.id} onClick={(event) => selectRevision(fieldName, revision.values.id)}>
                     <ListItemAvatar>
                        <Avatar sx={{bgcolor: DeveloperModeUtils.revToColor(fieldName, id, revision.values.sequenceNo)}}>{`${revision.values.sequenceNo}`}</Avatar>
                     </ListItemAvatar>
                     <ListItemText
                        primaryTypographyProps={{fontSize: "1rem"}}
                        secondaryTypographyProps={{fontSize: ".85rem"}}
                        primary={
                           <div style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} title={revision.values.commitMessage}>
                              {revision.values.id == currentScriptRevisionId && <Chip label="CURRENT" color="success" variant="outlined" size="small" sx={{mr: 1, fontSize: "0.75rem"}} />}
                              {revision.values.commitMessage}
                           </div>
                        }
                        secondary={
                           <>
                              {QValueUtils.formatDateTime(revision.values.createDate)}
                              <br />
                              {revision.values.author}
                           </>
                        }
                     />
                     <ListItemIcon sx={{minWidth: "auto", px: 1}}><Icon>settings</Icon></ListItemIcon>
                  </ListItem>
                  <Divider sx={{my: 0.5}} variant="inset" component="li" />
               </React.Fragment>
            ))
         }
      </List>;
   }

   function getScriptLogs(revisionId: number)
   {
      const logs = scriptLogs[revisionId] as any[];
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

   return (
      <BaseLayout>
         <MDBox>
            <Grid container>
               <Grid item xs={12}>
                  <MDBox mb={3}>
                     {
                        notFoundMessage
                           ?
                           <MDBox>{notFoundMessage}</MDBox>
                           :
                           <MDBox pb={3}>
                              {
                                 alertText ? (
                                    <Snackbar open={alertText !== null && alertText !== ""} autoHideDuration={6000} onClose={() => setAlertText(null)} anchorOrigin={{vertical: "top", horizontal: "center"}}>
                                       <Alert color="success" onClose={() => setAlertText(null)}>
                                          {alertText}
                                       </Alert>
                                    </Snackbar>
                                 ) : ("")
                              }

                              <Grid container spacing={3}>
                                 <Grid item xs={12} mb={3}>
                                    <Card id="jsonView" sx={{mb: 3}}>
                                       <Typography variant="h5" p={2}>Record Raw Values as JSON</Typography>
                                       <AceEditor
                                          mode="json"
                                          theme="github"
                                          name="recordJSON"
                                          editorProps={{$blockScrolling: true}}
                                          value={recordJSON}
                                          readOnly
                                          width="100%"
                                          showPrintMargin={false}
                                          height="200px"
                                       />
                                    </Card>

                                    {
                                       associatedScripts && associatedScripts.map((object) =>
                                       {
                                          let fieldName = object.associatedScript?.fieldName;
                                          let field = tableMetaData.fields.get(fieldName);

                                          let currentScriptRevisionId = object.script?.values?.currentScriptRevisionId;

                                          if (!selectedTabs[fieldName])
                                          {
                                             selectedTabs[fieldName] = 0;
                                          }

                                          if (!viewingRevisions[fieldName] || viewingRevisions[fieldName] === -1)
                                          {
                                             console.log(`Defaulting revision for ${fieldName} to ${currentScriptRevisionId}`);
                                             viewingRevisions[fieldName] = currentScriptRevisionId;

                                             if (!scriptLogs[currentScriptRevisionId])
                                             {
                                                loadRevisionLogs(fieldName, currentScriptRevisionId);
                                             }
                                          }

                                          const viewingRevisionArray = object.scriptRevisions?.filter((rev: any) => rev?.values?.id === viewingRevisions[fieldName]);
                                          const code = viewingRevisionArray?.length > 0 ? viewingRevisionArray[0].values.contents : "";
                                          const viewingSequenceNo = viewingRevisionArray?.length > 0 ? viewingRevisionArray[0].values.sequenceNo : "";

                                          let editButtonTooltip = "";
                                          let editButtonText = "Create New Script";
                                          if (currentScriptRevisionId)
                                          {
                                             if (currentScriptRevisionId === viewingRevisions[fieldName])
                                             {
                                                editButtonTooltip = "If you make any changes to this script, a new version will be created when you hit Save.";
                                                editButtonText = "Edit";
                                             }
                                             else
                                             {
                                                editButtonTooltip = "If you want to make this previous Version active, bring up the Edit window, make any changes " +
                                                   "to the old Version if they are needed, then click Save. A new Version will be created, and set as Current.";
                                                editButtonText = "Edit and Activate";
                                             }
                                          }


                                          return (
                                             <Card key={fieldName} id={`associatedScript.${fieldName}`} sx={{mb: 3}}>

                                                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                                                   <Typography variant="h5" p={2}>{field?.label}</Typography>
                                                   <Tabs
                                                      sx={{mr: 1}}
                                                      value={selectedTabs[fieldName]}
                                                      onChange={(event, newValue) => changeTab(newValue, fieldName)}
                                                      variant="standard"
                                                   >
                                                      <Tab label="Code" id="simple-tab-0" aria-controls="simple-tabpanel-0" sx={{width: "100px"}} />
                                                      <Tab label="Logs" id="simple-tab-1" aria-controls="simple-tabpanel-1" sx={{width: "100px"}} />
                                                      <Tab label="Test" id="simple-tab-2" aria-controls="simple-tabpanel-2" sx={{width: "100px"}} />
                                                      <Tab label="Docs" id="simple-tab-3" aria-controls="simple-tabpanel-3" sx={{width: "100px"}} />
                                                   </Tabs>
                                                </Box>

                                                <TabPanel index={0} value={selectedTabs[fieldName]}>
                                                   <Grid container>
                                                      <Grid item xs={4}>
                                                         <Box display="flex" alignItems="center" gap={2} pb={1} height="40px">
                                                            <Typography variant="h6" pl={3}>Versions</Typography>
                                                         </Box>
                                                         {getRevisionsList(object.scriptRevisions, fieldName, currentScriptRevisionId)}
                                                      </Grid>

                                                      <Grid item xs={8}>
                                                         <Box display="flex" alignItems="center" gap={2} pb={1} height="40px">
                                                            {
                                                               currentScriptRevisionId &&
                                                               <Typography variant="h6">
                                                                  {
                                                                     currentScriptRevisionId === viewingRevisions[fieldName]
                                                                        ? (<>Current Version ({viewingSequenceNo})</>)
                                                                        : (<>Version {viewingSequenceNo}</>)
                                                                  }
                                                               </Typography>
                                                            }
                                                            <CustomWidthTooltip title={editButtonTooltip}>
                                                               <Button sx={{py: 0}} onClick={() => editScript(fieldName, code, object)}>
                                                                  {editButtonText}
                                                               </Button>
                                                            </CustomWidthTooltip>
                                                         </Box>
                                                         {
                                                            code ? (
                                                               <>
                                                                  <AceEditor
                                                                     mode="javascript"
                                                                     theme="github"
                                                                     name={`view-${fieldName}`}
                                                                     readOnly
                                                                     highlightActiveLine={false}
                                                                     editorProps={{$blockScrolling: true}}
                                                                     width="100%"
                                                                     height="400px"
                                                                     value={code}
                                                                  />
                                                               </>
                                                            ) : null
                                                         }
                                                      </Grid>
                                                   </Grid>
                                                </TabPanel>
                                                <TabPanel index={1} value={selectedTabs[fieldName]}>
                                                   <Grid container height="440px">
                                                      <Grid item xs={4}>
                                                         <Box display="flex" alignItems="center" gap={2} pb={1} height="40px">
                                                            <Typography variant="h6" pl={3}>Versions</Typography>
                                                         </Box>
                                                         {getRevisionsList(object.scriptRevisions, fieldName, currentScriptRevisionId)}
                                                      </Grid>
                                                      <Grid item xs={8}>
                                                         <Box display="flex" alignItems="center" gap={2} pb={1} height="40px">
                                                            <Typography variant="h6" pl={3}>Script Logs (Version {viewingSequenceNo})</Typography>
                                                         </Box>
                                                         <Box height="400px" overflow="auto">
                                                            {getScriptLogs(viewingRevisions[fieldName])}
                                                         </Box>
                                                      </Grid>
                                                   </Grid>
                                                </TabPanel>
                                                <TabPanel index={2} value={selectedTabs[fieldName]}>
                                                   <Box sx={{height: "455px"}} px={2} pb={1}>
                                                      <ScriptTestForm scriptDefinition={object} tableName={tableName} fieldName={fieldName} recordId={id} code={code} />
                                                   </Box>
                                                </TabPanel>

                                                <TabPanel index={3} value={selectedTabs[fieldName]}>
                                                   <Box sx={{height: "455px"}} px={2} pb={1}>
                                                      <ScriptDocsForm helpText={object.scriptType.values.helpText} exampleCode={object.scriptType.values.sampleCode} />
                                                   </Box>
                                                </TabPanel>
                                             </Card>
                                          );
                                       })
                                    }

                                 </Grid>
                              </Grid>

                              {
                                 editingScript &&
                                 <Modal open={editingScript as boolean} onClose={(event, reason) => closeEditingScript(event, reason)}>
                                    <AssociatedScriptEditor
                                       scriptDefinition={editingScript.scriptDefinitionObject}
                                       tableName={tableName}
                                       primaryKey={id}
                                       fieldName={editingScript.fieldName}
                                       titlePrefix={editingScript.titlePrefix}
                                       recordLabel={record.recordLabel}
                                       scriptName={tableMetaData.fields.get(editingScript.fieldName).label}
                                       code={editingScript.code}
                                       closeCallback={closeEditingScript}
                                    />
                                 </Modal>
                              }

                           </MDBox>
                     }
                  </MDBox>
               </Grid>
            </Grid>
         </MDBox>
      </BaseLayout>
   );
}

export default EntityDeveloperView;
