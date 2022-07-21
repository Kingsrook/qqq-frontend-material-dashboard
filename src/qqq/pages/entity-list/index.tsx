/**
 =========================================================
 * Material Dashboard 2 PRO React TS - v1.0.0
 =========================================================
 * Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)
 Coded by www.creative-tim.com
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 */
/*  eslint-disable react/no-unstable-nested-components */

import React, {useEffect, useReducer, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import {Alert} from "@mui/material";
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
   GridToolbarExport,
   GridToolbarFilterButton,
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
import Footer from "../../components/Footer";
import QProcessUtils from "../../utils/QProcessUtils";

import "./styles.css";

const COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT = "qqq.columnVisibility";
const COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT = "qqq.columnSort";

// Declaring props types for DefaultCell
interface Props
{
   table?: QTableMetaData;
}

function EntityList({table}: Props): JSX.Element
{
   const tableNameParam = useParams().tableName;
   const tableName = table === null ? tableNameParam : table.name;
   const [searchParams] = useSearchParams();

   ////////////////////////////////////////////
   // look for defaults in the local storage //
   ////////////////////////////////////////////
   const sortLocalStorageKey = `${COLUMN_SORT_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
   const columnVisibilityLocalStorageKey = `${COLUMN_VISIBILITY_LOCAL_STORAGE_KEY_ROOT}.${tableName}`;
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

   const [buttonText, setButtonText] = useState("");
   const [tableState, setTableState] = useState("");
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
   const [filterModel, setFilterModel] = useState(null as GridFilterModel);
   const [alertContent, setAlertContent] = useState("");
   const [tableLabel, setTableLabel] = useState("");
   const [columnSortModel, setColumnSortModel] = useState(defaultSort);
   const [columnVisibilityModel, setColumnVisibilityModel] = useState(defaultVisibility);

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
               criteria = new QFilterCriteria(item.columnField, translateCriteriaOperator(item.operatorValue), null);
            }
            qFilter.addCriteria(criteria);
         });
      }

      return qFilter;
   };

   const updateTable = () =>
   {
      (async () =>
      {
         const tableMetaData = await QClient.loadTableMetaData(tableName);
         if (columnSortModel.length === 0)
         {
            columnSortModel.push({
               field: tableMetaData.primaryKeyField,
               sort: "desc",
            });
            setColumnSortModel(columnSortModel);
         }

         const qFilter = buildQFilter();

         const count = await QClient.count(tableName, qFilter);
         setTotalRecords(count);
         setButtonText(`new ${tableMetaData.label}`);
         setTableLabel(tableMetaData.label);

         const columns = [] as GridColDef[];

         const results = await QClient.query(
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

         const rows = [] as any[];
         results.forEach((record) =>
         {
            rows.push(Object.fromEntries(record.values.entries()));
         });

         const sortedKeys = [...tableMetaData.fields.keys()].sort();
         sortedKeys.forEach((key) =>
         {
            const field = tableMetaData.fields.get(key);

            let columnType = "string";
            switch (field.type)
            {
               case QFieldType.DECIMAL:
               case QFieldType.INTEGER:
                  columnType = "number";
                  break;
               case QFieldType.DATE:
                  columnType = "date";
                  break;
               case QFieldType.DATE_TIME:
                  columnType = "dateTime";
                  break;
               case QFieldType.BOOLEAN:
                  columnType = "boolean";
                  break;
               default:
               // noop
            }

            const column = {
               field: field.name,
               type: columnType,
               headerName: field.label,
               width: 200,
            };

            if (key === tableMetaData.primaryKeyField)
            {
               column.width = 75;
               columns.splice(0, 0, column);
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

   const handleRowClick = (params: GridRowParams) =>
   {
      document.location.href = `/${tableName}/${params.id}`;
   };

   const handleFilterChange = (filterModel: GridFilterModel) =>
   {
      setFilterModel(filterModel);
   };

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
         setFilterModel(null);
         setFiltersMenu(null);
         const metaData = await QClient.loadMetaData();

         setTableProcesses(QProcessUtils.getProcessesForTable(metaData, tableName));

         // reset rows to trigger rerender
         setRows([]);
      })();
   }

   function CustomToolbar()
   {
      return (
         <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
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

   const renderActionsMenu = (
      <Menu
         anchorEl={actionsMenu}
         anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
         }}
         transformOrigin={{
            vertical: "top",
            horizontal: "left",
         }}
         open={Boolean(actionsMenu)}
         onClose={closeActionsMenu}
         keepMounted
      >
         {tableProcesses.map((process) => (
            <MenuItem key={process.name}>
               <Link href={`/processes/${process.name}${getRecordsQueryString()}`}>{process.label}</Link>
            </MenuItem>
         ))}
      </Menu>
   );

   useEffect(() =>
   {
      updateTable();
   }, [pageNumber, rowsPerPage, tableState, columnSortModel, filterModel]);

   return (
      <DashboardLayout>
         <DashboardNavbar />
         <MDBox my={3}>
            {alertContent ? (
               <MDBox mb={3}>
                  <Alert severity="error">{alertContent}</Alert>
               </MDBox>
            ) : (
               ""
            )}
            {
               (tableLabel && searchParams.get("deleteSuccess")) ? (
                  <MDAlert color="success" dismissible>
                     {`${tableLabel} successfully deleted`}
                  </MDAlert>
               ) : ("")
            }
            <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
               {buttonText ? (
                  <Link href={`/${tableName}/create`}>
                     <MDButton variant="gradient" color="info">
                        {
                           buttonText
                        }
                     </MDButton>
                  </Link>
               ) : (
                  ""
               )}

               <MDBox display="flex">
                  {tableProcesses.length > 0 && (
                     <MDButton
                        variant={actionsMenu ? "contained" : "outlined"}
                        color="dark"
                        onClick={openActionsMenu}
                     >
                        actions&nbsp;
                        <Icon>keyboard_arrow_down</Icon>
                     </MDButton>
                  )}
                  {renderActionsMenu}
               </MDBox>
            </MDBox>
            <Card>
               <MDBox height="100%">
                  <DataGridPro
                     components={{Toolbar: CustomToolbar}}
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
                     pageSize={rowsPerPage}
                     rowsPerPageOptions={[10, 25, 50]}
                     onPageSizeChange={handleRowsPerPageChange}
                     onPageChange={handlePageChange}
                     onRowClick={handleRowClick}
                     density="compact"
                     loading={loading}
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
