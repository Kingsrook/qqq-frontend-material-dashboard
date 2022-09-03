/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import TableCell from "@mui/material/TableCell";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

interface Props
{
   title: string;
   content?: string | number;
   image?: string;
   noBorder?: boolean;
   [key: string]: any;
}

function ShipmentsByWarehouseTableCell ({title, content, image, noBorder, ...rest}: Props): JSX.Element
{
   let template;

   if (image)
   {
      template = (
         <TableCell {...rest} align="left" width="30%" sx={{border: noBorder && 0}}>
            <MDBox display="flex" alignItems="center" width="max-content">
               <MDBox
                  component="img"
                  src={image}
                  alt={content.toString()}
                  width="1.5rem"
                  height="auto"
               />{" "}
               <MDBox display="flex" flexDirection="column" ml={3}>
                  <MDTypography
                     variant="caption"
                     color="text"
                     fontWeight="medium"
                     textTransform="capitalize"
                  >
                     {title}:
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
                     {content}
                  </MDTypography>
               </MDBox>
            </MDBox>
         </TableCell>
      );
   }
   else
   {
      template = (
         <TableCell {...rest} align="center" sx={{border: noBorder && 0}}>
            <MDBox display="flex" flexDirection="column">
               <MDTypography
                  variant="caption"
                  color="text"
                  fontWeight="medium"
                  textTransform="capitalize"
               >
                  {title}:
               </MDTypography>
               <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
                  {content}
               </MDTypography>
            </MDBox>
         </TableCell>
      );
   }

   return template;
}

// Declaring default props for SalesTableCell
ShipmentsByWarehouseTableCell.defaultProps = {
   image: "",
   noBorder: false,
};

export default ShipmentsByWarehouseTableCell;
