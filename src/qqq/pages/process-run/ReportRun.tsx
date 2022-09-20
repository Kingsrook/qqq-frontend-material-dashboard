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
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QReportMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QReportMetaData";
import React, {useEffect, useState} from "react";
import ProcessRun from "qqq/pages/process-run/index";
import QClient from "qqq/utils/QClient";

interface Props
{
   report?: QReportMetaData;
}

function ReportRun({report}: Props): JSX.Element
{
   // const reportNameParam = useParams().reportName;
   // const processName = process === null ? processNameParam : process.name;
   const [metaData, setMetaData] = useState(null as QInstance);

   useEffect(() =>
   {
      if(!metaData)
      {
         (async () =>
         {
            const metaData = await QClient.getInstance().loadMetaData();
            setMetaData(metaData);
         })();
      }
   });

   if(metaData)
   {
      console.log(`Report Process name is ${report.processName}`)
      const process = metaData.processes.get(report.processName)
      console.log(`Process is ${process.name}`)
      const defaultProcessValues = {reportName: report.name}
      return (<ProcessRun process={process} defaultProcessValues={defaultProcessValues} />);
   }
   else
   {
      // todo - loading?
      return (<div/>);
   }
}

ReportRun.defaultProps = {
   process: null,
};

export default ReportRun;
