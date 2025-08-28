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

import {QFieldMetaData} from "@qrunio/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import Box from "@mui/material/Box";
import QDynamicFormField from "qqq/components/forms/DynamicFormField";
import DynamicFormUtils from "qqq/components/forms/DynamicFormUtils";
import BlockElementWrapper from "qqq/components/widgets/blocks/BlockElementWrapper";
import {StandardBlockComponentProps} from "qqq/components/widgets/blocks/BlockModels";
import React, {SyntheticEvent, useState} from "react";

/*******************************************************************************
 ** Block that renders ... a text input
 **
 *******************************************************************************/
export default function InputFieldBlock({widgetMetaData, data, actionCallback}: StandardBlockComponentProps): JSX.Element
{
   const [blurCount, setBlurCount] = useState(0)

   const fieldMetaData = new QFieldMetaData(data.values.fieldMetaData);
   const dynamicField = DynamicFormUtils.getDynamicField(fieldMetaData);

   let autoFocus = data.values.autoFocus as boolean
   let value = data.values.value;
   if(value == null || value == undefined)
   {
      value = "";
   }

   ////////////////////////////////////////////////////////////////////////////////
   // for an autoFocus field...                                                  //
   // we're finding that if we blur it when clicking an action button, that      //
   // an un-desirable "now it's been touched, so show an error" happens.         //
   // so let us remove the default blur handler, for the first (auto) focus/blur //
   // cycle, and we seem to have a better time.                                  //
   ////////////////////////////////////////////////////////////////////////////////
   let dynamicFormFieldRest: {onBlur?: any, sx?: any} = {}
   if(autoFocus && blurCount == 0)
   {
      dynamicFormFieldRest.onBlur = (event: React.SyntheticEvent) =>
      {
         event.stopPropagation();
         event.preventDefault();
         setBlurCount(blurCount + 1);
      }
   }


   /***************************************************************************
    **
    ***************************************************************************/
   function eventHandler(event: KeyboardEvent)
   {
      if(data.values.submitOnEnter && event.key == "Enter")
      {
         // @ts-ignore target.value...
         const inputValue = event.target.value?.trim()

         // todo - make this behavior opt-in for inputBlocks?
         if(inputValue && `${inputValue}`.startsWith("->"))
         {
            const actionCode = inputValue.substring(2);
            if(actionCallback)
            {
               actionCallback(data, {actionCode: actionCode, _fieldToClearIfError: fieldMetaData.name});

               ///////////////////////////////////////////////////////
               // return, so we don't submit the actionCode as text //
               ///////////////////////////////////////////////////////
               return;
            }
         }

         if(fieldMetaData.isRequired && inputValue == "")
         {
            console.log("input field is required, but missing value, so not submitting");
            return;
         }

         if(actionCallback)
         {
            console.log("InputFieldBlock calling actionCallback for submitOnEnter");

            let values: {[name: string]: any} = {};
            values[fieldMetaData.name] = inputValue;

            actionCallback(data, values);
         }
         else
         {
            console.log("InputFieldBlock was set as submitOnEnter, but no actionCallback was present, so, noop");
         }
      }
   }

   const labelElement = <Box fontSize="1rem" fontWeight="500" marginBottom="0.25rem">
      <label htmlFor={fieldMetaData.name}>{fieldMetaData.label}</label>
   </Box>

   return (
      <Box mt="0.5rem">
         <BlockElementWrapper metaData={widgetMetaData} data={data} slot="">
            <>
               {labelElement}
               <QDynamicFormField
                  name={fieldMetaData.name}
                  displayFormat={null}
                  label=""
                  placeholder={data.values?.placeholder}
                  backgroundColor="#FFFFFF"
                  formFieldObject={dynamicField}
                  type={fieldMetaData.type}
                  value={value}
                  autoFocus={autoFocus}
                  onKeyUp={eventHandler}
                  {...dynamicFormFieldRest} />
            </>
         </BlockElementWrapper>
      </Box>
   );
}
