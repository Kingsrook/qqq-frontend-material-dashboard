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

import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {ListItem} from "@mui/material";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import {Link} from "react-router-dom";
import MDBox from "components/MDBox";

/*******************************************************************************
 ** Entity that corresponds to qqq backend's ProcessSummaryLine - with methods
 ** to help display properly in a process review screen.
 *******************************************************************************/
// eslint-disable-next-line import/prefer-default-export
export class ProcessSummaryLine
{
   status: "OK" | "INFO" | "WARNING" | "ERROR";

   count: number;

   message: string;

   primaryKeys: any[];

   constructor(processSummaryLine: any)
   {
      this.status = processSummaryLine.status;
      this.count = processSummaryLine.count;
      this.message = processSummaryLine.message;
      this.primaryKeys = processSummaryLine.primaryKeys;
   }

   getProcessSummaryListItem(i: number, table: QTableMetaData, qInstance: QInstance, isResultScreen: boolean = false): JSX.Element
   {
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // split up the message into words - then we'll display the last word by itself with a non-breaking space, no-wrap-glued to the button. //
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const messageWords = this.message ? this.message.split(" ") : [];
      const lastWord = messageWords.length > 1 ? messageWords[messageWords.length - 1] : "";
      if (messageWords.length > 1)
      {
         messageWords.splice(messageWords.length - 1, 1);
      }

      return (
         <ListItem key={i} sx={{pl: 4, my: 2}}>
            <MDBox display="flex" alignItems="top">
               <Icon fontSize="medium" sx={{mr: 1}} color={this.getColor()}>{this.getIcon(isResultScreen)}</Icon>
               <ListItemText primaryTypographyProps={{fontSize: 16}}>
                  {/* work hard to prevent the icon from falling down to the next line by itself... */}
                  {`${this.count.toLocaleString()} ${messageWords.join(" ")} `}
                  {
                     (table && this.primaryKeys) ? (
                        <span style={{whiteSpace: "nowrap"}}>
                           {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                           {lastWord}&nbsp;<Link target="_blank" to={this.getLinkToRecords(table, qInstance)}>
                              <Tooltip title="See these records in a new tab" sx={{py: 0}}>
                                 <IconButton sx={{py: 0}}><Icon fontSize="small">open_in_new</Icon></IconButton>
                              </Tooltip>
                              {/* eslint-disable-next-line react/jsx-closing-tag-location */}
                           </Link>
                        </span>
                     ) : <span>{lastWord}</span>
                  }
               </ListItemText>
            </MDBox>
         </ListItem>
      );
   }

   private getColor(): "success" | "info" | "warning" | "error" | "secondary"
   {
      if (this.status === "OK")
      {
         return "success";
      }
      else if (this.status === "INFO")
      {
         return "info";
      }
      else if (this.status === "WARNING")
      {
         return "warning";
      }
      else if (this.status === "ERROR")
      {
         return "error";
      }
      else
      {
         return "secondary";
      }
   }

   private getIcon(isResultScreen: boolean): string
   {
      if (this.status === "OK")
      {
         return isResultScreen ? "check" : "arrow_forward";
      }
      else if (this.status === "INFO")
      {
         return "info";
      }
      else if (this.status === "WARNING")
      {
         return "warning_amber";
      }
      else if (this.status === "ERROR")
      {
         return "report";
      }
      return "";
   }

   private getLinkToRecords(table: QTableMetaData, qInstance: QInstance): string
   {
      const tablePath = qInstance.getTablePath(table);
      const filter = new QQueryFilter([new QFilterCriteria(table.primaryKeyField, QCriteriaOperator.IN, this.primaryKeys)]);
      return (`${tablePath}?filter=${JSON.stringify(filter)}`);
   }
}
