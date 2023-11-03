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
import {Alert, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import React, {useContext, useReducer, useState} from "react";
import AceEditor from "react-ace";
import {useParams} from "react-router-dom";
import QContext from "QContext";
import ScriptViewer from "qqq/components/widgets/misc/ScriptViewer";
import BaseLayout from "qqq/layouts/BaseLayout";
import Client from "qqq/utils/qqq/Client";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const qController = Client.getInstance();

interface Props
{
   table?: QTableMetaData;
}

RecordDeveloperView.defaultProps =
   {
      table: null,
   };

function RecordDeveloperView({table}: Props): JSX.Element
{
   const {id} = useParams();

   const tableName = table.name;
   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [tableMetaData, setTableMetaData] = useState(null);

   const [record, setRecord] = useState(null as QRecord);
   const [recordJSONObject, setRecordJSONObject] = useState({} as any);
   const [recordJSONString, setRecordJSONString] = useState("");
   const [associatedScripts, setAssociatedScripts] = useState([] as any[]);
   const [notFoundMessage, setNotFoundMessage] = useState(null);

   const [selectedTabs, setSelectedTabs] = useState({} as any);
   const [viewingRevisions, setViewingRevisions] = useState({} as any);
   const [scriptLogs, setScriptLogs] = useState({} as any);

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
         ValueUtils.qInstance = metaData;

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
            setRecordJSONObject(recordJSONObject);
            setRecordJSONString(JSON.stringify(recordJSONObject, null, 3));
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

   const createScript = async (fieldName: string) =>
   {
      const rs = await qController.storeRecordAssociatedScript(tableName, id, fieldName, "// Edit this new script to define its code.", "Initial version");
      record.values.set(fieldName, rs.scriptId);
      forceUpdate();
   };

   return (
      <BaseLayout>
         <Box>
            <Grid container>
               <Grid item xs={12}>
                  <Box mb={3}>
                     {
                        notFoundMessage
                           ? <Box>{notFoundMessage}</Box>
                           :
                           <Box pb={3}>
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
                                          setOptions={{useWorker: false}}
                                          value={recordJSONString}
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
                                          let scriptId = record?.values.get(fieldName);
                                          return (
                                             <div key={fieldName}>
                                                <Card sx={{mb: 3}}>
                                                   <Typography variant="h6" p={2} pl={3} pb={3}>{field?.label}</Typography>

                                                   <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                                                      {scriptId ?
                                                         <ScriptViewer
                                                            scriptId={scriptId}
                                                            associatedScriptTableName={tableName}
                                                            associatedScriptFieldName={fieldName}
                                                            associatedScriptRecordId={id}
                                                            testInputFields={object.testInputFields}
                                                            testOutputFields={object.testOutputFields}
                                                         ></ScriptViewer>
                                                         : <>
                                                            <Box p={3} fontSize={"1rem"}>
                                                               No script has been created in this field for this record at this time.
                                                            </Box>
                                                            <Box>
                                                               <Button onClick={() => createScript(fieldName)}>Create Script</Button>
                                                            </Box>
                                                         </>
                                                      }
                                                   </Box>
                                                </Card>
                                             </div>
                                          );
                                       })
                                    }

                                 </Grid>
                              </Grid>
                           </Box>
                     }
                  </Box>
               </Grid>
            </Grid>
         </Box>
      </BaseLayout>
   );
}

export default RecordDeveloperView;
