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
import { QTableMetaData } from "qqq-frontend-core/lib/model/metaData/QTableMetaData";
import { QController } from "qqq-frontend-core/lib/controllers/QController";
import { useState } from "react";
import MDButton from "../../../../../components/MDButton";
// import React, { useState } from "react";

const qController = new QController("http://localhost:8000");
console.log(qController);

function CreateForm(): JSX.Element {
  const { tableName } = useParams();
  const [formFields, setFormFields] = useState([] as JSX.Element[]);
  const defaultValues: { [key: string]: string } = {};
  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    formValues[name] = value;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    qController.create(tableName, formValues);
  };

  const tableMetaData = new QTableMetaData(tableName);
  if (formFields.length === 0) {
    (async () => {
      await qController.loadTableMetaData(tableName).then((tableMetaData) => {
        const formFields = [] as JSX.Element[];
        const fields = new Map(Object.entries(tableMetaData.fields));
        fields.forEach((fieldMetaData) => {
          //formValues[fieldMetaData.name] = "";
          formFields.push(
            <Grid item xs={12} sm={4}>
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
        });

        setFormFields(formFields);
      });
    })();
  }

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">Create {tableMetaData.label}</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {formFields}
        </Grid>
        <Grid container spacing={3}>
          <MDBox ml="auto">
            <MDButton type="submit" variant="gradient" color="dark" size="small">
              create {tableMetaData.label}
            </MDButton>
          </MDBox>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default CreateForm;
