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


/*******************************************************************************
 ** Object to represent when data is loading, e.g., from backend, and when you
 ** want to be able to show an empty state at first, but then after a bit, switch
 ** to a "loading..." type UI (the idea being, to not immediately show that "loading"
 ** UI, for cases where that would cause maybe an undesirable flickering.
 **
 ** To use:
 ** - Add 1 or more LoadingState objects as state variables in your component.
 **   Note that you don't generally need to ever "set" these states.
 **   Provide a "useReducer"/"forceUpdate" function to the constructor, and the initial state (default is "notLoading"), e.g.:
 **      const [loadingSelectedVersion, _] = useState(new LoadingState(forceUpdate, "loading"));
 ** - Before an `await`, call `.setLoading()` on your LoadingState instance.
 **   Internally, that call will set a timeout that will switch to the loadingSlow state.
 ** - After the `await`, call `.setNotLoading()` on your LoadingState instance.
 **   Internally, that call will cancel the timeout that would have put us in loadingSlow.
 **   (Assume you'll also have set some other state based on the data that came back from the await,
 **   and that will trigger the next render - or - do you have make a forceUpdate() call there anyway?)
 ** - In your template, before your "loaded" view, check for `myLoadingState.isNotLoading()`, e.g.
 **      {myLoadingState.isNotLoading() && myData && <Box>...
 ** - In your template, before your "slow loading" view, check for `myLoadingState.isLoadingSlow()`, e.g.
 **      {myLoadingState.isLoadingSlow() && <Spinner />}
 **
 ** In addition, you can also supply a callback to run "upon slow" (e.g., when
 ** moving into the slow state).
 *******************************************************************************/
export class LoadingState
{
   private state: "notLoading" | "loading" | "slow"
   private slowTimeout: any;
   private forceUpdate: () => void;
   private uponSlowCallback: () => void;

   constructor(forceUpdate: () => void, initialState: "notLoading" | "loading" | "slow" = "notLoading")
   {
      this.forceUpdate = forceUpdate;
      this.state = initialState;

      if(initialState == "loading")
      {
         this.setLoading();
      }
      else if(initialState == "notLoading")
      {
         this.setNotLoading();
      }
   }

   public setLoading()
   {
      clearTimeout(this.slowTimeout);
      this.state = "loading";
      this.slowTimeout = setTimeout(() =>
      {
         this.state = "slow";

         if(this.uponSlowCallback)
         {
            this.uponSlowCallback();
         }

         this.forceUpdate();
      }, 1000);
   }

   public setNotLoading()
   {
      clearTimeout(this.slowTimeout);
      this.state = "notLoading";
   }

   public isLoading(): boolean
   {
      return (this.state == "loading");
   }

   public isLoadingSlow(): boolean
   {
      return (this.state == "slow");
   }

   public isNotLoading(): boolean
   {
      return (this.state == "notLoading");
   }

   public getState(): string
   {
      return (this.state);
   }

   public setUponSlowCallback(value: any)
   {
      this.uponSlowCallback = value;
   }

}