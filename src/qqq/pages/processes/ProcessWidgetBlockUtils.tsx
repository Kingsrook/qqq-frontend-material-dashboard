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

import {QComponentType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QComponentType";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFrontendStepMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFrontendStepMetaData";
import {CompositeData} from "qqq/components/widgets/CompositeWidget";

/*******************************************************************************
 ** Utility functions used by ProcessRun for working with ad-hoc, block &
 ** composite type widgets.
 **
 *******************************************************************************/
export default class ProcessWidgetBlockUtils
{

   /*******************************************************************************
    **
    *******************************************************************************/
   public static isActionCodeValid(actionCode: string, step: QFrontendStepMetaData, processValues: any): boolean
   {
      ///////////////////////////////////////////////////////////
      // private recursive function to walk the composite tree //
      ///////////////////////////////////////////////////////////
      function recursiveIsActionCodeValidForCompositeData(compositeWidgetData: CompositeData): boolean
      {
         for (let i = 0; i < compositeWidgetData.blocks.length; i++)
         {
            const block = compositeWidgetData.blocks[i];

            ////////////////////////////////////////////////////////////////
            // skip the block if it has a 'conditional', which isn't true //
            ////////////////////////////////////////////////////////////////
            const conditionalFieldName = block.conditional;
            if (conditionalFieldName)
            {
               const value = processValues[conditionalFieldName];
               if (!value)
               {
                  continue;
               }
            }

            if (block.blockTypeName == "COMPOSITE")
            {
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // recursive call for composites, but only return if a true is found (in case a subsequent block has a true) //
               ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
               const isValidForThisBlock = recursiveIsActionCodeValidForCompositeData(block as unknown as CompositeData);
               if (isValidForThisBlock)
               {
                  return (true);
               }
               // else, continue...
            }
            else if (block.blockTypeName == "ACTION_BUTTON")
            {
               //////////////////////////////////////////////////////////
               // actually look at actionCodes on action button blocks //
               //////////////////////////////////////////////////////////
               if (block.values?.actionCode == actionCode)
               {
                  return (true);
               }
            }
         }

         /////////////////////////////////////////
         // if code wasn't found, it is invalid //
         /////////////////////////////////////////
         return false;
      }

      /////////////////////////////////////////////////////
      // iterate over all components in the current step //
      /////////////////////////////////////////////////////
      for (let i = 0; i < step.components.length; i++)
      {
         const component = step.components[i];
         if (component.type == "WIDGET" && component.values?.isAdHocWidget)
         {
            ///////////////////////////////////////////////////////////////////////////////////////////////
            // for ad-hoc widget components, check if this actionCode exists on any action-button blocks //
            ///////////////////////////////////////////////////////////////////////////////////////////////
            const isValidForThisWidget = recursiveIsActionCodeValidForCompositeData(component.values);
            if (isValidForThisWidget)
            {
               return (true);
            }
         }
      }

      ////////////////////////////////////
      // upon fallthrough, it's a false //
      ////////////////////////////////////
      return false;
   }


   /***************************************************************************
    ** perform evaluations on a compositeWidget's data, given current process
    ** values, to do dynamic stuff, like:
    ** - removing fields with un-true conditions
    ***************************************************************************/
   public static dynamicEvaluationOfCompositeWidgetData(compositeWidgetData: CompositeData, processValues: any)
   {
      for (let i = 0; i < compositeWidgetData.blocks.length; i++)
      {
         const block = compositeWidgetData.blocks[i];

         ////////////////////////////////////////////////////////////////////
         // if the block has a conditional, evaluate, and remove if untrue //
         ////////////////////////////////////////////////////////////////////
         const conditionalFieldName = block.conditional;
         if (conditionalFieldName)
         {
            const value = processValues[conditionalFieldName];
            if (!value)
            {
               console.debug(`Splicing away block based on [${conditionalFieldName}]...`);
               compositeWidgetData.blocks.splice(i, 1);
               i--;
               continue;
            }
         }

         if (block.blockTypeName == "COMPOSITE")
         {
            /////////////////////////////////////////
            // make recursive calls for composites //
            /////////////////////////////////////////
            ProcessWidgetBlockUtils.dynamicEvaluationOfCompositeWidgetData(block as unknown as CompositeData, processValues);
         }
         else if (block.blockTypeName == "INPUT_FIELD")
         {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // for input fields, put the process's value for the field-name into the block's values object as '.value' //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const fieldName = block.values?.fieldMetaData?.name;
            if (processValues.hasOwnProperty(fieldName))
            {
               block.values.value = processValues[fieldName];
            }
         }
         else if (block.blockTypeName == "TEXT")
         {
            //////////////////////////////////////////////////////////////////////////////////////
            // for text-blocks - interpolate ${fieldName} expressions into their process-values //
            //////////////////////////////////////////////////////////////////////////////////////
            let text = block.values?.text;
            if (text)
            {
               for (let key of Object.keys(processValues))
               {
                  text = text.replaceAll("${" + key + "}", processValues[key]);
               }
               block.values.interpolatedText = text;
            }
         }
      }
   }


   /***************************************************************************
    **
    ***************************************************************************/
   public static addFieldsForCompositeWidget(step: QFrontendStepMetaData, addFieldCallback: (fieldMetaData: QFieldMetaData) => void)
   {
      ///////////////////////////////////////////////////////////
      // private recursive function to walk the composite tree //
      ///////////////////////////////////////////////////////////
      function recursiveHelper(widgetData: CompositeData)
      {
         try
         {
            for (let block of widgetData.blocks)
            {
               if (block.blockTypeName == "COMPOSITE")
               {
                  recursiveHelper(block as unknown as CompositeData);
               }
               else if (block.blockTypeName == "INPUT_FIELD")
               {
                  const fieldMetaData = new QFieldMetaData(block.values?.fieldMetaData);
                  addFieldCallback(fieldMetaData)
               }
            }
         }
         catch (e)
         {
            console.log("Error adding fields for compositeWidget: " + e);
         }
      }

      /////////////////////////////////////////////////////////////////////////////
      // foreach component, if it's an adhoc widget, call recursive helper on it //
      /////////////////////////////////////////////////////////////////////////////
      for (let component of step.components)
      {
         if (component.type == QComponentType.WIDGET && component.values?.isAdHocWidget)
         {
            recursiveHelper(component.values as unknown as CompositeData)
         }
      }
   }

}