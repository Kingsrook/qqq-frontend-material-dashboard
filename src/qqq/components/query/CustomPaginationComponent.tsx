/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2024.  Kingsrook, LLC
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

import {Capability} from "@kingsrook/qqq-frontend-core/lib/model/metaData/Capability";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {TablePagination} from "@mui/material";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import {GridRowsProp} from "@mui/x-data-grid-pro";
import React from "react";
import CustomWidthTooltip from "qqq/components/tooltips/CustomWidthTooltip";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface CustomPaginationProps
{
   tableMetaData: QTableMetaData;
   rows: GridRowsProp[];
   totalRecords: number;
   distinctRecords: number;
   pageNumber: number;
   rowsPerPage: number;
   loading: boolean;
   isJoinMany: boolean;
   handlePageChange: (value: number) => void;
   handleRowsPerPageChange: (value: number) => void;
}

/*******************************************************************************
 ** DataGrid custom component - for pagination!
 *******************************************************************************/
export default function CustomPaginationComponent({tableMetaData, rows, totalRecords, distinctRecords, pageNumber, rowsPerPage, loading, isJoinMany, handlePageChange, handleRowsPerPageChange}: CustomPaginationProps): JSX.Element
{
   // @ts-ignore
   const defaultLabelDisplayedRows = ({from, to, count}) =>
   {
      const tooltipHTML = <>
         The number of rows shown on this screen may be greater than the number of {tableMetaData?.label} records
         that match your query, because you have included fields from other tables which may have
         more than one record associated with each {tableMetaData?.label}.
      </>
      let distinctPart = isJoinMany ? (<Box display="inline" component="span" textAlign="right">
         &nbsp;({ValueUtils.safeToLocaleString(distinctRecords)} distinct<CustomWidthTooltip title={tooltipHTML}>
            <IconButton sx={{p: 0, pl: 0.25, mb: 0.25}}><Icon fontSize="small" sx={{fontSize: "1.125rem !important", color: "#9f9f9f"}}>info_outlined</Icon></IconButton>
         </CustomWidthTooltip>
         )
      </Box>) : <></>;

      if (tableMetaData && !tableMetaData.capabilities.has(Capability.TABLE_COUNT))
      {
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // to avoid a non-countable table showing (this is what data-grid did) 91-100 even if there were only 95 records, //
         // we'll do this... not quite good enough, but better than the original                                           //
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if (rows.length > 0 && rows.length < to - from)
         {
            to = from + rows.length;
         }
         return (`Showing ${from.toLocaleString()} to ${to.toLocaleString()}`);
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // treat -1 as the sentinel that it's set as below -- remember, we did that so that 'to' would have a value in here when there's no count. //
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (count !== null && count !== undefined && count !== -1)
      {
         if (count === 0)
         {
            return (loading ? "Counting..." : "No rows");
         }

         return <span>
            Showing {from.toLocaleString()} to {to.toLocaleString()} of
            {
               count == -1 ?
                  <>more than {to.toLocaleString()}</>
                  : <> {count.toLocaleString()}{distinctPart}</>
            }
         </span>;
      }
      else
      {
         return ("Counting...");
      }
   };


   return (
      <TablePagination
         component="div"
         sx={{minWidth: "450px"}}
         // note - passing null here makes the 'to' param in the defaultLabelDisplayedRows also be null,
         // so pass a sentinel value of -1...
         count={totalRecords === null || totalRecords === undefined ? -1 : totalRecords}
         page={pageNumber}
         rowsPerPageOptions={[10, 25, 50, 100, 250]}
         rowsPerPage={rowsPerPage}
         onPageChange={(event, value) => handlePageChange(value)}
         onRowsPerPageChange={(event) => handleRowsPerPageChange(Number(event.target.value))}
         labelDisplayedRows={defaultLabelDisplayedRows}
      />
   );

}
