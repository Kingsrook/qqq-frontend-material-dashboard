/**
 =========================================================
 * Material Dashboard 2 PRO React TS - v1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
/*  eslint-disable react/no-unstable-nested-components */

import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { makeStyles, Alert } from "@mui/material";
import {
   DataGrid,
   GridCallbackDetails,
   GridColDef,
   GridColumnVisibilityModel,
   GridFilterModel,
   GridRowId,
   GridRowParams,
   GridRowsProp,
   GridSelectionModel,
   GridSortItem,
   GridSortModel,
   GridToolbar,
} from "@mui/x-data-grid";

// Material Dashboard 2 PRO React TS components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// QQQ
import { QProcessMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import { QTableMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import { QQueryFilter } from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import { QFilterOrderBy } from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import { QFilterCriteria } from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import { QCriteriaOperator } from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import { QFieldType } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import QClient from "qqq/utils/QClient";
import Footer from "../../components/Footer";
import QProcessUtils from "../../utils/QProcessUtils";

const COLUMN_VISIBILITY_LOCAL_STORAGE_KEY = "qqq.columnVisibility";
const COLUMN_SORT_LOCAL_STORAGE_KEY = "qqq.columnSort";

// Declaring props types for DefaultCell
interface Props {
  table?: QTableMetaData;
}

function EntityList({ table }: Props): JSX.Element
{
   const tableNameParam = useParams().tableName;
   const tableName = table === null ? tableNameParam : table.name;

   const [tableState, setTableState] = useState("");
   const [filtersMenu, setFiltersMenu] = useState(null);
   const [actionsMenu, setActionsMenu] = useState(null);
   const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
   const [pageNumber, setPageNumber] = useState(0);
   const [totalRecords, setTotalRecords] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [selectedIds, setSelectedIds] = useState([] as string[]);
   const [columns, setColumns] = useState([] as GridColDef[]);
   const [rows, setRows] = useState([] as GridRowsProp[]);
   const [loading, setLoading] = useState(true);
   const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
   const [sortModel, setSortModel] = useState([] as GridSortItem[]);
   const [filterModel, setFilterModel] = useState(null as GridFilterModel);
   const [alertContent, setAlertContent] = useState("");

   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
   const closeActionsMenu = () => setActionsMenu(null);
   const openFiltersMenu = (event: any) => setFiltersMenu(event.currentTarget);
   const closeFiltersMenu = () => setFiltersMenu(null);

   const translateCriteriaOperator = (operator: string) =>
   {
      switch (operator)
      {
      case "contains":
         return QCriteriaOperator.CONTAINS;
      case "starts with":
         return QCriteriaOperator.STARTS_WITH;
      case "ends with":
         return QCriteriaOperator.STARTS_WITH;
      case "is":
      case "equals":
      case "=":
         return QCriteriaOperator.EQUALS;
      case "is not":
      case "!=":
         return QCriteriaOperator.NOT_EQUALS;
      case "is after":
      case ">":
         return QCriteriaOperator.GREATER_THAN;
      case "is on or after":
      case ">=":
         return QCriteriaOperator.GREATER_THAN_OR_EQUALS;
      case "is before":
      case "<":
         return QCriteriaOperator.LESS_THAN;
      case "is on or before":
      case "<=":
         return QCriteriaOperator.LESS_THAN_OR_EQUALS;
      case "is empty":
         return QCriteriaOperator.IS_BLANK;
      case "is not empty":
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
      sortModel.forEach((gridSortItem) =>
      {
         qFilter.addOrderBy(new QFilterOrderBy(gridSortItem.field, gridSortItem.sort === "asc"));
      });
      if (filterModel)
      {
         filterModel.items.forEach((item) =>
         {
            qFilter.addCriteria(
               new QFilterCriteria(item.columnField, translateCriteriaOperator(item.operatorValue), [
                  item.value,
               ]),
            );
         });
      }

      return qFilter;
   };

   const updateTable = () =>
   {
      (async () =>
      {
         const tableMetaData = await QClient.loadTableMetaData(tableName);
         const count = await QClient.count(tableName);
         setTotalRecords(count);

         if (sortModel.length === 0)
         {
            sortModel.push({ field: tableMetaData.primaryKeyField, sort: "desc" });
            setSortModel(sortModel);
         }

         const qFilter = buildQFilter();
         const columns = [] as GridColDef[];

         const results = await QClient.query(
            tableName,
            qFilter,
            rowsPerPage,
            pageNumber * rowsPerPage,
         ).catch((error) =>
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

         const columnVisibilityModel = localStorage.getItem(COLUMN_VISIBILITY_LOCAL_STORAGE_KEY);
         if (columnVisibilityModel)
         {
            setColumnVisibilityModel(
               JSON.parse(localStorage.getItem(COLUMN_VISIBILITY_LOCAL_STORAGE_KEY)),
            );
         }
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
   };

   const handleColumnVisibilityChange = (columnVisibilityModel: GridColumnVisibilityModel) =>
   {
      setColumnVisibilityModel(columnVisibilityModel);
      localStorage.setItem(
         COLUMN_VISIBILITY_LOCAL_STORAGE_KEY,
         JSON.stringify(columnVisibilityModel),
      );
   };

   const handleSortChange = (gridSort: GridSortModel) =>
   {
      setSortModel(gridSort);
      localStorage.setItem(COLUMN_SORT_LOCAL_STORAGE_KEY, JSON.stringify(gridSort));
   };

   if (tableName !== tableState)
   {
      (async () =>
      {
         setTableState(tableName);
         const metaData = await QClient.loadMetaData();

         setTableProcesses(QProcessUtils.getProcessesForTable(metaData, tableName));

         // reset rows to trigger rerender
         setRows([]);
      })();
   }

   function getRecordsQueryString()
   {
      if (selectedIds.length > 0)
      {
         return `?recordsParam=recordIds&recordIds=${selectedIds.join(",")}`;
      }
      return "";
   }

   const renderActionsMenu = (
      <Menu
         anchorEl={actionsMenu}
         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
         transformOrigin={{ vertical: "top", horizontal: "left" }}
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
   }, [pageNumber, rowsPerPage, tableState, sortModel, filterModel]);

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
            <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
               <Link href={`/${tableName}/create`}>
                  <MDButton variant="gradient" color="info">
                     new
                     {" "}
                     {tableName}
                  </MDButton>
               </Link>

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
                  <DataGrid
                     components={{ Toolbar: GridToolbar }}
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
                     onSelectionModelChange={selectionChanged}
                     onSortModelChange={handleSortChange}
                     sortingOrder={["asc", "desc"]}
                     sortModel={sortModel}
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
