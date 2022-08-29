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

import React from "react";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QFrontendStepMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import List from "@mui/material/List";
import {ListItem} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {ProcessSummaryLine} from "qqq/pages/process-run/model/ProcessSummaryLine";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";

interface Props
{
   qInstance: QInstance;
   process: QProcessMetaData;
   table: QTableMetaData;
   processValues: any;
   step: QFrontendStepMetaData;
}

/*******************************************************************************
 ** This is the process summary result component.
 *******************************************************************************/
function QProcessSummaryResults({
   qInstance, process, table = null, processValues, step,
}: Props): JSX.Element
{
   const resultValidationList = (
      <List sx={{mt: 2}}>
         {
            processValues?.recordCount && table && (
               <ListItem sx={{my: 2}}>
                  <ListItemText primaryTypographyProps={{fontSize: 16}}>
                     {processValues.recordCount.toLocaleString()}
                     {" "}
                     {table.label}
                     {" "}
                     records were processed.
                  </ListItemText>
               </ListItem>
            )
         }
         <List>
            {
               processValues.processResults && processValues.processResults.map((processSummaryLine: ProcessSummaryLine, i: number) => (new ProcessSummaryLine(processSummaryLine).getProcessSummaryListItem(i, table, qInstance, true)))
            }
         </List>
      </List>
   );

   return (
      <MDBox m={3} mt={6}>
         <Grid container>
            <Grid item xs={0} lg={2} />
            <Grid item xs={12} lg={8}>
               <MDBox border="1px solid rgb(70%, 70%, 70%)" borderRadius="lg" p={2} mt={2}>
                  <MDBox mt={-5} p={1} sx={{width: "fit-content"}} bgColor="success" borderRadius=".25em" width="initial" color="white">
                     <MDBox display="flex" alignItems="center" color="white">
                        <Icon fontSize="medium" sx={{mr: 1}}>{process.iconName}</Icon>
                        {`${process.label} : ${step.label}`}
                     </MDBox>
                  </MDBox>
                  {resultValidationList}
               </MDBox>
            </Grid>
            <Grid item xs={0} lg={2} />
         </Grid>
      </MDBox>
   );
}

export default QProcessSummaryResults;
