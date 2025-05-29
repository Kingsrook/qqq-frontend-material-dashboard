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

package com.kingsrook.qqq.frontend.materialdashboard.model.metadata;


import java.util.Set;
import com.kingsrook.qqq.backend.core.instances.QInstanceValidator;
import com.kingsrook.qqq.backend.core.logging.QLogger;
import com.kingsrook.qqq.backend.core.model.metadata.QInstance;
import com.kingsrook.qqq.backend.core.model.metadata.code.QCodeReference;
import com.kingsrook.qqq.backend.core.model.metadata.fields.QFieldMetaData;
import com.kingsrook.qqq.backend.core.model.metadata.fields.QSupplementalFieldMetaData;
import com.kingsrook.qqq.backend.core.utils.StringUtils;
import com.kingsrook.qqq.frontend.materialdashboard.actions.formadjuster.FormAdjusterInterface;
import com.kingsrook.qqq.frontend.materialdashboard.actions.formadjuster.FormAdjusterRegistry;


/*******************************************************************************
 **
 *******************************************************************************/
public class MaterialDashboardFieldMetaData extends QSupplementalFieldMetaData
{
   public static final String TYPE = "materialDashboard";

   private static final QLogger LOG = QLogger.getLogger(MaterialDashboardFieldMetaData.class);

   private String         formAdjusterIdentifier               = null;
   private QCodeReference onChangeFormAdjuster                 = null;
   private QCodeReference onLoadFormAdjuster                   = null;
   private Set<String>    fieldsToDisableWhileRunningAdjusters = null;



   /*******************************************************************************
    **
    *******************************************************************************/
   @Override
   public boolean includeInFrontendMetaData()
   {
      return (true);
   }



   /***************************************************************************
    **
    ***************************************************************************/
   @Override
   public String getType()
   {
      return TYPE;
   }



   /*******************************************************************************
    ** Getter for onChangeFormAdjuster
    *******************************************************************************/
   public QCodeReference getOnChangeFormAdjuster()
   {
      return (this.onChangeFormAdjuster);
   }



   /*******************************************************************************
    ** Setter for onChangeFormAdjuster
    *******************************************************************************/
   public void setOnChangeFormAdjuster(QCodeReference onChangeFormAdjuster)
   {
      this.onChangeFormAdjuster = onChangeFormAdjuster;
   }



   /*******************************************************************************
    ** Fluent setter for onChangeFormAdjuster
    *******************************************************************************/
   public MaterialDashboardFieldMetaData withOnChangeFormAdjuster(QCodeReference onChangeFormAdjuster)
   {
      this.onChangeFormAdjuster = onChangeFormAdjuster;
      return (this);
   }



   /*******************************************************************************
    ** Getter for onLoadFormAdjuster
    *******************************************************************************/
   public QCodeReference getOnLoadFormAdjuster()
   {
      return (this.onLoadFormAdjuster);
   }



   /*******************************************************************************
    ** Setter for onLoadFormAdjuster
    *******************************************************************************/
   public void setOnLoadFormAdjuster(QCodeReference onLoadFormAdjuster)
   {
      this.onLoadFormAdjuster = onLoadFormAdjuster;
   }



   /*******************************************************************************
    ** Fluent setter for onLoadFormAdjuster
    *******************************************************************************/
   public MaterialDashboardFieldMetaData withOnLoadFormAdjuster(QCodeReference onLoadFormAdjuster)
   {
      this.onLoadFormAdjuster = onLoadFormAdjuster;
      return (this);
   }



   /***************************************************************************
    **
    ***************************************************************************/
   @Override
   public void enrich(QInstance qInstance, QFieldMetaData fieldMetaData)
   {
      try
      {
         FormAdjusterRegistry.registerFormAdjusters(qInstance, this);
      }
      catch(Exception e)
      {
         LOG.warn("Error enriching MaterialDashboardFieldMetaData", e);
      }
   }



   /***************************************************************************
    **
    ***************************************************************************/
   @Override
   public void validate(QInstance qInstance, QFieldMetaData fieldMetaData, QInstanceValidator qInstanceValidator)
   {
      String prefix = "MaterialDashboardFieldMetaData for field [" + fieldMetaData.getName() + "]";

      boolean needsFormAdjusterIdentifer = false;
      if(onChangeFormAdjuster != null)
      {
         needsFormAdjusterIdentifer = true;
         qInstanceValidator.validateSimpleCodeReference(prefix + ", onChangeFormAdjuster", onChangeFormAdjuster, FormAdjusterInterface.class);
      }

      if(onLoadFormAdjuster != null)
      {
         needsFormAdjusterIdentifer = true;
         qInstanceValidator.validateSimpleCodeReference(prefix + ", onLoadFormAdjuster", onLoadFormAdjuster, FormAdjusterInterface.class);
      }

      if(needsFormAdjusterIdentifer)
      {
         qInstanceValidator.assertCondition(StringUtils.hasContent(formAdjusterIdentifier), prefix + ", formAdjusterIdentifier is required if using any FormAdjusters");
      }
   }



   /*******************************************************************************
    ** Getter for formAdjusterIdentifier
    *******************************************************************************/
   public String getFormAdjusterIdentifier()
   {
      return (this.formAdjusterIdentifier);
   }



   /*******************************************************************************
    ** Setter for formAdjusterIdentifier
    *******************************************************************************/
   public void setFormAdjusterIdentifier(String formAdjusterIdentifier)
   {
      this.formAdjusterIdentifier = formAdjusterIdentifier;
   }



   /*******************************************************************************
    ** Fluent setter for formAdjusterIdentifier
    *******************************************************************************/
   public MaterialDashboardFieldMetaData withFormAdjusterIdentifier(String formAdjusterIdentifier)
   {
      this.formAdjusterIdentifier = formAdjusterIdentifier;
      return (this);
   }


   /*******************************************************************************
    ** Getter for fieldsToDisableWhileRunningAdjusters
    *******************************************************************************/
   public Set<String> getFieldsToDisableWhileRunningAdjusters()
   {
      return (this.fieldsToDisableWhileRunningAdjusters);
   }



   /*******************************************************************************
    ** Setter for fieldsToDisableWhileRunningAdjusters
    *******************************************************************************/
   public void setFieldsToDisableWhileRunningAdjusters(Set<String> fieldsToDisableWhileRunningAdjusters)
   {
      this.fieldsToDisableWhileRunningAdjusters = fieldsToDisableWhileRunningAdjusters;
   }



   /*******************************************************************************
    ** Fluent setter for fieldsToDisableWhileRunningAdjusters
    *******************************************************************************/
   public MaterialDashboardFieldMetaData withFieldsToDisableWhileRunningAdjusters(Set<String> fieldsToDisableWhileRunningAdjusters)
   {
      this.fieldsToDisableWhileRunningAdjusters = fieldsToDisableWhileRunningAdjusters;
      return (this);
   }


}
