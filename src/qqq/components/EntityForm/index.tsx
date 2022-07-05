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

import { useParams } from "react-router-dom";

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Settings page components
import FormField from "layouts/pages/account/components/FormField";

// qqq imports
import { QTableMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import { QControllerV3 } from "@kingsrook/qqq-frontend-core/lib/controllers/QControllerV2";
import { QRecord } from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import React, { useState } from "react";
import { QTableRecord } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableRecord";
import MDButton from "../../../components/MDButton";

const qController = new QControllerV3("");

// Declaring props types for EntityForm
interface Props {
  id?: string;
}

function EntityForm({ id }: Props): JSX.Element {
  const { tableName } = useParams();
  const [formFields, setFormFields] = useState([] as JSX.Element[]);
  const defaultValues: { [key: string]: string } = {};
  const [formValues, setFormValues] = useState(defaultValues);
  const [loadCounter, setLoadCounter] = useState(0);
  const [tableMetaData, setTableMetaData] = useState(null);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    console.log("A");
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    formValues[name] = value;
    setFormValues(formValues);
  };

  if (loadCounter === 0) {
    setLoadCounter(1);

    (async () => {
      // await qController.loadTableMetaData(tableName).then((tableMetaData) => {
      const tableMetaData = await qController.loadTableMetaData(tableName);
      setTableMetaData(tableMetaData);
      const formFields = [] as JSX.Element[];

      // make a call to query (just get all for now, and iterate and filter like a caveman)
      if (id !== null) {
        const records = await qController.query(tableName, 250);
        let foundRecord: QRecord;
        records.forEach((innerRecord) => {
          const fieldKeys = [...innerRecord.values.keys()];
          fieldKeys.forEach((key) => {
            const value = innerRecord.values.get(key);
            if (key === tableMetaData.primaryKeyField && `${value}` === `${id}`) {
              foundRecord = innerRecord;
            }
          });
        });

        const sortedKeys = [...tableMetaData.fields.keys()].sort();
        sortedKeys.forEach((key) => {
          formValues[key] = foundRecord.values.get(key);

          const fieldMetaData = tableMetaData.fields.get(key);
          if (fieldMetaData.name !== tableMetaData.primaryKeyField) {
            if (formValues[fieldMetaData.name] == null) {
              formValues[fieldMetaData.name] = "";
            }

            formFields.push(
              <Grid item xs={12} sm={4} key={fieldMetaData.name}>
                <FormField
                  key={fieldMetaData.name}
                  name={fieldMetaData.name}
                  id={fieldMetaData.name}
                  label={fieldMetaData.label}
                  value={formValues[fieldMetaData.name]}
                  onChange={handleInputChange}
                />
              </Grid>
            );
          }
        });

        setLoadCounter(2);
        setFormValues(formValues);
      } else {
        const sortedKeys = [...tableMetaData.fields.keys()].sort();
        sortedKeys.forEach((key) => {
          const fieldMetaData = tableMetaData.fields.get(key);
          if (fieldMetaData.name !== tableMetaData.primaryKeyField) {
            formFields.push(
              <Grid item xs={12} sm={4} key={fieldMetaData.name}>
                <FormField
                  key={fieldMetaData.name}
                  name={fieldMetaData.name}
                  id={fieldMetaData.name}
                  label={fieldMetaData.label}
                  value={formValues[fieldMetaData.name]}
                  onChange={handleInputChange}
                />
              </Grid>
            );
          }
        });
      }

      setFormFields(formFields);
    })();
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    (async () => {
      await qController.create(tableName, formValues).then((record) => {
        window.location.href = `/${tableName}/view/${record.values.get("id")}`; // todo - primaryKeyField
      });
    })();
  };

  const pageTitle = id != null ? `Edit ${tableMetaData?.label}` : `Create ${tableMetaData?.label}`;

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">{pageTitle}</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3} onSubmit={handleSubmit}>
        <Grid key="fieldsGrid" container spacing={3}>
          {formFields}
        </Grid>
        <Grid key="buttonGrid" container spacing={3}>
          <MDBox ml="auto">
            <MDButton type="submit" variant="gradient" color="dark" size="small">
              save {tableMetaData?.label}
            </MDButton>
          </MDBox>
        </Grid>
      </MDBox>
    </Card>
  );
}

// Declaring default props for DefaultCell
EntityForm.defaultProps = {
  id: null,
};

export default EntityForm;
