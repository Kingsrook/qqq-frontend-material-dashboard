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
import {Icon, Skeleton, StepConnector} from "@mui/material";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import {withStyles} from "@mui/styles";
import React from "react";
import {NavLink} from "react-router-dom";


/////////////////////////////////////////////
// structure of expected stepper card data //
/////////////////////////////////////////////
export interface StepperCardData
{
   title: string;
   activeStep: number;
   steps: {
      label: string;
      linkText: string;
      linkURL: string;
      iconOverride: string;
      colorOverride: string;
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
      }
   })(StepConnector);

   // console.log(`data ${JSON.stringify(data)}`);

   return (
      <Stepper connector={<CustomizedConnector />} activeStep={activeStep} alternativeLabel sx={{paddingBottom: "0px", boxShadow: "none", background: "white"}}>
         {
            data && data.steps ? (
               data.steps.map((step, index) => (
                  <Step key={step.label}>
                     {
                        index < activeStep && (
                           <Box>
                              <StepLabel icon={step.iconOverride ? <Icon>{step.iconOverride}</Icon> : <Check />} sx={{
                                 color: step.colorOverride ?? "green",
                                 fontSize: "35px",
                                 "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                                    {
                                       color: `${step.colorOverride ?? "green"} !important`,
                                    }
                              }}>{step.label}</StepLabel>
                           </Box>
                        )
                     }
                     {
                        index > activeStep && (
                           <Box>
                              <StepLabel icon={step.iconOverride ? <Icon>{step.iconOverride}</Icon> : <Pending />} sx={{
                                 color: step.colorOverride ?? "#ced4da",
                                 fontSize: "35px",
                                 "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel":
                                    {
                                       color: `${step.colorOverride ?? "#ced4da"} !important`,
                                    }
                              }}>{step.label}</StepLabel>
                           </Box>
                        )
                     }
                     {
                        index === activeStep && (
                           <Box>
                              <StepLabel icon={step.iconOverride ? <Icon>{step.iconOverride}</Icon> : <RocketLaunch />} sx={{
                                 color: step.colorOverride ?? "#04aaef",
                                 fontSize: "35px",
                                 "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel":
                                    {
                                       color: `${step.colorOverride ?? "#344767"} !important`,
                                    }
                              }}>{step.label}</StepLabel>
                              {
                                 step.linkURL && (
                                    <Box sx={{textAlign: "center", fontSize: "14px"}}>
                                       <NavLink to={step.linkURL}>{step.linkText}</NavLink>
                                    </Box>
                                 )
                              }
                           </Box>
                        )
                     }
                  </Step>
               ))
            ) : (

               Array(5).fill(0).map((_, i) =>
                  <Step key={`step-${i}`}>
                     <Box>
                        <StepLabel icon={<Pending />} sx={{
                           color: "#ced4da",
                           fontSize: "35px",
                           "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel":
                              {
                                 color: "#ced4da !important",
                              }
                        }}><Skeleton /></StepLabel>
                     </Box>
                  </Step>
               )
            )
         }
      </Stepper>
   );
}

export default StepperCard;
