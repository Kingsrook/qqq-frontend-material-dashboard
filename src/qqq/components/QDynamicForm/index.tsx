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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import FormField from "layouts/pages/users/new-user/components/FormField";
import { QFrontendStepMetaData } from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";

interface Props {
  formLabel?: string;
  formData: any;
  primaryKeyId?: string;
}

function QDynamicForm(props: Props): JSX.Element {
  const { formData, formLabel, primaryKeyId } = props;
  const { formFields, values, errors, touched } = formData;

  /*
        const {
          firstName: firstNameV,
          lastName: lastNameV,
          company: companyV,
          email: emailV,
          password: passwordV,
          repeatPassword: repeatPasswordV,
        } = values;
        */

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">{formLabel}</MDTypography>
        {/* TODO - help text
        <MDTypography variant="button" color="text">
          Mandatory information
        </MDTypography>
        */}
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          {formFields &&
            Object.keys(formFields).length > 0 &&
            Object.keys(formFields).map((fieldName: any) => {
              const field = formFields[fieldName];
              if (primaryKeyId && fieldName === primaryKeyId) {
                return null;
              }
              if (values[fieldName] === undefined) {
                values[fieldName] = "";
              }
              return (
                <Grid item xs={12} sm={6} key={fieldName}>
                  <FormField
                    required={field.isRequired}
                    type={field.type}
                    label={field.label}
                    name={fieldName}
                    value={values[fieldName]}
                    error={errors[fieldName] && touched[fieldName]}
                  />
                </Grid>
              );
            })}
        </Grid>
        {/*
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={firstName.type}
              label={firstName.label}
              name={firstName.name}
              value={firstNameV}
              placeholder={firstName.placeholder}
              error={errors.firstName && touched.firstName}
              success={firstNameV.length > 0 && !errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={lastName.type}
              label={lastName.label}
              name={lastName.name}
              value={lastNameV}
              placeholder={lastName.placeholder}
              error={errors.lastName && touched.lastName}
              success={lastNameV.length > 0 && !errors.lastName}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={company.type}
              label={company.label}
              name={company.name}
              value={companyV}
              placeholder={company.placeholder}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={email.type}
              label={email.label}
              name={email.name}
              value={emailV}
              placeholder={email.placeholder}
              error={errors.email && touched.email}
              success={emailV.length > 0 && !errors.email}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={password.type}
              label={password.label}
              name={password.name}
              value={passwordV}
              placeholder={password.placeholder}
              error={errors.password && touched.password}
              success={passwordV.length > 0 && !errors.password}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={repeatPassword.type}
              label={repeatPassword.label}
              name={repeatPassword.name}
              value={repeatPasswordV}
              placeholder={repeatPassword.placeholder}
              error={errors.repeatPassword && touched.repeatPassword}
              success={repeatPasswordV.length > 0 && !errors.repeatPassword}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
        </Grid>
        */}
      </MDBox>
    </MDBox>
  );
}

QDynamicForm.defaultProps = {
  formLabel: undefined,
  primaryKeyId: undefined,
};

export default QDynamicForm;
