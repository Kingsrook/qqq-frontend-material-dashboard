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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {useMemo} from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import ShipmentsByWarehouseTableCell from "qqq/pages/dashboards/Tables/ShipmentsByWarehouseTableCell";

interface Props
{
   title?: string;
   rows?: {
      [key: string]: string | number | (string | number)[];
   }[];
   shadow?: boolean;
}

function ShipmentsByWarehouseTable({title, rows, shadow}: Props): JSX.Element
{
   const renderTableCells = rows.map(
      (row: { [key: string]: string | number | (string | number)[] }, key: any) =>
      {
         const tableRows: any = [];
         const rowKey = `row-${key}`;

         Object.entries(row).map(([cellTitle, cellContent]: any) =>
            Array.isArray(cellContent)
               ? tableRows.push(
                  <ShipmentsByWarehouseTableCell
                     key={cellContent[1]}
                     title={cellTitle}
                     content={cellContent[1]}
                     image={cellContent[0]}
                     noBorder={key === rows.length - 1}
                  />
               )
               : tableRows.push(
                  <ShipmentsByWarehouseTableCell
                     key={cellContent}
                     title={cellTitle}
                     content={cellContent}
                     noBorder={key === rows.length - 1}
                  />
               )
         );

         return <TableRow key={rowKey}>{tableRows}</TableRow>;
      }
   );

   return (
      <TableContainer sx={{height: "100%", boxShadow: !shadow && "none"}}>
         <Table>
            {title ? (
               <TableHead>
                  <MDBox component="tr" width="max-content" display="block" mb={1.5}>
                     <MDTypography variant="h6" component="td">
                        {title}
                     </MDTypography>
                  </MDBox>
               </TableHead>
            ) : null}
            <TableBody>{useMemo(() => renderTableCells, [rows])}</TableBody>
         </Table>
      </TableContainer>
   );
}

ShipmentsByWarehouseTable.defaultProps = {
   title: "",
   rows: [{}],
   shadow: true,
};

export default ShipmentsByWarehouseTable;
