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

import {QException} from "@kingsrook/qqq-frontend-core/lib/exceptions/QException";
import {Capability} from "@kingsrook/qqq-frontend-core/lib/model/metaData/Capability";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import React, {useContext, useEffect, useReducer, useState} from "react";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import QContext from "QContext";
import BaseLayout from "qqq/components/BaseLayout";
import DashboardWidgets from "qqq/components/DashboardWidgets";
import EntityForm from "qqq/components/EntityForm";
import {QActionsMenuButton, QDeleteButton, QEditButton} from "qqq/components/QButtons";
import QRecordSidebar from "qqq/components/QRecordSidebar";
import colors from "qqq/components/Temporary/colors";
import MDAlert from "qqq/components/Temporary/MDAlert";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import ProcessRun from "qqq/pages/process-run";
import QClient from "qqq/utils/QClient";
import QProcessUtils from "qqq/utils/QProcessUtils";
import QTableUtils from "qqq/utils/QTableUtils";
import QValueUtils from "qqq/utils/QValueUtils";

const qController = QClient.getInstance();

interface Props
{
   table?: QTableMetaData;
   launchProcess?: QProcessMetaData;
}

EntityView.defaultProps =
   {
      table: null,
      launchProcess: null,
   };

function EntityView({table, launchProcess}: Props): JSX.Element
{
   const {id} = useParams();

   const location = useLocation();
   const navigate = useNavigate();

   const pathParts = location.pathname.split("/");
   const tableName = table.name;

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
   const [allTableProcesses, setAllTableProcesses] = useState([] as QProcessMetaData[]);
   const [actionsMenu, setActionsMenu] = useState(null);
   const [notFoundMessage, setNotFoundMessage] = useState(null);
   const [searchParams] = useSearchParams();
   const {setPageHeader} = useContext(QContext);
   const [activeModalProcess, setActiveModalProcess] = useState(null as QProcessMetaData);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [launchingProcess, setLaunchingProcess] = useState(launchProcess);
   const [showEditChildForm, setShowEditChildForm] = useState(null as any);

   const openActionsMenu = (event: any) => setActionsMenu(event.currentTarget);
   const closeActionsMenu = () => setActionsMenu(null);

   const reload = () =>
   {
      setAsyncLoadInited(false);
      setTableMetaData(null);
      setRecord(null);
      setT1SectionElement(null);
      setNonT1TableSections([]);
      setTableProcesses([]);
      setTableSections(null);
   };

   ////////////////////////////////////////////////////////////////////////////////////////////////////
   // monitor location changes - if we've clicked a link from viewing one record to viewing another, //
   // we'll stay in this component, but we'll need to reload all data for the new record.            //
   // if, however, our url looks like a process, then open that process.                             //
   ////////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      try
      {
         const hashParts = location.hash.split("/");

         ///////////////////////////////////////////////////////////////////////////////////////////////
         // the path for a process looks like: .../table/id/process                                   //
         // the path for creating a child record looks like: .../table/id/createChild/:childTableName //
         ///////////////////////////////////////////////////////////////////////////////////////////////

         //////////////////////////////////////////////////////////////
         // if our tableName is in the -3 index, try to open process //
         //////////////////////////////////////////////////////////////
         if (pathParts[pathParts.length - 3] === tableName)
         {
            const processName = pathParts[pathParts.length - 1];
            const processList = allTableProcesses.filter(p => p.name.endsWith(processName));
            if (processList.length > 0)
            {
               setActiveModalProcess(processList[0]);
               return;
            }
            else
            {
               console.log(`Couldn't find process named ${processName}`);
            }
         }

         ///////////////////////////////////////////////////////////////////////
         // alternatively, look for a launchProcess specification in the hash //
         // e.g., for non-natively rendered links to open the modal.          //
         ///////////////////////////////////////////////////////////////////////
         for (let i = 0; i < hashParts.length; i++)
         {
            const parts = hashParts[i].split("=")
            if (parts.length > 1 && parts[0] == "launchProcess")
            {
               (async () =>
               {
                  const processMetaData = await qController.loadProcessMetaData(parts[1])
                  setActiveModalProcess(processMetaData);
               })();
               return;
            }
         }

         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // if our table is in the -4 index, and there's `createChild` in the -2 index, try to open a createChild form //
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if(pathParts[pathParts.length - 4] === tableName && pathParts[pathParts.length - 2] == "createChild")
         {
            (async () =>
            {
               const childTable = await qController.loadTableMetaData(pathParts[pathParts.length - 1])
               const childId: any = null; // todo - for editing a child, not just creating one.
               openEditChildForm(childTable, childId, null, null); // todo - defaults & disableds
            })();
            return;
         }

         /////////////////////////////////////////////////////////////////////
         // alternatively, look for a createChild specification in the hash //
         // e.g., for non-natively rendered links to open the modal.        //
         /////////////////////////////////////////////////////////////////////
         for (let i = 0; i < hashParts.length; i++)
         {
            const parts = hashParts[i].split("=")
            if (parts.length > 1 && parts[0] == "createChild")
            {
               (async () =>
               {
                  const childTable = await qController.loadTableMetaData(parts[1])
                  const childId: any = null; // todo - for editing a child, not just creating one.
                  openEditChildForm(childTable, childId, null, null); // todo - defaults & disableds
               })();
               return;
            }
         }
      }
      catch (e)
      {
         console.log(e);
      }

      ///////////////////////////////////////////////////////////////////
      // if we didn't open something, then, assume we need to (re)load //
      ///////////////////////////////////////////////////////////////////
      setActiveModalProcess(null);
      reload();
   }, [location.pathname, location.hash]);

   if (!asyncLoadInited)
   {
      setAsyncLoadInited(true);

      (async () =>
      {
         /////////////////////////////////////////////////////////////////////
         // load the full table meta-data (the one we took in is a partial) //
         /////////////////////////////////////////////////////////////////////
         const tableMetaData = await qController.loadTableMetaData(tableName);
         setTableMetaData(tableMetaData);

         //////////////////////////////////////////////////////////////////
         // load top-level meta-data (e.g., to find processes for table) //
         //////////////////////////////////////////////////////////////////
         const metaData = await qController.loadMetaData();
         QValueUtils.qInstance = metaData;
         const processesForTable = QProcessUtils.getProcessesForTable(metaData, tableName);
         setTableProcesses(processesForTable);
         setAllTableProcesses(QProcessUtils.getProcessesForTable(metaData, tableName, true)); // these include hidden ones (e.g., to find the bulks)

         if (launchingProcess)
         {
            setLaunchingProcess(null);
            setActiveModalProcess(launchingProcess);
         }

         /////////////////////
         // load the record //
         /////////////////////
         let record: QRecord;
         try
         {
            record = await qController.get(tableName, id);
            setRecord(record);
         }
         catch (e)
         {
            if (e instanceof QException)
            {
               if ((e as QException).status === "404")
               {
                  setNotFoundMessage(`${tableMetaData.label} ${id} could not be found.`);
                  return;
               }
            }
         }

         setPageHeader(record.recordLabel);

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
            if (section.isHidden)
            {
               continue;
            }

            if (section.widgetName)
            {
               const widgetMetaData = metaData.widgets.get(section.widgetName);

               ////////////////////////////////////////////////////////////////////////////
               // for a section with a widget name, call the dashboard widgets component //
               ////////////////////////////////////////////////////////////////////////////
               sectionFieldElements.set(section.name,
                  <Grid id={section.name} key={section.name} item lg={widgetMetaData.gridColumns ? widgetMetaData.gridColumns : 12} xs={12} sx={{display: "flex", alignItems: "stretch", flexGrow: 1, scrollMarginTop: "100px"}}>
                     <Box width="100%" flexGrow={1} alignItems="stretch">
                        <DashboardWidgets key={section.name} widgetMetaDataList={[widgetMetaData]} entityPrimaryKey={record.values.get(tableMetaData.primaryKeyField)} omitWrappingGridContainer={true} />
                     </Box>
                  </Grid>
               );
            }
            else if (section.fieldNames)
            {
               ////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // for a section with field names, render the field values.                                               //
               // for the T1 section, the "wrapper" will come out below - but for other sections, produce a wrapper too. //
               ////////////////////////////////////////////////////////////////////////////////////////////////////////////
               const fields = (
                  <MDBox key={section.name} display="flex" flexDirection="column" py={1} pr={2}>
                     {
                        section.fieldNames.map((fieldName: string) => (
                           <MDBox key={fieldName} flexDirection="row" pr={2}>
                              <MDTypography variant="button" fontWeight="bold" pr={1}>
                                 {tableMetaData.fields.get(fieldName).label}:
                              </MDTypography>
                              <MDTypography variant="button" fontWeight="regular" color="text">
                                 {QValueUtils.getDisplayValue(tableMetaData.fields.get(fieldName), record, "view")}
                              </MDTypography>
                           </MDBox>
                        ))
                     }
                  </MDBox>
               );

               if (section.tier === "T1")
               {
                  sectionFieldElements.set(section.name, fields);
               }
               else
               {
                  sectionFieldElements.set(section.name,
                     <Grid id={section.name} key={section.name} item lg={12} xs={12} sx={{display: "flex", alignItems: "stretch", scrollMarginTop: "100px"}}>
                        <MDBox width="100%">
                           <Card id={section.name} sx={{overflow: "visible", scrollMarginTop: "100px"}}>
                              <MDTypography variant="h5" p={3} pb={1}>
                                 {section.label}
                              </MDTypography>
                              <MDBox p={3} pt={0} flexDirection="column">
                                 {fields}
                              </MDBox>
                           </Card>
                        </MDBox>
                     </Grid>
                  );
               }
            }
            else
            {
               continue;
            }

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
      openModalProcess(process);
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
         {
            table.capabilities.has(Capability.TABLE_UPDATE) &&
            <MenuItem onClick={() => navigate("edit")}>
               <ListItemIcon><Icon>edit</Icon></ListItemIcon>
               Edit
            </MenuItem>
         }
         {
            table.capabilities.has(Capability.TABLE_DELETE) &&
            <MenuItem onClick={() =>
            {
               setActionsMenu(null);
               handleClickDeleteButton();
            }}
            >
               <ListItemIcon><Icon>delete</Icon></ListItemIcon>
               Delete
            </MenuItem>
         }
         {tableProcesses.length > 0 && (table.capabilities.has(Capability.TABLE_UPDATE) || table.capabilities.has(Capability.TABLE_DELETE)) && <Divider />}
         {tableProcesses.map((process) => (
            <MenuItem key={process.name} onClick={() => processClicked(process)}>
               <ListItemIcon><Icon>{process.iconName ?? "arrow_forward"}</Icon></ListItemIcon>
               {process.label}
            </MenuItem>
         ))}
         {tableProcesses.length > 0 && <Divider />}
         <MenuItem onClick={() => navigate("dev")}>
            <ListItemIcon><Icon>data_object</Icon></ListItemIcon>
            Developer Mode
         </MenuItem>
      </Menu>
   );

   const openModalProcess = (process: QProcessMetaData = null) =>
   {
      navigate(process.name);
      closeActionsMenu();
   };

   const closeModalProcess = (event: object, reason: string) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      //////////////////////////////////////////////////////////////////////////
      // when closing a modal process, navigate up to the record being viewed //
      //////////////////////////////////////////////////////////////////////////
      if(location.hash)
      {
         navigate(location.pathname);
      }
      else
      {
         const newPath = location.pathname.split("/");
         newPath.pop();
         navigate(newPath.join("/"));
      }

      setActiveModalProcess(null);
   };

   function openEditChildForm(table: QTableMetaData, id: any = null, defaultValues: any, disabledFields: any)
   {
      const showEditChildForm: any = {};
      showEditChildForm.table = table;
      showEditChildForm.id = id;
      showEditChildForm.defaultValues = defaultValues;
      showEditChildForm.disabledFields = disabledFields;
      setShowEditChildForm(showEditChildForm);
   }

   const closeEditChildForm = (event: object, reason: string) =>
   {
      if (reason === "backdropClick" || reason === "escapeKeyDown")
      {
         return;
      }

      /////////////////////////////////////////////////
      // navigate back up to the record being viewed //
      /////////////////////////////////////////////////
      if(location.hash)
      {
         navigate(location.pathname);
      }
      else
      {
         const newPath = location.pathname.split("/");
         newPath.pop();
         newPath.pop();
         navigate(newPath.join("/"));
      }

      setShowEditChildForm(null);
   };

   return (
      <BaseLayout>
         <MDBox>
            <Grid container>
               <Grid item xs={12}>
                  <MDBox mb={3}>
                     {
                        notFoundMessage
                           ?
                           <MDBox>{notFoundMessage}</MDBox>
                           :
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
                                    <QRecordSidebar tableSections={tableSections} />
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
                                    <Grid container spacing={3} pb={4}>
                                       {nonT1TableSections.length > 0 ? nonT1TableSections.map(({
                                          iconName, label, name, fieldNames, tier,
                                       }: any) => (
                                          <React.Fragment key={name}>
                                             {sectionFieldElements.get(name)}
                                          </React.Fragment>
                                       )) : null}
                                    </Grid>
                                    <MDBox component="form" p={3}>
                                       <Grid container justifyContent="flex-end" spacing={3}>
                                          {
                                             table.capabilities.has(Capability.TABLE_DELETE) && <QDeleteButton onClickHandler={handleClickDeleteButton} />
                                          }
                                          {
                                             table.capabilities.has(Capability.TABLE_UPDATE) && <QEditButton />
                                          }
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

                              {
                                 activeModalProcess &&
                                 <Modal open={activeModalProcess !== null} onClose={(event, reason) => closeModalProcess(event, reason)}>
                                    <div className="modalProcess">
                                       <ProcessRun process={activeModalProcess} isModal={true} recordIds={id} closeModalHandler={closeModalProcess} />
                                    </div>
                                 </Modal>
                              }

                              {
                                 showEditChildForm &&
                                 <Modal open={showEditChildForm as boolean} onClose={(event, reason) => closeEditChildForm(event, reason)}>
                                    <div className="modalEditForm">
                                       <EntityForm
                                          isModal={true}
                                          closeModalHandler={closeEditChildForm}
                                          table={showEditChildForm.table}
                                          id={showEditChildForm.id}
                                          defaultValues={showEditChildForm.defaultValues}
                                          disabledFields={showEditChildForm.disabledFields} />
                                    </div>
                                 </Modal>
                              }

                           </MDBox>
                     }
                  </MDBox>
               </Grid>
            </Grid>
         </MDBox>
      </BaseLayout>
   );
}

export default EntityView;
