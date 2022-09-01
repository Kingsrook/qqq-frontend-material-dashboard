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
import Grid from "@mui/material/Grid";
import {useParams} from "react-router-dom";
import BaseLayout from "qqq/components/BaseLayout";
import EntityForm from "qqq/components/EntityForm";
import MDBox from "qqq/components/Temporary/MDBox";

interface Props
{
   table?: QTableMetaData;
}

function EntityEdit({table}: Props): JSX.Element
{
   const {id} = useParams();

   return (
      <BaseLayout>
         <MDBox mt={4}>
            <Grid container spacing={3}>
               <Grid item xs={12} lg={12}>
                  <MDBox mb={3}>
                     <Grid container spacing={3}>
                        <Grid item xs={12}>
                           <EntityForm table={table} id={id} />
                        </Grid>
                     </Grid>
                  </MDBox>
               </Grid>
            </Grid>
         </MDBox>
      </BaseLayout>
   );
}

EntityEdit.defaultProps = {
   table: null,
};

export default EntityEdit;
