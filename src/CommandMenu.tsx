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

import {Capability} from "@kingsrook/qqq-frontend-core/lib/model/metaData/Capability";
import {QAppMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppMetaData";
import {QAppNodeType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppNodeType";
import {QAppTreeNode} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QAppTreeNode";
import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import {Command} from "cmdk";
import React, {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import QContext from "QContext";
import HistoryUtils, {QHistoryEntry} from "qqq/utils/HistoryUtils";

interface Props
{
   metaData?: QInstance;
}


const CommandMenu = ({metaData}: Props) =>
{
   const navigate = useNavigate();
   const pathParts = location.pathname.replace(/\/+$/, "").split("/");

   const {accentColor, tableMetaData, dotMenuOpen, setDotMenuOpen, setTableMetaData, tableProcesses} = useContext(QContext);

   function evalueKeyPress(e: KeyboardEvent)
   {
      ///////////////////////////////////////////////////////////////////////////
      // if a dot pressed, not from a "text" element, then toggle command menu //
      ///////////////////////////////////////////////////////////////////////////
      const type = (e.target as any).type;
      if (e.key === "." && type !== "text" && type !== "textarea" && type !== "input" && type !== "search")
      {
         e.preventDefault();
         setDotMenuOpen(!dotMenuOpen);
      }
   }

   ////////////////////////////////////////////
   // Toggle the menu when period is pressed //
   ////////////////////////////////////////////
   useEffect(() =>
   {
      /////////////////////////////////////////////////////////////////
      // if we are not in the right table, clear the table meta data //
      /////////////////////////////////////////////////////////////////
      if (metaData && tableMetaData && !location.pathname.startsWith(`${metaData.getTablePath(tableMetaData)}/`))
      {
         setTableMetaData(null);
      }

      const down = (e: KeyboardEvent) =>
      {
         evalueKeyPress(e);
      }

      document.addEventListener("keydown", down)
      return () =>
      {
         document.removeEventListener("keydown", down)
      }
   }, [tableMetaData, dotMenuOpen])

   useEffect(() =>
   {
      setDotMenuOpen(false);
   }, [location.pathname])

   function goToItem(path: string)
   {
      navigate(path, {replace: true});
      setDotMenuOpen(false);
   }

   function getIconName(iconName: string, defaultIconName: string)
   {
      return iconName ?? defaultIconName;
   }


   /*******************************************************************************
    **
    *******************************************************************************/
   function getFullAppLabel(nodes: QAppTreeNode[] | undefined, name: string, depth: number, path: string): string | null
   {
      if (nodes === undefined)
      {
         return (null);
      }

      for (let i = 0; i < nodes.length; i++)
      {
         if (nodes[i].type === QAppNodeType.APP && nodes[i].name === name)
         {
            return (`${path} > ${nodes[i].label}`);
         }
         else if (nodes[i].type === QAppNodeType.APP)
         {
            const result = getFullAppLabel(nodes[i].children, name, depth + 1, `${path} ${nodes[i].label}`);
            if (result !== null)
            {
               return (result);
            }
         }
      }
      return (null);
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   function ActionsSection()
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

      const path = location.pathname;
      return tableMetaData && !path.endsWith("/edit") && !path.endsWith("/create") && !path.endsWith("#audit") && ! path.endsWith("copy") &&
         (
            <Command.Group heading={`${tableMetaData.label} Actions`}>
               {
                  tableMetaData.capabilities.has(Capability.TABLE_INSERT) && tableMetaData.insertPermission &&
               <Command.Item onSelect={() => goToItem(`${pathParts.slice(0, -1).join("/")}/create`)} key={`${tableMetaData.label}-new`} value="New"><Icon sx={{color: accentColor}}>add</Icon>New</Command.Item>
               }
               {
                  tableMetaData.capabilities.has(Capability.TABLE_INSERT) && tableMetaData.insertPermission &&
               <Command.Item onSelect={() => goToItem(`${pathParts.join("/")}/copy`)} key={`${tableMetaData.label}-copy`} value="Copy"><Icon sx={{color: accentColor}}>copy</Icon>Copy</Command.Item>
               }
               {
                  tableMetaData.capabilities.has(Capability.TABLE_UPDATE) && tableMetaData.editPermission &&
               <Command.Item onSelect={() => goToItem(`${pathParts.join("/")}/edit`)} key={`${tableMetaData.label}-edit`} value="Edit"><Icon sx={{color: accentColor}}>edit</Icon>Edit</Command.Item>
               }
               {
                  metaData && metaData.tables.has("audit") &&
               <Command.Item onSelect={() => goToItem(`${pathParts.join("/")}#audit`)} key={`${tableMetaData.label}-audit`} value="Audit"><Icon sx={{color: accentColor}}>checklist</Icon>Audit</Command.Item>
               }
               {
                  tableProcesses && tableProcesses.length > 0 &&
               (
                  tableProcesses.map((process) => (
                     <Command.Item onSelect={() => goToItem(`${pathParts.join("/")}/${process.name}`)} key={`${process.name}`} value={`${process.label}`}><Icon sx={{color: accentColor}}>{getIconName(process.iconName, "play_arrow")}</Icon>{process.label}</Command.Item>
                  ))
               )
               }
               <Command.Separator />
            </Command.Group>
         );
   }

   /*******************************************************************************
    **
    *******************************************************************************/
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
                     <Command.Item onSelect={() => goToItem(`${metaData.getTablePath(metaData.tables.get(tableName))}`)} key={`${tableName}-${index}`} value={metaData.tables.get(tableName).label}><Icon sx={{color: accentColor}}>{getIconName(metaData.tables.get(tableName).iconName, "table_rows")}</Icon>{metaData.tables.get(tableName).label}</Command.Item>
                  )
               )
            }
            <Command.Separator />
         </Command.Group>
      );
   }

   /*******************************************************************************
    **
    *******************************************************************************/
   function AppsSection()
   {
      let appNames: string[] = [];
      metaData.apps.forEach((value: QAppMetaData, key: string) =>
      {
         appNames.push(value.name);
      })

      appNames = appNames.sort((a: string, b:string) =>
      {
         return (getFullAppLabel(metaData.appTree, a, 1, "").localeCompare(getFullAppLabel(metaData.appTree, b, 1, "")));
      })

      return(
         <Command.Group heading="Apps">
            {
               appNames.map((appName: string, index: number) =>
                  metaData.getAppPath(metaData.apps.get(appName)) &&
                  (
                     <Command.Item onSelect={() => goToItem(`${metaData.getAppPath(metaData.apps.get(appName))}`)} key={`${appName}-${index}`} value={getFullAppLabel(metaData.appTree, appName, 1, "")}><Icon sx={{color: accentColor}}>{getIconName(metaData.apps.get(appName).iconName, "apps")}</Icon>{getFullAppLabel(metaData.appTree, appName, 1, "")}</Command.Item>
                  )
               )
            }
            <Command.Separator />
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

      const entryMap = new Map<string, boolean>();
      return(
         <Command.Group heading="Recently Viewed Records">
            {
               history.entries.reverse().map((entry: QHistoryEntry, index: number) =>
                  ! entryMap.has(entry.label) && entryMap.set(entry.label, true) && (
                     <Command.Item onSelect={() => goToItem(`${entry.path}`)} key={`${entry.label}-${index}`} value={entry.label}><Icon sx={{color: accentColor}}>{entry.iconName}</Icon>{entry.label}</Command.Item>
                  )
               )
            }
         </Command.Group>
      );
   }

   const containerElement = useRef(null)
   return (
      <Box ref={containerElement} className="raycast" sx={{position: "relative", zIndex: 10_000}}>
         <Command.Dialog open={dotMenuOpen} onOpenChange={setDotMenuOpen} container={containerElement.current} label="Test Global Command Menu">
            <Box sx={{display: "flex"}}>
               <Command.Input placeholder="Search for Tables, Actions, or Recently Viewed Items..."/>
               <Button onClick={() => setDotMenuOpen(false)}><Icon>close</Icon></Button>
            </Box>
            <Command.Loading  />
            <Command.Separator />
            <Command.List>
               <Command.Empty>No results found.</Command.Empty>
               <ActionsSection />
               <TablesSection />
               <AppsSection />
               <RecentlyViewedSection />
            </Command.List>
         </Command.Dialog>
      </Box>
   )
}
export default CommandMenu;
