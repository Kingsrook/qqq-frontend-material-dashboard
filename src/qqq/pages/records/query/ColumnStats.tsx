/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2023.  Kingsrook, LLC
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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {DataGridPro} from "@mui/x-data-grid-pro";
import {columnsStateInitializer} from "@mui/x-data-grid/internals";
import React, {useEffect, useState} from "react";
import DataGridUtils from "qqq/utils/DataGridUtils";
import Client from "qqq/utils/qqq/Client";

interface Props
{
   tableMetaData: QTableMetaData;
   fieldMetaData: QFieldMetaData;
   closeModalHandler?: (event: object, reason: string) => void;
}

ColumnStats.defaultProps = {
   closeModalHandler: null,
};

const qController = Client.getInstance();

function ColumnStats({tableMetaData, fieldMetaData, closeModalHandler}: Props): JSX.Element
{
   const [statusString, setStatusString] = useState("Calculating statistics...");
   const [isLoaded, setIsLoaded] = useState(false);
   const [valueCounts, setValueCounts] = useState(null as QRecord[]);
   const [countDistinct, setCountDistinct] = useState(null as number);
   const [rows, setRows] = useState([]);
   const [columns, setColumns] = useState([]);

   useEffect(() =>
   {
      (async () =>
      {
         const processResult = await qController.processRun("tableStats", `tableName=${tableMetaData.name}&fieldName=${fieldMetaData.name}`);
         setStatusString(null)
         if (processResult instanceof QJobError)
         {
            const jobError = processResult as QJobError;
            // todo setErrorAlert();
            console.error("Error fetching column stats" + jobError.error);
         }
         else
         {
            const result = processResult as QJobComplete;
            setCountDistinct(result.values.countDistinct);

            const valueCounts = [] as QRecord[];
            result.values.valueCounts.forEach((object: any) =>
            {
               valueCounts.push(new QRecord(object));
            })
            setValueCounts(valueCounts);

            const fakeTableMetaData = new QTableMetaData({primaryKeyField: "value", fields: {value: fieldMetaData, count: {label: "Count", type: "INTEGER"}}});
            const {rows, columnsToRender} = DataGridUtils.makeRows(valueCounts, fakeTableMetaData);
            const columns = DataGridUtils.setupGridColumns(fakeTableMetaData, columnsToRender);
            setRows(rows);
            setColumns(columns);

            setIsLoaded(true);
         }
      })();
   }, []);

   return (
      <Box>
         <Box p={3} display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h5" pb={3}>
               Column Statistics for {tableMetaData.label} : {fieldMetaData.label}
               <Typography fontSize={14}>
                  {statusString}
               </Typography>
            </Typography>
         </Box>
         {
            isLoaded && <>
               <Box sx={{overflow: "auto", height: "calc( 100vh - 19rem )", position: "relative"}} px={3}>
                  <b>Distinct Values: </b> {countDistinct.toLocaleString()}

                  <DataGridPro
                     autoHeight
                     rows={rows}
                     disableSelectionOnClick
                     columns={columns}
                     rowBuffer={10}
                     getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
                  />
               </Box>
            </>
         }
      </Box>);
}

export default ColumnStats;
