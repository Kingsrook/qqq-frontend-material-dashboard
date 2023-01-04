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


import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import AceEditor from "react-ace";
import {QCancelButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";
import ScriptDocsForm from "qqq/components/scripts/ScriptDocsForm";
import ScriptTestForm from "qqq/components/scripts/ScriptTestForm";
import Client from "qqq/utils/qqq/Client";

interface AssociatedScriptDefinition
{
   testInputFields: QFieldMetaData[];
   testOutputFields: QFieldMetaData[];
   scriptType: any;
}

interface Props
{
   scriptDefinition: AssociatedScriptDefinition;
   tableName: string;
   primaryKey: any;
   fieldName: string;
   titlePrefix: string;
   recordLabel: string;
   scriptName: string;
   code: string;
   closeCallback: any;
}


const qController = Client.getInstance();

function AssociatedScriptEditor({scriptDefinition, tableName, primaryKey, fieldName, titlePrefix, recordLabel, scriptName, code, closeCallback}: Props): JSX.Element
{
   const [closing, setClosing] = useState(false);
   const [updatedCode, setUpdatedCode] = useState(code)
   const [commitMessage, setCommitMessage] = useState("")
   const [openTool, setOpenTool] = useState(null);

   const changeOpenTool = (event: React.MouseEvent<HTMLElement>, newValue: string | null) =>
   {
      setOpenTool(newValue);

      // need this to make Ace recognize new height.
      setTimeout(() =>
      {
         window.dispatchEvent(new Event("resize"))
      }, 100);
   };


   const saveClicked = () =>
   {
      setClosing(true);

      (async () =>
      {
         const rs = await qController.storeRecordAssociatedScript(tableName, primaryKey, fieldName, updatedCode, commitMessage);
         closeCallback(null, "saved", "Saved New " + scriptName);
      })();
   }

   const cancelClicked = () =>
   {
      setClosing(true);
      closeCallback(null, "cancelled");
   }

   const updateCode = (value: string, event: any) =>
   {
      setUpdatedCode(value);
   }

   const updateCommitMessage = (event: React.ChangeEvent<HTMLInputElement>) =>
   {
      setCommitMessage(event.target.value);
   }

   return (
      <Box sx={{position: "absolute", overflowY: "auto", height: "100%", width: "100%"}} p={6}>
         <Card sx={{height: "100%", p: 3}}>

            <Box display="flex" justifyContent="space-between" alignItems="center">
               <Typography variant="h5" pb={1}>
                  {`${titlePrefix}: ${recordLabel} - ${scriptName}`}
               </Typography>

               <Box>
                  <Typography variant="body2" display="inline" pr={1}>
                     Tools:
                  </Typography>
                  <ToggleButtonGroup
                     value={openTool}
                     exclusive
                     onChange={changeOpenTool}
                     size="small"
                     sx={{pb: 1}}
                  >
                     <ToggleButton value="test">Test</ToggleButton>
                     <ToggleButton value="docs">Docs</ToggleButton>
                  </ToggleButtonGroup>
               </Box>
            </Box>

            <Box sx={{height: openTool ? "45%" : "100%"}}>
               <AceEditor
                  mode="javascript"
                  theme="github"
                  name="editor"
                  editorProps={{$blockScrolling: true}}
                  onChange={updateCode}
                  width="100%"
                  height="100%"
                  value={updatedCode}
                  style={{border: "1px solid gray"}}
               />
            </Box>

            {
               openTool &&
               <Box sx={{height: "45%"}} pt={2}>
                  {
                     openTool == "test" && <ScriptTestForm scriptDefinition={scriptDefinition} tableName={tableName} fieldName={fieldName} recordId={primaryKey} code={updatedCode} />
                  }
                  {
                     openTool == "docs" && <ScriptDocsForm helpText={scriptDefinition.scriptType.values.helpText} exampleCode={scriptDefinition.scriptType.values.sampleCode} aceEditorHeight="100%" />
                  }
               </Box>
            }

            <Box pt={1}>
               <Grid container alignItems="flex-end">
                  <Box width="50%">
                     <TextField id="commitMessage" label="Commit Message" variant="standard" fullWidth value={commitMessage} onChange={updateCommitMessage} />
                  </Box>
                  <Grid container justifyContent="flex-end" spacing={3}>
                     <QCancelButton disabled={closing} onClickHandler={cancelClicked} />
                     <QSaveButton disabled={closing} onClickHandler={saveClicked} />
                  </Grid>
               </Grid>
            </Box>
         </Card>
      </Box>
   );
}

export default AssociatedScriptEditor;
