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


import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
// @ts-ignore
import {htmlToText} from "html-to-text";
import React, {useEffect, useState} from "react";
import TableCard from "qqq/components/widgets/tables/TableCard";
import Widget, {ExportDataButton, WidgetData} from "qqq/components/widgets/Widget";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface Props
{
   widgetMetaData?: QWidgetMetaData;
   widgetData?: WidgetData;
   reloadWidgetCallback?: (params: string) => void;
   isChild?: boolean;
}

TableWidget.defaultProps = {
   foo: null,
};

function download(filename: string, text: string)
{
   var element = document.createElement("a");
   element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
   element.setAttribute("download", filename);

   element.style.display = "none";
   document.body.appendChild(element);

   element.click();

   document.body.removeChild(element);
}

function TableWidget(props: Props): JSX.Element
{
   const rows = props.widgetData?.rows;
   const columns = props.widgetData?.columns;

   const exportCallback = () =>
   {
      if (props.widgetData && rows && columns)
      {
         console.log(props.widgetData);

         let csv = "";
         for (let j = 0; j < columns.length; j++)
         {
            if (j > 0)
            {
               csv += ",";
            }
            csv += `"${columns[j].header}"`;
         }
         csv += "\n";

         for (let i = 0; i < rows.length; i++)
         {
            for (let j = 0; j < columns.length; j++)
            {
               if (j > 0)
               {
                  csv += ",";
               }

               const cell = rows[i][columns[j].accessor];
               const text = htmlToText(cell,
                  {
                     selectors: [
                        {selector: "a", format: "inline"},
                        {selector: ".MuiIcon-root", format: "skip"},
                        {selector: ".button", format: "skip"}
                     ]
                  });
               csv += `"${text}"`;
            }
            csv += "\n";
         }

         console.log(csv);

         const fileName = props.widgetData.label + "-" + ValueUtils.formatDateTimeISO8601(new Date()) + ".csv";
         download(fileName, csv);
      }
      else
      {
         alert("Error exporting widget data.");
      }
   };


   const [exportDataButton, setExportDataButton] = useState(new ExportDataButton(() => exportCallback(), true));
   const [isExportDisabled, setIsExportDisabled] = useState(true);
   const [componentLeft, setComponentLeft] = useState([exportDataButton])

   useEffect(() =>
   {
      if (props.widgetData && columns && rows && rows.length > 0)
      {
         console.log("Setting export disabled false")
         setIsExportDisabled(false);
      }
      else
      {
         console.log("Setting export disabled true")
         setIsExportDisabled(true);
      }
   }, [props.widgetData])

   useEffect(() =>
   {
      console.log("Setting new export button with disabled=" + isExportDisabled)
      setComponentLeft([new ExportDataButton(() => exportCallback(), isExportDisabled)]);
   }, [isExportDisabled])

   return (
      <Widget
         widgetMetaData={props.widgetMetaData}
         widgetData={props.widgetData}
         reloadWidgetCallback={(data) => props.reloadWidgetCallback(data)}
         footerHTML={props.widgetData?.footerHTML}
         isChild={props.isChild}
         labelAdditionalComponentsLeft={componentLeft}
      >
         <TableCard
            noRowsFoundHTML={props.widgetData?.noRowsFoundHTML}
            rowsPerPage={props.widgetData?.rowsPerPage}
            hidePaginationDropdown={props.widgetData?.hidePaginationDropdown}
            data={{columns: props.widgetData?.columns, rows: props.widgetData?.rows}}
         />
      </Widget>
   );
}

export default TableWidget;
