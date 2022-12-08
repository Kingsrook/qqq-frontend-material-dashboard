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
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {DataGridPro} from "@mui/x-data-grid-pro";
import React, {useEffect, useState} from "react";
import DataGridUtils from "qqq/utils/DataGridUtils";
import Widget, {AddNewRecordButton, HeaderLink, LabelComponent} from "./Widget";

interface Props
{
   title: string;
   data: any;
   reloadWidgetCallback?: (widgetIndex: number, params: string) => void;
}

RecordGridWidget.defaultProps = {};

function RecordGridWidget({title, data, reloadWidgetCallback}: Props): JSX.Element
{
   const [rows, setRows] = useState([]);
   const [columns, setColumns] = useState([]);

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
         const {rows, columnsToRender} = DataGridUtils.makeRows(records, tableMetaData);

         const childTablePath = data.tablePath + (data.tablePath.endsWith("/") ? "" : "/")
         const columns = DataGridUtils.setupGridColumns(tableMetaData, columnsToRender, childTablePath);

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

   return (
      <Widget
         label={title}
         labelAdditionalComponentsLeft={labelAdditionalComponentsLeft}
         labelAdditionalComponentsRight={labelAdditionalComponentsRight}
         reloadWidgetCallback={reloadWidgetCallback}
      >
         <DataGridPro
            autoHeight
            rows={rows}
            disableSelectionOnClick
            columns={columns}
            rowBuffer={10}
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
            // getRowHeight={() => "auto"} // maybe nice?  wraps values in cells...
            // components={{Toolbar: CustomToolbar, Pagination: CustomPagination, LoadingOverlay: Loading}}
            // pinnedColumns={pinnedColumns}
            // onPinnedColumnsChange={handlePinnedColumnsChange}
            // pagination
            // paginationMode="server"
            // sortingMode="server"
            // filterMode="server"
            // page={pageNumber}
            // checkboxSelection
            // rowCount={totalRecords === null ? 0 : totalRecords}
            // onPageSizeChange={handleRowsPerPageChange}
            // onRowClick={handleRowClick}
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
