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

import {QException} from "@kingsrook/qqq-frontend-core/lib/exceptions/QException";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {QFilterOrderBy} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterOrderBy";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon/Icon";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import colors from "qqq/components/legacy/colors";
import Client from "qqq/utils/qqq/Client";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface Props
{
   tableMetaData: QTableMetaData;
   recordId: any;
   record: QRecord;
}

AuditBody.defaultProps =
   {};

const qController = Client.getInstance();

function AuditBody({tableMetaData, recordId, record}: Props): JSX.Element
{
   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
   const [audits, setAudits] = useState([] as QRecord[]);
   const [total, setTotal] = useState(null as number);
   const [limit, setLimit] = useState(1000);
   const [statusString, setStatusString] = useState("Loading audits...");
   const [auditsByDate, setAuditsByDate] = useState([] as QRecord[][]);
   const [sortDirection, setSortDirection] = useState(false);

   useEffect(() =>
   {
      (async () =>
      {
         /////////////////////////////////
         // setup filter to load audits //
         /////////////////////////////////
         const filter = new QQueryFilter([
            new QFilterCriteria("auditTable.name", QCriteriaOperator.EQUALS, [tableMetaData.name]),
            new QFilterCriteria("recordId", QCriteriaOperator.EQUALS, [recordId]),
         ], [
            new QFilterOrderBy("timestamp", sortDirection),
            new QFilterOrderBy("id", sortDirection)
         ]);

         ///////////////////////////////
         // fetch audits in try-catch //
         ///////////////////////////////
         let audits = [] as QRecord[]
         try
         {
            audits = await qController.query("audit", filter, limit, 0);
            setAudits(audits);
         }
         catch(e)
         {
            if (e instanceof QException)
            {
               if ((e as QException).status === "403")
               {
                  setStatusString("You do not have permission to view audits");
                  return;
               }
            }

            setStatusString("Error loading audits");
         }

         // if we fetched the limit
         if (audits.length == limit)
         {
            const count = await qController.count("audit", filter);
            setTotal(count);
         }

         setInitialLoadComplete(true);

         const auditsByDate = [];
         let thisDatesAudits = null as QRecord[];
         let lastDate = null;
         for (let i = 0; i < audits.length; i++)
         {
            const audit = audits[i];
            const date = ValueUtils.formatDateTime(audit.values.get("timestamp")).split(" ")[0];
            if (date != lastDate)
            {
               thisDatesAudits = [];
               auditsByDate.push(thisDatesAudits);
               lastDate = date;
            }
            thisDatesAudits.push(audit);
         }
         setAuditsByDate(auditsByDate);

         ///////////////////////////
         // set the status string //
         ///////////////////////////
         if (audits.length == 0)
         {
            setStatusString("No audits were found for this record.");
         }
         else
         {
            if (total)
            {
               setStatusString(`Showing first ${limit?.toLocaleString()} of ${total?.toLocaleString()} audits for this record`);
            }
            else
            {
               if (audits.length == 1)
               {
                  setStatusString("Showing the only audit for this record");
               }
               else if (audits.length == 2)
               {
                  setStatusString("Showing the only 2 audits for this record");
               }
               else
               {
                  setStatusString(`Showing all ${audits.length?.toLocaleString()} audits for this record`);
               }
            }
         }
      }
      )();
   }, [sortDirection]);

   const changeSortDirection = () =>
   {
      setAudits([]);
      setSortDirection(!sortDirection);
   };

   const todayFormatted = ValueUtils.formatDateTime(new Date()).split(" ")[0];
   const yesterday = new Date();
   yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
   const yesterdayFormatted = ValueUtils.formatDateTime(yesterday).split(" ")[0];

   return (
      <Box>
         <Box p={3} display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h5" pb={3}>
               Audit for {tableMetaData.label}: {record?.recordLabel ?? recordId}
               <Typography fontSize={14}>
                  {statusString}
               </Typography>
            </Typography>
            <Box>
               <Typography variant="button" pr={1}>Sort</Typography>
               <ToggleButtonGroup
                  value={sortDirection}
                  exclusive
                  onChange={changeSortDirection}
                  aria-label="text alignment"
               >
                  <ToggleButton value={true} aria-label="sort ascending">
                     <Tooltip title="Sort by time ascending (oldest to newest)" placement="bottom">
                        <Icon>arrow_upward</Icon>
                     </Tooltip>
                  </ToggleButton>
                  <ToggleButton value={false} aria-label="sort descending">
                     <Tooltip title="Sort by time descending (newest to oldest)" placement="bottom">
                        <Icon>arrow_downward</Icon>
                     </Tooltip>
                  </ToggleButton>
               </ToggleButtonGroup>
            </Box>
         </Box>
         <Box sx={{overflow: "auto", height: "calc( 100vh - 19rem )", position: "relative"}} px={3}>
            {
               auditsByDate.length ? auditsByDate.map((audits) =>
               {
                  if (audits.length)
                  {
                     const audit0 = audits[0];
                     const formattedTimestamp = ValueUtils.formatDateTime(audit0.values.get("timestamp"));
                     const timestampParts = formattedTimestamp.split(" ");

                     return (
                        <Box key={audit0.values.get("id")} className="auditGroupBlock">
                           <Box display="flex" flexDirection="row" justifyContent="center" fontSize={14}>
                              <Box borderTop={1} mt={1.25} mr={1} width="100%" borderColor="#B0B0B0" />
                              <Box whiteSpace="nowrap">
                                 {ValueUtils.getFullWeekday(audit0.values.get("timestamp"))} {timestampParts[0]}
                                 {timestampParts[0] == todayFormatted ? " (Today)" : ""}
                                 {timestampParts[0] == yesterdayFormatted ? " (Yesterday)" : ""}
                              </Box>
                              <Box borderTop={1} mt={1.25} ml={1} width="100%" borderColor="#B0B0B0" />
                           </Box>

                           {
                              audits.map((audit) =>
                              {
                                 return (
                                    <Box key={audit.values.get("id")} display="flex" flexDirection="row" mb={1} className="singleAuditBlock">
                                       <Avatar sx={{bgcolor: colors.info.main, zIndex: 2}}>
                                          <Icon>check</Icon>
                                       </Avatar>
                                       <Box p={1}>
                                          <Box fontSize="0.875rem" color="rgb(123, 128, 154)">
                                             {timestampParts[1]} {timestampParts[2]} {timestampParts[3]} &nbsp; {audit.displayValues.get("auditUserId")}
                                          </Box>
                                          <Box fontSize="1rem">
                                             {audit.values.get("message")}
                                          </Box>
                                       </Box>
                                    </Box>
                                 );
                              })
                           }
                        </Box>
                     );
                  }
                  else
                  {
                     return <></>;
                  }
               }) : <></>
            }
         </Box>
      </Box>);
}

export default AuditBody;
