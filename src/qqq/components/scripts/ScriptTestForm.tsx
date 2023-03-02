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
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import MDTypography from "qqq/components/legacy/MDTypography";
import Client from "qqq/utils/qqq/Client";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface AssociatedScriptDefinition
{
   testInputFields: QFieldMetaData[];
   testOutputFields: QFieldMetaData[];
}

interface Props
{
   scriptDefinition: AssociatedScriptDefinition;
   tableName: string;
   fieldName: string;
   recordId: any;
   code: string;
}

ScriptTestForm.defaultProps = {
   // foo: null,
};

const qController = Client.getInstance();

function ScriptTestForm({scriptDefinition, tableName, fieldName, recordId, code}: Props): JSX.Element
{
   const [testInputValues, setTestInputValues] = useState({} as any);
   const [testOutputValues, setTestOutputValues] = useState({} as any);
   const [testException, setTestException] = useState(null as string)
   const [firstRender, setFirstRender] = useState(true);

   if(firstRender)
   {
      setFirstRender(false)
   }

   if(firstRender)
   {
      scriptDefinition.testInputFields.forEach((field: QFieldMetaData) =>
      {
         testInputValues[field.name] = "";
      });
   }

   const testScript = () =>
   {
      const inputValues = new Map<string, any>();
      if (scriptDefinition.testInputFields)
      {
         scriptDefinition.testInputFields.forEach((field: QFieldMetaData) =>
         {
            inputValues.set(field.name, testInputValues[field.name]);
         });
      }

      setTestOutputValues({});
      setTestException(null);

      (async () =>
      {
         const output = await qController.testScript(tableName, recordId, fieldName, code, inputValues);
         console.log("got output:")
         console.log(output);
         console.log(Object.keys(output));
         setTestOutputValues(output.outputObject);
         if(output.exception)
         {
            setTestException(output.exception.message)
            console.log(`set test exception to ${output.exception.message}`);
         }
      })();
   };

   // console.log("Rendering vvv");
   // console.log(`${testOutputValues}`);
   // console.log("Rendering ^^^");

   const handleInputChange = (fieldName: string, newValue: string) =>
   {
      testInputValues[fieldName] = newValue;
      console.log(`Setting ${fieldName} = ${newValue}`);
      setTestInputValues(JSON.parse(JSON.stringify(testInputValues)));
   }

   // console.log(testInputValues);

   return (
      <Grid container spacing={2} height="100%">
         <Grid item xs={6} height="100%">
            <Box gap={2} pb={1} pr={2} height="100%">
               <Card sx={{width: "100%", height: "100%", overflow: "auto"}}>
                  <Box width="100%">
                     <Typography variant="h6" p={2} pb={1}>Test Input</Typography>
                     <Box px={2} pb={2}>
                        {
                           scriptDefinition.testInputFields && testInputValues && scriptDefinition.testInputFields.map((field: QFieldMetaData) =>
                           {
                              return (<TextField
                                 key={field.name}
                                 id={field.name}
                                 label={field.label}
                                 value={testInputValues[field.name]}
                                 variant="standard"
                                 onChange={(event) =>
                                 {
                                    handleInputChange(field.name, event.target.value);
                                 }}
                                 fullWidth
                                 sx={{mb: 2}}
                              />);
                           })
                        }
                     </Box>
                     <div style={{float: "right"}}>
                        <Button onClick={() => testScript()}>Submit</Button>
                     </div>
                  </Box>
               </Card>
            </Box>
         </Grid>
         <Grid item xs={6} height="100%">
            <Box gap={2} pb={1} height="100%">
               <Card sx={{width: "100%", height: "100%", overflow: "auto"}}>
                  <Typography variant="h6" p={2} pl={3} pb={1}>Test Output</Typography>
                  <Box p={3} pt={0}>
                     {
                        testException &&
                        <Typography variant="body2" color="red">
                           {testException}
                        </Typography>
                     }
                     {
                        scriptDefinition.testOutputFields && testOutputValues && scriptDefinition.testOutputFields.map((f: any) =>
                        {
                           const field = new QFieldMetaData(f);
                           console.log(field.name);
                           console.log(testOutputValues[field.name]);
                           return (
                              <Box key={field.name} flexDirection="row" pr={2}>
                                 <Typography variant="button" fontWeight="bold" pr={1}>
                                    {field.label}:
                                 </Typography>
                                 <MDTypography variant="button" fontWeight="regular" color="text">
                                    {ValueUtils.getValueForDisplay(field, testOutputValues[field.name], testOutputValues[field.name], "view")}
                                 </MDTypography>
                              </Box>
                           );
                        })
                     }
                  </Box>
               </Card>
            </Box>
         </Grid>
      </Grid>
   );
}

export default ScriptTestForm;
