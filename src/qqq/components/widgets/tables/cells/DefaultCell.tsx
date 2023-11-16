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

import {ReactNode} from "react";
import colors from "qqq/assets/theme/base/colors";
import MDTypography from "qqq/components/legacy/MDTypography";

function DefaultCell({children}: { children: ReactNode }): JSX.Element
{
   return (
      <MDTypography variant="button" color={colors.dark.main} sx={{
         fontWeight: 600,
         "@media (min-width: 1440px)": {
            fontSize: "1rem"
         },
         "@media (max-width: 1440px)": {
            fontSize: "0.875rem"
         },
         "& a": {
            color: colors.blueGray.main
         }
      }}>
         {children}
      </MDTypography>
   );
}

export default DefaultCell;
