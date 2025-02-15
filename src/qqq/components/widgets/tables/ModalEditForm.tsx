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
import Modal from "@mui/material/Modal";
import EntityForm from "qqq/components/forms/EntityForm";
import Client from "qqq/utils/qqq/Client";
import React, {useEffect, useReducer, useState} from "react";


////////////////////////////////
// structure of expected data //
////////////////////////////////
export interface ModalEditFormData
{
   tableName: string;
   defaultValues?: { [key: string]: string };
   disabledFields?: { [key: string]: boolean } | string[];
   overrideHeading?: string;
   onSubmitCallback?: (values: any, tableName: String) => void;
   initialShowModalValue?: boolean;
}

const qController = Client.getInstance();

function ModalEditForm({tableName, defaultValues, disabledFields, overrideHeading, onSubmitCallback, initialShowModalValue}: ModalEditFormData,): JSX.Element
{
   const [showModal, setShowModal] = useState(initialShowModalValue);
   const [table, setTable] = useState(null as QTableMetaData);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   useEffect(() =>
   {
      if (!tableName)
      {
         return;
      }

      (async () =>
      {
         const tableMetaData = await qController.loadTableMetaData(tableName);
         setTable(tableMetaData);
         forceUpdate();
      })();
   }, [tableName]);

   /*******************************************************************************
    **
    *******************************************************************************/
   const closeEditChildForm = (event: object, reason: string) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      setShowModal(null);
   };

   return (
      table && showModal &&
      <Modal open={showModal as boolean} onClose={(event, reason) => closeEditChildForm(event, reason)}>
         <div className="modalEditForm">
            <EntityForm
               isModal={true}
               closeModalHandler={closeEditChildForm}
               table={table}
               defaultValues={defaultValues}
               disabledFields={disabledFields}
               onSubmitCallback={onSubmitCallback}
               overrideHeading={overrideHeading}
            />
         </div>
      </Modal>
   );
}

export default ModalEditForm;
