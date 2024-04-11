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
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import QContext from "QContext";
import colors from "qqq/assets/theme/base/colors";
import FieldAutoComplete from "qqq/components/misc/FieldAutoComplete";
import HelpContent, {hasHelpContent} from "qqq/components/misc/HelpContent";
import {PivotTableGroupByElement} from "qqq/components/widgets/misc/PivotTableGroupByElement";
import {PivotTableValueElement} from "qqq/components/widgets/misc/PivotTableValueElement";
import Widget, {HeaderToggleComponent} from "qqq/components/widgets/Widget";
import {PivotObjectKey, PivotTableDefinition, PivotTableFunction, pivotTableFunctionLabels, PivotTableGroupBy, PivotTableValue} from "qqq/models/misc/PivotTableDefinitionModels";
import QQueryColumns from "qqq/models/query/QQueryColumns";
import Client from "qqq/utils/qqq/Client";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

export const DragItemTypes =
   {
      ROW: "row",
      COLUMN: "column",
      VALUE: "value"
   };

export const buttonSX =
   {
      border: `1px solid ${colors.grayLines.main} !important`,
      borderRadius: "0.75rem",
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: "400",
      width: "160px",
      paddingLeft: 0,
      paddingRight: 0,
      color: colors.dark.main,
      "&:hover": {color: colors.dark.main},
      "&:focus": {color: colors.dark.main},
      "&:focus:not(:hover)": {color: colors.dark.main},
   };

export const xIconButtonSX =
   {
      border: `1px solid ${colors.grayLines.main} !important`,
      borderRadius: "0.75rem",
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: "400",
      width: "40px",
      minWidth: "40px",
      paddingLeft: 0,
      paddingRight: 0,
      color: colors.error.main,
      "&:hover": {color: colors.error.main},
      "&:focus": {color: colors.error.main},
      "&:focus:not(:hover)": {color: colors.error.main},
   };

export const fieldAutoCompleteTextFieldSX =
   {
      "& .MuiInputBase-input": {fontSize: "1rem", padding: "0 !important"}
   };


/*******************************************************************************
 **
 *******************************************************************************/
export function getSelectedFieldForAutoComplete(tableMetaData: QTableMetaData, fieldName: string)
{
   if (fieldName)
   {
      let [field, fieldTable] = FilterUtils.getField(tableMetaData, fieldName);
      if (field && fieldTable)
      {
         return ({field: field, table: fieldTable, fieldName: fieldName});
      }
   }

   return (null);
}


/*******************************************************************************
 ** component props
 *******************************************************************************/
interface PivotTableSetupWidgetProps
{
   isEditable: boolean;
   widgetMetaData: QWidgetMetaData;
   recordValues: { [name: string]: any };
   onSaveCallback?: (values: { [name: string]: any }) => void;
}


/*******************************************************************************
 ** default values for props
 *******************************************************************************/
PivotTableSetupWidget.defaultProps = {
   onSaveCallback: null
};


const qController = Client.getInstance();

/*******************************************************************************
 ** Component to edit the setup of a Pivot Table - rows, columns, values!
 *******************************************************************************/
export default function PivotTableSetupWidget({isEditable, widgetMetaData, recordValues, onSaveCallback}: PivotTableSetupWidgetProps): JSX.Element
{
   const [metaData, setMetaData] = useState(null as QInstance);
   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);

   const [enabled, setEnabled] = useState(!!recordValues["usePivotTable"]);

   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const [pivotTableDefinition, setPivotTableDefinition] = useState(null as PivotTableDefinition);

   const [usedGroupByFieldNames, setUsedGroupByFieldNames] = useState([] as string[]);
   const [availableFieldNames, setAvailableFieldNames] = useState([] as string[]);

   const {helpHelpActive} = useContext(QContext);

   //////////////////
   // initial load //
   //////////////////
   useEffect(() =>
   {
      if (!pivotTableDefinition)
      {
         let originalPivotTableDefinition = recordValues["pivotTableJson"] && JSON.parse(recordValues["pivotTableJson"]) as PivotTableDefinition;
         if (originalPivotTableDefinition)
         {
            setEnabled(true);
         }
         else if (!originalPivotTableDefinition)
         {
            originalPivotTableDefinition = new PivotTableDefinition();
         }

         for (let i = 0; i < originalPivotTableDefinition?.rows?.length; i++)
         {
            if (!originalPivotTableDefinition?.rows[i].key)
            {
               originalPivotTableDefinition.rows[i].key = PivotObjectKey.next();
            }
         }

         for (let i = 0; i < originalPivotTableDefinition?.columns?.length; i++)
         {
            if (!originalPivotTableDefinition?.columns[i].key)
            {
               originalPivotTableDefinition.columns[i].key = PivotObjectKey.next();
            }
         }

         for (let i = 0; i < originalPivotTableDefinition?.values?.length; i++)
         {
            if (!originalPivotTableDefinition?.values[i].key)
            {
               originalPivotTableDefinition.values[i].key = PivotObjectKey.next();
            }
         }

         setPivotTableDefinition(originalPivotTableDefinition);
         updateUsedGroupByFieldNames(originalPivotTableDefinition);
      }

      if(recordValues["columnsJson"])
      {
         updateAvailableFieldNames(JSON.parse(recordValues["columnsJson"]) as QQueryColumns)
      }

      (async () =>
      {
         setMetaData(await qController.loadMetaData());
      })();
   });

   /////////////////////////////////////////////////////////////////////
   // handle the table name changing - load current table's meta-data //
   /////////////////////////////////////////////////////////////////////
   useEffect(() =>
   {
      if (recordValues["tableName"] && (tableMetaData == null || tableMetaData.name != recordValues["tableName"]))
      {
         (async () =>
         {
            const tableMetaData = await qController.loadTableMetaData(recordValues["tableName"]);
            setTableMetaData(tableMetaData);
         })();
      }
   }, [recordValues]);


   const helpRoles = isEditable ? [recordValues["id"] ? "EDIT_SCREEN" : "INSERT_SCREEN", "WRITE_SCREENS", "ALL_SCREENS"] : ["VIEW_SCREEN", "READ_SCREENS", "ALL_SCREENS"];

   /*******************************************************************************
    **
    *******************************************************************************/
   function showHelp(slot: string)
   {
      return (helpHelpActive || hasHelpContent(widgetMetaData?.helpContent?.get(slot), helpRoles));
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function getHelpContent(slot: string)
   {
      const key = `widget:${widgetMetaData.name};slot:${slot}`;
      return <HelpContent helpContents={widgetMetaData?.helpContent?.get(slot)} roles={helpRoles} helpContentKey={key} />;
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function toggleEnabled()
   {
      const newEnabled = !!!getEnabled();
      setEnabled(newEnabled);
      onSaveCallback({usePivotTable: newEnabled});
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function getEnabled()
   {
      return (enabled);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function addGroupBy(rowsOrColumns: "rows" | "columns")
   {
      if (!pivotTableDefinition[rowsOrColumns])
      {
         pivotTableDefinition[rowsOrColumns] = [];
      }

      pivotTableDefinition[rowsOrColumns].push(new PivotTableGroupBy());
      onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      forceUpdate();
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function groupByChangedCallback()
   {
      onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      updateUsedGroupByFieldNames();
      forceUpdate();
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function addValue()
   {
      if (!pivotTableDefinition.values)
      {
         pivotTableDefinition.values = [];
      }

      pivotTableDefinition.values.push(new PivotTableValue());
      onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      forceUpdate();
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function removeValue(index: number)
   {
      pivotTableDefinition.values.splice(index, 1);
      onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      forceUpdate();
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function updateUsedGroupByFieldNames(ptd: PivotTableDefinition = pivotTableDefinition)
   {
      const usedFieldNames: string[] = [];

      for (let i = 0; i < ptd?.rows?.length; i++)
      {
         usedFieldNames.push(ptd?.rows[i].fieldName);
      }

      for (let i = 0; i < ptd?.columns?.length; i++)
      {
         usedFieldNames.push(ptd?.columns[i].fieldName);
      }

      setUsedGroupByFieldNames(usedFieldNames);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function updateAvailableFieldNames(columns: QQueryColumns)
   {
      const fieldNames: string[] = [];
      for (let i = 0; i < columns?.columns?.length; i++)
      {
         if(columns.columns[i].isVisible)
         {
            fieldNames.push(columns.columns[i].name);
         }
      }
      setAvailableFieldNames(fieldNames);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function renderOneValue(value: PivotTableValue, index: number)
   {
      if (!isEditable)
      {
         const selectedField = getSelectedFieldForAutoComplete(tableMetaData, value.fieldName);
         if (selectedField && value.function)
         {
            const label = selectedField.table.name == tableMetaData.name ? selectedField.field.label : selectedField.table.label + ": " + selectedField.field.label;
            return (<Box mr="0.375rem" mb="0.5rem" border={`1px solid ${colors.grayLines.main}`} borderRadius="0.75rem" p="0.25rem 0.75rem">{pivotTableFunctionLabels[value.function]} of {label}</Box>);
         }

         return (<React.Fragment />);
      }

      const handleFieldChange = (event: any, newValue: any, reason: string) =>
      {
         value.fieldName = newValue ? newValue.fieldName : null;
         onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      };

      const handleFunctionChange = (event: any, newValue: any, reason: string) =>
      {
         value.function = newValue ? newValue.id : null;
         onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      };

      const functionOptions: any[] = [];
      let defaultFunctionValue = null;
      for (let pivotTableFunctionKey in PivotTableFunction)
      {
         // @ts-ignore any?
         const label = "" + pivotTableFunctionLabels[pivotTableFunctionKey];
         const option = {id: pivotTableFunctionKey, label: label};
         functionOptions.push(option);

         if (option.id == value.function)
         {
            defaultFunctionValue = option;
         }
      }

      // maybe cursor:grab (and then change to "grabbing")
      return (<Box display="flex" p="0.5rem" pl="0" gap="0.5rem" alignItems="center">
         <Box>
            <Icon sx={{cursor: "ns-resize"}}>drag_indicator</Icon>
         </Box>
         <Box width="100%">
            <FieldAutoComplete
               id={`values-field-${index}`}
               label={null}
               variant="outlined"
               textFieldSX={fieldAutoCompleteTextFieldSX}
               metaData={metaData}
               tableMetaData={tableMetaData}
               handleFieldChange={handleFieldChange}
               defaultValue={getSelectedFieldForAutoComplete(tableMetaData, value.fieldName)}
            />
         </Box>
         <Box width="330px">
            <Autocomplete
               id={`values-field-${index}`}
               renderInput={(params) => (<TextField {...params} label={null} variant="outlined" sx={fieldAutoCompleteTextFieldSX} autoComplete="off" type="search" InputProps={{...params.InputProps}} />)}
               // @ts-ignore
               defaultValue={defaultFunctionValue}
               options={functionOptions}
               onChange={handleFunctionChange}
               isOptionEqualToValue={(option, value) => option.id === value.id}
               getOptionLabel={(option) => option.label}
               // todo? renderOption={(props, option, state) => renderFieldOption(props, option, state)}
               autoSelect={true}
               autoHighlight={true}
               disableClearable
               // slotProps={{popper: {className: "filterCriteriaRowColumnPopper", style: {padding: 0, width: "250px"}}}}
               // {...alsoOpen}
            />
         </Box>
         <Box>
            <Button sx={xIconButtonSX} onClick={() => removeValue(index)}><Icon>clear</Icon></Button>
         </Box>
      </Box>);
   }


   /*******************************************************************************
    ** drag & drop callback to move one of the pivot-table group-bys (rows/columns)
    *******************************************************************************/
   const moveGroupBy = useCallback((rowsOrColumns: "rows" | "columns", dragIndex: number, hoverIndex: number) =>
   {
      const array = pivotTableDefinition[rowsOrColumns];
      const dragItem = array[dragIndex];
      array.splice(dragIndex, 1);
      array.splice(hoverIndex, 0, dragItem);

      onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      forceUpdate();
   }, [pivotTableDefinition]);


   /*******************************************************************************
    ** drag & drop callback to move one of the pivot-table values
    *******************************************************************************/
   const moveValue = useCallback((dragIndex: number, hoverIndex: number) =>
   {
      const array = pivotTableDefinition.values;
      const dragItem = array[dragIndex];
      array.splice(dragIndex, 1);
      array.splice(hoverIndex, 0, dragItem);

      onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
      forceUpdate();
   }, [pivotTableDefinition]);


   /////////////////////////////////////////////////////////////
   // add toggle component to widget header for editable mode //
   /////////////////////////////////////////////////////////////
   const labelAdditionalElementsRight: JSX.Element[] = [];
   if (isEditable)
   {
      labelAdditionalElementsRight.push(<HeaderToggleComponent label="Use Pivot Table?" getValue={() => enabled} onClickCallback={toggleEnabled} />);
   }

   const selectTableFirstTooltipTitle = tableMetaData ? null : "You must select a table before you can set up a pivot table";


   /*******************************************************************************
    ** render a group-by (row or column)
    *******************************************************************************/
   const renderGroupBy = useCallback(
      (groupBy: PivotTableGroupBy, rowsOrColumns: "rows" | "columns", index: number) =>
      {
         return (
            <PivotTableGroupByElement
               key={groupBy.fieldName}
               index={index}
               id={`${groupBy.key}`}
               dragCallback={moveGroupBy}
               metaData={metaData}
               tableMetaData={tableMetaData}
               pivotTableDefinition={pivotTableDefinition}
               usedGroupByFieldNames={usedGroupByFieldNames}
               availableFieldNames={availableFieldNames}
               isEditable={isEditable}
               groupBy={groupBy}
               rowsOrColumns={rowsOrColumns}
               callback={groupByChangedCallback}
            />
         );
      },
      [tableMetaData, usedGroupByFieldNames, availableFieldNames],
   );


   /*******************************************************************************
    ** render a pivot-table value (row or column)
    *******************************************************************************/
   const renderValue = useCallback(
      (value: PivotTableValue, index: number) =>
      {
         return (
            <PivotTableValueElement
               key={value.key}
               index={index}
               id={`${value.key}`}
               dragCallback={moveValue}
               metaData={metaData}
               tableMetaData={tableMetaData}
               pivotTableDefinition={pivotTableDefinition}
               availableFieldNames={availableFieldNames}
               isEditable={isEditable}
               value={value}
               callback={groupByChangedCallback}
            />
         );
      },
      [tableMetaData, usedGroupByFieldNames, availableFieldNames],
   );


   return (<Widget widgetMetaData={widgetMetaData} labelAdditionalElementsRight={labelAdditionalElementsRight}>
      {enabled && pivotTableDefinition &&
         <DndProvider backend={HTML5Backend}>
            {
               showHelp("sectionSubhead") &&
               <Box color={colors.gray.main} pb={"0.5rem"} fontSize={"0.875rem"}>
                  {getHelpContent("sectionSubhead")}
               </Box>
            }
            <Grid container spacing="16">

               <Grid item lg={4} md={6} xs={12}>
                  <h5>Rows</h5>
                  <Box fontSize="1rem">
                     {
                        tableMetaData && (<div>{pivotTableDefinition?.rows?.map((row, i) => renderGroupBy(row, "rows", i))}</div>)
                     }
                  </Box>
                  {
                     isEditable &&
                     <Box mt="0.375rem">
                        <Tooltip title={selectTableFirstTooltipTitle}>
                           <span><Button disabled={tableMetaData == null} sx={buttonSX} onClick={() => addGroupBy("rows")}>+ Add new row</Button></span>
                        </Tooltip>
                     </Box>
                  }
               </Grid>

               <Grid item lg={4} md={6} xs={12}>
                  <h5>Columns</h5>
                  <Box fontSize="1rem">
                     {
                        tableMetaData && (<div>{pivotTableDefinition?.columns?.map((column, i) => renderGroupBy(column, "columns", i))}</div>)
                     }
                  </Box>
                  {
                     isEditable &&
                     <Box mt="0.375rem">
                        <Tooltip title={selectTableFirstTooltipTitle}>
                           <span><Button disabled={tableMetaData == null} sx={buttonSX} onClick={() => addGroupBy("columns")}>+ Add new column</Button></span>
                        </Tooltip>
                     </Box>
                  }
               </Grid>

               <Grid item lg={4} md={6} xs={12}>
                  <h5>Values</h5>
                  <Box fontSize="1rem">
                     {
                        tableMetaData && (<div>{pivotTableDefinition?.values?.map((value, i) => renderValue(value, i))}</div>)
                     }
                  </Box>
                  {
                     isEditable &&
                     <Box mt="0.375rem">
                        <Tooltip title={selectTableFirstTooltipTitle}>
                           <span><Button disabled={tableMetaData == null} sx={buttonSX} onClick={addValue}>+ Add new value</Button></span>
                        </Tooltip>
                     </Box>
                  }
               </Grid>

            </Grid>
            {/*
            <Box mt={"1rem"}>
               <h5>Preview</h5>
               <table>
                  <tr>
                     <th style={{textAlign: "left", fontSize: "0.875rem"}}></th>
                     <th style={{textAlign: "left", fontSize: "0.875rem"}}>Column Labels</th>
                  </tr>
                  {
                     pivotTableDefinition?.columns?.map((column, i) =>
                        (
                           <tr key={column.key}>
                              <th style={{textAlign: "left", fontSize: "0.875rem"}}></th>
                              <th style={{textAlign: "left", fontSize: "0.875rem"}}>{column.fieldName}</th>
                           </tr>
                        ))
                  }
                  <tr>
                     <th style={{textAlign: "left", fontSize: "0.875rem"}}>Row Labels</th>
                     {
                        pivotTableDefinition?.values?.map((value, i) =>
                           (
                              <th key={value.key} style={{textAlign: "left", fontSize: "0.875rem"}}>{value.function} of {value.fieldName}</th>
                           ))
                     }
                  </tr>
                  {
                     pivotTableDefinition?.rows?.map((row, i) =>
                        (
                           <tr key={row.key}>
                              <th style={{textAlign: "left", fontSize: "0.875rem", paddingLeft: (i * 1) + "rem"}}>{row.fieldName}</th>
                           </tr>
                        ))
                  }
               </table>
            </Box>
            */}
         </DndProvider>
      }
   </Widget>);
}
