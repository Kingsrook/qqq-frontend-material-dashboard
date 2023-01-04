/**
=========================================================
* Material Dashboard 2 PRO React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { createTheme } from "@mui/material/styles";
// import Fade from "@mui/material/Fade";

// Material Dashboard 2 PRO React TS Base Styles
import colors from "qqq/assets/theme/base/colors";
import breakpoints from "qqq/assets/theme/base/breakpoints";
import typography from "qqq/assets/theme/base/typography";
import boxShadows from "qqq/assets/theme/base/boxShadows";
import borders from "qqq/assets/theme/base/borders";
import globals from "qqq/assets/theme/base/globals";

// Material Dashboard 2 PRO React TS Helper Functions
import boxShadow from "qqq/assets/theme/functions/boxShadow";
import hexToRgb from "qqq/assets/theme/functions/hexToRgb";
import linearGradient from "qqq/assets/theme/functions/linearGradient";
import pxToRem from "qqq/assets/theme/functions/pxToRem";
import rgba from "qqq/assets/theme/functions/rgba";

// Material Dashboard 2 PRO React TS components base styles for @mui material components
import sidenav from "qqq/assets/theme/components/sidenav";
import list from "qqq/assets/theme/components/list";
import listItem from "qqq/assets/theme/components/list/listItem";
import listItemText from "qqq/assets/theme/components/list/listItemText";
import card from "qqq/assets/theme/components/card";
import cardMedia from "qqq/assets/theme/components/card/cardMedia";
import cardContent from "qqq/assets/theme/components/card/cardContent";
import button from "qqq/assets/theme/components/button";
import iconButton from "qqq/assets/theme/components/iconButton";
import input from "qqq/assets/theme/components/form/input";
import inputLabel from "qqq/assets/theme/components/form/inputLabel";
import inputOutlined from "qqq/assets/theme/components/form/inputOutlined";
import textField from "qqq/assets/theme/components/form/textField";
import menu from "qqq/assets/theme/components/menu";
import menuItem from "qqq/assets/theme/components/menu/menuItem";
import switchButton from "qqq/assets/theme/components/form/switchButton";
import divider from "qqq/assets/theme/components/divider";
import tableContainer from "qqq/assets/theme/components/table/tableContainer";
import tableHead from "qqq/assets/theme/components/table/tableHead";
import tableCell from "qqq/assets/theme/components/table/tableCell";
import linearProgress from "qqq/assets/theme/components/linearProgress";
import breadcrumbs from "qqq/assets/theme/components/breadcrumbs";
import slider from "qqq/assets/theme/components/slider";
import avatar from "qqq/assets/theme/components/avatar";
import tooltip from "qqq/assets/theme/components/tooltip";
import appBar from "qqq/assets/theme/components/appBar";
import tabs from "qqq/assets/theme/components/tabs";
import tab from "qqq/assets/theme/components/tabs/tab";
import stepper from "qqq/assets/theme/components/stepper";
import step from "qqq/assets/theme/components/stepper/step";
import stepConnector from "qqq/assets/theme/components/stepper/stepConnector";
import stepLabel from "qqq/assets/theme/components/stepper/stepLabel";
import stepIcon from "qqq/assets/theme/components/stepper/stepIcon";
import select from "qqq/assets/theme/components/form/select";
import formControlLabel from "qqq/assets/theme/components/form/formControlLabel";
import formLabel from "qqq/assets/theme/components/form/formLabel";
import checkbox from "qqq/assets/theme/components/form/checkbox";
import radio from "qqq/assets/theme/components/form/radio";
import autocomplete from "qqq/assets/theme/components/form/autocomplete";
import flatpickr from "qqq/assets/theme/components/flatpickr";
import container from "qqq/assets/theme/components/container";
import popover from "qqq/assets/theme/components/popover";
import buttonBase from "qqq/assets/theme/components/buttonBase";
import icon from "qqq/assets/theme/components/icon";
import svgIcon from "qqq/assets/theme/components/svgIcon";
import link from "qqq/assets/theme/components/link";
import dialog from "qqq/assets/theme/components/dialog";
import dialogTitle from "qqq/assets/theme/components/dialog/dialogTitle";
import dialogContent from "qqq/assets/theme/components/dialog/dialogContent";
import dialogContentText from "qqq/assets/theme/components/dialog/dialogContentText";
import dialogActions from "qqq/assets/theme/components/dialog/dialogActions";

export default createTheme({
  direction: "rtl",
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...flatpickr,
        ...container,
      },
    },
    MuiDrawer: { ...sidenav },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiCard: { ...card },
    MuiCardMedia: { ...cardMedia },
    MuiCardContent: { ...cardContent },
    MuiButton: { ...button },
    MuiIconButton: { ...iconButton },
    MuiInput: { ...input },
    MuiInputLabel: { ...inputLabel },
    MuiOutlinedInput: { ...inputOutlined },
    MuiTextField: { ...textField },
    MuiMenu: { ...menu },
    MuiMenuItem: { ...menuItem },
    MuiSwitch: { ...switchButton },
    MuiDivider: { ...divider },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTableCell: { ...tableCell },
    MuiLinearProgress: { ...linearProgress },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiSlider: { ...slider },
    MuiAvatar: { ...avatar },
    MuiTooltip: { ...tooltip },
    MuiAppBar: { ...appBar },
    MuiTabs: { ...tabs },
    MuiTab: { ...tab },
    MuiStepper: { ...stepper },
    MuiStep: { ...step },
    MuiStepConnector: { ...stepConnector },
    MuiStepLabel: { ...stepLabel },
    MuiStepIcon: { ...stepIcon },
    MuiSelect: { ...select },
    MuiFormControlLabel: { ...formControlLabel },
    MuiFormLabel: { ...formLabel },
    MuiCheckbox: { ...checkbox },
    MuiRadio: { ...radio },
    MuiAutocomplete: { ...autocomplete },
    MuiPopover: { ...popover },
    MuiButtonBase: { ...buttonBase },
    MuiIcon: { ...icon },
    MuiSvgIcon: { ...svgIcon },
    MuiLink: { ...link },
    MuiDialog: { ...dialog },
    MuiDialogTitle: { ...dialogTitle },
    MuiDialogContent: { ...dialogContent },
    MuiDialogContentText: { ...dialogContentText },
    MuiDialogActions: { ...dialogActions },
  },
});
