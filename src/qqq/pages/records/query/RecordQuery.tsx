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

import {Capability} from "@kingsrook/qqq-frontend-core/lib/model/metaData/Capability";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
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
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import {DataGridPro, GridCallbackDetails, GridColDef, GridColumnMenuContainer, GridColumnMenuProps, GridColumnOrderChangeParams, GridColumnPinningMenuItems, GridColumnsMenuItem, GridColumnVisibilityModel, GridDensity, GridEventListener, GridExportMenuItemProps, GridFilterMenuItem, GridFilterModel, GridPinnedColumns, gridPreferencePanelStateSelector, GridRowId, GridRowParams, GridRowsProp, GridSelectionModel, GridSortItem, GridSortModel, GridState, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExportContainer, GridToolbarFilterButton, HideGridColMenuItem, MuiEvent, SortGridMenuItems, useGridApiContext, useGridApiEventHandler, useGridSelector} from "@mui/x-data-grid-pro";
import FormData from "form-data";
import React, {forwardRef, useContext, useEffect, useReducer, useRef, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import QContext from "QContext";
import {QActionsMenuButton, QCreateNewButton} from "qqq/components/buttons/DefaultButtons";
import SavedFilters from "qqq/components/misc/SavedFilters";
import BaseLayout from "qqq/layouts/BaseLayout";
import ProcessRun from "qqq/pages/processes/ProcessRun";
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
   const [ searchParams ] = useSearchParams();

   const [showSuccessfullyDeletedAlert, setShowSuccessfullyDeletedAlert] = useState(searchParams.has("deleteSuccess"));
   const [successAlert, setSuccessAlert] = useState(null as string)

   const location = useLocation();
   const navigate = useNavigate();

   const pathParts = location.pathname.replace(/\/+$/, "").split("/");

   ////////////////////////////////////////////
   // look for defaults in the local storage //
   ////////////////////////////////////////////
   const currentSavedFilterLocalStorageKey = `${CURRENT_SAVED_FILTER_ID_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const sortLocalStorageKey = `${COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const rowsPerPageLocalStorageKey = `${ROWS_PER_PAGE_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const pinnedColumnsLocalStorageKey = `${PINNED_COLUMNS_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const columnVisibilityLocalStorageKey = `${COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const filterLocalStorageKey = `${FILTER_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   let defaultSort = [] as GridSortItem[];
   let defaultVisibility = {};
   let defaultRowsPerPage = 10;
   let defaultDensity = "standard" as GridDensity;
   let defaultPinnedColumns = {left: ["__check__", "id"]} as GridPinnedColumns;

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

   const [filterModel, setFilterModel] = useState({items: []} as GridFilterModel);
   const [columnSortModel, setColumnSortModel] = useState(defaultSort);
   const [columnVisibilityModel, setColumnVisibilityModel] = useState(defaultVisibility);
   const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
   const [density, setDensity] = useState(defaultDensity);
   const [pinnedColumns, setPinnedColumns] = useState(defaultPinnedColumns);

   const [tableState, setTableState] = useState("");
   const [metaData, setMetaData] = useState(null as QInstance);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [defaultFilterLoaded, setDefaultFilterLoaded] = useState(false);
   const [actionsMenu, setActionsMenu] = useState(null);
   const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
   const [allTableProcesses, setAllTableProcesses] = useState([] as QProcessMetaData[]);
   const [pageNumber, setPageNumber] = useState(0);
   const [totalRecords, setTotalRecords] = useState(null);
   const [selectedIds, setSelectedIds] = useState([] as string[]);
   const [selectFullFilterState, setSelectFullFilterState] = useState("n/a" as "n/a" | "checked" | "filter");
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

   const instance = useRef({timer: null});

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // use all these states to avoid showing results from an "old" query, that finishes loading after a newer one //
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   const [ latestQueryId, setLatestQueryId ] = useState(0);
   const [ countResults, setCountResults ] = useState({} as any);
   const [ receivedCountTimestamp, setReceivedCountTimestamp ] = useState(new Date());
   const [ queryResults, setQueryResults ] = useState({} as any);
   const [ latestQueryResults, setLatestQueryResults ] = useState(null as QRecord[]);
   const [ receivedQueryTimestamp, setReceivedQueryTimestamp ] = useState(new Date());
   const [ queryErrors, setQueryErrors ] = useState({} as any);
   const [ receivedQueryErrorTimestamp, setReceivedQueryErrorTimestamp ] = useState(new Date());

   const {setPageHeader} = useContext(QContext);
   const [ , forceUpdate ] = useReducer((x) => x + 1, 0);

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
            else if(metaData?.processes.has(processName))
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
         if(location.pathname.indexOf("/savedFilter/") != -1)
         {
            const parts = location.pathname.split("/");
            currentSavedFilterId = Number.parseInt(parts[parts.length - 1]);
         }
         else if(!searchParams.has("filter"))
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

         if(currentSavedFilterId != null)
         {
            (async () =>
            {
               const formData = new FormData();
               formData.append("id", currentSavedFilterId);

               //////////////////////////////////////////////////////////////////
               // we don't want this job to go async, so, pass a large timeout //
               //////////////////////////////////////////////////////////////////
               formData.append("_qStepTimeoutMillis", 60 * 1000);

               const formDataHeaders = {
                  "content-type": "multipart/form-data; boundary=--------------------------320289315924586491558366",
               };

               const processResult = await qController.processInit("querySavedFilter", formData, formDataHeaders);
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

   }, [location , tableMetaData]);

   ///////////////////////////////////////////////////////////////////////
   // any time these are out of sync, it means we need to reload things //
   ///////////////////////////////////////////////////////////////////////
   if(tableMetaData && tableMetaData.name !== tableName)
   {
      console.log("  it looks like we changed tables - try to reload the things");
      setTableMetaData(null)
      setColumnSortModel([]);
      setColumnVisibilityModel({});
      setColumnsModel([]);
      setFilterModel({items: []});
      setDefaultFilterLoaded(false);
      setRows([]);
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////
   // note - important to take tableMetaData as a param, even though it's a state var, as the          //
   // first time we call in here, we may not yet have set it in state (but will have fetched it async) //
   // so we'll pass in the local version of it!                                                        //
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   const buildQFilter = (tableMetaData: QTableMetaData, filterModel: GridFilterModel) =>
   {
      const filter = FilterUtils.buildQFilterFromGridFilter(tableMetaData, filterModel, columnSortModel);
      setHasValidFilters(filter.criteria && filter.criteria.length > 0);
      return(filter);
   };

   const updateTable = () =>
   {
      setLoading(true);
      setRows([]);
      (async () =>
      {
         const tableMetaData = await qController.loadTableMetaData(tableName);
         setPageHeader(tableMetaData.label);

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
            return;
         }

         setTableMetaData(tableMetaData);
         setTableLabel(tableMetaData.label);

         if(columnsModel.length == 0)
         {
            let linkBase = metaData.getTablePath(table)
            linkBase += linkBase.endsWith("/") ? "" : "/";
            const columns = DataGridUtils.setupGridColumns(tableMetaData, null, linkBase);
            setColumnsModel(columns);
         }

         if (columnSortModel.length === 0)
         {
            columnSortModel.push({
               field: tableMetaData.primaryKeyField,
               sort: "desc",
            });
            setColumnSortModel(columnSortModel);
         }

         const qFilter = buildQFilter(tableMetaData, localFilterModel);

         //////////////////////////////////////////////////////////////////////////////////////////////////
         // assign a new query id to the query being issued here.  then run both the count & query async //
         // and when they load, store their results associated with this id.                             //
         //////////////////////////////////////////////////////////////////////////////////////////////////
         const thisQueryId = latestQueryId + 1;
         setLatestQueryId(thisQueryId);

         console.log(`Issuing query: ${thisQueryId}`);
         if (tableMetaData.capabilities.has(Capability.TABLE_COUNT))
         {
            qController.count(tableName, qFilter).then((count) =>
            {
               countResults[thisQueryId] = count;
               setCountResults(countResults);
               setReceivedCountTimestamp(new Date());
            });
         }

         qController.query(tableName, qFilter, rowsPerPage, pageNumber * rowsPerPage).then((results) =>
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
      if (countResults[latestQueryId] === null)
      {
         ///////////////////////////////////////////////
         // see same idea in displaying query results //
         ///////////////////////////////////////////////
         console.log(`No count results for id ${latestQueryId}...`);
         return;
      }
      setTotalRecords(countResults[latestQueryId]);
      delete countResults[latestQueryId];
   }, [ receivedCountTimestamp ]);

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

      const {rows, columnsToRender} = DataGridUtils.makeRows(results, tableMetaData);

      setRows(rows);

      setLoading(false);
      setAlertContent(null);
      forceUpdate();
   }, [ receivedQueryTimestamp ]);

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

   }, [ receivedQueryErrorTimestamp ]);


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
            if(table.primaryKeyField !== "id")
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
      const newSelectedIds: string[] = [];
      selectionModel.forEach((value: GridRowId, index: number) =>
      {
         let valueToPush = value as string;
         if(tableMetaData.primaryKeyField !== "id")
         {
            valueToPush = latestQueryResults[index].values.get(tableMetaData.primaryKeyField);
         }
         newSelectedIds.push(valueToPush as string);
      });
      setSelectedIds(newSelectedIds);

      if (newSelectedIds.length === rowsPerPage)
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
         localStorage.setItem(
            columnVisibilityLocalStorageKey,
            JSON.stringify(columnVisibilityModel),
         );
      }
   };

   const handleColumnOrderChange = (columnOrderChangeParams: GridColumnOrderChangeParams) =>
   {
      // TODO: make local storaged
      console.log(JSON.stringify(columnsModel));
      console.log(columnOrderChangeParams);
   };

   const handleFilterChange = (filterModel: GridFilterModel) =>
   {
      setFilterModel(filterModel);
      if (filterLocalStorageKey)
      {
         localStorage.setItem(filterLocalStorageKey, JSON.stringify(filterModel));
      }
   };

   const handleSortChange = (gridSort: GridSortModel) =>
   {
      if (gridSort && gridSort.length > 0)
      {
         setColumnSortModel(gridSort);
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
                  // @ts-ignore
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
               const d = new Date();
               const dateString = `${d.getFullYear()}-${zp(d.getMonth()+1)}-${zp(d.getDate())} ${zp(d.getHours())}${zp(d.getMinutes())}`;
               const filename = `${tableMetaData.label} Export ${dateString}.${format}`;
               const url = `/data/${tableMetaData.name}/export/${filename}?filter=${encodeURIComponent(JSON.stringify(buildQFilter(tableMetaData, filterModel)))}&fields=${visibleFields.join(",")}`;

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
                           document.getElementById("exportForm").submit();
                        }, 1);
                     </script>
                  </head>
                  <body>
                     Generating file <u>${filename}</u>${totalRecords ? " with " + totalRecords.toLocaleString() + " record" + (totalRecords == 1 ? "" : "s") : ""}...
                     <form id="exportForm" method="post" action="${url}" >
                        <input type="hidden" name="Authorization" value="${qController.getAuthorizationHeaderValue()}">
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
      if(tableMetaData && !tableMetaData.capabilities.has(Capability.TABLE_COUNT))
      {
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // to avoid a non-countable table showing (this is what data-grid did) 91-100 even if there were only 95 records, //
         // we'll do this... not quite good enough, but better than the original                                           //
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if(rows.length > 0 && rows.length < to - from)
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
            return (loading ? "Counting records..." : "No rows");
         }
         return (`Showing ${from.toLocaleString()} to ${to.toLocaleString()} of ${count !== -1 ? `${count.toLocaleString()} records` : `more than ${to.toLocaleString()} records`}`);
      }
      else
      {
         return ("Counting records...");
      }
   };

   function CustomPagination()
   {
      return (
         <TablePagination
            component="div"
            // note - passing null here makes the 'to' param in the defaultLabelDisplayedRows also be null,
            // so pass some sentinel value...
            count={totalRecords === null || totalRecords === undefined ? -1 : totalRecords}
            page={pageNumber}
            rowsPerPageOptions={[ 10, 25, 50, 100, 250 ]}
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
      if(selectedSavedFilterId != null)
      {
         const qRecord = await fetchSavedFilter(selectedSavedFilterId);
         const models = await FilterUtils.determineFilterAndSortModels(qController, tableMetaData, qRecord.values.get("filterJson"), null, null, null);
         handleFilterChange(models.filter);
         handleSortChange(models.sort);
         localStorage.setItem(currentSavedFilterLocalStorageKey, selectedSavedFilterId.toString());
      }
      else
      {
         handleFilterChange({items: []} as GridFilterModel);
         handleSortChange([{field: tableMetaData.primaryKeyField, sort: "desc"}]);
         localStorage.removeItem(currentSavedFilterLocalStorageKey);
      }
   }

   async function fetchSavedFilter(filterId: number):Promise<QRecord>
   {
      let qRecord = null;
      const formData = new FormData();
      formData.append("id", filterId);

      //////////////////////////////////////////////////////////////////
      // we don't want this job to go async, so, pass a large timeout //
      //////////////////////////////////////////////////////////////////
      formData.append("_qStepTimeoutMillis", 60 * 1000);

      const formDataHeaders = {
         "content-type": "multipart/form-data; boundary=--------------------------320289315924586491558366",
      };

      const processResult = await qController.processInit("querySavedFilter", formData, formDataHeaders);
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

      return(qRecord);
   }

   const copyColumnValues = async (column: GridColDef) =>
   {
      let data = "";
      let counter = 0;
      if(latestQueryResults && latestQueryResults.length)
      {
         let qFieldMetaData = tableMetaData.fields.get(column.field);
         for(let i = 0; i < latestQueryResults.length; i++)
         {
            let record = latestQueryResults[i] as QRecord;
            const value = ValueUtils.getUnadornedValueForDisplay(qFieldMetaData, record.values.get(qFieldMetaData.name), record.displayValues.get(qFieldMetaData.name));
            if(value !== null && value !== undefined && String(value) !== "")
            {
               data += value + "\n";
               counter++;
            }
         }

         if(counter > 0)
         {
            await navigator.clipboard.writeText(data)
            setSuccessAlert(`Copied ${counter} ${qFieldMetaData.label} value${counter == 1 ? "" : "s"}.`);
         }
         else
         {
            setSuccessAlert(`There are no ${qFieldMetaData.label} values to copy.`);
         }
         setTimeout(() => setSuccessAlert(null), 3000);
      }
   }

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
               <GridColumnPinningMenuItems  onClick={hideMenu} column={currentColumn!} />
               <Divider />

               <MenuItem sx={{justifyContent: "space-between"}} onClick={(e) =>
               {
                  hideMenu(e);
                  copyColumnValues(currentColumn)
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

            </GridColumnMenuContainer>
         );
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

      return (
         <GridToolbarContainer>
            <div>
               <Button
                  id="refresh-button"
                  onClick={updateTable}
                  startIcon={<Icon>refresh</Icon>}
               >
                  Refresh
               </Button>
            </div>
            <GridToolbarColumnsButton nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
            <div style={{position: "relative"}}>
               <GridToolbarFilterButton nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
               {
                  hasValidFilters && (

                     <div id="clearFiltersButton" style={{position: "absolute", left: "84px", top: "6px"}}>
                        <Tooltip title="Clear All Filters">
                           <Icon sx={{cursor: "pointer"}} onClick={() => setShowClearFiltersWarning(true)}>clear</Icon>
                        </Tooltip>
                        <Dialog open={showClearFiltersWarning} onClose={() => setShowClearFiltersWarning(false)}>
                           <DialogTitle id="alert-dialog-title">Confirm </DialogTitle>
                           <DialogContent>
                              <DialogContentText>Are you sure you want to clear all filters?</DialogContentText>
                           </DialogContent>
                           <DialogActions>
                              <Button onClick={() => setShowClearFiltersWarning(false)}>No</Button>
                              <Button onClick={() =>
                              {
                                 setShowClearFiltersWarning(false);
                                 navigate(metaData.getTablePathByName(tableName));
                                 handleFilterChange({items: []} as GridFilterModel);
                              }}>Yes</Button>
                           </DialogActions>
                        </Dialog>
                     </div>
                  )
               }
               <GridToolbarDensitySelector nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
               <GridToolbarExportContainer nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                  <ExportMenuItem format="csv" />
                  <ExportMenuItem format="xlsx" />
                  <ExportMenuItem format="json" />
               </GridToolbarExportContainer>
            </div>
            <div>
               {
                  selectFullFilterState === "checked" && (
                     <div className="selectionTool">
                        The
                        <strong>{` ${selectedIds.length.toLocaleString()} `}</strong>
                        records on this page are selected.
                        <Button onClick={() => setSelectFullFilterState("filter")}>
                           Select all
                           {` ${totalRecords ? totalRecords.toLocaleString() : ""} `}
                           records matching this query
                        </Button>
                     </div>
                  )
               }
               {
                  selectFullFilterState === "filter" && (
                     <div className="selectionTool">
                        All
                        <strong>{` ${totalRecords ? totalRecords.toLocaleString() : ""} `}</strong>
                        records matching this query are selected.
                        <Button onClick={() => setSelectFullFilterState("checked")}>
                           Select the
                           {` ${selectedIds.length.toLocaleString()} `}
                           records on this page
                        </Button>
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
      if(menuItems.length > 0)
      {
         menuItems.push(<Divider />);
      }
   }

   const menuItems: JSX.Element[] = [];
   if(table.capabilities.has(Capability.TABLE_INSERT) && table.insertPermission)
   {
      menuItems.push(<MenuItem onClick={bulkLoadClicked}><ListItemIcon><Icon>library_add</Icon></ListItemIcon>Bulk Load</MenuItem>)
   }
   if(table.capabilities.has(Capability.TABLE_UPDATE) && table.editPermission)
   {
      menuItems.push(<MenuItem onClick={bulkEditClicked}><ListItemIcon><Icon>edit</Icon></ListItemIcon>Bulk Edit</MenuItem>)
   }
   if(table.capabilities.has(Capability.TABLE_DELETE) && table.deletePermission)
   {
      menuItems.push(<MenuItem onClick={bulkDeleteClicked}><ListItemIcon><Icon>delete</Icon></ListItemIcon>Bulk Delete</MenuItem>)
   }

   const runRecordScriptProcess = metaData?.processes.get("runRecordScript");
   if(runRecordScriptProcess)
   {
      const process = runRecordScriptProcess;
      menuItems.push(<MenuItem key={process.name} onClick={() => processClicked(process)}><ListItemIcon><Icon>{process.iconName ?? "arrow_forward"}</Icon></ListItemIcon>{process.label}</MenuItem>);
   }

   menuItems.push(<MenuItem onClick={() => navigate("dev")}><ListItemIcon><Icon>code</Icon></ListItemIcon>Developer Mode</MenuItem>);

   if(tableProcesses && tableProcesses.length)
   {
      pushDividerIfNeeded(menuItems);
   }

   tableProcesses.map((process) =>
   {
      menuItems.push(<MenuItem key={process.name} onClick={() => processClicked(process)}><ListItemIcon><Icon>{process.iconName ?? "arrow_forward"}</Icon></ListItemIcon>{process.label}</MenuItem>);
   });

   if(menuItems.length === 0)
   {
      menuItems.push(<MenuItem disabled><ListItemIcon><Icon>block</Icon></ListItemIcon><i>No actions available</i></MenuItem>)
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
      if(latestQueryId > 0)
      {
         ////////////////////////////////////////////////////////////////////////////////////////
         // to avoid both this useEffect and the one below from both doing an "initial query", //
         // only run this one if at least 1 query has already been ran                         //
         ////////////////////////////////////////////////////////////////////////////////////////
         updateTable();
      }
   }, [ pageNumber, rowsPerPage, columnSortModel, currentSavedFilter ]);

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // for state changes that DO change the filter, call to update the table - and DO clear out the totalRecords //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      setTotalRecords(null);
      updateTable();
   }, [ tableState, filterModel]);

   useEffect(() =>
   {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
   }, [ pageNumber, rowsPerPage ]);

   if(tableMetaData && !tableMetaData.readPermission)
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
                     <Alert color="success" sx={{mb: 3}} onClose={() =>
                     {
                        setShowSuccessfullyDeletedAlert(false);
                     }}>
                        {`${tableLabel} successfully deleted`}
                     </Alert>
                  ) : null
               }
               {
                  (successAlert) ? (
                     <Collapse in={Boolean(successAlert)}>
                        <Alert color="success" sx={{mb: 3}} onClose={() =>
                        {
                           setSuccessAlert(null);
                        }}>
                           {successAlert}
                        </Alert>
                     </Collapse>
                  ) : null
               }
               <Box display="flex" justifyContent="flex-end" alignItems="flex-start" mb={2}>
                  <Box display="flex" marginRight="auto">
                     <SavedFilters qController={qController} metaData={metaData} tableMetaData={tableMetaData} currentSavedFilter={currentSavedFilter} filterModel={filterModel} columnSortModel={columnSortModel} filterOnChangeCallback={handleSavedFilterChange}/>
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
                        components={{Toolbar: CustomToolbar, Pagination: CustomPagination, LoadingOverlay: Loading, ColumnMenu: CustomColumnMenu}}
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
                        onFilterModelChange={handleFilterChange}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={handleColumnVisibilityChange}
                        onColumnOrderChange={handleColumnOrderChange}
                        onSelectionModelChange={selectionChanged}
                        onSortModelChange={handleSortChange}
                        sortingOrder={[ "asc", "desc" ]}
                        sortModel={columnSortModel}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
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
         </div>
      </BaseLayout>
   );
}

export default RecordQuery;
