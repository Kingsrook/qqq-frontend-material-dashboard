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
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QJobComplete} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobComplete";
import {QJobError} from "@kingsrook/qqq-frontend-core/lib/model/processes/QJobError";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {TablePagination} from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import {DataGridPro} from "@mui/x-data-grid-pro";
import FormData from "form-data";
import React, {useEffect, useState} from "react";
import DataGridUtils from "qqq/utils/DataGridUtils";
import Client from "qqq/utils/qqq/Client";

interface Props
{
   tableMetaData: QTableMetaData;
   fieldMetaData: QFieldMetaData;
   filter: QQueryFilter;
}

ColumnStats.defaultProps = {
};

const qController = Client.getInstance();

function ColumnStats({tableMetaData, fieldMetaData, filter}: Props): JSX.Element
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
         const formData = new FormData();
         formData.append("tableName", tableMetaData.name);
         formData.append("fieldName", fieldMetaData.name);
         formData.append("filterJSON", JSON.stringify(filter));
         const processResult = await qController.processRun("tableStats", formData);

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
            for(let i = 0; i < result.values.valueCounts.length; i++)
            {
               valueCounts.push(new QRecord(result.values.valueCounts[i]));
            }
            setValueCounts(valueCounts);

            const fakeTableMetaData = new QTableMetaData({primaryKeyField: fieldMetaData.name});
            fakeTableMetaData.fields = new Map<string, QFieldMetaData>();
            fakeTableMetaData.fields.set(fieldMetaData.name, fieldMetaData);
            fakeTableMetaData.fields.set("count", new QFieldMetaData({name: "count", label: "Count", type: "INTEGER"}));
            fakeTableMetaData.sections = [] as QTableSection[];
            fakeTableMetaData.sections.push(new QTableSection({fieldNames: [fieldMetaData.name, "count"]}));

            const {rows, columnsToRender} = DataGridUtils.makeRows(valueCounts, fakeTableMetaData);
            const columns = DataGridUtils.setupGridColumns(fakeTableMetaData, columnsToRender);

            columns[1].sortComparator = (v1, v2): number =>
            {
               const n1 = parseInt(v1.replaceAll(",", ""));
               const n2 = parseInt(v2.replaceAll(",", ""));
               return (n1 - n2);
            }

            setRows(rows);
            setColumns(columns);

            setIsLoaded(true);
         }
      })();
   }, []);

   // @ts-ignore
   const defaultLabelDisplayedRows = ({from, to, count}) =>
   {
      // todo - not done
      return ("Showing stuff");
   };

   function CustomPagination()
   {
      return (
         <TablePagination
            component="div"
            page={1}
            count={1}
            rowsPerPage={1000}
            onPageChange={null}
            labelDisplayedRows={defaultLabelDisplayedRows}
         />
      );
   }

   function Loading()
   {
      return (
         <LinearProgress color="info" />
      );
   }

   return (
      <Box>
         <Box p={3} display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h5" pb={3}>
               Column Statistics for {tableMetaData.label}: {fieldMetaData.label}
               <Typography fontSize={14}>
                  {statusString}
               </Typography>
            </Typography>
         </Box>
         <Box px={3} fontSize="1rem">
            <div>
               <div className="fieldLabel">Distinct Values: </div> <div className="fieldValue">{Number(countDistinct).toLocaleString()}</div>
            </div>
         </Box>

         <Box sx={{overflow: "auto", height: "calc( 100vh - 19rem )", position: "relative"}} px={3}>
            <DataGridPro
               components={{LoadingOverlay: Loading, Pagination: CustomPagination}}
               rows={rows}
               disableSelectionOnClick
               columns={columns}
               loading={!isLoaded}
               rowBuffer={10}
               getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
               initialState={{
                  sorting: {
                     sortModel: [
                        {
                           field: "count",
                           sort: "desc",
                        },
                     ],
                  },
               }}
            />
         </Box>
      </Box>);
}

export default ColumnStats;
