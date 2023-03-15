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

import {AdornmentType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/AdornmentType";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import "datejs"; // https://github.com/datejs/Datejs
import {Box, Chip, Icon} from "@mui/material";
import parse from "html-react-parser";
import React, {Fragment} from "react";
import AceEditor from "react-ace";
import {Link} from "react-router-dom";
import Client from "qqq/utils/qqq/Client";

/*******************************************************************************
 ** Utility class for working with QQQ Values
 **
 *******************************************************************************/
class ValueUtils
{
   public static qInstance: QInstance = null;
   public static loadingQInstance = false;

   private static getQInstance(): QInstance
   {
      if (ValueUtils.qInstance == null)
      {
         if (ValueUtils.loadingQInstance)
         {
            return (null);
         }

         ValueUtils.loadingQInstance = true;
         const qController = Client.getInstance();
         (async () =>
         {
            ValueUtils.qInstance = await qController.loadMetaData();
         })();

         return (null);
      }

      return ValueUtils.qInstance;
   }


   /*******************************************************************************
    ** When you have a field, and a record - call this method to get a string or
    ** element back to display the field's value.
    *******************************************************************************/
   public static getDisplayValue(field: QFieldMetaData, record: QRecord, usage: "view" | "query" = "view"): string | JSX.Element | JSX.Element[]
   {
      const displayValue = record.displayValues ? record.displayValues.get(field.name) : undefined;
      const rawValue = record.values ? record.values.get(field.name) : undefined;

      return ValueUtils.getValueForDisplay(field, rawValue, displayValue, usage);
   }

   /*******************************************************************************
    ** When you have a field and a value (either just a raw value, or a raw and
    ** display value), call this method to get a string Element to display.
    *******************************************************************************/
   public static getValueForDisplay(field: QFieldMetaData, rawValue: any, displayValue: any = rawValue, usage: "view" | "query" = "view"): string | JSX.Element | JSX.Element[]
   {
      if (field.hasAdornment(AdornmentType.LINK))
      {
         const adornment = field.getAdornment(AdornmentType.LINK);
         let href = rawValue;

         const toRecordFromTable = adornment.getValue("toRecordFromTable");
         if (toRecordFromTable)
         {
            if (ValueUtils.getQInstance())
            {
               let tablePath = ValueUtils.getQInstance().getTablePathByName(toRecordFromTable);
               if (!tablePath)
               {
                  console.log("Couldn't find path for table: " + toRecordFromTable);
                  return (displayValue ?? rawValue);
               }

               if (!tablePath.endsWith("/"))
               {
                  tablePath += "/";
               }
               href = tablePath + rawValue;
            }
            else
            {
               //////////////////////////////////////////////////////////////////////////////////
               // if no instance, we can't get the table path, so we can't do a to-record link //
               //////////////////////////////////////////////////////////////////////////////////
               return (ValueUtils.getUnadornedValueForDisplay(field, rawValue, displayValue));
            }
         }

         if (!href)
         {
            return ("");
         }

         if (href.startsWith("http"))
         {
            return (<a target={adornment.getValue("target") ?? "_self"} href={href} onClick={(e) => e.stopPropagation()}>{displayValue ?? rawValue}</a>);
         }
         else
         {
            return (<Link target={adornment.getValue("target") ?? "_self"} to={href} onClick={(e) => e.stopPropagation()}>{displayValue ?? rawValue}</Link>);
         }
      }

      if (field.hasAdornment(AdornmentType.RENDER_HTML))
      {
         return (rawValue ? parse(rawValue) : "");
      }

      if (field.hasAdornment(AdornmentType.CHIP))
      {
         if (!displayValue)
         {
            return (<span />);
         }

         const adornment = field.getAdornment(AdornmentType.CHIP);
         const color = adornment.getValue("color." + rawValue) ?? "default";
         const iconName = adornment.getValue("icon." + rawValue) ?? null;
         const iconElement = iconName ? <Icon>{iconName}</Icon> : null;
         return (<Chip label={displayValue} color={color} icon={iconElement} size="small" variant="outlined" sx={{fontWeight: 500}} />);
      }

      if (field.hasAdornment(AdornmentType.CODE_EDITOR))
      {
         let mode = "text";
         const adornmentValues = field.getAdornment(AdornmentType.CODE_EDITOR).values;
         if (adornmentValues && adornmentValues.has("languageMode"))
         {
            mode = adornmentValues.get("languageMode");
         }

         if(usage === "view")
         {
            return (<AceEditor
               mode={mode}
               theme="github"
               name={field.name}
               editorProps={{$blockScrolling: true}}
               value={rawValue}
               readOnly
               highlightActiveLine={false}
               width="100%"
               showPrintMargin={false}
               height="200px"
            />);
         }
         else
         {
            return rawValue;
         }
      }

      if (field.hasAdornment(AdornmentType.ERROR))
      {
         return (
            <Box color={"darkred"} alignContent={"baseline"}>
               <Box mr={2} sx={{float: "left"}}>
                  <Icon>warning</Icon>
               </Box>
               <Box sx={{float: "left"}}>
                  {rawValue}
               </Box>
            </Box>
         );
      }

      return (ValueUtils.getUnadornedValueForDisplay(field, rawValue, displayValue));
   }

   /*******************************************************************************
    ** After we know there's no element to be returned (e.g., because no adornment),
    ** this method does the string formatting.
    *******************************************************************************/
   public static getUnadornedValueForDisplay(field: QFieldMetaData, rawValue: any, displayValue: any): string | JSX.Element
   {
      if(! displayValue && field.defaultValue)
      {
         displayValue = field.defaultValue;
      }

      if (field.type === QFieldType.DATE_TIME)
      {
         if (!rawValue)
         {
            return ("");
         }
         const date = new Date(rawValue);
         return this.formatDateTime(date);
      }
      else if (field.type === QFieldType.DATE)
      {
         // unclear if we need any customization for DATE or TIME, but leaving blocks for them just in case
         return (displayValue);
      }
      else if (field.type === QFieldType.TIME)
      {
         return (displayValue);
      }
      else if (field.type === QFieldType.BOOLEAN && (typeof displayValue) === "boolean")
      {
         return displayValue ? "Yes" : "No";
      }

      let returnValue = displayValue;
      if (displayValue === undefined && rawValue !== undefined)
      {
         returnValue = rawValue;
      }

      if (typeof returnValue === "string" && returnValue.indexOf("\n") > -1)
      {
         return ValueUtils.breakTextIntoLines(returnValue);
      }

      return (returnValue);
   }

   public static formatDateTime(date: Date)
   {
      if(!(date instanceof Date))
      {
         date = new Date(date)
      }
      // @ts-ignore
      return (`${date.toString("yyyy-MM-dd hh:mm:ss")} ${date.getHours() < 12 ? "AM" : "PM"} ${date.getTimezone()}`);
   }

   public static formatTime(date: Date)
   {
      if(!(date instanceof Date))
      {
         date = new Date(date)
      }
      // @ts-ignore
      return (`${date.toString("hh:mm:ss")} ${date.getHours() < 12 ? "AM" : "PM"} ${date.getTimezone()}`);
   }

   public static formatDateTimeISO8601(date: Date)
   {
      if(!(date instanceof Date))
      {
         date = new Date(date)
      }
      // @ts-ignore
      return (`${date.toString("yyyy-MM-ddTHH:mm:ssZ")}`);
   }

   public static getFullWeekday(date: Date)
   {
      if(!(date instanceof Date))
      {
         date = new Date(date)
      }
      // @ts-ignore
      return (`${date.toString("dddd")}`);
   }

   public static formatBoolean(value: any)
   {
      if(value === true)
      {
         return ("Yes");
      }
      else if(value === false)
      {
         return ("No");
      }
      return (null);
   }

   public static getFormattedNumber(n: number): string
   {
      try
      {
         if (n !== null && n !== undefined)
         {
            return (n.toLocaleString());
         }
         else
         {
            return ("");
         }
      }
      catch (e)
      {
         return (String(n));
      }
   }

   public static breakTextIntoLines(value: string): JSX.Element
   {
      if(!value)
      {
         return <Fragment />;
      }

      return (
         <Fragment>
            {value.split(/\n/).map((value: string, index: number) => (
               // eslint-disable-next-line react/no-array-index-key
               <Fragment key={index}>
                  <span>{value}</span>
                  <br />
               </Fragment>
            ))}
         </Fragment>
      );
   }

   /*******************************************************************************
    ** Take a date-time value, and format it the way the ui's date-times want it
    ** to be.
    *******************************************************************************/
   public static formatDateTimeValueForForm(value: string): string
   {
      if (value === null || value === undefined)
      {
         return (value);
      }

      if (value.match(/^\d{4}-\d{2}-\d{2}$/))
      {
         //////////////////////////////////////////////////////////////////
         // if we just passed in a date (w/o time), attach T00:00 to it. //
         //////////////////////////////////////////////////////////////////
         return (value + "T00:00");
      }
      else if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/))
      {
         ///////////////////////////////////////////////////////////////////////////////////////////////////////
         // If the passed in string has a Z on the end (e.g., in UTC) - make a Date object - the browser will //
         // shift the value into the user's time zone, so it will display correctly for them                  //
         ///////////////////////////////////////////////////////////////////////////////////////////////////////
         const date = new Date(value);

         // @ts-ignore
         const formattedDate = `${date.toString("yyyy-MM-ddTHH:mm")}`

         console.log(`Converted UTC date value string [${value}] to local time value for form [${formattedDate}]`)

         return (formattedDate);
      }
      else if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}.*/))
      {
         ///////////////////////////////////////////////////////////////////////////////////
         // if we passed in something too long (e.g., w/ seconds and fractions), trim it. //
         ///////////////////////////////////////////////////////////////////////////////////
         return (value.substring(0, 16));
      }
      else
      {
         ////////////////////////////////////////
         // by default, return the input value //
         ////////////////////////////////////////
         return (value);
      }
   }
}

export default ValueUtils;
