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

import React, {
   SyntheticEvent,
   useCallback,
   useEffect, useReducer, useRef, useState,
} from "react";
import {
   Link, useNavigate, useParams, useSearchParams,
} from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {Alert, Pagination, TablePagination} from "@mui/material";
import {
   DataGridPro,
   GridCallbackDetails,
   GridColDef,
   GridColumnOrderChangeParams,
   GridColumnVisibilityModel,
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
   GridExportMenuItemProps,
   MuiEvent,
} from "@mui/x-data-grid-pro";

// Material Dashboard 2 PRO React TS components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// QQQ
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {QFilterOrderBy} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import QClient from "qqq/utils/QClient";
import Navbar from "qqq/components/Navbar";
import Button from "@mui/material/Button";
import Footer from "../../components/Footer";
import QProcessUtils from "../../utils/QProcessUtils";

import {QActionsMenuButton, QCreateNewButton} from "qqq/components/QButtons";
import QValueUtils from "qqq/utils/QValueUtils";
import LinearProgress from "@mui/material/LinearProgress";

const COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT = "qqq.columnVisibility";
const COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT = "qqq.columnSort";
const FILTER_LOCAL_STORAGE_KEY_ROOT = "qqq.filter";

interface Props
{
   table?: QTableMetaData;
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
   let _defaultFilter = {items: []} as GridFilterModel;

   if (localStorage.getItem(sortLocalStorageKey))
   {
      defaultSort = JSON.parse(localStorage.getItem(sortLocalStorageKey));
   }
   if (localStorage.getItem(columnVisibilityLocalStorageKey))
   {
      defaultVisibility = JSON.parse(localStorage.getItem(columnVisibilityLocalStorageKey));
   }
   if (localStorage.getItem(filterLocalStorageKey))
   {
      _defaultFilter = JSON.parse(localStorage.getItem(filterLocalStorageKey));
      console.log(`Got default from LS: ${JSON.stringify(_defaultFilter)}`);
   }

   const [filterModel, setFilterModel] = useState(_defaultFilter);
   const [columnSortModel, setColumnSortModel] = useState(defaultSort);
   const [columnVisibilityModel, setColumnVisibilityModel] = useState(defaultVisibility);

   ///////////////////////////////////////////////////////////////////////////////////////////////
   // for some reason, if we set the filterModel to what is in local storage, an onChange event //
   // fires on the grid anyway with an empty filter, so be aware of the first onchange, and     //
   // when that happens put the default back - it needs to be in state                          //
   // const [defaultFilter1] = useState(defaultFilter);                                         //
   ///////////////////////////////////////////////////////////////////////////////////////////////
   const [defaultFilter] = useState(_defaultFilter);
   const [filterChangeHasOccurred, setFilterChangeHasOccurred] = useState(false);

   const [tableState, setTableState] = useState("");
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);
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

   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
   const closeActionsMenu = () => setActionsMenu(null);

   const translateCriteriaOperator = (operator: string) =>
   {
      switch (operator)
      {
         case "contains":
            return QCriteriaOperator.CONTAINS;
         case "startsWith":
            return QCriteriaOperator.STARTS_WITH;
         case "endsWith":
            return QCriteriaOperator.ENDS_WITH;
         case "is":
         case "equals":
         case "=":
            return QCriteriaOperator.EQUALS;
         case "isNot":
         case "!=":
            return QCriteriaOperator.NOT_EQUALS;
         case "after":
         case ">":
            return QCriteriaOperator.GREATER_THAN;
         case "onOrAfter":
         case ">=":
            return QCriteriaOperator.GREATER_THAN_OR_EQUALS;
         case "before":
         case "<":
            return QCriteriaOperator.LESS_THAN;
         case "onOrBefore":
         case "<=":
            return QCriteriaOperator.LESS_THAN_OR_EQUALS;
         case "isEmpty":
            return QCriteriaOperator.IS_BLANK;
         case "isNotEmpty":
            return QCriteriaOperator.IS_NOT_BLANK;
         // case "is any of":
         // TODO: handle this case
         default:
            return QCriteriaOperator.EQUALS;
      }
   };

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
            const operator = translateCriteriaOperator(item.operatorValue);
            let criteria = new QFilterCriteria(item.columnField, operator, [item.value]);
            if (operator === QCriteriaOperator.IS_BLANK || operator === QCriteriaOperator.IS_NOT_BLANK)
            {
               criteria = new QFilterCriteria(item.columnField, operator, null);
            }
            qFilter.addCriteria(criteria);
         });
      }

      return qFilter;
   };

   const updateTable = () =>
   {
      setRows([]);
      (async () =>
      {
         const tableMetaData = await qController.loadTableMetaData(tableName);
         setTableMetaData(tableMetaData);
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

         const count = await qController.count(tableName, qFilter);
         setTotalRecords(count);
         setTableLabel(tableMetaData.label);

         const columns = [] as GridColDef[];

         const results = await qController.query(
            tableName,
            qFilter,
            rowsPerPage,
            pageNumber * rowsPerPage,
         )
            .catch((error) =>
            {
               if (error.message)
               {
                  setAlertContent(error.message);
               }
               else
               {
                  setAlertContent(error.response.data.error);
               }
               throw error;
            });

         const fields = [...tableMetaData.fields.values()];
         const rows = [] as any[];
         results.forEach((record) =>
         {
            const row: any = {};
            fields.forEach((field) =>
            {
               row[field.name] = QValueUtils.getDisplayValue(field, record);
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

         sortedKeys.forEach((key) =>
         {
            const field = tableMetaData.fields.get(key);

            let columnType = "string";
            let columnWidth = 200;

            if (!field.possibleValueSourceName)
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

                     break;
                  case QFieldType.DATE:
                     columnType = "date";
                     columnWidth = 100;
                     break;
                  case QFieldType.DATE_TIME:
                     columnType = "dateTime";
                     columnWidth = 200;
                     break;
                  case QFieldType.BOOLEAN:
                     columnType = "boolean";
                     columnWidth = 75;
                     break;
                  default:
                  // noop - leave as string
               }
            }

            const column = {
               field: field.name,
               type: columnType,
               headerName: field.label,
               width: columnWidth,
               renderCell: null as any,
            };

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
         forceUpdate();
      })();
   };

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
      if (!filterChangeHasOccurred)
      {
         setFilterModel(defaultFilter);
         setFilterChangeHasOccurred(true);
      }
      else
      {
         setFilterModel(filterModel);
         if (filterLocalStorageKey)
         {
            localStorage.setItem(
               filterLocalStorageKey,
               JSON.stringify(filterModel),
            );
         }
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

         setTableProcesses(QProcessUtils.getProcessesForTable(metaData, tableName));

         // reset rows to trigger rerender
         setRows([]);
      })();
   }

   interface QExportMenuItemProps extends GridExportMenuItemProps<{}>
   {
      format: string;
   }

   // todo - figure out what's up here...
   // eslint-disable-next-line react/no-unstable-nested-components
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
   const defaultLabelDisplayedRows = ({from, to, count}) => `Showing ${from.toLocaleString()} to ${to.toLocaleString()} of ${count !== -1 ? `${count.toLocaleString()} records` : `more than ${to.toLocaleString()} records`}`;

   // todo - figure out what's up here...
   // eslint-disable-next-line react/no-unstable-nested-components
   function CustomPagination()
   {
      return (
         <TablePagination
            component="div"
            count={totalRecords}
            page={pageNumber}
            rowsPerPageOptions={[10, 25, 50]}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, value) => handlePageChange(value)}
            onRowsPerPageChange={(event) => handleRowsPerPageChange(Number(event.target.value))}
            labelDisplayedRows={defaultLabelDisplayedRows}
         />
      );
   }

   // todo - figure out what's up here...
   // eslint-disable-next-line react/no-unstable-nested-components
   function Loading()
   {
      return (
         <LinearProgress color="info" />
      );
   }

   // todo - figure out what's up here...
   // eslint-disable-next-line react/no-unstable-nested-components
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
                        <button
                           type="button"
                           onClick={() => setSelectFullFilterState("filter")}
                           className="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButtonBase-root  css-knwngq-MuiButtonBase-root-MuiButton-root"
                        >
                           Select all
                           {` ${totalRecords.toLocaleString()} `}
                           records matching this query
                        </button>
                     </div>
                  )
               }
               {
                  selectFullFilterState === "filter" && (
                     <div className="selectionTool">
                        All
                        <strong>{` ${totalRecords.toLocaleString()} `}</strong>
                        records matching this query are selected.
                        <button
                           type="button"
                           onClick={() => setSelectFullFilterState("checked")}
                           className="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButtonBase-root  css-knwngq-MuiButtonBase-root-MuiButton-root"
                        >
                           Select the
                           {` ${selectedIds.length.toLocaleString()} `}
                           records on this page
                        </button>
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

   useEffect(() =>
   {
      setLoading(true);
      updateTable();
   }, [pageNumber, rowsPerPage, tableState, columnSortModel, filterModel]);

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
                     rowCount={totalRecords}
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
