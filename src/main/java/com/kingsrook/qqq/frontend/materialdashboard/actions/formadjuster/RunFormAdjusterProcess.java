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

package com.kingsrook.qqq.frontend.materialdashboard.actions.formadjuster;


import java.io.Serializable;
import java.util.Collections;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import com.kingsrook.qqq.backend.core.actions.processes.BackendStep;
import com.kingsrook.qqq.backend.core.exceptions.QException;
import com.kingsrook.qqq.backend.core.logging.QLogger;
import com.kingsrook.qqq.backend.core.model.actions.processes.RunBackendStepInput;
import com.kingsrook.qqq.backend.core.model.actions.processes.RunBackendStepOutput;
import com.kingsrook.qqq.backend.core.model.metadata.MetaDataProducerInterface;
import com.kingsrook.qqq.backend.core.model.metadata.QInstance;
import com.kingsrook.qqq.backend.core.model.metadata.code.QCodeReference;
import com.kingsrook.qqq.backend.core.model.metadata.processes.QBackendStepMetaData;
import com.kingsrook.qqq.backend.core.model.metadata.processes.QProcessMetaData;
import com.kingsrook.qqq.backend.core.utils.JsonUtils;
import com.kingsrook.qqq.backend.core.utils.StringUtils;
import com.kingsrook.qqq.middleware.javalin.routeproviders.ProcessBasedRouterPayload;
import static com.kingsrook.qqq.backend.core.logging.LogUtils.logPair;


/*******************************************************************************
 ** process that looks up a form adjuster from the registry, and then runs it
 *******************************************************************************/
public class RunFormAdjusterProcess implements BackendStep, MetaDataProducerInterface<QProcessMetaData>
{
   public static final String NAME = "MaterialDashboardRunFormAdjusterProcess";

   private static final QLogger LOG = QLogger.getLogger(RunFormAdjusterProcess.class);

   public static final String EVENT_ON_LOAD   = "onLoad";
   public static final String EVENT_ON_CHANGE = "onChange";



   /***************************************************************************
    **
    ***************************************************************************/
   @Override
   public QProcessMetaData produce(QInstance qInstance) throws QException
   {
      return new QProcessMetaData()
         .withName(NAME)
         .withStep(new QBackendStepMetaData()
            .withName("execute")
            .withCode(new QCodeReference(getClass())));
   }



   /***************************************************************************
    **
    ***************************************************************************/
   @Override
   public void run(RunBackendStepInput runBackendStepInput, RunBackendStepOutput runBackendStepOutput) throws QException
   {
      ProcessBasedRouterPayload payload = runBackendStepInput.getProcessPayload(ProcessBasedRouterPayload.class);

      String identifier = payload.getPathParams().get("identifier");
      String event      = payload.getPathParams().get("event");

      try
      {
         FormAdjusterInterface formAdjuster = switch(event)
         {
            case EVENT_ON_CHANGE -> FormAdjusterRegistry.getOnChangeAdjuster(identifier);
            case EVENT_ON_LOAD -> FormAdjusterRegistry.getOnLoadAdjuster(identifier);
            default -> throw new QException("Unknown event type: " + event);
         };

         if(formAdjuster == null)
         {
            throw new QException("No form adjuster found for identifier: " + identifier + " and event: " + event);
         }

         FormAdjusterInput input = new FormAdjusterInput();
         input.setEvent(event);
         input.setFieldName(payload.getFormParam("fieldName"));
         input.setNewValue(payload.getFormParam("newValue"));

         String                    allValuesJson = payload.getFormParam("allValues");
         Map<String, Serializable> allValues     = StringUtils.hasContent(allValuesJson) ? JsonUtils.toObject(allValuesJson, new TypeReference<>() {}) : Collections.emptyMap();
         input.setAllValues(allValues);

         FormAdjusterOutput output = formAdjuster.execute(input);

         payload.setResponseString(JsonUtils.toJson(output));
         runBackendStepOutput.setProcessPayload(payload);
      }
      catch(Exception e)
      {
         LOG.warn("Error running form adjuster process", e, logPair("identifier", identifier), logPair("event", event));
         throw new QException("Error running form adjuster process: " + e.getMessage(), e);
      }
   }

}
