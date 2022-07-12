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
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Link from "@mui/material/Link";

// Declaring props types for IdCell
interface Props {
  id: string;
  checked?: boolean;
}

function IdCell({ id, checked }: Props): JSX.Element
{
   const pathParts = window.location.pathname.split("/");
   const tableName = pathParts[1];
   const href = `/${tableName}/${id}`;
   const link = <Link href={href}>{id}</Link>;

   return (
      <MDBox display="flex" alignItems="center">
         <Checkbox defaultChecked={checked} />
         <MDBox ml={1}>
            <MDTypography variant="caption" fontWeight="medium" color="text">
               {link}
            </MDTypography>
         </MDBox>
      </MDBox>
   );
}

// Declaring default props for IdCell
IdCell.defaultProps = {
   checked: false,
};

export default IdCell;
