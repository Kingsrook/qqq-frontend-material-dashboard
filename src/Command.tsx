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
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import {Command} from "cmdk";
import React, {useContext, useEffect, useReducer, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import QContext from "QContext";
import HistoryUtils, {QHistoryEntry} from "qqq/utils/HistoryUtils";

interface Props
{
   metaData?: QInstance;
}


const CommandMenu = ({metaData}: Props) =>
{
   const [open, setOpen] = useState(false)
   const navigate = useNavigate();
   const {setAllowShortcuts, allowShortcuts, accentColor} = useContext(QContext);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   function evalueKeyPress(e: KeyboardEvent)
   {
      forceUpdate();
      if (e.key === "." && allowShortcuts)
      {
         e.preventDefault();
         setOpen((open) => !open)
      }
   }

   ////////////////////////////////////////
   // Toggle the menu when ⌘K is pressed //
   ////////////////////////////////////////
   useEffect(() =>
   {
      const down = (e: KeyboardEvent) =>
      {
         evalueKeyPress(e);
      }

      document.addEventListener("keydown", down)
      return () =>
      {
         document.removeEventListener("keydown", down)
      }
   }, [allowShortcuts])

   /////////////////////////////////////////////////////
   // change allowing shortcuts based on open's value //
   /////////////////////////////////////////////////////
   useEffect(() =>
   {
      setAllowShortcuts(!open);
   }, [open])

   function goToItem(path: string)
   {
      navigate(path, {replace: true});
      setOpen(false);
   }

   function TablesSection()
   {
      let tableNames : string[]= [];
      metaData.tables.forEach((value: QTableMetaData, key: string) =>
      {
         tableNames.push(value.name);
      })
      tableNames = tableNames.sort((a: string, b:string) =>
      {
         return (metaData.tables.get(a).label.localeCompare(metaData.tables.get(b).label));
      })
      return(
         <Command.Group heading="Tables">
            {
               tableNames.map((tableName: string, index: number) =>
                  !metaData.tables.get(tableName).isHidden && metaData.getTablePath(metaData.tables.get(tableName)) &&
                  (
                     <Command.Item onSelect={() => goToItem(`${metaData.getTablePath(metaData.tables.get(tableName))}`)} key={`${tableName}-${index}`}><Icon sx={{color: accentColor}}>{metaData.tables.get(tableName).iconName ? metaData.tables.get(tableName).iconName : "table_rows"}</Icon>{metaData.tables.get(tableName).label}</Command.Item>
                  )
               )
            }
         </Command.Group>
      );
   }

   function AppsSection()
   {
      let appNames: string[] = [];
      metaData.apps.forEach((value: QAppMetaData, key: string) =>
      {
         appNames.push(value.name);
      })

      appNames = appNames.sort((a: string, b:string) =>
      {
         return (metaData.apps.get(a).label.localeCompare(metaData.apps.get(b).label));
      })

      return(
         <Command.Group heading="Apps">
            {
               appNames.map((appName: string, index: number) =>
                  metaData.getAppPath(metaData.apps.get(appName)) &&
                  (
                     <Command.Item onSelect={() => goToItem(`${metaData.getAppPath(metaData.apps.get(appName))}`)} key={`${appName}-${index}`}><Icon sx={{color: accentColor}}>{metaData.apps.get(appName).iconName ? metaData.apps.get(appName).iconName : "apps"}</Icon>{metaData.apps.get(appName).label}</Command.Item>
                  )
               )
            }
         </Command.Group>
      );
   }

   function RecentlyViewedSection()
   {
      const history = HistoryUtils.get();
      const options = [] as any;
      history.entries.reverse().forEach((entry, index) =>
         options.push({label: `${entry.label} index`, id: index, key: index, path: entry.path, iconName: entry.iconName})
      )

      let appNames: string[] = [];
      metaData.apps.forEach((value: QAppMetaData, key: string) =>
      {
         appNames.push(value.name);
      })

      appNames = appNames.sort((a: string, b:string) =>
      {
         return (metaData.apps.get(a).label.localeCompare(metaData.apps.get(b).label));
      })

      return(
         <Command.Group heading="Recently Viewed Records">
            {
               history.entries.reverse().map((entry: QHistoryEntry, index: number) =>
                  <Command.Item onSelect={() => goToItem(`${entry.path}`)} key={`${entry.label}-${index}`}><Icon sx={{color: accentColor}}>{entry.iconName}</Icon>{entry.label}</Command.Item>
               )
            }
         </Command.Group>
      );
   }

   const containerElement = useRef(null)
   return (
      <Box ref={containerElement} className="raycast" sx={{position: "relative", zIndex: 10_000}}>
         <Command.Dialog open={open} onOpenChange={setOpen} container={containerElement.current} label="Test Global Command Menu">
            <Box sx={{display: "flex"}}>
               <Command.Input placeholder="Search for Tables, Actions, or Recently Viewed Items..."/>
               <Button onClick={() => setOpen(false)}><Icon>close</Icon></Button>
            </Box>
            <Command.Loading  />
            <Command.Separator />
            <Command.List>
               <Command.Empty>No results found.</Command.Empty>
               <TablesSection />
               <Command.Separator />
               <AppsSection />
               <Command.Separator />
               <RecentlyViewedSection />
            </Command.List>
         </Command.Dialog>
      </Box>
   )
}
export default CommandMenu;
