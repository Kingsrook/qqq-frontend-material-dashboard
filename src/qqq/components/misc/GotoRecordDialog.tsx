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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {QCancelButton} from "qqq/components/buttons/DefaultButtons";
import MDButton from "qqq/components/legacy/MDButton";
import Client from "qqq/utils/qqq/Client";

interface Props
{
   isOpen: boolean;
   metaData: QInstance;
   tableMetaData: QTableMetaData;
   closeHandler: () => void;
   mayClose: boolean;
}

GotoRecordDialog.defaultProps = {
   mayClose: true
};

const qController = Client.getInstance();

function hasGotoFieldNames(tableMetaData: QTableMetaData): boolean
{
   const mdbMetaData = tableMetaData?.supplementalTableMetaData?.get("materialDashboard");
   if(mdbMetaData && mdbMetaData.gotoFieldNames)
   {
      return (true);
   }

   return (false);
}

function GotoRecordDialog(props: Props): JSX.Element
{
   const fields: QFieldMetaData[] = []

   let pkey = props?.tableMetaData?.fields.get(props?.tableMetaData?.primaryKeyField);
   let addedPkey = false;
   const mdbMetaData = props?.tableMetaData?.supplementalTableMetaData?.get("materialDashboard");
   if(mdbMetaData)
   {
      if(mdbMetaData.gotoFieldNames)
      {
         for(let i = 0; i<mdbMetaData.gotoFieldNames.length; i++)
         {
            // todo - multi-field keys!!
            let fieldName = mdbMetaData.gotoFieldNames[i][0];
            let field = props.tableMetaData.fields.get(fieldName);
            if(field)
            {
               fields.push(field);

               if(field.name == pkey.name)
               {
                  addedPkey = true;
               }
            }
         }
      }
   }

   if(pkey && !addedPkey)
   {
      fields.unshift(pkey);
   }

   const makeInitialValues = () =>
   {
      const rs = {} as {[field: string]: string};
      fields.forEach((field) => rs[field.name] = "");
      return (rs);
   }

   const [error, setError] = useState("");
   const [values, setValues] = useState(makeInitialValues());
   const navigate = useNavigate();

   const handleChange = (fieldName: string, newValue: string) =>
   {
      values[fieldName] = newValue;
      setValues(JSON.parse(JSON.stringify(values)));
   }

   const close = () =>
   {
      setError("");
      setValues(makeInitialValues());
      props.closeHandler();
   }

   const keyPressed = (e: React.KeyboardEvent<HTMLDivElement>) =>
   {
      // @ts-ignore
      const targetId: string = e.target?.id;

      if(e.key == "Esc")
      {
         if(props.mayClose)
         {
            close();
         }
      }
      else if(e.key == "Enter" && targetId?.startsWith("gotoInput-"))
      {
         const index = targetId?.replaceAll("gotoInput-", "");
         document.getElementById("gotoButton-" + index).click();
      }
   }

   const closeRequested = () =>
   {
      if(props.mayClose)
      {
         close();
      }
   }

   const goClicked = async (fieldName: string) =>
   {
      setError("");
      const filter = new QQueryFilter([new QFilterCriteria(fieldName, QCriteriaOperator.EQUALS, [values[fieldName]])], null, "AND", null, 10);
      const queryResult = await qController.query(props.tableMetaData.name, filter)
      if(queryResult.length == 0)
      {
         setError("Record not found.");
         setTimeout(() => setError(""), 3000);
      }
      else if(queryResult.length == 1)
      {
         navigate(`${props.metaData.getTablePathByName(props.tableMetaData.name)}/${queryResult[0].values.get(props.tableMetaData.primaryKeyField)}`);
         close();
      }
      else
      {
         setError("More than 1 record found...");
         setTimeout(() => setError(""), 3000);
      }
   }

   if(props.tableMetaData)
   {
      if (fields.length == 0 && !error)
      {
         setError("This table is not configured for this feature.")
      }
   }

   return (
      <Dialog open={props.isOpen} onClose={() => closeRequested} onKeyPress={(e) => keyPressed(e)} fullWidth maxWidth={"sm"}>
         <DialogTitle>Go To...</DialogTitle>
         <DialogContent>
            {
               fields.map((field, index) =>
                  (
                     <Grid key={field.name} container alignItems="center" py={1}>
                        <Grid item xs={3} textAlign="right" pr={2}>
                           {field.label}
                        </Grid>
                        <Grid item xs={6}>
                           <TextField
                              id={`gotoInput-${index}`}
                              autoFocus={index == 0}
                              autoComplete="off"
                              inputProps={{width: "100%"}}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              value={values[field.name]}
                              sx={{width: "100%"}}
                              onFocus={event => event.target.select()}
                           />
                        </Grid>
                        <Grid item xs={1} pl={2}>
                           <MDButton id={`gotoButton-${index}`} type="submit" variant="gradient" color="info" size="small" onClick={() => goClicked(field.name)} fullWidth startIcon={<Icon>double_arrow</Icon>} disabled={`${values[field.name]}`.length == 0}>
                              Go
                           </MDButton>
                        </Grid>
                     </Grid>
                  ))
            }
            {
               error &&
               <Box color="red">
                  {error}
               </Box>
            }
         </DialogContent>
         {
            ////////////////////////////////////////////////////////////////////////////////////////
            // show the cancel button if allowed - else we need a little spacing, so an empty box //
            ////////////////////////////////////////////////////////////////////////////////////////
            props.mayClose ?
               <DialogActions>
                  <QCancelButton disabled={false} onClickHandler={close} label="Close" />
               </DialogActions>
               : <Box>&nbsp;</Box>
         }
      </Dialog>
   )
}

interface GotoRecordButtonProps
{
   metaData: QInstance;
   tableMetaData: QTableMetaData;
   autoOpen?: boolean;
   buttonVisible?: boolean;
   mayClose?: boolean;
}

GotoRecordButton.defaultProps = {
   autoOpen: false,
   buttonVisible: true,
   mayClose: true
};

export function GotoRecordButton(props: GotoRecordButtonProps): JSX.Element
{
   const [gotoIsOpen, setGotoIsOpen] = useState(props.autoOpen)

   function openGoto()
   {
      setGotoIsOpen(true);
   }

   function closeGoto()
   {
      setGotoIsOpen(false);
   }


   return (
      <React.Fragment>
         {
            props.buttonVisible && hasGotoFieldNames(props.tableMetaData) && <Button onClick={openGoto} >Go To...</Button>
         }
         <GotoRecordDialog metaData={props.metaData} tableMetaData={props.tableMetaData} isOpen={gotoIsOpen} closeHandler={closeGoto} mayClose={props.mayClose} />
      </React.Fragment>
   );
}

export default GotoRecordDialog;
