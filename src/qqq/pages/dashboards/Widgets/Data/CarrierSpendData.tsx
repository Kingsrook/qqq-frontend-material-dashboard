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

import DefaultCell from "layouts/dashboards/sales/components/DefaultCell";
import ProductCell from "layouts/dashboards/sales/components/ProductCell";
import RefundsCell from "layouts/dashboards/sales/components/RefundsCell";
import axlehire from "qqq/images/carrier-logos/axlehire.png"
import cdl from "qqq/images/carrier-logos/cdl.png"
import dhl from "qqq/images/carrier-logos/dhl.png"
import fedex from "qqq/images/carrier-logos/fedex.png"
import lso from "qqq/images/carrier-logos/lso.png"
import ontrac from "qqq/images/carrier-logos/ontrac.png"
import ups from "qqq/images/carrier-logos/ups.png"

const carrierSpendData = {
   columns: [
      {Header: "carrier", accessor: "product", width: "55%"},
      {Header: "total YTD", accessor: "value"},
      {Header: "monthly average", accessor: "adsSpent", align: "center"},
      {Header: "service failures", accessor: "refunds", align: "center"},
   ],

   rows: [
      {
         product: <ProductCell image={axlehire} name="AxleHire" orders={921} />,
         value: <DefaultCell>$140,925</DefaultCell>,
         adsSpent: <DefaultCell>$24,531</DefaultCell>,
         refunds: <RefundsCell value={121} icon={{color: "success", name: "keyboard_arrow_up"}} />,
      },
      {
         product: <ProductCell image={cdl} name="CDL" orders={2.421} />,
         value: <DefaultCell>$40,600</DefaultCell>,
         adsSpent: <DefaultCell>$9,430</DefaultCell>,
         refunds: <RefundsCell value={54} icon={{color: "success", name: "keyboard_arrow_up"}} />,
      },
      {
         product: <ProductCell image={dhl} name="DHL" orders={2.421} />,
         value: <DefaultCell>$90,233</DefaultCell>,
         adsSpent: <DefaultCell>$18.30</DefaultCell>,
         refunds: <RefundsCell value={54} icon={{color: "success", name: "keyboard_arrow_up"}} />,
      },
      {
         product: <ProductCell image={fedex} name="FedEx" orders={12.821} />,
         value: <DefaultCell>$80,250</DefaultCell>,
         adsSpent: <DefaultCell>$4,200</DefaultCell>,
         refunds: <RefundsCell value={40} icon={{color: "error", name: "keyboard_arrow_down"}} />,
      },
      {
         product: <ProductCell image={lso} name="LSO" orders={5.921} />,
         value: <DefaultCell>$91,300</DefaultCell>,
         adsSpent: <DefaultCell>$7,364</DefaultCell>,
         refunds: <RefundsCell value={5} icon={{color: "error", name: "keyboard_arrow_down"}} />,
      },
      {
         product: <ProductCell image={ontrac} name="OnTrac" orders={5.921} />,
         value: <DefaultCell>$77,300</DefaultCell>,
         adsSpent: <DefaultCell>$4,064</DefaultCell>,
         refunds: <RefundsCell value={5} icon={{color: "error", name: "keyboard_arrow_down"}} />,
      },
      {
         product: <ProductCell image={ups} name="UPS" orders={8.232} />,
         value: <DefaultCell>$130,992</DefaultCell>,
         adsSpent: <DefaultCell>$9,500</DefaultCell>,
         refunds: <RefundsCell value={13} icon={{color: "success", name: "keyboard_arrow_up"}} />,
      },
   ],
};

export default carrierSpendData;
