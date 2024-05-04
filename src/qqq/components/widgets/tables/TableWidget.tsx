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
import QContext from "QContext";
import HelpContent, {hasHelpContent} from "qqq/components/misc/HelpContent";
import TableCard from "qqq/components/widgets/tables/TableCard";
import Widget, {WidgetData} from "qqq/components/widgets/Widget";
import {WidgetUtils} from "qqq/components/widgets/WidgetUtils";
import HtmlUtils from "qqq/utils/HtmlUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";
import React, {useContext, useEffect, useState} from "react";

interface Props
{
   widgetMetaData?: QWidgetMetaData;
   widgetData?: WidgetData;
   reloadWidgetCallback?: (params: string) => void;
   isChild?: boolean;
}

TableWidget.defaultProps = {};

function TableWidget(props: Props): JSX.Element
{
   const [isExportDisabled, setIsExportDisabled] = useState(false); // hmm, would like true here, but it broke...
   const [csv, setCsv] = useState(null as string);
   const [fileName, setFileName] = useState(null as string);
   const {helpHelpActive} = useContext(QContext);

   const rows = props.widgetData?.rows;
   const columns = props.widgetData?.columns;

   useEffect(() =>
   {
      let isExportDisabled = true;
      if (props.widgetData && columns && rows && rows.length > 0)
      {
         isExportDisabled = false;
      }
      setIsExportDisabled(isExportDisabled);

      if (props.widgetData && rows && columns)
      {
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
               let text = cell;
               if (columns[j].type != "default")
               {
                  text = htmlToText(cell,
                     {
                        selectors: [
                           {selector: "a", format: "inline"},
                           {selector: ".MuiIcon-root", format: "skip"},
                           {selector: ".button", format: "skip"}
                        ]
                     });
               }
               csv += `"${ValueUtils.cleanForCsv(text)}"`;
            }
            csv += "\n";
         }

         setCsv(csv);

         const fileName = WidgetUtils.makeExportFileName(props.widgetData, props.widgetMetaData);
         setFileName(fileName);

         console.log(`useEffect, setting fileName ${fileName}`);
      }

   }, [props.widgetMetaData, props.widgetData]);

   const onExportClick = () =>
   {
      if (props.widgetData?.csvData)
      {
         const csv = WidgetUtils.widgetCsvDataToString(props.widgetData);
         const fileName = WidgetUtils.makeExportFileName(props.widgetData, props.widgetMetaData);
         HtmlUtils.download(fileName, csv);
      }
      else if (csv)
      {
         HtmlUtils.download(fileName, csv);
      }
      else
      {
         alert("There is no data available to export.");
      }
   };

   const labelAdditionalElementsLeft: JSX.Element[] = [];
   if (props.widgetMetaData?.showExportButton)
   {
      labelAdditionalElementsLeft.push(WidgetUtils.generateExportButton(onExportClick));
   }

   //////////////////////////////////////////////////////
   // look for column-header tooltips from helpContent //
   //////////////////////////////////////////////////////
   const columnHeaderTooltips: { [columnName: string]: JSX.Element } = {};
   for (let column of props.widgetData?.columns ?? [])
   {
      const helpRoles = ["ALL_SCREENS"];
      const slotName = `columnHeader=${column.accessor}`;
      const showHelp = helpHelpActive || hasHelpContent(props.widgetMetaData?.helpContent?.get(slotName), helpRoles);

      if (showHelp)
      {
         const formattedHelpContent = <HelpContent helpContents={props.widgetMetaData?.helpContent?.get(slotName)} roles={helpRoles} helpContentKey={`widget:${props.widgetMetaData?.name};slot:${slotName}`} />;
         columnHeaderTooltips[column.accessor] = formattedHelpContent;
      }
   }

   return (
      <Widget
         widgetMetaData={props.widgetMetaData}
         widgetData={props.widgetData}
         reloadWidgetCallback={(data) => props.reloadWidgetCallback(data)}
         footerHTML={props.widgetData?.footerHTML}
         isChild={props.isChild}
         labelAdditionalElementsLeft={labelAdditionalElementsLeft}
      >
         <TableCard
            noRowsFoundHTML={props.widgetData?.noRowsFoundHTML}
            rowsPerPage={props.widgetData?.rowsPerPage}
            hidePaginationDropdown={props.widgetData?.hidePaginationDropdown}
            fixedStickyLastRow={props.widgetData?.fixedStickyLastRow}
            fixedHeight={props.widgetData?.fixedHeight}
            data={{columns: props.widgetData?.columns, rows: props.widgetData?.rows, columnHeaderTooltips: columnHeaderTooltips}}
            widgetMetaData={props.widgetMetaData}
         />
      </Widget>
   );
}

export default TableWidget;
