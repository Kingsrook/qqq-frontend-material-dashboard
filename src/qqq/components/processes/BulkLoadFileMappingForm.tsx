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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QFrontendStepMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Badge, Icon} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import {useFormikContext} from "formik";
import {DynamicFormFieldLabel} from "qqq/components/forms/DynamicForm";
import QDynamicFormField from "qqq/components/forms/DynamicFormField";
import MDTypography from "qqq/components/legacy/MDTypography";
import HelpContent from "qqq/components/misc/HelpContent";
import SavedBulkLoadProfiles from "qqq/components/misc/SavedBulkLoadProfiles";
import BulkLoadFileMappingFields from "qqq/components/processes/BulkLoadFileMappingFields";
import {BulkLoadField, BulkLoadMapping, BulkLoadProfile, BulkLoadTableStructure, FileDescription, Wrapper} from "qqq/models/processes/BulkLoadModels";
import {SubFormPreSubmitCallbackResultType} from "qqq/pages/processes/ProcessRun";
import React, {forwardRef, useImperativeHandle, useReducer, useState} from "react";
import ProcessViewForm from "./ProcessViewForm";


interface BulkLoadMappingFormProps
{
   processValues: any,
   tableMetaData: QTableMetaData,
   metaData: QInstance,
   setActiveStepLabel: (label: string) => void,
   frontendStep: QFrontendStepMetaData,
   processMetaData: QProcessMetaData,
}


/***************************************************************************
 ** process component - screen where user does a bulk-load file mapping.
 ***************************************************************************/
const BulkLoadFileMappingForm = forwardRef(({processValues, tableMetaData, metaData, setActiveStepLabel, frontendStep, processMetaData}: BulkLoadMappingFormProps, ref) =>
{
   const {setFieldValue} = useFormikContext();

   const savedBulkLoadProfileRecordProcessValue = processValues.savedBulkLoadProfileRecord;
   const [currentSavedBulkLoadProfile, setCurrentSavedBulkLoadProfile] = useState(savedBulkLoadProfileRecordProcessValue == null ? null : new QRecord(savedBulkLoadProfileRecordProcessValue));
   const [wrappedCurrentSavedBulkLoadProfile] = useState(new Wrapper<QRecord>(currentSavedBulkLoadProfile));

   const [fieldErrors, setFieldErrors] = useState({} as { [fieldName: string]: string });

   const [suggestedBulkLoadProfile] = useState(processValues.suggestedBulkLoadProfile as BulkLoadProfile);
   const [tableStructure] = useState(processValues.tableStructure as BulkLoadTableStructure);
   const [bulkLoadMapping, setBulkLoadMapping] = useState(BulkLoadMapping.fromBulkLoadProfile(tableStructure, processValues.bulkLoadProfile));
   const [wrappedBulkLoadMapping] = useState(new Wrapper<BulkLoadMapping>(bulkLoadMapping));

   const [fileDescription] = useState(new FileDescription(processValues.headerValues, processValues.headerLetters, processValues.bodyValuesPreview));
   fileDescription.setHasHeaderRow(bulkLoadMapping.hasHeaderRow);


   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   /////////////////////////////////////////////////////////////////////////////////////////////////
   // ok - so - ... Autocomplete, at least as we're using it for the layout field - doesn't like  //
   // to change its initial value.  So, we want to work hard to force the Header sub-component to //
   // re-render upon external changes to the layout (e.g., new profile being selected).           //
   // use this state-counter to make that happen (and let's please never speak of it again).      //
   /////////////////////////////////////////////////////////////////////////////////////////////////
   const [rerenderHeader, setRerenderHeader] = useState(1);

   ////////////////////////////////////////////////////////
   // ref-based callback for integration with ProcessRun //
   ////////////////////////////////////////////////////////
   useImperativeHandle(ref, () =>
   {
      return {
         preSubmit(): SubFormPreSubmitCallbackResultType
         {
            ///////////////////////////////////////////////////////////////////////////////////////////////
            // convert the BulkLoadMapping to a BulkLoadProfile - the thing that the backend understands //
            ///////////////////////////////////////////////////////////////////////////////////////////////
            const {haveErrors: haveProfileErrors, profile} = wrappedBulkLoadMapping.get().toProfile();

            const values: { [name: string]: any } = {};

            ////////////////////////////////////////////////////
            // always re-submit the full profile              //
            // note mostly a copy in BulkLoadValueMappingForm //
            ////////////////////////////////////////////////////
            values["version"] = profile.version;
            values["fieldListJSON"] = JSON.stringify(profile.fieldList);
            values["savedBulkLoadProfileId"] = wrappedCurrentSavedBulkLoadProfile.get()?.values?.get("id");
            values["layout"] = wrappedBulkLoadMapping.get().layout;
            values["hasHeaderRow"] = wrappedBulkLoadMapping.get().hasHeaderRow;

            let haveLocalErrors = false;
            const fieldErrors: { [fieldName: string]: string } = {};
            if (!values["layout"])
            {
               haveLocalErrors = true;
               fieldErrors["layout"] = "This field is required.";
            }

            if (values["hasHeaderRow"] == null || values["hasHeaderRow"] == undefined)
            {
               haveLocalErrors = true;
               fieldErrors["hasHeaderRow"] = "This field is required.";
            }
            setFieldErrors(fieldErrors);

            if(haveProfileErrors)
            {
               setTimeout(() => 
               {
                  document.querySelector(".bulkLoadFieldError")?.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
               }, 250);
            }

            return {maySubmit: !haveProfileErrors && !haveLocalErrors, values};
         }
      };
   });


   /***************************************************************************
    **
    ***************************************************************************/
   function bulkLoadProfileOnChangeCallback(profileRecord: QRecord | null)
   {
      setCurrentSavedBulkLoadProfile(profileRecord);
      wrappedCurrentSavedBulkLoadProfile.set(profileRecord);

      let newBulkLoadMapping: BulkLoadMapping;
      if (profileRecord)
      {
         newBulkLoadMapping = BulkLoadMapping.fromSavedProfileRecord(processValues.tableStructure, profileRecord);
      }
      else
      {
         newBulkLoadMapping = new BulkLoadMapping(processValues.tableStructure);
      }

      handleNewBulkLoadMapping(newBulkLoadMapping);
   }


   /***************************************************************************
    **
    ***************************************************************************/
   function bulkLoadProfileResetToSuggestedMappingCallback()
   {
      handleNewBulkLoadMapping(BulkLoadMapping.fromBulkLoadProfile(processValues.tableStructure, suggestedBulkLoadProfile));
   }


   /***************************************************************************
    **
    ***************************************************************************/
   function handleNewBulkLoadMapping(newBulkLoadMapping: BulkLoadMapping)
   {
      const newRequiredFields: BulkLoadField[] = [];
      for (let field of newBulkLoadMapping.requiredFields)
      {
         newRequiredFields.push(BulkLoadField.clone(field));
      }
      newBulkLoadMapping.requiredFields = newRequiredFields;

      setBulkLoadMapping(newBulkLoadMapping);
      wrappedBulkLoadMapping.set(newBulkLoadMapping);

      setFieldValue("hasHeaderRow", newBulkLoadMapping.hasHeaderRow);
      setFieldValue("layout", newBulkLoadMapping.layout);

      setRerenderHeader(rerenderHeader + 1);
   }

   if (currentSavedBulkLoadProfile)
   {
      setActiveStepLabel(`File Mapping / ${currentSavedBulkLoadProfile.values.get("label")}`);
   }
   else
   {
      setActiveStepLabel("File Mapping");
   }

   return (<Box>

      <Box py="1rem" display="flex">
         <SavedBulkLoadProfiles
            metaData={metaData}
            tableMetaData={tableMetaData}
            tableStructure={tableStructure}
            currentSavedBulkLoadProfileRecord={currentSavedBulkLoadProfile}
            currentMapping={bulkLoadMapping}
            bulkLoadProfileOnChangeCallback={bulkLoadProfileOnChangeCallback}
            bulkLoadProfileResetToSuggestedMappingCallback={bulkLoadProfileResetToSuggestedMappingCallback}
            fileDescription={fileDescription}
         />
      </Box>

      <BulkLoadMappingHeader
         key={rerenderHeader}
         bulkLoadMapping={bulkLoadMapping}
         fileDescription={fileDescription}
         tableStructure={tableStructure}
         fileName={processValues.fileBaseName}
         fieldErrors={fieldErrors}
         frontendStep={frontendStep}
         processMetaData={processMetaData}
         forceParentUpdate={() => forceUpdate()}
      />

      <Box mt="2rem">
         <BulkLoadFileMappingFields
            bulkLoadMapping={bulkLoadMapping}
            fileDescription={fileDescription}
            forceParentUpdate={() =>
            {
               setRerenderHeader(rerenderHeader + 1);
               forceUpdate();
            }}
         />
      </Box>

   </Box>);

});

export default BulkLoadFileMappingForm;


interface BulkLoadMappingHeaderProps
{
   fileDescription: FileDescription,
   fileName: string,
   bulkLoadMapping?: BulkLoadMapping,
   fieldErrors: { [fieldName: string]: string },
   tableStructure: BulkLoadTableStructure,
   forceParentUpdate?: () => void,
   frontendStep: QFrontendStepMetaData,
   processMetaData: QProcessMetaData,
}

/***************************************************************************
 ** private subcomponent - the header section of the bulk load file mapping screen.
 ***************************************************************************/
function BulkLoadMappingHeader({fileDescription, fileName, bulkLoadMapping, fieldErrors, tableStructure, forceParentUpdate, frontendStep, processMetaData}: BulkLoadMappingHeaderProps): JSX.Element
{
   const viewFields = [
      new QFieldMetaData({name: "fileName", label: "File Name", type: "STRING"}),
      new QFieldMetaData({name: "fileDetails", label: "File Details", type: "STRING"}),
   ];

   const viewValues = {
      "fileName": fileName,
      "fileDetails": `${fileDescription.getColumnNames().length} column${fileDescription.getColumnNames().length == 1 ? "" : "s"}`
   };

   const hasHeaderRowFormField = {name: "hasHeaderRow", label: "Does the file have a header row?", type: "checkbox", isRequired: true, isEditable: true};

   const layoutOptions = [
      {label: "Flat", id: "FLAT"},
      {label: "Tall", id: "TALL"},
      {label: "Wide", id: "WIDE"},
   ];

   if (!tableStructure.associations)
   {
      layoutOptions.splice(1);
   }

   const selectedLayout = layoutOptions.filter(o => o.id == bulkLoadMapping.layout)[0] ?? null;

   /***************************************************************************
    **
    ***************************************************************************/
   function hasHeaderRowChanged(newValue: any)
   {
      bulkLoadMapping.hasHeaderRow = newValue;
      fileDescription.hasHeaderRow = newValue;
      fieldErrors.hasHeaderRow = null;
      forceParentUpdate();
   }

   /***************************************************************************
    **
    ***************************************************************************/
   function layoutChanged(event: any, newValue: any)
   {
      bulkLoadMapping.switchLayout(newValue ? newValue.id : null);
      fieldErrors.layout = null;
      forceParentUpdate();
   }

   /***************************************************************************
    **
    ***************************************************************************/
   function getFormattedHelpContent(fieldName: string): JSX.Element
   {
      const field = frontendStep?.formFields?.find(f => f.name == fieldName);
      let helpRoles = ["PROCESS_SCREEN", "ALL_SCREENS"];

      let formattedHelpContent = <HelpContent helpContents={field?.helpContents} roles={helpRoles} helpContentKey={`process:${processMetaData?.name};field:${fieldName}`} />;
      if (formattedHelpContent)
      {
         const mt = field && field.type == QFieldType.BOOLEAN ? "-0.5rem" : "0.5rem";

         return <Box color="#757575" fontSize="0.875rem" mt={mt}>{formattedHelpContent}</Box>;
      }

      return null;
   }

   return (
      <Box>
         <h5>File Details</h5>
         <Box ml="1rem">
            <ProcessViewForm fields={viewFields} values={viewValues} columns={2} />
            <BulkLoadMappingFilePreview fileDescription={fileDescription} bulkLoadMapping={bulkLoadMapping} />
            <Grid container pt="1rem">
               <Grid item xs={12} md={6}>
                  <DynamicFormFieldLabel name={hasHeaderRowFormField.name} label={`${hasHeaderRowFormField.label} *`} />
                  <QDynamicFormField name={hasHeaderRowFormField.name} displayFormat={""} label={""} formFieldObject={hasHeaderRowFormField} type={"checkbox"} value={bulkLoadMapping.hasHeaderRow} onChangeCallback={hasHeaderRowChanged} />
                  {
                     fieldErrors.hasHeaderRow &&
                     <MDTypography component="div" variant="caption" color="error" fontWeight="regular" mt="0.25rem">
                        {<div className="fieldErrorMessage">{fieldErrors.hasHeaderRow}</div>}
                     </MDTypography>
                  }
                  {getFormattedHelpContent("hasHeaderRow")}
               </Grid>
               <Grid item xs={12} md={6}>
                  <DynamicFormFieldLabel name={"layout"} label={"File Layout *"} />
                  <Autocomplete
                     id={"layout"}
                     renderInput={(params) => (<TextField {...params} label={""} fullWidth variant="outlined" autoComplete="off" type="search" InputProps={{...params.InputProps}} sx={{"& .MuiOutlinedInput-root": {borderRadius: "0.75rem"}}} />)}
                     options={layoutOptions}
                     multiple={false}
                     defaultValue={selectedLayout}
                     onChange={layoutChanged}
                     getOptionLabel={(option) => typeof (option) == "string" ? option : (option?.label ?? "")}
                     isOptionEqualToValue={(option, value) => option == null && value == null || option.id == value.id}
                     renderOption={(props, option, state) => (<li {...props}>{option?.label ?? ""}</li>)}
                     disableClearable
                     sx={{"& .MuiOutlinedInput-root": {padding: "0"}}}
                  />
                  {
                     fieldErrors.layout &&
                     <MDTypography component="div" variant="caption" color="error" fontWeight="regular" mt="0.25rem">
                        {<div className="fieldErrorMessage">{fieldErrors.layout}</div>}
                     </MDTypography>
                  }
                  {getFormattedHelpContent("layout")}
               </Grid>
            </Grid>
         </Box>
      </Box>
   );
}


interface BulkLoadMappingFilePreviewProps
{
   fileDescription: FileDescription,
   bulkLoadMapping?: BulkLoadMapping
}

/***************************************************************************
 ** private subcomponent - the file-preview section of the bulk load file mapping screen.
 ***************************************************************************/
function BulkLoadMappingFilePreview({fileDescription, bulkLoadMapping}: BulkLoadMappingFilePreviewProps): JSX.Element
{
   const rows: number[] = [];
   for (let i = 0; i < fileDescription.bodyValuesPreview[0].length; i++)
   {
      rows.push(i);
   }

   /***************************************************************************
    **
    ***************************************************************************/
   function getValue(i: number, j: number)
   {
      const value = fileDescription.bodyValuesPreview[j][i];
      if (value == null)
      {
         return "";
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // this was useful at one point in time when we had an object coming back for xlsx files with many different data types //
      // we'd see a .string attribute, which would have the value we'd want to show.  not using it now, but keep in case      //
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // @ts-ignore
      if (value && value.string)
      {
         // @ts-ignore
         return (value.string);
      }
      return `${value}`;
   }

   /***************************************************************************
    **
    ***************************************************************************/
   function getHeaderColor(count: number): string
   {
      if (count > 0)
      {
         return "blue";
      }

      return "black";
   }

   /***************************************************************************
    **
    ***************************************************************************/
   function getCursor(count: number): string
   {
      if (count > 0)
      {
         return "pointer";
      }

      return "default";
   }

   /***************************************************************************
    **
    ***************************************************************************/
   function getColumnTooltip(fields: BulkLoadField[])
   {
      return (<Box>
         This column is mapped to the field{fields.length == 1 ? "" : "s"}:
         <ul style={{marginLeft: "1rem"}}>
            {fields.map((field, i) => <li key={i}>{field.getQualifiedLabel()}</li>)}
         </ul>
      </Box>);
   }

   return (
      <Box sx={{"& table, & td": {border: "1px solid black", borderCollapse: "collapse", padding: "0 0.25rem", fontSize: "0.875rem", whiteSpace: "nowrap"}}}>
         <Box sx={{width: "100%", overflow: "auto"}}>
            <table cellSpacing="0" width="100%">
               <thead>
                  <tr style={{backgroundColor: "#d3d3d3", height: "1.75rem"}}>
                     <td></td>
                     {fileDescription.headerLetters.map((letter, index) =>
                     {
                        const fields = bulkLoadMapping.getFieldsForColumnIndex(index);
                        const count = fields.length;
                        return (<td key={letter} style={{textAlign: "center", color: getHeaderColor(count), cursor: getCursor(count)}}>
                           <>
                              {
                                 count > 0 &&
                                 <Tooltip title={getColumnTooltip(fields)} placement="top" enterDelay={500}>
                                    <Box>
                                       {letter}
                                       <Badge badgeContent={count} variant={"standard"} color="secondary" sx={{marginTop: ".75rem"}}><Icon></Icon></Badge>
                                    </Box>
                                 </Tooltip>
                              }
                              {
                                 count == 0 && <Box>{letter}</Box>
                              }
                           </>
                        </td>);
                     })}
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td style={{backgroundColor: "#d3d3d3", textAlign: "center"}}>1</td>

                     {fileDescription.headerValues.map((value, index) =>
                     {
                        const fields = bulkLoadMapping.getFieldsForColumnIndex(index);
                        const count = fields.length;
                        const tdStyle = {color: getHeaderColor(count), cursor: getCursor(count), backgroundColor: ""};

                        if(fileDescription.hasHeaderRow)
                        {
                           tdStyle.backgroundColor = "#ebebeb";

                           if(count > 0)
                           {
                              return <td key={value} style={tdStyle}>
                                 <Tooltip title={getColumnTooltip(fields)} placement="top" enterDelay={500}><Box>{value}</Box></Tooltip>
                              </td>
                           }
                           else
                           {
                              return <td key={value} style={tdStyle}>{value}</td>
                           }
                        }
                        else
                        {
                           return <td key={value} style={tdStyle}>{value}</td>
                        }
                     }
                     )}
                  </tr>
                  {rows.map((i) => (
                     <tr key={i}>
                        <td style={{backgroundColor: "#d3d3d3", textAlign: "center"}}>{i + 2}</td>
                        {fileDescription.headerLetters.map((letter, j) => <td key={j}>{getValue(i, j)}</td>)}
                     </tr>
                  ))}
               </tbody>
            </table>
         </Box>
      </Box>
   );
}


