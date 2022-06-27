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

import { useState } from "react";

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
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// import dataTableData from "layouts/ecommerce/orders/order-list/data/dataTableData";
// Data
import { QTableMetaData } from "qqq-frontend-core/lib/model/metaData/QTableMetaData";
import { QController } from "qqq-frontend-core/lib/controllers/QController";
import Link from "@mui/material/Link";

const qController = new QController("http://localhost:8000");
console.log(qController);

// Declaring props types for DefaultCell
interface Props {
  table: QTableMetaData;
}

let dataTableData = {
  columns: [] as any[],
  rows: [] as any[],
};

function EntityList({ table }: Props): JSX.Element {
  const [menu, setMenu] = useState(null);
  const [thing, thing1] = useState(1);
  console.log(thing);

  const newEntity = (event: any) => setMenu(event.currentTarget);
  const openMenu = (event: any) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const createPath = `/${table.name}/create`;

  (async () => {
    await qController.loadTableMetaData(table.name).then((tableMetaData) => {
      (async () => {
        await qController.query(table.name).then((results) => {
          dataTableData = {
            columns: [],
            rows: [],
          };

          Object.keys(tableMetaData.fields).forEach((key) => {
            dataTableData.columns.push({
              Header: key,
              accessor: key,
            });
          });

          results.forEach((record) => {
            const row = new Map();
            const values = new Map(Object.entries(record.values));
            values.forEach((value, key) => {
              if (key === tableMetaData.primaryKeyField) {
                row.set(key, `<a href='/${tableMetaData.name}/${value}'>${value}</a>`);
              } else {
                row.set(key, value);
              }
            });
            dataTableData.rows.push(Object.fromEntries(row));
          });

          thing1(table.name === "carrier" ? 2 : 3);
        });
      })();
    });
  })();

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={closeMenu}>Status: Paid</MenuItem>
      <MenuItem onClick={closeMenu}>Status: Refunded</MenuItem>
      <MenuItem onClick={closeMenu}>Status: Canceled</MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem onClick={closeMenu}>
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
          <MDButton variant="gradient" color="info" onClick={newEntity}>
            <Link href={createPath}>new {table.label}</Link>
          </MDButton>
          <MDBox display="flex">
            <MDButton variant={menu ? "contained" : "outlined"} color="dark" onClick={openMenu}>
              filters&nbsp;
              <Icon>keyboard_arrow_down</Icon>
            </MDButton>
            {renderMenu}
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

export default EntityList;
