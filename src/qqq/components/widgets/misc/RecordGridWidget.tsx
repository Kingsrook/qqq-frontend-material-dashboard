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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Typography from "@mui/material/Typography";
import {DataGridPro, GridCallbackDetails, GridRowParams, MuiEvent} from "@mui/x-data-grid-pro";
import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import Widget, {AddNewRecordButton, LabelComponent} from "qqq/components/widgets/Widget";
import DataGridUtils from "qqq/utils/DataGridUtils";
import HtmlUtils from "qqq/utils/HtmlUtils";
import Client from "qqq/utils/qqq/Client";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface Props
{
   widgetMetaData: QWidgetMetaData;
   data: any;
}

RecordGridWidget.defaultProps = {};

const qController = Client.getInstance();

function RecordGridWidget({widgetMetaData, data}: Props): JSX.Element
{
   const [rows, setRows] = useState([]);
   const [records, setRecords] = useState([] as QRecord[])
   const [columns, setColumns] = useState([]);
   const [allColumns, setAllColumns] = useState([])
   const [csv, setCsv] = useState(null as string);
   const [fileName, setFileName] = useState(null as string);
   const navigate = useNavigate();

   useEffect(() =>
   {
      if (data && data.childTableMetaData && data.queryOutput)
      {
         const records: QRecord[] = [];
         const queryOutputRecords = data.queryOutput.records;
         if (queryOutputRecords)
         {
            for (let i = 0; i < queryOutputRecords.length; i++)
            {
               records.push(new QRecord(queryOutputRecords[i]));
            }
         }

         const tableMetaData = new QTableMetaData(data.childTableMetaData);
         const rows = DataGridUtils.makeRows(records, tableMetaData);

         /////////////////////////////////////////////////////////////////////////////////
         // note - tablePath may be null, if the user doesn't have access to the table. //
         /////////////////////////////////////////////////////////////////////////////////
         const childTablePath = data.tablePath ? data.tablePath + (data.tablePath.endsWith("/") ? "" : "/") : data.tablePath;
         const columns = DataGridUtils.setupGridColumns(tableMetaData, childTablePath, null, "bySection");

         /////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // capture all-columns to use for the export (before we might splice some away from the on-screen display) //
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////
         const allColumns = [... columns];
         setAllColumns(JSON.parse(JSON.stringify(columns)));

         ////////////////////////////////////////////////////////////////
         // do not not show the foreign-key column of the parent table //
         ////////////////////////////////////////////////////////////////
         if(data.defaultValuesForNewChildRecords)
         {
            for (let i = 0; i < columns.length; i++)
            {
               if(data.defaultValuesForNewChildRecords[columns[i].field])
               {
                  columns.splice(i, 1);
                  i--
               }
            }
         }

         setRows(rows);
         setRecords(records)
         setColumns(columns);

         let csv = "";
         for (let i = 0; i < allColumns.length; i++)
         {
            csv += `${i > 0 ? "," : ""}"${ValueUtils.cleanForCsv(allColumns[i].headerName)}"`
         }
         csv += "\n";

         for (let i = 0; i < records.length; i++)
         {
            for (let j = 0; j < allColumns.length; j++)
            {
               const value = records[i].displayValues.get(allColumns[j].field) ?? records[i].values.get(allColumns[j].field)
               csv += `${j > 0 ? "," : ""}"${ValueUtils.cleanForCsv(value)}"`
            }
            csv += "\n";
         }

         const fileName = (data?.label ?? widgetMetaData.label) + " " + ValueUtils.formatDateTimeForFileName(new Date()) + ".csv";

         setCsv(csv);
         setFileName(fileName);
      }
   }, [data]);

   ///////////////////
   // view all link //
   ///////////////////
   const labelAdditionalElementsLeft: JSX.Element[] = [];
   if(data && data.viewAllLink)
   {
      labelAdditionalElementsLeft.push(
         <Typography variant="body2" p={2} display="inline" fontSize=".875rem" pt="0" position="relative">
            <Link to={data.viewAllLink}>View All</Link>
         </Typography>
      )
   }

   ///////////////////
   // export button //
   ///////////////////
   let isExportDisabled = true;
   let tooltipTitle = "Export";
   if (data && data.childTableMetaData && data.queryOutput && data.queryOutput.records && data.queryOutput.records.length > 0)
   {
      isExportDisabled = false;

      if(data.totalRows && data.queryOutput.records.length < data.totalRows)
      {
         tooltipTitle = "Export these " + data.queryOutput.records.length + " records."
         if(data.viewAllLink)
         {
            tooltipTitle += "\nClick View All to export all records.";
         }
      }
   }

   const onExportClick = () =>
   {
      if(csv)
      {
         HtmlUtils.download(fileName, csv);
      }
      else
      {
         alert("There is no data available to export.")
      }
   }

   if(widgetMetaData?.showExportButton)
   {
      labelAdditionalElementsLeft.push(
         <Typography key={1} variant="body2" py={2} px={0} display="inline" position="relative">
            <Tooltip title={tooltipTitle}><Button sx={{px: 1, py: 0, minWidth: "initial"}} onClick={onExportClick} disabled={isExportDisabled}><Icon sx={{color: "#757575", fontSize: 1.25}}>save_alt</Icon></Button></Tooltip>
         </Typography>
      );
   }

   ////////////////////
   // add new button //
   ////////////////////
   const labelAdditionalComponentsRight: LabelComponent[] = []
   if(data && data.canAddChildRecord)
   {
      let disabledFields = data.disabledFieldsForNewChildRecords;
      if(!disabledFields)
      {
         disabledFields = data.defaultValuesForNewChildRecords;
      }
      labelAdditionalComponentsRight.push(new AddNewRecordButton(data.childTableMetaData, data.defaultValuesForNewChildRecords, "Add new", disabledFields))
   }


   const handleRowClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) =>
   {
      (async () =>
      {
         const qInstance = await qController.loadMetaData()
         const tablePath = qInstance.getTablePathByName(data.childTableMetaData.name)
         if(tablePath)
         {
            navigate(`${tablePath}/${params.id}`);
         }
      })();
   };


   return (
      <Widget
         widgetMetaData={widgetMetaData}
         widgetData={data}
         labelAdditionalElementsLeft={labelAdditionalElementsLeft}
         labelAdditionalComponentsRight={labelAdditionalComponentsRight}
         labelBoxAdditionalSx={{position: "relative", top: "-0.375rem"}}
      >
         <Box mx={-2} mb={-3}>
            <DataGridPro
               autoHeight
               sx={{
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: "none"
               }}
               rows={rows}
               disableSelectionOnClick
               columns={columns}
               rowBuffer={10}
               getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
               onRowClick={handleRowClick}
               // getRowHeight={() => "auto"} // maybe nice?  wraps values in cells...
               // components={{Toolbar: CustomToolbar, Pagination: CustomPagination, LoadingOverlay: Loading}}
               // pinnedColumns={pinnedColumns}
               // onPinnedColumnsChange={handlePinnedColumnsChange}
               // pagination
               // paginationMode="server"
               // rowsPerPageOptions={[20]}
               // sortingMode="server"
               // filterMode="server"
               // page={pageNumber}
               // checkboxSelection
               rowCount={data && data.totalRows}
               // onPageSizeChange={handleRowsPerPageChange}
               // onStateChange={handleStateChange}
               // density={density}
               // loading={loading}
               // filterModel={filterModel}
               // onFilterModelChange={handleFilterChange}
               // columnVisibilityModel={columnVisibilityModel}
               // onColumnVisibilityModelChange={handleColumnVisibilityChange}
               // onColumnOrderChange={handleColumnOrderChange}
               // onSelectionModelChange={selectionChanged}
               // onSortModelChange={handleSortChange}
               // sortingOrder={[ "asc", "desc" ]}
               // sortModel={columnSortModel}
            />
         </Box>
      </Widget>
   );
}

export default RecordGridWidget;
