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

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { makeStyles } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams, GridRowsProp } from "@mui/x-data-grid";

// Material Dashboard 2 PRO React TS components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// QQQ
import { QProcessMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import { QTableMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import { useParams } from "react-router-dom";
import QClient from "qqq/utils/QClient";
import Footer from "../../components/Footer";

// Declaring props types for DefaultCell
interface Props {
  table?: QTableMetaData;
}

function EntityList({ table }: Props): JSX.Element {
  const tableNameParam = useParams().tableName;
  const tableName = table === null ? tableNameParam : table.name;

  const [tableState, setTableState] = useState("");
  const [filtersMenu, setFiltersMenu] = useState(null);
  const [actionsMenu, setActionsMenu] = useState(null);
  const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columns, setColumns] = useState([] as GridColDef[]);
  const [rows, setRows] = useState([] as GridRowsProp[]);
  const [loading, setLoading] = useState(true);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
  const closeActionsMenu = () => setActionsMenu(null);
  const openFiltersMenu = (event: any) => setFiltersMenu(event.currentTarget);
  const closeFiltersMenu = () => setFiltersMenu(null);

  const updateTable = () => {
    (async () => {
      const tableMetaData = await QClient.loadTableMetaData(tableName);
      const count = await QClient.count(tableName);
      setTotalRecords(count);

      const columns = [] as GridColDef[];
      const results = await QClient.query(tableName, rowsPerPage, pageNumber * rowsPerPage);

      const rows = [] as any[];
      results.forEach((record) => {
        rows.push(Object.fromEntries(record.values.entries()));
      });

      const sortedKeys = [...tableMetaData.fields.keys()].sort();
      sortedKeys.forEach((key) => {
        const field = tableMetaData.fields.get(key);

        const column = {
          field: field.name,
          headerName: field.label,
          width: 200,
        };

        if (key === tableMetaData.primaryKeyField) {
          columns.splice(0, 0, column);
        } else {
          columns.push(column);
        }
      });

      setColumns(columns);
      setRows(rows);
      setLoading(false);
      forceUpdate();
    })();
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleRowsPerPageChange = (size: number) => {
    setRowsPerPage(size);
  };

  const handleRowClick = (params: GridRowParams) => {
    document.location.href = `/${tableName}/${params.id}`;
  };

  if (tableName !== tableState) {
    (async () => {
      setTableState(tableName);
      const metaData = await QClient.loadMetaData();

      const matchingProcesses: QProcessMetaData[] = [];
      const processKeys = [...metaData.processes.keys()];
      processKeys.forEach((key) => {
        const process = metaData.processes.get(key);
        if (process.tableName === tableName) {
          matchingProcesses.push(process);
        }
      });
      setTableProcesses(matchingProcesses);

      // reset rows to trigger rerender
      setRows([]);
    })();
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
          <Link href={`/processes/${process.name}`}>{process.label}</Link>
        </MenuItem>
      ))}
    </Menu>
  );

  const renderFiltersMenu = (
    <Menu
      anchorEl={filtersMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(filtersMenu)}
      onClose={closeFiltersMenu}
      keepMounted
    >
      <MenuItem onClick={closeFiltersMenu}>Status: Paid</MenuItem>
      <MenuItem onClick={closeFiltersMenu}>Status: Refunded</MenuItem>
      <MenuItem onClick={closeFiltersMenu}>Status: Canceled</MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem onClick={closeFiltersMenu}>
        <MDTypography variant="button" color="error" fontWeight="regular">
          Remove Filter
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  useEffect(() => {
    updateTable();
  }, [pageNumber, rowsPerPage, tableState]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDButton variant="gradient" color="info">
            <Link href={`/${tableName}/create`}>new {tableName}</Link>
          </MDButton>
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
            <MDBox ml={1}>
              <MDButton
                variant={filtersMenu ? "contained" : "outlined"}
                color="dark"
                onClick={openFiltersMenu}
              >
                filters&nbsp;
                <Icon>keyboard_arrow_down</Icon>
              </MDButton>
              {renderFiltersMenu}
            </MDBox>
            <MDBox ml={1}>
              <MDButton variant="outlined" color="dark">
                <Icon>description</Icon>
                &nbsp;export csv
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
        <Card>
          <MDBox height="100%">
            <DataGrid
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
              paginationMode="server"
              density="compact"
              loading={loading}
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
