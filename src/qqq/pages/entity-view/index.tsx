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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Settings page components
// import CreateForm from "qqq/pages/entity-create/components/CreateForm";
import BaseLayout from "qqq/components/BaseLayout";
import ViewContents from "./components/ViewContents";

function EntityView(): JSX.Element {
  const { id } = useParams();

  return (
    <BaseLayout>
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ViewContents id={id} />
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </BaseLayout>
  );
}

export default EntityView;
