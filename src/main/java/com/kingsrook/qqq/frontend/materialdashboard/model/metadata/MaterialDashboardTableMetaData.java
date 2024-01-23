/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2023.  Kingsrook, LLC
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

package com.kingsrook.qqq.frontend.materialdashboard.model.metadata;


import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.kingsrook.qqq.backend.core.instances.QInstanceValidator;
import com.kingsrook.qqq.backend.core.model.metadata.QInstance;
import com.kingsrook.qqq.backend.core.model.metadata.tables.QSupplementalTableMetaData;
import com.kingsrook.qqq.backend.core.model.metadata.tables.QTableMetaData;
import com.kingsrook.qqq.backend.core.utils.CollectionUtils;


/*******************************************************************************
 ** table-level meta-data for this module (handled as QSupplementalTableMetaData)
 *******************************************************************************/
public class MaterialDashboardTableMetaData extends QSupplementalTableMetaData
{
   private List<List<String>> gotoFieldNames;
   private List<String> defaultQuickFilterFieldNames;


   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public boolean includeInFullFrontendMetaData()
   {
      return (true);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public String getType()
   {
      return ("materialDashboard");
   }



   /*******************************************************************************
    ** Getter for gotoFieldNames
    *******************************************************************************/
   public List<List<String>> getGotoFieldNames()
   {
      return (this.gotoFieldNames);
   }



   /*******************************************************************************
    ** Setter for gotoFieldNames
    *******************************************************************************/
   public void setGotoFieldNames(List<List<String>> gotoFieldNames)
   {
      this.gotoFieldNames = gotoFieldNames;
   }



   /*******************************************************************************
    ** Fluent setter for gotoFieldNames
    *******************************************************************************/
   public MaterialDashboardTableMetaData withGotoFieldNames(List<List<String>> gotoFieldNames)
   {
      this.gotoFieldNames = gotoFieldNames;
      return (this);
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public void validate(QInstance qInstance, QTableMetaData tableMetaData, QInstanceValidator qInstanceValidator)
   {
      super.validate(qInstance, tableMetaData, qInstanceValidator);

      String prefix = "MaterialDashboardTableMetaData supplementalTableMetaData for table [" + tableMetaData.getName() + "] ";

      for(List<String> gotoFieldNameSubList : CollectionUtils.nonNullList(gotoFieldNames))
      {
         qInstanceValidator.assertCondition(!gotoFieldNameSubList.isEmpty(), prefix + "has an empty gotoFieldNames list");
         validateListOfFieldNames(tableMetaData, gotoFieldNameSubList, qInstanceValidator, prefix + "gotoFieldNames: ");
      }
      validateListOfFieldNames(tableMetaData, defaultQuickFilterFieldNames, qInstanceValidator, prefix + "defaultQuickFilterFieldNames: ");
   }



   /*******************************************************************************
    **
    *******************************************************************************/
   private void validateListOfFieldNames(QTableMetaData tableMetaData, List<String> fieldNames, QInstanceValidator qInstanceValidator, String prefix)
   {
      Set<String> usedNames = new HashSet<>();
      for(String fieldName : CollectionUtils.nonNullList(fieldNames))
      {
         if(qInstanceValidator.assertNoException(() -> tableMetaData.getField(fieldName), prefix + " unrecognized field name: " + fieldName))
         {
            qInstanceValidator.assertCondition(!usedNames.contains(fieldName), prefix + " has a duplicated field name: " + fieldName);
            usedNames.add(fieldName);
         }
      }
   }



   /*******************************************************************************
    ** Getter for defaultQuickFilterFieldNames
    *******************************************************************************/
   public List<String> getDefaultQuickFilterFieldNames()
   {
      return (this.defaultQuickFilterFieldNames);
   }



   /*******************************************************************************
    ** Setter for defaultQuickFilterFieldNames
    *******************************************************************************/
   public void setDefaultQuickFilterFieldNames(List<String> defaultQuickFilterFieldNames)
   {
      this.defaultQuickFilterFieldNames = defaultQuickFilterFieldNames;
   }



   /*******************************************************************************
    ** Fluent setter for defaultQuickFilterFieldNames
    *******************************************************************************/
   public MaterialDashboardTableMetaData withDefaultQuickFilterFieldNames(List<String> defaultQuickFilterFieldNames)
   {
      this.defaultQuickFilterFieldNames = defaultQuickFilterFieldNames;
      return (this);
   }

}
