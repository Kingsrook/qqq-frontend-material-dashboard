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

import {Check, Pending, RocketLaunch} from "@mui/icons-material";
import {Skeleton, StepConnector} from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import {withStyles} from "@mui/styles";
import React from "react";
import {NavLink} from "react-router-dom";
import MDBox from "qqq/components/Temporary/MDBox";


/////////////////////////////////////////////
// structure of expected stepper card data //
/////////////////////////////////////////////
export interface StepperCardData
{
   title: string;
   activeStep: number;
   steps: {
      icon: string;
      label: string;
      linkText: string;
      linkURL: string;
   }[];
}


////////////////////////////////////
// define properties and defaults //
////////////////////////////////////
interface Props
{
   data: StepperCardData;
}


function StepperCard({data}: Props): JSX.Element
{
   const activeStep = data && data.activeStep ? data.activeStep : 0;

   const CustomizedConnector = withStyles({
      line: {
         color: "#344767",
         marginTop: "9px",
         marginRight: "30px",
         marginLeft: "30px",
      },
      "& .MuiStepConnector-completed":
         {
            color: "red !important"
         }
   })(StepConnector);

   console.log(`data ${JSON.stringify(data)}`);

   return (
      <Stepper connector={<CustomizedConnector />} activeStep={activeStep} alternativeLabel sx={{paddingBottom: "0px", boxShadow: "none", background: "white"}}>
         {
            data && data.steps ? (
               data.steps.map((step, index) => (
                  <Step key={step.label}>
                     {
                        index < activeStep && (
                           <MDBox>
                              <StepLabel icon={<Check />} sx={{
                                 color: "green",
                                 fontSize: "35px",
                                 "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                                    {
                                       color: "green !important",
                                    }
                              }}>{step.label}</StepLabel>
                           </MDBox>
                        )
                     }
                     {
                        index > activeStep && (
                           <MDBox>
                              <StepLabel icon={<Pending />} sx={{
                                 color: "#ced4da",
                                 fontSize: "35px",
                                 "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel":
                                    {
                                       color: "#ced4da !important",
                                    }
                              }}>{step.label}</StepLabel>
                           </MDBox>
                        )
                     }
                     {
                        index === activeStep && (
                           <MDBox>
                              <StepLabel icon={<RocketLaunch />} sx={{
                                 color: "#04aaef",
                                 fontSize: "35px",
                                 "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel":
                                    {
                                       color: "#344767 !important", // Just text label (COMPLETED)
                                    }
                              }}>{step.label}</StepLabel>
                              {
                                 step.linkURL && (
                                    <MDBox sx={{textAlign: "center", fontSize: "14px"}}>
                                       <NavLink to={step.linkURL}>{step.linkText}</NavLink>
                                    </MDBox>
                                 )
                              }
                           </MDBox>
                        )
                     }
                  </Step>
               ))
            ) : (
               <Skeleton width="100%" height="80px" />
            )
         }
      </Stepper>
   );
}

export default StepperCard;
