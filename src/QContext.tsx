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

import {QAppMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppMetaData";
import {QBrandingMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QBrandingMetaData";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QProcessMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QProcessMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {createContext} from "react";

interface QContext
{
   pageHeader: string | JSX.Element;
   setPageHeader?: (header: string | JSX.Element) => void;

   accentColor: string;
   setAccentColor?: (header: string) => void;

   dotMenuOpen: boolean;
   setDotMenuOpen?: (dotMenuOpen: boolean) => void;

   tableMetaData?: QTableMetaData;
   setTableMetaData?: (tableMetaData: QTableMetaData) => void;

   tableProcesses?: QProcessMetaData[];
   setTableProcesses?: (tableProcesses: QProcessMetaData[]) => void;

   ///////////////////////////////////
   // constants - no setters needed //
   ///////////////////////////////////
   pathToLabelMap?: {[path: string]: string};
   branding?: QBrandingMetaData;
}

const defaultState = {
   pageHeader: "",
   accentColor: "#0062FF",
   dotMenuOpen: false,
   pathToLabelMap: {},
};

const QContext = createContext<QContext>(defaultState);
export default QContext;