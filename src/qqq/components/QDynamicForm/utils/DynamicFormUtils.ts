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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import * as Yup from "yup";

/*******************************************************************************
 ** Meta-data to represent a single field in a table.
 **
 *******************************************************************************/
class DynamicFormUtils
{
   public static getFormData(qqqFormFields: QFieldMetaData[])
   {
      const dynamicFormFields: any = {};
      const formValidations: any = {};

      qqqFormFields.forEach((field) =>
      {
         dynamicFormFields[field.name] = this.getDynamicField(field);
         formValidations[field.name] = this.getValidationForField(field);
      });

      return {dynamicFormFields, formValidations};
   }

   public static getDynamicField(field: QFieldMetaData)
   {
      let fieldType: string;
      switch (field.type.toString())
      {
         case QFieldType.DECIMAL:
         case QFieldType.INTEGER:
            fieldType = "number";
            break;
         case QFieldType.DATE_TIME:
            fieldType = "datetime-local";
            break;
         case QFieldType.PASSWORD:
         case QFieldType.TIME:
         case QFieldType.DATE:
            fieldType = field.type.toString();
            break;
         case QFieldType.BLOB:
            fieldType = "file";
            break;
         case QFieldType.BOOLEAN:
            fieldType = "checkbox";
            break;
         case QFieldType.TEXT:
         case QFieldType.HTML:
         case QFieldType.STRING:
         default:
            fieldType = "text";
      }

      let label = field.label ? field.label : field.name;
      label += field.isRequired ? " *" : "";

      return ({
         name: field.name,
         label: label,
         isRequired: field.isRequired,
         isEditable: field.isEditable,
         type: fieldType,
         displayFormat: field.displayFormat,
         // todo invalidMsg: "Zipcode is not valid (e.g. 70000).",
      });
   }

   public static getValidationForField(field: QFieldMetaData)
   {
      if (field.isRequired)
      {
         return (Yup.string().required(`${field.label} is required.`));
      }
      return (null);
   }

   public static addPossibleValueProps(dynamicFormFields: any, qFields: QFieldMetaData[], tableName: string, displayValues: Map<string, string>)
   {
      for (let i = 0; i < qFields.length; i++)
      {
         const field = qFields[i];

         /////////////////////////////////////////
         // add props for possible value fields //
         /////////////////////////////////////////
         if (field.possibleValueSourceName && dynamicFormFields[field.name])
         {
            let initialDisplayValue = null;
            if (displayValues)
            {
               initialDisplayValue = displayValues.get(field.name);
            }

            dynamicFormFields[field.name].possibleValueProps =
               {
                  isPossibleValue: true,
                  tableName: tableName,
                  initialDisplayValue: initialDisplayValue,
               };
         }
      }
   }
}

export default DynamicFormUtils;
