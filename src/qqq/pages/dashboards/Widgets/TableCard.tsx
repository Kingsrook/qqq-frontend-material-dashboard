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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import parse from "html-react-parser";
import React, {useEffect, useState} from "react";
import DataTable from "qqq/components/Temporary/DataTable";
import DataTableBodyCell from "qqq/components/Temporary/DataTable/DataTableBodyCell";
import DataTableHeadCell from "qqq/components/Temporary/DataTable/DataTableHeadCell";
import DefaultCell from "qqq/components/Temporary/DefaultCell";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import QClient from "qqq/utils/QClient";


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
   title: string;
   linkText?: string;
   linkURL?: string;
   noRowsFoundHTML?: string;
   data: TableDataInput;
   reloadWidgetCallback?: (params: string) => void;
   widgetIndex?: number;
   isChild?: boolean;

   [key: string]: any;
}

const qController = QClient.getInstance();
function TableCard({noRowsFoundHTML, data, reloadWidgetCallback}: Props): JSX.Element
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
      <MDBox py={1}>
         {
            data && data.columns && !noRowsFoundHTML ?
               <DataTable
                  table={data}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  isSorted={false}
                  noEndBorder
               />
               : noRowsFoundHTML ?
                  <MDBox p={3} pt={1} pb={1} sx={{textAlign: "center"}}>
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
                  </MDBox>
                  :
                  <TableContainer sx={{boxShadow: "none"}}>
                     <Table>
                        <MDBox component="thead">
                           <TableRow key="header">
                              {Array(8).fill(0).map((_, i) =>
                                 <DataTableHeadCell key={`head-${i}`} sorted={false} width="auto" align="center">
                                    <Skeleton width="100%" />
                                 </DataTableHeadCell>
                              )}
                           </TableRow>
                        </MDBox>
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
      </MDBox>
   );
}

export default TableCard;
