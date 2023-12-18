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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useParams} from "react-router-dom";
import EntityForm from "qqq/components/forms/EntityForm";
import BaseLayout from "qqq/layouts/BaseLayout";

interface Props
{
   table?: QTableMetaData;
   isCopy?: boolean
}

EntityEdit.defaultProps = {
   table: null,
   isCopy: false
};

function EntityEdit({table, isCopy}: Props): JSX.Element
{
   const {id} = useParams();

   return (
      <BaseLayout>
         <Box mb={3}>
            <EntityForm table={table} id={id} isCopy={isCopy} />
         </Box>
      </BaseLayout>
   );
}

export default EntityEdit;
