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

import List from "@mui/material/List";
import {
   Button, FormControlLabel, ListItem, Radio, RadioGroup, tooltipClasses, TooltipProps,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import React, {useState} from "react";
import {QFrontendStepMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import QValueUtils from "qqq/utils/QValueUtils";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {ProcessSummaryLine} from "qqq/pages/process-run/model/ProcessSummaryLine";
import {Field} from "formik";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";
import QTableUtils from "qqq/utils/QTableUtils";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";

interface Props
{
   qInstance: QInstance;
   process: QProcessMetaData;
   table: QTableMetaData;
   processValues: any;
   step: QFrontendStepMetaData;
   previewRecords: QRecord[];
   formValues: any;
   doFullValidationRadioChangedHandler: any
}

/*******************************************************************************
 ** This is the process validation/review component - where the user may be prompted
 ** to do a full validation or skip it.  It's the same screen that shows validation
 ** results when they are available.
 *******************************************************************************/
function QValidationReview({
   qInstance, process, table = null, processValues, step, previewRecords = [], formValues, doFullValidationRadioChangedHandler,
}: Props): JSX.Element
{
   const [previewRecordIndex, setPreviewRecordIndex] = useState(0);
   const sourceTable = qInstance.tables.get(processValues.sourceTable);

   const updatePreviewRecordIndex = (offset: number) =>
   {
      let newIndex = previewRecordIndex + offset;
      if (newIndex < 0)
      {
         newIndex = 0;
      }
      if (newIndex >= previewRecords.length - 1)
      {
         newIndex = previewRecords.length - 1;
      }

      setPreviewRecordIndex(newIndex);
   };

   const CustomWidthTooltip = styled(({className, ...props}: TooltipProps) => (
      <Tooltip {...props} classes={{popper: className}} />
   ))({
      [`& .${tooltipClasses.tooltip}`]: {
         maxWidth: 500,
         textAlign: "left",
      },
   });

   const buildDoFullValidationRadioListItem = (value: "true" | "false", labelText: string, tooltipHTML: JSX.Element): JSX.Element =>
   {
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // split up the label into words - then we'll display the last word by itself with a non-breaking space, no-wrap-glued to the button. //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const labelWords = labelText.split(" ");
      const lastWord = labelWords[labelWords.length - 1];
      labelWords.splice(labelWords.length - 1, 1);

      return (
         <ListItem sx={{pl: 2}}>
            <FormControlLabel
               value={value}
               control={<Radio />}
               label={(
                  <ListItemText primaryTypographyProps={{fontSize: 16, pt: 0.625}}>
                     {`${labelWords.join(" ")} `}
                     <span style={{whiteSpace: "nowrap"}}>
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        {lastWord}.&nbsp;<CustomWidthTooltip title={tooltipHTML}>
                           <IconButton sx={{py: 0}}><Icon fontSize="small">info_outlined</Icon></IconButton>
                           {/* eslint-disable-next-line react/jsx-closing-tag-location */}
                        </CustomWidthTooltip>
                     </span>
                  </ListItemText>
               )}
            />
         </ListItem>
      );
   };

   const preValidationList = (
      <List sx={{mt: 2}}>
         {
            processValues?.recordCount !== undefined && sourceTable && (
               <ListItem sx={{my: 2}}>
                  <ListItemText primaryTypographyProps={{fontSize: 16}}>
                     {`Input: ${processValues.recordCount.toLocaleString()} ${sourceTable?.label} record${processValues.recordCount === 1 ? "" : "s"}.`}
                  </ListItemText>
               </ListItem>
            )
         }
         {
            processValues?.supportsFullValidation && formValues && formValues.doFullValidation !== undefined && (
               <>
                  <ListItem sx={{mb: 1, mt: 6}}>
                     <ListItemText primaryTypographyProps={{fontSize: 16}}>How would you like to proceed?</ListItemText>
                  </ListItem>
                  <List className="doFullValidationRadios">
                     <RadioGroup name="doFullValidation" value={formValues.doFullValidation} onChange={doFullValidationRadioChangedHandler}>
                        {buildDoFullValidationRadioListItem(
                           "true",
                           "Perform Validation on all records before processing", (
                              <div>
                                 If you choose this option, a Validation step will run on all of the input records.
                                 You will then be told how many can process successfully, and how many have issues.
                                 <br />
                                 <br />
                                 Running this validation may take several minutes, depending on the complexity of the work, and the number of records.
                                 <br />
                                 <br />
                                 Choose this option if you want more information about what will happen, and you are willing to wait for that information.
                              </div>
                           ),
                        )}

                        {buildDoFullValidationRadioListItem(
                           "false",
                           "Skip Validation.  Submit the records for immediate processing", (
                              <div>
                                 If you choose this option, the records input records will immediately be processed.
                                 You will be told how many records were successfully processed, and which ones had issues after the processing is completed.
                                 <br />
                                 <br />
                                 Choose this option if you feel that you do not need this information, or are not willing to wait for it.
                              </div>
                           ),
                        )}
                     </RadioGroup>
                  </List>
               </>
            )
         }
      </List>
   );

   const postValidationList = (
      <List sx={{mt: 2}}>
         {
            processValues?.recordCount !== undefined && sourceTable && (
               <ListItem sx={{my: 2}}>
                  <ListItemText primaryTypographyProps={{fontSize: 16}}>
                     Validation complete on
                     {` ${processValues.recordCount.toLocaleString()} ${sourceTable?.label} `}
                     records.
                  </ListItemText>
               </ListItem>
            )
         }
         <List>
            {
               processValues.validationSummary && processValues.validationSummary.map((processSummaryLine: ProcessSummaryLine, i: number) => (new ProcessSummaryLine(processSummaryLine).getProcessSummaryListItem(i, sourceTable, qInstance)))
            }
         </List>
      </List>
   );

   const recordPreviewWidget = step.recordListFields && (
      <MDBox border="1px solid rgb(70%, 70%, 70%)" borderRadius="lg" p={2} mt={2}>
         <MDBox mx={2} mt={-5} p={1} sx={{width: "fit-content", borderWidth: "2px", borderStyle: "solid"}} bgColor="white" borderColor="orange" borderRadius=".25em" width="initial" color="white">
            <MDTypography sx={{color: "warning"}}>Preview</MDTypography>
         </MDBox>
         <MDBox p={3} pb={0}>
            <MDTypography color="body" variant="body2" component="div" mb={2}>
               <MDBox display="flex">
                  {
                     processValues?.previewMessage && previewRecords && previewRecords.length > 0 ? (
                        <>
                           <i>{processValues?.previewMessage}</i>
                           <CustomWidthTooltip
                              title={(
                                 <div>
                                    Note that the number of preview records available may be fewer than the total number of records being processed.
                                 </div>
                              )}
                           >
                              <IconButton sx={{py: 0}}><Icon fontSize="small">info_outlined</Icon></IconButton>
                           </CustomWidthTooltip>
                        </>
                     ) : (
                        <>
                           <i>No record previews are available at this time.</i>
                           <CustomWidthTooltip
                              title={(
                                 <div>
                                    {
                                       processValues.validationSummary ? (
                                          <>
                                             It appears as though this process does not contain any valid records.
                                          </>
                                       ) : (
                                          <>
                                             If you choose to Perform Validation, and there are any valid records, then you will see a preview here.
                                          </>
                                       )
                                    }
                                 </div>
                              )}
                           >
                              <IconButton sx={{py: 0}}><Icon fontSize="small">info_outlined</Icon></IconButton>
                           </CustomWidthTooltip>
                        </>
                     )
                  }
               </MDBox>
            </MDTypography>
            <MDTypography color="body" variant="body2" component="div">
               {
                  previewRecords && previewRecords[previewRecordIndex] && step.recordListFields.map((field) => (
                     <MDBox key={field.name} style={{marginBottom: "12px"}}>
                        <b>{`${field.label}:`}</b>
                        {" "}
                        &nbsp;
                        {" "}
                        {QValueUtils.getDisplayValue(field, previewRecords[previewRecordIndex])}
                     </MDBox>
                  ))
               }
               {
                  previewRecords && previewRecords.length > 0 && (
                     <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <Button startIcon={<Icon>navigate_before</Icon>} onClick={() => updatePreviewRecordIndex(-1)} disabled={previewRecordIndex <= 0}>Previous</Button>
                        <span>
                           {`Preview ${previewRecordIndex + 1} of ${previewRecords.length}`}
                        </span>
                        <Button endIcon={<Icon>navigate_next</Icon>} onClick={() => updatePreviewRecordIndex(1)} disabled={previewRecordIndex >= previewRecords.length - 1}>Next</Button>
                     </MDBox>
                  )
               }
            </MDTypography>
         </MDBox>
      </MDBox>
   );

   return (
      <MDBox m={3}>
         <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
               <MDTypography color="body" variant="button">
                  {processValues.validationSummary ? postValidationList : preValidationList}
               </MDTypography>
            </Grid>
            <Grid item xs={12} lg={6} mt={3}>
               {recordPreviewWidget}
            </Grid>
         </Grid>
      </MDBox>
   );
}

export default QValidationReview;
