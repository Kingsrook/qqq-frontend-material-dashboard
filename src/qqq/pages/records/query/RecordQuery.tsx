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
import {Capability} from "@kingsrook/qqq-frontend-core/lib/model/metaData/Capability";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableVariant} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableVariant";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QFilterOrderBy} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {Alert, Collapse, TablePagination, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import {ColumnHeaderFilterIconButtonProps, DataGridPro, GridCallbackDetails, GridColDef, GridColumnMenuContainer, GridColumnMenuProps, GridColumnOrderChangeParams, GridColumnPinningMenuItems, GridColumnResizeParams, GridColumnsMenuItem, GridColumnVisibilityModel, GridDensity, GridEventListener, gridFilterableColumnDefinitionsSelector, GridFilterMenuItem, GridFilterModel, GridPinnedColumns, gridPreferencePanelStateSelector, GridPreferencePanelsValue, GridRowId, GridRowParams, GridRowsProp, GridSelectionModel, GridSortItem, GridSortModel, GridState, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExportContainer, HideGridColMenuItem, MuiEvent, SortGridMenuItems, useGridApiContext, useGridApiEventHandler, useGridApiRef, useGridSelector} from "@mui/x-data-grid-pro";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import FormData from "form-data";
import React, {forwardRef, useContext, useEffect, useReducer, useRef, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import QContext from "QContext";
import {QCancelButton, QCreateNewButton} from "qqq/components/buttons/DefaultButtons";
import MenuButton from "qqq/components/buttons/MenuButton";
import {GotoRecordButton} from "qqq/components/misc/GotoRecordDialog";
import SavedViews from "qqq/components/misc/SavedViews";
import BasicAndAdvancedQueryControls, {getDefaultQuickFilterFieldNames} from "qqq/components/query/BasicAndAdvancedQueryControls";
import {CustomColumnsPanel} from "qqq/components/query/CustomColumnsPanel";
import {CustomFilterPanel} from "qqq/components/query/CustomFilterPanel";
import CustomPaginationComponent from "qqq/components/query/CustomPaginationComponent";
import ExportMenuItem from "qqq/components/query/ExportMenuItem";
import {validateCriteria} from "qqq/components/query/FilterCriteriaRow";
import QueryScreenActionMenu from "qqq/components/query/QueryScreenActionMenu";
import SelectionSubsetDialog from "qqq/components/query/SelectionSubsetDialog";
import TableVariantDialog from "qqq/components/query/TableVariantDialog";
import CustomWidthTooltip from "qqq/components/tooltips/CustomWidthTooltip";
import BaseLayout from "qqq/layouts/BaseLayout";
import {LoadingState} from "qqq/models/LoadingState";
import QQueryColumns, {PreLoadQueryColumns} from "qqq/models/query/QQueryColumns";
import RecordQueryView from "qqq/models/query/RecordQueryView";
import ProcessRun from "qqq/pages/processes/ProcessRun";
import ColumnStats from "qqq/pages/records/query/ColumnStats";
import DataGridUtils from "qqq/utils/DataGridUtils";
import Client from "qqq/utils/qqq/Client";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import ProcessUtils from "qqq/utils/qqq/ProcessUtils";
import TableUtils from "qqq/utils/qqq/TableUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

const CURRENT_SAVED_VIEW_ID_LOCAL_STORAGE_KEY_ROOT = "qqq.currentSavedViewId";
const SEEN_JOIN_TABLES_LOCAL_STORAGE_KEY_ROOT = "qqq.seenJoinTables";
const DENSITY_LOCAL_STORAGE_KEY_ROOT = "qqq.density";
const VIEW_LOCAL_STORAGE_KEY_ROOT = "qqq.recordQueryView";

export const TABLE_VARIANT_LOCAL_STORAGE_KEY_ROOT = "qqq.tableVariant";

interface Props
{
   table?: QTableMetaData;
   launchProcess?: QProcessMetaData;
}

RecordQuery.defaultProps = {
   table: null,
   launchProcess: null
};

///////////////////////////////////////////////////////
// define possible values for our pageState variable //
///////////////////////////////////////////////////////
type PageState = "initial" | "loadingMetaData" | "loadedMetaData" | "loadingView" | "loadedView" | "preparingGrid" | "ready";

const qController = Client.getInstance();

/*******************************************************************************
 ** function to produce standard version of the screen while we're "loading"
 ** like the main table meta data etc.
 *******************************************************************************/
const getLoadingScreen = () =>
{
   return (<BaseLayout>
      &nbsp;
   </BaseLayout>);
}


/*******************************************************************************
 ** QQQ Record Query Screen component.
 **
 ** Yuge component.  The best.  Lots of very smart people are saying so.
 *******************************************************************************/
function RecordQuery({table, launchProcess}: Props): JSX.Element
{
   const tableName = table.name;
   const [searchParams] = useSearchParams();

   const [showSuccessfullyDeletedAlert, setShowSuccessfullyDeletedAlert] = useState(false);
   const [warningAlert, setWarningAlert] = useState(null as string);
   const [successAlert, setSuccessAlert] = useState(null as string);

   const navigate = useNavigate();
   const location = useLocation();
   const pathParts = location.pathname.replace(/\/+$/, "").split("/");

   const [firstRender, setFirstRender] = useState(true);

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // manage "state" being passed from some screens (like delete) into query screen - by grabbing, and then deleting //
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   if(location.state)
   {
      let state: any = location.state;
      if(state["deleteSuccess"])
      {
         setShowSuccessfullyDeletedAlert(true);
         delete state["deleteSuccess"];
      }

      if(state["warning"])
      {
         setWarningAlert(state["warning"]);
         delete state["warning"];
      }

      window.history.replaceState(state, "");
   }

   ////////////////////////////////////////////
   // look for defaults in the local storage //
   ////////////////////////////////////////////
   const currentSavedViewLocalStorageKey = `${CURRENT_SAVED_VIEW_ID_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const seenJoinTablesLocalStorageKey = `${SEEN_JOIN_TABLES_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const tableVariantLocalStorageKey = `${TABLE_VARIANT_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const viewLocalStorageKey = `${VIEW_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;

   /////////////////////////////////////////////////////////////////////////////////////////////////
   // define some default values (e.g., to be used if nothing in local storage or no active view) //
   /////////////////////////////////////////////////////////////////////////////////////////////////
   let defaultSort = [] as GridSortItem[];
   let didDefaultVisibilityComeFromLocalStorage = false;
   let defaultRowsPerPage = 10;
   let defaultDensity = "standard" as GridDensity;
   let seenJoinTables: {[tableName: string]: boolean} = {};
   let defaultTableVariant: QTableVariant = null;
   let defaultMode = "basic";
   let defaultQueryColumns: QQueryColumns = new PreLoadQueryColumns();
   let defaultView: RecordQueryView = null;

   /////////////////////////////////////
   // set density not to be per-table //
   /////////////////////////////////////
   const densityLocalStorageKey = `${DENSITY_LOCAL_STORAGE_KEY_ROOT}`;

   // only load things out of local storage on the first render
   if(firstRender)
   {
      if (localStorage.getItem(densityLocalStorageKey))
      {
         defaultDensity = JSON.parse(localStorage.getItem(densityLocalStorageKey));
      }
      if (localStorage.getItem(seenJoinTablesLocalStorageKey))
      {
         seenJoinTables = JSON.parse(localStorage.getItem(seenJoinTablesLocalStorageKey));
      }
      if (localStorage.getItem(tableVariantLocalStorageKey))
      {
         defaultTableVariant = JSON.parse(localStorage.getItem(tableVariantLocalStorageKey));
      }
      if (localStorage.getItem(viewLocalStorageKey))
      {
         defaultView = RecordQueryView.buildFromJSON(localStorage.getItem(viewLocalStorageKey));
      }
   }

   if(defaultView == null)
   {
      defaultView = new RecordQueryView();
      defaultView.queryFilter = new QQueryFilter();
      defaultView.queryColumns = defaultQueryColumns;
      defaultView.viewIdentity = "empty";
      defaultView.rowsPerPage = defaultRowsPerPage;
      // ... defaultView.quickFilterFieldNames = [];
      defaultView.mode = defaultMode;
   }

   /////////////////////////////////////////////////////////////////////////////////////////
   // in case the view is missing any of these attributes, give them a reasonable default //
   /////////////////////////////////////////////////////////////////////////////////////////
   if(!defaultView.rowsPerPage)
   {
      defaultView.rowsPerPage = defaultRowsPerPage;
   }
   if(!defaultView.mode)
   {
      defaultView.mode = defaultMode;
   }
   if(!defaultView.quickFilterFieldNames)
   {
      defaultView.quickFilterFieldNames = [];
   }

   ///////////////////////////////////
   // state models for the DataGrid //
   ///////////////////////////////////
   const [columnSortModel, setColumnSortModel] = useState(defaultSort);
   const [columnVisibilityModel, setColumnVisibilityModel] = useState(defaultQueryColumns.toColumnVisibilityModel());
   const [columnsModel, setColumnsModel] = useState([] as GridColDef[]);
   const [density, setDensity] = useState(defaultDensity);
   const [loading, setLoading] = useState(true);
   const [pageNumber, setPageNumber] = useState(0);
   const [pinnedColumns, setPinnedColumns] = useState(defaultQueryColumns.toGridPinnedColumns());
   const [rowSelectionModel, setRowSelectionModel] = useState<GridSelectionModel>([]);
   const [rows, setRows] = useState([] as GridRowsProp[]);
   const [rowsPerPage, setRowsPerPage] = useState(defaultView.rowsPerPage);
   const [totalRecords, setTotalRecords] = useState(null);
   const gridApiRef = useGridApiRef();

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // state of the page - e.g., have we loaded meta data?  what about the initial view?  or are we ready to render records. //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   const [pageState, setPageState] = useState("initial" as PageState)

   ///////////////////////////////////////////////////
   // state used by the custom column-chooser panel //
   ///////////////////////////////////////////////////
   const initialColumnChooserOpenGroups = {} as { [name: string]: boolean };
   initialColumnChooserOpenGroups[tableName] = true;
   const [columnChooserOpenGroups, setColumnChooserOpenGroups] = useState(initialColumnChooserOpenGroups);
   const [columnChooserFilterText, setColumnChooserFilterText] = useState("");

   /////////////////////////////////
   // meta-data and derived state //
   /////////////////////////////////
   const [metaData, setMetaData] = useState(null as QInstance);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [tableLabel, setTableLabel] = useState("");
   const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
   const [allTableProcesses, setAllTableProcesses] = useState([] as QProcessMetaData[]);

   ///////////////////////////////////////////
   // state of the view of the query screen //
   ///////////////////////////////////////////
   const [view, setView] = useState(defaultView)
   const [viewAsJson, setViewAsJson] = useState(JSON.stringify(defaultView))
   const [queryFilter, setQueryFilter] = useState(defaultView.queryFilter);
   const [queryColumns, setQueryColumns] = useState(defaultView.queryColumns);
   const [lastFetchedQFilterJSON, setLastFetchedQFilterJSON] = useState("");
   const [lastFetchedVariant, setLastFetchedVariant] = useState(null);
   const [tableVariant, setTableVariant] = useState(defaultTableVariant);
   const [quickFilterFieldNames, setQuickFilterFieldNames] = useState(defaultView.quickFilterFieldNames);

   //////////////////////////////////////////////
   // misc state... needs grouped & documented //
   //////////////////////////////////////////////
   const [visibleJoinTables, setVisibleJoinTables] = useState(new Set<string>());
   const [distinctRecords, setDistinctRecords] = useState(null);
   const [tableVariantPromptOpen, setTableVariantPromptOpen] = useState(false);
   const [alertContent, setAlertContent] = useState("");
   const [currentSavedView, setCurrentSavedView] = useState(null as QRecord);
   const [filterIdInLocation, setFilterIdInLocation] = useState(null as number);
   const [loadingSavedView, setLoadingSavedView] = useState(false);

   /////////////////////////////////////////////////////
   // state related to avoiding accidental row clicks //
   /////////////////////////////////////////////////////
   const [gridMouseDownX, setGridMouseDownX] = useState(0);
   const [gridMouseDownY, setGridMouseDownY] = useState(0);
   const [gridPreferencesWindow, setGridPreferencesWindow] = useState(undefined);

   /////////////////////////////////////////////////////////////
   // state related to selecting records for using in actions //
   /////////////////////////////////////////////////////////////
   const [selectedIds, setSelectedIds] = useState([] as string[]);
   const [distinctRecordsOnPageCount, setDistinctRecordsOnPageCount] = useState(null as number);
   const [selectionSubsetSize, setSelectionSubsetSize] = useState(null as number);
   const [selectionSubsetSizePromptOpen, setSelectionSubsetSizePromptOpen] = useState(false);
   const [selectFullFilterState, setSelectFullFilterState] = useState("n/a" as "n/a" | "checked" | "filter" | "filterSubset");

   //////////////////////////////
   // state used for processes //
   //////////////////////////////
   const [activeModalProcess, setActiveModalProcess] = useState(null as QProcessMetaData);
   const [recordIdsForProcess, setRecordIdsForProcess] = useState([] as string[] | QQueryFilter);

   /////////////////////////////////////////
   // state used for column-stats feature //
   /////////////////////////////////////////
   const [columnStatsFieldName, setColumnStatsFieldName] = useState(null as string);
   const [columnStatsField, setColumnStatsField] = useState(null as QFieldMetaData);
   const [columnStatsFieldTableName, setColumnStatsFieldTableName] = useState(null as string)
   const [filterForColumnStats, setFilterForColumnStats] = useState(null as QQueryFilter);

   ///////////////////////////////////////////////////
   // state used for basic/advanced query component //
   ///////////////////////////////////////////////////
   const [mode, setMode] = useState(defaultView.mode);
   const basicAndAdvancedQueryControlsRef = useRef();

   /////////////////////////////////////////////////////////
   // a timer used to help avoid accidental double-clicks //
   /////////////////////////////////////////////////////////
   const timerInstance = useRef({timer: null});

   //////////////////////////////////////////////////////////////////////////////////////////////////////
   // state used to avoid showing results from an "old" query, that finishes loading after a newer one //
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   const [latestQueryId, setLatestQueryId] = useState(0);
   const [countResults, setCountResults] = useState({} as any);
   const [receivedCountTimestamp, setReceivedCountTimestamp] = useState(new Date());
   const [queryResults, setQueryResults] = useState({} as any);
   const [latestQueryResults, setLatestQueryResults] = useState(null as QRecord[]);
   const [receivedQueryTimestamp, setReceivedQueryTimestamp] = useState(new Date());
   const [queryErrors, setQueryErrors] = useState({} as any);
   const [receivedQueryErrorTimestamp, setReceivedQueryErrorTimestamp] = useState(new Date());

   /////////////////////////////
   // page context references //
   /////////////////////////////
   const {setPageHeader, dotMenuOpen, keyboardHelpOpen} = useContext(QContext);

   //////////////////////
   // ole' faithful... //
   //////////////////////
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   ///////////////////////////////////////////////////////////////////////////////////////////
   // add a LoadingState object, in case the initial loads (of meta data and view) are slow //
   ///////////////////////////////////////////////////////////////////////////////////////////
   const [pageLoadingState, _] = useState(new LoadingState(forceUpdate))

   /*******************************************************************************
    ** utility function to get the names of any join tables which are active,
    ** either as a visible column, or as a query criteria
    *******************************************************************************/
   const getVisibleJoinTables = (): Set<string> =>
   {
      const visibleJoinTables = new Set<string>();

      for (let i = 0; i < queryColumns?.columns.length; i++)
      {
         const column = queryColumns.columns[i];
         const fieldName = column.name;
         if (column.isVisible && fieldName.indexOf(".") > -1)
         {
            visibleJoinTables.add(fieldName.split(".")[0]);
         }
      }

      for (let i = 0; i < queryFilter?.criteria?.length; i++)
      {
         const criteria = queryFilter.criteria[i];
         const {criteriaIsValid} = validateCriteria(criteria, null);
         const fieldName = criteria.fieldName;
         if(criteriaIsValid && fieldName && fieldName.indexOf(".") > -1)
         {
            visibleJoinTables.add(fieldName.split(".")[0]);
         }
      }

      return (visibleJoinTables);
   };

   /*******************************************************************************
    **
    *******************************************************************************/
   const isJoinMany = (tableMetaData: QTableMetaData, visibleJoinTables: Set<string>): boolean =>
   {
      if (tableMetaData?.exposedJoins)
      {
         for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
         {
            const join = tableMetaData.exposedJoins[i];
            if (visibleJoinTables.has(join.joinTable.name))
            {
               if(join.isMany)
               {
                  return (true);
               }
            }
         }
      }
      return (false);
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   const getPageHeader = (tableMetaData: QTableMetaData, visibleJoinTables: Set<string>, tableVariant: QTableVariant): string | JSX.Element =>
   {
      let label: string = tableMetaData?.label ?? "";

      if (visibleJoinTables.size > 0)
      {
         let joinLabels = [];
         if (tableMetaData?.exposedJoins)
         {
            for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
            {
               const join = tableMetaData.exposedJoins[i];
               if (visibleJoinTables.has(join.joinTable.name))
               {
                  joinLabels.push(join.label);
               }
            }
         }

         let joinLabelsString = joinLabels.join(", ");
         if(joinLabels.length == 2)
         {
            let lastCommaIndex = joinLabelsString.lastIndexOf(",");
            joinLabelsString = joinLabelsString.substring(0, lastCommaIndex) + " and " + joinLabelsString.substring(lastCommaIndex + 1);
         }
         if(joinLabels.length > 2)
         {
            let lastCommaIndex = joinLabelsString.lastIndexOf(",");
            joinLabelsString = joinLabelsString.substring(0, lastCommaIndex) + ", and " + joinLabelsString.substring(lastCommaIndex + 1);
         }

         let tooltipHTML = <div>
            You are viewing results from the {tableMetaData.label} table joined with {joinLabels.length} other table{joinLabels.length == 1 ? "" : "s"}:
            <ul style={{marginLeft: "1rem"}}>
               {joinLabels.map((name) => <li key={name}>{name}</li>)}
            </ul>
         </div>

         return(
            <div>
               {label}
               <CustomWidthTooltip title={tooltipHTML}>
                  <IconButton sx={{p: 0, fontSize: "0.5rem", mb: 1, color: "#9f9f9f", fontVariationSettings: "'wght' 100"}}><Icon fontSize="small">emergency</Icon></IconButton>
               </CustomWidthTooltip>
               {tableVariant && getTableVariantHeader(tableVariant)}
            </div>);
      }
      else
      {
         return (
            <div>
               {label}
               {tableVariant && getTableVariantHeader(tableVariant)}
            </div>);
      }
   };

   /*******************************************************************************
    **
    *******************************************************************************/
   const getTableVariantHeader = (tableVariant: QTableVariant) =>
   {
      return (
         <Typography variant="h6" color="text" fontWeight="light">
            {tableMetaData?.variantTableLabel}: {tableVariant?.name}
            <Tooltip title={`Change ${tableMetaData?.variantTableLabel}`}>
               <IconButton onClick={promptForTableVariantSelection} sx={{p: 0, m: 0, ml: .5, mb: .5, color: "#9f9f9f", fontVariationSettings: "'weight' 100"}}><Icon fontSize="small">settings</Icon></IconButton>
            </Tooltip>
         </Typography>
      );
   }

   ///////////////////////
   // Keyboard handling //
   ///////////////////////
   useEffect(() =>
   {
      const down = (e: KeyboardEvent) =>
      {
         const type = (e.target as any).type;
         const validType = (type !== "text" && type !== "textarea" && type !== "input" && type !== "search");

         if(validType && !dotMenuOpen && !keyboardHelpOpen && !activeModalProcess)
         {
            if (! e.metaKey && e.key === "n" && table.capabilities.has(Capability.TABLE_INSERT) && table.insertPermission)
            {
               e.preventDefault()
               navigate(`${metaData?.getTablePathByName(tableName)}/create`);
            }
            else if (! e.metaKey && e.key === "r")
            {
               e.preventDefault()
               updateTable("'r' keyboard event");
            }
            else if (! e.metaKey && e.key === "c")
            {
               e.preventDefault()
               gridApiRef.current.showPreferences(GridPreferencePanelsValue.columns)
            }
            else if (! e.metaKey && e.key === "f")
            {
               e.preventDefault()

               // @ts-ignore
               if(basicAndAdvancedQueryControlsRef?.current?.getCurrentMode() == "advanced")
               {
                  gridApiRef.current.showFilterPanel()
               }
            }
         }
      }

      document.addEventListener("keydown", down)
      return () =>
      {
         document.removeEventListener("keydown", down)
      }
   }, [dotMenuOpen, keyboardHelpOpen, metaData, activeModalProcess])

   /////////////////////////////////////////////////////////////////////////////////////////
   // monitor location changes - if our url looks like a process, then open that process. //
   /////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      try
      {
         /////////////////////////////////////////////////////////////////
         // the path for a process looks like: .../table/process        //
         // so if our tableName is in the -2 index, try to open process //
         /////////////////////////////////////////////////////////////////
         if (pathParts[pathParts.length - 2] === tableName)
         {
            const processName = pathParts[pathParts.length - 1];
            const processList = allTableProcesses.filter(p => p.name == processName);
            if (processList.length > 0)
            {
               setActiveModalProcess(processList[0]);
               return;
            }
            else if (metaData?.processes.has(processName))
            {
               ///////////////////////////////////////////////////////////////////////////////////////
               // check for generic processes - should this be a specific attribute on the process? //
               ///////////////////////////////////////////////////////////////////////////////////////
               setActiveModalProcess(metaData?.processes.get(processName));
               return;
            }
            else
            {
               console.log(`Couldn't find process named ${processName}`);
            }
         }

         /////////////////////////////////////////////////////////////////////
         // the path for a savedView looks like: .../table/savedView/32 //
         // so if path has '/savedView/' get last parsed string           //
         /////////////////////////////////////////////////////////////////////
         let currentSavedViewId = null as number;
         if (location.pathname.indexOf("/savedView/") != -1)
         {
            const parts = location.pathname.split("/");
            currentSavedViewId = Number.parseInt(parts[parts.length - 1]);
            setFilterIdInLocation(currentSavedViewId);

            /////////////////////////////////////////////////////////////////////////////////////////////
            // in case page-state has already advanced to "ready" (e.g., and we're dealing with a user //
            // hitting back & forth between filters), then do a load of the new saved-view right here  //
            /////////////////////////////////////////////////////////////////////////////////////////////
            if(pageState == "ready")
            {
               handleSavedViewChange(currentSavedViewId);
            }
         }
         else if (!searchParams.has("filter"))
         {
            if (localStorage.getItem(currentSavedViewLocalStorageKey))
            {
               currentSavedViewId = Number.parseInt(localStorage.getItem(currentSavedViewLocalStorageKey));
               navigate(`${metaData.getTablePathByName(tableName)}/savedView/${currentSavedViewId}`);
            }
            else
            {
               doSetCurrentSavedView(null);
            }
         }

         //... if (currentSavedViewId != null)
         //... {
         //...    /* hmm...
         //...    if(currentSavedView && currentSavedView.values.get("id") == currentSavedViewId)
         //...    {
         //...       console.log("@dk - mmm, current saved filter is already the one we're trying to go to, so, avoid double-dipping...");
         //...    }
         //...    else
         //...    */
         //...    {
         //...       console.log("@dk - have saved filter in url, going to query it now.");
         //...       (async () =>
         //...       {
         //...          const formData = new FormData();
         //...          formData.append("id", currentSavedViewId);
         //...          formData.append(QController.STEP_TIMEOUT_MILLIS_PARAM_NAME, 60 * 1000);
         //...          const processResult = await qController.processInit("querySavedView", formData, qController.defaultMultipartFormDataHeaders());
         //...          if (processResult instanceof QJobError)
         //...          {
         //...             const jobError = processResult as QJobError;
         //...             console.error("Could not retrieve saved filter: " + jobError.userFacingError);
         //...          }
         //...          else
         //...          {
         //...             const result = processResult as QJobComplete;
         //...             const qRecord = new QRecord(result.values.savedViewList[0]);
         //...             console.log("@dk - got saved filter from backend, going to set it now");
         //...             doSetCurrentSavedView(qRecord);
         //...          }
         //...       })();
         //...    }
         //... }
      }
      catch (e)
      {
         console.log(e);
      }

      ////////////////////////////////////////////////////////////////////////////////////
      // if we didn't open a process... not sure what we do in the table/query use-case //
      ////////////////////////////////////////////////////////////////////////////////////
      setActiveModalProcess(null);

   }, [location, tableMetaData]);

   /*******************************************************************************
    **
    *******************************************************************************/
   const handleColumnVisibilityChange = (columnVisibilityModel: GridColumnVisibilityModel) =>
   {
      setColumnVisibilityModel(columnVisibilityModel);
      queryColumns.updateVisibility(columnVisibilityModel)

      view.queryColumns = queryColumns;
      doSetView(view)

      forceUpdate();
   };

   /*******************************************************************************
    **
    *******************************************************************************/
   const setupGridColumnModels = (metaData: QInstance, tableMetaData: QTableMetaData, queryColumns: QQueryColumns) =>
   {
      let linkBase = metaData.getTablePath(tableMetaData);
      linkBase += linkBase.endsWith("/") ? "" : "/";
      const columns = DataGridUtils.setupGridColumns(tableMetaData, linkBase, metaData, "alphabetical");

      ///////////////////////////////////////////////
      // sort columns based on queryColumns object //
      ///////////////////////////////////////////////
      const columnSortValues = queryColumns.getColumnSortValues();
      columns.sort((a: GridColDef, b: GridColDef) =>
      {
         const aIndex = columnSortValues[a.field];
         const bIndex = columnSortValues[b.field];
         return aIndex - bIndex;
      });

      ///////////////////////////////////////////////////////////////////////
      // if there are column widths (e.g., from local storage), apply them //
      ///////////////////////////////////////////////////////////////////////
      const columnWidths = queryColumns.getColumnWidths();
      for (let i = 0; i < columns.length; i++)
      {
         const width = columnWidths[columns[i].field];
         if (width)
         {
            columns[i].width = width;
         }
      }

      setPinnedColumns(queryColumns.toGridPinnedColumns());
      setColumnVisibilityModel(queryColumns.toColumnVisibilityModel());
      setColumnsModel(columns);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   const promptForTableVariantSelection = () =>
   {
      setTableVariantPromptOpen(true);
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   const prepQueryFilterForBackend = (sourceFilter: QQueryFilter) =>
   {
      const filterForBackend = new QQueryFilter([], sourceFilter.orderBys, sourceFilter.booleanOperator);
      for (let i = 0; i < sourceFilter?.criteria?.length; i++)
      {
         const criteria = sourceFilter.criteria[i];
         const {criteriaIsValid} = validateCriteria(criteria, null);
         if (criteriaIsValid)
         {
            if (criteria.operator == QCriteriaOperator.IS_BLANK || criteria.operator == QCriteriaOperator.IS_NOT_BLANK)
            {
               ///////////////////////////////////////////////////////////////////////////////////////////
               // do this to avoid submitting an empty-string argument for blank/not-blank operators... //
               ///////////////////////////////////////////////////////////////////////////////////////////
               filterForBackend.criteria.push(new QFilterCriteria(criteria.fieldName, criteria.operator, []));
            }
            else
            {
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // else push a clone of the criteria - since it may get manipulated below (convertFilterPossibleValuesToIds) //
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
               const [field] = FilterUtils.getField(tableMetaData, criteria.fieldName)
               filterForBackend.criteria.push(new QFilterCriteria(criteria.fieldName, criteria.operator, FilterUtils.cleanseCriteriaValueForQQQ(criteria.values, field)));
            }
         }
      }
      filterForBackend.skip = pageNumber * rowsPerPage;
      filterForBackend.limit = rowsPerPage;

      // FilterUtils.convertFilterPossibleValuesToIds(filterForBackend);
      // todo - expressions?
      // todo - utc
      return filterForBackend;
   }

   /*******************************************************************************
    ** This is the method that actually executes a query to update the data in the table.
    *******************************************************************************/
   const updateTable = (reason?: string) =>
   {
      if(pageState != "ready")
      {
         return;
      }

      console.log(`@dk In updateTable for ${reason} ${JSON.stringify(queryFilter)}`);
      setLoading(true);
      setRows([]);
      (async () =>
      {
         /////////////////////////////////////////////////////////////////////////////////////
         // build filter object to submit to backend count & query endpoints                //
         // copy the orderBys & operator into it - but we'll build its criteria one-by-one, //
         // as clones, as we'll need to tweak them a bit                                    //
         /////////////////////////////////////////////////////////////////////////////////////
         const filterForBackend = prepQueryFilterForBackend(queryFilter);

         //////////////////////////////////////////
         // figure out joins to use in the query //
         //////////////////////////////////////////
         let queryJoins = null;
         if (tableMetaData?.exposedJoins)
         {
            const visibleJoinTables = getVisibleJoinTables();
            queryJoins = TableUtils.getQueryJoins(tableMetaData, visibleJoinTables);
         }

         //////////////////////////////////////////////////////////////////////////////////////////////////
         // assign a new query id to the query being issued here.  then run both the count & query async //
         // and when they load, store their results associated with this id.                             //
         //////////////////////////////////////////////////////////////////////////////////////////////////
         const thisQueryId = latestQueryId + 1;
         setLatestQueryId(thisQueryId);

         console.log(`Issuing query: ${thisQueryId}`);
         if (tableMetaData.capabilities.has(Capability.TABLE_COUNT))
         {
            let includeDistinct = isJoinMany(tableMetaData, getVisibleJoinTables());
            qController.count(tableName, filterForBackend, queryJoins, includeDistinct, tableVariant).then(([count, distinctCount]) =>
            {
               console.log(`Received count results for query ${thisQueryId}: ${count} ${distinctCount}`);
               countResults[thisQueryId] = [];
               countResults[thisQueryId].push(count);
               countResults[thisQueryId].push(distinctCount);
               setCountResults(countResults);
               setReceivedCountTimestamp(new Date());
            });
         }

         if(!tableMetaData.capabilities.has(Capability.TABLE_QUERY))
         {
            console.log("Cannot update table - it does not have QUERY capability.");
            return;
         }

         setLastFetchedQFilterJSON(JSON.stringify(queryFilter));
         setLastFetchedVariant(tableVariant);
         qController.query(tableName, filterForBackend, queryJoins, tableVariant).then((results) =>
         {
            console.log(`Received results for query ${thisQueryId}`);
            queryResults[thisQueryId] = results;
            setQueryResults(queryResults);
            setReceivedQueryTimestamp(new Date());
         })
            .catch((error) =>
            {
               console.log(`Received error for query ${thisQueryId}`);
               console.log(error);

               var errorMessage;
               if (error && error.message)
               {
                  errorMessage = error.message;
               }
               else if (error && error.response && error.response.data && error.response.data.error)
               {
                  errorMessage = error.response.data.error;
               }
               else
               {
                  errorMessage = "Unexpected error running query";
               }

               queryErrors[thisQueryId] = errorMessage;
               setQueryErrors(queryErrors);
               setReceivedQueryErrorTimestamp(new Date());

               throw error;
            });
      })();
   };

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // if, after a column was turned on or off, the set of visibleJoinTables is changed, then update the table //
   // check this on each render - it should only be different if there was a change.  note that putting this  //
   // in handleColumnVisibilityChange "didn't work" - it was always "behind by one" (like, maybe data grid    //
   // calls that function before it updates the visible model or some-such).                                  //
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
   const newVisibleJoinTables = getVisibleJoinTables();
   if (JSON.stringify([...newVisibleJoinTables.keys()]) != JSON.stringify([...visibleJoinTables.keys()]))
   {
      updateTable("visible joins change");
      setVisibleJoinTables(newVisibleJoinTables);
   }

   ///////////////////////////
   // display count results //
   ///////////////////////////
   useEffect(() =>
   {
      if (countResults[latestQueryId] == null || countResults[latestQueryId].length == 0)
      {
         ///////////////////////////////////////////////
         // see same idea in displaying query results //
         ///////////////////////////////////////////////
         console.log(`No count results for id ${latestQueryId}...`);
         return;
      }
      try
      {
         setTotalRecords(countResults[latestQueryId][0]);
         setDistinctRecords(countResults[latestQueryId][1]);
         delete countResults[latestQueryId];
      }
      catch(e)
      {
         console.log(e);
      }
   }, [receivedCountTimestamp]);

   ///////////////////////////
   // display query results //
   ///////////////////////////
   useEffect(() =>
   {
      if (!queryResults[latestQueryId])
      {
         ///////////////////////////////////////////////////////////////////////////////////////////
         // to avoid showing results from an "older" query (e.g., one that was slow, and returned //
         // AFTER a newer one) only ever show results here for the latestQueryId that was issued. //
         ///////////////////////////////////////////////////////////////////////////////////////////
         console.log(`No query results for id ${latestQueryId}...`);
         return;
      }

      console.log(`Outputting results for query ${latestQueryId}...`);
      const results = queryResults[latestQueryId];
      delete queryResults[latestQueryId];
      setLatestQueryResults(results);

      ///////////////////////////////////////////////////////////
      // count how many distinct primary keys are on this page //
      ///////////////////////////////////////////////////////////
      let distinctPrimaryKeySet = new Set<string>();
      for(let i = 0; i < results.length; i++)
      {
         distinctPrimaryKeySet.add(results[i].values.get(tableMetaData.primaryKeyField) as string);
      }
      setDistinctRecordsOnPageCount(distinctPrimaryKeySet.size);

      ////////////////////////////////
      // make the rows for the grid //
      ////////////////////////////////
      const rows = DataGridUtils.makeRows(results, tableMetaData);
      setRows(rows);

      setLoading(false);
      setAlertContent(null);
      forceUpdate();
   }, [receivedQueryTimestamp]);

   /////////////////////////
   // display query error //
   /////////////////////////
   useEffect(() =>
   {
      if (!queryErrors[latestQueryId])
      {
         ///////////////////////////////
         // same logic as for success //
         ///////////////////////////////
         console.log(`No query error for id ${latestQueryId}...`);
         return;
      }

      console.log(`Outputting error for query ${latestQueryId}...`);
      const errorMessage = queryErrors[latestQueryId];
      delete queryErrors[latestQueryId];
      setLoading(false);
      setAlertContent(errorMessage);

   }, [receivedQueryErrorTimestamp]);


   /*******************************************************************************
    ** Event handler from grid - when page number changes
    *******************************************************************************/
   const handlePageNumberChange = (page: number) =>
   {
      setPageNumber(page);
   };

   /*******************************************************************************
    ** Event handler from grid - when rows per page changes
    *******************************************************************************/
   const handleRowsPerPageChange = (size: number) =>
   {
      setRowsPerPage(size);

      view.rowsPerPage = size;
      doSetView(view)
   };

   /*******************************************************************************
    ** event handler from grid - when user changes pins
    *******************************************************************************/
   const handlePinnedColumnsChange = (pinnedColumns: GridPinnedColumns) =>
   {
      setPinnedColumns(pinnedColumns);
      queryColumns.setPinnedLeftColumns(pinnedColumns.left)
      queryColumns.setPinnedRightColumns(pinnedColumns.right)

      view.queryColumns = queryColumns;
      doSetView(view)
   };

   /*******************************************************************************
    ** event handler from grid - when "state" changes - which we use just for density
    *******************************************************************************/
   const handleStateChange = (state: GridState, event: MuiEvent, details: GridCallbackDetails) =>
   {
      if (state && state.density && state.density.value !== density)
      {
         setDensity(state.density.value);
         localStorage.setItem(densityLocalStorageKey, JSON.stringify(state.density.value));
      }
   };

   /*******************************************************************************
    ** event handler from grid - for when user clicks a row.
    *******************************************************************************/
   const handleRowClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) =>
   {
      /////////////////////////////////////////////////////////////////
      // if a grid preference window is open, ignore and reset timer //
      /////////////////////////////////////////////////////////////////
      console.log(gridPreferencesWindow);
      if (gridPreferencesWindow !== undefined)
      {
         clearTimeout(timerInstance.current.timer);
         return;
      }

      let id = encodeURIComponent(params.id);
      if (table.primaryKeyField !== "id")
      {
         id = encodeURIComponent(params.row[tableMetaData.primaryKeyField]);
      }
      const tablePath = `${metaData.getTablePathByName(table.name)}/${id}`;
      DataGridUtils.handleRowClick(tablePath, event, gridMouseDownX, gridMouseDownY, navigate, timerInstance);
   };

   /*******************************************************************************
    ** event handler from grid - for when selection (checked rows) changes.
    *******************************************************************************/
   const handleSelectionChanged = (selectionModel: GridSelectionModel, details: GridCallbackDetails) =>
   {
      ////////////////////////////////////////////////////
      // since we manage this object, we must re-set it //
      ////////////////////////////////////////////////////
      setRowSelectionModel(selectionModel);

      let checkboxesChecked = 0;
      let selectedPrimaryKeys = new Set<string>();
      selectionModel.forEach((value: GridRowId, index: number) =>
      {
         checkboxesChecked++
         const valueToPush = latestQueryResults[value as number].values.get(tableMetaData.primaryKeyField);
         selectedPrimaryKeys.add(valueToPush as string);
      });
      setSelectedIds([...selectedPrimaryKeys.values()]);

      if (checkboxesChecked === rowsPerPage)
      {
         setSelectFullFilterState("checked");
      }
      else
      {
         setSelectFullFilterState("n/a");
      }
   };

   /*******************************************************************************
    ** event handler from grid - for when the order of columns changes
    *******************************************************************************/
   const handleColumnOrderChange = (columnOrderChangeParams: GridColumnOrderChangeParams) =>
   {
      /////////////////////////////////////////////////////////////////////////////////////
      // get current state from gridApiRef - as the changeParams only have the delta     //
      // and we don't want to worry about being out of sync - just reset fully each time //
      /////////////////////////////////////////////////////////////////////////////////////
      const columnOrdering = gridApiRef.current.state.columns.all;
      queryColumns.updateColumnOrder(columnOrdering);

      view.queryColumns = queryColumns;
      doSetView(view)
   };


   /*******************************************************************************
    ** event handler from grid - for when user resizes a column
    *******************************************************************************/
   const handleColumnResize = (params: GridColumnResizeParams, event: MuiEvent, details: GridCallbackDetails) =>
   {
      queryColumns.updateColumnWidth(params.colDef.field, params.width);

      view.queryColumns = queryColumns;
      doSetView(view)
   };


   /*******************************************************************************
    ** event handler from grid - for when the sort-model changes (e.g., user clicks
    ** a column header to re-sort table).
    *******************************************************************************/
   const handleSortChange = (gridSort: GridSortModel) =>
   {
      ///////////////////////////////////////
      // store the sort model for the grid //
      ///////////////////////////////////////
      setColumnSortModel(gridSort);

      ////////////////////////////////////////////////
      // convert the grid's sort to qqq-filter sort //
      ////////////////////////////////////////////////
      queryFilter.orderBys = [];
      for (let i = 0; i < gridSort?.length; i++)
      {
         const fieldName = gridSort[i].field;
         const isAscending = gridSort[i].sort == "asc";
         queryFilter.orderBys.push(new QFilterOrderBy(fieldName, isAscending))
      }

      //////////////////////////////////////////////////////////
      // set a default order-by, if none is otherwise present //
      //////////////////////////////////////////////////////////
      if(queryFilter.orderBys.length == 0)
      {
         queryFilter.orderBys.push(new QFilterOrderBy(tableMetaData.primaryKeyField, false));
      }

      ////////////////////////////////
      // store the new query filter //
      ////////////////////////////////
      doSetQueryFilter(queryFilter);
   };

   /*******************************************************************************
    ** set the current view in state & local-storage - but do NOT update any
    ** child-state data.
    *******************************************************************************/
   const doSetView = (view: RecordQueryView): void =>
   {
      setView(view);
      setViewAsJson(JSON.stringify(view));
      localStorage.setItem(viewLocalStorageKey, JSON.stringify(view));
   }


   /*******************************************************************************
    ** bigger than doSetView - this method does call doSetView, but then also
    ** updates all other related state on the screen from the view.
    *******************************************************************************/
   const activateView = (view: RecordQueryView): void =>
   {
      /////////////////////////////////////////////////////////////////////////////////////////////
      // pass the 'isFromActivateView' flag into these functions - so that they don't try to set //
      // the filter (or columns) back into the old view.                                         //
      /////////////////////////////////////////////////////////////////////////////////////////////
      doSetQueryFilter(view.queryFilter, true);
      doSetQueryColumns(view.queryColumns, true);

      setRowsPerPage(view.rowsPerPage ?? defaultRowsPerPage);
      setMode(view.mode ?? defaultMode);
      setQuickFilterFieldNames(view.quickFilterFieldNames) // todo not i think ?? getDefaultQuickFilterFieldNames(tableMetaData));

      //////////////////////////////////////////////////////////////////////////////////////////////////
      // do this last - in case anything in the view got modified in any of those other doSet methods //
      //////////////////////////////////////////////////////////////////////////////////////////////////
      doSetView(view);

      ///////////////////////////////////////////////////////////////////////////////////////////////////////
      // do this in a timeout - so the current view can get set into state properly, before it potentially //
      // gets modified inside these calls (e.g., if a new field gets turned on)                            //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////
      // @ts-ignore
      setTimeout(() => basicAndAdvancedQueryControlsRef?.current?.ensureAllFilterCriteriaAreActiveQuickFilters(view.queryFilter, "activatedView"));
   }


   /*******************************************************************************
    ** Wrapper around setQueryFilter that also puts it in the view, and calls doSetView
    *******************************************************************************/
   const doSetQueryFilter = (queryFilter: QQueryFilter, isFromActivateView = false): void =>
   {
      console.log(`@dk Setting a new query filter: ${JSON.stringify(queryFilter)}`);

      ///////////////////////////////////////////////////
      // in case there's no orderBys, set default here //
      ///////////////////////////////////////////////////
      if(!queryFilter.orderBys || queryFilter.orderBys.length == 0)
      {
         queryFilter.orderBys = [new QFilterOrderBy(tableMetaData?.primaryKeyField, false)];
         view.queryFilter = queryFilter;
      }

      setQueryFilter(queryFilter);

      ///////////////////////////////////////////////////////
      // propagate filter's orderBy into grid's sort model //
      ///////////////////////////////////////////////////////
      const gridSort = FilterUtils.getGridSortFromQueryFilter(view.queryFilter);
      setColumnSortModel(gridSort);

      ///////////////////////////////////////////////
      // put this query filter in the current view //
      ///////////////////////////////////////////////
      if(!isFromActivateView)
      {
         view.queryFilter = queryFilter;
         doSetView(view)
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // this force-update causes a re-render that'll see the changed filter hash/json string, and make an updateTable run (if appropriate) //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      forceUpdate();
   }

   /*******************************************************************************
    ** Wrapper around setQueryColumns that also sets column models for the grid, puts
    ** updated queryColumns in the view, and calls doSetView
    *******************************************************************************/
   const doSetQueryColumns = (queryColumns: QQueryColumns, isFromActivateView = false): void =>
   {
      ///////////////////////////////////////////////////////////////////////////////////////
      // if we didn't get queryColumns from our view, it should be a PreLoadQueryColumns - //
      // so that means we should now replace it with defaults for the table.               //
      ///////////////////////////////////////////////////////////////////////////////////////
      if (queryColumns instanceof PreLoadQueryColumns || queryColumns.columns.length == 0)
      {
         console.log(`Building new default QQueryColumns for table [${tableMetaData.name}]`);
         queryColumns = QQueryColumns.buildDefaultForTable(tableMetaData);
         view.queryColumns = queryColumns;
      }

      setQueryColumns(queryColumns);

      ////////////////////////////////
      // set the DataGridPro models //
      ////////////////////////////////
      setupGridColumnModels(metaData, tableMetaData, queryColumns);
      // const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

      ///////////////////////////////////////////
      // put these columns in the current view //
      ///////////////////////////////////////////
      if(!isFromActivateView)
      {
         view.queryColumns = queryColumns;
         doSetView(view)
      }
   }


   /*******************************************************************************
    ** Event handler from BasicAndAdvancedQueryControls for when quickFilterFields change
    *******************************************************************************/
   const doSetQuickFilterFieldNames = (names: string[]) =>
   {
      setQuickFilterFieldNames([...names]);

      view.quickFilterFieldNames = names;
      doSetView(view)
   };


   /*******************************************************************************
    ** Wrapper around setMode - places it into the view and state.
    *******************************************************************************/
   const doSetMode = (newValue: string) =>
   {
      setMode(newValue);

      view.mode = newValue;
      doSetView(view);
   }


   /*******************************************************************************
    ** Helper function for launching processes - counts selected records.
    *******************************************************************************/
   const getNoOfSelectedRecords = () =>
   {
      if (selectFullFilterState === "filter")
      {
         if (isJoinMany(tableMetaData, getVisibleJoinTables()))
         {
            return (distinctRecords);
         }
         return (totalRecords);
      }

      return (selectedIds.length);
   }


   /*******************************************************************************
    ** get a query-string to put on the url to indicate what records are going into
    ** a process.
    *******************************************************************************/
   const getRecordsQueryString = () =>
   {
      if (selectFullFilterState === "filter")
      {
         return `?recordsParam=filterJSON&filterJSON=${encodeURIComponent(JSON.stringify(queryFilter))}`;
      }

      if (selectFullFilterState === "filterSubset")
      {
         return `?recordsParam=filterJSON&filterJSON=${encodeURIComponent(JSON.stringify(queryFilter))}`;
      }

      if (selectedIds.length > 0)
      {
         return `?recordsParam=recordIds&recordIds=${selectedIds.map(r => encodeURIComponent(r)).join(",")}`;
      }

      return "";
   }


   /*******************************************************************************
    ** launch/open a modal process.  Ends up navigating to the process's path w/
    ** records selected via query string.
    *******************************************************************************/
   const openModalProcess = (process: QProcessMetaData = null) =>
   {
      if (selectFullFilterState === "filter")
      {
         setRecordIdsForProcess(queryFilter);
      }
      else if (selectFullFilterState === "filterSubset")
      {
         setRecordIdsForProcess(new QQueryFilter(queryFilter.criteria, queryFilter.orderBys, queryFilter.booleanOperator, 0, selectionSubsetSize));
      }
      else if (selectedIds.length > 0)
      {
         setRecordIdsForProcess(selectedIds);
      }
      else
      {
         setRecordIdsForProcess([]);
      }

      navigate(`${metaData?.getTablePathByName(tableName)}/${process.name}${getRecordsQueryString()}`);
   };


   /*******************************************************************************
    ** close callback for modal processes
    *******************************************************************************/
   const closeModalProcess = (event: object, reason: string) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      /////////////////////////////////////////////////////////////////////////
      // when closing a modal process, navigate up to the table being viewed //
      /////////////////////////////////////////////////////////////////////////
      const newPath = location.pathname.split("/");
      newPath.pop();
      navigate(newPath.join("/"));

      updateTable("close modal process");
   };


   /*******************************************************************************
    ** function to open one of the bulk (insert/edit/delete) processes.
    *******************************************************************************/
   const openBulkProcess = (processNamePart: "Insert" | "Edit" | "Delete", processLabelPart: "Load" | "Edit" | "Delete") =>
   {
      const processList = allTableProcesses.filter(p => p.name.endsWith(`.bulk${processNamePart}`));
      if (processList.length > 0)
      {
         openModalProcess(processList[0]);
      }
      else
      {
         setAlertContent(`Could not find Bulk ${processLabelPart} process for this table.`);
      }
   };

   /*******************************************************************************
    ** Event handler for the bulk-load process being selected
    *******************************************************************************/
   const bulkLoadClicked = () =>
   {
      openBulkProcess("Insert", "Load");
   };


   /*******************************************************************************
    ** Event handler for the bulk-edit process being selected
    *******************************************************************************/
   const bulkEditClicked = () =>
   {
      if (getNoOfSelectedRecords() === 0)
      {
         setAlertContent("No records were selected to Bulk Edit.");
         return;
      }
      openBulkProcess("Edit", "Edit");
   };


   /*******************************************************************************
    ** Event handler for the bulk-delete process being selected
    *******************************************************************************/
   const bulkDeleteClicked = () =>
   {
      if (getNoOfSelectedRecords() === 0)
      {
         setAlertContent("No records were selected to Bulk Delete.");
         return;
      }
      openBulkProcess("Delete", "Delete");
   };


   /*******************************************************************************
    ** Event handler for selecting a process from the menu
    *******************************************************************************/
   const processClicked = (process: QProcessMetaData) =>
   {
      // todo - let the process specify that it needs initial rows - err if none selected.
      //  alternatively, let a process itself have an initial screen to select rows...
      openModalProcess(process);
   };


   //////////////////////////////////////////////
   // custom pagination component for DataGrid //
   //////////////////////////////////////////////
   function CustomPagination()
   {
      return (<CustomPaginationComponent
         tableMetaData={tableMetaData}
         rows={rows}
         totalRecords={totalRecords}
         distinctRecords={distinctRecords}
         pageNumber={pageNumber}
         rowsPerPage={rowsPerPage}
         loading={loading}
         isJoinMany={isJoinMany(tableMetaData, getVisibleJoinTables())}
         handlePageChange={handlePageNumberChange}
         handleRowsPerPageChange={handleRowsPerPageChange}
      />);
   }

   /////////////////////////////////////////
   // custom loading overlay for DataGrid //
   /////////////////////////////////////////
   function CustomLoadingOverlay()
   {
      return (
         <LinearProgress color="info" />
      );
   }

   /*******************************************************************************
    ** wrapper around setting current saved view (as a QRecord) - which also activates
    ** that view.
    *******************************************************************************/
   const doSetCurrentSavedView = (savedView: QRecord) =>
   {
      setCurrentSavedView(savedView);

      if(savedView)
      {
         (async () =>
         {
            const viewJson = savedView.values.get("viewJson")
            const newView = RecordQueryView.buildFromJSON(viewJson);
            newView.viewIdentity = "savedView:" + savedView.values.get("id");
            activateView(newView);

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // todo - we used to be able to set "warnings" here (i think, like, for if a field got deleted from a table... //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // setWarningAlert(models.warning);

            ////////////////////////////////////////////////////////////////
            // todo can/should/does this move into the view's "identity"? //
            ////////////////////////////////////////////////////////////////
            localStorage.setItem(currentSavedViewLocalStorageKey, `${savedView.values.get("id")}`);
         })()
      }
      else
      {
         localStorage.removeItem(currentSavedViewLocalStorageKey);
      }
   }

   /*******************************************************************************
    ** event handler for SavedViews component, to handle user selecting a view
    ** (or clearing / selecting new)
    *******************************************************************************/
   const handleSavedViewChange = async (selectedSavedViewId: number) =>
   {
      if (selectedSavedViewId != null)
      {
         //////////////////////////////////////////////
         // fetch, then activate the selected filter //
         //////////////////////////////////////////////
         setLoading(true);
         setLoadingSavedView(true);
         const qRecord = await fetchSavedView(selectedSavedViewId);
         setLoading(false);
         setLoadingSavedView(false);
         doSetCurrentSavedView(qRecord);
      }
      else
      {
         /////////////////////////////////
         // this is 'new view' - right? //
         /////////////////////////////////

         //////////////////////////////
         // wipe away the saved view //
         //////////////////////////////
         setCurrentSavedView(null);
         localStorage.removeItem(currentSavedViewLocalStorageKey);

         /////////////////////////////////////////////////////
         // go back to a default query filter for the table //
         /////////////////////////////////////////////////////
         doSetQueryFilter(new QQueryFilter());
         // todo not i think doSetQuickFilterFieldNames(getDefaultQuickFilterFieldNames(tableMetaData));

         const queryColumns = QQueryColumns.buildDefaultForTable(tableMetaData);
         doSetQueryColumns(queryColumns)
      }
   }

   /*******************************************************************************
    ** utility function to fetch a saved view from the backend.
    *******************************************************************************/
   const fetchSavedView = async (filterId: number): Promise<QRecord> =>
   {
      let qRecord = null;
      const formData = new FormData();
      formData.append("id", filterId);
      formData.append(QController.STEP_TIMEOUT_MILLIS_PARAM_NAME, 60 * 1000);
      const processResult = await qController.processInit("querySavedView", formData, qController.defaultMultipartFormDataHeaders());
      if (processResult instanceof QJobError)
      {
         const jobError = processResult as QJobError;
         console.error("Could not retrieve saved filter: " + jobError.userFacingError);
      }
      else
      {
         const result = processResult as QJobComplete;
         qRecord = new QRecord(result.values.savedViewList[0]);
      }

      return (qRecord);
   }


   /*******************************************************************************
    ** event handler from columns menu - that copies values from that column
    *******************************************************************************/
   const copyColumnValues = async (column: GridColDef) =>
   {
      let data = "";
      let counter = 0;
      if (latestQueryResults && latestQueryResults.length)
      {
         let [qFieldMetaData, fieldTable] = TableUtils.getFieldAndTable(tableMetaData, column.field);
         for (let i = 0; i < latestQueryResults.length; i++)
         {
            let record = latestQueryResults[i] as QRecord;
            const value = ValueUtils.getUnadornedValueForDisplay(qFieldMetaData, record.values.get(column.field), record.displayValues.get(column.field));
            if (value !== null && value !== undefined && String(value) !== "")
            {
               data += value + "\n";
               counter++;
            }
         }

         if (counter > 0)
         {
            await navigator.clipboard.writeText(data);
            setSuccessAlert(`Copied ${counter} ${qFieldMetaData.label} value${counter == 1 ? "" : "s"}.`);
         }
         else
         {
            setSuccessAlert(`There are no ${qFieldMetaData.label} values to copy.`);
         }
         setTimeout(() => setSuccessAlert(null), 3000);
      }
   };


   /*******************************************************************************
    ** event handler from columns menu - to open the column statistics modal
    *******************************************************************************/
   const openColumnStatistics = async (column: GridColDef) =>
   {
      setFilterForColumnStats(queryFilter);
      setColumnStatsFieldName(column.field);

      const [field, fieldTable] = TableUtils.getFieldAndTable(tableMetaData, column.field);
      setColumnStatsField(field);
      setColumnStatsFieldTableName(fieldTable.name);
   };


   /*******************************************************************************
    ** close handler for column stats modal
    *******************************************************************************/
   const closeColumnStats = (event: object, reason: string) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      setColumnStatsFieldName(null);
      setColumnStatsFieldTableName(null);
      setColumnStatsField(null);
   };


   /////////////////////////////////////////////////
   // custom component for the grid's column-menu //
   // todo - break out into own component/file??  //
   /////////////////////////////////////////////////
   const CustomColumnMenu = forwardRef<HTMLUListElement, GridColumnMenuProps>(
      function GridColumnMenu(props: GridColumnMenuProps, ref)
      {
         const {hideMenu, currentColumn} = props;

         /* see below where this could be used for future additional copy functions
         const [copyMoreMenu, setCopyMoreMenu] = useState(null)
         const openCopyMoreMenu = (event: any) =>
         {
            setCopyMoreMenu(event.currentTarget);
            event.stopPropagation();
         }
         const closeCopyMoreMenu = () => setCopyMoreMenu(null);
         */

         return (
            <GridColumnMenuContainer ref={ref} {...props}>
               <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />

               {
                  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  // in advanced mode, use the default GridFilterMenuItem, which punches into the advanced/filter-builder UI //
                  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  mode == "advanced" && <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
               }

               {
                  ///////////////////////////////////////////////////////////////////////////////////
                  // for basic mode, use our own menu item to turn on this field as a quick-filter //
                  ///////////////////////////////////////////////////////////////////////////////////
                  mode == "basic" && <MenuItem onClick={(e) =>
                  {
                     hideMenu(e);
                     // @ts-ignore
                     basicAndAdvancedQueryControlsRef.current.addField(currentColumn.field);
                  }}>
                     Filter
                  </MenuItem>
               }

               <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
               <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />

               <Divider />
               <GridColumnPinningMenuItems onClick={hideMenu} column={currentColumn!} />
               <Divider />

               <MenuItem sx={{justifyContent: "space-between"}} onClick={(e) =>
               {
                  hideMenu(e);
                  copyColumnValues(currentColumn);
               }}>
                  Copy values

                  {/* idea here was, more options, like what format, or copy all, not just current page...
                  <Button sx={{minHeight: "auto", minWidth: "auto", padding: 0}} onClick={(e) => openCopyMoreMenu(e)}>...</Button>
                  <Menu anchorEl={copyMoreMenu} anchorOrigin={{vertical: "top", horizontal: "right"}} transformOrigin={{vertical: "top", horizontal: "left"}} open={Boolean(copyMoreMenu)} onClose={closeCopyMoreMenu} keepMounted>
                     <MenuItem>Oh</MenuItem>
                     <MenuItem>My</MenuItem>
                  </Menu>
                  */}
               </MenuItem>

               <MenuItem onClick={(e) =>
               {
                  hideMenu(e);
                  openColumnStatistics(currentColumn);
               }}>
                  Column statistics
               </MenuItem>

            </GridColumnMenuContainer>
         );
      });

   /////////////////////////////////////////////////////////////
   // custom component for the column header cells            //
   // where we need custom event handlers for the filter icon //
   // todo - break out into own component/file??              //
   /////////////////////////////////////////////////////////////
   const CustomColumnHeaderFilterIconButton = forwardRef<any, ColumnHeaderFilterIconButtonProps>(
      function ColumnHeaderFilterIconButton(props: ColumnHeaderFilterIconButtonProps, ref)
      {
         if(mode == "basic")
         {
            let showFilter = false;
            for (let i = 0; i < queryFilter?.criteria?.length; i++)
            {
               const criteria = queryFilter.criteria[i];
               if(criteria.fieldName == props.field && criteria.operator)
               {
                  // todo - test values too right?
                  showFilter = true;
               }
            }

            if(showFilter)
            {
               return (<IconButton size="small" sx={{p: "2px"}} onClick={(event) =>
               {
                  // @ts-ignore !?
                  basicAndAdvancedQueryControlsRef.current.addField(props.field);

                  event.stopPropagation();
               }}><Icon fontSize="small">filter_alt</Icon></IconButton>);
            }
         }

         return (<></>);
      });

   ////////////////////////////////////////////////
   // custom component for the grid toolbar      //
   // todo - break out into own component/file?? //
   ////////////////////////////////////////////////
   function CustomToolbar()
   {

      /*******************************************************************************
       ** event handler for mouse-down event - helps w/ avoiding accidental clicks into rows
       *******************************************************************************/
      const handleMouseDown: GridEventListener<"cellMouseDown"> = (
         params, // GridRowParams
         event, // MuiEvent<React.MouseEvent<HTMLElement>>
         details, // GridCallbackDetails
      ) =>
      {
         setGridMouseDownX(event.clientX);
         setGridMouseDownY(event.clientY);
         clearTimeout(timerInstance.current.timer);
      };

      /*******************************************************************************
       ** event handler for double-click event - helps w/ avoiding accidental clicks into rows
       *******************************************************************************/
      const handleDoubleClick: GridEventListener<"rowDoubleClick"> = (event: any) =>
      {
         clearTimeout(timerInstance.current.timer);
      };

      const apiRef = useGridApiContext();
      useGridApiEventHandler(apiRef, "cellMouseDown", handleMouseDown);
      useGridApiEventHandler(apiRef, "rowDoubleClick", handleDoubleClick);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // keep track of any preference windows that are opened in the toolbar, to allow ignoring clicks away from the window //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      useEffect(() =>
      {
         const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
         setGridPreferencesWindow(preferencePanelState.openedPanelValue);
      });

      const joinIsMany = isJoinMany(tableMetaData, visibleJoinTables);

      const selectionMenuOptions: string[] = [];
      selectionMenuOptions.push(`This page (${ValueUtils.safeToLocaleString(distinctRecordsOnPageCount)} ${joinIsMany ? "distinct " : ""}record${distinctRecordsOnPageCount == 1 ? "" : "s"})`);
      selectionMenuOptions.push(`Full query result (${joinIsMany ? ValueUtils.safeToLocaleString(distinctRecords) + ` distinct record${distinctRecords == 1 ? "" : "s"}` : ValueUtils.safeToLocaleString(totalRecords) + ` record${totalRecords == 1 ? "" : "s"}`})`);
      selectionMenuOptions.push(`Subset of the query result ${selectionSubsetSize ? `(${ValueUtils.safeToLocaleString(selectionSubsetSize)} ${joinIsMany ? "distinct " : ""}record${selectionSubsetSize == 1 ? "" : "s"})` : "..."}`);
      selectionMenuOptions.push("Clear selection");


      /*******************************************************************************
       ** util function to check boxes for some or all rows in the grid, in response to
       ** selection menu actions
       *******************************************************************************/
      function programmaticallySelectSomeOrAllRows(max?: number)
      {
         ///////////////////////////////////////////////////////////////////////////////////////////
         // any time the user selects one of the options from our selection menu,                 //
         // we want to check all the boxes on the screen - and - "select" all of the primary keys //
         // unless they did the subset option - then we'll only go up to a 'max' number           //
         ///////////////////////////////////////////////////////////////////////////////////////////
         const rowSelectionModel: GridSelectionModel = [];
         let selectedPrimaryKeys = new Set<string>();
         rows.forEach((value: GridRowModel, index: number) =>
         {
            const primaryKeyValue = latestQueryResults[index].values.get(tableMetaData.primaryKeyField);
            if (max)
            {
               if (selectedPrimaryKeys.size < max)
               {
                  if (!selectedPrimaryKeys.has(primaryKeyValue))
                  {
                     rowSelectionModel.push(value.__rowIndex);
                     selectedPrimaryKeys.add(primaryKeyValue as string);
                  }
               }
            }
            else
            {
               rowSelectionModel.push(value.__rowIndex);
               selectedPrimaryKeys.add(primaryKeyValue as string);
            }
         });
         setRowSelectionModel(rowSelectionModel);
         setSelectedIds([...selectedPrimaryKeys.values()]);
      }


      /*******************************************************************************
       ** event handler (callback) for optiosn in the selection menu
       *******************************************************************************/
      const selectionMenuCallback = (selectedIndex: number) =>
      {
         if(selectedIndex == 0)
         {
            programmaticallySelectSomeOrAllRows();
            setSelectFullFilterState("checked")
         }
         else if(selectedIndex == 1)
         {
            programmaticallySelectSomeOrAllRows();
            setSelectFullFilterState("filter")
         }
         else if(selectedIndex == 2)
         {
            setSelectionSubsetSizePromptOpen(true);
         }
         else if(selectedIndex == 3)
         {
            setSelectFullFilterState("n/a")
            setRowSelectionModel([]);
            setSelectedIds([]);
         }
      };

      //////////////////////////////////////////////////////////////////
      // props that get passed into all of the ExportMenuItem's below //
      //////////////////////////////////////////////////////////////////
      const exportMenuItemRestProps =
         {
            tableMetaData: tableMetaData,
            totalRecords: totalRecords,
            columnsModel: columnsModel,
            columnVisibilityModel: columnVisibilityModel,
            queryFilter: queryFilter
         }

      return (
         <GridToolbarContainer>
            <div>
               <Button id="refresh-button" onClick={() => updateTable("refresh button")} startIcon={<Icon>refresh</Icon>} sx={{pr: "1.25rem"}}>
                  Refresh
               </Button>
            </div>
            {/* @ts-ignore */}
            <GridToolbarColumnsButton nonce={undefined} />
            <div style={{position: "relative"}}>
               {/* @ts-ignore */}
               <GridToolbarDensitySelector nonce={undefined} />
               {/* @ts-ignore */}
               <GridToolbarExportContainer nonce={undefined}>
                  <ExportMenuItem format="csv" {...exportMenuItemRestProps} />
                  <ExportMenuItem format="xlsx" {...exportMenuItemRestProps} />
                  <ExportMenuItem format="json" {...exportMenuItemRestProps} />
               </GridToolbarExportContainer>
            </div>

            <div style={{zIndex: 10}}>
               <MenuButton label="Selection" iconName={selectedIds.length == 0 ? "check_box_outline_blank" : "check_box"} disabled={totalRecords == 0} options={selectionMenuOptions} callback={selectionMenuCallback} />
               <SelectionSubsetDialog isOpen={selectionSubsetSizePromptOpen} initialValue={selectionSubsetSize} closeHandler={(value) =>
               {
                  setSelectionSubsetSizePromptOpen(false);

                  if(value !== undefined)
                  {
                     if(typeof value === "number" && value > 0)
                     {
                        programmaticallySelectSomeOrAllRows(value);
                        setSelectionSubsetSize(value);
                        setSelectFullFilterState("filterSubset")
                     }
                     else
                     {
                        setAlertContent("Unexpected value: " + value);
                     }
                  }
               }} />
            </div>

            <div>
               {
                  selectFullFilterState === "checked" && (
                     <div className="selectionTool">
                        The
                        <strong>{` ${selectedIds.length.toLocaleString()} `}</strong>
                        {joinIsMany ? " distinct " : ""}
                        record{selectedIds.length == 1 ? "" : "s"} on this page {selectedIds.length == 1 ? "is" : "are"} selected.
                     </div>
                  )
               }
               {
                  selectFullFilterState === "filter" && (
                     <div className="selectionTool">
                        {
                           (joinIsMany
                              ? (
                                 distinctRecords == 1
                                    ? (<>The <strong>only 1</strong> distinct record matching this query is selected.</>)
                                    : (<>All <strong>{(distinctRecords ? distinctRecords.toLocaleString() : "")}</strong> distinct records matching this query are selected.</>)
                              )
                              : (<>All <strong>{totalRecords ? totalRecords.toLocaleString() : ""}</strong> records matching this query are selected.</>)
                           )
                        }
                     </div>
                  )
               }
               {
                  selectFullFilterState === "filterSubset" && (
                     <div className="selectionTool">
                        The <a onClick={() => setSelectionSubsetSizePromptOpen(true)} style={{cursor: "pointer"}}><strong>first {ValueUtils.safeToLocaleString(selectionSubsetSize)}</strong></a> {joinIsMany ? "distinct" : ""} record{selectionSubsetSize == 1 ? "" : "s"} matching this query {selectionSubsetSize == 1 ? "is" : "are"} selected.
                     </div>
                  )
               }
               {
                  (selectFullFilterState === "n/a" && selectedIds.length > 0) && (
                     <div className="selectionTool">
                        <strong>{ValueUtils.safeToLocaleString(selectedIds.length)}</strong> {joinIsMany ? "distinct" : ""} {selectedIds.length == 1 ? "record is" : "records are"} selected.
                     </div>
                  )
               }
            </div>
            <div className="pagination">
               <CustomPagination />
            </div>
         </GridToolbarContainer>
      );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////
   // for changes in table controls that don't change the count, call to update the table - //
   // but without clearing out totalRecords (so pagination doesn't flash)                   //
   ///////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (latestQueryId > 0)
      {
         ////////////////////////////////////////////////////////////////////////////////////////
         // to avoid both this useEffect and the one below from both doing an "initial query", //
         // only run this one if at least 1 query has already been ran                         //
         ////////////////////////////////////////////////////////////////////////////////////////
         updateTable("useEffect(pageNumber,rowsPerPage)");
      }
   }, [pageNumber, rowsPerPage]);

   ////////////////////////////////////////////////////////////
   // scroll to the origin when pageNo or rowsPerPage change //
   ////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
   }, [pageNumber, rowsPerPage]);

   ////////////////////////////////////////////////////////////////////
   // if user doesn't have read permission, just show an error alert //
   ////////////////////////////////////////////////////////////////////
   if (tableMetaData && !tableMetaData.readPermission)
   {
      return (
         <BaseLayout>
            <Alert severity="error">
               You do not have permission to view {tableMetaData?.label} records
            </Alert>
         </BaseLayout>
      );
   }

   /*******************************************************************************
    ** maybe something to do with how page header is in a context, but, it didn't
    ** work to check pageLoadingState.isLoadingSlow inside an element that we put
    ** in the page header, so, this works instead.
    *******************************************************************************/
   const setPageHeaderToLoadingSlow = (): void =>
   {
      setPageHeader("Loading...")
   }

   /////////////////////////////////////////////////////////////////////////////////
   // use this to make changes to the queryFilter more likely to re-run the query //
   /////////////////////////////////////////////////////////////////////////////////
   const [filterHash, setFilterHash] = useState("");

   if(pageState == "ready")
   {
      const newFilterHash = JSON.stringify(prepQueryFilterForBackend(queryFilter));
      if (filterHash != newFilterHash)
      {
         setFilterHash(newFilterHash);
         updateTable("hash change");
      }
   }

   ////////////////////////////////////////////////////////////
   // handle the initial page state -- by fetching meta-data //
   ////////////////////////////////////////////////////////////
   if (pageState == "initial")
   {
      console.log("@dk - page state is initial - going to loadingMetaData...");
      setPageState("loadingMetaData");
      pageLoadingState.setLoading();

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // reset the page header to blank, and tell the pageLoadingState object that if it becomes slow, to show 'Loading' //
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      setPageHeader("");
      pageLoadingState.setUponSlowCallback(setPageHeaderToLoadingSlow);

      (async () =>
      {
         const metaData = await qController.loadMetaData();
         setMetaData(metaData);

         const tableMetaData = await qController.loadTableMetaData(tableName);
         setTableMetaData(tableMetaData);
         setTableLabel(tableMetaData.label);

         setTableProcesses(ProcessUtils.getProcessesForTable(metaData, tableName)); // these are the ones to show in the dropdown
         setAllTableProcesses(ProcessUtils.getProcessesForTable(metaData, tableName, true)); // these include hidden ones (e.g., to find the bulks)

         setPageState("loadedMetaData");
      })();
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle the secondary page state - after meta-data is in state - by figuring out the current view //
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   if (pageState == "loadedMetaData")
   {
      console.log("@dk - page state is loadedMetaData - going to loadingView...");
      setPageState("loadingView");

      (async () =>
      {
         if (searchParams && searchParams.has("filter"))
         {
            //////////////////////////////////////////////////////////////////////////////////////
            // if there's a filter in the URL - then set that as the filter in the current view //
            //////////////////////////////////////////////////////////////////////////////////////
            try
            {
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // todo - some version of "you've browsed back here, so if active view (local-storage) is the same as this, then keep old... //
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               console.log(`history state: ${JSON.stringify(window.history.state)}`);

               ///////////////////////////////////////////////////////////////////////////////////////////////////
               // parse the filter json into a filer object - then clean up values in it (e.g., translate PV's) //
               ///////////////////////////////////////////////////////////////////////////////////////////////////
               const filterJSON = JSON.parse(searchParams.get("filter"));
               const queryFilter = filterJSON as QQueryFilter;

               await FilterUtils.cleanupValuesInFilerFromQueryString(qController, tableMetaData, queryFilter);

               ///////////////////////////////////////////////////////////////////////////////////////////
               // set this new query filter in the view, and activate the full view                     //
               // stuff other than the query filter should "stick" from what user had active previously //
               ///////////////////////////////////////////////////////////////////////////////////////////
               view.queryFilter = queryFilter;
               activateView(view);

               /////////////////////////////////////////////////////////////////////////////////////////////
               // make sure that we clear out any currently saved view - we're no longer in such a state. //
               /////////////////////////////////////////////////////////////////////////////////////////////
               doSetCurrentSavedView(null);
            }
            catch(e)
            {
               setAlertContent("Error parsing filter from URL");
            }
         }
         else if (filterIdInLocation)
         {
            if(view.viewIdentity == `savedView:${filterIdInLocation}`)
            {
               /////////////////////////////////////////////////////////////////////////////////////////////////
               // if the view id in the location is the same as the view that was most-recently active here,  //
               // then we want to act like that old view is active - but - in case the user changed anything, //
               // we want to keep their current settings as the active view - thus - use the current 'view'   //
               // state variable (e.g., from local storage) as the view to be activated.                      //
               /////////////////////////////////////////////////////////////////////////////////////////////////
               console.log(`Initializing view to a (potentially dirty) saved view (id=${filterIdInLocation})`);
               activateView(view);

               /////////////////////////////////////////////////////////////////////////////////////////////////////////
               // now fetch that savedView, and set it in state, but don't activate it - because that would overwrite //
               // anything the user may have changed (e.g., anything in the local-storage/state view).                //
               /////////////////////////////////////////////////////////////////////////////////////////////////////////
               const savedViewRecord = await fetchSavedView(filterIdInLocation);
               setCurrentSavedView(savedViewRecord);
            }
            else
            {
               ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // if there's a filterId in the location, but it isn't the last one the user had active, then set that as our active view //
               ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               console.log(`Initializing view to a clean saved view (id=${filterIdInLocation})`);
               await handleSavedViewChange(filterIdInLocation);
            }
         }
         else
         {
            //////////////////////////////////////////////////////////////////
            // view is ad-hoc - just activate the view that was last active //
            //////////////////////////////////////////////////////////////////
            activateView(view);
         }

         setPageState("loadedView");
      })();
   }

   //////////////////////////////////////////////////////////////////////////////////////////////
   // handle the 3rd page state - after we have the view loaded - prepare the grid for display //
   //////////////////////////////////////////////////////////////////////////////////////////////
   if (pageState == "loadedView")
   {
      console.log("@dk - page state is loadedView - going to preparingGrid...");
      setPageState("preparingGrid");

      (async () =>
      {
         const visibleJoinTables = getVisibleJoinTables();
         setPageHeader(getPageHeader(tableMetaData, visibleJoinTables, tableVariant));

         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // todo - we used to be able to set "warnings" here (i think, like, for if a field got deleted from a table... //
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // setWarningAlert(models.warning);

         ////////////////////////////////////////////////////////////////////////////////////////
         // this ref may not be defined on the initial render, so, make this call in a timeout //
         ////////////////////////////////////////////////////////////////////////////////////////
         setTimeout(() =>
         {
            // @ts-ignore
            basicAndAdvancedQueryControlsRef?.current?.ensureAllFilterCriteriaAreActiveQuickFilters(view.queryFilter, "defaultFilterLoaded")
         });

         //////////////////////////////////////////////////////////////////////////////////////////////////
         // make sure that any if any sort columns are from a join table, that the join table is visible //
         // todo - figure out what this is, see if still needed, etc...
         //////////////////////////////////////////////////////////////////////////////////////////////////
         /*
         let resetColumnSortModel = false;
         for (let i = 0; i < columnSortModel.length; i++)
         {
            const gridSortItem = columnSortModel[i];
            if (gridSortItem.field.indexOf(".") > -1)
            {
               const tableName = gridSortItem.field.split(".")[0];
               if (!visibleJoinTables?.has(tableName))
               {
                  columnSortModel.splice(i, 1);
                  setColumnSortModel(columnSortModel);
                  // todo - need to setQueryFilter?
                  resetColumnSortModel = true;
                  i--;
               }
            }
         }

         if (resetColumnSortModel && latestQueryId > 0)
         {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // let the next render (since columnSortModel is watched below) build the filter, using the new columnSort //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            return;
         }
         */

         console.log("@dk - finished preparing grid, going to page state ready");
         setPageState("ready");

         // todo - is this sufficient?
         if (tableMetaData?.usesVariants && !tableVariant)
         {
            promptForTableVariantSelection();
            return;
         }
      })();
      return (getLoadingScreen());
   }

   ////////////////////////////////////////////////////////////////////////
   // trigger initial update-table call after page-state goes into ready //
   ////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if(pageState == "ready")
      {
         pageLoadingState.setNotLoading()

         if(!tableVariantPromptOpen)
         {
            updateTable("pageState is now ready")
         }
      }
   }, [pageState, tableVariantPromptOpen]);

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // any time these are out of sync, it means we've navigated to a different table, so we need to reload :allthethings: //
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   if (tableMetaData && tableMetaData.name !== tableName)
   {
      console.log(`Found mis-match between tableMetaData.name and tableName [${tableMetaData.name}]!=[${tableName}] - reload everything.`);
      setPageState("initial");
      setTableMetaData(null);
      setColumnSortModel([]);
      setColumnsModel([]);
      setQueryFilter(new QQueryFilter());
      setQueryColumns(new PreLoadQueryColumns());
      setRows([]);

      return (getLoadingScreen());
   }

   /////////////////////////////////////////////////////////////////////////////////////////////
   // if the table doesn't allow QUERY, but does allow GET, don't render a data grid -        //
   // instead, try to just render a Goto Record button, in auto-open, and may-not-close modes //
   /////////////////////////////////////////////////////////////////////////////////////////////
   if (tableMetaData && !tableMetaData.capabilities.has(Capability.TABLE_QUERY) && tableMetaData.capabilities.has(Capability.TABLE_GET))
   {
      if(tableMetaData?.usesVariants && (!tableVariant || tableVariantPromptOpen))
      {
         return (
            <BaseLayout>
               <TableVariantDialog table={tableMetaData} isOpen={true} closeHandler={(value: QTableVariant) =>
               {
                  setTableVariantPromptOpen(false);
                  setTableVariant(value);
               }} />
            </BaseLayout>
         );
      }

      ////////////////////////////////////////////////////////////////////////////////////
      // if the table uses variants, then put the variant-selector into the goto dialog //
      ////////////////////////////////////////////////////////////////////////////////////
      let gotoVariantSubHeader = <></>;
      if(tableMetaData?.usesVariants)
      {
         gotoVariantSubHeader = <Box mb={2}>{getTableVariantHeader(tableVariant)}</Box>
      }

      return (
         <BaseLayout>
            <GotoRecordButton metaData={metaData} tableMetaData={tableMetaData} tableVariant={tableVariant} autoOpen={true} buttonVisible={false} mayClose={false} subHeader={gotoVariantSubHeader} />
         </BaseLayout>
      );
   }

   ///////////////////////////////////////////////////////////
   // render a loading screen if the page state isn't ready //
   ///////////////////////////////////////////////////////////
   if(pageState != "ready")
   {
      console.log(`@dk - page state is ${pageState}... no-op while those complete async's run...`);
      return (getLoadingScreen());
   }

   ///////////////////////////////////////////////////////////////////////////////////////////
   // if the table isn't loaded yet, display loading screen.                                //
   // this shouldn't be possible, to be out-of-sync with pageState, but just as a fail-safe //
   ///////////////////////////////////////////////////////////////////////////////////////////
   if(!tableMetaData)
   {
      return (getLoadingScreen());
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // for basic mode, set a custom ColumnHeaderFilterIconButton - w/ action to activate basic-mode quick-filter //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   let restOfDataGridProCustomComponents: any = {}
   if(mode == "basic")
   {
      restOfDataGridProCustomComponents.ColumnHeaderFilterIconButton = CustomColumnHeaderFilterIconButton;
   }

   ////////////////////////
   // main screen render //
   ////////////////////////
   return (
      <BaseLayout>
         <div className="recordQuery">
            {/*
            // see code in ExportMenuItem that would use this
            <iframe id="exportIFrame" name="exportIFrame">
               <form method="post" target="_self">
                  <input type="hidden" id="authorizationInput" name="Authorization" />
               </form>
            </iframe>
            */}
            <Box mb={3}>
               {alertContent ? (
                  <Box mb={3}>
                     <Alert
                        severity="error"
                        onClose={() =>
                        {
                           setAlertContent(null);
                        }}
                     >
                        {alertContent}
                     </Alert>
                  </Box>
               ) : (
                  ""
               )}
               {
                  (tableLabel && showSuccessfullyDeletedAlert) ? (
                     <Alert color="success" sx={{mb: 3}} onClose={() => setShowSuccessfullyDeletedAlert(false)}>{`${tableLabel} successfully deleted`}</Alert>
                  ) : null
               }
               {
                  (successAlert) ? (
                     <Collapse in={Boolean(successAlert)}>
                        <Alert color="success" sx={{mb: 3}} onClose={() => setSuccessAlert(null)}>{successAlert}</Alert>
                     </Collapse>
                  ) : null
               }
               {
                  (warningAlert) ? (
                     <Collapse in={Boolean(warningAlert)}>
                        <Alert color="warning" icon={<Icon>warning</Icon>} sx={{mb: 3}} onClose={() => setWarningAlert(null)}>{warningAlert}</Alert>
                     </Collapse>
                  ) : null
               }
               <Box display="flex" justifyContent="flex-end" alignItems="flex-start" mb={2}>
                  <Box display="flex" marginRight="auto">
                     {
                        metaData && metaData.processes.has("querySavedView") &&
                        <SavedViews qController={qController} metaData={metaData} tableMetaData={tableMetaData} view={view} viewAsJson={viewAsJson} currentSavedView={currentSavedView} viewOnChangeCallback={handleSavedViewChange} loadingSavedView={loadingSavedView} />
                     }
                  </Box>

                  <GotoRecordButton metaData={metaData} tableMetaData={tableMetaData} />
                  <Box display="flex" width="150px">
                     {
                        tableMetaData &&
                        <QueryScreenActionMenu
                           metaData={metaData}
                           tableMetaData={tableMetaData}
                           tableProcesses={tableProcesses}
                           bulkLoadClicked={bulkLoadClicked}
                           bulkEditClicked={bulkEditClicked}
                           bulkDeleteClicked={bulkDeleteClicked}
                           processClicked={processClicked}
                        />
                     }
                  </Box>
                  {
                     table.capabilities.has(Capability.TABLE_INSERT) && table.insertPermission &&
                     <QCreateNewButton tablePath={metaData?.getTablePathByName(tableName)} />
                  }
               </Box>

               {
                  metaData && tableMetaData &&
                  <BasicAndAdvancedQueryControls
                     ref={basicAndAdvancedQueryControlsRef}
                     metaData={metaData}
                     tableMetaData={tableMetaData}
                     queryFilter={queryFilter}
                     queryFilterJSON={JSON.stringify(queryFilter)}
                     setQueryFilter={doSetQueryFilter}
                     quickFilterFieldNames={quickFilterFieldNames}
                     setQuickFilterFieldNames={doSetQuickFilterFieldNames}
                     gridApiRef={gridApiRef}
                     mode={mode}
                     setMode={doSetMode}
                  />
               }

               <Card>
                  <Box height="100%">
                     <DataGridPro
                        apiRef={gridApiRef}
                        components={{
                           Toolbar: CustomToolbar,
                           Pagination: CustomPagination,
                           LoadingOverlay: CustomLoadingOverlay,
                           ColumnMenu: CustomColumnMenu,
                           ColumnsPanel: CustomColumnsPanel,
                           FilterPanel: CustomFilterPanel,
                           ... restOfDataGridProCustomComponents
                        }}
                        componentsProps={{
                           columnsPanel:
                              {
                                 tableMetaData: tableMetaData,
                                 metaData: metaData,
                                 initialOpenedGroups: columnChooserOpenGroups,
                                 openGroupsChanger: setColumnChooserOpenGroups,
                                 initialFilterText: columnChooserFilterText,
                                 filterTextChanger: setColumnChooserFilterText
                              },
                           filterPanel:
                              {
                                 tableMetaData: tableMetaData,
                                 metaData: metaData,
                                 queryFilter: queryFilter,
                                 updateFilter: doSetQueryFilter,
                              }
                        }}
                        localeText={{
                           toolbarFilters: "Filter", // label on the filters button.  we prefer singular (1 filter has many "conditions" in it).
                           toolbarFiltersLabel: "", // setting these 3 to "" turns off the "Show Filters" and "Hide Filters" tooltip (which can get in the way of the actual filters panel)
                           toolbarFiltersTooltipShow: "",
                           toolbarFiltersTooltipHide: "",
                           toolbarFiltersTooltipActive: count => count !== 1 ? `${count} conditions` : `${count} condition`
                        }}
                        pinnedColumns={pinnedColumns}
                        onPinnedColumnsChange={handlePinnedColumnsChange}
                        pagination
                        paginationMode="server"
                        sortingMode="server"
                        filterMode="server"
                        page={pageNumber}
                        checkboxSelection
                        disableSelectionOnClick
                        autoHeight={false}
                        rows={rows}
                        // getRowHeight={() => "auto"} // maybe nice?  wraps values in cells...
                        columns={columnsModel}
                        rowBuffer={10}
                        rowCount={totalRecords === null || totalRecords === undefined ? 0 : totalRecords}
                        onPageSizeChange={handleRowsPerPageChange}
                        onRowClick={handleRowClick}
                        onStateChange={handleStateChange}
                        density={density}
                        loading={loading}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={handleColumnVisibilityChange}
                        onColumnOrderChange={handleColumnOrderChange}
                        onColumnResize={handleColumnResize}
                        onSelectionModelChange={handleSelectionChanged}
                        onSortModelChange={handleSortChange}
                        sortingOrder={["asc", "desc"]}
                        sortModel={columnSortModel}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
                        getRowId={(row) => row.__rowIndex}
                        selectionModel={rowSelectionModel}
                        hideFooterSelectedRowCount={true}
                        sx={{border: 0, height: tableMetaData?.usesVariants ? "calc(100vh - 300px)" : "calc(100vh - 270px)"}}
                     />
                  </Box>
               </Card>
            </Box>

            {
               activeModalProcess && tableMetaData &&
               <Modal open={activeModalProcess !== null} onClose={(event, reason) => closeModalProcess(event, reason)}>
                  <div className="modalProcess">
                     <ProcessRun process={activeModalProcess} isModal={true} table={tableMetaData} recordIds={recordIdsForProcess} closeModalHandler={closeModalProcess} />
                  </div>
               </Modal>
            }

            {
               tableMetaData &&
               <TableVariantDialog table={tableMetaData} isOpen={tableVariantPromptOpen} closeHandler={(value: QTableVariant) =>
               {
                  setTableVariantPromptOpen(false);
                  setTableVariant(value);
                  setPageHeader(getPageHeader(tableMetaData, visibleJoinTables, value));
               }} />
            }

            {
               columnStatsFieldName &&
               <Modal open={columnStatsFieldName !== null} onClose={(event, reason) => closeColumnStats(event, reason)}>
                  <div className="columnStatsModal">
                     <Box sx={{position: "absolute", overflowY: "auto", maxHeight: "100%", width: "100%"}}>
                        <Card sx={{my: 5, mx: "auto", pb: 0, maxWidth: "1024px"}}>
                           <Box component="div">
                              <ColumnStats tableMetaData={tableMetaData} fieldMetaData={columnStatsField} fieldTableName={columnStatsFieldTableName} filter={filterForColumnStats} />
                              <Box p={3} display="flex" flexDirection="row" justifyContent="flex-end">
                                 <QCancelButton label="Close" onClickHandler={() => closeColumnStats(null, null)} disabled={false} />
                              </Box>
                           </Box>
                        </Card>
                     </Box>
                  </div>
               </Modal>
            }
         </div>
      </BaseLayout>
   );
}

export default RecordQuery;
