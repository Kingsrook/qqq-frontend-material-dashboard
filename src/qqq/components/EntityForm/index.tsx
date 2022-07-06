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

// react imports
import { useParams } from "react-router-dom";
import React, { useReducer, useState } from "react";

// qqq imports
import { QController } from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import { QRecord } from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import { QFieldType } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";
import MDButton from "../../../components/MDButton";

// Declaring props types for EntityForm
interface Props {
  id?: string;
}

function EntityForm({ id }: Props): JSX.Element {
  const qController = new QController("");
  const { tableName } = useParams();

  const [asyncLoadInited, setAsyncLoadInited] = useState(false);
  const [formValues, setFormValues] = useState({} as { [key: string]: string });
  const [formFields, setFormFields] = useState([] as JSX.Element[]);
  const [tableMetaData, setTableMetaData] = useState(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    formValues[name] = value;
    setFormValues(formValues);
  };

  if (!asyncLoadInited) {
    setAsyncLoadInited(true);
    (async () => {
      const tableMetaData = await qController.loadTableMetaData(tableName);
      setTableMetaData(tableMetaData);

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

        tableMetaData.fields.forEach((fieldMetaData, key) => {
          formValues[key] = foundRecord.values.get(key);
        });

        setFormValues(formValues);
      }

      const sortedKeys = [...tableMetaData.fields.keys()].sort();
      sortedKeys.forEach((key) => {
        const fieldMetaData = tableMetaData.fields.get(key);
        if (fieldMetaData.name !== tableMetaData.primaryKeyField) {
          let fieldType: string;
          switch (fieldMetaData.type.toString()) {
            case QFieldType.DECIMAL:
            case QFieldType.INTEGER:
              fieldType = "number";
              break;
            case QFieldType.DATE_TIME:
              fieldType = "datetime-local";
              break;
            case QFieldType.PASSWORD:
            case QFieldType.TIME:
            case QFieldType.DATE:
              fieldType = fieldMetaData.type.toString();
              break;
            case QFieldType.TEXT:
            case QFieldType.HTML:
            case QFieldType.STRING:
            default:
              fieldType = "text";
          }

          formFields.push(
            <Grid item xs={12} sm={4} key={fieldMetaData.name}>
              <FormField
                id={fieldMetaData.name}
                key={fieldMetaData.name}
                name={fieldMetaData.name}
                label={fieldMetaData.label}
                type={fieldType}
                defaultValue={formValues[fieldMetaData.name]}
                onChange={handleInputChange}
              />
            </Grid>
          );
        }
      });

      setFormFields(formFields);
      forceUpdate();
    })();
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    (async () => {
      if (id !== null) {
        await qController.update(tableName, id, formValues).then((record) => {
          window.location.href = `/${tableName}/view/${record.values.get("id")}`; // todo - primaryKeyField
        });
      } else {
        await qController.create(tableName, formValues).then((record) => {
          window.location.href = `/${tableName}/view/${record.values.get("id")}`; // todo - primaryKeyField
        });
      }
    })();
  };

  const pageTitle =
    id != null ? `Edit ${tableMetaData?.label} (${id})` : `Create New ${tableMetaData?.label}`;

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">{pageTitle}</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3} onSubmit={handleSubmit}>
        <Grid key="fieldsGrid" container spacing={3}>
          {formFields}
        </Grid>
      </MDBox>
      <MDBox p={3}>
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
