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

import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import parse from "html-react-parser";
import React, {useEffect, useState} from "react";
import MDTypography from "qqq/components/legacy/MDTypography";
import DataTableBodyCell from "qqq/components/widgets/tables/cells/DataTableBodyCell";
import DataTableHeadCell from "qqq/components/widgets/tables/cells/DataTableHeadCell";
import DefaultCell from "qqq/components/widgets/tables/cells/DefaultCell";
import DataTable from "qqq/components/widgets/tables/DataTable";
import Client from "qqq/utils/qqq/Client";


//////////////////////////////////////
// structure of expected table data //
//////////////////////////////////////
export interface TableDataInput
{
   columns: { [key: string]: any }[];
   rows: { [key: string]: any }[];
}


/////////////////////////
// inputs and defaults //
/////////////////////////
interface Props
{
   noRowsFoundHTML?: string;
   rowsPerPage?: number;
   hidePaginationDropdown?: boolean;
   fixedStickyLastRow?: boolean;
   fixedHeight?: number;
   data: TableDataInput;
}

const qController = Client.getInstance();
function TableCard({noRowsFoundHTML, data, rowsPerPage, hidePaginationDropdown, fixedStickyLastRow, fixedHeight}: Props): JSX.Element
{
   const [qInstance, setQInstance] = useState(null as QInstance);

   useEffect(() =>
   {
      (async () =>
      {
         const newQInstance = await qController.loadMetaData();
         setQInstance(newQInstance);
      })();
   }, []);

   return (
      <Box py={1} mx={-2}>
         {
            data && data.columns && !noRowsFoundHTML ?
               <DataTable
                  table={data}
                  entriesPerPage={rowsPerPage}
                  hidePaginationDropdown={hidePaginationDropdown}
                  fixedStickyLastRow={fixedStickyLastRow}
                  fixedHeight={fixedHeight}
                  showTotalEntries={false}
                  isSorted={false}
                  noEndBorder
               />
               : noRowsFoundHTML ?
                  <Box p={3} pt={1} pb={1} sx={{textAlign: "center"}}>
                     <MDTypography
                        variant="subtitle2"
                        color="secondary"
                        fontWeight="regular"
                     >
                        {
                           noRowsFoundHTML ? (
                              parse(noRowsFoundHTML)
                           ) : "No rows found"
                        }
                     </MDTypography>
                  </Box>
                  :
                  <TableContainer sx={{boxShadow: "none"}}>
                     <Table>
                        <Box component="thead">
                           <TableRow key="header">
                              {Array(8).fill(0).map((_, i) =>
                                 <DataTableHeadCell key={`head-${i}`} sorted={false} width="auto" align="center">
                                    <Skeleton width="100%" />
                                 </DataTableHeadCell>
                              )}
                           </TableRow>
                        </Box>
                        <TableBody>
                           {Array(5).fill(0).map((_, i) =>
                              <TableRow sx={{verticalAlign: "top"}} key={`row-${i}`}>
                                 {Array(8).fill(0).map((_, j) =>
                                    <DataTableBodyCell key={`cell-${i}-${j}`} align="center">
                                       <DefaultCell><Skeleton /></DefaultCell>
                                    </DataTableBodyCell>
                                 )}
                              </TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </TableContainer>
         }
      </Box>
   );
}

export default TableCard;
