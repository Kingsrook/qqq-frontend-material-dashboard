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

/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable react/no-array-index-key */

import { useParams } from "react-router-dom";

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Settings page components

// qqq imports
import { QControllerV3 } from "@kingsrook/qqq-frontend-core/lib/controllers/QControllerV2";
import { QRecord } from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import React, { useState } from "react";

import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import { QTableMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import MDButton from "../../../../../components/MDButton";

const qController = new QControllerV3("");
console.log(qController);

// Declaring props types for ViewForm
interface Props {
  id: string;
}

function ViewContents({ id }: Props): JSX.Element {
  const { tableName } = useParams();
  const [nameValues, setNameValues] = useState([] as JSX.Element[]);
  const [loadCounter, setLoadCounter] = useState(0);
  const [open, setOpen] = useState(false);
  const [tableMetaData, setTableMetaData] = useState(null);
  const [record, setRecord] = useState(null);

  const handleConfirmDelete = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    (async () => {
      await qController.delete(tableName, id).then((results) => {
        window.location.href = `/${tableName}/list/`;
      });
    })();
  };

  if (loadCounter === 0) {
    setLoadCounter(1);

    (async () => {
      const tableMetaData = await qController.loadTableMetaData(tableName);
      console.log("@dk: table meta data");
      console.log(tableMetaData);
      setTableMetaData(tableMetaData);

      // make a call to query (just get all for now, and iterate and filter like a caveman)
      const records = await qController.query(tableName, 250);
      let foundRecord: QRecord;
      records.forEach((innerRecord) => {
        const fieldKeys = [...innerRecord.values.keys()];
        fieldKeys.forEach((key) => {
          const value = innerRecord.values.get(key);
          if (key === tableMetaData.primaryKeyField && `${value}` === `${id}`) {
            foundRecord = innerRecord;
            setRecord(innerRecord);
          }
        });
      });

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

      setLoadCounter(2);
    })();
  }

  const handleConfirmDeleteOpen = () => {
    // setOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    // setOpen(false);
  };

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
          <MDBox ml="auto" mr={5}>
            <MDButton
              type="submit"
              variant="gradient"
              color="primary"
              size="small"
              onClick={handleConfirmDelete}
            >
              delete {tableMetaData?.label}
            </MDButton>
            <Dialog
              open={open}
              onClose={handleConfirmDeleteClose}
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
                <Button onClick={handleConfirmDeleteClose}>No</Button>
                <Button onClick={handleConfirmDelete} autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
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
