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

import {QController} from "@qrunio/qqq-frontend-core/lib/controllers/QController";
import {QTableMetaData} from "@qrunio/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QQueryFilter} from "@qrunio/qqq-frontend-core/lib/model/query/QQueryFilter";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {CustomFilterPanel} from "qqq/components/query/CustomFilterPanel";
import BaseLayout from "qqq/layouts/BaseLayout";
import Client from "qqq/utils/qqq/Client";


interface Props
{
}

FilterPoc.defaultProps = {};

function FilterPoc({}: Props): JSX.Element
{
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData)
   const [queryFilter, setQueryFilter] = useState(new QQueryFilter())

   const updateFilter = (newFilter: QQueryFilter) =>
   {
      setQueryFilter(JSON.parse(JSON.stringify(newFilter)));
   }

   useEffect(() =>
   {
      (async () =>
      {
         const table = await Client.getInstance().loadTableMetaData("order")
         setTableMetaData(table);
      })();
   }, []);

   return (
      <BaseLayout>
         {
            tableMetaData &&
            <Box>
               <Box sx={{background: "white"}} border="1px solid gray">
                  {/* @ts-ignore */}
                  <CustomFilterPanel tableMetaData={tableMetaData} queryFilter={queryFilter} updateFilter={updateFilter} />
               </Box>
               <pre style={{fontSize: "12px"}}>
                  {JSON.stringify(queryFilter, null, 3)})
               </pre>
            </Box>
         }
      </BaseLayout>
   );
}

export default FilterPoc;
