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
import {QReportMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QReportMetaData";
import React, {useContext, useEffect, useState} from "react";
import QContext from "QContext";
import ProcessRun from "qqq/pages/processes/ProcessRun";
import Client from "qqq/utils/qqq/Client";

interface Props
{
   report?: QReportMetaData;
}

function ReportRun({report}: Props): JSX.Element
{
   const [metaData, setMetaData] = useState(null as QInstance);
   const {pageHeader, setPageHeader} = useContext(QContext);

   useEffect(() =>
   {
      if (!metaData)
      {
         (async () =>
         {
            const metaData = await Client.getInstance().loadMetaData();
            setMetaData(metaData);
         })();
      }
   });

   if (metaData)
   {
      setPageHeader(report.label);
      const process = metaData.processes.get(report.processName);
      const defaultProcessValues = {reportName: report.name};
      return (<ProcessRun process={process} defaultProcessValues={defaultProcessValues} />);
   }
   else
   {
      // todo - loading?
      return (<div />);
   }
}

ReportRun.defaultProps = {
   process: null,
};

export default ReportRun;
