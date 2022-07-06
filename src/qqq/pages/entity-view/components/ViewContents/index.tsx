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

import { useParams } from "react-router-dom";

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Settings page components

// qqq imports
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import { QRecord } from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import React, { useReducer, useState } from "react";

import MDButton from "../../../../../components/MDButton";

const qController = new QController("");

// Declaring props types for ViewForm
interface Props {
  id: string;
}

function ViewContents({ id }: Props): JSX.Element {
  const { tableName } = useParams();

  const [asyncLoadInited, setAsyncLoadInited] = useState(false);
  const [nameValues, setNameValues] = useState([] as JSX.Element[]);
  const [open, setOpen] = useState(false);
  const [tableMetaData, setTableMetaData] = useState(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  if (!asyncLoadInited) {
    setAsyncLoadInited(true);

    (async () => {
      const tableMetaData = await qController.loadTableMetaData(tableName);
      setTableMetaData(tableMetaData);

      const foundRecord = await qController.get(tableName, id);

      nameValues.push(
        <MDBox key={tableMetaData.primaryKeyField} display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            {tableMetaData.primaryKeyField}: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            &nbsp;{id}
          </MDTypography>
        </MDBox>
      );

      const sortedKeys = [...foundRecord.values.keys()].sort();
      sortedKeys.forEach((key) => {
        if (key !== tableMetaData.primaryKeyField) {
          nameValues.push(
            <MDBox key={key} display="flex" py={1} pr={2}>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {tableMetaData.fields.get(key).label}: &nbsp;
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{foundRecord.values.get(key)}
              </MDTypography>
            </MDBox>
          );
        }
      });

      setNameValues(nameValues);
      forceUpdate();
    })();
  }

  const handleClickConfirmOpen = () => {
    setOpen(true);
  };

  const handleClickConfirmClose = () => {
    setOpen(false);
  };

  /*
  const handleDelete = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    /*
    (async () => {
      await qController.delete(tableName, id).then(() => {
        window.location.href = `/${tableName}/list/`;
      });
    })();

  };
     */

  const editPath = `/${tableName}/edit/${id}`;

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">
          Viewing {tableMetaData?.label} ({id})
        </MDTypography>
      </MDBox>
      <MDBox p={3}>{nameValues}</MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid key="tres" container spacing={3}>
          <MDBox ml="auto" mr={3}>
            <MDButton
              type="submit"
              variant="gradient"
              color="primary"
              size="small"
              onClick={handleClickConfirmOpen}
            >
              delete {tableMetaData?.label}
            </MDButton>
            <Dialog
              open={open}
              onClose={handleClickConfirmClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickConfirmClose}>No</Button>
                <Button onClick={handleClickConfirmClose} autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </MDBox>
          <MDBox>
            <MDButton type="submit" variant="gradient" color="dark" size="small">
              <Link href={editPath}>edit {tableMetaData?.label}</Link>
            </MDButton>
          </MDBox>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default ViewContents;
