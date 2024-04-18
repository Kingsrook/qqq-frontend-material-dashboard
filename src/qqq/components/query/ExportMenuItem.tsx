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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import MenuItem from "@mui/material/MenuItem";
import {GridColDef, GridExportMenuItemProps} from "@mui/x-data-grid-pro";
import QContext from "QContext";
import ValueUtils from "qqq/utils/qqq/ValueUtils";
import React, {useContext} from "react";

interface QExportMenuItemProps extends GridExportMenuItemProps<{}>
{
   tableMetaData: QTableMetaData;
   totalRecords: number
   columnsModel: GridColDef[];
   columnVisibilityModel: { [index: string]: boolean };
   queryFilter: QQueryFilter;
   format: string;
}

/*******************************************************************************
 ** Component to serve as an item in the Export menu
 *******************************************************************************/
export default function ExportMenuItem(props: QExportMenuItemProps)
{
   const {format, tableMetaData, totalRecords, columnsModel, columnVisibilityModel, queryFilter, hideMenu} = props;

   const {recordAnalytics} = useContext(QContext);

   return (
      <MenuItem
         disabled={totalRecords === 0}
         onClick={() =>
         {
            recordAnalytics({category: "tableEvents", action: "export", label: tableMetaData.label});

            ///////////////////////////////////////////////////////////////////////////////
            // build the list of visible fields.  note, not doing them in-order (in case //
            // the user did drag & drop), because column order model isn't right yet     //
            // so just doing them to match columns (which were pKey, then sorted)        //
            ///////////////////////////////////////////////////////////////////////////////
            const visibleFields: string[] = [];
            columnsModel.forEach((gridColumn) =>
            {
               const fieldName = gridColumn.field;
               if (columnVisibilityModel[fieldName] !== false)
               {
                  visibleFields.push(fieldName);
               }
            });

            //////////////////////////////////////
            // construct the url for the export //
            //////////////////////////////////////
            const dateString = ValueUtils.formatDateTimeForFileName(new Date());
            const filename = `${tableMetaData.label} Export ${dateString}.${format}`;
            const url = `/data/${tableMetaData.name}/export/${filename}`;

            const encodedFilterJSON = encodeURIComponent(JSON.stringify(queryFilter));

            //////////////////////////////////////////////////////////////////////////////////////
            // open a window (tab) with a little page that says the file is being generated.    //
            // then have that page load the url for the export.                                 //
            // If there's an error, it'll appear in that window.  else, the file will download. //
            //////////////////////////////////////////////////////////////////////////////////////
            const exportWindow = window.open("", "_blank");
            exportWindow.document.write(`<html lang="en">
                  <head>
                     <style>
                        * { font-family: "SF Pro Display","Roboto","Helvetica","Arial",sans-serif; }
                     </style>
                     <title>${filename}</title>
                     <script>
                        setTimeout(() =>
                        {
                           //////////////////////////////////////////////////////////////////////////////////////////////////
                           // need to encode and decode this value, so set it in the form here, instead of literally below //
                           //////////////////////////////////////////////////////////////////////////////////////////////////
                           document.getElementById("filter").value = decodeURIComponent("${encodedFilterJSON}");
                           
                           document.getElementById("exportForm").submit();
                        }, 1);
                     </script>
                  </head>
                  <body>
                     Generating file <u>${filename}</u>${totalRecords ? " with " + totalRecords.toLocaleString() + " record" + (totalRecords == 1 ? "" : "s") : ""}...
                     <form id="exportForm" method="post" action="${url}" >
                        <input type="hidden" name="fields" value="${visibleFields.join(",")}">
                        <input type="hidden" name="filter" id="filter">
                     </form>
                  </body>
               </html>`);

            /*
            // todo - probably better - generate the report in an iframe...
            // only open question is, giving user immediate feedback, and knowing when the stream has started and/or stopped
            // maybe a busy-loop that would check iframe's url (e.g., after posting should change, maybe?)
            const iframe = document.getElementById("exportIFrame");
            const form = iframe.querySelector("form");
            form.action = url;
            form.target = "exportIFrame";
            (iframe.querySelector("#authorizationInput") as HTMLInputElement).value = qController.getAuthorizationHeaderValue();
            form.submit();
            */

            ///////////////////////////////////////////
            // Hide the export menu after the export //
            ///////////////////////////////////////////
            hideMenu?.();
         }}
      >
         Export
         {` ${format.toUpperCase()}`}
      </MenuItem>
   );
}

