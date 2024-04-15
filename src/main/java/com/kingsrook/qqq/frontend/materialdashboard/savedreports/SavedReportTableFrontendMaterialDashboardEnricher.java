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

package com.kingsrook.qqq.frontend.materialdashboard.savedreports;


import java.util.List;
import com.kingsrook.qqq.backend.core.model.metadata.tables.QTableMetaData;
import com.kingsrook.qqq.frontend.materialdashboard.model.metadata.MaterialDashboardTableMetaData;
import com.kingsrook.qqq.frontend.materialdashboard.model.metadata.fieldrules.FieldRule;
import com.kingsrook.qqq.frontend.materialdashboard.model.metadata.fieldrules.FieldRuleAction;
import com.kingsrook.qqq.frontend.materialdashboard.model.metadata.fieldrules.FieldRuleTrigger;


/*******************************************************************************
 ** Add frontend material dashboard enhacements to saved report table
 *******************************************************************************/
public class SavedReportTableFrontendMaterialDashboardEnricher
{

   /*******************************************************************************
    **
    *******************************************************************************/
   public static void enrich(QTableMetaData tableMetaData)
   {
      MaterialDashboardTableMetaData materialDashboardTableMetaData = MaterialDashboardTableMetaData.ofOrWithNew(tableMetaData);

      /////////////////////////////////////////////////////////////////////////
      // make changes to the tableName field clear the value in these fields //
      /////////////////////////////////////////////////////////////////////////
      for(String targetField : List.of("queryFilterJson", "columnsJson", "pivotTableJson"))
      {
         materialDashboardTableMetaData.withFieldRule(new FieldRule()
            .withSourceField("tableName")
            .withTrigger(FieldRuleTrigger.ON_CHANGE)
            .withAction(FieldRuleAction.CLEAR_TARGET_FIELD)
            .withTargetField(targetField));
      }
   }

}
