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

import {AvatarProps} from "@mui/material";
import {FC, forwardRef} from "react";
import MDAvatarRoot from "qqq/components/Temporary/MDAvatar/MDAvatarRoot";

// declare props types for MDAvatar
interface Props extends AvatarProps {
  bgColor?:
    | "transparent"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  shadow?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "inset";
  [key: string]: any;
}

const MDAvatar: FC<Props> = forwardRef(({bgColor, size, shadow, ...rest}, ref) => (
   <MDAvatarRoot ref={ref} ownerState={{shadow, bgColor, size}} {...rest} />
));

// Declaring default props for MDAvatar
MDAvatar.defaultProps = {
   bgColor: "transparent",
   size: "md",
   shadow: "none",
};

export default MDAvatar;
