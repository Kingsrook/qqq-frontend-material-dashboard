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

import {QController} from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {FiberManualRecord} from "@mui/icons-material";
import {Alert} from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {GridFilterModel, GridSortItem} from "@mui/x-data-grid-pro";
import FormData from "form-data";
import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {QCancelButton, QDeleteButton, QSaveButton, QSavedFiltersMenuButton} from "qqq/components/buttons/DefaultButtons";
import FilterUtils from "qqq/utils/qqq/FilterUtils";

interface Props
{
   qController: QController;
   metaData: QInstance;
   tableMetaData: QTableMetaData;
   currentSavedFilter: QRecord;
   filterModel?: GridFilterModel;
   columnSortModel?: GridSortItem[];
   filterOnChangeCallback?: (selectedSavedFilterId: number) => void;
}

function SavedFilters({qController, metaData, tableMetaData, currentSavedFilter, filterModel, columnSortModel, filterOnChangeCallback}: Props): JSX.Element
{
   const navigate = useNavigate();

   const [savedFilters, setSavedFilters] = useState([] as QRecord[]);
   const [savedFiltersMenu, setSavedFiltersMenu] = useState(null);
   const [savedFiltersHaveLoaded, setSavedFiltersHaveLoaded] = useState(false);
   const [filterIsModified, setFilterIsModified] = useState(false);

   const [saveFilterPopupOpen, setSaveFilterPopupOpen] = useState(false);
   const [isSaveFilterAs, setIsSaveFilterAs] = useState(false);
   const [isRenameFilter, setIsRenameFilter] = useState(false);
   const [isDeleteFilter, setIsDeleteFilter] = useState(false);
   const [savedFilterNameInputValue, setSavedFilterNameInputValue] = useState(null as string);
   const [popupAlertContent, setPopupAlertContent] = useState("");

   const anchorRef = useRef<HTMLDivElement>(null);
   const location = useLocation();
   const [saveOptionsOpen, setSaveOptionsOpen] = useState(false);

   const SAVE_OPTION = "Save...";
   const DUPLICATE_OPTION = "Duplicate...";
   const RENAME_OPTION = "Rename...";
   const DELETE_OPTION = "Delete...";
   const CLEAR_OPTION = "Clear Current Filter";
   const dropdownOptions = [DUPLICATE_OPTION, RENAME_OPTION, DELETE_OPTION, CLEAR_OPTION];

   const openSavedFiltersMenu = (event: any) => setSavedFiltersMenu(event.currentTarget);
   const closeSavedFiltersMenu = () => setSavedFiltersMenu(null);

   //////////////////////////////////////////////////////////////////////////
   // load filters on first run, then monitor location or metadata changes //
   //////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      loadSavedFilters()
         .then(() =>
         {
            if (currentSavedFilter != null)
            {
               let qFilter = FilterUtils.buildQFilterFromGridFilter(filterModel, columnSortModel);
               setFilterIsModified(JSON.stringify(qFilter) !== currentSavedFilter.values.get("filterJson"));
            }

            setSavedFiltersHaveLoaded(true);
         });
   }, [location , tableMetaData, currentSavedFilter, filterModel, columnSortModel])



   /*******************************************************************************
    ** make request to load all saved filters from backend
    *******************************************************************************/
   async function loadSavedFilters()
   {
      if (! tableMetaData)
      {
         return;
      }

      const formData = new FormData();
      formData.append("tableName", tableMetaData.name);

      let savedFilters = await makeSavedFilterRequest("querySavedFilter", formData);
      setSavedFilters(savedFilters);
   }



   /*******************************************************************************
    ** fired when a saved record is clicked from the dropdown
    *******************************************************************************/
   const handleSavedFilterRecordOnClick = async (record: QRecord) =>
   {
      setSaveFilterPopupOpen(false);
      closeSavedFiltersMenu();
      filterOnChangeCallback(record.values.get("id"));
      navigate(`${metaData.getTablePathByName(tableMetaData.name)}/savedFilter/${record.values.get("id")}`);
   };



   /*******************************************************************************
    ** fired when a save option is selected from the save... button/dropdown combo
    *******************************************************************************/
   const handleDropdownOptionClick = (optionName: string) =>
   {
      setSaveOptionsOpen(false);
      setPopupAlertContent(null);
      closeSavedFiltersMenu();
      setSaveFilterPopupOpen(true);
      setIsSaveFilterAs(false);
      setIsRenameFilter(false);
      setIsDeleteFilter(false)

      switch(optionName)
      {
         case SAVE_OPTION:
            break;
         case DUPLICATE_OPTION:
            setIsSaveFilterAs(true);
            break;
         case CLEAR_OPTION:
            setSaveFilterPopupOpen(false)
            filterOnChangeCallback(null);
            navigate(metaData.getTablePathByName(tableMetaData.name));
            break;
         case RENAME_OPTION:
            if(currentSavedFilter != null)
            {
               setSavedFilterNameInputValue(currentSavedFilter.values.get("label"));
            }
            setIsRenameFilter(true);
            break;
         case DELETE_OPTION:
            setIsDeleteFilter(true)
            break;
      }
   }



   /*******************************************************************************
    ** fired when save or delete button saved on confirmation dialogs
    *******************************************************************************/
   async function handleFilterDialogButtonOnClick()
   {
      try
      {
         const formData = new FormData();
         if (isDeleteFilter)
         {
            formData.append("id", currentSavedFilter.values.get("id"));
            await makeSavedFilterRequest("deleteSavedFilter", formData);
            await(async() =>
            {
               handleDropdownOptionClick(CLEAR_OPTION);
            })();
         }
         else
         {
            formData.append("tableName", tableMetaData.name);
            formData.append("filterJson", JSON.stringify(FilterUtils.buildQFilterFromGridFilter(filterModel, columnSortModel)));

            if (isSaveFilterAs || isRenameFilter || currentSavedFilter == null)
            {
               formData.append("label", savedFilterNameInputValue);
               if(currentSavedFilter != null && isRenameFilter)
               {
                  formData.append("id", currentSavedFilter.values.get("id"));
               }
            }
            else
            {
               formData.append("id", currentSavedFilter.values.get("id"));
               formData.append("label", currentSavedFilter?.values.get("label"));
            }
            const recordList = await makeSavedFilterRequest("storeSavedFilter", formData);
            await(async() =>
            {
               if (recordList && recordList.length > 0)
               {
                  setSavedFiltersHaveLoaded(false);
                  loadSavedFilters();
                  handleSavedFilterRecordOnClick(recordList[0]);
               }
            })();
         }
      }
      catch (e: any)
      {
         setPopupAlertContent(JSON.stringify(e.message));
      }
   }



   /*******************************************************************************
    ** hides/shows the save options
    *******************************************************************************/
   const handleToggleSaveOptions = () =>
   {
      setSaveOptionsOpen((prevOpen) => !prevOpen);
   };



   /*******************************************************************************
    ** closes save options menu (on clickaway)
    *******************************************************************************/
   const handleSaveOptionsMenuClose = (event: Event) =>
   {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement))
      {
         return;
      }

      setSaveOptionsOpen(false);
   };



   /*******************************************************************************
    ** stores the current dialog input text to state
    *******************************************************************************/
   const handleSaveFilterInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
   {
      setSavedFilterNameInputValue(event.target.value);
   };



   /*******************************************************************************
    ** closes current dialog
    *******************************************************************************/
   const handleSaveFilterPopupClose = () =>
   {
      setSaveFilterPopupOpen(false);
   };



   /*******************************************************************************
    ** make a request to the backend for various savedFilter processes
    *******************************************************************************/
   async function makeSavedFilterRequest(processName: string, formData: FormData): Promise<QRecord[]>
   {
      /////////////////////////
      // fetch saved filters //
      /////////////////////////
      let savedFilters = [] as QRecord[]
      try
      {
         //////////////////////////////////////////////////////////////////
         // we don't want this job to go async, so, pass a large timeout //
         //////////////////////////////////////////////////////////////////
         formData.append("_qStepTimeoutMillis", 60 * 1000);

         const formDataHeaders = {
            "content-type": "multipart/form-data; boundary=--------------------------320289315924586491558366",
         };

         const processResult = await qController.processInit(processName, formData, formDataHeaders);
         if (processResult instanceof QJobError)
         {
            const jobError = processResult as QJobError;
            throw(jobError.error);
         }
         else
         {
            const result = processResult as QJobComplete;
            if(result.values.savedFilterList)
            {
               for (let i = 0; i < result.values.savedFilterList.length; i++)
               {
                  const qRecord = new QRecord(result.values.savedFilterList[i]);
                  savedFilters.push(qRecord);
               }
            }
         }
      }
      catch (e)
      {
         throw(e);
      }

      return (savedFilters);
   }

   const hasStorePermission = metaData?.processes.has("storeSavedFilter");
   const hasDeletePermission = metaData?.processes.has("deleteSavedFilter");
   const hasQueryPermission = metaData?.processes.has("querySavedFilter");

   const renderSavedFiltersMenu = tableMetaData && (
      <Menu
         anchorEl={savedFiltersMenu}
         anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
         }}
         transformOrigin={{
            vertical: "top",
            horizontal: "left",
         }}
         open={Boolean(savedFiltersMenu)}
         onClose={closeSavedFiltersMenu}
         keepMounted
      >
         <MenuItem sx={{width: "300px"}}><b>Filter Actions</b></MenuItem>
         {
            hasStorePermission &&
            <MenuItem onClick={() => handleDropdownOptionClick(SAVE_OPTION)}>
               <ListItemIcon><Icon>save</Icon></ListItemIcon>
               Save...
            </MenuItem>
         }
         {
            hasStorePermission &&
            <MenuItem disabled={currentSavedFilter === null} onClick={() => handleDropdownOptionClick(RENAME_OPTION)}>
               <ListItemIcon><Icon>edit</Icon></ListItemIcon>
               Rename...
            </MenuItem>
         }
         {
            hasStorePermission &&
            <MenuItem disabled={currentSavedFilter === null} onClick={() => handleDropdownOptionClick(DUPLICATE_OPTION)}>
               <ListItemIcon><Icon>content_copy</Icon></ListItemIcon>
               Duplicate...
            </MenuItem>
         }
         {
            hasDeletePermission &&
            <MenuItem disabled={currentSavedFilter === null} onClick={() => handleDropdownOptionClick(DELETE_OPTION)}>
               <ListItemIcon><Icon>delete</Icon></ListItemIcon>
               Delete...
            </MenuItem>
         }
         {
            <MenuItem disabled={currentSavedFilter === null} onClick={() => handleDropdownOptionClick(CLEAR_OPTION)}>
               <ListItemIcon><Icon>clear</Icon></ListItemIcon>
               Clear Current Filter
            </MenuItem>
         }
         <Divider/>
         <MenuItem><b>Your Filters</b></MenuItem>
         {
            savedFilters && savedFilters.length > 0 ? (
               savedFilters.map((record: QRecord, index: number) =>
                  <MenuItem sx={{paddingLeft: "50px"}} key={`savedFiler-${index}`} onClick={() => handleSavedFilterRecordOnClick(record)}>
                     {record.values.get("label")}
                  </MenuItem>
               )
            ): (
               <MenuItem >
                  <i>No filters have been saved for this table.</i>
               </MenuItem>
            )
         }
      </Menu>
   );

   return (
      hasQueryPermission && tableMetaData ? (
         <Box display="flex" flexGrow={1}>
            <QSavedFiltersMenuButton isOpen={savedFiltersMenu} onClickHandler={openSavedFiltersMenu} />
            {renderSavedFiltersMenu}
            <Box display="flex" justifyContent="center" flexDirection="column">
               <Box pl={2} pr={2} sx={{display: "flex", alignItems: "center"}}>
                  {
                     savedFiltersHaveLoaded && currentSavedFilter && (
                        <Typography mr={2} variant="h6">Current Filter:&nbsp;
                           <span style={{fontWeight: "initial"}}>
                              {currentSavedFilter.values.get("label")}
                              {
                                 filterIsModified && (
                                    <Tooltip sx={{cursor: "pointer"}} title={"The current filter has been modified, click \"Save...\" to save the changes."}>
                                       <FiberManualRecord sx={{color: "orange", paddingLeft: "2px", paddingTop: "4px"}} />
                                    </Tooltip>
                                 )
                              }
                           </span>
                        </Typography>
                     )
                  }
               </Box>
            </Box>
            {
               <Dialog
                  open={saveFilterPopupOpen}
                  onClose={handleSaveFilterPopupClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
               >
                  {
                     currentSavedFilter ? (
                        isDeleteFilter ? (
                           <DialogTitle id="alert-dialog-title">Delete Filter</DialogTitle>
                        ) : (
                           isSaveFilterAs ? (
                              <DialogTitle id="alert-dialog-title">Save Filter As</DialogTitle>
                           ):(
                              isRenameFilter ? (
                                 <DialogTitle id="alert-dialog-title">Rename Filter</DialogTitle>
                              ):(
                                 <DialogTitle id="alert-dialog-title">Update Existing Filter</DialogTitle>
                              )
                           )
                        )
                     ):(
                        <DialogTitle id="alert-dialog-title">Save New Filter</DialogTitle>
                     )
                  }
                  <DialogContent sx={{width: "500px"}}>
                     {
                        (! currentSavedFilter || isSaveFilterAs || isRenameFilter) && ! isDeleteFilter ? (
                           <Box>
                              {
                                 isSaveFilterAs ? (
                                    <Box mb={3}>Enter a name for this new saved filter.</Box>
                                 ):(
                                    <Box mb={3}>Enter a new name for this saved filter.</Box>
                                 )
                              }
                              <TextField
                                 autoFocus
                                 name="custom-delimiter-value"
                                 placeholder="Filter Name"
                                 label="Filter Name"
                                 inputProps={{width: "100%", maxLength: 100}}
                                 value={savedFilterNameInputValue}
                                 sx={{width: "100%"}}
                                 onChange={handleSaveFilterInputChange}
                                 onFocus={event =>
                                 {
                                    event.target.select();
                                 }}
                              />
                           </Box>
                        ):(
                           isDeleteFilter ? (
                              <Box>Are you sure you want to delete the filter {`'${currentSavedFilter?.values.get("label")}'`}?</Box>

                           ):(
                              <Box>Are you sure you want to update the filter {`'${currentSavedFilter?.values.get("label")}'`} with the current filter criteria?</Box>
                           )
                        )
                     }
                     {popupAlertContent ? (
                        <Box m={1}>
                           <Alert severity="error">{popupAlertContent}</Alert>
                        </Box>
                     ) : ("")}
                  </DialogContent>
                  <DialogActions>
                     <QCancelButton onClickHandler={handleSaveFilterPopupClose} disabled={false} />
                     {
                        isDeleteFilter ?
                           <QDeleteButton onClickHandler={handleFilterDialogButtonOnClick} />
                           :
                           <QSaveButton label="Save" onClickHandler={handleFilterDialogButtonOnClick} disabled={(isSaveFilterAs || currentSavedFilter == null) && savedFilterNameInputValue == null}/>
                     }
                  </DialogActions>
               </Dialog>
            }
         </Box>
      ) : null
   );
}

export default SavedFilters;
