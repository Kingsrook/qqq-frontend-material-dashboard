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


import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import AceEditor from "react-ace";
import {QCancelButton, QSaveButton} from "qqq/components/QButtons";
import QClient from "qqq/utils/QClient";

interface Props
{
   tableName: string;
   primaryKey: any;
   fieldName: string;
   titlePrefix: string;
   recordLabel: string;
   scriptName: string;
   code: string;
   closeCallback: any;
}


const qController = QClient.getInstance();

function AssociatedScriptEditor({tableName, primaryKey, fieldName, titlePrefix, recordLabel, scriptName, code, closeCallback}: Props): JSX.Element
{
   const [closing, setClosing] = useState(false);
   const [updatedCode, setUpdatedCode] = useState(code)
   const [commitMessage, setCommitMessage] = useState("")

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
      <Box sx={{position: "absolute", overflowY: "auto", height: "100%", width: "100%"}} p={12}>
         <Card sx={{height: "100%", p: 3}}>
            <Typography variant="h5" pb={1}>
               {`${titlePrefix}: ${recordLabel} - ${scriptName}`}
            </Typography>

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
