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

// misc imports
import * as Yup from "yup";

// qqq imports
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";

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
         type: fieldType,
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

   public static getFormDataForUploadForm(fieldName: string, fieldLabel: string, isRequired: boolean = true)
   {
      const dynamicFormFields: any = {};
      const formValidations: any = {};

      dynamicFormFields[fieldName] = {
         name: fieldName,
         label: fieldLabel,
         isRequired: isRequired,
         type: "file",
         // todo invalidMsg: "Zipcode is not valid (e.g. 70000).",
      };

      if (isRequired)
      {
         formValidations[fieldName] = Yup.string().required(`${fieldLabel} is required.`);
      }

      return {dynamicFormFields, formValidations};
   }
}

export default DynamicFormUtils;
