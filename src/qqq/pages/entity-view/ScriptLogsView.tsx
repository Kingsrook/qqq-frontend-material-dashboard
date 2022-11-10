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

import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import React from "react";
import DataTableBodyCell from "qqq/components/Temporary/DataTable/DataTableBodyCell";
import DataTableHeadCell from "qqq/components/Temporary/DataTable/DataTableHeadCell";
import QValueUtils from "qqq/utils/QValueUtils";

interface Props
{
   logs: any;
}

ScriptLogsView.defaultProps = {
   logs: null,
};

function ScriptLogsView({logs}: Props): JSX.Element
{
   return (
      <TableContainer sx={{boxShadow: "none"}}>
         <Table>
            <Box component="thead">
               <TableRow key="header">
                  <DataTableHeadCell sorted={false}>Timestamp</DataTableHeadCell>
                  <DataTableHeadCell sorted={false} align="right">Run Time (ms)</DataTableHeadCell>
                  <DataTableHeadCell sorted={false}>Had Error?</DataTableHeadCell>
                  <DataTableHeadCell sorted={false}>Input</DataTableHeadCell>
                  <DataTableHeadCell sorted={false}>Output</DataTableHeadCell>
                  <DataTableHeadCell sorted={false}>Logs</DataTableHeadCell>
               </TableRow>
            </Box>
            <TableBody>
               {
                  logs.map((logRecord: any) =>
                  {
                     let logs = "";
                     if (logRecord.values.scriptLogLine)
                     {
                        for (let i = 0; i < logRecord.values.scriptLogLine.length; i++)
                        {
                           console.log(" += " + i);
                           logs += (logRecord.values.scriptLogLine[i].values.text + "\n");
                        }
                     }

                     return (
                        <TableRow key={logRecord.values.id}>
                           <DataTableBodyCell>{QValueUtils.formatDateTime(logRecord.values.startTimestamp)}</DataTableBodyCell>
                           <DataTableBodyCell align="right">{logRecord.values.runTimeMillis?.toLocaleString()}</DataTableBodyCell>
                           <DataTableBodyCell>
                              <div style={{color: logRecord.values.hadError ? "red" : "auto"}}>{QValueUtils.formatBoolean(logRecord.values.hadError)}</div>
                           </DataTableBodyCell>
                           <DataTableBodyCell>{logRecord.values.input}</DataTableBodyCell>
                           <DataTableBodyCell>
                              {logRecord.values.output}
                              {logRecord.values.error}
                           </DataTableBodyCell>
                           <DataTableBodyCell>{logs}</DataTableBodyCell>
                        </TableRow>
                     );
                  })
               }
            </TableBody>
         </Table>
      </TableContainer>
   );
}

export default ScriptLogsView;


