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
import {DataGridPro, GridCallbackDetails, GridRowParams, MuiEvent} from "@mui/x-data-grid-pro";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Widget, {AddNewRecordButton, HeaderLink, LabelComponent} from "qqq/components/widgets/Widget";
import DataGridUtils from "qqq/utils/DataGridUtils";
import Client from "qqq/utils/qqq/Client";

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
   const [columns, setColumns] = useState([]);
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
         setColumns(columns);
      }
   }, [data]);

   const labelAdditionalComponentsLeft: LabelComponent[] = []
   if(data && data.viewAllLink)
   {
      labelAdditionalComponentsLeft.push(new HeaderLink("View All", data.viewAllLink));
   }

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
         labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
         labelAdditionalComponentsRight={labelAdditionalComponentsRight}
      >
         <DataGridPro
            autoHeight
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
      </Widget>
   );
}

export default RecordGridWidget;
