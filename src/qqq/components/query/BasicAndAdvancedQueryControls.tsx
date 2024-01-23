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


import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {Badge, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import {GridFilterModel} from "@mui/x-data-grid-pro";
import {GridApiPro} from "@mui/x-data-grid-pro/models/gridApiPro";
import React, {forwardRef, useImperativeHandle, useReducer, useState} from "react";
import {QCancelButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";
import FieldAutoComplete from "qqq/components/misc/FieldAutoComplete";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import QuickFilter from "qqq/components/query/QuickFilter";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import TableUtils from "qqq/utils/qqq/TableUtils";

interface BasicAndAdvancedQueryControlsProps
{
   metaData: QInstance;
   tableMetaData: QTableMetaData;
   queryFilter: QQueryFilter;
   gridApiRef: React.MutableRefObject<GridApiPro>

   setQueryFilter: (queryFilter: QQueryFilter) => void;
   handleFilterChange: (filterModel: GridFilterModel, doSetQueryFilter?: boolean, isChangeFromDataGrid?: boolean) => void;

   /////////////////////////////////////////////////////////////////////////////////////////////
   // this prop is used as a way to recognize changes in the query filter internal structure, //
   // since the queryFilter object (reference) doesn't get updated                            //
   /////////////////////////////////////////////////////////////////////////////////////////////
   queryFilterJSON: string;

   mode: string;
   setMode: (mode: string) => void;
}

let debounceTimeout: string | number | NodeJS.Timeout;

/*******************************************************************************
 ** Component to provide the basic & advanced query-filter controls for the
 ** RecordQuery screen.
 **
 ** Done as a forwardRef, so RecordQuery can call some functions, e.g., when user
 ** does things on that screen, that we need to know about in here.
 *******************************************************************************/
const BasicAndAdvancedQueryControls = forwardRef((props: BasicAndAdvancedQueryControlsProps, ref) =>
{
   const {metaData, tableMetaData, queryFilter, gridApiRef, setQueryFilter, handleFilterChange, queryFilterJSON, mode, setMode} = props

   /////////////////////////////////////////////////////////
   // get the quick-filter-field-names from local storage //
   /////////////////////////////////////////////////////////
   const QUICK_FILTER_FIELD_NAMES_LOCAL_STORAGE_KEY_ROOT = "qqq.quickFilterFieldNames";
   const quickFilterFieldNamesLocalStorageKey = `${QUICK_FILTER_FIELD_NAMES_LOCAL_STORAGE_KEY_ROOT}.${tableMetaData.name}`;
   let defaultQuickFilterFieldNames: Set<string> = new Set<string>();
   if (localStorage.getItem(quickFilterFieldNamesLocalStorageKey))
   {
      defaultQuickFilterFieldNames = new Set<string>(JSON.parse(localStorage.getItem(quickFilterFieldNamesLocalStorageKey)));
   }

   /////////////////////
   // state variables //
   /////////////////////
   const [quickFilterFieldNames, setQuickFilterFieldNames] = useState(defaultQuickFilterFieldNames);
   const [addQuickFilterMenu, setAddQuickFilterMenu] = useState(null)
   const [addQuickFilterOpenCounter, setAddQuickFilterOpenCounter] = useState(0);
   const [showClearFiltersWarning, setShowClearFiltersWarning] = useState(false);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   //////////////////////////////////////////////////////////////////////////////////
   // make some functions available to our parent - so it can tell us to do things //
   //////////////////////////////////////////////////////////////////////////////////
   useImperativeHandle(ref, () =>
   {
      return {
         ensureAllFilterCriteriaAreActiveQuickFilters(currentFilter: QQueryFilter, reason: string)
         {
            ensureAllFilterCriteriaAreActiveQuickFilters(tableMetaData, currentFilter, reason);
         },
         addField(fieldName: string)
         {
            addQuickFilterField({fieldName: fieldName}, "columnMenu");
         }
      }
   });


   /*******************************************************************************
    ** for a given field, set its default operator for quick-filter dropdowns.
    *******************************************************************************/
   function getDefaultOperatorForField(field: QFieldMetaData)
   {
      // todo - sometimes i want contains instead of equals on strings (client.name, for example...)
      let defaultOperator = field?.possibleValueSourceName ? QCriteriaOperator.IN : QCriteriaOperator.EQUALS;
      if (field?.type == QFieldType.DATE_TIME || field?.type == QFieldType.DATE)
      {
         defaultOperator = QCriteriaOperator.GREATER_THAN;
      }
      else if (field?.type == QFieldType.BOOLEAN)
      {
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // for booleans, if we set a default, since none of them have values, then they are ALWAYS selected, which isn't what we want. //
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         defaultOperator = null;
      }
      return defaultOperator;
   }


   /*******************************************************************************
    ** Callback passed into the QuickFilter component, to update the criteria
    ** after user makes changes to it or to clear it out.
    *******************************************************************************/
   const updateQuickCriteria = (newCriteria: QFilterCriteria, needDebounce = false, doClearCriteria = false) =>
   {
      let found = false;
      let foundIndex = null;
      for (let i = 0; i < queryFilter?.criteria?.length; i++)
      {
         if(queryFilter.criteria[i].fieldName == newCriteria.fieldName)
         {
            queryFilter.criteria[i] = newCriteria;
            found = true;
            foundIndex = i;
            break;
         }
      }

      if(doClearCriteria)
      {
         if(found)
         {
            queryFilter.criteria.splice(foundIndex, 1);
            setQueryFilter(queryFilter);
            const gridFilterModel = FilterUtils.buildGridFilterFromQFilter(tableMetaData, queryFilter);
            handleFilterChange(gridFilterModel, false);
         }
         return;
      }

      if(!found)
      {
         if(!queryFilter.criteria)
         {
            queryFilter.criteria = [];
         }
         queryFilter.criteria.push(newCriteria);
         found = true;
      }

      if(found)
      {
         clearTimeout(debounceTimeout)
         debounceTimeout = setTimeout(() =>
         {
            setQueryFilter(queryFilter);
            const gridFilterModel = FilterUtils.buildGridFilterFromQFilter(tableMetaData, queryFilter);
            handleFilterChange(gridFilterModel, false);
         }, needDebounce ? 500 : 1);

         forceUpdate();
      }
   };


   /*******************************************************************************
    ** Get the QFilterCriteriaWithId object to pass in to the QuickFilter component
    ** for a given field name.
    *******************************************************************************/
   const getQuickCriteriaParam = (fieldName: string): QFilterCriteriaWithId | null | "tooComplex" =>
   {
      const matches: QFilterCriteriaWithId[] = [];
      for (let i = 0; i < queryFilter?.criteria?.length; i++)
      {
         if(queryFilter.criteria[i].fieldName == fieldName)
         {
            matches.push(queryFilter.criteria[i] as QFilterCriteriaWithId);
         }
      }

      if(matches.length == 0)
      {
         return (null);
      }
      else if(matches.length == 1)
      {
         return (matches[0]);
      }
      else
      {
         return "tooComplex";
      }
   };


   /*******************************************************************************
    ** set the quick-filter field names state variable and local-storage
    *******************************************************************************/
   const storeQuickFilterFieldNames = () =>
   {
      setQuickFilterFieldNames(new Set<string>([...quickFilterFieldNames.values()]));
      localStorage.setItem(quickFilterFieldNamesLocalStorageKey, JSON.stringify([...quickFilterFieldNames.values()]));
   }


   /*******************************************************************************
    ** Event handler for QuickFilter component, to remove a quick filter field from
    ** the screen.
    *******************************************************************************/
   const handleRemoveQuickFilterField = (fieldName: string): void =>
   {
      if(quickFilterFieldNames.has(fieldName))
      {
         //////////////////////////////////////
         // remove this field from the query //
         //////////////////////////////////////
         const criteria = new QFilterCriteria(fieldName, null, []);
         updateQuickCriteria(criteria, false, true);

         quickFilterFieldNames.delete(fieldName);
         storeQuickFilterFieldNames();
      }
   };


   /*******************************************************************************
    ** Event handler for button that opens the add-quick-filter menu
    *******************************************************************************/
   const openAddQuickFilterMenu = (event: any) =>
   {
      setAddQuickFilterMenu(event.currentTarget);
      setAddQuickFilterOpenCounter(addQuickFilterOpenCounter + 1);
   }


   /*******************************************************************************
    ** Handle closing the add-quick-filter menu
    *******************************************************************************/
   const closeAddQuickFilterMenu = () =>
   {
      setAddQuickFilterMenu(null);
   }


   /*******************************************************************************
    ** Add a quick-filter field to the screen, from either the user selecting one,
    ** or from a new query being activated, etc.
    *******************************************************************************/
   const addQuickFilterField = (newValue: any, reason: "blur" | "modeToggleClicked" | "defaultFilterLoaded" | "savedFilterSelected" | "columnMenu" | string) =>
   {
      console.log(`Adding quick filter field as: ${JSON.stringify(newValue)}`);
      if (reason == "blur")
      {
         //////////////////////////////////////////////////////////////////
         // this keeps a click out of the menu from selecting the option //
         //////////////////////////////////////////////////////////////////
         return;
      }

      const fieldName = newValue ? newValue.fieldName : null;
      if (fieldName)
      {
         if (!quickFilterFieldNames.has(fieldName))
         {
            /////////////////////////////////
            // add the field if we need to //
            /////////////////////////////////
            quickFilterFieldNames.add(fieldName);
            storeQuickFilterFieldNames();

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // only do this when user has added the field (e.g., not when adding it because of a selected view or filter-in-url) //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(reason != "modeToggleClicked" && reason != "defaultFilterLoaded" && reason != "savedFilterSelected")
            {
               setTimeout(() => document.getElementById(`quickFilter.${fieldName}`)?.click(), 5);
            }
         }
         else if(reason == "columnMenu")
         {
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // if field was already on-screen, but user clicked an option from the columnMenu, then open the quick-filter field //
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            setTimeout(() => document.getElementById(`quickFilter.${fieldName}`)?.click(), 5);
         }

         closeAddQuickFilterMenu();
      }
   };


   /*******************************************************************************
    ** event handler for the Filter Buidler button - e.g., opens the parent's grid's
    ** filter panel
    *******************************************************************************/
   const openFilterBuilder = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) =>
   {
      gridApiRef.current.showFilterPanel();
   };


   /*******************************************************************************
    ** event handler for the clear-filters modal
    *******************************************************************************/
   const handleClearFiltersAction = (event: React.KeyboardEvent<HTMLDivElement>, isYesButton: boolean = false) =>
   {
      if (isYesButton || event.key == "Enter")
      {
         setShowClearFiltersWarning(false);
         handleFilterChange({items: []} as GridFilterModel);
      }
   };


   /*******************************************************************************
    ** format the current query as a string for showing on-screen as a preview.
    *******************************************************************************/
   const queryToAdvancedString = () =>
   {
      if(queryFilter == null || !queryFilter.criteria)
      {
         return (<span></span>);
      }

      let counter = 0;

      return (
         <span>
            {queryFilter.criteria.map((criteria, i) =>
            {
               if(criteria && criteria.fieldName && criteria.operator)
               {
                  const [field, fieldTable] = TableUtils.getFieldAndTable(tableMetaData, criteria.fieldName);
                  const valuesString = FilterUtils.getValuesString(field, criteria);
                  counter++;

                  return (
                     <span key={i}>
                        {counter > 1 ? <span>{queryFilter.booleanOperator}&nbsp;</span> : <span/>}
                        <b>{field.label}</b> {criteria.operator} <span style={{color: "blue"}}>{valuesString}</span>&nbsp;
                     </span>
                  );
               }
               else
               {
                  return (<span />);
               }
            })}
         </span>
      );
   };


   /*******************************************************************************
    ** event handler for toggling between modes - basic & advanced.
    *******************************************************************************/
   const modeToggleClicked = (newValue: string | null) =>
   {
      if (newValue)
      {
         if(newValue == "basic")
         {
            ////////////////////////////////////////////////////////////////////////////////
            // we're always allowed to go to advanced -                                   //
            // but if we're trying to go to basic, make sure the filter isn't too complex //
            ////////////////////////////////////////////////////////////////////////////////
            const {canFilterWorkAsBasic} = FilterUtils.canFilterWorkAsBasic(tableMetaData, queryFilter);
            if (!canFilterWorkAsBasic)
            {
               console.log("Query cannot work as basic - so - not allowing toggle to basic.")
               return;
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // when going to basic, make sure all fields in the current query are active as quick-filters //
            ////////////////////////////////////////////////////////////////////////////////////////////////
            if (queryFilter && queryFilter.criteria)
            {
               ensureAllFilterCriteriaAreActiveQuickFilters(tableMetaData, queryFilter, "modeToggleClicked");
            }
         }

         //////////////////////////////////////////////////////////////////////////////////////
         // note - this is a callback to the parent - as it is responsible for this state... //
         //////////////////////////////////////////////////////////////////////////////////////
         setMode(newValue);
      }
   };


   /*******************************************************************************
    ** make sure that all fields in the current query are on-screen as quick-filters
    ** (that is, if the query can be basic)
    *******************************************************************************/
   const ensureAllFilterCriteriaAreActiveQuickFilters = (tableMetaData: QTableMetaData, queryFilter: QQueryFilter, reason: "modeToggleClicked" | "defaultFilterLoaded" | "savedFilterSelected" | string) =>
   {
      if(!tableMetaData || !queryFilter)
      {
         return;
      }

      const {canFilterWorkAsBasic} = FilterUtils.canFilterWorkAsBasic(tableMetaData, queryFilter);
      if (!canFilterWorkAsBasic)
      {
         console.log("query is too complex for basic - so - switching to advanced");
         modeToggleClicked("advanced");
         forceUpdate();
         return;
      }

      for (let i = 0; i < queryFilter?.criteria?.length; i++)
      {
         const criteria = queryFilter.criteria[i];
         if (criteria && criteria.fieldName)
         {
            addQuickFilterField(criteria, reason);
         }
      }
   }


   //////////////////////////////////////////////////////////////////////////////
   // if there aren't any quick-filters turned on, get defaults from the table //
   // only run this block upon a first-render                                  //
   //////////////////////////////////////////////////////////////////////////////
   const [firstRender, setFirstRender] = useState(true);
   if(firstRender)
   {
      setFirstRender(false);

      if (defaultQuickFilterFieldNames == null || defaultQuickFilterFieldNames.size == 0)
      {
         defaultQuickFilterFieldNames = new Set<string>();

         //////////////////////////////////////////////////////////////////////////////////////////////////
         // check if there's materialDashboard tableMetaData, and if it has defaultQuickFilterFieldNames //
         //////////////////////////////////////////////////////////////////////////////////////////////////
         const mdbMetaData = tableMetaData?.supplementalTableMetaData?.get("materialDashboard");
         if (mdbMetaData)
         {
            if (mdbMetaData?.defaultQuickFilterFieldNames?.length)
            {
               for (let i = 0; i < mdbMetaData.defaultQuickFilterFieldNames.length; i++)
               {
                  defaultQuickFilterFieldNames.add(mdbMetaData.defaultQuickFilterFieldNames[i]);
               }
            }
         }

         /////////////////////////////////////////////
         // if still none, then look for T1 section //
         /////////////////////////////////////////////
         if (defaultQuickFilterFieldNames.size == 0)
         {
            if (tableMetaData.sections)
            {
               const t1Sections = tableMetaData.sections.filter((s: QTableSection) => s.tier == "T1");
               if (t1Sections.length)
               {
                  for (let i = 0; i < t1Sections.length; i++)
                  {
                     if (t1Sections[i].fieldNames)
                     {
                        for (let j = 0; j < t1Sections[i].fieldNames.length; j++)
                        {
                           defaultQuickFilterFieldNames.add(t1Sections[i].fieldNames[j]);
                        }
                     }
                  }
               }
            }
         }

         setQuickFilterFieldNames(defaultQuickFilterFieldNames);
      }
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // this is being used as a version of like forcing that we get re-rendered if the query filter changes... //
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
   const [lastIndex, setLastIndex] = useState(queryFilterJSON);
   if(queryFilterJSON != lastIndex)
   {
      ensureAllFilterCriteriaAreActiveQuickFilters(tableMetaData, queryFilter, "defaultFilterLoaded");
      setLastIndex(queryFilterJSON);
   }

   ///////////////////////////////////////////////////
   // set some status flags based on current filter //
   ///////////////////////////////////////////////////
   const hasValidFilters = queryFilter && queryFilter.criteria && queryFilter.criteria.length > 0; // todo - should be better (e.g., see if operator & values are set)
   const {canFilterWorkAsBasic, reasonsWhyItCannot} = FilterUtils.canFilterWorkAsBasic(tableMetaData, queryFilter);
   let reasonWhyBasicIsDisabled = null;
   if(reasonsWhyItCannot && reasonsWhyItCannot.length > 0)
   {
      reasonWhyBasicIsDisabled = <>
         Your current Filter cannot be managed using BASIC mode because:
         <ul style={{marginLeft: "1rem"}}>
            {reasonsWhyItCannot.map((reason, i) => <li key={i}>{reason}</li>)}
         </ul>
      </>
   }

   return (
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" position="relative" top={"-0.5rem"} left={"0.5rem"} minHeight="2.5rem">
         <Box display="flex" alignItems="center" flexShrink={1} flexGrow={1}>
            {
               mode == "basic" &&
               <Box width="100px" flexShrink={1} flexGrow={1}>
                  {
                     tableMetaData &&
                     [...quickFilterFieldNames.values()].map((fieldName) =>
                     {
                        const [field, tableForField] = TableUtils.getFieldAndTable(tableMetaData, fieldName);
                        let defaultOperator = getDefaultOperatorForField(field);

                        return (
                           field && <QuickFilter
                              key={fieldName}
                              fullFieldName={fieldName}
                              tableMetaData={tableMetaData}
                              updateCriteria={updateQuickCriteria}
                              criteriaParam={getQuickCriteriaParam(fieldName)}
                              fieldMetaData={field}
                              defaultOperator={defaultOperator}
                              handleRemoveQuickFilterField={handleRemoveQuickFilterField} />
                        );
                     })
                  }
                  {
                     tableMetaData &&
                     <>
                        <Tooltip enterDelay={500} title="Add a Quick Filter field" placement="top">
                           <Button onClick={(e) => openAddQuickFilterMenu(e)} startIcon={<Icon>add_circle_outline</Icon>} sx={{border: "1px solid gray", whiteSpace: "nowrap", minWidth: "120px"}}>
                              Add Field
                           </Button>
                        </Tooltip>
                        <Menu
                           anchorEl={addQuickFilterMenu}
                           anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                           transformOrigin={{vertical: "top", horizontal: "left"}}
                           transitionDuration={0}
                           open={Boolean(addQuickFilterMenu)}
                           onClose={closeAddQuickFilterMenu}
                           keepMounted
                        >
                           <Box width="250px">
                              <FieldAutoComplete
                                 key={addQuickFilterOpenCounter} // use a unique key each time we open it, because we don't want the user's last selection to stick.
                                 id={"add-quick-filter-field"}
                                 metaData={metaData}
                                 tableMetaData={tableMetaData}
                                 defaultValue={null}
                                 handleFieldChange={(e, newValue, reason) => addQuickFilterField(newValue, reason)}
                                 autoFocus={true}
                                 forceOpen={Boolean(addQuickFilterMenu)}
                                 hiddenFieldNames={[...quickFilterFieldNames.values()]}
                              />
                           </Box>
                        </Menu>
                     </>
                  }
               </Box>
            }
            {
               metaData && tableMetaData && mode == "advanced" &&
               <>
                  <Tooltip enterDelay={500} title="Build an advanced Filter" placement="top">
                     <Button onClick={(e) => openFilterBuilder(e)} startIcon={<Badge badgeContent={queryFilter?.criteria?.length} color="warning" sx={{"& .MuiBadge-badge": {color: "#FFFFFF"}}} anchorOrigin={{vertical: "top", horizontal: "left"}}><Icon>filter_list</Icon></Badge>} sx={{width: "180px", minWidth: "180px", border: "1px solid gray"}}>
                        Filter Builder
                     </Button>
                  </Tooltip>
                  <div id="clearFiltersButton" style={{display: "inline-block", position: "relative", top: "2px", left: "-1.5rem", width: "1rem"}}>
                     {
                        hasValidFilters && (
                           <>
                              <Tooltip title="Clear Filter">
                                 <Icon sx={{cursor: "pointer"}} onClick={() => setShowClearFiltersWarning(true)}>clear</Icon>
                              </Tooltip>
                              <Dialog open={showClearFiltersWarning} onClose={() => setShowClearFiltersWarning(true)} onKeyPress={(e) => handleClearFiltersAction(e)}>
                                 <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                                 <DialogContent>
                                    <DialogContentText>Are you sure you want to remove all conditions from the current filter?</DialogContentText>
                                 </DialogContent>
                                 <DialogActions>
                                    <QCancelButton label="No" disabled={false} onClickHandler={() => setShowClearFiltersWarning(true)} />
                                    <QSaveButton label="Yes" iconName="check" disabled={false} onClickHandler={() => handleClearFiltersAction(null, true)} />
                                 </DialogActions>
                              </Dialog>
                           </>
                        )
                     }
                  </div>
                  <Box sx={{fontSize: "1rem"}} whiteSpace="nowrap" display="flex" ml={0.25} flexShrink={1} flexGrow={1} alignItems="center">
                     Current Filter:
                     {
                        <Box display="inline-block" border="1px solid gray" borderRadius="0.5rem" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100px" flexShrink={1} flexGrow={1} sx={{fontSize: "1rem"}} minHeight={"2rem"} p={0.25} ml={0.5}>
                           {queryToAdvancedString()}
                        </Box>
                     }
                  </Box>
               </>
            }
         </Box>
         <Box display="flex" alignItems="center">
            {
               metaData && tableMetaData &&
               <Box px={1} display="flex" alignItems="center">
                  <Typography display="inline" sx={{fontSize: "1rem"}}>Mode:</Typography>
                  <Tooltip title={reasonWhyBasicIsDisabled}>
                     <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={(event, newValue) => modeToggleClicked(newValue)}
                        size="small"
                        sx={{pl: 0.5}}
                     >
                        <ToggleButton value="basic" disabled={!canFilterWorkAsBasic}>Basic</ToggleButton>
                        <ToggleButton value="advanced">Advanced</ToggleButton>
                     </ToggleButtonGroup>
                  </Tooltip>
               </Box>
            }
         </Box>
      </Box>
   );
});

export default BasicAndAdvancedQueryControls;