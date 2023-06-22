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
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {QueryJoin} from "@kingsrook/qqq-frontend-core/lib/model/query/QueryJoin";
import {Alert, Collapse, TablePagination} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import {DataGridPro, GridCallbackDetails, GridColDef, GridColumnMenuContainer, GridColumnMenuProps, GridColumnOrderChangeParams, GridColumnPinningMenuItems, GridColumnsMenuItem, GridColumnVisibilityModel, GridDensity, GridEventListener, GridExportMenuItemProps, GridFilterMenuItem, GridFilterModel, GridPinnedColumns, gridPreferencePanelStateSelector, GridRowId, GridRowParams, GridRowsProp, GridSelectionModel, GridSortItem, GridSortModel, GridState, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExportContainer, GridToolbarFilterButton, HideGridColMenuItem, MuiEvent, SortGridMenuItems, useGridApiContext, useGridApiEventHandler, useGridSelector} from "@mui/x-data-grid-pro";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import FormData from "form-data";
import React, {forwardRef, useContext, useEffect, useReducer, useRef, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import QContext from "QContext";
import {QActionsMenuButton, QCancelButton, QCreateNewButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";
import MenuButton from "qqq/components/buttons/MenuButton";
import SavedFilters from "qqq/components/misc/SavedFilters";
import {CustomColumnsPanel} from "qqq/components/query/CustomColumnsPanel";
import {CustomFilterPanel} from "qqq/components/query/CustomFilterPanel";
import CustomWidthTooltip from "qqq/components/tooltips/CustomWidthTooltip";
import BaseLayout from "qqq/layouts/BaseLayout";
import ProcessRun from "qqq/pages/processes/ProcessRun";
import ColumnStats from "qqq/pages/records/query/ColumnStats";
import DataGridUtils from "qqq/utils/DataGridUtils";
import Client from "qqq/utils/qqq/Client";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import ProcessUtils from "qqq/utils/qqq/ProcessUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

const CURRENT_SAVED_FILTER_ID_LOCAL_STORAGE_KEY_ROOT = "qqq.currentSavedFilterId";
const COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT = "qqq.columnVisibility";
const COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT = "qqq.columnSort";
const FILTER_LOCAL_STORAGE_KEY_ROOT = "qqq.filter";
const ROWS_PER_PAGE_LOCAL_STORAGE_KEY_ROOT = "qqq.rowsPerPage";
const PINNED_COLUMNS_LOCAL_STORAGE_KEY_ROOT = "qqq.pinnedColumns";
const SEEN_JOIN_TABLES_LOCAL_STORAGE_KEY_ROOT = "qqq.seenJoinTables";
const DENSITY_LOCAL_STORAGE_KEY_ROOT = "qqq.density";

interface Props
{
   table?: QTableMetaData;
   launchProcess?: QProcessMetaData;
}

RecordQuery.defaultProps = {
   table: null,
   launchProcess: null
};

const qController = Client.getInstance();

function RecordQuery({table, launchProcess}: Props): JSX.Element
{
   const tableName = table.name;
   const [searchParams] = useSearchParams();

   const [showSuccessfullyDeletedAlert, setShowSuccessfullyDeletedAlert] = useState(false);
   const [warningAlert, setWarningAlert] = useState(null as string);
   const [successAlert, setSuccessAlert] = useState(null as string);

   const location = useLocation();
   const navigate = useNavigate();

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

   const pathParts = location.pathname.replace(/\/+$/, "").split("/");

   ////////////////////////////////////////////
   // look for defaults in the local storage //
   ////////////////////////////////////////////
   const currentSavedFilterLocalStorageKey = `${CURRENT_SAVED_FILTER_ID_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const sortLocalStorageKey = `${COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const rowsPerPageLocalStorageKey = `${ROWS_PER_PAGE_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const pinnedColumnsLocalStorageKey = `${PINNED_COLUMNS_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const seenJoinTablesLocalStorageKey = `${SEEN_JOIN_TABLES_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const columnVisibilityLocalStorageKey = `${COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const filterLocalStorageKey = `${FILTER_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   let defaultSort = [] as GridSortItem[];
   let defaultVisibility = {} as { [index: string]: boolean };
   let didDefaultVisibilityComeFromLocalStorage = false;
   let defaultRowsPerPage = 10;
   let defaultDensity = "standard" as GridDensity;
   let defaultPinnedColumns = {left: ["__check__", "id"]} as GridPinnedColumns;
   let seenJoinTables: {[tableName: string]: boolean} = {};

   ////////////////////////////////////////////////////////////////////////////////////
   // set the to be not per table (do as above if we want per table) at a later port //
   ////////////////////////////////////////////////////////////////////////////////////
   const densityLocalStorageKey = `${DENSITY_LOCAL_STORAGE_KEY_ROOT}`;

   if (localStorage.getItem(sortLocalStorageKey))
   {
      defaultSort = JSON.parse(localStorage.getItem(sortLocalStorageKey));
   }
   if (localStorage.getItem(columnVisibilityLocalStorageKey))
   {
      defaultVisibility = JSON.parse(localStorage.getItem(columnVisibilityLocalStorageKey));
      didDefaultVisibilityComeFromLocalStorage = true;
   }
   if (localStorage.getItem(pinnedColumnsLocalStorageKey))
   {
      defaultPinnedColumns = JSON.parse(localStorage.getItem(pinnedColumnsLocalStorageKey));
   }
   if (localStorage.getItem(rowsPerPageLocalStorageKey))
   {
      defaultRowsPerPage = JSON.parse(localStorage.getItem(rowsPerPageLocalStorageKey));
   }
   if (localStorage.getItem(densityLocalStorageKey))
   {
      defaultDensity = JSON.parse(localStorage.getItem(densityLocalStorageKey));
   }
   if (localStorage.getItem(seenJoinTablesLocalStorageKey))
   {
      seenJoinTables = JSON.parse(localStorage.getItem(seenJoinTablesLocalStorageKey));
   }

   const [filterModel, setFilterModel] = useState({items: []} as GridFilterModel);
   const [lastFetchedQFilterJSON, setLastFetchedQFilterJSON] = useState("");
   const [columnSortModel, setColumnSortModel] = useState(defaultSort);
   const [queryFilter, setQueryFilter] = useState(new QQueryFilter());

   const [columnVisibilityModel, setColumnVisibilityModel] = useState(defaultVisibility);
   const [shouldSetAllNewJoinFieldsToHidden, setShouldSetAllNewJoinFieldsToHidden] = useState(!didDefaultVisibilityComeFromLocalStorage)
   const [visibleJoinTables, setVisibleJoinTables] = useState(new Set<string>());
   const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
   const [density, setDensity] = useState(defaultDensity);
   const [pinnedColumns, setPinnedColumns] = useState(defaultPinnedColumns);

   const initialColumnChooserOpenGroups = {} as { [name: string]: boolean };
   initialColumnChooserOpenGroups[tableName] = true;
   const [columnChooserOpenGroups, setColumnChooserOpenGroups] = useState(initialColumnChooserOpenGroups);
   const [columnChooserFilterText, setColumnChooserFilterText] = useState("");

   const [tableState, setTableState] = useState("");
   const [metaData, setMetaData] = useState(null as QInstance);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [defaultFilterLoaded, setDefaultFilterLoaded] = useState(false);
   const [actionsMenu, setActionsMenu] = useState(null);
   const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
   const [allTableProcesses, setAllTableProcesses] = useState([] as QProcessMetaData[]);
   const [pageNumber, setPageNumber] = useState(0);
   const [totalRecords, setTotalRecords] = useState(null);
   const [distinctRecords, setDistinctRecords] = useState(null);
   const [selectedIds, setSelectedIds] = useState([] as string[]);
   const [distinctRecordsOnPageCount, setDistinctRecordsOnPageCount] = useState(null as number);
   const [selectionSubsetSize, setSelectionSubsetSize] = useState(null as number);
   const [selectionSubsetSizePromptOpen, setSelectionSubsetSizePromptOpen] = useState(false);
   const [selectFullFilterState, setSelectFullFilterState] = useState("n/a" as "n/a" | "checked" | "filter" | "filterSubset");
   const [rowSelectionModel, setRowSelectionModel] = useState<GridSelectionModel>([]);
   const [columnsModel, setColumnsModel] = useState([] as GridColDef[]);
   const [rows, setRows] = useState([] as GridRowsProp[]);
   const [loading, setLoading] = useState(true);
   const [alertContent, setAlertContent] = useState("");
   const [tableLabel, setTableLabel] = useState("");
   const [gridMouseDownX, setGridMouseDownX] = useState(0);
   const [gridMouseDownY, setGridMouseDownY] = useState(0);
   const [gridPreferencesWindow, setGridPreferencesWindow] = useState(undefined);
   const [showClearFiltersWarning, setShowClearFiltersWarning] = useState(false);
   const [hasValidFilters, setHasValidFilters] = useState(false);
   const [currentSavedFilter, setCurrentSavedFilter] = useState(null as QRecord);

   const [activeModalProcess, setActiveModalProcess] = useState(null as QProcessMetaData);
   const [launchingProcess, setLaunchingProcess] = useState(launchProcess);
   const [recordIdsForProcess, setRecordIdsForProcess] = useState(null as string | QQueryFilter);
   const [columnStatsFieldName, setColumnStatsFieldName] = useState(null as string);
   const [columnStatsField, setColumnStatsField] = useState(null as QFieldMetaData);
   const [columnStatsFieldTableName, setColumnStatsFieldTableName] = useState(null as string)
   const [filterForColumnStats, setFilterForColumnStats] = useState(null as QQueryFilter);

   const instance = useRef({timer: null});

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // use all these states to avoid showing results from an "old" query, that finishes loading after a newer one //
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   const [latestQueryId, setLatestQueryId] = useState(0);
   const [countResults, setCountResults] = useState({} as any);
   const [receivedCountTimestamp, setReceivedCountTimestamp] = useState(new Date());
   const [queryResults, setQueryResults] = useState({} as any);
   const [latestQueryResults, setLatestQueryResults] = useState(null as QRecord[]);
   const [receivedQueryTimestamp, setReceivedQueryTimestamp] = useState(new Date());
   const [queryErrors, setQueryErrors] = useState({} as any);
   const [receivedQueryErrorTimestamp, setReceivedQueryErrorTimestamp] = useState(new Date());

   const {setPageHeader} = useContext(QContext);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
   const closeActionsMenu = () => setActionsMenu(null);

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
         // the path for a savedFilter looks like: .../table/savedFilter/32 //
         // so if path has '/savedFilter/' get last parsed string           //
         /////////////////////////////////////////////////////////////////////
         let currentSavedFilterId = null as number;
         if (location.pathname.indexOf("/savedFilter/") != -1)
         {
            const parts = location.pathname.split("/");
            currentSavedFilterId = Number.parseInt(parts[parts.length - 1]);
         }
         else if (!searchParams.has("filter"))
         {
            if (localStorage.getItem(currentSavedFilterLocalStorageKey))
            {
               currentSavedFilterId = Number.parseInt(localStorage.getItem(currentSavedFilterLocalStorageKey));
               navigate(`${metaData.getTablePathByName(tableName)}/savedFilter/${currentSavedFilterId}`);
            }
            else
            {
               setCurrentSavedFilter(null);
            }
         }

         if (currentSavedFilterId != null)
         {
            (async () =>
            {
               const formData = new FormData();
               formData.append("id", currentSavedFilterId);
               formData.append(QController.STEP_TIMEOUT_MILLIS_PARAM_NAME, 60 * 1000);
               const processResult = await qController.processInit("querySavedFilter", formData, qController.defaultMultipartFormDataHeaders());
               if (processResult instanceof QJobError)
               {
                  const jobError = processResult as QJobError;
                  console.error("Could not retrieve saved filter: " + jobError.userFacingError);
               }
               else
               {
                  const result = processResult as QJobComplete;
                  const qRecord = new QRecord(result.values.savedFilterList[0]);
                  setCurrentSavedFilter(qRecord);
               }
            })();
         }
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

   const updateColumnVisibilityModel = () =>
   {
      if (localStorage.getItem(columnVisibilityLocalStorageKey))
      {
         const visibility = JSON.parse(localStorage.getItem(columnVisibilityLocalStorageKey));
         setColumnVisibilityModel(visibility);
         didDefaultVisibilityComeFromLocalStorage = true;
      }
   }

   ///////////////////////////////////////////////////////////////////////
   // any time these are out of sync, it means we need to reload things //
   ///////////////////////////////////////////////////////////////////////
   if (tableMetaData && tableMetaData.name !== tableName)
   {
      setTableMetaData(null);
      setColumnSortModel([]);
      updateColumnVisibilityModel();
      setColumnsModel([]);
      setFilterModel({items: []});
      setQueryFilter(new QQueryFilter());
      setDefaultFilterLoaded(false);
      setRows([]);
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////
   // note - important to take tableMetaData as a param, even though it's a state var, as the          //
   // first time we call in here, we may not yet have set it in state (but will have fetched it async) //
   // so we'll pass in the local version of it!                                                        //
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   const buildQFilter = (tableMetaData: QTableMetaData, filterModel: GridFilterModel, limit?: number) =>
   {
      let filter = FilterUtils.buildQFilterFromGridFilter(tableMetaData, filterModel, columnSortModel, limit);
      filter = FilterUtils.convertFilterPossibleValuesToIds(filter);
      setHasValidFilters(filter.criteria && filter.criteria.length > 0);
      return (filter);
   };

   const getVisibleJoinTables = (): Set<string> =>
   {
      const visibleJoinTables = new Set<string>();
      columnsModel.forEach((gridColumn) =>
      {
         const fieldName = gridColumn.field;
         if (columnVisibilityModel[fieldName] !== false)
         {
            if (fieldName.indexOf(".") > -1)
            {
               visibleJoinTables.add(fieldName.split(".")[0]);
            }
         }
      });

      filterModel.items.forEach((item) =>
      {
         // todo - some test if there is a value?  see FilterUtils.buildQFilterFromGridFilter (re-use if needed)

         const fieldName = item.columnField;
         if(fieldName.indexOf(".") > -1)
         {
            visibleJoinTables.add(fieldName.split(".")[0]);
         }
      });

      return (visibleJoinTables);
   };

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

   const getPageHeader = (tableMetaData: QTableMetaData, visibleJoinTables: Set<string>): string | JSX.Element =>
   {
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
               {tableMetaData?.label}
               <CustomWidthTooltip title={tooltipHTML}>
                  <IconButton sx={{p: 0, fontSize: "0.5rem", mb: 1, color: "#9f9f9f", fontVariationSettings: "'wght' 100"}}><Icon fontSize="small">emergency</Icon></IconButton>
               </CustomWidthTooltip>
            </div>);
      }
      else
      {
         return (tableMetaData?.label);
      }
   };

   const updateTable = () =>
   {
      setLoading(true);
      setRows([]);
      (async () =>
      {
         const tableMetaData = await qController.loadTableMetaData(tableName);

         const visibleJoinTables = getVisibleJoinTables();
         setPageHeader(getPageHeader(tableMetaData, visibleJoinTables));

         ////////////////////////////////////////////////////////////////////////////////////////////////////////
         // if there's an exposedJoin that we haven't seen before, we want to make sure that all of its fields //
         // don't immediately become visible to the user, so, turn them all off!                               //
         ////////////////////////////////////////////////////////////////////////////////////////////////////////
         if (tableMetaData?.exposedJoins)
         {
            for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
            {
               const join = tableMetaData.exposedJoins[i];
               const joinTableName = join.joinTable.name;
               if(!seenJoinTables[joinTableName] || shouldSetAllNewJoinFieldsToHidden)
               {
                  for (let fieldName of join.joinTable.fields.keys())
                  {
                     columnVisibilityModel[`${join.joinTable.name}.${fieldName}`] = false;
                  }
               }
            }
            handleColumnVisibilityChange(columnVisibilityModel);
            setShouldSetAllNewJoinFieldsToHidden(false);
         }

         setColumnVisibilityModel(columnVisibilityModel);

         ///////////////////////////////////////////////////////////////////////////////////////////////////
         // store the set of join tables that the user has "seen" (e.g, have been in the table meta data) //
         // this is part of the turning-off of new joins seen above                                       //
         ///////////////////////////////////////////////////////////////////////////////////////////////////
         if(tableMetaData?.exposedJoins)
         {
            const newSeenJoins: {[tableName: string]: boolean} = {};
            for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
            {
               const join = tableMetaData.exposedJoins[i];
               newSeenJoins[join.joinTable.name] = true;
            }
            localStorage.setItem(seenJoinTablesLocalStorageKey, JSON.stringify(newSeenJoins));
         }

         ////////////////////////////////////////////////////////////////////////////////////////////////
         // we need the table meta data to look up the default filter (if it comes from query string), //
         // because we need to know field types to translate qqq filter to material filter             //
         // return here ane wait for the next 'turn' to allow doing the actual query                   //
         ////////////////////////////////////////////////////////////////////////////////////////////////
         let localFilterModel = filterModel;
         if (!defaultFilterLoaded)
         {
            setDefaultFilterLoaded(true);

            let models = await FilterUtils.determineFilterAndSortModels(qController, tableMetaData, null, searchParams, filterLocalStorageKey, sortLocalStorageKey);
            setFilterModel(models.filter);
            setColumnSortModel(models.sort);
            setQueryFilter(FilterUtils.buildQFilterFromGridFilter(tableMetaData, models.filter, models.sort, rowsPerPage));
            return;
         }

         setTableMetaData(tableMetaData);
         setTableLabel(tableMetaData.label);

         if (columnsModel.length == 0)
         {
            let linkBase = metaData.getTablePath(table);
            linkBase += linkBase.endsWith("/") ? "" : "/";
            const columns = DataGridUtils.setupGridColumns(tableMetaData, linkBase, metaData, "alphabetical");
            setColumnsModel(columns);

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // let the next render (since columnsModel is watched below) build the filter, using the new columnsModel (in case of joins) //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            return;
         }

         //////////////////////////////////////////////////////////////////////////////////////////////////
         // make sure that any if any sort columns are from a join table, that the join table is visible //
         //////////////////////////////////////////////////////////////////////////////////////////////////
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

         ///////////////////////////////////////////////////////////
         // if there's no column sort, make a default - pkey desc //
         ///////////////////////////////////////////////////////////
         if (columnSortModel.length === 0)
         {
            columnSortModel.push({
               field: tableMetaData.primaryKeyField,
               sort: "desc",
            });
            setColumnSortModel(columnSortModel);
            // todo - need to setQueryFilter?
            resetColumnSortModel = true;
         }

         if (resetColumnSortModel && latestQueryId > 0)
         {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // let the next render (since columnSortModel is watched below) build the filter, using the new columnSort //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            return;
         }

         const qFilter = buildQFilter(tableMetaData, localFilterModel);
         qFilter.skip = pageNumber * rowsPerPage;
         qFilter.limit = rowsPerPage;

         //////////////////////////////////////////
         // figure out joins to use in the query //
         //////////////////////////////////////////
         let queryJoins = null;
         if (tableMetaData?.exposedJoins)
         {
            const visibleJoinTables = getVisibleJoinTables();

            queryJoins = [];
            for (let i = 0; i < tableMetaData.exposedJoins.length; i++)
            {
               const join = tableMetaData.exposedJoins[i];
               if (visibleJoinTables.has(join.joinTable.name))
               {
                  queryJoins.push(new QueryJoin(join.joinTable.name, true, "LEFT"));
               }
            }
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
            qController.count(tableName, qFilter, queryJoins, includeDistinct).then(([count, distinctCount]) =>
            {
               console.log(`Received count results for query ${thisQueryId}: ${count} ${distinctCount}`);
               countResults[thisQueryId] = [];
               countResults[thisQueryId].push(count);
               countResults[thisQueryId].push(distinctCount);
               setCountResults(countResults);
               setReceivedCountTimestamp(new Date());
            });
         }

         setLastFetchedQFilterJSON(JSON.stringify(qFilter));
         qController.query(tableName, qFilter, queryJoins).then((results) =>
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


   const handlePageChange = (page: number) =>
   {
      setPageNumber(page);
   };

   const handleRowsPerPageChange = (size: number) =>
   {
      setRowsPerPage(size);
      localStorage.setItem(rowsPerPageLocalStorageKey, JSON.stringify(size));
   };

   const handlePinnedColumnsChange = (pinnedColumns: GridPinnedColumns) =>
   {
      setPinnedColumns(pinnedColumns);
      localStorage.setItem(pinnedColumnsLocalStorageKey, JSON.stringify(pinnedColumns));
   };

   const handleStateChange = (state: GridState, event: MuiEvent, details: GridCallbackDetails) =>
   {
      if (state && state.density && state.density.value !== density)
      {
         setDensity(state.density.value);
         localStorage.setItem(densityLocalStorageKey, JSON.stringify(state.density.value));

      }
   };

   const handleRowClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) =>
   {
      /////////////////////////////////////////////////////////////////
      // if a grid preference window is open, ignore and reset timer //
      /////////////////////////////////////////////////////////////////
      console.log(gridPreferencesWindow);
      if (gridPreferencesWindow !== undefined)
      {
         clearTimeout(instance.current.timer);
         return;
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // strategy for when to trigger or not trigger a row click:                                                      //
      // To avoid a drag-event that highlighted text in a cell:                                                        //
      // - we capture the x & y upon mouse-down - then compare them in this method (which fires when the mouse is up)  //
      //   if they are more than 5 pixels away from the mouse-down, then assume it's a drag, not a click.              //
      // - avoid clicking the row upon double-click, by setting a 500ms timer here - and in the onDoubleClick handler, //
      //   cancelling the timer.                                                                                       //
      // - also avoid a click, then click-again-and-start-dragging, by always cancelling the timer in mouse-down.      //
      // All in, these seem to have good results - the only downside being the half-second delay...                    //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const diff = Math.max(Math.abs(event.clientX - gridMouseDownX), Math.abs(event.clientY - gridMouseDownY));
      if (diff < 5)
      {
         console.log("clearing timeout");
         clearTimeout(instance.current.timer);
         instance.current.timer = setTimeout(() =>
         {
            if (table.primaryKeyField !== "id")
            {
               navigate(`${metaData.getTablePathByName(tableName)}/${params.row[tableMetaData.primaryKeyField]}`);
            }
            else
            {
               navigate(`${metaData.getTablePathByName(tableName)}/${params.id}`);
            }
         }, 100);
      }
      else
      {
         console.log(`row-click mouse-up happened ${diff} x or y pixels away from the mouse-down - so not considering it a click.`);
      }
   };


   const selectionChanged = (selectionModel: GridSelectionModel, details: GridCallbackDetails) =>
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

   const handleColumnVisibilityChange = (columnVisibilityModel: GridColumnVisibilityModel) =>
   {
      setColumnVisibilityModel(columnVisibilityModel);
      if (columnVisibilityLocalStorageKey)
      {
         localStorage.setItem(columnVisibilityLocalStorageKey, JSON.stringify(columnVisibilityModel));
      }
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
      console.log("calling update table for visible join table change");
      updateTable();
      setVisibleJoinTables(newVisibleJoinTables);
   }

   const handleColumnOrderChange = (columnOrderChangeParams: GridColumnOrderChangeParams) =>
   {
      // TODO: make local storaged
      console.log(JSON.stringify(columnsModel));
      console.log(columnOrderChangeParams);
   };

   const handleFilterChange = (filterModel: GridFilterModel, doSetQueryFilter = true, isChangeFromDataGrid = false) =>
   {
      setFilterModel(filterModel);

      if (doSetQueryFilter)
      {
         //////////////////////////////////////////////////////////////////////////////////
         // someone might have already set the query filter, so, only set it if asked to //
         //////////////////////////////////////////////////////////////////////////////////
         setQueryFilter(FilterUtils.buildQFilterFromGridFilter(tableMetaData, filterModel, columnSortModel, rowsPerPage));
      }

      if (isChangeFromDataGrid)
      {
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // this function is called by our code several times, but also from dataGridPro when its filter model changes.      //
         // in general, we don't want a "partial" criteria to be part of our query filter object (e.g., w/ no values)        //
         // BUT - for one use-case, when the user adds a "filter" (criteria) from column-header "..." menu, then dataGridPro //
         // puts a partial item in its filter - so - in that case, we do like to get this partial criteria in our QFilter.   //
         // so far, not seeing any negatives to this being here, and it fixes that user experience, so keep this.            //
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         setQueryFilter(FilterUtils.buildQFilterFromGridFilter(tableMetaData, filterModel, columnSortModel, rowsPerPage, true));
      }

      if (filterLocalStorageKey)
      {
         localStorage.setItem(filterLocalStorageKey, JSON.stringify(filterModel));
      }
   };

   const handleSortChangeForDataGrid = (gridSort: GridSortModel) =>
   {
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // this method just wraps handleSortChange, but w/o the optional 2nd param, so we can use it in data grid //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      handleSortChange(gridSort);
   }

   const handleSortChange = (gridSort: GridSortModel, overrideFilterModel?: GridFilterModel) =>
   {
      if (gridSort && gridSort.length > 0)
      {
         setColumnSortModel(gridSort);
         const gridFilterModelToUse = overrideFilterModel ?? filterModel;
         setQueryFilter(FilterUtils.buildQFilterFromGridFilter(tableMetaData, gridFilterModelToUse, gridSort, rowsPerPage));
         localStorage.setItem(sortLocalStorageKey, JSON.stringify(gridSort));
      }
   };

   if (tableName !== tableState)
   {
      (async () =>
      {
         setTableMetaData(null);
         setTableState(tableName);
         const metaData = await qController.loadMetaData();
         setMetaData(metaData);

         setTableProcesses(ProcessUtils.getProcessesForTable(metaData, tableName)); // these are the ones to show in the dropdown
         setAllTableProcesses(ProcessUtils.getProcessesForTable(metaData, tableName, true)); // these include hidden ones (e.g., to find the bulks)

         if (launchingProcess)
         {
            setLaunchingProcess(null);
            setActiveModalProcess(launchingProcess);
         }

         // reset rows to trigger rerender
         setRows([]);
      })();
   }

   interface QExportMenuItemProps extends GridExportMenuItemProps<{}>
   {
      format: string;
   }

   function ExportMenuItem(props: QExportMenuItemProps)
   {
      const {format, hideMenu} = props;

      return (
         <MenuItem
            disabled={totalRecords === 0}
            onClick={() =>
            {
               ///////////////////////////////////////////////////////////////////////////////
               // build the list of visible fields.  note, not doing them in-order (in case //
               // the user did drag & drop), because column order model isn't right yet     //
               // so just doing them to match columns (which were pKey, then sorted)        //
               ///////////////////////////////////////////////////////////////////////////////
               const visibleFields: string[] = [];
               columnsModel.forEach((gridColumn) =>
               {
                  const fieldName = gridColumn.field;
                  if (columnVisibilityModel[fieldName] !== false)
                  {
                     visibleFields.push(fieldName);
                  }
               });

               ///////////////////////
               // zero-pad function //
               ///////////////////////
               const zp = (value: number): string => (value < 10 ? `0${value}` : `${value}`);

               //////////////////////////////////////
               // construct the url for the export //
               //////////////////////////////////////
               const dateString = ValueUtils.formatDateTimeForFileName(new Date());
               const filename = `${tableMetaData.label} Export ${dateString}.${format}`;
               const url = `/data/${tableMetaData.name}/export/${filename}`;

               const encodedFilterJSON = encodeURIComponent(JSON.stringify(buildQFilter(tableMetaData, filterModel)));

               //////////////////////////////////////////////////////////////////////////////////////
               // open a window (tab) with a little page that says the file is being generated.    //
               // then have that page load the url for the export.                                 //
               // If there's an error, it'll appear in that window.  else, the file will download. //
               //////////////////////////////////////////////////////////////////////////////////////
               const exportWindow = window.open("", "_blank");
               exportWindow.document.write(`<html lang="en">
                  <head>
                     <style>
                        * { font-family: "Roboto","Helvetica","Arial",sans-serif; }
                     </style>
                     <title>${filename}</title>
                     <script>
                        setTimeout(() =>
                        {
                           //////////////////////////////////////////////////////////////////////////////////////////////////
                           // need to encode and decode this value, so set it in the form here, instead of literally below //
                           //////////////////////////////////////////////////////////////////////////////////////////////////
                           document.getElementById("filter").value = decodeURIComponent("${encodedFilterJSON}");
                           
                           document.getElementById("exportForm").submit();
                        }, 1);
                     </script>
                  </head>
                  <body>
                     Generating file <u>${filename}</u>${totalRecords ? " with " + totalRecords.toLocaleString() + " record" + (totalRecords == 1 ? "" : "s") : ""}...
                     <form id="exportForm" method="post" action="${url}" >
                        <input type="hidden" name="Authorization" value="${qController.getAuthorizationHeaderValue()}">
                        <input type="hidden" name="fields" value="${visibleFields.join(",")}">
                        <input type="hidden" name="filter" id="filter">
                     </form>
                  </body>
               </html>`);

               /*
               // todo - probably better - generate the report in an iframe...
               // only open question is, giving user immediate feedback, and knowing when the stream has started and/or stopped
               // maybe a busy-loop that would check iframe's url (e.g., after posting should change, maybe?)
               const iframe = document.getElementById("exportIFrame");
               const form = iframe.querySelector("form");
               form.action = url;
               form.target = "exportIFrame";
               (iframe.querySelector("#authorizationInput") as HTMLInputElement).value = qController.getAuthorizationHeaderValue();
               form.submit();
               */

               ///////////////////////////////////////////
               // Hide the export menu after the export //
               ///////////////////////////////////////////
               hideMenu?.();
            }}
         >
            Export
            {` ${format.toUpperCase()}`}
         </MenuItem>
      );
   }

   function getNoOfSelectedRecords()
   {
      if (selectFullFilterState === "filter")
      {
         if(isJoinMany(tableMetaData, getVisibleJoinTables()))
         {
            return (distinctRecords);
         }
         return (totalRecords);
      }

      return (selectedIds.length);
   }

   function getRecordsQueryString()
   {
      if (selectFullFilterState === "filter")
      {
         return `?recordsParam=filterJSON&filterJSON=${JSON.stringify(buildQFilter(tableMetaData, filterModel))}`;
      }

      if (selectFullFilterState === "filterSubset")
      {
         return `?recordsParam=filterJSON&filterJSON=${JSON.stringify(buildQFilter(tableMetaData, filterModel, selectionSubsetSize))}`;
      }

      if (selectedIds.length > 0)
      {
         return `?recordsParam=recordIds&recordIds=${selectedIds.join(",")}`;
      }

      return "";
   }

   const openModalProcess = (process: QProcessMetaData = null) =>
   {
      if (selectFullFilterState === "filter")
      {
         setRecordIdsForProcess(buildQFilter(tableMetaData, filterModel));
      }
      else if (selectFullFilterState === "filterSubset")
      {
         setRecordIdsForProcess(buildQFilter(tableMetaData, filterModel, selectionSubsetSize));
      }
      else if (selectedIds.length > 0)
      {
         setRecordIdsForProcess(selectedIds.join(","));
      }
      else
      {
         setRecordIdsForProcess("");
      }

      navigate(`${metaData?.getTablePathByName(tableName)}/${process.name}${getRecordsQueryString()}`);
      closeActionsMenu();
   };

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

      console.log("calling update table for close modal");
      updateTable();
   };

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

   const bulkLoadClicked = () =>
   {
      closeActionsMenu();
      openBulkProcess("Insert", "Load");
   };

   const bulkEditClicked = () =>
   {
      closeActionsMenu();
      if (getNoOfSelectedRecords() === 0)
      {
         setAlertContent("No records were selected to Bulk Edit.");
         return;
      }
      openBulkProcess("Edit", "Edit");
   };

   const bulkDeleteClicked = () =>
   {
      closeActionsMenu();
      if (getNoOfSelectedRecords() === 0)
      {
         setAlertContent("No records were selected to Bulk Delete.");
         return;
      }
      openBulkProcess("Delete", "Delete");
   };

   const processClicked = (process: QProcessMetaData) =>
   {
      // todo - let the process specify that it needs initial rows - err if none selected.
      //  alternatively, let a process itself have an initial screen to select rows...
      openModalProcess(process);
   };

   // @ts-ignore
   const defaultLabelDisplayedRows = ({from, to, count}) =>
   {
      const tooltipHTML = <>
         The number of rows shown on this screen may be greater than the number of {tableMetaData?.label} records
         that match your query, because you have included fields from other tables which may have
         more than one record associated with each {tableMetaData?.label}.
      </>
      let distinctPart = isJoinMany(tableMetaData, getVisibleJoinTables()) ? (<Box display="inline" component="span" textAlign="right">
         &nbsp;({safeToLocaleString(distinctRecords)} distinct<CustomWidthTooltip title={tooltipHTML}>
            <IconButton sx={{p: 0, pl: 0.25, mb: 0.25}}><Icon fontSize="small" sx={{fontSize: "1.125rem !important", color: "#9f9f9f"}}>info_outlined</Icon></IconButton>
         </CustomWidthTooltip>
         )
      </Box>) : <></>;

      if (tableMetaData && !tableMetaData.capabilities.has(Capability.TABLE_COUNT))
      {
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // to avoid a non-countable table showing (this is what data-grid did) 91-100 even if there were only 95 records, //
         // we'll do this... not quite good enough, but better than the original                                           //
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if (rows.length > 0 && rows.length < to - from)
         {
            to = from + rows.length;
         }
         return (`Showing ${from.toLocaleString()} to ${to.toLocaleString()}`);
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // treat -1 as the sentinel that it's set as below -- remember, we did that so that 'to' would have a value in here when there's no count. //
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (count !== null && count !== undefined && count !== -1)
      {
         if (count === 0)
         {
            return (loading ? "Counting..." : "No rows");
         }

         return <span>
            Showing {from.toLocaleString()} to {to.toLocaleString()} of
            {
               count == -1 ?
                  <>more than {to.toLocaleString()}</>
                  : <> {count.toLocaleString()}{distinctPart}</>
            }
         </span>;
      }
      else
      {
         return ("Counting...");
      }
   };

   function CustomPagination()
   {
      return (
         <TablePagination
            component="div"
            sx={{minWidth: "450px"}}
            // note - passing null here makes the 'to' param in the defaultLabelDisplayedRows also be null,
            // so pass a sentinel value of -1...
            count={totalRecords === null || totalRecords === undefined ? -1 : totalRecords}
            page={pageNumber}
            rowsPerPageOptions={[10, 25, 50, 100, 250]}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, value) => handlePageChange(value)}
            onRowsPerPageChange={(event) => handleRowsPerPageChange(Number(event.target.value))}
            labelDisplayedRows={defaultLabelDisplayedRows}
         />
      );
   }

   function Loading()
   {
      return (
         <LinearProgress color="info" />
      );
   }

   async function handleSavedFilterChange(selectedSavedFilterId: number)
   {
      if (selectedSavedFilterId != null)
      {
         const qRecord = await fetchSavedFilter(selectedSavedFilterId);
         setCurrentSavedFilter(qRecord); // this fixed initial load not showing filter name

         const models = await FilterUtils.determineFilterAndSortModels(qController, tableMetaData, qRecord.values.get("filterJson"), null, null, null);
         handleFilterChange(models.filter);
         handleSortChange(models.sort, models.filter);
         localStorage.setItem(currentSavedFilterLocalStorageKey, selectedSavedFilterId.toString());
      }
      else
      {
         handleFilterChange({items: []} as GridFilterModel);
         handleSortChange([{field: tableMetaData.primaryKeyField, sort: "desc"}]);
         localStorage.removeItem(currentSavedFilterLocalStorageKey);
      }
   }

   async function fetchSavedFilter(filterId: number): Promise<QRecord>
   {
      let qRecord = null;
      const formData = new FormData();
      formData.append("id", filterId);
      formData.append(QController.STEP_TIMEOUT_MILLIS_PARAM_NAME, 60 * 1000);
      const processResult = await qController.processInit("querySavedFilter", formData, qController.defaultMultipartFormDataHeaders());
      if (processResult instanceof QJobError)
      {
         const jobError = processResult as QJobError;
         console.error("Could not retrieve saved filter: " + jobError.userFacingError);
      }
      else
      {
         const result = processResult as QJobComplete;
         qRecord = new QRecord(result.values.savedFilterList[0]);
      }

      return (qRecord);
   }

   const getFieldAndTable = (fieldName: string): [QFieldMetaData, QTableMetaData] =>
   {
      if(fieldName.indexOf(".") > -1)
      {
         const nameParts = fieldName.split(".", 2);
         for (let i = 0; i < tableMetaData?.exposedJoins?.length; i++)
         {
            const join = tableMetaData?.exposedJoins[i];
            if(join?.joinTable.name == nameParts[0])
            {
               return ([join.joinTable.fields.get(nameParts[1]), join.joinTable]);
            }
         }
      }
      else
      {
         return ([tableMetaData.fields.get(fieldName), tableMetaData]);
      }

      return (null);
   }

   const copyColumnValues = async (column: GridColDef) =>
   {
      let data = "";
      let counter = 0;
      if (latestQueryResults && latestQueryResults.length)
      {
         let [qFieldMetaData, fieldTable] = getFieldAndTable(column.field);
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

   const openColumnStatistics = async (column: GridColDef) =>
   {
      setFilterForColumnStats(buildQFilter(tableMetaData, filterModel));
      setColumnStatsFieldName(column.field);

      const [field, fieldTable] = getFieldAndTable(column.field);
      setColumnStatsField(field);
      setColumnStatsFieldTableName(fieldTable.name);
   };

   const CustomColumnMenu = forwardRef<HTMLUListElement, GridColumnMenuProps>(
      function GridColumnMenu(props: GridColumnMenuProps, ref)
      {
         const {hideMenu, currentColumn} = props;

         /*
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
               <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
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

                  {/*
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


   const safeToLocaleString = (n: Number): string =>
   {
      if(n != null && n != undefined)
      {
         return (n.toLocaleString());
      }
      return ("");
   }

   function CustomToolbar()
   {
      const handleMouseDown: GridEventListener<"cellMouseDown"> = (
         params, // GridRowParams
         event, // MuiEvent<React.MouseEvent<HTMLElement>>
         details, // GridCallbackDetails
      ) =>
      {
         setGridMouseDownX(event.clientX);
         setGridMouseDownY(event.clientY);
         clearTimeout(instance.current.timer);
      };

      const handleDoubleClick: GridEventListener<"rowDoubleClick"> = (event: any) =>
      {
         clearTimeout(instance.current.timer);
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
      selectionMenuOptions.push(`This page (${safeToLocaleString(distinctRecordsOnPageCount)} ${joinIsMany ? "distinct " : ""}record${distinctRecordsOnPageCount == 1 ? "" : "s"})`);
      selectionMenuOptions.push(`Full query result (${joinIsMany ? safeToLocaleString(distinctRecords) + ` distinct record${distinctRecords == 1 ? "" : "s"}` : safeToLocaleString(totalRecords) + ` record${totalRecords == 1 ? "" : "s"}`})`);
      selectionMenuOptions.push(`Subset of the query result ${selectionSubsetSize ? `(${safeToLocaleString(selectionSubsetSize)} ${joinIsMany ? "distinct " : ""}record${selectionSubsetSize == 1 ? "" : "s"})` : "..."}`);
      selectionMenuOptions.push("Clear selection");

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
            if(max)
            {
               if(selectedPrimaryKeys.size < max)
               {
                  if(!selectedPrimaryKeys.has(primaryKeyValue))
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

      const doClearFilter = (event: React.KeyboardEvent<HTMLDivElement>, isYesButton: boolean = false) =>
      {
         if (isYesButton|| event.key == "Enter")
         {
            setShowClearFiltersWarning(false);
            handleFilterChange({items: []} as GridFilterModel);
         }
      }

      return (
         <GridToolbarContainer>
            <div>
               <Button id="refresh-button" onClick={updateTable} startIcon={<Icon>refresh</Icon>} sx={{pr: "1.25rem"}}>
                  Refresh
               </Button>
            </div>
            {/* @ts-ignore */}
            <GridToolbarColumnsButton nonce={undefined} />
            <div style={{position: "relative"}}>
               {/* @ts-ignore */}
               <GridToolbarFilterButton nonce={undefined} />
               {
                  hasValidFilters && (
                     <div id="clearFiltersButton" style={{display: "inline-block", position: "relative", top: "2px", left: "-0.75rem", width: "1rem"}}>
                        <Tooltip title="Clear Filter">
                           <Icon sx={{cursor: "pointer"}} onClick={() => setShowClearFiltersWarning(true)}>clear</Icon>
                        </Tooltip>
                        <Dialog open={showClearFiltersWarning} onClose={() => setShowClearFiltersWarning(false)} onKeyPress={(e) => doClearFilter(e)}>
                           <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                           <DialogContent>
                              <DialogContentText>Are you sure you want to remove all conditions from the current filter?</DialogContentText>
                           </DialogContent>
                           <DialogActions>
                              <QCancelButton label="No" disabled={false} onClickHandler={() => setShowClearFiltersWarning(false)} />
                              <QSaveButton label="Yes" iconName="check" disabled={false} onClickHandler={() => doClearFilter(null, true)}/>
                           </DialogActions>
                        </Dialog>
                     </div>
                  )
               }
               {/* @ts-ignore */}
               <GridToolbarDensitySelector nonce={undefined} />
               {/* @ts-ignore */}
               <GridToolbarExportContainer nonce={undefined}>
                  <ExportMenuItem format="csv" />
                  <ExportMenuItem format="xlsx" />
                  <ExportMenuItem format="json" />
               </GridToolbarExportContainer>
            </div>

            <div style={{zIndex: 10}}>
               <MenuButton label="Selection" iconName={selectedIds.length == 0 ? "check_box_outline_blank" : "check_box"} disabled={totalRecords == 0} options={selectionMenuOptions} callback={selectionMenuCallback}/>
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
                        The <a onClick={() => setSelectionSubsetSizePromptOpen(true)} style={{cursor: "pointer"}}><strong>first {safeToLocaleString(selectionSubsetSize)}</strong></a> {joinIsMany ? "distinct" : ""} record{selectionSubsetSize == 1 ? "" : "s"} matching this query {selectionSubsetSize == 1 ? "is" : "are"} selected.
                     </div>
                  )
               }
               {
                  (selectFullFilterState === "n/a" && selectedIds.length > 0) && (
                     <div className="selectionTool">
                        <strong>{safeToLocaleString(selectedIds.length)}</strong> {joinIsMany ? "distinct" : ""} {selectedIds.length == 1 ? "record is" : "records are"} selected.
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

   const pushDividerIfNeeded = (menuItems: JSX.Element[]) =>
   {
      if (menuItems.length > 0)
      {
         menuItems.push(<Divider key="divider" />);
      }
   };

   const menuItems: JSX.Element[] = [];
   if (table.capabilities.has(Capability.TABLE_INSERT) && table.insertPermission)
   {
      menuItems.push(<MenuItem key="bulkLoad" onClick={bulkLoadClicked}><ListItemIcon><Icon>library_add</Icon></ListItemIcon>Bulk Load</MenuItem>);
   }
   if (table.capabilities.has(Capability.TABLE_UPDATE) && table.editPermission)
   {
      menuItems.push(<MenuItem key="bulkEdit" onClick={bulkEditClicked}><ListItemIcon><Icon>edit</Icon></ListItemIcon>Bulk Edit</MenuItem>);
   }
   if (table.capabilities.has(Capability.TABLE_DELETE) && table.deletePermission)
   {
      menuItems.push(<MenuItem key="bulkDelete" onClick={bulkDeleteClicked}><ListItemIcon><Icon>delete</Icon></ListItemIcon>Bulk Delete</MenuItem>);
   }

   const runRecordScriptProcess = metaData?.processes.get("runRecordScript");
   if (runRecordScriptProcess)
   {
      const process = runRecordScriptProcess;
      menuItems.push(<MenuItem key={process.name} onClick={() => processClicked(process)}><ListItemIcon><Icon>{process.iconName ?? "arrow_forward"}</Icon></ListItemIcon>{process.label}</MenuItem>);
   }

   menuItems.push(<MenuItem key="developerMode" onClick={() => navigate("dev")}><ListItemIcon><Icon>code</Icon></ListItemIcon>Developer Mode</MenuItem>);

   if (tableProcesses && tableProcesses.length)
   {
      pushDividerIfNeeded(menuItems);
   }

   tableProcesses.sort((a, b) => a.label.localeCompare(b.label));
   tableProcesses.map((process) =>
   {
      menuItems.push(<MenuItem key={process.name} onClick={() => processClicked(process)}><ListItemIcon><Icon>{process.iconName ?? "arrow_forward"}</Icon></ListItemIcon>{process.label}</MenuItem>);
   });

   if (menuItems.length === 0)
   {
      menuItems.push(<MenuItem key="notAvaialableNow" disabled><ListItemIcon><Icon>block</Icon></ListItemIcon><i>No actions available</i></MenuItem>);
   }

   const renderActionsMenu = (
      <Menu
         anchorEl={actionsMenu}
         anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
         }}
         transformOrigin={{
            vertical: "top",
            horizontal: "right",
         }}
         open={Boolean(actionsMenu)}
         onClose={closeActionsMenu}
         keepMounted
      >
         {menuItems}
      </Menu>
   );

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
         updateTable();
      }
   }, [pageNumber, rowsPerPage, columnSortModel, currentSavedFilter]);

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // for state changes that DO change the filter, call to update the table - and DO clear out the totalRecords //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      setTotalRecords(null);
      setDistinctRecords(null);
      updateTable();
   }, [columnsModel, tableState]);

   useEffect(() =>
   {
      const currentQFilter = FilterUtils.buildQFilterFromGridFilter(tableMetaData, filterModel, columnSortModel, rowsPerPage);
      currentQFilter.skip = pageNumber * rowsPerPage;
      const currentQFilterJSON = JSON.stringify(currentQFilter);

      if(currentQFilterJSON !== lastFetchedQFilterJSON)
      {
         setTotalRecords(null);
         setDistinctRecords(null);
         updateTable();
      }

   }, [filterModel]);

   useEffect(() =>
   {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
   }, [pageNumber, rowsPerPage]);

   const updateFilterFromFilterPanel = (newFilter: QQueryFilter): void =>
   {
      setQueryFilter(newFilter);
      const gridFilterModel = FilterUtils.buildGridFilterFromQFilter(tableMetaData, queryFilter);
      handleFilterChange(gridFilterModel, false);
   };

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

   return (
      <BaseLayout>
         <div className="recordQuery">
            {/*
            // see above code that would use this
            <iframe id="exportIFrame" name="exportIFrame">
               <form method="post" target="_self">
                  <input type="hidden" id="authorizationInput" name="Authorization" />
               </form>
            </iframe>
            */}
            <Box my={3}>
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
                        <Alert color="warning" sx={{mb: 3}} onClose={() => setWarningAlert(null)}>{warningAlert}</Alert>
                     </Collapse>
                  ) : null
               }
               <Box display="flex" justifyContent="flex-end" alignItems="flex-start" mb={2}>
                  <Box display="flex" marginRight="auto">
                     {
                        metaData && metaData.processes.has("querySavedFilter") &&
                        <SavedFilters qController={qController} metaData={metaData} tableMetaData={tableMetaData} currentSavedFilter={currentSavedFilter} filterModel={filterModel} columnSortModel={columnSortModel} filterOnChangeCallback={handleSavedFilterChange} />
                     }
                  </Box>

                  <Box display="flex" width="150px">
                     <QActionsMenuButton isOpen={actionsMenu} onClickHandler={openActionsMenu} />
                     {renderActionsMenu}
                  </Box>
                  {
                     table.capabilities.has(Capability.TABLE_INSERT) && table.insertPermission &&
                     <QCreateNewButton tablePath={metaData?.getTablePathByName(tableName)} />
                  }
               </Box>
               <Card>
                  <Box height="100%">
                     <DataGridPro
                        components={{
                           Toolbar: CustomToolbar,
                           Pagination: CustomPagination,
                           LoadingOverlay: Loading,
                           ColumnMenu: CustomColumnMenu,
                           ColumnsPanel: CustomColumnsPanel,
                           FilterPanel: CustomFilterPanel
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
                                 updateFilter: updateFilterFromFilterPanel
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
                        autoHeight
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
                        filterModel={filterModel}
                        onFilterModelChange={(model) => handleFilterChange(model, true, true)}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={handleColumnVisibilityChange}
                        onColumnOrderChange={handleColumnOrderChange}
                        onSelectionModelChange={selectionChanged}
                        onSortModelChange={handleSortChangeForDataGrid}
                        sortingOrder={["asc", "desc"]}
                        sortModel={columnSortModel}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
                        getRowId={(row) => row.__rowIndex}
                        selectionModel={rowSelectionModel}
                        hideFooterSelectedRowCount={true}
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

//////////////////////////////////////////////////////////////////////////////////
// mini-component that is the dialog for the user to enter the selection-subset //
//////////////////////////////////////////////////////////////////////////////////
function SelectionSubsetDialog(props: {isOpen: boolean; initialValue: number; closeHandler: (value?: number) => void})
{
   const [value, setValue] = useState(props.initialValue)

   const handleChange = (newValue: string) =>
   {
      setValue(parseInt(newValue))
   }

   const keyPressed = (e: React.KeyboardEvent<HTMLDivElement>) =>
   {
      if(e.key == "Enter" && value)
      {
         props.closeHandler(value);
      }
   }

   return (
      <Dialog open={props.isOpen} onClose={() => props.closeHandler()} onKeyPress={(e) => keyPressed(e)}>
         <DialogTitle>Subset of the Query Result</DialogTitle>
         <DialogContent>
            <DialogContentText>How many records do you want to select?</DialogContentText>
            <TextField
               autoFocus
               name="selection-subset-size"
               inputProps={{width: "100%", type: "number", min: 1}}
               onChange={(e) => handleChange(e.target.value)}
               value={value}
               sx={{width: "100%"}}
               onFocus={event => event.target.select()}
            />
         </DialogContent>
         <DialogActions>
            <QCancelButton disabled={false} onClickHandler={() => props.closeHandler()} />
            <QSaveButton label="OK" iconName="check" disabled={value == undefined || isNaN(value)} onClickHandler={() => props.closeHandler(value)} />
         </DialogActions>
      </Dialog>
   )
}



export default RecordQuery;
