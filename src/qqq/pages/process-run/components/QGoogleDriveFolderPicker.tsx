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

import {colors} from "@mui/material"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {useFormikContext} from "formik";
import React, {useEffect, useState} from "react";
import useDrivePicker from "react-google-drive-picker";
import MDBox from "qqq/components/Temporary/MDBox";

export function QGoogleDriveFolderPicker(): JSX.Element
{
   const clientId = process.env.REACT_APP_GOOGLE_APP_CLIENT_ID;
   const appApiKey = process.env.REACT_APP_GOOGLE_APP_API_KEY;

   const [ selectedGoogleFolderName, setSelectedGoogleFolderName ] = useState(null as string);
   const [ selectedGoogleFolderId, setSelectedGoogleFolderId ] = useState(null as string);
   const [ googleToken, setGoogleToken ] = useState(null as string); // maybe get from cookie/local-storage

   const [ openPicker, authResponse ] = useDrivePicker();

   const formikProps = useFormikContext();

   const handleOpenPicker = (token: string) =>
   {
      openPicker({
         clientId: clientId,
         developerKey: appApiKey,
         viewId: "FOLDERS",
         token: token, // pass oauth token in case you already have one
         showUploadView: false,
         showUploadFolders: false,
         supportDrives: true,
         multiselect: false,
         setSelectFolderEnabled: true,
         setIncludeFolders: true,
         callbackFunction: (data) =>
         {
            if (data.action === "cancel")
            {
               console.log("User clicked cancel/close button");
               setSelectedGoogleFolderId(null);
               setSelectedGoogleFolderName(null);
            }
            else
            {
               console.log(data);
               setSelectedGoogleFolderId(data.docs[0].id);
               setSelectedGoogleFolderName(data.docs[0].name);
            }
         },
      });
   };

   if(authResponse && authResponse.access_token && authResponse.access_token !== googleToken)
   {
      setGoogleToken(authResponse.access_token);
   }

   useEffect(() =>
   {
      formikProps.setFieldValue("googleDriveAccessToken", authResponse?.access_token);
      formikProps.setFieldValue("googleDriveFolderId", selectedGoogleFolderId);
      formikProps.setFieldValue("googleDriveFolderName", selectedGoogleFolderName);
   }, [selectedGoogleFolderId, selectedGoogleFolderName])

   return (
      <Grid item xs={12} sm={6}>
         <MDBox mb={1.5}>

            <Box display="flex" alignItems="center">
               <Button variant="outlined" onClick={() => handleOpenPicker(googleToken)}>
                  <span style={{color: colors.lightBlue[500]}}>Select Google Drive Folder</span>
               </Button>
               <Box ml={1} fontSize={"1rem"}>
                  {selectedGoogleFolderName}
               </Box>
            </Box>

            {/*
            <MDBox mt={0.75}>
               <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  {errors[fieldName] && <span>You must select a file to proceed</span>}
               </MDTypography>
            </MDBox>
            */}
         </MDBox>
      </Grid>
   );
}
