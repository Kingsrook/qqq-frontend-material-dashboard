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
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import type {Identifier, XYCoord} from "dnd-core";
import colors from "qqq/assets/theme/base/colors";
import FieldAutoComplete from "qqq/components/misc/FieldAutoComplete";
import {DragItemTypes, fieldAutoCompleteTextFieldSX, getSelectedFieldForAutoComplete, xIconButtonSX} from "qqq/components/widgets/misc/PivotTableSetupWidget";
import {PivotTableDefinition, PivotTableFunction, pivotTableFunctionLabels, PivotTableValue} from "qqq/models/misc/PivotTableDefinitionModels";
import React, {FC, useRef} from "react";
import {useDrag, useDrop} from "react-dnd";


/*******************************************************************************
 ** component props
 *******************************************************************************/
export interface PivotTableValueElementProps
{
   id: string;
   index: number;
   dragCallback: (dragIndex: number, hoverIndex: number) => void;
   metaData: QInstance;
   tableMetaData: QTableMetaData;
   pivotTableDefinition: PivotTableDefinition;
   availableFieldNames: string[];
   isEditable: boolean;
   value: PivotTableValue;
   callback: () => void;
}


/*******************************************************************************
 ** item to support react-dnd
 *******************************************************************************/
interface DragItem
{
   index: number;
   id: string;
   type: string;
}


/*******************************************************************************
 ** Element to render 1 pivot-table value.
 *******************************************************************************/
export const PivotTableValueElement: FC<PivotTableValueElementProps> = ({id, index, dragCallback, metaData, tableMetaData, pivotTableDefinition, availableFieldNames, value, isEditable, callback}) =>
{
   ////////////////////////////////////////////////////////////////////////////
   // credit: https://react-dnd.github.io/react-dnd/examples/sortable/simple //
   ////////////////////////////////////////////////////////////////////////////
   const ref = useRef<HTMLDivElement>(null);
   const [{handlerId}, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
      {
         accept: DragItemTypes.VALUE,
         collect(monitor)
         {
            return {
               handlerId: monitor.getHandlerId(),
            };
         },
         hover(item: DragItem, monitor)
         {
            if (!ref.current)
            {
               return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex)
            {
               return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
            {
               return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
            {
               return;
            }

            // Time to actually perform the action
            dragCallback(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here! Generally it's better to avoid mutations,
            // but it's good here for the sake of performance to avoid expensive index searches.
            item.index = hoverIndex;
         },
      });

   const [{isDragging}, drag] = useDrag({
      type: DragItemTypes.VALUE,
      item: () =>
      {
         return {id, index};
      },
      collect: (monitor: any) => ({
         isDragging: monitor.isDragging(),
      }),
   });


   /*******************************************************************************
    ** event handler for user selecting a field
    *******************************************************************************/
   const handleFieldChange = (event: any, newValue: any, reason: string) =>
   {
      value.fieldName = newValue ? newValue.fieldName : null;
      callback();
   };


   /*******************************************************************************
    ** event handler for user selecting a function
    *******************************************************************************/
   const handleFunctionChange = (event: any, newValue: any, reason: string) =>
   {
      value.function = newValue ? newValue.id : null;
      callback();
   };


   /*******************************************************************************
    ** event handler for clicking remove button
    *******************************************************************************/
   function removeValue(index: number)
   {
      pivotTableDefinition.values.splice(index, 1);
      callback();
   }


   /////////////////////////////////////////////////////////////////////
   // if we're not on an edit screen, return a simpler read-only view //
   /////////////////////////////////////////////////////////////////////
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

   ///////////////////////////////////////////////////////////////////////////////
   // figure out functions to display in drop down, plus selected/default value //
   ///////////////////////////////////////////////////////////////////////////////
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

   drag(drop(ref));

   /*
   return (<Box ref={ref} display="flex" p="0.5rem" pl="0" gap="0.5rem" alignItems="center" sx={{backgroundColor: "white", opacity: isDragging ? 0 : 1}} data-handler-id={handlerId}>
      <Box sx={{whiteSpace: "nowrap"}}>
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
            defaultValue={getSelectedFieldForAutoComplete(tableMetaData, groupBy.fieldName)}
         />
      </Box>
      <Box>
         <Button sx={xIconButtonSX} onClick={() => removeGroupBy(index, rowsOrColumns)}><Icon>clear</Icon></Button>
      </Box>
   </Box>);
    */

   return (<Box ref={ref} display="flex" p="0.5rem" pl="0" gap="0.5rem" alignItems="center" sx={{backgroundColor: "white", opacity: isDragging ? 0 : 1}} data-handler-id={handlerId}>
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
            availableFieldNames={availableFieldNames}
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

};
