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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import React from "react";
import AceEditor from "react-ace";

interface Props
{
   helpText: string;
   exampleCode: string;
   aceEditorHeight: string
}

ScriptDocsForm.defaultProps = {
   aceEditorHeight: "100%",
};

function ScriptDocsForm({helpText, exampleCode, aceEditorHeight}: Props): JSX.Element
{

   const oneBlock = (name: string, mode: string, heading: string, code: string): JSX.Element =>
   {
      return (
         <Grid item xs={6} height="100%">
            <Box gap={2} pb={1} pr={2} height="100%">
               <Card sx={{width: "100%", height: "100%"}}>
                  <Typography variant="h6" p={2} pb={1}>{heading}</Typography>
                  <Box className="devDocumentation" height="100%">
                     <Typography variant="body2" sx={{maxWidth: "1200px", margin: "auto", height: "100%"}}>
                        <AceEditor
                           mode={mode}
                           theme="github"
                           name={name}
                           editorProps={{$blockScrolling: true}}
                           setOptions={{useWorker: false}}
                           value={code}
                           readOnly
                           highlightActiveLine={false}
                           width="100%"
                           showPrintMargin={false}
                           height="100%"
                           style={{borderBottomRightRadius: "1rem", borderBottomLeftRadius: "1rem"}}
                        />
                     </Typography>
                  </Box>
               </Card>
            </Box>
         </Grid>
      )
   }

   return (
      <Grid container spacing={2} height="100%">
         {oneBlock("helpText", "text", "Documentation", helpText)}
         {oneBlock("exampleCode", "javascript", "Example Code", exampleCode)}
      </Grid>
   );
}

export default ScriptDocsForm;

