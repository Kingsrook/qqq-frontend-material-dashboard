/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2024.  Kingsrook, LLC
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


import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Alert} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Typography from "@mui/material/Typography";
import FormData from "form-data";
import colors from "qqq/assets/theme/base/colors";
import {QCancelButton} from "qqq/components/buttons/DefaultButtons";
import Client from "qqq/utils/qqq/Client";
import React, {useEffect, useReducer, useState} from "react";

interface ShareModalProps
{
   open: boolean;
   onClose: () => void;
   tableMetaData: QTableMetaData;
   record: QRecord;
}

ShareModal.defaultProps = {};


interface CurrentShare
{
   shareId: any;
   scopeId: string;
   audienceType: string;
   audienceId: any;
   audienceLabel: string;
}

interface Scope
{
   id: string;
   label: string;
}

const scopeOptions: Scope[] = [
   {id: "READ_ONLY", label: "Read-Only"},
   {id: "READ_WRITE", label: "Read and Edit"}
];

const defaultScope = scopeOptions[0];

const qController = Client.getInstance();

/*******************************************************************************
 ** component containing a Modal dialog for sharing records
 *******************************************************************************/
export default function ShareModal({open, onClose, tableMetaData, record}: ShareModalProps): JSX.Element
{
   const [statusString, setStatusString] = useState("Loading...");
   const [alert, setAlert] = useState(null as string);

   const [selectedAudienceType, setSelectedAudienceType] = useState(null);
   const [selectedAudienceId, setSelectedAudienceId] = useState(null);
   const [selectedScopeId, setSelectedScopeId] = useState(defaultScope.id);
   const [submitting, setSubmitting] = useState(false);

   const [currentShares, setCurrentShares] = useState([] as CurrentShare[])
   const [needToLoadCurrentShares, setNeedToLoadCurrentShares] = useState(true);
   const [everLoadedCurrentShares, setEverLoadedCurrentShares] = useState(false);

   const [, forceUpdate] = useReducer((x) => x + 1, 0);


   /////////////////////////////////////////////////////////
   // trigger initial load, and post any changes, re-load //
   /////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if(needToLoadCurrentShares)
      {
         loadShares();
      }
   }, [needToLoadCurrentShares]);


   /*******************************************************************************
    **
    *******************************************************************************/
   function close(event: object, reason: string)
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      onClose();
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function handleAudienceChange(event: React.SyntheticEvent, value: any | any[], reason: string)
   {
      if(value)
      {
         const [audienceType, audienceId] = value.id.split(":");
         setSelectedAudienceType(audienceType);
         setSelectedAudienceId(audienceId);
      }
      else
      {
         setSelectedAudienceType(null);
         setSelectedAudienceId(null);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function handleScopeChange(event: React.SyntheticEvent, value: any | any[], reason: string)
   {
      if(value)
      {
         setSelectedScopeId(value.id);
      }
      else
      {
         setSelectedScopeId(null);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   async function editingExistingShareScope(shareId: number, value: any | any[])
   {
      setStatusString("Saving...");
      setAlert(null);

      const formData = new FormData();
      formData.append("tableName", tableMetaData.name);
      formData.append("recordId", record.values.get(tableMetaData.primaryKeyField));
      formData.append("shareId", shareId);
      formData.append("scopeId", value.id);

      const processResult = await qController.processRun("editSharedRecord", formData, null, true);

      if (processResult instanceof QJobError)
      {
         const jobError = processResult as QJobError;
         setStatusString(null);
         setAlert("Error editing shared record: " + jobError.error);
         setSubmitting(false)
      }
      else
      {
         const result = processResult as QJobComplete;
         setStatusString(null);
         setAlert(null);
         setNeedToLoadCurrentShares(true);
         setSubmitting(false)
      }
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   async function loadShares()
   {
      setNeedToLoadCurrentShares(false);

      const formData = new FormData();
      formData.append("tableName", tableMetaData.name);
      formData.append("recordId", record.values.get(tableMetaData.primaryKeyField));
      const processResult = await qController.processRun("getSharedRecords", formData, null, true);

      setStatusString("Loading...");
      setAlert(null)

      if (processResult instanceof QJobError)
      {
         const jobError = processResult as QJobError;
         setStatusString(null);
         setAlert("Error loading: " + jobError.error);
      }
      else
      {
         const result = processResult as QJobComplete;

         const newCurrentShares: CurrentShare[] = [];
         for (let i in result.values["resultList"])
         {
            newCurrentShares.push(result.values["resultList"][i].values);
         }
         setCurrentShares(newCurrentShares);
         setEverLoadedCurrentShares(true);

         setStatusString(null);
         setAlert(null);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   async function saveNewShare()
   {
      setSubmitting(true)
      setStatusString("Saving...");
      setAlert(null);

      const formData = new FormData();
      formData.append("tableName", tableMetaData.name);
      formData.append("recordId", record.values.get(tableMetaData.primaryKeyField));
      formData.append("audienceType", selectedAudienceType);
      formData.append("audienceId", selectedAudienceId);
      formData.append("scopeId", selectedScopeId);

      const processResult = await qController.processRun("insertSharedRecord", formData, null, true);

      if (processResult instanceof QJobError)
      {
         const jobError = processResult as QJobError;
         setStatusString(null);
         setAlert("Error sharing record: " + jobError.error);
         setSubmitting(false)
      }
      else
      {
         const result = processResult as QJobComplete;
         setStatusString(null);
         setAlert(null);
         setNeedToLoadCurrentShares(true);
         setSubmitting(false)
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   async function removeShare(shareId: number)
   {
      setStatusString("Deleting...");
      setAlert(null);

      const formData = new FormData();
      formData.append("tableName", tableMetaData.name);
      formData.append("recordId", record.values.get(tableMetaData.primaryKeyField));
      formData.append("shareId", shareId);

      const processResult = await qController.processRun("deleteSharedRecord", formData, null, true);

      if (processResult instanceof QJobError)
      {
         const jobError = processResult as QJobError;
         setStatusString(null);
         setAlert("Error deleting share: " + jobError.error);
      }
      else
      {
         const result = processResult as QJobComplete;
         setNeedToLoadCurrentShares(true);
         setStatusString(null);
         setAlert(null);
      }
   }


   // todo - need this to be real
   const audienceOptions = [
      {id: "user:1", label: "Darin Kelkhoff"},
      {id: "user:2", label: "Tom Chutterloin"},
      {id: "user:3", label: "Tylers Ample"},
      {id: "user:4", label: "Mames Mames"},
      {id: "group:2", label: "Cold Track Engineering"}
   ];


   /*******************************************************************************
    **
    *******************************************************************************/
   function getScopeOption(scopeId: string): Scope
   {
      for (let scopeOption of scopeOptions)
      {
         if(scopeOption.id == scopeId)
         {
            return (scopeOption);
         }
      }

      return (null);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function renderScopeDropdown(id: string, defaultValue: Scope, onChange: (event: React.SyntheticEvent, value: any | any[], reason: string) => void)
   {
      return (
         <Autocomplete
            id={id}
            disabled={id == "new-share-scope" && submitting}
            renderInput={(params) => (<TextField {...params} label="Scope" variant="outlined" autoComplete="off" type="search" InputProps={{...params.InputProps}} />)}
            options={scopeOptions}
            // @ts-ignore
            defaultValue={defaultValue}
            onChange={onChange}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            // @ts-ignore Property label does not exist on string | {thing with label}
            getOptionLabel={(option) => option.label}
            autoSelect={true}
            autoHighlight={true}
            disableClearable
            fullWidth
            sx={autocompleteSX}
         />
      );
   }

   //////////////////////
   // render the modal //
   //////////////////////
   return (<Modal open={open} onClose={close}>
      <div className="share">
         <Box sx={{position: "absolute", overflowY: "auto", maxHeight: "100%", width: "100%", display: "flex", height: "100%", flexDirection: "column", justifyContent: "center"}}>
            <Card sx={{my: 5, mx: "auto", p: 3}}>

               {/* header */}
               <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h4" pb={1} fontWeight="600">
                     Share {tableMetaData.label}: {record?.recordLabel ?? record?.values?.get(tableMetaData.primaryKeyField) ?? "Unknown"}
                     <Box color={colors.gray.main} pb={"0.5rem"} fontSize={"0.875rem"} fontWeight="400" maxWidth="590px">
                        {/* todo move to helpContent (what do we attach the meta-data too??) */}
                        Select a user or a group to share this record with.
                        You can choose if they should only be able to Read the record, or also make Edits to it.
                     </Box>
                     <Box fontSize={14} maxWidth="590px" pb={1} fontWeight="300">
                        {alert && <Alert color="error" onClose={() => setAlert(null)}>{alert}</Alert>}
                        {statusString}&nbsp;
                     </Box>
                  </Typography>
               </Box>

               {/* body */}
               <Box pb={3} display="flex" flexDirection="column">
                  {/* row for adding a new share */}
                  <Box display="flex" flexDirection="row" alignItems="center">
                     <Box width="350px" pr={2}>
                        <Autocomplete
                           id="new-share-audience"
                           disabled={submitting}
                           renderInput={(params) => (<TextField {...params} label="User or Group" variant="outlined" autoComplete="off" type="search" InputProps={{...params.InputProps}} />)}
                           options={audienceOptions}
                           onChange={handleAudienceChange}
                           isOptionEqualToValue={(option, value) => option.id === value.id}
                           // @ts-ignore Property label does not exist on string | {thing with label}
                           getOptionLabel={(option) => option.label}
                           autoSelect={true}
                           autoHighlight={true}
                           disableClearable
                           fullWidth
                           sx={autocompleteSX}
                        />
                     </Box>
                     <Box width="180px" pr={2}>
                        {renderScopeDropdown("new-share-scope", defaultScope, handleScopeChange)}
                     </Box>
                     <Box>
                        <Tooltip title={selectedAudienceId == null ? "Select a user or group to share with." : null}>
                           <span>
                              <Button disabled={submitting || selectedAudienceId == null} sx={iconButtonSX} onClick={() => saveNewShare()}>
                                 <Icon color={selectedAudienceId == null ? "secondary" : "info"}>save</Icon>
                              </Button>
                           </span>
                        </Tooltip>
                     </Box>
                  </Box>

                  {/* row showing existing shares */}
                  <Box pt={3}>
                     <Box pb="0.25rem">
                        <h5 style={{fontWeight: "600"}}>Current Shares
                           {
                              everLoadedCurrentShares ? <>&nbsp;({currentShares.length})</> : <></>
                           }
                        </h5>
                     </Box>
                     <Box sx={{border: `1px solid ${colors.grayLines.main}`, borderRadius: "1rem", overflow: "auto"}} height="180px" pt="0.5rem">
                        {
                           currentShares.map((share) => (
                              <Box key={share.shareId} display="flex" justifyContent="space-between" alignItems="center" p="0.25rem" fontSize="1rem">
                                 <Box display="flex" alignItems="center">
                                    <Box width="310px" pl="1rem">{share.audienceLabel}</Box>
                                    <Box width="160px">{renderScopeDropdown(`scope-${share.shareId}`, getScopeOption(share.scopeId), (event: React.SyntheticEvent, value: any | any[], reason: string) => editingExistingShareScope(share.shareId, value))}</Box>
                                 </Box>
                                 <Box pr="1rem">
                                    <Button sx={{...iconButtonSX, ...redIconButton}} onClick={() => removeShare(share.shareId)}><Icon>clear</Icon></Button>
                                 </Box>
                              </Box>
                           ))
                        }
                     </Box>
                  </Box>

               </Box>

               {/* footer */}
               <Box display="flex" flexDirection="row" justifyContent="flex-end">
                  <QCancelButton label="Done" iconName="check" onClickHandler={() => close(null, null)} disabled={false} />
               </Box>
            </Card>
         </Box>
      </div>
   </Modal>);

}

const autocompleteSX =
   {
      "& .MuiAutocomplete-input": {padding: "0.125rem 0.5rem !important"},
      "& .MuiOutlinedInput-root": {borderRadius: "0.75rem !important"}
   };

const iconButtonSX =
   {
      border: `1px solid ${colors.grayLines.main} !important`,
      borderRadius: "0.75rem",
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: "400",
      width: "40px",
      minWidth: "40px",
      paddingLeft: 0,
      paddingRight: 0,
      color: colors.secondary.main,
      "&:hover": {color: colors.secondary.main},
      "&:focus": {color: colors.secondary.main},
      "&:focus:not(:hover)": {color: colors.secondary.main},
   };

const redIconButton =
   {
      color: colors.error.main,
      "&:hover": {color: colors.error.main},
      "&:focus": {color: colors.error.main},
      "&:focus:not(:hover)": {color: colors.error.main},
   };

