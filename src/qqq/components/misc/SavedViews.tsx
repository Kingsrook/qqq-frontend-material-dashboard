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
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
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
import {TooltipProps} from "@mui/material/Tooltip/Tooltip";
import Typography from "@mui/material/Typography";
import FormData from "form-data";
import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {QCancelButton, QDeleteButton, QSaveButton, QSavedViewsMenuButton} from "qqq/components/buttons/DefaultButtons";
import QQueryColumns from "qqq/models/query/QQueryColumns";
import RecordQueryView from "qqq/models/query/RecordQueryView";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import TableUtils from "qqq/utils/qqq/TableUtils";

interface Props
{
   qController: QController;
   metaData: QInstance;
   tableMetaData: QTableMetaData;
   currentSavedView: QRecord;
   view?: RecordQueryView;
   viewAsJson?: string;
   viewOnChangeCallback?: (selectedSavedViewId: number) => void;
   loadingSavedView: boolean
}

function SavedViews({qController, metaData, tableMetaData, currentSavedView, view, viewAsJson, viewOnChangeCallback, loadingSavedView}: Props): JSX.Element
{
   const navigate = useNavigate();

   const [savedViews, setSavedViews] = useState([] as QRecord[]);
   const [savedViewsMenu, setSavedViewsMenu] = useState(null);
   const [savedViewsHaveLoaded, setSavedViewsHaveLoaded] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [saveFilterPopupOpen, setSaveFilterPopupOpen] = useState(false);
   const [isSaveFilterAs, setIsSaveFilterAs] = useState(false);
   const [isRenameFilter, setIsRenameFilter] = useState(false);
   const [isDeleteFilter, setIsDeleteFilter] = useState(false);
   const [savedViewNameInputValue, setSavedViewNameInputValue] = useState(null as string);
   const [popupAlertContent, setPopupAlertContent] = useState("");

   const anchorRef = useRef<HTMLDivElement>(null);
   const location = useLocation();
   const [saveOptionsOpen, setSaveOptionsOpen] = useState(false);

   const SAVE_OPTION = "Save...";
   const DUPLICATE_OPTION = "Duplicate...";
   const RENAME_OPTION = "Rename...";
   const DELETE_OPTION = "Delete...";
   const CLEAR_OPTION = "New View";
   const dropdownOptions = [DUPLICATE_OPTION, RENAME_OPTION, DELETE_OPTION, CLEAR_OPTION];

   const openSavedViewsMenu = (event: any) => setSavedViewsMenu(event.currentTarget);
   const closeSavedViewsMenu = () => setSavedViewsMenu(null);

   //////////////////////////////////////////////////////////////////////////
   // load filters on first run, then monitor location or metadata changes //
   //////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      loadSavedViews()
         .then(() =>
         {
            setSavedViewsHaveLoaded(true);
         });
   }, [location, tableMetaData, currentSavedView, view]) // todo#elimGrid does this monitoring work??


   /*******************************************************************************
    **
    *******************************************************************************/
   const fieldNameToLabel = (fieldName: string): string =>
   {
      try
      {
         const [fieldMetaData, fieldTable] = TableUtils.getFieldAndTable(tableMetaData, fieldName);
         if(fieldTable.name != tableMetaData.name)
         {
            return (tableMetaData.label + ": " + fieldMetaData.label);
         }

         return (fieldMetaData.label);
      }
      catch(e)
      {
         return (fieldName);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   const diffFilters = (savedView: RecordQueryView, activeView: RecordQueryView, viewDiffs: string[]): void =>
   {
      try
      {
         ////////////////////////////////////////////////////////////////////////////////
         // inner helper function for reporting on the number of criteria for a field. //
         // e.g., will tell us "added criteria X" or "removed 2 criteria on Y"         //
         ////////////////////////////////////////////////////////////////////////////////
         const diffCriteriaFunction = (base: QQueryFilter, compare: QQueryFilter, messagePrefix: string, isCheckForChanged = false) =>
         {
            const baseCriteriaMap: { [name: string]: QFilterCriteria[] } = {};
            base?.criteria?.forEach((criteria) =>
            {
               if(!baseCriteriaMap[criteria.fieldName])
               {
                  baseCriteriaMap[criteria.fieldName] = []
               }
               baseCriteriaMap[criteria.fieldName].push(criteria)
            });

            const compareCriteriaMap: { [name: string]: QFilterCriteria[] } = {};
            compare?.criteria?.forEach((criteria) =>
            {
               if(!compareCriteriaMap[criteria.fieldName])
               {
                  compareCriteriaMap[criteria.fieldName] = []
               }
               compareCriteriaMap[criteria.fieldName].push(criteria)
            });

            for (let fieldName of Object.keys(compareCriteriaMap))
            {
               const noBaseCriteria = baseCriteriaMap[fieldName]?.length ?? 0;
               const noCompareCriteria = compareCriteriaMap[fieldName]?.length ?? 0;

               if(isCheckForChanged)
               {
                  /////////////////////////////////////////////////////////////////////////////////////////////
                  // first - if we're checking for changes to specific criteria (e.g., change id=5 to id<>5, //
                  // or change id=5 to id=6, or change id=5 to id<>7)                                        //
                  // our "sweet spot" is if there's a single criteria on each side of the check              //
                  /////////////////////////////////////////////////////////////////////////////////////////////
                  if(noBaseCriteria == 1 && noCompareCriteria == 1)
                  {
                     const baseCriteria = baseCriteriaMap[fieldName][0]
                     const compareCriteria = compareCriteriaMap[fieldName][0]
                     const baseValuesJSON = JSON.stringify(baseCriteria.values ?? [])
                     const compareValuesJSON = JSON.stringify(compareCriteria.values ?? [])
                     if(baseCriteria.operator != compareCriteria.operator || baseValuesJSON != compareValuesJSON)
                     {
                        viewDiffs.push(`Changed a filter from ${FilterUtils.criteriaToHumanString(tableMetaData, baseCriteria)} to ${FilterUtils.criteriaToHumanString(tableMetaData, compareCriteria)}`)
                     }
                  }
                  else if(noBaseCriteria == noCompareCriteria)
                  {
                     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     // else - if the number of criteria on this field differs, that'll get caught in a non-isCheckForChanged call, so                                     //
                     // todo, i guess - this is kinda weak - but if there's the same number of criteria on a field, then just ... do a shitty JSON compare between them... //
                     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     const baseJSON = JSON.stringify(baseCriteriaMap[fieldName])
                     const compareJSON = JSON.stringify(compareCriteriaMap[fieldName])
                     if(baseJSON != compareJSON)
                     {
                        viewDiffs.push(`${messagePrefix} 1 or more filters on ${fieldNameToLabel(fieldName)}`);
                     }
                  }
               }
               else
               {
                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  // else - we're not checking for changes to individual criteria - rather - we're just checking if criteria were added or removed. //
                  // we'll do that by starting to see if the nubmer of criteria is different.                                                       //
                  // and, only do it in only 1 direction, assuming we'll get called twice, with the base & compare sides flipped                    //
                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  if(noBaseCriteria < noCompareCriteria)
                  {
                     if (noBaseCriteria == 0 && noCompareCriteria == 1)
                     {
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        // if the difference is 0 to 1 (1 to 0 when called in reverse), then we can report the full criteria that was added/removed //
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        viewDiffs.push(`${messagePrefix} filter: ${FilterUtils.criteriaToHumanString(tableMetaData, compareCriteriaMap[fieldName][0])}`)
                     }
                     else
                     {
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        // else, say 0 to 2, or 2 to 1 - just report on how many were changed...                                                //
                        // todo this isn't great, as you might have had, say, (A,B), and now you have (C) - but all we'll say is "removed 1"... //
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        const noDiffs = noCompareCriteria - noBaseCriteria;
                        viewDiffs.push(`${messagePrefix} ${noDiffs} filters on ${fieldNameToLabel(fieldName)}`)
                     }
                  }
               }
            }
         };

         diffCriteriaFunction(savedView.queryFilter, activeView.queryFilter, "Added");
         diffCriteriaFunction(activeView.queryFilter, savedView.queryFilter, "Removed");
         diffCriteriaFunction(savedView.queryFilter, activeView.queryFilter, "Changed", true);

         //////////////////////
         // boolean operator //
         //////////////////////
         if (savedView.queryFilter.booleanOperator != activeView.queryFilter.booleanOperator)
         {
            viewDiffs.push("Changed filter from 'And' to 'Or'")
         }

         ///////////////
         // order-bys //
         ///////////////
         const savedOrderBys = savedView.queryFilter.orderBys;
         const activeOrderBys = activeView.queryFilter.orderBys;
         if (savedOrderBys.length != activeOrderBys.length)
         {
            viewDiffs.push("Changed sort")
         }
         else if (savedOrderBys.length > 0)
         {
            const toWord = ((b: boolean) => b ? "ascending" : "descending");
            if (savedOrderBys[0].fieldName != activeOrderBys[0].fieldName && savedOrderBys[0].isAscending != activeOrderBys[0].isAscending)
            {
               viewDiffs.push(`Changed sort from ${fieldNameToLabel(savedOrderBys[0].fieldName)} ${toWord(savedOrderBys[0].isAscending)} to ${fieldNameToLabel(activeOrderBys[0].fieldName)} ${toWord(activeOrderBys[0].isAscending)}`)
            }
            else if (savedOrderBys[0].fieldName != activeOrderBys[0].fieldName)
            {
               viewDiffs.push(`Changed sort field from ${fieldNameToLabel(savedOrderBys[0].fieldName)} to ${fieldNameToLabel(activeOrderBys[0].fieldName)}`)
            }
            else if (savedOrderBys[0].isAscending != activeOrderBys[0].isAscending)
            {
               viewDiffs.push(`Changed sort direction from ${toWord(savedOrderBys[0].isAscending)} to ${toWord(activeOrderBys[0].isAscending)}`)
            }
         }
      }
      catch(e)
      {
         console.log(`Error looking for differences in filters ${e}`);
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   const diffColumns = (savedView: RecordQueryView, activeView: RecordQueryView, viewDiffs: string[]): void =>
   {
      try
      {
         if(!savedView.queryColumns || !savedView.queryColumns.columns || savedView.queryColumns.columns.length == 0)
         {
            viewDiffs.push("This view did not previously have columns saved with it, so the next time you save it they will be initialized.");
            return;
         }

         ////////////////////////////////////////////////////////////
         // nested function to help diff visible status of columns //
         ////////////////////////////////////////////////////////////
         const diffVisibilityFunction = (base: QQueryColumns, compare: QQueryColumns, messagePrefix: string) =>
         {
            const baseColumnsMap: { [name: string]: boolean } = {};
            base.columns.forEach((column) =>
            {
               if (column.isVisible)
               {
                  baseColumnsMap[column.name] = true;
               }
            });

            const diffFields: string[] = [];
            for (let i = 0; i < compare.columns.length; i++)
            {
               const column = compare.columns[i];
               if(column.isVisible)
               {
                  if (!baseColumnsMap[column.name])
                  {
                     diffFields.push(fieldNameToLabel(column.name));
                  }
               }
            }

            if (diffFields.length > 0)
            {
               if (diffFields.length > 5)
               {
                  viewDiffs.push(`${messagePrefix} ${diffFields.length} columns.`);
               }
               else
               {
                  viewDiffs.push(`${messagePrefix} column${diffFields.length == 1 ? "" : "s"}: ${diffFields.join(", ")}`);
               }
            }
         };

         ///////////////////////////////////////////////////////////
         // nested function to help diff pinned status of columns //
         ///////////////////////////////////////////////////////////
         const diffPinsFunction = (base: QQueryColumns, compare: QQueryColumns, messagePrefix: string) =>
         {
            const baseColumnsMap: { [name: string]: string } = {};
            base.columns.forEach((column) => baseColumnsMap[column.name] = column.pinned);

            const diffFields: string[] = [];
            for (let i = 0; i < compare.columns.length; i++)
            {
               const column = compare.columns[i];
               if (baseColumnsMap[column.name] != column.pinned)
               {
                  diffFields.push(fieldNameToLabel(column.name));
               }
            }

            if (diffFields.length > 0)
            {
               if (diffFields.length > 5)
               {
                  viewDiffs.push(`${messagePrefix} ${diffFields.length} columns.`);
               }
               else
               {
                  viewDiffs.push(`${messagePrefix} column${diffFields.length == 1 ? "" : "s"}: ${diffFields.join(", ")}`);
               }
            }
         };

         ///////////////////////////////////////////////////
         // nested function to help diff width of columns //
         ///////////////////////////////////////////////////
         const diffWidthsFunction = (base: QQueryColumns, compare: QQueryColumns, messagePrefix: string) =>
         {
            const baseColumnsMap: { [name: string]: number } = {};
            base.columns.forEach((column) => baseColumnsMap[column.name] = column.width);

            const diffFields: string[] = [];
            for (let i = 0; i < compare.columns.length; i++)
            {
               const column = compare.columns[i];
               if (baseColumnsMap[column.name] != column.width)
               {
                  diffFields.push(fieldNameToLabel(column.name));
               }
            }

            if (diffFields.length > 0)
            {
               if (diffFields.length > 5)
               {
                  viewDiffs.push(`${messagePrefix} ${diffFields.length} columns.`);
               }
               else
               {
                  viewDiffs.push(`${messagePrefix} column${diffFields.length == 1 ? "" : "s"}: ${diffFields.join(", ")}`);
               }
            }
         };

         diffVisibilityFunction(savedView.queryColumns, activeView.queryColumns, "Turned on ");
         diffVisibilityFunction(activeView.queryColumns, savedView.queryColumns, "Turned off ");
         diffPinsFunction(savedView.queryColumns, activeView.queryColumns, "Changed pinned state for ");

         if(savedView.queryColumns.columns.map(c => c.name).join(",") != activeView.queryColumns.columns.map(c => c.name).join(","))
         {
            viewDiffs.push("Changed the order columns.");
         }

         diffWidthsFunction(savedView.queryColumns, activeView.queryColumns, "Changed width for ");
      }
      catch (e)
      {
         console.log(`Error looking for differences in columns: ${e}`);
      }
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   const diffQuickFilterFieldNames = (savedView: RecordQueryView, activeView: RecordQueryView, viewDiffs: string[]): void =>
   {
      try
      {
         const diffFunction = (base: string[], compare: string[], messagePrefix: string) =>
         {
            const baseFieldNameMap: { [name: string]: boolean } = {};
            base.forEach((name) => baseFieldNameMap[name] = true);
            const diffFields: string[] = [];
            for (let i = 0; i < compare.length; i++)
            {
               const name = compare[i];
               if (!baseFieldNameMap[name])
               {
                  diffFields.push(fieldNameToLabel(name));
               }
            }

            if (diffFields.length > 0)
            {
               viewDiffs.push(`${messagePrefix} basic filter${diffFields.length == 1 ? "" : "s"}: ${diffFields.join(", ")}`);
            }
         }

         diffFunction(savedView.quickFilterFieldNames, activeView.quickFilterFieldNames, "Turned on");
         diffFunction(activeView.quickFilterFieldNames, savedView.quickFilterFieldNames, "Turned off");
      }
      catch (e)
      {
         console.log(`Error looking for differences in quick filter field names: ${e}`);
      }
   }


   let viewIsModified = false;
   let viewDiffs:string[] = [];

   if(currentSavedView != null)
   {
      const savedView = JSON.parse(currentSavedView.values.get("viewJson")) as RecordQueryView;
      const activeView = view;

      diffFilters(savedView, activeView, viewDiffs);
      diffColumns(savedView, activeView, viewDiffs);
      diffQuickFilterFieldNames(savedView, activeView, viewDiffs);

      if(savedView.mode != activeView.mode)
      {
         if(savedView.mode)
         {
            viewDiffs.push(`Mode changed from ${savedView.mode} to ${activeView.mode}`)
         }
         else
         {
            viewDiffs.push(`Mode set to ${activeView.mode}`)
         }
      }

      if(savedView.rowsPerPage != activeView.rowsPerPage)
      {
         if(savedView.rowsPerPage)
         {
            viewDiffs.push(`Rows per page changed from ${savedView.rowsPerPage} to ${activeView.rowsPerPage}`)
         }
         else
         {
            viewDiffs.push(`Rows per page set to ${activeView.rowsPerPage}`)
         }
      }

      if(viewDiffs.length > 0)
      {
         viewIsModified = true;
      }
   }


   /*******************************************************************************
    ** make request to load all saved filters from backend
    *******************************************************************************/
   async function loadSavedViews()
   {
      if (! tableMetaData)
      {
         return;
      }

      const formData = new FormData();
      formData.append("tableName", tableMetaData.name);

      let savedViews = await makeSavedViewRequest("querySavedView", formData);
      setSavedViews(savedViews);
   }



   /*******************************************************************************
    ** fired when a saved record is clicked from the dropdown
    *******************************************************************************/
   const handleSavedViewRecordOnClick = async (record: QRecord) =>
   {
      setSaveFilterPopupOpen(false);
      closeSavedViewsMenu();
      viewOnChangeCallback(record.values.get("id"));
      navigate(`${metaData.getTablePathByName(tableMetaData.name)}/savedView/${record.values.get("id")}`);
   };



   /*******************************************************************************
    ** fired when a save option is selected from the save... button/dropdown combo
    *******************************************************************************/
   const handleDropdownOptionClick = (optionName: string) =>
   {
      setSaveOptionsOpen(false);
      setPopupAlertContent("");
      closeSavedViewsMenu();
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
            viewOnChangeCallback(null);
            navigate(metaData.getTablePathByName(tableMetaData.name));
            break;
         case RENAME_OPTION:
            if(currentSavedView != null)
            {
               setSavedViewNameInputValue(currentSavedView.values.get("label"));
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
         setPopupAlertContent("");
         setIsSubmitting(true);

         const formData = new FormData();
         if (isDeleteFilter)
         {
            formData.append("id", currentSavedView.values.get("id"));
            await makeSavedViewRequest("deleteSavedView", formData);

            setSaveFilterPopupOpen(false);
            setSaveOptionsOpen(false);

            await(async() =>
            {
               handleDropdownOptionClick(CLEAR_OPTION);
            })();
         }
         else
         {
            formData.append("tableName", tableMetaData.name);

            /////////////////////////////////////////////////////////////////////////////////////////////////
            // clone view via json serialization/deserialization                                           //
            // then replace the viewJson in it with a copy that has had its possible values changed to ids //
            // then stringify that for the backend                                                         //
            /////////////////////////////////////////////////////////////////////////////////////////////////
            const viewObject = JSON.parse(JSON.stringify(view));
            viewObject.queryFilter = JSON.parse(JSON.stringify(FilterUtils.convertFilterPossibleValuesToIds(viewObject.queryFilter)));
            formData.append("viewJson", JSON.stringify(viewObject));

            if (isSaveFilterAs || isRenameFilter || currentSavedView == null)
            {
               formData.append("label", savedViewNameInputValue);
               if(currentSavedView != null && isRenameFilter)
               {
                  formData.append("id", currentSavedView.values.get("id"));
               }
            }
            else
            {
               formData.append("id", currentSavedView.values.get("id"));
               formData.append("label", currentSavedView?.values.get("label"));
            }
            const recordList = await makeSavedViewRequest("storeSavedView", formData);
            await(async() =>
            {
               if (recordList && recordList.length > 0)
               {
                  setSavedViewsHaveLoaded(false);
                  loadSavedViews();
                  handleSavedViewRecordOnClick(recordList[0]);
               }
            })();
         }

         setSaveFilterPopupOpen(false);
         setSaveOptionsOpen(false);
      }
      catch (e: any)
      {
         let message = JSON.stringify(e);
         if(typeof e == "string")
         {
            message = e;
         }
         else if(typeof e == "object" && e.message)
         {
            message = e.message;
         }

         setPopupAlertContent(message);
         console.log(`Setting error: ${message}`);
      }
      finally
      {
         setIsSubmitting(false);
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
      setSavedViewNameInputValue(event.target.value);
   };



   /*******************************************************************************
    ** closes current dialog
    *******************************************************************************/
   const handleSaveFilterPopupClose = () =>
   {
      setSaveFilterPopupOpen(false);
   };



   /*******************************************************************************
    ** make a request to the backend for various savedView processes
    *******************************************************************************/
   async function makeSavedViewRequest(processName: string, formData: FormData): Promise<QRecord[]>
   {
      /////////////////////////
      // fetch saved filters //
      /////////////////////////
      let savedViews = [] as QRecord[]
      try
      {
         //////////////////////////////////////////////////////////////////
         // we don't want this job to go async, so, pass a large timeout //
         //////////////////////////////////////////////////////////////////
         formData.append(QController.STEP_TIMEOUT_MILLIS_PARAM_NAME, 60 * 1000);
         const processResult = await qController.processInit(processName, formData, qController.defaultMultipartFormDataHeaders());
         if (processResult instanceof QJobError)
         {
            const jobError = processResult as QJobError;
            throw(jobError.error);
         }
         else
         {
            const result = processResult as QJobComplete;
            if(result.values.savedViewList)
            {
               for (let i = 0; i < result.values.savedViewList.length; i++)
               {
                  const qRecord = new QRecord(result.values.savedViewList[i]);
                  savedViews.push(qRecord);
               }
            }
         }
      }
      catch (e)
      {
         throw(e);
      }

      return (savedViews);
   }

   const hasStorePermission = metaData?.processes.has("storeSavedView");
   const hasDeletePermission = metaData?.processes.has("deleteSavedView");
   const hasQueryPermission = metaData?.processes.has("querySavedView");

   const tooltipMaxWidth = (maxWidth: string) =>
   {
      return ({slotProps: {
         tooltip: {
            sx: {
               maxWidth: maxWidth
            }
         }
      }})
   }

   const menuTooltipAttribs = {...tooltipMaxWidth("250px"), placement: "left", enterDelay: 1000} as TooltipProps;

   const renderSavedViewsMenu = tableMetaData && (
      <Menu
         anchorEl={savedViewsMenu}
         anchorOrigin={{vertical: "bottom", horizontal: "left",}}
         transformOrigin={{vertical: "top", horizontal: "left",}}
         open={Boolean(savedViewsMenu)}
         onClose={closeSavedViewsMenu}
         keepMounted
         PaperProps={{style: {maxHeight: "calc(100vh - 200px)", minHeight: "200px"}}}
      >
         <MenuItem sx={{width: "300px"}} disabled style={{"opacity": "initial"}}><b>Actions</b></MenuItem>
         {
            hasStorePermission &&
            <Tooltip {...menuTooltipAttribs} title={<>Save your current filters, columns and settings, for quick re-use at a later time.<br /><br />You will be prompted to enter a name if you choose this option.</>}>
               <MenuItem onClick={() => handleDropdownOptionClick(SAVE_OPTION)}>
                  <ListItemIcon><Icon>save</Icon></ListItemIcon>
                  Save...
               </MenuItem>
            </Tooltip>
         }
         {
            hasStorePermission &&
            <Tooltip {...menuTooltipAttribs} title="Change the name for this saved view.">
               <MenuItem disabled={currentSavedView === null} onClick={() => handleDropdownOptionClick(RENAME_OPTION)}>
                  <ListItemIcon><Icon>edit</Icon></ListItemIcon>
                  Rename...
               </MenuItem>
            </Tooltip>
         }
         {
            hasStorePermission &&
            <Tooltip {...menuTooltipAttribs} title="Make a copy this saved view, with a different name, separate from the original.">
               <MenuItem disabled={currentSavedView === null} onClick={() => handleDropdownOptionClick(DUPLICATE_OPTION)}>
                  <ListItemIcon><Icon>content_copy</Icon></ListItemIcon>
                  Duplicate...
               </MenuItem>
            </Tooltip>
         }
         {
            hasDeletePermission &&
            <Tooltip {...menuTooltipAttribs} title="Delete this saved view.">
               <MenuItem disabled={currentSavedView === null} onClick={() => handleDropdownOptionClick(DELETE_OPTION)}>
                  <ListItemIcon><Icon>delete</Icon></ListItemIcon>
                  Delete...
               </MenuItem>
            </Tooltip>
         }
         {
            <Tooltip {...menuTooltipAttribs} title="Create a new view of this table, resetting the filters and columns to their defaults.">
               <MenuItem onClick={() => handleDropdownOptionClick(CLEAR_OPTION)}>
                  <ListItemIcon><Icon>monitor</Icon></ListItemIcon>
                  New View
               </MenuItem>
            </Tooltip>
         }
         <Divider/>
         <MenuItem disabled style={{"opacity": "initial"}}><b>Your Saved Views</b></MenuItem>
         {
            savedViews && savedViews.length > 0 ? (
               savedViews.map((record: QRecord, index: number) =>
                  <MenuItem sx={{paddingLeft: "50px"}} key={`savedFiler-${index}`} onClick={() => handleSavedViewRecordOnClick(record)}>
                     {record.values.get("label")}
                  </MenuItem>
               )
            ): (
               <MenuItem >
                  <i>No views have been saved for this table.</i>
               </MenuItem>
            )
         }
      </Menu>
   );

   return (
      hasQueryPermission && tableMetaData ? (
         <Box display="flex" flexGrow={1}>
            <QSavedViewsMenuButton isOpen={savedViewsMenu} onClickHandler={openSavedViewsMenu} />
            {renderSavedViewsMenu}
            <Box display="flex" justifyContent="center" flexDirection="column">
               <Box pl={2} pr={2} sx={{display: "flex", alignItems: "center"}}>
                  {
                     savedViewsHaveLoaded && currentSavedView && (
                        <Typography mr={2} variant="h6">Current View:&nbsp;
                           <span style={{fontWeight: "initial"}}>
                              {
                                 loadingSavedView
                                    ? "..."
                                    :
                                    <>
                                       {currentSavedView.values.get("label")}
                                       {
                                          viewIsModified && (
                                             <Tooltip {...tooltipMaxWidth("24rem")} sx={{cursor: "pointer"}} title={<>The current view has been modified:
                                                <ul style={{padding: "1rem"}}>
                                                   {
                                                      viewDiffs.map((s: string, i: number) => <li key={i}>{s}</li>)
                                                   }
                                                </ul>Click &quot;Save...&quot; to save the changes.</>}>
                                                <FiberManualRecord sx={{color: "orange", paddingLeft: "2px", paddingTop: "4px"}} />
                                             </Tooltip>
                                          )
                                       }
                                    </>
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
                  onKeyPress={(e) =>
                  {
                     ////////////////////////////////////////////////////
                     // make user actually hit delete button           //
                     // but for other modes, let Enter submit the form //
                     ////////////////////////////////////////////////////
                     if (e.key == "Enter" && !isDeleteFilter)
                     {
                        handleFilterDialogButtonOnClick();
                     }
                  }}
               >
                  {
                     currentSavedView ? (
                        isDeleteFilter ? (
                           <DialogTitle id="alert-dialog-title">Delete View</DialogTitle>
                        ) : (
                           isSaveFilterAs ? (
                              <DialogTitle id="alert-dialog-title">Save View As</DialogTitle>
                           ):(
                              isRenameFilter ? (
                                 <DialogTitle id="alert-dialog-title">Rename View</DialogTitle>
                              ):(
                                 <DialogTitle id="alert-dialog-title">Update Existing View</DialogTitle>
                              )
                           )
                        )
                     ):(
                        <DialogTitle id="alert-dialog-title">Save New View</DialogTitle>
                     )
                  }
                  <DialogContent sx={{width: "500px"}}>
                     {popupAlertContent ? (
                        <Box mb={1}>
                           <Alert severity="error" onClose={() => setPopupAlertContent("")}>{popupAlertContent}</Alert>
                        </Box>
                     ) : ("")}
                     {
                        (! currentSavedView || isSaveFilterAs || isRenameFilter) && ! isDeleteFilter ? (
                           <Box>
                              {
                                 isSaveFilterAs ? (
                                    <Box mb={3}>Enter a name for this new saved view.</Box>
                                 ):(
                                    <Box mb={3}>Enter a new name for this saved view.</Box>
                                 )
                              }
                              <TextField
                                 autoFocus
                                 name="custom-delimiter-value"
                                 placeholder="View Name"
                                 label="View Name"
                                 inputProps={{width: "100%", maxLength: 100}}
                                 value={savedViewNameInputValue}
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
                              <Box>Are you sure you want to delete the view {`'${currentSavedView?.values.get("label")}'`}?</Box>
                           ):(
                              <Box>Are you sure you want to update the view {`'${currentSavedView?.values.get("label")}'`}?</Box>
                           )
                        )
                     }
                  </DialogContent>
                  <DialogActions>
                     <QCancelButton onClickHandler={handleSaveFilterPopupClose} disabled={false} />
                     {
                        isDeleteFilter ?
                           <QDeleteButton onClickHandler={handleFilterDialogButtonOnClick} disabled={isSubmitting} />
                           :
                           <QSaveButton label="Save" onClickHandler={handleFilterDialogButtonOnClick} disabled={isSubmitting || ((isSaveFilterAs || currentSavedView == null) && savedViewNameInputValue == null)}/>
                     }
                  </DialogActions>
               </Dialog>
            }
         </Box>
      ) : null
   );
}

export default SavedViews;
