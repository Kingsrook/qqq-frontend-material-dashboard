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

import React, {Component, ErrorInfo} from "react";

interface Props
{
   errorElement?: React.ReactNode;
   children: React.ReactNode;
}

interface State
{
   hasError: boolean;
}

/*******************************************************************************
 ** Component that you can wrap around other components that might throw an error,
 ** to give some isolation, rather than breaking a whole page.
 ** Credit: https://medium.com/@bobjunior542/how-to-use-error-boundaries-in-react-js-with-typescript-ee90ec814bf1
 *******************************************************************************/
class ErrorBoundary extends Component<Props, State>
{
   /***************************************************************************
    *
    ***************************************************************************/
   constructor(props: Props)
   {
      super(props);
      this.state = {hasError: false};
   }

   /***************************************************************************
    *
    ***************************************************************************/
   componentDidCatch(error: Error, errorInfo: ErrorInfo)
   {
      console.error("ErrorBoundary caught an error: ", error, errorInfo);
      this.setState({hasError: true});
   }

   /***************************************************************************
    *
    ***************************************************************************/
   render()
   {
      if (this.state.hasError)
      {
         return this.props.errorElement ?? <span>(Error)</span>;
      }

      return this.props.children;
   }
}

export default ErrorBoundary;