/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
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

import {Banner} from "@kingsrook/qqq-frontend-core/lib/model/metaData/Banner";
import {QBrandingMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QBrandingMetaData";
import parse from "html-react-parser";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// One may render a banner using the functions in this file as:                                            //
//                                                                                                         //
// const banner = getBanner(branding, "QFMD_SIDE_NAV_UNDER_LOGO");                                         //
// return (<Box className={getBannerClassName(banner)} sx={{padding: "1rem", ...getBannerStyles(banner)}}> //
//    {makeBannerContent(banner)}                                                                          //
// </Box>);                                                                                                //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


/***************************************************************************
 **
 ***************************************************************************/
export function getBanner(branding: QBrandingMetaData, slot: string): Banner | null
{
   if (branding?.banners?.has(slot))
   {
      return (branding.banners.get(slot));
   }

   return (null);
}


/***************************************************************************
 **
 ***************************************************************************/
export function getBannerStyles(banner: Banner)
{
   let bgColor = "";
   let color = "";

   if (banner)
   {
      if (banner.backgroundColor)
      {
         bgColor = banner.backgroundColor;
      }

      if (banner.textColor)
      {
         bgColor = banner.textColor;
      }
   }

   const rest = banner?.additionalStyles ?? {};

   return ({
      backgroundColor: bgColor,
      color: color,
      ...rest
   });
}


/***************************************************************************
 **
 ***************************************************************************/
export function getBannerClassName(banner: Banner)
{
   return `banner ${banner?.severity?.toLowerCase()}`;
}


/***************************************************************************
 **
 ***************************************************************************/
export function makeBannerContent(banner: Banner): JSX.Element
{
   return <>{banner?.messageHTML ? parse(banner?.messageHTML) : banner?.messageText}</>;
}

