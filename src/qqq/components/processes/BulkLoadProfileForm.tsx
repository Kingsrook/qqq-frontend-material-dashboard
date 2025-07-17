/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2024.  Kingsrook, LLC
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
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Box from "@mui/material/Box";
import SavedBulkLoadProfiles from "qqq/components/misc/SavedBulkLoadProfiles";
import {BulkLoadMapping, BulkLoadProfile, BulkLoadTableStructure, FileDescription, Wrapper} from "qqq/models/processes/BulkLoadModels";
import {SubFormPreSubmitCallbackResultType} from "qqq/pages/processes/ProcessRun";
import React, {forwardRef, useImperativeHandle, useState} from "react";

interface BulkLoadValueMappingFormProps
{
   processValues: any,
   tableMetaData: QTableMetaData,
   metaData: QInstance
}


/***************************************************************************
 ** For review & result screens of bulk load - this process component shows
 ** the SavedBulkLoadProfiles button.
 ***************************************************************************/
const BulkLoadProfileForm = forwardRef(({processValues, tableMetaData, metaData}: BulkLoadValueMappingFormProps, ref) =>
{
   const savedBulkLoadProfileRecordProcessValue = processValues.savedBulkLoadProfileRecord;
   const [savedBulkLoadProfileRecord, setSavedBulkLoadProfileRecord] = useState(savedBulkLoadProfileRecordProcessValue == null ? null : new QRecord(savedBulkLoadProfileRecordProcessValue));

   const [tableStructure] = useState(processValues.tableStructure as BulkLoadTableStructure);

   const [bulkLoadProfile, setBulkLoadProfile] = useState(processValues.bulkLoadProfile as BulkLoadProfile);
   const [currentMapping, setCurrentMapping] = useState(BulkLoadMapping.fromBulkLoadProfile(tableStructure, bulkLoadProfile));
   const [wrappedCurrentSavedBulkLoadProfile] = useState(new Wrapper<QRecord>(savedBulkLoadProfileRecord));

   const [fileDescription] = useState(new FileDescription(processValues.headerValues, processValues.headerLetters, processValues.bodyValuesPreview));
   fileDescription.setHasHeaderRow(currentMapping.hasHeaderRow);

   useImperativeHandle(ref, () =>
   {
      return {
         preSubmit(): SubFormPreSubmitCallbackResultType
         {
            const values: { [name: string]: any } = {};
            values["savedBulkLoadProfileId"] = wrappedCurrentSavedBulkLoadProfile.get()?.values?.get("id");

            return ({maySubmit: true, values});
         }
      };
   });


   /***************************************************************************
    **
    ***************************************************************************/
   function bulkLoadProfileOnChangeCallback(profileRecord: QRecord | null)
   {
      setSavedBulkLoadProfileRecord(profileRecord);
      wrappedCurrentSavedBulkLoadProfile.set(profileRecord);

      const newBulkLoadMapping = BulkLoadMapping.fromSavedProfileRecord(tableStructure, profileRecord);
      setCurrentMapping(newBulkLoadMapping);
   }


   return (<Box>

      <Box py="1rem" display="flex">
         <SavedBulkLoadProfiles
            metaData={metaData}
            tableMetaData={tableMetaData}
            tableStructure={tableStructure}
            currentSavedBulkLoadProfileRecord={savedBulkLoadProfileRecord}
            currentMapping={currentMapping}
            allowSelectingProfile={false}
            fileDescription={fileDescription}
            bulkLoadProfileOnChangeCallback={bulkLoadProfileOnChangeCallback}
            isBulkEdit={processValues.isBulkEdit}
         />
      </Box>

   </Box>);
});

export default BulkLoadProfileForm;
