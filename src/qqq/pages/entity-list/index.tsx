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

import {AdornmentType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/AdornmentType";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QFilterOrderBy} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {Alert, TablePagination} from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
   DataGridPro, getGridDateOperators, getGridNumericOperators, getGridStringOperators,
   GridCallbackDetails,
   GridColDef,
   GridColumnOrderChangeParams,
   GridColumnVisibilityModel,
   GridExportMenuItemProps,
   GridFilterItem,
   GridFilterModel,
   GridRowId,
   GridRowParams,
   GridRowsProp,
   GridSelectionModel,
   GridSortItem,
   GridSortModel,
   GridToolbarColumnsButton,
   GridToolbarContainer,
   GridToolbarDensitySelector,
   GridToolbarExportContainer,
   GridToolbarFilterButton,
   MuiEvent
} from "@mui/x-data-grid-pro";
import {GridFilterOperator} from "@mui/x-data-grid/models/gridFilterOperator";
import React, {useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import QContext from "QContext";
import DashboardLayout from "qqq/components/DashboardLayout";
import Footer from "qqq/components/Footer";
import Navbar from "qqq/components/Navbar";
import {QActionsMenuButton, QCreateNewButton} from "qqq/components/QButtons";
import MDAlert from "qqq/components/Temporary/MDAlert";
import MDBox from "qqq/components/Temporary/MDBox";
import QClient from "qqq/utils/QClient";
import QFilterUtils from "qqq/utils/QFilterUtils";
import QProcessUtils from "qqq/utils/QProcessUtils";
import QValueUtils from "qqq/utils/QValueUtils";

const COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT = "qqq.columnVisibility";
const COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT = "qqq.columnSort";
const FILTER_LOCAL_STORAGE_KEY_ROOT = "qqq.filter";

interface Props
{
   table?: QTableMetaData;
}

/*******************************************************************************
 ** Get the default filter to use on the page - either from query string, or
 ** local storage, or a default (empty).
 *******************************************************************************/
function getDefaultFilter(tableMetaData: QTableMetaData, searchParams: URLSearchParams, filterLocalStorageKey: string): GridFilterModel
{
   if (tableMetaData.fields !== undefined)
   {
      if (searchParams.has("filter"))
      {
         try
         {
            const qQueryFilter = JSON.parse(searchParams.get("filter")) as QQueryFilter;

            //////////////////////////////////////////////////////////////////
            // translate from a qqq-style filter to one that the grid wants //
            //////////////////////////////////////////////////////////////////
            const defaultFilter = {items: []} as GridFilterModel;
            let id = 1;
            qQueryFilter.criteria.forEach((criteria) =>
            {
               const fieldType = tableMetaData.fields.get(criteria.fieldName).type;
               defaultFilter.items.push({
                  columnField: criteria.fieldName,
                  operatorValue: QFilterUtils.qqqCriteriaOperatorToGrid(criteria.operator, fieldType, criteria.values),
                  value: QFilterUtils.qqqCriteriaValuesToGrid(criteria.operator, criteria.values),
                  id: id++, // not sure what this id is!!
               });
            });

            return (defaultFilter);
         }
         catch (e)
         {
            console.warn("Error parsing filter from query string", e);
         }
      }

      if (localStorage.getItem(filterLocalStorageKey))
      {
         const defaultFilter = JSON.parse(localStorage.getItem(filterLocalStorageKey));
         console.log(`Got default from LS: ${JSON.stringify(defaultFilter)}`);
         return (defaultFilter);
      }
   }

   return ({items: []});
}

function EntityList({table}: Props): JSX.Element
{
   const tableNameParam = useParams().tableName;
   const tableName = table === null ? tableNameParam : table.name;
   const [searchParams] = useSearchParams();
   const qController = QClient.getInstance();

   ////////////////////////////////////////////
   // look for defaults in the local storage //
   ////////////////////////////////////////////
   const sortLocalStorageKey = `${COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const columnVisibilityLocalStorageKey = `${COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const filterLocalStorageKey = `${FILTER_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   let defaultSort = [] as GridSortItem[];
   let defaultVisibility = {};

   if (localStorage.getItem(sortLocalStorageKey))
   {
      defaultSort = JSON.parse(localStorage.getItem(sortLocalStorageKey));
   }
   if (localStorage.getItem(columnVisibilityLocalStorageKey))
   {
      defaultVisibility = JSON.parse(localStorage.getItem(columnVisibilityLocalStorageKey));
   }

   const [filterModel, setFilterModel] = useState({items: []} as GridFilterModel);
   const [columnSortModel, setColumnSortModel] = useState(defaultSort);
   const [columnVisibilityModel, setColumnVisibilityModel] = useState(defaultVisibility);

   ///////////////////////////////////////////////////////////////////////////////////////////////
   // for some reason, if we set the filterModel to what is in local storage, an onChange event //
   // fires on the grid anyway with an empty filter, so be aware of the first onchange, and     //
   // when that happens put the default back - it needs to be in state                          //
   // const [defaultFilter1] = useState(defaultFilter);                                         //
   ///////////////////////////////////////////////////////////////////////////////////////////////
   const [defaultFilter] = useState({items: []} as GridFilterModel);

   const [tableState, setTableState] = useState("");
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
   const [defaultFilterLoaded, setDefaultFilterLoaded] = useState(false);
   const [, setFiltersMenu] = useState(null);
   const [actionsMenu, setActionsMenu] = useState(null);
   const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
   const [pageNumber, setPageNumber] = useState(0);
   const [totalRecords, setTotalRecords] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [selectedIds, setSelectedIds] = useState([] as string[]);
   const [selectFullFilterState, setSelectFullFilterState] = useState("n/a" as "n/a" | "checked" | "filter");
   const [columns, setColumns] = useState([] as GridColDef[]);
   const [rows, setRows] = useState([] as GridRowsProp[]);
   const [loading, setLoading] = useState(true);
   const [alertContent, setAlertContent] = useState("");
   const [tableLabel, setTableLabel] = useState("");
   const [gridMouseDownX, setGridMouseDownX] = useState(0);
   const [gridMouseDownY, setGridMouseDownY] = useState(0);
   const [pinnedColumns, setPinnedColumns] = useState({left: ["__check__", "id"]});
   const instance = useRef({timer: null});

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // use all these states to avoid showing results from an "old" query, that finishes loading after a newer one //
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   const [latestQueryId, setLatestQueryId] = useState(0);
   const [countResults, setCountResults] = useState({} as any);
   const [receivedCountTimestamp, setReceivedCountTimestamp] = useState(new Date());
   const [queryResults, setQueryResults] = useState({} as any);
   const [receivedQueryTimestamp, setReceivedQueryTimestamp] = useState(new Date());
   const [queryErrors, setQueryErrors] = useState({} as any);
   const [receivedQueryErrorTimestamp, setReceivedQueryErrorTimestamp] = useState(new Date());

   const {pageHeader, setPageHeader} = useContext(QContext);

   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
   const closeActionsMenu = () => setActionsMenu(null);

   const buildQFilter = () =>
   {
      const qFilter = new QQueryFilter();
      if (columnSortModel)
      {
         columnSortModel.forEach((gridSortItem) =>
         {
            qFilter.addOrderBy(new QFilterOrderBy(gridSortItem.field, gridSortItem.sort === "asc"));
         });
      }
      if (filterModel)
      {
         filterModel.items.forEach((item) =>
         {
            const operator = QFilterUtils.gridCriteriaOperatorToQQQ(item.operatorValue);
            const values = QFilterUtils.gridCriteriaValueToQQQ(operator, item.value, item.operatorValue);
            qFilter.addCriteria(new QFilterCriteria(item.columnField, operator, values));
         });
      }

      return qFilter;
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
         if (!defaultFilterLoaded)
         {
            setDefaultFilterLoaded(true);
            setFilterModel(getDefaultFilter(tableMetaData, searchParams, filterLocalStorageKey));
            return;
         }
         setTableMetaData(tableMetaData);
         setTableLabel(tableMetaData.label);
         if (columnSortModel.length === 0)
         {
            columnSortModel.push({
               field: tableMetaData.primaryKeyField,
               sort: "desc",
            });
            setColumnSortModel(columnSortModel);
         }
         setPinnedColumns({left: ["__check__", tableMetaData.primaryKeyField]});

         const qFilter = buildQFilter();

         //////////////////////////////////////////////////////////////////////////////////////////////////
         // assign a new query id to the query being issued here.  then run both the count & query async //
         // and when they load, store their results associated with this id.                             //
         //////////////////////////////////////////////////////////////////////////////////////////////////
         const thisQueryId = latestQueryId + 1;
         setLatestQueryId(thisQueryId);

         console.log(`Issuing query: ${thisQueryId}`);
         qController.count(tableName, qFilter).then((count) =>
         {
            countResults[thisQueryId] = count;
            setCountResults(countResults);
            setReceivedCountTimestamp(new Date());
         });

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
   }, [receivedCountTimestamp]);

   const booleanTrueOperator: GridFilterOperator = {
      label: "is yes",
      value: "isTrue",
      getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
   };

   const booleanFalseOperator: GridFilterOperator = {
      label: "is no",
      value: "isFalse",
      getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
   };

   const booleanEmptyOperator: GridFilterOperator = {
      label: "is empty",
      value: "isEmpty",
      getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
   };

   const booleanNotEmptyOperator: GridFilterOperator = {
      label: "is not empty",
      value: "isNotEmpty",
      getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
   };

   const getCustomGridBooleanOperators = (): GridFilterOperator[] =>
   {
      return [booleanTrueOperator, booleanFalseOperator, booleanEmptyOperator, booleanNotEmptyOperator];
   }

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

      const fields = [...tableMetaData.fields.values()];
      const rows = [] as any[];
      const columnsToRender = {} as any;
      results.forEach((record: QRecord) =>
      {
         const row: any = {};
         fields.forEach((field) =>
         {
            const value = QValueUtils.getDisplayValue(field, record);
            if (typeof value !== "string")
            {
               columnsToRender[field.name] = true;
            }
            row[field.name] = value;
         });

         rows.push(row);
      });

      const sortedKeys: string[] = [];

      for (let i = 0; i < tableMetaData.sections.length; i++)
      {
         const section = tableMetaData.sections[i];
         for (let j = 0; j < section.fieldNames.length; j++)
         {
            sortedKeys.push(section.fieldNames[j]);
         }
      }

      const columns = [] as GridColDef[];
      sortedKeys.forEach((key) =>
      {
         const field = tableMetaData.fields.get(key);

         let columnType = "string";
         let columnWidth = 200;
         let filterOperators: GridFilterOperator<any>[] = getGridStringOperators();

         if (field.possibleValueSourceName)
         {
            filterOperators = getGridNumericOperators();
         }
         else
         {
            switch (field.type)
            {
               case QFieldType.DECIMAL:
               case QFieldType.INTEGER:
                  columnType = "number";
                  columnWidth = 100;

                  if (key === tableMetaData.primaryKeyField && field.label.length < 3)
                  {
                     columnWidth = 75;
                  }

                  // @ts-ignore
                  filterOperators = getGridNumericOperators();
                  break;
               case QFieldType.DATE:
                  columnType = "date";
                  columnWidth = 100;
                  filterOperators = getGridDateOperators();
                  break;
               case QFieldType.DATE_TIME:
                  columnType = "dateTime";
                  columnWidth = 200;
                  filterOperators = getGridDateOperators(true);
                  break;
               case QFieldType.BOOLEAN:
                  columnType = "string"; // using boolean gives an odd 'no' for nulls.
                  columnWidth = 75;
                  filterOperators = getCustomGridBooleanOperators();
                  break;
               default:
               // noop - leave as string
            }
         }

         if (field.hasAdornment(AdornmentType.SIZE))
         {
            const sizeAdornment = field.getAdornment(AdornmentType.SIZE);
            const width = sizeAdornment.getValue("width");
            switch (width)
            {
               case "small":
               {
                  columnWidth = 100;
                  break;
               }
               case "medium":
               {
                  columnWidth = 200;
                  break;
               }
               case "large":
               {
                  columnWidth = 400;
                  break;
               }
               case "xlarge":
               {
                  columnWidth = 600;
                  break;
               }
               default:
               {
                  console.log("Unrecognized size.width adornment value: " + width);
               }
            }
         }

         const column = {
            field: field.name,
            type: columnType,
            headerName: field.label,
            width: columnWidth,
            renderCell: null as any,
            filterOperators: filterOperators,
         };

         if (columnsToRender[field.name])
         {
            column.renderCell = (cellValues: any) => (
               (cellValues.value)
            );
         }

         if (key === tableMetaData.primaryKeyField)
         {
            columns.splice(0, 0, column);
            column.renderCell = (cellValues: any) => (
               <Link to={cellValues.value}>{cellValues.value}</Link>
            );
         }
         else
         {
            columns.push(column);
         }
      });

      setColumns(columns);
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
   };

   const navigate = useNavigate();
   const handleRowClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) =>
   {
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
      navigate(`${params.id}`);
      /*
      const diff = Math.max(Math.abs(event.clientX - gridMouseDownX), Math.abs(event.clientY - gridMouseDownY));
      if (diff < 5)
      {
         clearTimeout(instance.current.timer);
         instance.current.timer = setTimeout(() =>
         {
            navigate(`${params.id}`);
         }, 500);
      }
      else
      {
         console.log(`row-click mouse-up happened ${diff} x or y pixels away from the mouse-down - so not considering it a click.`);
      }
      */
   };

   const handleGridMouseDown = useCallback((event: any) =>
   {
      setGridMouseDownX(event.clientX);
      setGridMouseDownY(event.clientY);
      clearTimeout(instance.current.timer);
   }, []);

   const handleGridDoubleClick = useCallback((event: any) =>
   {
      clearTimeout(instance.current.timer);
   }, []);

   const selectionChanged = (selectionModel: GridSelectionModel, details: GridCallbackDetails) =>
   {
      const newSelectedIds: string[] = [];
      selectionModel.forEach((value: GridRowId) =>
      {
         newSelectedIds.push(value as string);
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
      console.log(JSON.stringify(columns));
      console.log(columnOrderChangeParams);
   };

   const handleFilterChange = (filterModel: GridFilterModel) =>
   {
      setFilterModel(filterModel);
      if (filterLocalStorageKey)
      {
         localStorage.setItem(
            filterLocalStorageKey,
            JSON.stringify(filterModel),
         );
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
         setTableState(tableName);
         setFiltersMenu(null);
         const metaData = await qController.loadMetaData();
         QValueUtils.qInstance = metaData;

         setTableProcesses(QProcessUtils.getProcessesForTable(metaData, tableName));

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
               columns.forEach((gridColumn) =>
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
               const dateString = `${d.getFullYear()}-${zp(d.getMonth())}-${zp(d.getDate())} ${zp(d.getHours())}${zp(d.getMinutes())}`;
               const filename = `${tableMetaData.label} Export ${dateString}.${format}`;
               const url = `/data/${tableMetaData.name}/export/${filename}?filter=${encodeURIComponent(JSON.stringify(buildQFilter()))}&fields=${visibleFields.join(",")}`;

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
                           window.location.href="${url}";
                        }, 1);
                     </script>
                  </head>
                  <body>Generating file <u>${filename}</u> with ${totalRecords.toLocaleString()} records...</body>
               </html>`);

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
         return `?recordsParam=filterJSON&filterJSON=${JSON.stringify(buildQFilter())}`;
      }

      if (selectedIds.length > 0)
      {
         return `?recordsParam=recordIds&recordIds=${selectedIds.join(",")}`;
      }

      return "";
   }

   const bulkLoadClicked = () =>
   {
      navigate(`${tableName}.bulkInsert`);
   };

   const bulkEditClicked = () =>
   {
      if (getNoOfSelectedRecords() === 0)
      {
         setAlertContent("No records were selected to Bulk Edit.");
         return;
      }
      navigate(`${tableName}.bulkEdit${getRecordsQueryString()}`);
   };

   const bulkDeleteClicked = () =>
   {
      if (getNoOfSelectedRecords() === 0)
      {
         setAlertContent("No records were selected to Bulk Delete.");
         return;
      }
      navigate(`${tableName}.bulkDelete${getRecordsQueryString()}`);
   };

   const processClicked = (process: QProcessMetaData) =>
   {
      // todo - let the process specify that it needs initial rows - err if none selected.
      //  alternatively, let a process itself have an initial screen to select rows...
      navigate(`${process.name}${getRecordsQueryString()}`);
   };

   // @ts-ignore
   const defaultLabelDisplayedRows = ({from, to, count}) =>
   {
      if (count !== null && count !== undefined)
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
            count={totalRecords === null ? 0 : totalRecords}
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

   function CustomToolbar()
   {
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
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExportContainer>
               <ExportMenuItem format="csv" />
               <ExportMenuItem format="xlsx" />
            </GridToolbarExportContainer>
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
                        <strong>{` ${totalRecords ? totalRecords.toLocaleString() : "All"} `}</strong>
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
         </GridToolbarContainer>
      );
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
         <MenuItem onClick={bulkLoadClicked}>Bulk Load</MenuItem>
         <MenuItem onClick={bulkEditClicked}>Bulk Edit</MenuItem>
         <MenuItem onClick={bulkDeleteClicked}>Bulk Delete</MenuItem>
         {tableProcesses.length > 0 && <MenuItem divider />}
         {tableProcesses.map((process) => (
            <MenuItem key={process.name} onClick={() => processClicked(process)}>{process.label}</MenuItem>
         ))}
      </Menu>
   );

   ///////////////////////////////////////////////////////////////////////////////////////////
   // for changes in table controls that don't change the count, call to update the table - //
   // but without clearing out totalRecords (so pagination doesn't flash)                   //
   ///////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      updateTable();
   }, [pageNumber, rowsPerPage, columnSortModel]);

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // for state changes that DO change the filter, call to update the table - and DO clear out the totalRecords //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      setTotalRecords(null);
      updateTable();
   }, [tableState, filterModel]);

   useEffect(() =>
   {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
   }, [pageNumber, rowsPerPage]);

   return (
      <DashboardLayout>
         <Navbar />
         <MDBox my={3}>
            {alertContent ? (
               <MDBox mb={3}>
                  <Alert
                     severity="error"
                     onClose={() =>
                     {
                        setAlertContent(null);
                     }}
                  >
                     {alertContent}
                  </Alert>
               </MDBox>
            ) : (
               ""
            )}
            {
               (tableLabel && searchParams.get("deleteSuccess")) ? (
                  <MDAlert color="success" dismissible>
                     {`${tableLabel} successfully deleted`}
                  </MDAlert>
               ) : null
            }
            <MDBox display="flex" justifyContent="flex-end" alignItems="flex-start" mb={2}>

               <MDBox display="flex" width="150px">
                  <QActionsMenuButton isOpen={actionsMenu} onClickHandler={openActionsMenu} />
                  {renderActionsMenu}
               </MDBox>

               <QCreateNewButton />

            </MDBox>
            <Card>
               {/* with these turned on, the toolbar & pagination controls become very flaky...
               onMouseDown={(e) => handleGridMouseDown(e)} onDoubleClick={(e) => handleGridDoubleClick(e)} */}
               <MDBox height="100%">
                  <DataGridPro
                     components={{Toolbar: CustomToolbar, Pagination: CustomPagination, LoadingOverlay: Loading}}
                     initialState={{pinnedColumns: pinnedColumns}}
                     pagination
                     paginationMode="server"
                     sortingMode="server"
                     filterMode="server"
                     page={pageNumber}
                     checkboxSelection
                     disableSelectionOnClick
                     autoHeight
                     rows={rows}
                     columns={columns}
                     rowBuffer={10}
                     rowCount={totalRecords === null ? 0 : totalRecords}
                     onPageSizeChange={handleRowsPerPageChange}
                     onRowClick={handleRowClick}
                     density="standard"
                     loading={loading}
                     filterModel={filterModel}
                     onFilterModelChange={handleFilterChange}
                     columnVisibilityModel={columnVisibilityModel}
                     onColumnVisibilityModelChange={handleColumnVisibilityChange}
                     onColumnOrderChange={handleColumnOrderChange}
                     onSelectionModelChange={selectionChanged}
                     onSortModelChange={handleSortChange}
                     sortingOrder={["asc", "desc"]}
                     sortModel={columnSortModel}
                     getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
                  />
               </MDBox>
            </Card>
         </MDBox>
         <Footer />
      </DashboardLayout>
   );
}

EntityList.defaultProps = {
   table: null,
};

export default EntityList;
