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


import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {QQueryFilter} from "@kingsrook/qqq-frontend-core/lib/model/query/QQueryFilter";
import {Alert, Collapse} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import QContext from "QContext";
import colors from "qqq/assets/theme/base/colors";
import {QCancelButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";
import HelpContent, {hasHelpContent} from "qqq/components/misc/HelpContent";
import AdvancedQueryPreview from "qqq/components/query/AdvancedQueryPreview";
import Widget, {HeaderLinkButton, LabelComponent} from "qqq/components/widgets/Widget";
import QQueryColumns, {Column} from "qqq/models/query/QQueryColumns";
import RecordQuery from "qqq/pages/records/query/RecordQuery";
import Client from "qqq/utils/qqq/Client";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import React, {useContext, useEffect, useRef, useState} from "react";

interface ReportSetupWidgetProps
{
   isEditable: boolean;
   widgetMetaData: QWidgetMetaData;
   recordValues: {[name: string]: any};
   onSaveCallback?: (values: {[name: string]: any}) => void;
}

ReportSetupWidget.defaultProps = {
   onSaveCallback: null
};

const qController = Client.getInstance();

/*******************************************************************************
 ** Component for editing the main setup of a report - that is: filter & columns
 *******************************************************************************/
export default function ReportSetupWidget({isEditable, widgetMetaData, recordValues, onSaveCallback}: ReportSetupWidgetProps): JSX.Element
{
   const [modalOpen, setModalOpen] = useState(false);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);

   const [alertContent, setAlertContent] = useState(null as string);

   const recordQueryRef = useRef();


   let queryFilter = recordValues["queryFilterJson"] && JSON.parse(recordValues["queryFilterJson"]) as QQueryFilter;
   if(!queryFilter)
   {
      queryFilter = new QQueryFilter();
   }

   let columns = recordValues["columnsJson"] && JSON.parse(recordValues["columnsJson"]) as QQueryColumns;
   if(!columns)
   {
      columns = new QQueryColumns();
   }

   useEffect(() =>
   {
      if (recordValues["tableName"] && (tableMetaData == null || tableMetaData.name != recordValues["tableName"]))
      {
         (async () =>
         {
            const tableMetaData = await qController.loadTableMetaData(recordValues["tableName"])
            setTableMetaData(tableMetaData);
         })();
      }
   }, [recordValues]);


   /*******************************************************************************
    **
    *******************************************************************************/
   function openEditor()
   {
      if(recordValues["tableName"])
      {
         setModalOpen(true);
      }
      else
      {
         setAlertContent("You must select a table before you can edit filters and columns")
      }
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function saveClicked()
   {
      if(!onSaveCallback)
      {
         console.log("onSaveCallback was not defined");
         return;
      }

      // @ts-ignore possibly 'undefined'.
      const view = recordQueryRef?.current?.getCurrentView();
      onSaveCallback({queryFilterJson: JSON.stringify(view.queryFilter), columnsJson: JSON.stringify(view.queryColumns)});

      closeEditor();
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function closeEditor(event?: {}, reason?: "backdropClick" | "escapeKeyDown")
   {
      if(reason == "backdropClick" || reason == "escapeKeyDown")
      {
         return;
      }

      setModalOpen(false);
   }

   const labelAdditionalComponentsRight: LabelComponent[] = []
   if(isEditable)
   {
      labelAdditionalComponentsRight.push(new HeaderLinkButton("Edit Filters and Columns", openEditor))
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function renderColumn(column: Column): JSX.Element
   {
      const [field, table] = FilterUtils.getField(tableMetaData, column.name)

      if(!column || !column.isVisible || column.name == "__check__" || !field)
      {
         return (<React.Fragment />);
      }

      const tableLabelPart = table.name != tableMetaData.name ? table.label + ": " : "";

      return (<Box mr="0.375rem" mb="0.5rem" border={`1px solid ${colors.grayLines.main}`} borderRadius="0.75rem" p="0.25rem 0.75rem">
         {tableLabelPart}{field.label}
      </Box>);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function mayShowQueryPreview(): boolean
   {
      if(tableMetaData)
      {
         if(queryFilter?.criteria?.length > 0 || queryFilter?.subFilters?.length > 0)
         {
            return (true);
         }
      }

      return (false);
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   function mayShowColumnsPreview(): boolean
   {
      if(tableMetaData)
      {
         if(columns?.columns?.length > 0)
         {
            return (true);
         }
      }

      return (false);
   }

   ////////////////////
   // load help text //
   ////////////////////
   const helpRoles = ["ALL_SCREENS"]
   const key = "slot:reportSetupSubheader"; // todo - ??
   const {helpHelpActive} = useContext(QContext);
   const showHelp = helpHelpActive || hasHelpContent(widgetMetaData?.helpContent?.get(key), helpRoles);
   const formattedHelpContent = <HelpContent helpContents={widgetMetaData?.helpContent?.get(key)} roles={helpRoles} helpContentKey={key} />;
   // const formattedHelpContent = "Add and edit filter and columns for your report."

   return (<Widget widgetMetaData={widgetMetaData} labelAdditionalComponentsRight={labelAdditionalComponentsRight}>
      <React.Fragment>
         <Collapse in={Boolean(alertContent)}>
            <Alert severity="error" sx={{mt: 1.5, mb: 0.5}} onClose={() => setAlertContent(null)}>{alertContent}</Alert>
         </Collapse>
         <Box pt="0.5rem">
            <h5>Query Filter</h5>
            {
               mayShowQueryPreview() &&
               <AdvancedQueryPreview tableMetaData={tableMetaData} queryFilter={queryFilter} isEditable={false} isQueryTooComplex={queryFilter.subFilters?.length > 0} removeCriteriaByIndexCallback={null} />
            }
            {
               !mayShowQueryPreview() &&
               <Box width="100%" sx={{fontSize: "1rem", background: "#FFFFFF"}} minHeight={"2.5rem"} p={"0.5rem"} pb={"0.125rem"} borderRadius="0.75rem" border={`1px solid ${colors.grayLines.main}`}>
                  {
                     isEditable && <Link sx={{cursor: "pointer"}} onClick={openEditor} color={colors.gray.main}>+ Add Filters</Link>
                  }
                  {
                     !isEditable && <Box color={colors.gray.main}>Your report has no filters.</Box>
                  }
               </Box>
            }
         </Box>
         <Box pt="1rem">
            <h5>Columns</h5>
            <Box display="flex" flexWrap="wrap" fontSize="1rem">
               {
                  mayShowColumnsPreview() &&
                  columns.columns.map((column, i) => <React.Fragment key={i}>{renderColumn(column)}</React.Fragment>)
               }
               {
                  !mayShowColumnsPreview() &&
                  <Box width="100%" sx={{fontSize: "1rem", background: "#FFFFFF"}} minHeight={"2.375rem"} p={"0.5rem"} pb={"0.125rem"}>
                     {
                        isEditable && <Link sx={{cursor: "pointer"}} onClick={openEditor} color={colors.gray.main}>+ Add Columns</Link>
                     }
                     {
                        !isEditable && <Box color={colors.gray.main}>Your report has no filters.</Box>
                     }
                  </Box>
               }
            </Box>
         </Box>
         {
            modalOpen &&
            <Modal open={modalOpen} onClose={(event, reason) => closeEditor(event, reason)}>
               <div>
                  <Box sx={{position: "absolute", overflowY: "auto", maxHeight: "100%", width: "100%"}}>
                     <Card sx={{m: "2rem", p: "2rem"}}>
                        <h3>Edit Filters and Columns</h3>
                        {
                           showHelp &&
                           <Box color={colors.gray.main} pb={"0.5rem"}>
                              {formattedHelpContent}
                           </Box>
                        }
                        {
                           tableMetaData && <RecordQuery
                              ref={recordQueryRef}
                              table={tableMetaData}
                              usage="reportSetup"
                              isModal={true} />
                        }

                        <Box>
                           <Box display="flex" justifyContent="flex-end">
                              <QCancelButton disabled={false} onClickHandler={closeEditor} />
                              <QSaveButton label="OK" iconName="check" disabled={false} onClickHandler={saveClicked} />
                           </Box>
                        </Box>
                     </Card>
                  </Box>
               </div>
            </Modal>
         }
      </React.Fragment>
   </Widget>);
}
