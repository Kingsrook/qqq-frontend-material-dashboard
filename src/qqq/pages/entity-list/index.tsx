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

import React, { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import { QProcessMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import Link from "@mui/material/Link";
import { QTableMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import { useParams } from "react-router-dom";
import IdCell from "./components/IdCell";
import Footer from "../../components/Footer";
import EntityForm from "../../components/EntityForm";

const qController = new QController("");

// Declaring props types for DefaultCell
interface Props {
  table?: QTableMetaData;
}

let dataTableData = {
  columns: [] as any[],
  rows: [] as any[],
};

function EntityList({ table }: Props): JSX.Element {
  const tableNameParam = useParams().tableName;
  const tableName = table === null ? tableNameParam : table.name;
  const [filtersMenu, setFiltersMenu] = useState(null);
  const [actionsMenu, setActionsMenu] = useState(null);
  const [tableState, setTableState] = useState("");
  const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
  console.log(tableState);

  const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
  const closeActionsMenu = () => setActionsMenu(null);
  const openFiltersMenu = (event: any) => setFiltersMenu(event.currentTarget);
  const closeFiltersMenu = () => setFiltersMenu(null);

  const createPath = `/${tableName}/create`;

  if (tableState === "") {
    (async () => {
      const tableMetaData = await qController.loadTableMetaData(tableName);
      const metaData = await qController.loadMetaData();
      const results = await qController.query(tableName, 250);
      dataTableData = {
        columns: [],
        rows: [],
      };

      const sortedKeys = [...tableMetaData.fields.keys()].sort();
      sortedKeys.forEach((key) => {
        const field = tableMetaData.fields.get(key);
        if (key === tableMetaData.primaryKeyField) {
          dataTableData.columns.splice(0, 0, {
            Header: field.label,
            accessor: key,
            Cell: ({ value }: any) => <IdCell id={value} />,
          });
        } else {
          dataTableData.columns.push({
            Header: field.label,
            accessor: key,
          });
        }
      });

      results.forEach((record) => {
        dataTableData.rows.push(Object.fromEntries(record.values.entries()));
      });

      const matchingProcesses: QProcessMetaData[] = [];
      const processKeys = [...metaData.processes.keys()];
      processKeys.forEach((key) => {
        const process = metaData.processes.get(key);
        if (process.tableName === tableName) {
          matchingProcesses.push(process);
        }
      });
      setTableProcesses(matchingProcesses);

      setTableState(tableName);
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDButton variant="gradient" color="info">
            <Link href={createPath}>new {tableName}</Link>
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
          <DataTable table={dataTableData} entriesPerPage={false} canSearch />
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

// Declaring default props for DefaultCell
EntityList.defaultProps = {
  table: null,
};

export default EntityList;
