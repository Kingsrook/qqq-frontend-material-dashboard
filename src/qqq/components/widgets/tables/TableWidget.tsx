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
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Typography from "@mui/material/Typography";
// @ts-ignore
import {htmlToText} from "html-to-text";
import React, {useEffect, useState} from "react";
import TableCard from "qqq/components/widgets/tables/TableCard";
import Widget, {WidgetData} from "qqq/components/widgets/Widget";
import HtmlUtils from "qqq/utils/HtmlUtils";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface Props
{
   widgetMetaData?: QWidgetMetaData;
   widgetData?: WidgetData;
   reloadWidgetCallback?: (params: string) => void;
   isChild?: boolean;
}

TableWidget.defaultProps = {
};

function TableWidget(props: Props): JSX.Element
{
   const [isExportDisabled, setIsExportDisabled] = useState(false); // hmm, would like true here, but it broke...
   const [csv, setCsv] = useState(null as string);
   const [fileName, setFileName] = useState(null as string);

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
               const text = htmlToText(cell,
                  {
                     selectors: [
                        {selector: "a", format: "inline"},
                        {selector: ".MuiIcon-root", format: "skip"},
                        {selector: ".button", format: "skip"}
                     ]
                  });
               csv += `"${ValueUtils.cleanForCsv(text)}"`;
            }
            csv += "\n";
         }

         setCsv(csv);

         const fileName = (props.widgetData.label ?? props.widgetMetaData.label) + " " + ValueUtils.formatDateTimeForFileName(new Date()) + ".csv";
         setFileName(fileName)

         console.log(`useEffect, setting fileName ${fileName}`);
      }

   }, [props.widgetMetaData, props.widgetData]);

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

   const labelAdditionalElementsLeft: JSX.Element[] = [];
   if(props.widgetMetaData?.showExportButton)
   {
      labelAdditionalElementsLeft.push(
         <Typography key={1} variant="body2" py={2} px={0} display="inline" position="relative" top="-0.375rem">
            <Tooltip title="Export"><Button sx={{px: 1, py: 0, minWidth: "initial"}} onClick={onExportClick} disabled={false}><Icon>save_alt</Icon></Button></Tooltip>
         </Typography>
      );
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
            data={{columns: props.widgetData?.columns, rows: props.widgetData?.rows}}
         />
      </Widget>
   );
}

export default TableWidget;
