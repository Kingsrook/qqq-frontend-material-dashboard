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
import colors from "qqq/assets/theme/base/colors";
import FieldAutoComplete from "qqq/components/misc/FieldAutoComplete";
import Widget, {HeaderToggleComponent} from "qqq/components/widgets/Widget";
import Client from "qqq/utils/qqq/Client";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import React, {useEffect, useReducer, useState} from "react";

///////////////////////////////////////////////////////////////////////////////
// put a unique key value in all the pivot table group-by and value objects, //
// to help react rendering be sane.                                          //
///////////////////////////////////////////////////////////////////////////////
let pivotObjectKey = new Date().getTime();

interface PivotTableSetupWidgetProps
{
   isEditable: boolean;
   widgetMetaData: QWidgetMetaData;
   recordValues: { [name: string]: any };
   onSaveCallback?: (values: { [name: string]: any }) => void;
}

PivotTableSetupWidget.defaultProps = {
   onSaveCallback: null
};

export class PivotTableDefinition
{
   rows: PivotTableGroupBy[];
   columns: PivotTableGroupBy[];
   values: PivotTableValue[];
}

export class PivotTableGroupBy
{
   fieldName: string;
   key: number;

   constructor()
   {
      this.key = pivotObjectKey++;
   }
}

export class PivotTableValue
{
   fieldName: string;
   function: PivotTableFunction;

   key: number;

   constructor()
   {
      this.key = pivotObjectKey++;
   }
}

enum PivotTableFunction
{
   AVERAGE = "AVERAGE",
   COUNT = "COUNT",
   COUNT_NUMS = "COUNT_NUMS",
   MAX = "MAX",
   MIN = "MIN",
   PRODUCT = "PRODUCT",
   STD_DEV = "STD_DEV",
   STD_DEVP = "STD_DEVP",
   SUM = "SUM",
   VAR = "VAR",
   VARP = "VARP",
}

const pivotTableFunctionLabels =
   {
      "AVERAGE": "Average",
      "COUNT": "Count Values (COUNTA)",
      "COUNT_NUMS": "Count Numbers (COUNT)",
      "MAX": "Max",
      "MIN": "Min",
      "PRODUCT": "Product",
      "STD_DEV": "StdDev",
      "STD_DEVP": "StdDevp",
      "SUM": "Sum",
      "VAR": "Var",
      "VARP": "Varp"
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


   //////////////////
   // initial load //
   //////////////////
   useEffect(() =>
   {
      (async () =>
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
                  originalPivotTableDefinition.rows[i].key = pivotObjectKey++;
               }
            }

            for (let i = 0; i < originalPivotTableDefinition?.columns?.length; i++)
            {
               if (!originalPivotTableDefinition?.columns[i].key)
               {
                  originalPivotTableDefinition.columns[i].key = pivotObjectKey++;
               }
            }

            for (let i = 0; i < originalPivotTableDefinition?.values?.length; i++)
            {
               if (!originalPivotTableDefinition?.values[i].key)
               {
                  originalPivotTableDefinition.values[i].key = pivotObjectKey++;
               }
            }

            setPivotTableDefinition(originalPivotTableDefinition);
         }

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
   function removeGroupBy(index: number, rowsOrColumns: "rows" | "columns")
   {
      pivotTableDefinition[rowsOrColumns].splice(index, 1);
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


   const buttonSX =
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

   const xIconButtonSX =
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

   const fieldAutoCompleteTextFieldSX =
      {
         "& .MuiInputBase-input": {fontSize: "1rem", padding: "0 !important"}
      };


   /*******************************************************************************
    **
    *******************************************************************************/
   function updateUsedGroupByFieldNames()
   {
      const hiddenFieldNames: string[] = [];

      for (let i = 0; i < pivotTableDefinition?.rows?.length; i++)
      {
         hiddenFieldNames.push(pivotTableDefinition?.rows[i].fieldName);
      }

      for (let i = 0; i < pivotTableDefinition?.columns?.length; i++)
      {
         hiddenFieldNames.push(pivotTableDefinition?.columns[i].fieldName);
      }

      setUsedGroupByFieldNames(hiddenFieldNames);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function getSelectedFieldForAutoComplete(fieldName: string)
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
    **
    *******************************************************************************/
   function renderOneGroupBy(groupBy: PivotTableGroupBy, index: number, rowsOrColumns: "rows" | "columns")
   {
      if(!isEditable)
      {
         const selectedField = getSelectedFieldForAutoComplete(groupBy.fieldName);
         if(selectedField)
         {
            const label = selectedField.table.name == tableMetaData.name ? selectedField.field.label : selectedField.table.label + ": " + selectedField.field.label
            return (<Box mr="0.375rem" mb="0.5rem" border={`1px solid ${colors.grayLines.main}`} borderRadius="0.75rem" p="0.25rem 0.75rem">{label}</Box>);
         }

         return (<React.Fragment />);
      }

      const handleFieldChange = (event: any, newValue: any, reason: string) =>
      {
         groupBy.fieldName = newValue ? newValue.fieldName : null;
         onSaveCallback({pivotTableJson: JSON.stringify(pivotTableDefinition)});
         updateUsedGroupByFieldNames();
      };

      // maybe cursor:grab (and then change to "grabbing")
      return (<Box display="flex" p="0.5rem" pl="0" gap="0.5rem" alignItems="center">
         <Box>
            <Icon sx={{cursor: "ns-resize"}}>drag_indicator</Icon>
         </Box>
         <Box width="100%">
            <FieldAutoComplete
               id={`${rowsOrColumns}-${index}`}
               label={null}
               variant="outlined"
               textFieldSX={fieldAutoCompleteTextFieldSX}
               metaData={metaData}
               tableMetaData={tableMetaData}
               handleFieldChange={handleFieldChange}
               hiddenFieldNames={usedGroupByFieldNames}
               defaultValue={getSelectedFieldForAutoComplete(groupBy.fieldName)}
            />
         </Box>
         <Box>
            <Button sx={xIconButtonSX} onClick={() => removeGroupBy(index, rowsOrColumns)}><Icon>clear</Icon></Button>
         </Box>
      </Box>);
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function renderOneValue(value: PivotTableValue, index: number)
   {
      if(!isEditable)
      {
         const selectedField = getSelectedFieldForAutoComplete(value.fieldName);
         if(selectedField && value.function)
         {
            const label = selectedField.table.name == tableMetaData.name ? selectedField.field.label : selectedField.table.label + ": " + selectedField.field.label
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
         
         if(option.id == value.function)
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
               defaultValue={getSelectedFieldForAutoComplete(value.fieldName)}
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


   /////////////////////////////////////////////////////////////
   // add toggle component to widget header for editable mode //
   /////////////////////////////////////////////////////////////
   const labelAdditionalElementsRight: JSX.Element[] = [];
   if (isEditable)
   {
      labelAdditionalElementsRight.push(<HeaderToggleComponent label="Use Pivot Table?" getValue={() => enabled} onClickCallback={toggleEnabled} />);
   }

   const selectTableFirstTooltipTitle = tableMetaData ? null : "You must select a table before you can set up a pivot table";

   return (<Widget widgetMetaData={widgetMetaData} labelAdditionalElementsRight={labelAdditionalElementsRight}>
      {enabled && pivotTableDefinition &&
         <React.Fragment>
            <Grid container spacing="16" >

               <Grid item lg={4} md={6} xs={12}>
                  <h5>Rows</h5>
                  <Box fontSize="1rem">
                     {
                        tableMetaData && pivotTableDefinition.rows?.map((row: PivotTableGroupBy, index: number) =>
                           (
                              <React.Fragment key={row.key}>{renderOneGroupBy(row, index, "rows")}</React.Fragment>
                           ))
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
                        tableMetaData && pivotTableDefinition.columns?.map((column: PivotTableGroupBy, index: number) =>
                           (
                              <React.Fragment key={column.key}>{renderOneGroupBy(column, index, "columns")}</React.Fragment>
                           ))
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
                        tableMetaData && pivotTableDefinition.values?.map((value: PivotTableValue, index: number) =>
                           (
                              <React.Fragment key={value.key}>{renderOneValue(value, index)}</React.Fragment>
                           ))
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
         </React.Fragment>
      }
   </Widget>);
}
