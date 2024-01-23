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
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {Alert, Collapse, TablePagination, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import {DataGridPro, GridCallbackDetails, GridColDef, GridColumnMenuContainer, GridColumnMenuProps, GridColumnOrderChangeParams, GridColumnPinningMenuItems, GridColumnsMenuItem, GridColumnVisibilityModel, GridDensity, GridEventListener, GridFilterMenuItem, GridFilterModel, GridPinnedColumns, gridPreferencePanelStateSelector, GridRowId, GridRowParams, GridRowsProp, GridSelectionModel, GridSortItem, GridSortModel, GridState, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExportContainer, HideGridColMenuItem, MuiEvent, SortGridMenuItems, useGridApiContext, useGridApiEventHandler, useGridSelector, useGridApiRef, GridPreferencePanelsValue, GridColumnResizeParams, ColumnHeaderFilterIconButtonProps} from "@mui/x-data-grid-pro";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import FormData from "form-data";
import React, {forwardRef, useContext, useEffect, useReducer, useRef, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import QContext from "QContext";
import {QActionsMenuButton, QCancelButton, QCreateNewButton} from "qqq/components/buttons/DefaultButtons";
import MenuButton from "qqq/components/buttons/MenuButton";
import {GotoRecordButton} from "qqq/components/misc/GotoRecordDialog";
import SavedFilters from "qqq/components/misc/SavedFilters";
import BasicAndAdvancedQueryControls from "qqq/components/query/BasicAndAdvancedQueryControls";
import {CustomColumnsPanel} from "qqq/components/query/CustomColumnsPanel";
import {CustomFilterPanel} from "qqq/components/query/CustomFilterPanel";
import ExportMenuItem from "qqq/components/query/ExportMenuItem";
import SelectionSubsetDialog from "qqq/components/query/SelectionSubsetDialog";
import TableVariantDialog from "qqq/components/query/TableVariantDialog";
import CustomWidthTooltip from "qqq/components/tooltips/CustomWidthTooltip";
import BaseLayout from "qqq/layouts/BaseLayout";
import ProcessRun from "qqq/pages/processes/ProcessRun";
import ColumnStats from "qqq/pages/records/query/ColumnStats";
import DataGridUtils from "qqq/utils/DataGridUtils";
import Client from "qqq/utils/qqq/Client";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import ProcessUtils from "qqq/utils/qqq/ProcessUtils";
import TableUtils from "qqq/utils/qqq/TableUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

const CURRENT_SAVED_FILTER_ID_LOCAL_STORAGE_KEY_ROOT = "qqq.currentSavedFilterId";
const COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT = "qqq.columnVisibility";
const COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT = "qqq.columnSort";
const FILTER_LOCAL_STORAGE_KEY_ROOT = "qqq.filter";
const ROWS_PER_PAGE_LOCAL_STORAGE_KEY_ROOT = "qqq.rowsPerPage";
const PINNED_COLUMNS_LOCAL_STORAGE_KEY_ROOT = "qqq.pinnedColumns";
const COLUMN_ORDERING_LOCAL_STORAGE_KEY_ROOT = "qqq.columnOrdering";
const COLUMN_WIDTHS_LOCAL_STORAGE_KEY_ROOT = "qqq.columnWidths";
const SEEN_JOIN_TABLES_LOCAL_STORAGE_KEY_ROOT = "qqq.seenJoinTables";
const DENSITY_LOCAL_STORAGE_KEY_ROOT = "qqq.density";
const QUICK_FILTER_FIELD_NAMES_LOCAL_STORAGE_KEY_ROOT = "qqq.quickFilterFieldNames";
const MODE_LOCAL_STORAGE_KEY_ROOT = "qqq.queryScreenMode";

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
   const columnOrderingLocalStorageKey = `${COLUMN_ORDERING_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const columnWidthsLocalStorageKey = `${COLUMN_WIDTHS_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const seenJoinTablesLocalStorageKey = `${SEEN_JOIN_TABLES_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const columnVisibilityLocalStorageKey = `${COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const filterLocalStorageKey = `${FILTER_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const tableVariantLocalStorageKey = `${TABLE_VARIANT_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const modeLocalStorageKey = `${MODE_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   let defaultSort = [] as GridSortItem[];
   let defaultVisibility = {} as { [index: string]: boolean };
   let didDefaultVisibilityComeFromLocalStorage = false;
   let defaultRowsPerPage = 10;
   let defaultDensity = "standard" as GridDensity;
   let defaultPinnedColumns = {left: ["__check__", "id"]} as GridPinnedColumns;
   let defaultColumnOrdering = null as string[];
   let defaultColumnWidths = {} as {[fieldName: string]: number};
   let seenJoinTables: {[tableName: string]: boolean} = {};
   let defaultTableVariant: QTableVariant = null;
   let defaultMode = "basic";

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
   if (localStorage.getItem(columnOrderingLocalStorageKey))
   {
      defaultColumnOrdering = JSON.parse(localStorage.getItem(columnOrderingLocalStorageKey));
   }
   if (localStorage.getItem(columnWidthsLocalStorageKey))
   {
      defaultColumnWidths = JSON.parse(localStorage.getItem(columnWidthsLocalStorageKey));
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
   if (localStorage.getItem(tableVariantLocalStorageKey))
   {
      defaultTableVariant = JSON.parse(localStorage.getItem(tableVariantLocalStorageKey));
   }
   if (localStorage.getItem(modeLocalStorageKey))
   {
      defaultMode = localStorage.getItem(modeLocalStorageKey);
   }

   const [filterModel, setFilterModel] = useState({items: []} as GridFilterModel);
   const [lastFetchedQFilterJSON, setLastFetchedQFilterJSON] = useState("");
   const [lastFetchedVariant, setLastFetchedVariant] = useState(null);
   const [columnSortModel, setColumnSortModel] = useState(defaultSort);
   const [queryFilter, setQueryFilter] = useState(new QQueryFilter());
   const [tableVariant, setTableVariant] = useState(defaultTableVariant);

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
   const [tableVariantPromptOpen, setTableVariantPromptOpen] = useState(false);
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
   const [currentSavedFilter, setCurrentSavedFilter] = useState(null as QRecord);

   const [activeModalProcess, setActiveModalProcess] = useState(null as QProcessMetaData);
   const [launchingProcess, setLaunchingProcess] = useState(launchProcess);
   const [recordIdsForProcess, setRecordIdsForProcess] = useState([] as string[] | QQueryFilter);
   const [columnStatsFieldName, setColumnStatsFieldName] = useState(null as string);
   const [columnStatsField, setColumnStatsField] = useState(null as QFieldMetaData);
   const [columnStatsFieldTableName, setColumnStatsFieldTableName] = useState(null as string)
   const [filterForColumnStats, setFilterForColumnStats] = useState(null as QQueryFilter);

   const [mode, setMode] = useState(defaultMode);
   const basicAndAdvancedQueryControlsRef = useRef();

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

   const {setPageHeader, dotMenuOpen, keyboardHelpOpen} = useContext(QContext);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
   const closeActionsMenu = () => setActionsMenu(null);

   const gridApiRef = useGridApiRef();

   ///////////////////////
   // Keyboard handling //
   ///////////////////////
   useEffect(() =>
   {
      if(tableMetaData == null)
      {
         (async() =>
         {
            const tableMetaData = await qController.loadTableMetaData(tableName);
            setTableMetaData(tableMetaData);
         })();
      }

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
               gridApiRef.current.showFilterPanel()
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
               doSetCurrentSavedFilter(null);
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
                  doSetCurrentSavedFilter(qRecord);
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

   function promptForTableVariantSelection()
   {
      setTableVariantPromptOpen(true);
   }

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
               {tableVariant && getTableVariantHeader()}
            </div>);
      }
      else
      {
         return (
            <div>
               {label}
               {tableVariant && getTableVariantHeader()}
            </div>);
      }
   };

   const getTableVariantHeader = () =>
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

   const updateTable = (reason?: string) =>
   {
      console.log(`In updateTable for ${reason}`);
      setLoading(true);
      setRows([]);
      (async () =>
      {
         const tableMetaData = await qController.loadTableMetaData(tableName);
         const visibleJoinTables = getVisibleJoinTables();
         setPageHeader(getPageHeader(tableMetaData, visibleJoinTables, tableVariant));

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
            setWarningAlert(models.warning);

            const newQueryFilter = FilterUtils.buildQFilterFromGridFilter(tableMetaData, models.filter, models.sort, rowsPerPage);
            setQueryFilter(newQueryFilter);

            ////////////////////////////////////////////////////////////////////////////////////////
            // this ref may not be defined on the initial render, so, make this call in a timeout //
            ////////////////////////////////////////////////////////////////////////////////////////
            setTimeout(() =>
            {
               // @ts-ignore
               basicAndAdvancedQueryControlsRef?.current?.ensureAllFilterCriteriaAreActiveQuickFilters(newQueryFilter, "defaultFilterLoaded")
            });

            return;
         }

         setTableMetaData(tableMetaData);
         setTableLabel(tableMetaData.label);

         if (tableMetaData?.usesVariants && !tableVariant)
         {
            promptForTableVariantSelection();
            return;
         }

         if (columnsModel.length == 0)
         {
            let linkBase = metaData.getTablePath(table);
            linkBase += linkBase.endsWith("/") ? "" : "/";
            const columns = DataGridUtils.setupGridColumns(tableMetaData, linkBase, metaData, "alphabetical");

            ///////////////////////////////////////////////////////////////////////
            // if there's a column-ordering (e.g., from local storage), apply it //
            ///////////////////////////////////////////////////////////////////////
            if(defaultColumnOrdering)
            {
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////
               // note - may need to put this in its own function, e.g., for restoring "Saved Columns" when we add that //
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////
               columns.sort((a: GridColDef, b: GridColDef) =>
               {
                  const aIndex = defaultColumnOrdering.indexOf(a.field);
                  const bIndex = defaultColumnOrdering.indexOf(b.field);
                  return aIndex - bIndex;
               });
            }

            ///////////////////////////////////////////////////////////////////////
            // if there are column widths (e.g., from local storage), apply them //
            ///////////////////////////////////////////////////////////////////////
            if(defaultColumnWidths)
            {
               for (let i = 0; i < columns.length; i++)
               {
                  const width = defaultColumnWidths[columns[i].field];
                  if(width)
                  {
                     columns[i].width = width;
                  }
               }
            }

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
            qController.count(tableName, qFilter, queryJoins, includeDistinct, tableVariant).then(([count, distinctCount]) =>
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

         setLastFetchedQFilterJSON(JSON.stringify(qFilter));
         setLastFetchedVariant(tableVariant);
         qController.query(tableName, qFilter, queryJoins, tableVariant).then((results) =>
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

      let id = encodeURIComponent(params.id);
      if (table.primaryKeyField !== "id")
      {
         id = encodeURIComponent(params.row[tableMetaData.primaryKeyField]);
      }
      const tablePath = `${metaData.getTablePathByName(table.name)}/${id}`;
      DataGridUtils.handleRowClick(tablePath, event, gridMouseDownX, gridMouseDownY, navigate, instance);
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
      updateTable("visible joins change");
      setVisibleJoinTables(newVisibleJoinTables);
   }


   /*******************************************************************************
    ** Event handler for column ordering change
    *******************************************************************************/
   const handleColumnOrderChange = (columnOrderChangeParams: GridColumnOrderChangeParams) =>
   {
      const columnOrdering = gridApiRef.current.state.columns.all;
      localStorage.setItem(columnOrderingLocalStorageKey, JSON.stringify(columnOrdering));
   };


   /*******************************************************************************
    ** Event handler for column resizing
    *******************************************************************************/
   const handleColumnResize = (params: GridColumnResizeParams, event: MuiEvent, details: GridCallbackDetails) =>
   {
      defaultColumnWidths[params.colDef.field] = params.width;
      localStorage.setItem(columnWidthsLocalStorageKey, JSON.stringify(defaultColumnWidths));
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

   function getNoOfSelectedRecords()
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

   function getRecordsQueryString()
   {
      if (selectFullFilterState === "filter")
      {
         return `?recordsParam=filterJSON&filterJSON=${encodeURIComponent(JSON.stringify(buildQFilter(tableMetaData, filterModel)))}`;
      }

      if (selectFullFilterState === "filterSubset")
      {
         return `?recordsParam=filterJSON&filterJSON=${encodeURIComponent(JSON.stringify(buildQFilter(tableMetaData, filterModel, selectionSubsetSize)))}`;
      }

      if (selectedIds.length > 0)
      {
         return `?recordsParam=recordIds&recordIds=${selectedIds.map(r => encodeURIComponent(r)).join(",")}`;
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
         setRecordIdsForProcess(selectedIds);
      }
      else
      {
         setRecordIdsForProcess([]);
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

      updateTable("close modal process");
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
         &nbsp;({ValueUtils.safeToLocaleString(distinctRecords)} distinct<CustomWidthTooltip title={tooltipHTML}>
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

   function doSetCurrentSavedFilter(savedFilter: QRecord)
   {
      setCurrentSavedFilter(savedFilter);

      if(savedFilter)
      {
         (async () =>
         {
            let localTableMetaData = tableMetaData;
            if(!localTableMetaData)
            {
               localTableMetaData = await qController.loadTableMetaData(tableName);
            }

            const models = await FilterUtils.determineFilterAndSortModels(qController, localTableMetaData, savedFilter.values.get("filterJson"), null, null, null);
            const newQueryFilter = FilterUtils.buildQFilterFromGridFilter(localTableMetaData, models.filter, models.sort, rowsPerPage);
            // todo?? ensureAllFilterCriteriaAreActiveQuickFilters(localTableMetaData, newQueryFilter, "savedFilterSelected")

            const gridFilterModel = FilterUtils.buildGridFilterFromQFilter(localTableMetaData, newQueryFilter);
            handleFilterChange(gridFilterModel, true);
         })()
      }
   }

   async function handleSavedFilterChange(selectedSavedFilterId: number)
   {
      if (selectedSavedFilterId != null)
      {
         const qRecord = await fetchSavedFilter(selectedSavedFilterId);
         doSetCurrentSavedFilter(qRecord); // this fixed initial load not showing filter name

         const models = await FilterUtils.determineFilterAndSortModels(qController, tableMetaData, qRecord.values.get("filterJson"), null, null, null);
         handleFilterChange(models.filter);
         handleSortChange(models.sort, models.filter);
         setWarningAlert(models.warning);

         localStorage.setItem(currentSavedFilterLocalStorageKey, selectedSavedFilterId.toString());
      }
      else
      {
         handleFilterChange({items: []} as GridFilterModel);
         handleSortChange([{field: tableMetaData.primaryKeyField, sort: "desc"}], {items: []} as GridFilterModel);
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

   const openColumnStatistics = async (column: GridColDef) =>
   {
      setFilterForColumnStats(buildQFilter(tableMetaData, filterModel));
      setColumnStatsFieldName(column.field);

      const [field, fieldTable] = TableUtils.getFieldAndTable(tableMetaData, column.field);
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
                     // @ts-ignore !?
                     basicAndAdvancedQueryControlsRef.current.addField(currentColumn.field);
                  }}>
                     Filter (BASIC) TODO edit text
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
      selectionMenuOptions.push(`This page (${ValueUtils.safeToLocaleString(distinctRecordsOnPageCount)} ${joinIsMany ? "distinct " : ""}record${distinctRecordsOnPageCount == 1 ? "" : "s"})`);
      selectionMenuOptions.push(`Full query result (${joinIsMany ? ValueUtils.safeToLocaleString(distinctRecords) + ` distinct record${distinctRecords == 1 ? "" : "s"}` : ValueUtils.safeToLocaleString(totalRecords) + ` record${totalRecords == 1 ? "" : "s"}`})`);
      selectionMenuOptions.push(`Subset of the query result ${selectionSubsetSize ? `(${ValueUtils.safeToLocaleString(selectionSubsetSize)} ${joinIsMany ? "distinct " : ""}record${selectionSubsetSize == 1 ? "" : "s"})` : "..."}`);
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

   menuItems.push(<MenuItem key="developerMode" onClick={() => navigate(`${metaData.getTablePathByName(tableName)}/dev`)}><ListItemIcon><Icon>code</Icon></ListItemIcon>Developer Mode</MenuItem>);

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
         updateTable("useEffect(pageNumber,rowsPerPage,columnSortModel,currentSavedFilter)");
      }
   }, [pageNumber, rowsPerPage, columnSortModel, currentSavedFilter]);

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // for state changes that DO change the filter, call to update the table - and DO clear out the totalRecords //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      const currentQFilter = FilterUtils.buildQFilterFromGridFilter(tableMetaData, filterModel, columnSortModel, rowsPerPage);
      currentQFilter.skip = pageNumber * rowsPerPage;
      const currentQFilterJSON = JSON.stringify(currentQFilter);
      const currentVariantJSON = JSON.stringify(tableVariant);

      if(currentQFilterJSON !== lastFetchedQFilterJSON || currentVariantJSON !== lastFetchedVariant)
      {
         setTotalRecords(null);
         setDistinctRecords(null);
         updateTable("useEffect(filterModel)");
      }
   }, [filterModel, columnsModel, tableState, tableVariant]);

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
         gotoVariantSubHeader = <Box mb={2}>{getTableVariantHeader()}</Box>
      }

      return (
         <BaseLayout>
            <GotoRecordButton metaData={metaData} tableMetaData={tableMetaData} tableVariant={tableVariant} autoOpen={true} buttonVisible={false} mayClose={false} subHeader={gotoVariantSubHeader} />
         </BaseLayout>
      );
   }

   const doSetMode = (newValue: string) =>
   {
      setMode(newValue);
      localStorage.setItem(modeLocalStorageKey, newValue);
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // for basic mode, set a custom ColumnHeaderFilterIconButton - w/ action to activate basic-mode quick-filter //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   let restOfDataGridProCustomComponents: any = {}
   if(mode == "basic")
   {
      restOfDataGridProCustomComponents.ColumnHeaderFilterIconButton = CustomColumnHeaderFilterIconButton;
   }

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
                        metaData && metaData.processes.has("querySavedFilter") &&
                        <SavedFilters qController={qController} metaData={metaData} tableMetaData={tableMetaData} currentSavedFilter={currentSavedFilter} filterModel={filterModel} columnSortModel={columnSortModel} filterOnChangeCallback={handleSavedFilterChange} />
                     }
                  </Box>

                  <GotoRecordButton metaData={metaData} tableMetaData={tableMetaData} />
                  <Box display="flex" width="150px">
                     <QActionsMenuButton isOpen={actionsMenu} onClickHandler={openActionsMenu} />
                     {renderActionsMenu}
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
                     gridApiRef={gridApiRef}
                     setQueryFilter={setQueryFilter}
                     handleFilterChange={handleFilterChange}
                     queryFilterJSON={JSON.stringify(queryFilter)}
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
                           LoadingOverlay: Loading,
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
                                 updateFilter: updateFilterFromFilterPanel,
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
                        filterModel={filterModel}
                        onFilterModelChange={(model) => handleFilterChange(model, true, true)}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={handleColumnVisibilityChange}
                        onColumnOrderChange={handleColumnOrderChange}
                        onColumnResize={handleColumnResize}
                        onSelectionModelChange={selectionChanged}
                        onSortModelChange={handleSortChangeForDataGrid}
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
