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

import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, {useReducer, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import DashboardWidgets from "qqq/components/DashboardWidgets";
import {QActionsMenuButton, QDeleteButton, QEditButton} from "qqq/components/QButtons";
import QRecordSidebar from "qqq/components/QRecordSidebar";
import colors from "qqq/components/Temporary/colors";
import MDAlert from "qqq/components/Temporary/MDAlert";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import QClient from "qqq/utils/QClient";
import QTableUtils from "qqq/utils/QTableUtils";
import QValueUtils from "qqq/utils/QValueUtils";
import QProcessUtils from "../../../../utils/QProcessUtils";

const qController = QClient.getInstance();

// Declaring props types for ViewForm
interface Props
{
   id: string;
   table?: QTableMetaData;
}

function ViewContents({id, table}: Props): JSX.Element
{
   const location = useLocation();
   const navigate = useNavigate();

   const pathParts = location.pathname.split("/");
   const tableName = table ? table.name : pathParts[pathParts.length - 2];

   const [asyncLoadInited, setAsyncLoadInited] = useState(false);
   const [sectionFieldElements, setSectionFieldElements] = useState(null as Map<string, JSX.Element[]>);
   const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
   const [tableMetaData, setTableMetaData] = useState(null);
   const [record, setRecord] = useState(null as QRecord);
   const [tableSections, setTableSections] = useState([] as QTableSection[]);
   const [t1SectionName, setT1SectionName] = useState(null as string);
   const [t1SectionElement, setT1SectionElement] = useState(null as JSX.Element);
   const [nonT1TableSections, setNonT1TableSections] = useState([] as QTableSection[]);
   const [tableProcesses, setTableProcesses] = useState([] as QProcessMetaData[]);
   const [actionsMenu, setActionsMenu] = useState(null);
   const [widgets, setWidgets] = useState([] as string[]);
   const [searchParams] = useSearchParams();
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
   const closeActionsMenu = () => setActionsMenu(null);

   if (!asyncLoadInited)
   {
      setAsyncLoadInited(true);

      (async () =>
      {
         //////////////////////////////////////////
         // load the table meta-data (if needed) //
         //////////////////////////////////////////
         const tableMetaData = table || await qController.loadTableMetaData(tableName);
         setTableMetaData(tableMetaData);

         //////////////////////////////////////////////////////////////////
         // load top-level meta-data (e.g., to find processes for table) //
         //////////////////////////////////////////////////////////////////
         const metaData = await qController.loadMetaData();
         setTableProcesses(QProcessUtils.getProcessesForTable(metaData, tableName));

         /////////////////////
         // load the record //
         /////////////////////
         const record = await qController.get(tableName, id);
         setRecord(record);
         setWidgets(tableMetaData.widgets);

         /////////////////////////////////////////////////
         // define the sections, e.g., for the left-bar //
         /////////////////////////////////////////////////
         const tableSections = QTableUtils.getSectionsForRecordSidebar(tableMetaData);
         setTableSections(tableSections);

         ////////////////////////////////////////////////////
         // make elements with the values for each section //
         ////////////////////////////////////////////////////
         const sectionFieldElements = new Map();
         const nonT1TableSections = [];
         for (let i = 0; i < tableSections.length; i++)
         {
            const section = tableSections[i];
            sectionFieldElements.set(
               section.name,
               <MDBox key={section.name} display="flex" flexDirection="column" py={1} pr={2}>
                  {
                     section.fieldNames.map((fieldName: string) => (
                        <MDBox key={fieldName} flexDirection="row" pr={2}>
                           <MDTypography variant="button" fontWeight="bold">
                              {tableMetaData.fields.get(fieldName).label}
                              : &nbsp;
                           </MDTypography>
                           <MDTypography variant="button" fontWeight="regular" color="text">
                              &nbsp;
                              {QValueUtils.getDisplayValue(tableMetaData.fields.get(fieldName), record)}
                           </MDTypography>
                        </MDBox>
                     ))
                  }
               </MDBox>,
            );

            if (section.tier === "T1")
            {
               setT1SectionElement(sectionFieldElements.get(section.name));
               setT1SectionName(section.name);
            }
            else
            {
               nonT1TableSections.push(tableSections[i]);
            }
         }
         setSectionFieldElements(sectionFieldElements);
         setNonT1TableSections(nonT1TableSections);

         forceUpdate();
      })();
   }

   const handleClickDeleteButton = () =>
   {
      setDeleteConfirmationOpen(true);
   };

   const handleDeleteConfirmClose = () =>
   {
      setDeleteConfirmationOpen(false);
   };

   const handleDelete = (event: { preventDefault: () => void }) =>
   {
      event.preventDefault();
      (async () =>
      {
         await qController.delete(tableName, id)
            .then(() =>
            {
               const path = `${pathParts.slice(0, -1).join("/")}?deleteSuccess=true`;
               navigate(path);
            });
      })();
   };

   function processClicked(process: QProcessMetaData)
   {
      const path = `${pathParts.slice(0, -1).join("/")}/${process.name}?recordIds=${id}`;
      navigate(path);
   }

   const renderActionsMenu = (
      <Menu
         anchorEl={actionsMenu}
         anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
         }}
         transformOrigin={{
            vertical: "top",
            horizontal: "right",
         }}
         open={Boolean(actionsMenu)}
         onClose={closeActionsMenu}
         keepMounted
      >
         <MenuItem onClick={() => navigate("edit")}>Edit</MenuItem>
         <MenuItem onClick={() =>
         {
            setActionsMenu(null);
            handleClickDeleteButton();
         }}
         >
            Delete
         </MenuItem>
         {tableProcesses.length > 0 && <MenuItem divider />}
         {tableProcesses.map((process) => (
            <MenuItem key={process.name} onClick={() => processClicked(process)}>{process.label}</MenuItem>
         ))}
      </Menu>
   );

   return (

      <MDBox pb={3}>
         {
            (searchParams.get("createSuccess") || searchParams.get("updateSuccess")) ? (
               <MDAlert color="success" dismissible>
                  {tableMetaData?.label}
                  {" "}
                  successfully
                  {" "}
                  {searchParams.get("createSuccess") ? "created" : "updated"}

               </MDAlert>
            ) : ("")
         }

         <Grid container spacing={3}>
            <Grid item xs={12} lg={3}>
               <QRecordSidebar tableSections={tableSections} widgetNames={widgets} />
            </Grid>
            <Grid item xs={12} lg={9}>

               <Grid container spacing={3}>
                  <Grid item xs={12} mb={3}>
                     <Card id={t1SectionName}>
                        <MDBox display="flex" p={3} pb={1}>
                           <MDBox mr={1.5}>
                              <Avatar sx={{bgcolor: colors.info.main}}>
                                 <Icon>
                                    {tableMetaData?.iconName}
                                 </Icon>
                              </Avatar>
                           </MDBox>
                           <MDBox display="flex" justifyContent="space-between" width="100%" alignItems="center">
                              <MDTypography variant="h5">
                                 {tableMetaData && record ? `Viewing ${tableMetaData?.label}: ${record?.recordLabel}` : ""}
                              </MDTypography>
                              <QActionsMenuButton isOpen={actionsMenu} onClickHandler={openActionsMenu} />
                              {renderActionsMenu}
                           </MDBox>
                        </MDBox>
                        {t1SectionElement ? (<MDBox p={3} pt={0}>{t1SectionElement}</MDBox>) : null}
                     </Card>
                  </Grid>
               </Grid>
               {tableMetaData && tableMetaData.widgets && record && (
                  <DashboardWidgets widgetNameList={tableMetaData.widgets} entityPrimaryKey={record.values.get(tableMetaData.primaryKeyField)} />
               )}
               {nonT1TableSections.length > 0 ? nonT1TableSections.map(({
                  iconName, label, name, fieldNames, tier,
               }: any) => (
                  <MDBox mb={3} key={name}>
                     <Card key={name} id={name} sx={{overflow: "visible"}}>
                        <MDTypography variant="h5" p={3} pb={1}>
                           {label}
                        </MDTypography>
                        <MDBox p={3} pt={0} flexDirection="column">{sectionFieldElements.get(name)}</MDBox>
                     </Card>
                  </MDBox>
               )) : null}
               <MDBox component="form" p={3}>
                  <Grid container justifyContent="flex-end" spacing={3}>
                     <QDeleteButton onClickHandler={handleClickDeleteButton} />
                     <QEditButton />
                  </Grid>
               </MDBox>

            </Grid>
         </Grid>

         {/* Delete confirmation Dialog */}
         <Dialog
            open={deleteConfirmationOpen}
            onClose={handleDeleteConfirmClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleDeleteConfirmClose}>No</Button>
               <Button onClick={handleDelete} autoFocus>
                  Yes
               </Button>
            </DialogActions>
         </Dialog>
      </MDBox>

   );
}

ViewContents.defaultProps = {
   table: null,
};

export default ViewContents;
