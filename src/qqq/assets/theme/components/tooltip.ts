/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Fade from "@mui/material/Fade";

// Material Dashboard 2 PRO React TS Base Styles
import colors from "qqq/assets/theme/base/colors";
import typography from "qqq/assets/theme/base/typography";
import borders from "qqq/assets/theme/base/borders";

// Material Dashboard 2 PRO React TS Helper Functions
import pxToRem from "qqq/assets/theme/functions/pxToRem";

const { black, light, white, dark } = colors;
const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;

// types
type Types = any;

const tooltip: Types = {
  defaultProps: {
    arrow: true,
    TransitionComponent: Fade,
  },

  styleOverrides: {
    tooltip: {
      maxWidth: pxToRem(300),
      backgroundColor: white.main,
      color: dark.main,
      fontSize: size.sm,
      fontWeight: fontWeightRegular,
      textAlign: "left",
      borderRadius: borderRadius.md,
      opacity: 0.7,
      padding: "1rem",
      boxShadow: "0px 0px 12px rgba(128, 128, 128, 0.40)"
    },

    arrow: {
      color: white.main,
    },
  },
};

export default tooltip;
