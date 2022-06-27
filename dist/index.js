'use strict';

var jsxRuntime = require('react/jsx-runtime');
var ReactDOM = require('react-dom');
var reactRouterDom = require('react-router-dom');
var react = require('react');
var styles = require('@mui/material/styles');
var CssBaseline = require('@mui/material/CssBaseline');
var Icon = require('@mui/material/Icon');
var Box = require('@mui/material/Box');
var List = require('@mui/material/List');
var Divider = require('@mui/material/Divider');
var Link = require('@mui/material/Link');
var Typography = require('@mui/material/Typography');
var Collapse = require('@mui/material/Collapse');
var ListItem = require('@mui/material/ListItem');
var ListItemIcon = require('@mui/material/ListItemIcon');
var ListItemText = require('@mui/material/ListItemText');
var Drawer = require('@mui/material/Drawer');
var GitHubButton = require('react-github-btn');
var Switch = require('@mui/material/Switch');
var IconButton = require('@mui/material/IconButton');
var TwitterIcon = require('@mui/icons-material/Twitter');
var FacebookIcon = require('@mui/icons-material/Facebook');
var Button = require('@mui/material/Button');
var material = require('@mui/material');
var chroma = require('chroma-js');
var Fade = require('@mui/material/Fade');
var rtlPlugin = require('stylis-plugin-rtl');
var react$1 = require('@emotion/react');
var createCache = require('@emotion/cache');
var Grid = require('@mui/material/Grid');
var Tooltip = require('@mui/material/Tooltip');
var AppBar = require('@mui/material/AppBar');
var Toolbar = require('@mui/material/Toolbar');
var Menu = require('@mui/material/Menu');
var TextField = require('@mui/material/TextField');
var Badge = require('@mui/material/Badge');
var MenuItem = require('@mui/material/MenuItem');
var reactChartjs2 = require('react-chartjs-2');
var Card = require('@mui/material/Card');
var core = require('@react-jvectormap/core');
var world = require('@react-jvectormap/world');
var Table = require('@mui/material/Table');
var TableBody = require('@mui/material/TableBody');
var TableContainer = require('@mui/material/TableContainer');
var TableHead = require('@mui/material/TableHead');
var TableRow = require('@mui/material/TableRow');
var TableCell$1 = require('@mui/material/TableCell');
var US = require('assets/images/icons/flags/US.png');
var DE = require('assets/images/icons/flags/DE.png');
var GB = require('assets/images/icons/flags/GB.png');
var BR = require('assets/images/icons/flags/BR.png');
var booking1 = require('assets/images/products/product-1-min.jpg');
var booking2 = require('assets/images/products/product-2-min.jpg');
var booking3 = require('assets/images/products/product-3-min.jpg');
var reactTable = require('react-table');
var Autocomplete = require('@mui/material/Autocomplete');
var AU = require('assets/images/icons/flags/AU.png');
var Avatar = require('@mui/material/Avatar');
var nikeV22 = require('assets/images/ecommerce/blue-shoe.jpeg');
var businessKit = require('assets/images/ecommerce/black-mug.jpeg');
var blackChair = require('assets/images/ecommerce/black-chair.jpeg');
var wirelessCharger = require('assets/images/ecommerce/bang-sound.jpeg');
var tripKit = require('assets/images/ecommerce/photo-tools.jpeg');
var InstagramIcon = require('@mui/icons-material/Instagram');
var CardMedia = require('@mui/material/CardMedia');
var Tabs = require('@mui/material/Tabs');
var Tab = require('@mui/material/Tab');
var burceMars = require('assets/images/bruce-mars.jpg');
var backgroundImage = require('assets/images/bg-profile.jpeg');
var kal = require('assets/images/kal-visuals-square.jpg');
var marie = require('assets/images/marie.jpg');
var ivana = require('assets/images/ivana-square.jpg');
var team3 = require('assets/images/team-3.jpg');
var team4 = require('assets/images/team-4.jpg');
var homeDecor1 = require('assets/images/home-decor-1.jpg');
var homeDecor2 = require('assets/images/home-decor-2.jpg');
var homeDecor3 = require('assets/images/home-decor-3.jpg');
var homeDecor4 = require('assets/images/home-decor-4.jpeg');
var team1 = require('assets/images/team-1.jpg');
var team2 = require('assets/images/team-2.jpg');
var logoSlack = require('assets/images/small-logos/logo-slack.svg');
var logoSpotify = require('assets/images/small-logos/logo-spotify.svg');
var logoAtlassian = require('assets/images/small-logos/logo-atlassian.svg');
var logoAsana = require('assets/images/small-logos/logo-asana.svg');
var GitHubIcon = require('@mui/icons-material/GitHub');
var GoogleIcon = require('@mui/icons-material/Google');
var Popper = require('@mui/material/Popper');
var Grow = require('@mui/material/Grow');
var Container = require('@mui/material/Container');
var bgImage = require('assets/images/bg-sign-in-basic.jpeg');
var QController = require('qqq-frontend-core/lib/controllers/QController');
var brandWhite = require('assets/images/logo-ct.png');
var brandDark = require('assets/images/logo-ct-dark.png');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
var CssBaseline__default = /*#__PURE__*/_interopDefaultLegacy(CssBaseline);
var Icon__default = /*#__PURE__*/_interopDefaultLegacy(Icon);
var Box__default = /*#__PURE__*/_interopDefaultLegacy(Box);
var List__default = /*#__PURE__*/_interopDefaultLegacy(List);
var Divider__default = /*#__PURE__*/_interopDefaultLegacy(Divider);
var Link__default = /*#__PURE__*/_interopDefaultLegacy(Link);
var Typography__default = /*#__PURE__*/_interopDefaultLegacy(Typography);
var Collapse__default = /*#__PURE__*/_interopDefaultLegacy(Collapse);
var ListItem__default = /*#__PURE__*/_interopDefaultLegacy(ListItem);
var ListItemIcon__default = /*#__PURE__*/_interopDefaultLegacy(ListItemIcon);
var ListItemText__default = /*#__PURE__*/_interopDefaultLegacy(ListItemText);
var Drawer__default = /*#__PURE__*/_interopDefaultLegacy(Drawer);
var GitHubButton__default = /*#__PURE__*/_interopDefaultLegacy(GitHubButton);
var Switch__default = /*#__PURE__*/_interopDefaultLegacy(Switch);
var IconButton__default = /*#__PURE__*/_interopDefaultLegacy(IconButton);
var TwitterIcon__default = /*#__PURE__*/_interopDefaultLegacy(TwitterIcon);
var FacebookIcon__default = /*#__PURE__*/_interopDefaultLegacy(FacebookIcon);
var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
var chroma__default = /*#__PURE__*/_interopDefaultLegacy(chroma);
var Fade__default = /*#__PURE__*/_interopDefaultLegacy(Fade);
var rtlPlugin__default = /*#__PURE__*/_interopDefaultLegacy(rtlPlugin);
var createCache__default = /*#__PURE__*/_interopDefaultLegacy(createCache);
var Grid__default = /*#__PURE__*/_interopDefaultLegacy(Grid);
var Tooltip__default = /*#__PURE__*/_interopDefaultLegacy(Tooltip);
var AppBar__default = /*#__PURE__*/_interopDefaultLegacy(AppBar);
var Toolbar__default = /*#__PURE__*/_interopDefaultLegacy(Toolbar);
var Menu__default = /*#__PURE__*/_interopDefaultLegacy(Menu);
var TextField__default = /*#__PURE__*/_interopDefaultLegacy(TextField);
var Badge__default = /*#__PURE__*/_interopDefaultLegacy(Badge);
var MenuItem__default = /*#__PURE__*/_interopDefaultLegacy(MenuItem);
var Card__default = /*#__PURE__*/_interopDefaultLegacy(Card);
var Table__default = /*#__PURE__*/_interopDefaultLegacy(Table);
var TableBody__default = /*#__PURE__*/_interopDefaultLegacy(TableBody);
var TableContainer__default = /*#__PURE__*/_interopDefaultLegacy(TableContainer);
var TableHead__default = /*#__PURE__*/_interopDefaultLegacy(TableHead);
var TableRow__default = /*#__PURE__*/_interopDefaultLegacy(TableRow);
var TableCell__default = /*#__PURE__*/_interopDefaultLegacy(TableCell$1);
var US__default = /*#__PURE__*/_interopDefaultLegacy(US);
var DE__default = /*#__PURE__*/_interopDefaultLegacy(DE);
var GB__default = /*#__PURE__*/_interopDefaultLegacy(GB);
var BR__default = /*#__PURE__*/_interopDefaultLegacy(BR);
var booking1__default = /*#__PURE__*/_interopDefaultLegacy(booking1);
var booking2__default = /*#__PURE__*/_interopDefaultLegacy(booking2);
var booking3__default = /*#__PURE__*/_interopDefaultLegacy(booking3);
var Autocomplete__default = /*#__PURE__*/_interopDefaultLegacy(Autocomplete);
var AU__default = /*#__PURE__*/_interopDefaultLegacy(AU);
var Avatar__default = /*#__PURE__*/_interopDefaultLegacy(Avatar);
var nikeV22__default = /*#__PURE__*/_interopDefaultLegacy(nikeV22);
var businessKit__default = /*#__PURE__*/_interopDefaultLegacy(businessKit);
var blackChair__default = /*#__PURE__*/_interopDefaultLegacy(blackChair);
var wirelessCharger__default = /*#__PURE__*/_interopDefaultLegacy(wirelessCharger);
var tripKit__default = /*#__PURE__*/_interopDefaultLegacy(tripKit);
var InstagramIcon__default = /*#__PURE__*/_interopDefaultLegacy(InstagramIcon);
var CardMedia__default = /*#__PURE__*/_interopDefaultLegacy(CardMedia);
var Tabs__default = /*#__PURE__*/_interopDefaultLegacy(Tabs);
var Tab__default = /*#__PURE__*/_interopDefaultLegacy(Tab);
var burceMars__default = /*#__PURE__*/_interopDefaultLegacy(burceMars);
var backgroundImage__default = /*#__PURE__*/_interopDefaultLegacy(backgroundImage);
var kal__default = /*#__PURE__*/_interopDefaultLegacy(kal);
var marie__default = /*#__PURE__*/_interopDefaultLegacy(marie);
var ivana__default = /*#__PURE__*/_interopDefaultLegacy(ivana);
var team3__default = /*#__PURE__*/_interopDefaultLegacy(team3);
var team4__default = /*#__PURE__*/_interopDefaultLegacy(team4);
var homeDecor1__default = /*#__PURE__*/_interopDefaultLegacy(homeDecor1);
var homeDecor2__default = /*#__PURE__*/_interopDefaultLegacy(homeDecor2);
var homeDecor3__default = /*#__PURE__*/_interopDefaultLegacy(homeDecor3);
var homeDecor4__default = /*#__PURE__*/_interopDefaultLegacy(homeDecor4);
var team1__default = /*#__PURE__*/_interopDefaultLegacy(team1);
var team2__default = /*#__PURE__*/_interopDefaultLegacy(team2);
var logoSlack__default = /*#__PURE__*/_interopDefaultLegacy(logoSlack);
var logoSpotify__default = /*#__PURE__*/_interopDefaultLegacy(logoSpotify);
var logoAtlassian__default = /*#__PURE__*/_interopDefaultLegacy(logoAtlassian);
var logoAsana__default = /*#__PURE__*/_interopDefaultLegacy(logoAsana);
var GitHubIcon__default = /*#__PURE__*/_interopDefaultLegacy(GitHubIcon);
var GoogleIcon__default = /*#__PURE__*/_interopDefaultLegacy(GoogleIcon);
var Popper__default = /*#__PURE__*/_interopDefaultLegacy(Popper);
var Grow__default = /*#__PURE__*/_interopDefaultLegacy(Grow);
var Container__default = /*#__PURE__*/_interopDefaultLegacy(Container);
var bgImage__default = /*#__PURE__*/_interopDefaultLegacy(bgImage);
var brandWhite__default = /*#__PURE__*/_interopDefaultLegacy(brandWhite);
var brandDark__default = /*#__PURE__*/_interopDefaultLegacy(brandDark);

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
var MDBoxRoot = styles.styled(Box__default["default"])(({ theme, ownerState }) => {
    const { palette, functions, borders, boxShadows } = theme;
    const { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow } = ownerState;
    const { gradients, grey, white } = palette;
    const { linearGradient } = functions;
    const { borderRadius: radius } = borders;
    const { colored } = boxShadows;
    const greyColors = {
        "grey-100": grey[100],
        "grey-200": grey[200],
        "grey-300": grey[300],
        "grey-400": grey[400],
        "grey-500": grey[500],
        "grey-600": grey[600],
        "grey-700": grey[700],
        "grey-800": grey[800],
        "grey-900": grey[900],
    };
    const validGradients = [
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
    ];
    const validColors = [
        "transparent",
        "white",
        "black",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "light",
        "dark",
        "text",
        "grey-100",
        "grey-200",
        "grey-300",
        "grey-400",
        "grey-500",
        "grey-600",
        "grey-700",
        "grey-800",
        "grey-900",
    ];
    const validBorderRadius = ["xs", "sm", "md", "lg", "xl", "xxl", "section"];
    const validBoxShadows = ["xs", "sm", "md", "lg", "xl", "xxl", "inset"];
    // background value
    let backgroundValue = bgColor;
    if (variant === "gradient") {
        backgroundValue = validGradients.find((el) => el === bgColor)
            ? linearGradient(gradients[bgColor].main, gradients[bgColor].state)
            : white.main;
    }
    else if (validColors.find((el) => el === bgColor)) {
        backgroundValue = palette[bgColor] ? palette[bgColor].main : greyColors[bgColor];
    }
    else {
        backgroundValue = bgColor;
    }
    // color value
    let colorValue = color;
    if (validColors.find((el) => el === color)) {
        colorValue = palette[color] ? palette[color].main : greyColors[color];
    }
    // borderRadius value
    let borderRadiusValue = borderRadius;
    if (validBorderRadius.find((el) => el === borderRadius)) {
        borderRadiusValue = radius[borderRadius];
    }
    // boxShadow value
    let boxShadowValue = "none";
    if (validBoxShadows.find((el) => el === shadow)) {
        boxShadowValue = boxShadows[shadow];
    }
    else if (coloredShadow) {
        boxShadowValue = colored[coloredShadow] ? colored[coloredShadow] : "none";
    }
    return {
        opacity,
        background: backgroundValue,
        color: colorValue,
        borderRadius: borderRadiusValue,
        boxShadow: boxShadowValue,
    };
});

const MDBox = react.forwardRef(({ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow, ...rest }, ref) => (jsxRuntime.jsx(MDBoxRoot, { ...rest, ref: ref, ownerState: { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow } })));
// Declaring default props for MDBox
MDBox.defaultProps = {
    variant: "contained",
    bgColor: "transparent",
    color: "dark",
    opacity: 1,
    borderRadius: "none",
    shadow: "none",
    coloredShadow: "none",
};

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
var MDTypographyRoot = styles.styled(Typography__default["default"])(({ theme, ownerState }) => {
    const { palette, typography, functions } = theme;
    const { color, textTransform, verticalAlign, fontWeight, opacity, textGradient, darkMode } = ownerState;
    const { gradients, transparent, white } = palette;
    const { fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold } = typography;
    const { linearGradient } = functions;
    // fontWeight styles
    const fontWeights = {
        light: fontWeightLight,
        regular: fontWeightRegular,
        medium: fontWeightMedium,
        bold: fontWeightBold,
    };
    // styles for the typography with textGradient={true}
    const gradientStyles = () => ({
        backgroundImage: color !== "inherit" && color !== "text" && color !== "white" && gradients[color]
            ? linearGradient(gradients[color].main, gradients[color].state)
            : linearGradient(gradients.dark.main, gradients.dark.state),
        display: "inline-block",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: transparent.main,
        position: "relative",
        zIndex: 1,
    });
    // color value
    let colorValue = color === "inherit" || !palette[color] ? "inherit" : palette[color].main;
    if (darkMode && (color === "inherit" || !palette[color])) {
        colorValue = "inherit";
    }
    else if (darkMode && color === "dark")
        colorValue = white.main;
    return {
        opacity,
        textTransform,
        verticalAlign,
        textDecoration: "none",
        color: colorValue,
        fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
        ...(textGradient && gradientStyles()),
    };
});

// The Material Dashboard 2 PRO React TSUI Dashboard PRO Material main context
const MaterialUI = react.createContext(null);
// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";
// Material Dashboard 2 PRO React reducer
function reducer(state, action) {
    switch (action.type) {
        case "MINI_SIDENAV": {
            return { ...state, miniSidenav: action.value };
        }
        case "TRANSPARENT_SIDENAV": {
            return { ...state, transparentSidenav: action.value };
        }
        case "WHITE_SIDENAV": {
            return { ...state, whiteSidenav: action.value };
        }
        case "SIDENAV_COLOR": {
            return { ...state, sidenavColor: action.value };
        }
        case "TRANSPARENT_NAVBAR": {
            return { ...state, transparentNavbar: action.value };
        }
        case "FIXED_NAVBAR": {
            return { ...state, fixedNavbar: action.value };
        }
        case "OPEN_CONFIGURATOR": {
            return { ...state, openConfigurator: action.value };
        }
        case "DIRECTION": {
            return { ...state, direction: action.value };
        }
        case "LAYOUT": {
            return { ...state, layout: action.value };
        }
        case "DARKMODE": {
            return { ...state, darkMode: action.value };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}
// Material Dashboard 2 PRO React context provider
function MaterialUIControllerProvider({ children }) {
    const initialState = {
        miniSidenav: false,
        transparentSidenav: false,
        whiteSidenav: false,
        sidenavColor: "info",
        transparentNavbar: true,
        fixedNavbar: true,
        openConfigurator: false,
        direction: "ltr",
        layout: "dashboard",
        darkMode: false,
    };
    const [controller, dispatch] = react.useReducer(reducer, initialState);
    const value = react.useMemo(() => [controller, dispatch], [controller, dispatch]);
    return jsxRuntime.jsx(MaterialUI.Provider, { value: value, children: children });
}
// Material Dashboard 2 PRO React custom hook for using context
function useMaterialUIController() {
    const context = react.useContext(MaterialUI);
    if (!context) {
        throw new Error("useMaterialUIController should be used inside the MaterialUIControllerProvider.");
    }
    return context;
}
// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

const MDTypography = react.forwardRef(({ color, fontWeight, textTransform, verticalAlign, textGradient, opacity, children, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    return (jsxRuntime.jsx(MDTypographyRoot, { ...rest, ref: ref, ownerState: {
            color,
            textTransform,
            verticalAlign,
            fontWeight,
            opacity,
            textGradient,
            darkMode,
        }, children: children }));
});
// Declaring default props for MDTypography
MDTypography.defaultProps = {
    color: "dark",
    fontWeight: undefined,
    textTransform: "none",
    verticalAlign: "unset",
    textGradient: false,
    opacity: 1,
};

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
function collapseItem(theme, ownerState) {
    const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
    const { active, transparentSidenav, whiteSidenav, darkMode } = ownerState;
    const { white, transparent, dark, grey } = palette;
    const { md } = boxShadows;
    const { borderRadius } = borders;
    const { pxToRem, rgba } = functions;
    return {
        background: () => {
            let backgroundValue;
            if (transparentSidenav && darkMode) {
                backgroundValue = active ? rgba(white.main, 0.2) : transparent.main;
            }
            else if (transparentSidenav && !darkMode) {
                backgroundValue = active ? grey[300] : transparent.main;
            }
            else if (whiteSidenav) {
                backgroundValue = active ? grey[200] : transparent.main;
            }
            else {
                backgroundValue = active ? rgba(white.main, 0.2) : transparent.main;
            }
            return backgroundValue;
        },
        color: (transparentSidenav && !darkMode) || whiteSidenav ? dark.main : white.main,
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: `${pxToRem(8)} ${pxToRem(16)}`,
        margin: `${pxToRem(1.5)} ${pxToRem(16)}`,
        borderRadius: borderRadius.md,
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        boxShadow: active && !whiteSidenav && !darkMode && !transparentSidenav ? md : "none",
        [breakpoints.up("xl")]: {
            transition: transitions.create(["box-shadow", "background-color"], {
                easing: transitions.easing.easeInOut,
                duration: transitions.duration.shorter,
            }),
        },
        "&:hover, &:focus": {
            backgroundColor: transparentSidenav && !darkMode
                ? grey[300]
                : rgba(whiteSidenav ? grey[400] : white.main, 0.2),
        },
    };
}
function collapseIconBox(theme, ownerState) {
    const { palette, transitions, borders, functions } = theme;
    const { transparentSidenav, whiteSidenav, darkMode } = ownerState;
    const { white, dark } = palette;
    const { borderRadius } = borders;
    const { pxToRem } = functions;
    return {
        minWidth: pxToRem(32),
        minHeight: pxToRem(32),
        color: (transparentSidenav && !darkMode) || whiteSidenav ? dark.main : white.main,
        borderRadius: borderRadius.md,
        display: "grid",
        placeItems: "center",
        transition: transitions.create("margin", {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
        }),
        "& svg, svg g": {
            color: transparentSidenav || whiteSidenav ? dark.main : white.main,
        },
    };
}
const collapseIcon = ({ palette: { white, gradients } }, { active }) => ({
    color: active ? white.main : gradients.dark.state,
});
function collapseText(theme, ownerState) {
    const { typography, transitions, breakpoints, functions } = theme;
    const { miniSidenav, transparentSidenav, active } = ownerState;
    const { size, fontWeightRegular, fontWeightLight } = typography;
    const { pxToRem } = functions;
    return {
        marginLeft: pxToRem(10),
        [breakpoints.up("xl")]: {
            opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
            maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
            marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
            transition: transitions.create(["opacity", "margin"], {
                easing: transitions.easing.easeInOut,
                duration: transitions.duration.standard,
            }),
        },
        "& span": {
            fontWeight: active ? fontWeightRegular : fontWeightLight,
            fontSize: size.sm,
            lineHeight: 0,
        },
    };
}
function collapseArrow(theme, ownerState) {
    const { palette, typography, transitions, breakpoints, functions } = theme;
    const { noCollapse, transparentSidenav, whiteSidenav, miniSidenav, open, active, darkMode } = ownerState;
    const { white, dark } = palette;
    const { size } = typography;
    const { pxToRem, rgba } = functions;
    return {
        fontSize: `${size.lg} !important`,
        fontWeight: 700,
        marginBottom: pxToRem(-1),
        transform: open ? "rotate(0)" : "rotate(-180deg)",
        color: () => {
            let colorValue;
            if (transparentSidenav && darkMode) {
                colorValue = open || active ? white.main : rgba(white.main, 0.25);
            }
            else if (transparentSidenav || whiteSidenav) {
                colorValue = open || active ? dark.main : rgba(dark.main, 0.25);
            }
            else {
                colorValue = open || active ? white.main : rgba(white.main, 0.5);
            }
            return colorValue;
        },
        transition: transitions.create(["color", "transform", "opacity"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.shorter,
        }),
        [breakpoints.up("xl")]: {
            display: noCollapse || (transparentSidenav && miniSidenav) || miniSidenav
                ? "none !important"
                : "block !important",
        },
    };
}

function SidenavCollapse({ icon, name, children, active, noCollapse, open, ...rest }) {
    const [controller] = useMaterialUIController();
    const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(ListItem__default["default"], { component: "li", children: jsxRuntime.jsxs(MDBox, { ...rest, sx: (theme) => collapseItem(theme, { active, transparentSidenav, whiteSidenav, darkMode }), children: [jsxRuntime.jsx(ListItemIcon__default["default"], { sx: (theme) => collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode }), children: typeof icon === "string" ? (jsxRuntime.jsx(Icon__default["default"], { sx: (theme) => collapseIcon(theme, { active }), children: icon })) : (icon) }), jsxRuntime.jsx(ListItemText__default["default"], { primary: name, sx: (theme) => collapseText(theme, {
                                miniSidenav,
                                transparentSidenav,
                                whiteSidenav,
                                active,
                            }) }), jsxRuntime.jsx(Icon__default["default"], { sx: (theme) => collapseArrow(theme, {
                                noCollapse,
                                transparentSidenav,
                                whiteSidenav,
                                miniSidenav,
                                open,
                                active,
                                darkMode,
                            }), children: "expand_less" })] }) }), children && (jsxRuntime.jsx(Collapse__default["default"], { in: Boolean(open), unmountOnExit: true, children: children }))] }));
}
// Declaring default props for SidenavCollapse
SidenavCollapse.defaultProps = {
    active: false,
    noCollapse: false,
    children: false,
    open: false,
};

function SidenavList({ children }) {
    return (jsxRuntime.jsx(List__default["default"], { sx: {
            px: 2,
            my: 0.3,
        }, children: children }));
}

/* eslint-disable prefer-destructuring */
function item(theme, ownerState) {
    const { palette, borders, functions, transitions } = theme;
    const { active, color, transparentSidenav, whiteSidenav, darkMode } = ownerState;
    const { transparent, white, grey } = palette;
    const { borderRadius } = borders;
    const { rgba } = functions;
    return {
        pl: 3,
        mt: 0.375,
        mb: 0.3,
        width: "100%",
        borderRadius: borderRadius.md,
        cursor: "pointer",
        backgroundColor: () => {
            let backgroundValue = transparent.main;
            if ((active === "isParent" && !transparentSidenav && !whiteSidenav) ||
                (active === "isParent" && transparentSidenav && darkMode)) {
                backgroundValue = rgba(white.main, 0.2);
            }
            else if (active === "isParent" && transparentSidenav) {
                backgroundValue = grey[300];
            }
            else if (active === "isParent" && whiteSidenav) {
                backgroundValue = grey[200];
            }
            else if (active) {
                backgroundValue = palette[color].main;
            }
            return backgroundValue;
        },
        transition: transitions.create("background-color", {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.shorter,
        }),
        "&:hover, &:focus": {
            backgroundColor: !active &&
                rgba((transparentSidenav && !darkMode) || whiteSidenav ? grey[400] : white.main, 0.2),
        },
    };
}
function itemContent(theme, ownerState) {
    const { palette, typography, transitions, functions } = theme;
    const { miniSidenav, name, active, transparentSidenav, whiteSidenav, darkMode } = ownerState;
    const { white, dark } = palette;
    const { size, fontWeightRegular, fontWeightLight } = typography;
    const { pxToRem } = functions;
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: `${pxToRem(12)} ${pxToRem(16)}`,
        marginLeft: pxToRem(18),
        userSelect: "none",
        position: "relative",
        "& span": {
            color: ((transparentSidenav && !darkMode) || whiteSidenav) && (active === "isParent" || !active)
                ? dark.main
                : white.main,
            fontWeight: active ? fontWeightRegular : fontWeightLight,
            fontSize: size.sm,
            opacity: miniSidenav ? 0 : 1,
            transition: transitions.create(["opacity", "color"], {
                easing: transitions.easing.easeInOut,
                duration: transitions.duration.standard,
            }),
        },
        "&::before": {
            content: `"${name[0]}"`,
            color: ((transparentSidenav && !darkMode) || whiteSidenav) && (active === "isParent" || !active)
                ? dark.main
                : white.main,
            fontWeight: fontWeightRegular,
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: pxToRem(-15),
            opacity: 1,
            borderRadius: "50%",
            fontSize: size.sm,
        },
    };
}
function itemArrow(theme, ownerState) {
    const { palette, typography, transitions, breakpoints, functions } = theme;
    const { noCollapse, transparentSidenav, whiteSidenav, miniSidenav, open, active, darkMode } = ownerState;
    const { white, dark } = palette;
    const { size } = typography;
    const { pxToRem, rgba } = functions;
    return {
        fontSize: `${size.lg} !important`,
        fontWeight: 700,
        marginBottom: pxToRem(-1),
        transform: open ? "rotate(0)" : "rotate(-180deg)",
        color: () => {
            let colorValue;
            if (transparentSidenav && darkMode) {
                colorValue = open || active ? white.main : rgba(white.main, 0.25);
            }
            else if (transparentSidenav || whiteSidenav) {
                colorValue = open || active ? dark.main : rgba(dark.main, 0.25);
            }
            else {
                colorValue = open || active ? white.main : rgba(white.main, 0.5);
            }
            return colorValue;
        },
        transition: transitions.create(["color", "transform", "opacity"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.shorter,
        }),
        [breakpoints.up("xl")]: {
            display: noCollapse || (transparentSidenav && miniSidenav) || miniSidenav
                ? "none !important"
                : "block !important",
        },
    };
}

function SidenavItem({ color, name, active, nested, children, open, ...rest }) {
    const [controller] = useMaterialUIController();
    const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(ListItem__default["default"], { ...rest, component: "li", sx: (theme) => item(theme, { active, color, transparentSidenav, whiteSidenav, darkMode }), children: jsxRuntime.jsxs(MDBox, { sx: (theme) => itemContent(theme, {
                        active,
                        miniSidenav,
                        name,
                        open,
                        nested,
                        transparentSidenav,
                        whiteSidenav,
                        darkMode,
                    }), children: [jsxRuntime.jsx(ListItemText__default["default"], { primary: name }), children && (jsxRuntime.jsx(Icon__default["default"], { component: "i", sx: (theme) => itemArrow(theme, { open, miniSidenav, transparentSidenav, whiteSidenav, darkMode }), children: "expand_less" }))] }) }), children && (jsxRuntime.jsx(Collapse__default["default"], { in: open, timeout: "auto", unmountOnExit: true, ...rest, children: children }))] }));
}
// Declaring default props for SidenavItem
SidenavItem.defaultProps = {
    color: "info",
    active: false,
    nested: false,
    children: false,
    open: false,
};

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
var SidenavRoot = styles.styled(Drawer__default["default"])(({ theme, ownerState }) => {
    const { palette, boxShadows, transitions, breakpoints, functions } = theme;
    const { transparentSidenav, whiteSidenav, miniSidenav, darkMode } = ownerState;
    const sidebarWidth = 250;
    const { transparent, gradients, white, background } = palette;
    const { xxl } = boxShadows;
    const { pxToRem, linearGradient } = functions;
    let backgroundValue = darkMode
        ? background.sidenav
        : linearGradient(gradients.dark.main, gradients.dark.state);
    if (transparentSidenav) {
        backgroundValue = transparent.main;
    }
    else if (whiteSidenav) {
        backgroundValue = white.main;
    }
    // styles for the sidenav when miniSidenav={false}
    const drawerOpenStyles = () => ({
        background: backgroundValue,
        transform: "translateX(0)",
        transition: transitions.create("transform", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter,
        }),
        [breakpoints.up("xl")]: {
            boxShadow: transparentSidenav ? "none" : xxl,
            marginBottom: transparentSidenav ? 0 : "inherit",
            left: "0",
            width: sidebarWidth,
            transform: "translateX(0)",
            transition: transitions.create(["width", "background-color"], {
                easing: transitions.easing.sharp,
                duration: transitions.duration.enteringScreen,
            }),
        },
    });
    // styles for the sidenav when miniSidenav={true}
    const drawerCloseStyles = () => ({
        background: backgroundValue,
        transform: `translateX(${pxToRem(-320)})`,
        transition: transitions.create("transform", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter,
        }),
        [breakpoints.up("xl")]: {
            boxShadow: transparentSidenav ? "none" : xxl,
            marginBottom: transparentSidenav ? 0 : "inherit",
            left: "0",
            width: pxToRem(96),
            overflowX: "hidden",
            transform: "translateX(0)",
            transition: transitions.create(["width", "background-color"], {
                easing: transitions.easing.sharp,
                duration: transitions.duration.shorter,
            }),
        },
    });
    return {
        "& .MuiDrawer-paper": {
            boxShadow: xxl,
            border: "none",
            ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
        },
    };
});

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
function sidenavLogoLabel(theme, ownerState) {
    const { functions, transitions, typography, breakpoints } = theme;
    const { miniSidenav } = ownerState;
    const { pxToRem } = functions;
    const { fontWeightMedium } = typography;
    return {
        ml: 0.5,
        fontWeight: fontWeightMedium,
        wordSpacing: pxToRem(-1),
        transition: transitions.create("opacity", {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
        }),
        [breakpoints.up("xl")]: {
            opacity: miniSidenav ? 0 : 1,
        },
    };
}

function Sidenav$1({ color, brand, brandName, routes, ...rest }) {
    const [openCollapse, setOpenCollapse] = react.useState(false);
    const [openNestedCollapse, setOpenNestedCollapse] = react.useState(false);
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
    const location = reactRouterDom.useLocation();
    const { pathname } = location;
    const collapseName = pathname.split("/").slice(1)[0];
    const items = pathname.split("/").slice(1);
    const itemParentName = items[1];
    const itemName = items[items.length - 1];
    let textColor = "white";
    if (transparentSidenav || (whiteSidenav && !darkMode)) {
        textColor = "dark";
    }
    else if (whiteSidenav && darkMode) {
        textColor = "inherit";
    }
    const closeSidenav = () => setMiniSidenav(dispatch, true);
    react.useEffect(() => {
        setOpenCollapse(collapseName);
        setOpenNestedCollapse(itemParentName);
    }, []);
    react.useEffect(() => {
        // A function that sets the mini state of the sidenav.
        function handleMiniSidenav() {
            setMiniSidenav(dispatch, window.innerWidth < 1200);
            setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
            setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
        }
        /**
         The event listener that's calling the handleMiniSidenav function when resizing the window.
        */
        window.addEventListener("resize", handleMiniSidenav);
        // Call the handleMiniSidenav function to set the state with the initial value.
        handleMiniSidenav();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleMiniSidenav);
    }, [dispatch, location]);
    // Render all the nested collapse items from the routes.js
    const renderNestedCollapse = (collapse) => {
        const template = collapse.map(({ name, route, key, href }) => href ? (jsxRuntime.jsx(Link__default["default"], { href: href, target: "_blank", rel: "noreferrer", sx: { textDecoration: "none" }, children: jsxRuntime.jsx(SidenavItem, { name: name, nested: true }) }, key)) : (jsxRuntime.jsx(reactRouterDom.NavLink, { to: route, style: { textDecoration: "none" }, children: jsxRuntime.jsx(SidenavItem, { name: name, active: route === pathname, nested: true }) }, key)));
        return template;
    };
    // Render the all the collpases from the routes.js
    const renderCollapse = (collapses) => collapses.map(({ name, collapse, route, href, key }) => {
        let returnValue;
        if (collapse) {
            returnValue = (jsxRuntime.jsx(SidenavItem, { color: color, name: name, active: key === itemParentName ? "isParent" : false, open: openNestedCollapse === key, onClick: ({ currentTarget }) => openNestedCollapse === key && currentTarget.classList.contains("MuiListItem-root")
                    ? setOpenNestedCollapse(false)
                    : setOpenNestedCollapse(key), children: renderNestedCollapse(collapse) }, key));
        }
        else {
            returnValue = href ? (jsxRuntime.jsx(Link__default["default"], { href: href, target: "_blank", rel: "noreferrer", sx: { textDecoration: "none" }, children: jsxRuntime.jsx(SidenavItem, { color: color, name: name, active: key === itemName }) }, key)) : (jsxRuntime.jsx(reactRouterDom.NavLink, { to: route, style: { textDecoration: "none" }, children: jsxRuntime.jsx(SidenavItem, { color: color, name: name, active: key === itemName }) }, key));
        }
        return jsxRuntime.jsx(SidenavList, { children: returnValue }, key);
    });
    // Render all the routes from the routes.js (All the visible items on the Sidenav)
    const renderRoutes = routes.map(({ type, name, icon, title, collapse, noCollapse, key, href, route }) => {
        let returnValue;
        if (type === "collapse") {
            if (href) {
                returnValue = (jsxRuntime.jsx(Link__default["default"], { href: href, target: "_blank", rel: "noreferrer", sx: { textDecoration: "none" }, children: jsxRuntime.jsx(SidenavCollapse, { name: name, icon: icon, active: key === collapseName, noCollapse: noCollapse }) }, key));
            }
            else if (noCollapse && route) {
                returnValue = (jsxRuntime.jsx(reactRouterDom.NavLink, { to: route, children: jsxRuntime.jsx(SidenavCollapse, { name: name, icon: icon, noCollapse: noCollapse, active: key === collapseName, children: collapse ? renderCollapse(collapse) : null }) }, key));
            }
            else {
                returnValue = (jsxRuntime.jsx(SidenavCollapse, { name: name, icon: icon, active: key === collapseName, open: openCollapse === key, onClick: () => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key)), children: collapse ? renderCollapse(collapse) : null }, key));
            }
        }
        else if (type === "title") {
            returnValue = (jsxRuntime.jsx(MDTypography, { color: textColor, display: "block", variant: "caption", fontWeight: "bold", textTransform: "uppercase", pl: 3, mt: 2, mb: 1, ml: 1, children: title }, key));
        }
        else if (type === "divider") {
            returnValue = (jsxRuntime.jsx(Divider__default["default"], { light: (!darkMode && !whiteSidenav && !transparentSidenav) ||
                    (darkMode && !transparentSidenav && whiteSidenav) }, key));
        }
        return returnValue;
    });
    return (jsxRuntime.jsxs(SidenavRoot, { ...rest, variant: "permanent", ownerState: { transparentSidenav, whiteSidenav, miniSidenav, darkMode }, children: [jsxRuntime.jsxs(MDBox, { pt: 3, pb: 1, px: 4, textAlign: "center", children: [jsxRuntime.jsx(MDBox, { display: { xs: "block", xl: "none" }, position: "absolute", top: 0, right: 0, p: 1.625, onClick: closeSidenav, sx: { cursor: "pointer" }, children: jsxRuntime.jsx(MDTypography, { variant: "h6", color: "secondary", children: jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "bold" }, children: "close" }) }) }), jsxRuntime.jsxs(MDBox, { component: reactRouterDom.NavLink, to: "/", display: "flex", alignItems: "center", children: [brand && jsxRuntime.jsx(MDBox, { component: "img", src: brand, alt: "Brand", width: "2rem" }), jsxRuntime.jsx(MDBox, { width: !brandName && "100%", sx: (theme) => sidenavLogoLabel(theme, { miniSidenav }), children: jsxRuntime.jsx(MDTypography, { component: "h6", variant: "button", fontWeight: "medium", color: textColor, children: brandName }) })] })] }), jsxRuntime.jsx(Divider__default["default"], { light: (!darkMode && !whiteSidenav && !transparentSidenav) ||
                    (darkMode && !transparentSidenav && whiteSidenav) }), jsxRuntime.jsx(List__default["default"], { children: renderRoutes })] }));
}
// Declaring default props for Sidenav
Sidenav$1.defaultProps = {
    color: "info",
    brand: "",
};

/* eslint-disable prefer-destructuring */
var MDButtonRoot = styles.styled(Button__default["default"])(({ theme, ownerState }) => {
    const { palette, functions, borders, boxShadows } = theme;
    const { color, variant, size, circular, iconOnly, darkMode } = ownerState;
    const { white, text, transparent, gradients, grey } = palette;
    const { boxShadow, linearGradient, pxToRem, rgba } = functions;
    const { borderRadius } = borders;
    const { colored } = boxShadows;
    // styles for the button with variant="contained"
    const containedStyles = () => {
        // background color value
        const backgroundValue = palette[color] ? palette[color].main : white.main;
        // backgroundColor value when button is focused
        const focusedBackgroundValue = palette[color] ? palette[color].focus : white.focus;
        // boxShadow value
        const boxShadowValue = colored[color]
            ? `${boxShadow([0, 3], [3, 0], palette[color].main, 0.15)}, ${boxShadow([0, 3], [1, -2], palette[color].main, 0.2)}, ${boxShadow([0, 1], [5, 0], palette[color].main, 0.15)}`
            : "none";
        // boxShadow value when button is hovered
        const hoveredBoxShadowValue = colored[color]
            ? `${boxShadow([0, 14], [26, -12], palette[color].main, 0.4)}, ${boxShadow([0, 4], [23, 0], palette[color].main, 0.15)}, ${boxShadow([0, 8], [10, -5], palette[color].main, 0.2)}`
            : "none";
        // color value
        let colorValue = white.main;
        if (!darkMode && (color === "white" || color === "light" || !palette[color])) {
            colorValue = text.main;
        }
        else if (darkMode && (color === "white" || color === "light" || !palette[color])) {
            colorValue = grey[600];
        }
        // color value when button is focused
        let focusedColorValue = white.main;
        if (color === "white") {
            focusedColorValue = text.main;
        }
        else if (color === "primary" || color === "error" || color === "dark") {
            focusedColorValue = white.main;
        }
        return {
            background: backgroundValue,
            color: colorValue,
            boxShadow: boxShadowValue,
            "&:hover": {
                backgroundColor: backgroundValue,
                color: colorValue,
                boxShadow: hoveredBoxShadowValue,
            },
            "&:focus:not(:hover)": {
                backgroundColor: focusedBackgroundValue,
                color: colorValue,
                boxShadow: palette[color]
                    ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
                    : boxShadow([0, 0], [0, 3.2], white.main, 0.5),
            },
            "&:disabled": {
                backgroundColor: backgroundValue,
                color: focusedColorValue,
            },
        };
    };
    // styles for the button with variant="outlined"
    const outlinedStyles = () => {
        // background color value
        const backgroundValue = color === "white" ? rgba(white.main, 0.1) : transparent.main;
        // color value
        const colorValue = palette[color] ? palette[color].main : white.main;
        // boxShadow value
        const boxShadowValue = palette[color]
            ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
            : boxShadow([0, 0], [0, 3.2], white.main, 0.5);
        // border color value
        let borderColorValue = palette[color] ? palette[color].main : rgba(white.main, 0.75);
        if (color === "white") {
            borderColorValue = rgba(white.main, 0.75);
        }
        return {
            background: backgroundValue,
            color: colorValue,
            border: `${pxToRem(1)} solid ${borderColorValue}`,
            "&:hover": {
                background: transparent.main,
                color: colorValue,
                borderColor: colorValue,
                opacity: 0.85,
            },
            "&:focus:not(:hover)": {
                background: transparent.main,
                color: colorValue,
                boxShadow: boxShadowValue,
            },
            "&:active:not(:hover)": {
                backgroundColor: colorValue,
                color: white.main,
                opacity: 0.85,
            },
            "&:disabled": {
                color: colorValue,
                borderColor: colorValue,
            },
        };
    };
    // styles for the button with variant="gradient"
    const gradientStyles = () => {
        // background value
        const backgroundValue = color === "white" || !gradients[color]
            ? white.main
            : linearGradient(gradients[color].main, gradients[color].state);
        // boxShadow value
        const boxShadowValue = colored[color]
            ? `${boxShadow([0, 3], [3, 0], palette[color].main, 0.15)}, ${boxShadow([0, 3], [1, -2], palette[color].main, 0.2)}, ${boxShadow([0, 1], [5, 0], palette[color].main, 0.15)}`
            : "none";
        // boxShadow value when button is hovered
        const hoveredBoxShadowValue = colored[color]
            ? `${boxShadow([0, 14], [26, -12], palette[color].main, 0.4)}, ${boxShadow([0, 4], [23, 0], palette[color].main, 0.15)}, ${boxShadow([0, 8], [10, -5], palette[color].main, 0.2)}`
            : "none";
        // color value
        let colorValue = white.main;
        if (color === "white") {
            colorValue = text.main;
        }
        else if (color === "light") {
            colorValue = gradients.dark.state;
        }
        return {
            background: backgroundValue,
            color: colorValue,
            boxShadow: boxShadowValue,
            "&:hover": {
                boxShadow: hoveredBoxShadowValue,
                color: colorValue,
            },
            "&:focus:not(:hover)": {
                boxShadow: boxShadowValue,
                color: colorValue,
            },
            "&:disabled": {
                background: backgroundValue,
                color: colorValue,
            },
        };
    };
    // styles for the button with variant="text"
    const textStyles = () => {
        // color value
        const colorValue = palette[color] ? palette[color].main : white.main;
        // color value when button is focused
        const focusedColorValue = palette[color] ? palette[color].focus : white.focus;
        return {
            color: colorValue,
            "&:hover": {
                color: focusedColorValue,
            },
            "&:focus:not(:hover)": {
                color: focusedColorValue,
            },
        };
    };
    // styles for the button with circular={true}
    const circularStyles = () => ({
        borderRadius: borderRadius.section,
    });
    // styles for the button with iconOnly={true}
    const iconOnlyStyles = () => {
        // width, height, minWidth and minHeight values
        let sizeValue = pxToRem(38);
        if (size === "small") {
            sizeValue = pxToRem(25.4);
        }
        else if (size === "large") {
            sizeValue = pxToRem(52);
        }
        // padding value
        let paddingValue = `${pxToRem(11)} ${pxToRem(11)} ${pxToRem(10)}`;
        if (size === "small") {
            paddingValue = pxToRem(4.5);
        }
        else if (size === "large") {
            paddingValue = pxToRem(16);
        }
        return {
            width: sizeValue,
            minWidth: sizeValue,
            height: sizeValue,
            minHeight: sizeValue,
            padding: paddingValue,
            "& .material-icons": {
                marginTop: 0,
            },
            "&:hover, &:focus, &:active": {
                transform: "none",
            },
        };
    };
    return {
        ...(variant === "contained" && containedStyles()),
        ...(variant === "outlined" && outlinedStyles()),
        ...(variant === "gradient" && gradientStyles()),
        ...(variant === "text" && textStyles()),
        ...(circular && circularStyles()),
        ...(iconOnly && iconOnlyStyles()),
    };
});

const MDButton = react.forwardRef(({ color, variant, size, circular, iconOnly, children, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    return (jsxRuntime.jsx(MDButtonRoot, { ...rest, ref: ref, ownerState: { color, variant, size, circular, iconOnly, darkMode }, children: children }));
});
// Declaring default props for MDButton
MDButton.defaultProps = {
    color: "white",
    variant: "contained",
    size: "medium",
    circular: false,
    iconOnly: false,
};

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
var ConfiguratorRoot = styles.styled(Drawer__default["default"])(({ theme, ownerState }) => {
    const { boxShadows, functions, transitions } = theme;
    const { openConfigurator } = ownerState;
    const configuratorWidth = 360;
    const { lg } = boxShadows;
    const { pxToRem } = functions;
    // drawer styles when openConfigurator={true}
    const drawerOpenStyles = () => ({
        width: configuratorWidth,
        left: "initial",
        right: 0,
        transition: transitions.create("right", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.short,
        }),
    });
    // drawer styles when openConfigurator={false}
    const drawerCloseStyles = () => ({
        left: "initial",
        right: pxToRem(-350),
        transition: transitions.create("all", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.short,
        }),
    });
    return {
        "& .MuiDrawer-paper": {
            height: "100vh",
            margin: 0,
            padding: `0 ${pxToRem(10)}`,
            borderRadius: 0,
            boxShadow: lg,
            overflowY: "auto",
            ...(openConfigurator ? drawerOpenStyles() : drawerCloseStyles()),
        },
    };
});

function Configurator() {
    const [controller, dispatch] = useMaterialUIController();
    const { openConfigurator, miniSidenav, fixedNavbar, sidenavColor, transparentSidenav, whiteSidenav, darkMode, } = controller;
    const [disabled, setDisabled] = react.useState(false);
    const sidenavColors = ["primary", "dark", "info", "success", "warning", "error"];
    // Use the useEffect hook to change the button state for the sidenav type based on window size.
    react.useEffect(() => {
        // A function that sets the disabled state of the buttons for the sidenav type.
        function handleDisabled() {
            return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
        }
        // The event listener that's calling the handleDisabled function when resizing the window.
        window.addEventListener("resize", handleDisabled);
        // Call the handleDisabled function to set the state with the initial value.
        handleDisabled();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleDisabled);
    }, []);
    const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);
    const handleTransparentSidenav = () => {
        setTransparentSidenav(dispatch, true);
        setWhiteSidenav(dispatch, false);
    };
    const handleWhiteSidenav = () => {
        setWhiteSidenav(dispatch, true);
        setTransparentSidenav(dispatch, false);
    };
    const handleDarkSidenav = () => {
        setWhiteSidenav(dispatch, false);
        setTransparentSidenav(dispatch, false);
    };
    const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
    const handleFixedNavbar = () => setFixedNavbar(dispatch, !fixedNavbar);
    const handleDarkMode = () => setDarkMode(dispatch, !darkMode);
    // sidenav type buttons styles
    const sidenavTypeButtonsStyles = ({ functions: { pxToRem }, palette: { white, dark, background }, borders: { borderWidth }, }) => ({
        height: pxToRem(39),
        background: darkMode ? background.sidenav : white.main,
        color: darkMode ? white.main : dark.main,
        border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
        "&:hover, &:focus, &:focus:not(:hover)": {
            background: darkMode ? background.sidenav : white.main,
            color: darkMode ? white.main : dark.main,
            border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
        },
    });
    // sidenav type active button styles
    const sidenavTypeActiveButtonStyles = ({ functions: { pxToRem, linearGradient }, palette: { white, gradients, background }, }) => ({
        height: pxToRem(39),
        background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
        color: darkMode ? background.sidenav : white.main,
        "&:hover, &:focus, &:focus:not(:hover)": {
            background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
            color: darkMode ? background.sidenav : white.main,
        },
    });
    return (jsxRuntime.jsxs(ConfiguratorRoot, { variant: "permanent", ownerState: { openConfigurator }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 4, pb: 0.5, px: 3, children: [jsxRuntime.jsxs(MDBox, { children: [jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Material UI Configurator" }), jsxRuntime.jsx(MDTypography, { variant: "body2", color: "text", children: "See our dashboard options." })] }), jsxRuntime.jsx(Icon__default["default"], { sx: ({ typography: { size }, palette: { dark, white } }) => ({
                            fontSize: `${size.lg} !important`,
                            color: darkMode ? white.main : dark.main,
                            stroke: "currentColor",
                            strokeWidth: "2px",
                            cursor: "pointer",
                            transform: "translateY(5px)",
                        }), onClick: handleCloseConfigurator, children: "close" })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { pt: 0.5, pb: 3, px: 3, children: [jsxRuntime.jsxs(MDBox, { children: [jsxRuntime.jsx(MDTypography, { variant: "h6", children: "Sidenav Colors" }), jsxRuntime.jsx(MDBox, { mb: 0.5, children: sidenavColors.map((color) => (jsxRuntime.jsx(IconButton__default["default"], { sx: ({ borders: { borderWidth }, palette: { white, dark, background }, transitions, }) => ({
                                        width: "24px",
                                        height: "24px",
                                        padding: 0,
                                        border: `${borderWidth[1]} solid ${darkMode ? background.sidenav : white.main}`,
                                        borderColor: () => {
                                            let borderColorValue = sidenavColor === color && dark.main;
                                            if (darkMode && sidenavColor === color) {
                                                borderColorValue = white.main;
                                            }
                                            return borderColorValue;
                                        },
                                        transition: transitions.create("border-color", {
                                            easing: transitions.easing.sharp,
                                            duration: transitions.duration.shorter,
                                        }),
                                        backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) => linearGradient(gradients[color].main, gradients[color].state),
                                        "&:not(:last-child)": {
                                            mr: 1,
                                        },
                                        "&:hover, &:focus, &:active": {
                                            borderColor: darkMode ? white.main : dark.main,
                                        },
                                    }), onClick: () => setSidenavColor(dispatch, color) }, color))) })] }), jsxRuntime.jsxs(MDBox, { mt: 3, lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", children: "Sidenav Type" }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Choose between different sidenav types." }), jsxRuntime.jsxs(MDBox, { sx: {
                                    display: "flex",
                                    mt: 2,
                                    mr: 1,
                                }, children: [jsxRuntime.jsx(MDButton, { color: "dark", variant: "gradient", onClick: handleDarkSidenav, disabled: disabled, fullWidth: true, sx: !transparentSidenav && !whiteSidenav
                                            ? sidenavTypeActiveButtonStyles
                                            : sidenavTypeButtonsStyles, children: "Dark" }), jsxRuntime.jsx(MDBox, { sx: { mx: 1, width: "8rem", minWidth: "8rem" }, children: jsxRuntime.jsx(MDButton, { color: "dark", variant: "gradient", onClick: handleTransparentSidenav, disabled: disabled, fullWidth: true, sx: transparentSidenav && !whiteSidenav
                                                ? sidenavTypeActiveButtonStyles
                                                : sidenavTypeButtonsStyles, children: "Transparent" }) }), jsxRuntime.jsx(MDButton, { color: "dark", variant: "gradient", onClick: handleWhiteSidenav, disabled: disabled, fullWidth: true, sx: whiteSidenav && !transparentSidenav
                                            ? sidenavTypeActiveButtonStyles
                                            : sidenavTypeButtonsStyles, children: "White" })] })] }), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", children: "Navbar Fixed" }), jsxRuntime.jsx(Switch__default["default"], { checked: fixedNavbar, onChange: handleFixedNavbar })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", children: "Sidenav Mini" }), jsxRuntime.jsx(Switch__default["default"], { checked: miniSidenav, onChange: handleMiniSidenav })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", children: "Light / Dark" }), jsxRuntime.jsx(Switch__default["default"], { checked: darkMode, onChange: handleDarkMode })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { mt: 3, mb: 2, children: [jsxRuntime.jsx(MDBox, { mb: 2, children: jsxRuntime.jsx(MDButton, { component: Link__default["default"], href: "https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts", target: "_blank", rel: "noreferrer", color: "info", variant: "gradient", fullWidth: true, children: "buy now" }) }), jsxRuntime.jsx(MDBox, { mb: 2, children: jsxRuntime.jsx(MDButton, { component: Link__default["default"], href: "https://www.creative-tim.com/product/material-dashboard-pro-react", target: "_blank", rel: "noreferrer", color: "dark", variant: "gradient", fullWidth: true, children: "buy javascript version" }) }), jsxRuntime.jsx(MDButton, { component: Link__default["default"], href: "https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/", target: "_blank", rel: "noreferrer", color: darkMode ? "light" : "dark", variant: "outlined", fullWidth: true, children: "view documentation" })] }), jsxRuntime.jsx(MDBox, { display: "flex", justifyContent: "center", children: jsxRuntime.jsx(GitHubButton__default["default"], { href: "https://github.com/creativetimofficial/ct-material-dashboard-pro-react", "data-icon": "octicon-star", "data-size": "large", "data-show-count": "true", "aria-label": "Star creativetimofficial/ct-material-dashboard-pro-react on GitHub", children: "Star" }) }), jsxRuntime.jsxs(MDBox, { mt: 2, textAlign: "center", children: [jsxRuntime.jsx(MDBox, { mb: 0.5, children: jsxRuntime.jsx(MDTypography, { variant: "h6", children: "Thank you for sharing!" }) }), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "center", children: [jsxRuntime.jsx(MDBox, { mr: 1.5, children: jsxRuntime.jsxs(MDButton, { component: Link__default["default"], href: "//twitter.com/intent/tweet?text=Check%20Material%20Dashboard%202%20PRO%20React%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23react%20%mui&url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fmaterial-dashboard-2-pro-react-ts", target: "_blank", rel: "noreferrer", color: "dark", children: [jsxRuntime.jsx(TwitterIcon__default["default"], {}), "\u00A0 Tweet"] }) }), jsxRuntime.jsxs(MDButton, { component: Link__default["default"], href: "https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts", target: "_blank", rel: "noreferrer", color: "dark", children: [jsxRuntime.jsx(FacebookIcon__default["default"], {}), "\u00A0 Share"] })] })] })] })] }));
}

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
const colors$1 = {
    background: {
        default: "#f0f2f5",
    },
    text: {
        main: "#7b809a",
        focus: "#7b809a",
    },
    transparent: {
        main: "transparent",
    },
    white: {
        main: "#ffffff",
        focus: "#ffffff",
    },
    black: {
        light: "#000000",
        main: "#000000",
        focus: "#000000",
    },
    primary: {
        main: "#e91e63",
        focus: "#e91e63",
    },
    secondary: {
        main: "#7b809a",
        focus: "#8f93a9",
    },
    info: {
        main: "#1A73E8",
        focus: "#1662C4",
    },
    success: {
        main: "#4CAF50",
        focus: "#67bb6a",
    },
    warning: {
        main: "#fb8c00",
        focus: "#fc9d26",
    },
    error: {
        main: "#F44335",
        focus: "#f65f53",
    },
    light: {
        main: "#f0f2f5",
        focus: "#f0f2f5",
    },
    dark: {
        main: "#344767",
        focus: "#2c3c58",
    },
    grey: {
        100: "#f8f9fa",
        200: "#f0f2f5",
        300: "#dee2e6",
        400: "#ced4da",
        500: "#adb5bd",
        600: "#6c757d",
        700: "#495057",
        800: "#343a40",
        900: "#212529",
    },
    gradients: {
        primary: {
            main: "#EC407A",
            state: "#D81B60",
        },
        secondary: {
            main: "#747b8a",
            state: "#495361",
        },
        info: {
            main: "#49a3f1",
            state: "#1A73E8",
        },
        success: {
            main: "#66BB6A",
            state: "#43A047",
        },
        warning: {
            main: "#FFA726",
            state: "#FB8C00",
        },
        error: {
            main: "#EF5350",
            state: "#E53935",
        },
        light: {
            main: "#EBEFF4",
            state: "#CED4DA",
        },
        dark: {
            main: "#42424a",
            state: "#191919",
        },
    },
    socialMediaColors: {
        facebook: {
            main: "#3b5998",
            dark: "#344e86",
        },
        twitter: {
            main: "#55acee",
            dark: "#3ea1ec",
        },
        instagram: {
            main: "#125688",
            dark: "#0e456d",
        },
        linkedin: {
            main: "#0077b5",
            dark: "#00669c",
        },
        pinterest: {
            main: "#cc2127",
            dark: "#b21d22",
        },
        youtube: {
            main: "#e52d27",
            dark: "#d41f1a",
        },
        vimeo: {
            main: "#1ab7ea",
            dark: "#13a3d2",
        },
        slack: {
            main: "#3aaf85",
            dark: "#329874",
        },
        dribbble: {
            main: "#ea4c89",
            dark: "#e73177",
        },
        github: {
            main: "#24292e",
            dark: "#171a1d",
        },
        reddit: {
            main: "#ff4500",
            dark: "#e03d00",
        },
        tumblr: {
            main: "#35465c",
            dark: "#2a3749",
        },
    },
    badgeColors: {
        primary: {
            background: "#f8b3ca",
            text: "#cc084b",
        },
        secondary: {
            background: "#d7d9e1",
            text: "#6c757d",
        },
        info: {
            background: "#aecef7",
            text: "#095bc6",
        },
        success: {
            background: "#bce2be",
            text: "#339537",
        },
        warning: {
            background: "#ffd59f",
            text: "#c87000",
        },
        error: {
            background: "#fcd3d0",
            text: "#f61200",
        },
        light: {
            background: "#ffffff",
            text: "#c7d3de",
        },
        dark: {
            background: "#8097bf",
            text: "#1e2e4a",
        },
    },
    coloredShadows: {
        primary: "#e91e62",
        secondary: "#110e0e",
        info: "#00bbd4",
        success: "#4caf4f",
        warning: "#ff9900",
        error: "#f44336",
        light: "#adb5bd",
        dark: "#404040",
    },
    inputBorderColor: "#d2d6da",
    tabs: {
        indicator: { boxShadow: "#ddd" },
    },
};

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
/**
 * The base breakpoints for the Material Dashboard 2 PRO React TSUI Dashboard PRO Material.
 * You can add new breakpoints using this file.
 * You can customized the breakpoints for the entire Material Dashboard 2 PRO React TSUI Dashboard PRO Material using thie file.
 */
const breakpoints$1 = {
    values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
    },
};

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
/**
  The pxToRem() function helps you to convert a px unit into a rem unit,
 */
function pxToRem$1(number, baseNumber = 16) {
    return `${number / baseNumber}rem`;
}

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
const { dark: dark$e } = colors$1;
const baseProperties$1 = {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLighter: 100,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSizeXXS: pxToRem$1(10.4),
    fontSizeXS: pxToRem$1(12),
    fontSizeSM: pxToRem$1(14),
    fontSizeMD: pxToRem$1(16),
    fontSizeLG: pxToRem$1(18),
    fontSizeXL: pxToRem$1(20),
    fontSize2XL: pxToRem$1(24),
    fontSize3XL: pxToRem$1(30),
};
const baseHeadingProperties$1 = {
    fontFamily: baseProperties$1.fontFamily,
    color: dark$e.main,
    fontWeight: baseProperties$1.fontWeightBold,
};
const baseDisplayProperties$1 = {
    fontFamily: baseProperties$1.fontFamily,
    color: dark$e.main,
    fontWeight: baseProperties$1.fontWeightLight,
    lineHeight: 1.2,
};
const typography$1 = {
    fontFamily: baseProperties$1.fontFamily,
    fontWeightLighter: baseProperties$1.fontWeightLighter,
    fontWeightLight: baseProperties$1.fontWeightLight,
    fontWeightRegular: baseProperties$1.fontWeightRegular,
    fontWeightMedium: baseProperties$1.fontWeightMedium,
    fontWeightBold: baseProperties$1.fontWeightBold,
    h1: {
        fontSize: pxToRem$1(48),
        lineHeight: 1.25,
        ...baseHeadingProperties$1,
    },
    h2: {
        fontSize: pxToRem$1(36),
        lineHeight: 1.3,
        ...baseHeadingProperties$1,
    },
    h3: {
        fontSize: pxToRem$1(30),
        lineHeight: 1.375,
        ...baseHeadingProperties$1,
    },
    h4: {
        fontSize: pxToRem$1(24),
        lineHeight: 1.375,
        ...baseHeadingProperties$1,
    },
    h5: {
        fontSize: pxToRem$1(20),
        lineHeight: 1.375,
        ...baseHeadingProperties$1,
    },
    h6: {
        fontSize: pxToRem$1(16),
        lineHeight: 1.625,
        ...baseHeadingProperties$1,
    },
    subtitle1: {
        fontFamily: baseProperties$1.fontFamily,
        fontSize: baseProperties$1.fontSizeXL,
        fontWeight: baseProperties$1.fontWeightLight,
        lineHeight: 1.625,
    },
    subtitle2: {
        fontFamily: baseProperties$1.fontFamily,
        fontSize: baseProperties$1.fontSizeMD,
        fontWeight: baseProperties$1.fontWeightLight,
        lineHeight: 1.6,
    },
    body1: {
        fontFamily: baseProperties$1.fontFamily,
        fontSize: baseProperties$1.fontSizeXL,
        fontWeight: baseProperties$1.fontWeightRegular,
        lineHeight: 1.625,
    },
    body2: {
        fontFamily: baseProperties$1.fontFamily,
        fontSize: baseProperties$1.fontSizeMD,
        fontWeight: baseProperties$1.fontWeightLight,
        lineHeight: 1.6,
    },
    button: {
        fontFamily: baseProperties$1.fontFamily,
        fontSize: baseProperties$1.fontSizeSM,
        fontWeight: baseProperties$1.fontWeightLight,
        lineHeight: 1.5,
        textTransform: "uppercase",
    },
    caption: {
        fontFamily: baseProperties$1.fontFamily,
        fontSize: baseProperties$1.fontSizeXS,
        fontWeight: baseProperties$1.fontWeightLight,
        lineHeight: 1.25,
    },
    overline: {
        fontFamily: baseProperties$1.fontFamily,
    },
    d1: {
        fontSize: pxToRem$1(80),
        ...baseDisplayProperties$1,
    },
    d2: {
        fontSize: pxToRem$1(72),
        ...baseDisplayProperties$1,
    },
    d3: {
        fontSize: pxToRem$1(64),
        ...baseDisplayProperties$1,
    },
    d4: {
        fontSize: pxToRem$1(56),
        ...baseDisplayProperties$1,
    },
    d5: {
        fontSize: pxToRem$1(48),
        ...baseDisplayProperties$1,
    },
    d6: {
        fontSize: pxToRem$1(40),
        ...baseDisplayProperties$1,
    },
    size: {
        xxs: baseProperties$1.fontSizeXXS,
        xs: baseProperties$1.fontSizeXS,
        sm: baseProperties$1.fontSizeSM,
        md: baseProperties$1.fontSizeMD,
        lg: baseProperties$1.fontSizeLG,
        xl: baseProperties$1.fontSizeXL,
        "2xl": baseProperties$1.fontSize2XL,
        "3xl": baseProperties$1.fontSize3XL,
    },
    lineHeight: {
        sm: 1.25,
        md: 1.5,
        lg: 2,
    },
};

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
function hexToRgb$1(color) {
    return chroma__default["default"](color).rgb().join(", ");
}

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
function rgba$1(color, opacity) {
    return `rgba(${hexToRgb$1(color)}, ${opacity})`;
}

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
function boxShadow$1(offset, radius, color, opacity, inset = "") {
    const [x, y] = offset;
    const [blur, spread] = radius;
    return `${inset} ${pxToRem$1(x)} ${pxToRem$1(y)} ${pxToRem$1(blur)} ${pxToRem$1(spread)} ${rgba$1(color, opacity)}`;
}

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
const { black: black$7, white: white$x, tabs: tabs$3, coloredShadows: coloredShadows$1 } = colors$1;
const boxShadows$1 = {
    xs: boxShadow$1([0, 2], [9, -5], black$7.main, 0.15),
    sm: boxShadow$1([0, 5], [10, 0], black$7.main, 0.12),
    md: `${boxShadow$1([0, 4], [6, -1], black$7.main, 0.1)}, ${boxShadow$1([0, 2], [4, -1], black$7.main, 0.06)}`,
    lg: `${boxShadow$1([0, 10], [15, -3], black$7.main, 0.1)}, ${boxShadow$1([0, 4], [6, -2], black$7.main, 0.05)}`,
    xl: `${boxShadow$1([0, 20], [25, -5], black$7.main, 0.1)}, ${boxShadow$1([0, 10], [10, -5], black$7.main, 0.04)}`,
    xxl: boxShadow$1([0, 20], [27, 0], black$7.main, 0.05),
    inset: boxShadow$1([0, 1], [2, 0], black$7.main, 0.075, "inset"),
    colored: {
        primary: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.primary, 0.4)}`,
        secondary: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.secondary, 0.4)}`,
        info: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.info, 0.4)}`,
        success: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.success, 0.4)}`,
        warning: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.warning, 0.4)}`,
        error: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.error, 0.4)}`,
        light: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.light, 0.4)}`,
        dark: `${boxShadow$1([0, 4], [20, 0], black$7.main, 0.14)}, ${boxShadow$1([0, 7], [10, -5], coloredShadows$1.dark, 0.4)}`,
    },
    navbarBoxShadow: `${boxShadow$1([0, 0], [1, 1], white$x.main, 0.9, "inset")}, ${boxShadow$1([0, 20], [27, 0], black$7.main, 0.05)}`,
    sliderBoxShadow: {
        thumb: boxShadow$1([0, 1], [13, 0], black$7.main, 0.2),
    },
    tabsBoxShadow: {
        indicator: boxShadow$1([0, 1], [5, 1], tabs$3.indicator.boxShadow, 1),
    },
};

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
const { grey: grey$a } = colors$1;
const borders$1 = {
    borderColor: grey$a[300],
    borderWidth: {
        0: 0,
        1: pxToRem$1(1),
        2: pxToRem$1(2),
        3: pxToRem$1(3),
        4: pxToRem$1(4),
        5: pxToRem$1(5),
    },
    borderRadius: {
        xs: pxToRem$1(1.6),
        sm: pxToRem$1(2),
        md: pxToRem$1(6),
        lg: pxToRem$1(8),
        xl: pxToRem$1(12),
        xxl: pxToRem$1(16),
        section: pxToRem$1(160),
    },
};

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
const { info: info$l, dark: dark$d } = colors$1;
const globals$1 = {
    html: {
        scrollBehavior: "smooth",
    },
    "*, *::before, *::after": {
        margin: 0,
        padding: 0,
    },
    "a, a:link, a:visited": {
        textDecoration: "none !important",
    },
    "a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited": {
        color: `${dark$d.main} !important`,
        transition: "color 150ms ease-in !important",
    },
    "a.link:hover, .link:hover, a.link:focus, .link:focus": {
        color: `${info$l.main} !important`,
    },
};

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
/**
  The linearGradient() function helps you to create a linear gradient color background
 */
function linearGradient$1(color, colorState, angle = 195) {
    return `linear-gradient(${angle}deg, ${color}, ${colorState})`;
}

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
const { white: white$w } = colors$1;
const { borderRadius: borderRadius$B } = borders$1;
const sidenav$1 = {
    styleOverrides: {
        root: {
            width: pxToRem$1(250),
            whiteSpace: "nowrap",
            border: "none",
        },
        paper: {
            width: pxToRem$1(250),
            backgroundColor: white$w.main,
            height: `calc(100vh - ${pxToRem$1(32)})`,
            margin: pxToRem$1(16),
            borderRadius: borderRadius$B.xl,
            border: "none",
        },
        paperAnchorDockedLeft: {
            borderRight: "none",
        },
    },
};

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
const list$1 = {
    styleOverrides: {
        padding: {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
};

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
const listItem$1 = {
    defaultProps: {
        disableGutters: true,
    },
    styleOverrides: {
        root: {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
};

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
const listItemText$1 = {
    styleOverrides: {
        root: {
            marginTop: 0,
            marginBottom: 0,
        },
    },
};

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
const { black: black$6, white: white$v } = colors$1;
const { borderWidth: borderWidth$h, borderRadius: borderRadius$A } = borders$1;
const { md: md$a } = boxShadows$1;
const card$1 = {
    styleOverrides: {
        root: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minWidth: 0,
            wordWrap: "break-word",
            backgroundColor: white$v.main,
            backgroundClip: "border-box",
            border: `${borderWidth$h[0]} solid ${rgba$1(black$6.main, 0.125)}`,
            borderRadius: borderRadius$A.xl,
            boxShadow: md$a,
            overflow: "visible",
        },
    },
};

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
const { borderRadius: borderRadius$z } = borders$1;
const cardMedia$1 = {
    styleOverrides: {
        root: {
            borderRadius: borderRadius$z.xl,
            margin: `${pxToRem$1(16)} ${pxToRem$1(16)} 0`,
        },
        media: {
            width: "auto",
        },
    },
};

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
const cardContent$1 = {
    styleOverrides: {
        root: {
            marginTop: 0,
            marginBottom: 0,
            padding: `${pxToRem$1(8)} ${pxToRem$1(24)} ${pxToRem$1(24)}`,
        },
    },
};

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
const { fontWeightBold: fontWeightBold$3, size: size$z } = typography$1;
const { borderRadius: borderRadius$y } = borders$1;
const root$1 = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: size$z.xs,
    fontWeight: fontWeightBold$3,
    borderRadius: borderRadius$y.lg,
    padding: `${pxToRem$1(6.302)} ${pxToRem$1(16.604)}`,
    lineHeight: 1.4,
    textAlign: "center",
    textTransform: "uppercase",
    userSelect: "none",
    backgroundSize: "150% !important",
    backgroundPositionX: "25% !important",
    transition: "all 150ms ease-in",
    "&:disabled": {
        pointerEvent: "none",
        opacity: 0.65,
    },
    "& .material-icons": {
        fontSize: pxToRem$1(15),
        marginTop: pxToRem$1(-2),
    },
};

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
const { white: white$u, text: text$e, info: info$k, secondary: secondary$5 } = colors$1;
const { size: size$y } = typography$1;
const contained$1 = {
    base: {
        backgroundColor: white$u.main,
        minHeight: pxToRem$1(40),
        color: text$e.main,
        padding: `${pxToRem$1(10)} ${pxToRem$1(24)}`,
        "&:hover": {
            backgroundColor: white$u.main,
        },
        "&:active, &:active:focus, &:active:hover": {
            opacity: 0.85,
        },
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(16)} !important`,
        },
    },
    small: {
        minHeight: pxToRem$1(32),
        padding: `${pxToRem$1(6)} ${pxToRem$1(16)}`,
        fontSize: size$y.xs,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(12)} !important`,
        },
    },
    large: {
        minHeight: pxToRem$1(47),
        padding: `${pxToRem$1(12)} ${pxToRem$1(28)}`,
        fontSize: size$y.sm,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(22)} !important`,
        },
    },
    primary: {
        backgroundColor: info$k.main,
        "&:hover": {
            backgroundColor: info$k.main,
        },
        "&:focus:not(:hover)": {
            backgroundColor: info$k.focus,
        },
    },
    secondary: {
        backgroundColor: secondary$5.main,
        "&:hover": {
            backgroundColor: secondary$5.main,
        },
        "&:focus:not(:hover)": {
            backgroundColor: secondary$5.focus,
        },
    },
};

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
const { transparent: transparent$p, light: light$9, info: info$j, secondary: secondary$4 } = colors$1;
const { size: size$x } = typography$1;
const outlined$1 = {
    base: {
        minHeight: pxToRem$1(40),
        color: light$9.main,
        borderColor: light$9.main,
        padding: `${pxToRem$1(10)} ${pxToRem$1(24)}`,
        "&:hover": {
            opacity: 0.75,
            backgroundColor: transparent$p.main,
        },
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(16)} !important`,
        },
    },
    small: {
        minHeight: pxToRem$1(32),
        padding: `${pxToRem$1(6)} ${pxToRem$1(16)}`,
        fontSize: size$x.xs,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(12)} !important`,
        },
    },
    large: {
        minHeight: pxToRem$1(47),
        padding: `${pxToRem$1(12)} ${pxToRem$1(28)}`,
        fontSize: size$x.sm,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(22)} !important`,
        },
    },
    primary: {
        backgroundColor: transparent$p.main,
        borderColor: info$j.main,
        "&:hover": {
            backgroundColor: transparent$p.main,
        },
    },
    secondary: {
        backgroundColor: transparent$p.main,
        borderColor: secondary$4.main,
        "&:hover": {
            backgroundColor: transparent$p.main,
        },
    },
};

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
const { text: text$d, info: info$i, secondary: secondary$3, transparent: transparent$o } = colors$1;
const { size: size$w } = typography$1;
const buttonText$1 = {
    base: {
        backgroundColor: transparent$o.main,
        minHeight: pxToRem$1(40),
        color: text$d.main,
        boxShadow: "none",
        padding: `${pxToRem$1(10)} ${pxToRem$1(24)}`,
        "&:hover": {
            backgroundColor: transparent$o.main,
            boxShadow: "none",
        },
        "&:focus": {
            boxShadow: "none",
        },
        "&:active, &:active:focus, &:active:hover": {
            opacity: 0.85,
            boxShadow: "none",
        },
        "&:disabled": {
            boxShadow: "none",
        },
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(16)} !important`,
        },
    },
    small: {
        minHeight: pxToRem$1(32),
        padding: `${pxToRem$1(6)} ${pxToRem$1(16)}`,
        fontSize: size$w.xs,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(12)} !important`,
        },
    },
    large: {
        minHeight: pxToRem$1(47),
        padding: `${pxToRem$1(12)} ${pxToRem$1(28)}`,
        fontSize: size$w.sm,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem$1(22)} !important`,
        },
    },
    primary: {
        color: info$i.main,
        "&:hover": {
            color: info$i.main,
        },
        "&:focus:not(:hover)": {
            color: info$i.focus,
            boxShadow: "none",
        },
    },
    secondary: {
        color: secondary$3.main,
        "&:hover": {
            color: secondary$3.main,
        },
        "&:focus:not(:hover)": {
            color: secondary$3.focus,
            boxShadow: "none",
        },
    },
};

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
const button$1 = {
    defaultProps: {
        disableRipple: false,
    },
    styleOverrides: {
        root: { ...root$1 },
        contained: { ...contained$1.base },
        containedSizeSmall: { ...contained$1.small },
        containedSizeLarge: { ...contained$1.large },
        containedPrimary: { ...contained$1.primary },
        containedSecondary: { ...contained$1.secondary },
        outlined: { ...outlined$1.base },
        outlinedSizeSmall: { ...outlined$1.small },
        outlinedSizeLarge: { ...outlined$1.large },
        outlinedPrimary: { ...outlined$1.primary },
        outlinedSecondary: { ...outlined$1.secondary },
        text: { ...buttonText$1.base },
        textSizeSmall: { ...buttonText$1.small },
        textSizeLarge: { ...buttonText$1.large },
        textPrimary: { ...buttonText$1.primary },
        textSecondary: { ...buttonText$1.secondary },
    },
};

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
const { transparent: transparent$n } = colors$1;
const iconButton$1 = {
    styleOverrides: {
        root: {
            "&:hover": {
                backgroundColor: transparent$n.main,
            },
        },
    },
};

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
const { info: info$h, inputBorderColor: inputBorderColor$3, dark: dark$c } = colors$1;
const { size: size$v } = typography$1;
const { borderWidth: borderWidth$g } = borders$1;
const input$1 = {
    styleOverrides: {
        root: {
            fontSize: size$v.sm,
            color: dark$c.main,
            "&:hover:not(.Mui-disabled):before": {
                borderBottom: `${borderWidth$g[1]} solid ${inputBorderColor$3}`,
            },
            "&:before": {
                borderColor: inputBorderColor$3,
            },
            "&:after": {
                borderColor: info$h.main,
            },
        },
    },
};

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
const { text: text$c, info: info$g } = colors$1;
const { size: size$u } = typography$1;
const inputLabel$1 = {
    styleOverrides: {
        root: {
            fontSize: size$u.sm,
            color: text$c.main,
            lineHeight: 0.9,
            "&.Mui-focused": {
                color: info$g.main,
            },
            "&.MuiInputLabel-shrink": {
                lineHeight: 1.5,
                fontSize: size$u.md,
                "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
                    fontSize: "0.85em",
                },
            },
        },
        sizeSmall: {
            fontSize: size$u.xs,
            lineHeight: 1.625,
            "&.MuiInputLabel-shrink": {
                lineHeight: 1.6,
                fontSize: size$u.sm,
                "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
                    fontSize: "0.72em",
                },
            },
        },
    },
};

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
const { inputBorderColor: inputBorderColor$2, info: info$f, grey: grey$9, transparent: transparent$m } = colors$1;
const { borderRadius: borderRadius$x } = borders$1;
const { size: size$t } = typography$1;
const inputOutlined$1 = {
    styleOverrides: {
        root: {
            backgroundColor: transparent$m.main,
            fontSize: size$t.sm,
            borderRadius: borderRadius$x.md,
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: inputBorderColor$2,
            },
            "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: info$f.main,
                },
            },
        },
        notchedOutline: {
            borderColor: inputBorderColor$2,
        },
        input: {
            color: grey$9[700],
            padding: pxToRem$1(12),
            backgroundColor: transparent$m.main,
        },
        inputSizeSmall: {
            fontSize: size$t.xs,
            padding: pxToRem$1(10),
        },
        multiline: {
            color: grey$9[700],
            padding: 0,
        },
    },
};

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
const { transparent: transparent$l } = colors$1;
const textField$1 = {
    styleOverrides: {
        root: {
            backgroundColor: transparent$l.main,
        },
    },
};

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
const { lg: lg$5 } = boxShadows$1;
const { size: size$s } = typography$1;
const { text: text$b, white: white$t } = colors$1;
const { borderRadius: borderRadius$w } = borders$1;
const menu$1 = {
    defaultProps: {
        disableAutoFocusItem: true,
    },
    styleOverrides: {
        paper: {
            minWidth: pxToRem$1(160),
            boxShadow: lg$5,
            padding: `${pxToRem$1(16)} ${pxToRem$1(8)}`,
            fontSize: size$s.sm,
            color: text$b.main,
            textAlign: "left",
            backgroundColor: `${white$t.main} !important`,
            borderRadius: borderRadius$w.md,
        },
    },
};

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
const { light: light$8, text: text$a, dark: dark$b } = colors$1;
const { borderRadius: borderRadius$v } = borders$1;
const { size: size$r } = typography$1;
const menuItem$2 = {
    styleOverrides: {
        root: {
            minWidth: pxToRem$1(160),
            minHeight: "unset",
            padding: `${pxToRem$1(4.8)} ${pxToRem$1(16)}`,
            borderRadius: borderRadius$v.md,
            fontSize: size$r.sm,
            color: text$a.main,
            transition: "background-color 300ms ease, color 300ms ease",
            "&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus": {
                backgroundColor: light$8.main,
                color: dark$b.main,
            },
        },
    },
};

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
const { white: white$s, gradients: gradients$8, grey: grey$8, transparent: transparent$k } = colors$1;
const { borderWidth: borderWidth$f } = borders$1;
const { md: md$9 } = boxShadows$1;
const switchButton$1 = {
    defaultProps: {
        disableRipple: false,
    },
    styleOverrides: {
        switchBase: {
            color: gradients$8.dark.main,
            "&:hover": {
                backgroundColor: transparent$k.main,
            },
            "&.Mui-checked": {
                color: gradients$8.dark.main,
                "&:hover": {
                    backgroundColor: transparent$k.main,
                },
                "& .MuiSwitch-thumb": {
                    borderColor: `${gradients$8.dark.main} !important`,
                },
                "& + .MuiSwitch-track": {
                    backgroundColor: `${gradients$8.dark.main} !important`,
                    borderColor: `${gradients$8.dark.main} !important`,
                    opacity: 1,
                },
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: "0.3 !important",
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
                backgroundImage: linearGradient$1(gradients$8.info.main, gradients$8.info.state),
            },
        },
        thumb: {
            backgroundColor: white$s.main,
            boxShadow: md$9,
            border: `${borderWidth$f[1]} solid ${grey$8[400]}`,
        },
        track: {
            width: pxToRem$1(32),
            height: pxToRem$1(15),
            backgroundColor: grey$8[400],
            border: `${borderWidth$f[1]} solid ${grey$8[400]}`,
            opacity: 1,
        },
        checked: {},
    },
};

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
const { dark: dark$a, transparent: transparent$j, white: white$r } = colors$1;
const divider$1 = {
    styleOverrides: {
        root: {
            backgroundColor: transparent$j.main,
            backgroundImage: `linear-gradient(to right, ${rgba$1(dark$a.main, 0)}, ${rgba$1(dark$a.main, 0.4)}, ${rgba$1(dark$a.main, 0)}) !important`,
            height: pxToRem$1(1),
            margin: `${pxToRem$1(16)} 0`,
            borderBottom: "none",
            opacity: 0.25,
        },
        vertical: {
            backgroundColor: transparent$j.main,
            backgroundImage: `linear-gradient(to bottom, ${rgba$1(dark$a.main, 0)}, ${rgba$1(dark$a.main, 0.4)}, ${rgba$1(dark$a.main, 0)}) !important`,
            width: pxToRem$1(1),
            height: "100%",
            margin: `0 ${pxToRem$1(16)}`,
            borderRight: "none",
        },
        light: {
            backgroundColor: transparent$j.main,
            backgroundImage: `linear-gradient(to right, ${rgba$1(white$r.main, 0)}, ${white$r.main}, ${rgba$1(white$r.main, 0)}) !important`,
            "&.MuiDivider-vertical": {
                backgroundImage: `linear-gradient(to bottom, ${rgba$1(white$r.main, 0)}, ${white$r.main}, ${rgba$1(white$r.main, 0)}) !important`,
            },
        },
    },
};

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
const { white: white$q } = colors$1;
const { md: md$8 } = boxShadows$1;
const { borderRadius: borderRadius$u } = borders$1;
const tableContainer$1 = {
    styleOverrides: {
        root: {
            backgroundColor: white$q.main,
            boxShadow: md$8,
            borderRadius: borderRadius$u.xl,
        },
    },
};

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
const { borderRadius: borderRadius$t } = borders$1;
const tableHead$1 = {
    styleOverrides: {
        root: {
            display: "block",
            padding: `${pxToRem$1(16)} ${pxToRem$1(16)} 0  ${pxToRem$1(16)}`,
            borderRadius: `${borderRadius$t.xl} ${borderRadius$t.xl} 0 0`,
        },
    },
};

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
const { borderWidth: borderWidth$e } = borders$1;
const { light: light$7 } = colors$1;
const tableCell$1 = {
    styleOverrides: {
        root: {
            padding: `${pxToRem$1(12)} ${pxToRem$1(16)}`,
            borderBottom: `${borderWidth$e[1]} solid ${light$7.main}`,
        },
    },
};

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
const { borderRadius: borderRadius$s } = borders$1;
const { light: light$6 } = colors$1;
const linearProgress$1 = {
    styleOverrides: {
        root: {
            height: pxToRem$1(6),
            borderRadius: borderRadius$s.md,
            overflow: "visible",
            position: "relative",
        },
        colorPrimary: {
            backgroundColor: light$6.main,
        },
        colorSecondary: {
            backgroundColor: light$6.main,
        },
        bar: {
            height: pxToRem$1(6),
            borderRadius: borderRadius$s.sm,
            position: "absolute",
            transform: `translate(0, 0) !important`,
            transition: "width 0.6s ease !important",
        },
    },
};

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
const { grey: grey$7 } = colors$1;
const { size: size$q } = typography$1;
const breadcrumbs$1 = {
    styleOverrides: {
        li: {
            lineHeight: 0,
        },
        separator: {
            fontSize: size$q.sm,
            color: grey$7[600],
        },
    },
};

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
const { grey: grey$6, white: white$p, black: black$5, info: info$e } = colors$1;
const { borderRadius: borderRadius$r, borderWidth: borderWidth$d } = borders$1;
const { sliderBoxShadow: sliderBoxShadow$1 } = boxShadows$1;
const slider$1 = {
    styleOverrides: {
        root: {
            width: "100%",
            "& .MuiSlider-active, & .Mui-focusVisible": {
                boxShadow: "none !important",
            },
            "& .MuiSlider-valueLabel": {
                color: black$5.main,
            },
        },
        rail: {
            height: pxToRem$1(2),
            background: grey$6[200],
            borderRadius: borderRadius$r.sm,
            opacity: 1,
        },
        track: {
            background: info$e.main,
            height: pxToRem$1(2),
            position: "relative",
            border: "none",
            borderRadius: borderRadius$r.lg,
            zIndex: 1,
        },
        thumb: {
            width: pxToRem$1(14),
            height: pxToRem$1(14),
            backgroundColor: white$p.main,
            zIndex: 10,
            boxShadow: sliderBoxShadow$1.thumb,
            border: `${borderWidth$d[1]} solid ${info$e.main}`,
            transition: "all 200ms linear",
            "&:hover": {
                boxShadow: "none",
            },
            "&:active": {
                transform: "translate(-50%, -50%) scale(1.4)",
            },
            "&.Mui-active": { boxShadow: boxShadow$1([0, 0], [0, 14], info$e.main, 0.16) },
        },
    },
};

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
const { borderRadius: borderRadius$q } = borders$1;
const avatar$1 = {
    styleOverrides: {
        root: {
            transition: "all 200ms ease-in-out",
        },
        rounded: {
            borderRadius: borderRadius$q.lg,
        },
        img: {
            height: "auto",
        },
    },
};

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
const { black: black$4, light: light$5 } = colors$1;
const { size: size$p, fontWeightRegular: fontWeightRegular$5 } = typography$1;
const { borderRadius: borderRadius$p } = borders$1;
const tooltip$1 = {
    defaultProps: {
        arrow: true,
        TransitionComponent: Fade__default["default"],
    },
    styleOverrides: {
        tooltip: {
            maxWidth: pxToRem$1(200),
            backgroundColor: black$4.main,
            color: light$5.main,
            fontSize: size$p.sm,
            fontWeight: fontWeightRegular$5,
            textAlign: "center",
            borderRadius: borderRadius$p.md,
            opacity: 0.7,
            padding: `${pxToRem$1(5)} ${pxToRem$1(8)} ${pxToRem$1(4)}`,
        },
        arrow: {
            color: black$4.main,
        },
    },
};

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
const appBar$1 = {
    defaultProps: {
        color: "transparent",
    },
    styleOverrides: {
        root: {
            boxShadow: "none",
        },
    },
};

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
const { grey: grey$5, white: white$o } = colors$1;
const { borderRadius: borderRadius$o } = borders$1;
const { tabsBoxShadow } = boxShadows$1;
const tabs$2 = {
    styleOverrides: {
        root: {
            position: "relative",
            backgroundColor: grey$5[100],
            borderRadius: borderRadius$o.xl,
            minHeight: "unset",
            padding: pxToRem$1(4),
        },
        flexContainer: {
            height: "100%",
            position: "relative",
            zIndex: 10,
        },
        fixed: {
            overflow: "unset !important",
            overflowX: "unset !important",
        },
        vertical: {
            "& .MuiTabs-indicator": {
                width: "100%",
            },
        },
        indicator: {
            height: "100%",
            borderRadius: borderRadius$o.lg,
            backgroundColor: white$o.main,
            boxShadow: tabsBoxShadow.indicator,
            transition: "all 500ms ease",
        },
    },
};

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
const { size: size$o, fontWeightRegular: fontWeightRegular$4 } = typography$1;
const { borderRadius: borderRadius$n } = borders$1;
const { dark: dark$9 } = colors$1;
const tab$1 = {
    styleOverrides: {
        root: {
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            flex: "1 1 auto",
            textAlign: "center",
            maxWidth: "unset !important",
            minWidth: "unset !important",
            minHeight: "unset !important",
            fontSize: size$o.md,
            fontWeight: fontWeightRegular$4,
            textTransform: "none",
            lineHeight: "inherit",
            padding: pxToRem$1(4),
            borderRadius: borderRadius$n.lg,
            color: `${dark$9.main} !important`,
            opacity: "1 !important",
            "& .material-icons, .material-icons-round": {
                marginBottom: "0 !important",
                marginRight: pxToRem$1(6),
            },
            "& svg": {
                marginBottom: "0 !important",
                marginRight: pxToRem$1(6),
            },
        },
        labelIcon: {
            paddingTop: pxToRem$1(4),
        },
    },
};

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
const { transparent: transparent$i, gradients: gradients$7 } = colors$1;
const { borderRadius: borderRadius$m } = borders$1;
const { colored: colored$1 } = boxShadows$1;
const stepper$1 = {
    styleOverrides: {
        root: {
            background: linearGradient$1(gradients$7.info.main, gradients$7.info.state),
            padding: `${pxToRem$1(24)} 0 ${pxToRem$1(16)}`,
            borderRadius: borderRadius$m.lg,
            boxShadow: colored$1.info,
            "&.MuiPaper-root": {
                backgroundColor: transparent$i.main,
            },
        },
    },
};

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
const step$1 = {
    styleOverrides: {
        root: {
            padding: `0 ${pxToRem$1(6)}`,
        },
    },
};

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
const { white: white$n } = colors$1;
const { borderWidth: borderWidth$c } = borders$1;
const stepConnector$1 = {
    styleOverrides: {
        root: {
            color: "#9fc9ff",
            transition: "all 200ms linear",
            "&.Mui-active": {
                color: white$n.main,
            },
            "&.Mui-completed": {
                color: white$n.main,
            },
        },
        alternativeLabel: {
            top: "14%",
            left: "-50%",
            right: "50%",
        },
        line: {
            borderWidth: `${borderWidth$c[2]} !important`,
            borderColor: "currentColor",
            opacity: 0.5,
        },
    },
};

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
const { size: size$n, fontWeightRegular: fontWeightRegular$3 } = typography$1;
const { white: white$m } = colors$1;
const stepLabel$1 = {
    styleOverrides: {
        label: {
            marginTop: `${pxToRem$1(8)} !important`,
            fontWeight: fontWeightRegular$3,
            fontSize: size$n.xs,
            color: "#9fc9ff",
            textTransform: "uppercase",
            "&.Mui-active": {
                fontWeight: `${fontWeightRegular$3} !important`,
                color: `${rgba$1(white$m.main, 0.8)} !important`,
            },
            "&.Mui-completed": {
                fontWeight: `${fontWeightRegular$3} !important`,
                color: `${rgba$1(white$m.main, 0.8)} !important`,
            },
        },
    },
};

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
const { white: white$l } = colors$1;
const stepIcon$1 = {
    styleOverrides: {
        root: {
            background: "#9fc9ff",
            fill: "#9fc9ff",
            stroke: "#9fc9ff",
            strokeWidth: pxToRem$1(10),
            width: pxToRem$1(13),
            height: pxToRem$1(13),
            borderRadius: "50%",
            zIndex: 99,
            transition: "all 200ms linear",
            "&.Mui-active": {
                background: white$l.main,
                fill: white$l.main,
                stroke: white$l.main,
                borderColor: white$l.main,
                boxShadow: boxShadow$1([0, 0], [0, 2], white$l.main, 1),
            },
            "&.Mui-completed": {
                background: white$l.main,
                fill: white$l.main,
                stroke: white$l.main,
                borderColor: white$l.main,
                boxShadow: boxShadow$1([0, 0], [0, 2], white$l.main, 1),
            },
        },
    },
};

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
const { transparent: transparent$h } = colors$1;
const select$1 = {
    styleOverrides: {
        select: {
            display: "grid",
            alignItems: "center",
            padding: `0 ${pxToRem$1(12)} !important`,
            "& .Mui-selected": {
                backgroundColor: transparent$h.main,
            },
        },
        selectMenu: {
            background: "none",
            height: "none",
            minHeight: "none",
            overflow: "unset",
        },
        icon: {
            display: "none",
        },
    },
};

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
const { dark: dark$8 } = colors$1;
const { size: size$m, fontWeightBold: fontWeightBold$2 } = typography$1;
const formControlLabel$1 = {
    styleOverrides: {
        root: {
            display: "block",
            minHeight: pxToRem$1(24),
            marginBottom: pxToRem$1(2),
        },
        label: {
            display: "inline-block",
            fontSize: size$m.sm,
            fontWeight: fontWeightBold$2,
            color: dark$8.main,
            lineHeight: 1,
            transform: `translateY(${pxToRem$1(1)})`,
            marginLeft: pxToRem$1(4),
            "&.Mui-disabled": {
                color: dark$8.main,
            },
        },
    },
};

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
const { text: text$9 } = colors$1;
const formLabel$1 = {
    styleOverrides: {
        root: {
            color: text$9.main,
        },
    },
};

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
const { borderWidth: borderWidth$b, borderColor: borderColor$5 } = borders$1;
const { transparent: transparent$g, info: info$d } = colors$1;
const checkbox$1 = {
    styleOverrides: {
        root: {
            "& .MuiSvgIcon-root": {
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: pxToRem$1(20),
                height: pxToRem$1(20),
                color: transparent$g.main,
                border: `${borderWidth$b[1]} solid ${borderColor$5}`,
                borderRadius: pxToRem$1(5.6),
            },
            "&:hover": {
                backgroundColor: transparent$g.main,
            },
            "&.Mui-focusVisible": {
                border: `${borderWidth$b[2]} solid ${info$d.main} !important`,
            },
        },
        colorPrimary: {
            color: borderColor$5,
            "&.Mui-checked": {
                color: info$d.main,
                "& .MuiSvgIcon-root": {
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${linearGradient$1(info$d.main, info$d.main)}`,
                    borderColor: info$d.main,
                },
            },
        },
        colorSecondary: {
            color: borderColor$5,
            "& .MuiSvgIcon-root": {
                color: info$d.main,
                "&.Mui-checked": {
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${linearGradient$1(info$d.main, info$d.main)}`,
                    borderColor: info$d.main,
                },
            },
        },
    },
};

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
const { borderWidth: borderWidth$a, borderColor: borderColor$4 } = borders$1;
const { transparent: transparent$f, info: info$c } = colors$1;
const radio$1 = {
    styleOverrides: {
        root: {
            "& .MuiSvgIcon-root": {
                width: pxToRem$1(20),
                height: pxToRem$1(20),
                color: transparent$f.main,
                border: `${borderWidth$a[1]} solid ${borderColor$4}`,
                borderRadius: "50%",
            },
            "&:after": {
                transition: "opacity 250ms ease-in-out",
                content: `""`,
                position: "absolute",
                width: pxToRem$1(14),
                height: pxToRem$1(14),
                borderRadius: "50%",
                backgroundImage: linearGradient$1(info$c.main, info$c.main),
                opacity: 0,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: "auto",
            },
            "&:hover": {
                backgroundColor: transparent$f.main,
            },
            "&.Mui-focusVisible": {
                border: `${borderWidth$a[2]} solid ${info$c.main} !important`,
            },
        },
        colorPrimary: {
            color: borderColor$4,
            "&.Mui-checked": {
                color: info$c.main,
                "& .MuiSvgIcon-root": {
                    borderColor: info$c.main,
                },
                "&:after": {
                    opacity: 1,
                },
            },
        },
        colorSecondary: {
            color: borderColor$4,
            "&.Mui-checked": {
                color: info$c.main,
                "& .MuiSvgIcon-root": {
                    borderColor: info$c.main,
                },
                "&:after": {
                    opacity: 1,
                },
            },
        },
    },
};

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
const { lg: lg$4 } = boxShadows$1;
const { size: size$l } = typography$1;
const { text: text$8, white: white$k, transparent: transparent$e, light: light$4, dark: dark$7, gradients: gradients$6 } = colors$1;
const { borderRadius: borderRadius$l } = borders$1;
const autocomplete = {
    styleOverrides: {
        popper: {
            boxShadow: lg$4,
            padding: pxToRem$1(8),
            fontSize: size$l.sm,
            color: text$8.main,
            textAlign: "left",
            backgroundColor: `${white$k.main} !important`,
            borderRadius: borderRadius$l.md,
        },
        paper: {
            boxShadow: "none",
            backgroundColor: transparent$e.main,
        },
        option: {
            padding: `${pxToRem$1(4.8)} ${pxToRem$1(16)}`,
            borderRadius: borderRadius$l.md,
            fontSize: size$l.sm,
            color: text$8.main,
            transition: "background-color 300ms ease, color 300ms ease",
            "&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus": {
                backgroundColor: light$4.main,
                color: dark$7.main,
            },
            '&[aria-selected="true"]': {
                backgroundColor: `${light$4.main} !important`,
                color: `${dark$7.main} !important`,
            },
        },
        noOptions: {
            fontSize: size$l.sm,
            color: text$8.main,
        },
        groupLabel: {
            color: dark$7.main,
        },
        loading: {
            fontSize: size$l.sm,
            color: text$8.main,
        },
        tag: {
            display: "flex",
            alignItems: "center",
            height: "auto",
            padding: pxToRem$1(4),
            backgroundColor: gradients$6.dark.state,
            color: white$k.main,
            "& .MuiChip-label": {
                lineHeight: 1.2,
                padding: `0 ${pxToRem$1(10)} 0 ${pxToRem$1(4)}`,
            },
            "& .MuiSvgIcon-root, & .MuiSvgIcon-root:hover, & .MuiSvgIcon-root:focus": {
                color: white$k.main,
                marginRight: 0,
            },
        },
    },
};

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
const { info: info$b, white: white$j, gradients: gradients$5 } = colors$1;
const flatpickr$1 = {
    ".flatpickr-day:hover, .flatpickr-day:focus, .flatpickr-day.nextMonthDay:hover, .flatpickr-day.nextMonthDay:focus": {
        background: rgba$1(info$b.main, 0.28),
        border: "none",
    },
    ".flatpickr-day.today": {
        background: info$b.main,
        color: white$j.main,
        border: "none",
        "&:hover, &:focus": {
            background: `${info$b.focus} !important`,
        },
    },
    ".flatpickr-day.selected, .flatpickr-day.selected:hover, .flatpickr-day.nextMonthDay.selected, .flatpickr-day.nextMonthDay.selected:hover, .flatpickr-day.nextMonthDay.selected:focus": {
        background: `${gradients$5.info.state} !important`,
        color: white$j.main,
        border: "none",
    },
    ".flatpickr-months .flatpickr-next-month:hover svg, .flatpickr-months .flatpickr-prev-month:hover svg": {
        color: `${info$b.main} !important`,
        fill: `${info$b.main} !important`,
    },
};

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
const { values: { sm: sm$1, md: md$7, lg: lg$3, xl: xl$1, xxl: xxl$3 }, } = breakpoints$1;
const SM$1 = `@media (min-width: ${sm$1}px)`;
const MD$1 = `@media (min-width: ${md$7}px)`;
const LG$1 = `@media (min-width: ${lg$3}px)`;
const XL$1 = `@media (min-width: ${xl$1}px)`;
const XXL$1 = `@media (min-width: ${xxl$3}px)`;
const sharedClasses$1 = {
    paddingRight: `${pxToRem$1(24)} !important`,
    paddingLeft: `${pxToRem$1(24)} !important`,
    marginRight: "auto !important",
    marginLeft: "auto !important",
    width: "100% !important",
    position: "relative",
};
const container$1 = {
    [SM$1]: {
        ".MuiContainer-root": {
            ...sharedClasses$1,
            maxWidth: "540px !important",
        },
    },
    [MD$1]: {
        ".MuiContainer-root": {
            ...sharedClasses$1,
            maxWidth: "720px !important",
        },
    },
    [LG$1]: {
        ".MuiContainer-root": {
            ...sharedClasses$1,
            maxWidth: "960px !important",
        },
    },
    [XL$1]: {
        ".MuiContainer-root": {
            ...sharedClasses$1,
            maxWidth: "1140px !important",
        },
    },
    [XXL$1]: {
        ".MuiContainer-root": {
            ...sharedClasses$1,
            maxWidth: "1320px !important",
        },
    },
};

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
const { transparent: transparent$d } = colors$1;
const { lg: lg$2 } = boxShadows$1;
const { borderRadius: borderRadius$k } = borders$1;
const popover$1 = {
    styleOverrides: {
        paper: {
            backgroundColor: transparent$d.main,
            boxShadow: lg$2,
            padding: pxToRem$1(8),
            borderRadius: borderRadius$k.md,
        },
    },
};

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
const buttonBase$1 = {
    defaultProps: {
        disableRipple: false,
    },
};

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
const icon$1 = {
    defaultProps: {
        baseClassName: "material-icons-round",
        fontSize: "inherit",
    },
    styleOverrides: {
        fontSizeInherit: {
            fontSize: "inherit !important",
        },
        fontSizeSmall: {
            fontSize: `${pxToRem$1(20)} !important`,
        },
        fontSizeLarge: {
            fontSize: `${pxToRem$1(36)} !important`,
        },
    },
};

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
const svgIcon$1 = {
    defaultProps: {
        fontSize: "inherit",
    },
    styleOverrides: {
        fontSizeInherit: {
            fontSize: "inherit !important",
        },
        fontSizeSmall: {
            fontSize: `${pxToRem$1(20)} !important`,
        },
        fontSizeLarge: {
            fontSize: `${pxToRem$1(36)} !important`,
        },
    },
};

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
const link$1 = {
    defaultProps: {
        underline: "none",
        color: "inherit",
    },
};

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
const { borderRadius: borderRadius$j } = borders$1;
const { xxl: xxl$2 } = boxShadows$1;
const dialog$1 = {
    styleOverrides: {
        paper: {
            borderRadius: borderRadius$j.lg,
            boxShadow: xxl$2,
        },
        paperFullScreen: {
            borderRadius: 0,
        },
    },
};

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
const { size: size$k } = typography$1;
const dialogTitle$1 = {
    styleOverrides: {
        root: {
            padding: pxToRem$1(16),
            fontSize: size$k.xl,
        },
    },
};

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
const { size: size$j } = typography$1;
const { text: text$7 } = colors$1;
const { borderWidth: borderWidth$9, borderColor: borderColor$3 } = borders$1;
const dialogContent$1 = {
    styleOverrides: {
        root: {
            padding: pxToRem$1(16),
            fontSize: size$j.md,
            color: text$7.main,
        },
        dividers: {
            borderTop: `${borderWidth$9[1]} solid ${borderColor$3}`,
            borderBottom: `${borderWidth$9[1]} solid ${borderColor$3}`,
        },
    },
};

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
const { size: size$i } = typography$1;
const { text: text$6 } = colors$1;
const dialogContentText$1 = {
    styleOverrides: {
        root: {
            fontSize: size$i.md,
            color: text$6.main,
        },
    },
};

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
const dialogActions$1 = {
    styleOverrides: {
        root: {
            padding: pxToRem$1(16),
        },
    },
};

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
var theme = material.createTheme({
    breakpoints: { ...breakpoints$1 },
    palette: { ...colors$1 },
    typography: { ...typography$1 },
    boxShadows: { ...boxShadows$1 },
    borders: { ...borders$1 },
    functions: {
        boxShadow: boxShadow$1,
        hexToRgb: hexToRgb$1,
        linearGradient: linearGradient$1,
        pxToRem: pxToRem$1,
        rgba: rgba$1,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ...globals$1,
                ...flatpickr$1,
                ...container$1,
            },
        },
        MuiDrawer: { ...sidenav$1 },
        MuiList: { ...list$1 },
        MuiListItem: { ...listItem$1 },
        MuiListItemText: { ...listItemText$1 },
        MuiCard: { ...card$1 },
        MuiCardMedia: { ...cardMedia$1 },
        MuiCardContent: { ...cardContent$1 },
        MuiButton: { ...button$1 },
        MuiIconButton: { ...iconButton$1 },
        MuiInput: { ...input$1 },
        MuiInputLabel: { ...inputLabel$1 },
        MuiOutlinedInput: { ...inputOutlined$1 },
        MuiTextField: { ...textField$1 },
        MuiMenu: { ...menu$1 },
        MuiMenuItem: { ...menuItem$2 },
        MuiSwitch: { ...switchButton$1 },
        MuiDivider: { ...divider$1 },
        MuiTableContainer: { ...tableContainer$1 },
        MuiTableHead: { ...tableHead$1 },
        MuiTableCell: { ...tableCell$1 },
        MuiLinearProgress: { ...linearProgress$1 },
        MuiBreadcrumbs: { ...breadcrumbs$1 },
        MuiSlider: { ...slider$1 },
        MuiAvatar: { ...avatar$1 },
        MuiTooltip: { ...tooltip$1 },
        MuiAppBar: { ...appBar$1 },
        MuiTabs: { ...tabs$2 },
        MuiTab: { ...tab$1 },
        MuiStepper: { ...stepper$1 },
        MuiStep: { ...step$1 },
        MuiStepConnector: { ...stepConnector$1 },
        MuiStepLabel: { ...stepLabel$1 },
        MuiStepIcon: { ...stepIcon$1 },
        MuiSelect: { ...select$1 },
        MuiFormControlLabel: { ...formControlLabel$1 },
        MuiFormLabel: { ...formLabel$1 },
        MuiCheckbox: { ...checkbox$1 },
        MuiRadio: { ...radio$1 },
        MuiAutocomplete: { ...autocomplete },
        MuiPopover: { ...popover$1 },
        MuiButtonBase: { ...buttonBase$1 },
        MuiIcon: { ...icon$1 },
        MuiSvgIcon: { ...svgIcon$1 },
        MuiLink: { ...link$1 },
        MuiDialog: { ...dialog$1 },
        MuiDialogTitle: { ...dialogTitle$1 },
        MuiDialogContent: { ...dialogContent$1 },
        MuiDialogContentText: { ...dialogContentText$1 },
        MuiDialogActions: { ...dialogActions$1 },
    },
});

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
var themeRTL = styles.createTheme({
    direction: "rtl",
    breakpoints: { ...breakpoints$1 },
    palette: { ...colors$1 },
    typography: { ...typography$1 },
    boxShadows: { ...boxShadows$1 },
    borders: { ...borders$1 },
    functions: {
        boxShadow: boxShadow$1,
        hexToRgb: hexToRgb$1,
        linearGradient: linearGradient$1,
        pxToRem: pxToRem$1,
        rgba: rgba$1,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ...globals$1,
                ...flatpickr$1,
                ...container$1,
            },
        },
        MuiDrawer: { ...sidenav$1 },
        MuiList: { ...list$1 },
        MuiListItem: { ...listItem$1 },
        MuiListItemText: { ...listItemText$1 },
        MuiCard: { ...card$1 },
        MuiCardMedia: { ...cardMedia$1 },
        MuiCardContent: { ...cardContent$1 },
        MuiButton: { ...button$1 },
        MuiIconButton: { ...iconButton$1 },
        MuiInput: { ...input$1 },
        MuiInputLabel: { ...inputLabel$1 },
        MuiOutlinedInput: { ...inputOutlined$1 },
        MuiTextField: { ...textField$1 },
        MuiMenu: { ...menu$1 },
        MuiMenuItem: { ...menuItem$2 },
        MuiSwitch: { ...switchButton$1 },
        MuiDivider: { ...divider$1 },
        MuiTableContainer: { ...tableContainer$1 },
        MuiTableHead: { ...tableHead$1 },
        MuiTableCell: { ...tableCell$1 },
        MuiLinearProgress: { ...linearProgress$1 },
        MuiBreadcrumbs: { ...breadcrumbs$1 },
        MuiSlider: { ...slider$1 },
        MuiAvatar: { ...avatar$1 },
        MuiTooltip: { ...tooltip$1 },
        MuiAppBar: { ...appBar$1 },
        MuiTabs: { ...tabs$2 },
        MuiTab: { ...tab$1 },
        MuiStepper: { ...stepper$1 },
        MuiStep: { ...step$1 },
        MuiStepConnector: { ...stepConnector$1 },
        MuiStepLabel: { ...stepLabel$1 },
        MuiStepIcon: { ...stepIcon$1 },
        MuiSelect: { ...select$1 },
        MuiFormControlLabel: { ...formControlLabel$1 },
        MuiFormLabel: { ...formLabel$1 },
        MuiCheckbox: { ...checkbox$1 },
        MuiRadio: { ...radio$1 },
        MuiAutocomplete: { ...autocomplete },
        MuiPopover: { ...popover$1 },
        MuiButtonBase: { ...buttonBase$1 },
        MuiIcon: { ...icon$1 },
        MuiSvgIcon: { ...svgIcon$1 },
        MuiLink: { ...link$1 },
        MuiDialog: { ...dialog$1 },
        MuiDialogTitle: { ...dialogTitle$1 },
        MuiDialogContent: { ...dialogContent$1 },
        MuiDialogContentText: { ...dialogContentText$1 },
        MuiDialogActions: { ...dialogActions$1 },
    },
});

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
const colors = {
    background: {
        default: "#1a2035",
        sidenav: "#1f283e",
        card: "#202940",
    },
    text: {
        main: "#ffffffcc",
        focus: "#ffffffcc",
    },
    transparent: {
        main: "transparent",
    },
    white: {
        main: "#ffffff",
        focus: "#ffffff",
    },
    black: {
        light: "#000000",
        main: "#000000",
        focus: "#000000",
    },
    primary: {
        main: "#e91e63",
        focus: "#e91e63",
    },
    secondary: {
        main: "#7b809a",
        focus: "#8f93a9",
    },
    info: {
        main: "#1A73E8",
        focus: "#1662C4",
    },
    success: {
        main: "#4CAF50",
        focus: "#67bb6a",
    },
    warning: {
        main: "#fb8c00",
        focus: "#fc9d26",
    },
    error: {
        main: "#F44335",
        focus: "#f65f53",
    },
    light: {
        main: "#f0f2f566",
        focus: "#f0f2f566",
    },
    dark: {
        main: "#344767",
        focus: "#2c3c58",
    },
    grey: {
        100: "#f8f9fa",
        200: "#f0f2f5",
        300: "#dee2e6",
        400: "#ced4da",
        500: "#adb5bd",
        600: "#6c757d",
        700: "#495057",
        800: "#343a40",
        900: "#212529",
    },
    gradients: {
        primary: {
            main: "#EC407A",
            state: "#D81B60",
        },
        secondary: {
            main: "#747b8a",
            state: "#495361",
        },
        info: {
            main: "#49a3f1",
            state: "#1A73E8",
        },
        success: {
            main: "#66BB6A",
            state: "#43A047",
        },
        warning: {
            main: "#FFA726",
            state: "#FB8C00",
        },
        error: {
            main: "#EF5350",
            state: "#E53935",
        },
        light: {
            main: "#EBEFF4",
            state: "#CED4DA",
        },
        dark: {
            main: "#323a54",
            state: "#1a2035",
        },
    },
    socialMediaColors: {
        facebook: {
            main: "#3b5998",
            dark: "#344e86",
        },
        twitter: {
            main: "#55acee",
            dark: "#3ea1ec",
        },
        instagram: {
            main: "#125688",
            dark: "#0e456d",
        },
        linkedin: {
            main: "#0077b5",
            dark: "#00669c",
        },
        pinterest: {
            main: "#cc2127",
            dark: "#b21d22",
        },
        youtube: {
            main: "#e52d27",
            dark: "#d41f1a",
        },
        vimeo: {
            main: "#1ab7ea",
            dark: "#13a3d2",
        },
        slack: {
            main: "#3aaf85",
            dark: "#329874",
        },
        dribbble: {
            main: "#ea4c89",
            dark: "#e73177",
        },
        github: {
            main: "#24292e",
            dark: "#171a1d",
        },
        reddit: {
            main: "#ff4500",
            dark: "#e03d00",
        },
        tumblr: {
            main: "#35465c",
            dark: "#2a3749",
        },
    },
    badgeColors: {
        primary: {
            background: "#f8b3ca",
            text: "#cc084b",
        },
        secondary: {
            background: "#d7d9e1",
            text: "#6c757d",
        },
        info: {
            background: "#aecef7",
            text: "#095bc6",
        },
        success: {
            background: "#bce2be",
            text: "#339537",
        },
        warning: {
            background: "#ffd59f",
            text: "#c87000",
        },
        error: {
            background: "#fcd3d0",
            text: "#f61200",
        },
        light: {
            background: "#ffffff",
            text: "#c7d3de",
        },
        dark: {
            background: "#8097bf",
            text: "#1e2e4a",
        },
    },
    coloredShadows: {
        primary: "#e91e62",
        secondary: "#110e0e",
        info: "#00bbd4",
        success: "#4caf4f",
        warning: "#ff9900",
        error: "#f44336",
        light: "#adb5bd",
        dark: "#404040",
    },
    inputBorderColor: "#d2d6da",
    tabs: {
        indicator: { boxShadow: "#ddd" },
    },
};

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
/**
 * The base breakpoints for the Material Dashboard 2 PRO React TSUI Dashboard PRO Material.
 * You can add new breakpoints using this file.
 * You can customized the breakpoints for the entire Material Dashboard 2 PRO React TSUI Dashboard PRO Material using thie file.
 */
const breakpoints = {
    values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
    },
};

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
/**
  The pxToRem() function helps you to convert a px unit into a rem unit,
 */
function pxToRem(number, baseNumber = 16) {
    return `${number / baseNumber}rem`;
}

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
const { white: white$i } = colors;
const baseProperties = {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLighter: 100,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSizeXXS: pxToRem(10.4),
    fontSizeXS: pxToRem(12),
    fontSizeSM: pxToRem(14),
    fontSizeMD: pxToRem(16),
    fontSizeLG: pxToRem(18),
    fontSizeXL: pxToRem(20),
    fontSize2XL: pxToRem(24),
    fontSize3XL: pxToRem(30),
};
const baseHeadingProperties = {
    fontFamily: baseProperties.fontFamily,
    color: white$i.main,
    fontWeight: baseProperties.fontWeightBold,
};
const baseDisplayProperties = {
    fontFamily: baseProperties.fontFamily,
    color: white$i.main,
    fontWeight: baseProperties.fontWeightLight,
    lineHeight: 1.2,
};
const typography = {
    fontFamily: baseProperties.fontFamily,
    fontWeightLighter: baseProperties.fontWeightLighter,
    fontWeightLight: baseProperties.fontWeightLight,
    fontWeightRegular: baseProperties.fontWeightRegular,
    fontWeightMedium: baseProperties.fontWeightMedium,
    fontWeightBold: baseProperties.fontWeightBold,
    h1: {
        fontSize: pxToRem(48),
        lineHeight: 1.25,
        ...baseHeadingProperties,
    },
    h2: {
        fontSize: pxToRem(36),
        lineHeight: 1.3,
        ...baseHeadingProperties,
    },
    h3: {
        fontSize: pxToRem(30),
        lineHeight: 1.375,
        ...baseHeadingProperties,
    },
    h4: {
        fontSize: pxToRem(24),
        lineHeight: 1.375,
        ...baseHeadingProperties,
    },
    h5: {
        fontSize: pxToRem(20),
        lineHeight: 1.375,
        ...baseHeadingProperties,
    },
    h6: {
        fontSize: pxToRem(16),
        lineHeight: 1.625,
        ...baseHeadingProperties,
    },
    subtitle1: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXL,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.625,
    },
    subtitle2: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeMD,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.6,
    },
    body1: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXL,
        fontWeight: baseProperties.fontWeightRegular,
        lineHeight: 1.625,
    },
    body2: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeMD,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.6,
    },
    button: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeSM,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.5,
        textTransform: "uppercase",
    },
    caption: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXS,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.25,
    },
    overline: {
        fontFamily: baseProperties.fontFamily,
    },
    d1: {
        fontSize: pxToRem(80),
        ...baseDisplayProperties,
    },
    d2: {
        fontSize: pxToRem(72),
        ...baseDisplayProperties,
    },
    d3: {
        fontSize: pxToRem(64),
        ...baseDisplayProperties,
    },
    d4: {
        fontSize: pxToRem(56),
        ...baseDisplayProperties,
    },
    d5: {
        fontSize: pxToRem(48),
        ...baseDisplayProperties,
    },
    d6: {
        fontSize: pxToRem(40),
        ...baseDisplayProperties,
    },
    size: {
        xxs: baseProperties.fontSizeXXS,
        xs: baseProperties.fontSizeXS,
        sm: baseProperties.fontSizeSM,
        md: baseProperties.fontSizeMD,
        lg: baseProperties.fontSizeLG,
        xl: baseProperties.fontSizeXL,
        "2xl": baseProperties.fontSize2XL,
        "3xl": baseProperties.fontSize3XL,
    },
    lineHeight: {
        sm: 1.25,
        md: 1.5,
        lg: 2,
    },
};

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
function boxShadow(offset, radius, color, opacity, inset = "") {
    const [x, y] = offset;
    const [blur, spread] = radius;
    return `${inset} ${pxToRem$1(x)} ${pxToRem$1(y)} ${pxToRem$1(blur)} ${pxToRem$1(spread)} ${rgba$1(color, opacity)}`;
}

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
const { black: black$3, dark: dark$6, tabs: tabs$1, coloredShadows } = colors;
const boxShadows = {
    xs: boxShadow([0, 2], [9, -5], black$3.main, 0.15),
    sm: boxShadow([0, 5], [10, 0], black$3.main, 0.12),
    md: `${boxShadow([0, 2], [2, 0], black$3.main, 0.14)}, ${boxShadow([0, 3], [1, -2], black$3.main, 0.2)}, ${boxShadow([0, 1], [5, 0], black$3.main, 0.12)}`,
    lg: `${boxShadow([0, 10], [15, -3], black$3.main, 0.1)}, ${boxShadow([0, 4], [6, -2], black$3.main, 0.05)}`,
    xl: `${boxShadow([0, 20], [25, -5], black$3.main, 0.1)}, ${boxShadow([0, 10], [10, -5], black$3.main, 0.04)}`,
    xxl: boxShadow([0, 20], [27, 0], black$3.main, 0.05),
    inset: boxShadow([0, 1], [2, 0], black$3.main, 0.075, "inset"),
    colored: {
        primary: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.primary, 0.4)}`,
        secondary: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.secondary, 0.4)}`,
        info: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.info, 0.4)}`,
        success: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.success, 0.4)}`,
        warning: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.warning, 0.4)}`,
        error: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.error, 0.4)}`,
        light: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.light, 0.4)}`,
        dark: `${boxShadow([0, 4], [20, 0], black$3.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.dark, 0.4)}`,
    },
    navbarBoxShadow: `${boxShadow([0, 0], [1, 1], dark$6.main, 0.9, "inset")}, ${boxShadow([0, 20], [27, 0], black$3.main, 0.05)}`,
    sliderBoxShadow: {
        thumb: boxShadow([0, 1], [13, 0], black$3.main, 0.2),
    },
    tabsBoxShadow: {
        indicator: boxShadow([0, 1], [5, 1], tabs$1.indicator.boxShadow, 1),
    },
};

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
function rgba(color, opacity) {
    return `rgba(${hexToRgb$1(color)}, ${opacity})`;
}

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
const { white: white$h } = colors;
const borders = {
    borderColor: rgba(white$h.main, 0.4),
    borderWidth: {
        0: 0,
        1: pxToRem(1),
        2: pxToRem(2),
        3: pxToRem(3),
        4: pxToRem(4),
        5: pxToRem(5),
    },
    borderRadius: {
        xs: pxToRem(1.6),
        sm: pxToRem(2),
        md: pxToRem(6),
        lg: pxToRem(8),
        xl: pxToRem(12),
        xxl: pxToRem(16),
        section: pxToRem(160),
    },
};

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
const { info: info$a, dark: dark$5 } = colors;
const globals = {
    html: {
        scrollBehavior: "smooth",
    },
    "*, *::before, *::after": {
        margin: 0,
        padding: 0,
    },
    "a, a:link, a:visited": {
        textDecoration: "none !important",
    },
    "a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited": {
        color: `${dark$5.main} !important`,
        transition: "color 150ms ease-in !important",
    },
    "a.link:hover, .link:hover, a.link:focus, .link:focus": {
        color: `${info$a.main} !important`,
    },
};

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
function hexToRgb(color) {
    return chroma__default["default"](color).rgb().join(", ");
}

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
/**
  The linearGradient() function helps you to create a linear gradient color background
 */
function linearGradient(color, colorState, angle = 195) {
    return `linear-gradient(${angle}deg, ${color}, ${colorState})`;
}

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
const { background: background$5 } = colors;
const { borderRadius: borderRadius$i } = borders;
const sidenav = {
    styleOverrides: {
        root: {
            width: pxToRem(250),
            whiteSpace: "nowrap",
            border: "none",
        },
        paper: {
            width: pxToRem(250),
            backgroundColor: background$5.sidenav,
            height: `calc(100vh - ${pxToRem(32)})`,
            margin: pxToRem(16),
            borderRadius: borderRadius$i.xl,
            border: "none",
        },
        paperAnchorDockedLeft: {
            borderRight: "none",
        },
    },
};

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
const list = {
    styleOverrides: {
        padding: {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
};

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
const listItem = {
    defaultProps: {
        disableGutters: true,
    },
    styleOverrides: {
        root: {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
};

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
const listItemText = {
    styleOverrides: {
        root: {
            marginTop: 0,
            marginBottom: 0,
        },
    },
};

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
const { black: black$2, background: background$4 } = colors;
const { borderWidth: borderWidth$8, borderRadius: borderRadius$h } = borders;
const { md: md$6 } = boxShadows;
const card = {
    styleOverrides: {
        root: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minWidth: 0,
            wordWrap: "break-word",
            backgroundImage: "none",
            backgroundColor: background$4.card,
            backgroundClip: "border-box",
            border: `${borderWidth$8[0]} solid ${rgba(black$2.main, 0.125)}`,
            borderRadius: borderRadius$h.xl,
            boxShadow: md$6,
            overflow: "visible",
        },
    },
};

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
const { borderRadius: borderRadius$g } = borders;
const cardMedia = {
    styleOverrides: {
        root: {
            borderRadius: borderRadius$g.xl,
            margin: `${pxToRem(16)} ${pxToRem(16)} 0`,
        },
        media: {
            width: "auto",
        },
    },
};

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
const cardContent = {
    styleOverrides: {
        root: {
            marginTop: 0,
            marginBottom: 0,
            padding: `${pxToRem(8)} ${pxToRem(24)} ${pxToRem(24)}`,
        },
    },
};

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
const { fontWeightBold: fontWeightBold$1, size: size$h } = typography;
const { borderRadius: borderRadius$f } = borders;
const root = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: size$h.xs,
    fontWeight: fontWeightBold$1,
    borderRadius: borderRadius$f.lg,
    padding: `${pxToRem(6.302)} ${pxToRem(16.604)}`,
    lineHeight: 1.4,
    textAlign: "center",
    textTransform: "uppercase",
    userSelect: "none",
    backgroundSize: "150% !important",
    backgroundPositionX: "25% !important",
    transition: "all 150ms ease-in",
    "&:disabled": {
        pointerEvent: "none",
        opacity: 0.65,
    },
    "& .material-icons": {
        fontSize: pxToRem(15),
        marginTop: pxToRem(-2),
    },
};

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
const { white: white$g, text: text$5, info: info$9, secondary: secondary$2 } = colors;
const { size: size$g } = typography;
const contained = {
    base: {
        backgroundColor: white$g.main,
        minHeight: pxToRem(37),
        color: text$5.main,
        padding: `${pxToRem(9)} ${pxToRem(24)}`,
        "&:hover": {
            backgroundColor: white$g.main,
        },
        "&:active, &:active:focus, &:active:hover": {
            opacity: 0.85,
        },
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(16)} !important`,
        },
    },
    small: {
        minHeight: pxToRem(29),
        padding: `${pxToRem(6)} ${pxToRem(18)}`,
        fontSize: size$g.xs,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(12)} !important`,
        },
    },
    large: {
        minHeight: pxToRem(44),
        padding: `${pxToRem(12)} ${pxToRem(64)}`,
        fontSize: size$g.sm,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(22)} !important`,
        },
    },
    primary: {
        backgroundColor: info$9.main,
        "&:hover": {
            backgroundColor: info$9.main,
        },
        "&:focus:not(:hover)": {
            backgroundColor: info$9.focus,
        },
    },
    secondary: {
        backgroundColor: secondary$2.main,
        "&:hover": {
            backgroundColor: secondary$2.main,
        },
        "&:focus:not(:hover)": {
            backgroundColor: secondary$2.focus,
        },
    },
};

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
const { transparent: transparent$c, light: light$3, info: info$8, secondary: secondary$1 } = colors;
const { size: size$f } = typography;
const outlined = {
    base: {
        minHeight: pxToRem(39),
        color: light$3.main,
        borderColor: light$3.main,
        padding: `${pxToRem(9)} ${pxToRem(24)}`,
        "&:hover": {
            opacity: 0.75,
            backgroundColor: transparent$c.main,
        },
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(16)} !important`,
        },
    },
    small: {
        minHeight: pxToRem(31),
        padding: `${pxToRem(6)} ${pxToRem(18)}`,
        fontSize: size$f.xs,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(12)} !important`,
        },
    },
    large: {
        minHeight: pxToRem(46),
        padding: `${pxToRem(12)} ${pxToRem(64)}`,
        fontSize: size$f.sm,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(22)} !important`,
        },
    },
    primary: {
        backgroundColor: transparent$c.main,
        borderColor: info$8.main,
        "&:hover": {
            backgroundColor: transparent$c.main,
        },
    },
    secondary: {
        backgroundColor: transparent$c.main,
        borderColor: secondary$1.main,
        "&:hover": {
            backgroundColor: transparent$c.main,
        },
    },
};

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
const { text: text$4, info: info$7, secondary, transparent: transparent$b } = colors;
const { size: size$e } = typography;
const buttonText = {
    base: {
        backgroundColor: transparent$b.main,
        minHeight: pxToRem(37),
        color: text$4.main,
        boxShadow: "none",
        padding: `${pxToRem(9)} ${pxToRem(24)}`,
        "&:hover": {
            backgroundColor: transparent$b.main,
            boxShadow: "none",
        },
        "&:focus": {
            boxShadow: "none",
        },
        "&:active, &:active:focus, &:active:hover": {
            opacity: 0.85,
            boxShadow: "none",
        },
        "&:disabled": {
            boxShadow: "none",
        },
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(16)} !important`,
        },
    },
    small: {
        minHeight: pxToRem(29),
        padding: `${pxToRem(6)} ${pxToRem(18)}`,
        fontSize: size$e.xs,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(12)} !important`,
        },
    },
    large: {
        minHeight: pxToRem(44),
        padding: `${pxToRem(12)} ${pxToRem(64)}`,
        fontSize: size$e.sm,
        "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem(22)} !important`,
        },
    },
    primary: {
        color: info$7.main,
        "&:hover": {
            color: info$7.main,
        },
        "&:focus:not(:hover)": {
            color: info$7.focus,
            boxShadow: "none",
        },
    },
    secondary: {
        color: secondary.main,
        "&:hover": {
            color: secondary.main,
        },
        "&:focus:not(:hover)": {
            color: secondary.focus,
            boxShadow: "none",
        },
    },
};

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
const button = {
    defaultProps: {
        disableRipple: false,
    },
    styleOverrides: {
        root: { ...root },
        contained: { ...contained.base },
        containedSizeSmall: { ...contained.small },
        containedSizeLarge: { ...contained.large },
        containedPrimary: { ...contained.primary },
        containedSecondary: { ...contained.secondary },
        outlined: { ...outlined.base },
        outlinedSizeSmall: { ...outlined.small },
        outlinedSizeLarge: { ...outlined.large },
        outlinedPrimary: { ...outlined.primary },
        outlinedSecondary: { ...outlined.secondary },
        text: { ...buttonText.base },
        textSizeSmall: { ...buttonText.small },
        textSizeLarge: { ...buttonText.large },
        textPrimary: { ...buttonText.primary },
        textSecondary: { ...buttonText.secondary },
    },
};

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
const { transparent: transparent$a } = colors;
const iconButton = {
    styleOverrides: {
        root: {
            "&:hover": {
                backgroundColor: transparent$a.main,
            },
        },
    },
};

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
const { info: info$6, inputBorderColor: inputBorderColor$1, dark: dark$4, grey: grey$4, white: white$f } = colors;
const { size: size$d } = typography;
const { borderWidth: borderWidth$7 } = borders;
const input = {
    styleOverrides: {
        root: {
            fontSize: size$d.sm,
            color: dark$4.main,
            "&:hover:not(.Mui-disabled):before": {
                borderBottom: `${borderWidth$7[1]} solid ${rgba(inputBorderColor$1, 0.6)}`,
            },
            "&:before": {
                borderColor: rgba(inputBorderColor$1, 0.6),
            },
            "&:after": {
                borderColor: info$6.main,
            },
            input: {
                color: white$f.main,
                "&::-webkit-input-placeholder": {
                    color: grey$4[100],
                },
            },
        },
    },
};

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
const { text: text$3, info: info$5 } = colors;
const { size: size$c } = typography;
const inputLabel = {
    styleOverrides: {
        root: {
            fontSize: size$c.sm,
            color: text$3.main,
            lineHeight: 0.9,
            "&.Mui-focused": {
                color: info$5.main,
            },
            "&.MuiInputLabel-shrink": {
                lineHeight: 1.5,
                fontSize: size$c.md,
                "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
                    fontSize: "0.85em",
                },
            },
        },
        sizeSmall: {
            fontSize: size$c.xs,
            lineHeight: 1.625,
            "&.MuiInputLabel-shrink": {
                lineHeight: 1.6,
                fontSize: size$c.sm,
                "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
                    fontSize: "0.72em",
                },
            },
        },
    },
};

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
const { inputBorderColor, info: info$4, grey: grey$3, transparent: transparent$9, white: white$e } = colors;
const { borderRadius: borderRadius$e } = borders;
const { size: size$b } = typography;
const inputOutlined = {
    styleOverrides: {
        root: {
            backgroundColor: transparent$9.main,
            fontSize: size$b.sm,
            borderRadius: borderRadius$e.md,
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: rgba(inputBorderColor, 0.6),
            },
            "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: info$4.main,
                },
            },
        },
        notchedOutline: {
            borderColor: rgba(inputBorderColor, 0.6),
        },
        input: {
            color: white$e.main,
            padding: pxToRem(12),
            backgroundColor: transparent$9.main,
            "&::-webkit-input-placeholder": {
                color: grey$3[100],
            },
        },
        inputSizeSmall: {
            fontSize: size$b.xs,
            padding: pxToRem(10),
        },
        multiline: {
            color: grey$3[700],
            padding: 0,
        },
    },
};

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
const { transparent: transparent$8 } = colors;
const textField = {
    styleOverrides: {
        root: {
            backgroundColor: transparent$8.main,
        },
    },
};

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
const { md: md$5 } = boxShadows;
const { size: size$a } = typography;
const { text: text$2, background: background$3 } = colors;
const { borderRadius: borderRadius$d } = borders;
const menu = {
    defaultProps: {
        disableAutoFocusItem: true,
    },
    styleOverrides: {
        paper: {
            minWidth: pxToRem(160),
            boxShadow: md$5,
            padding: `${pxToRem(16)} ${pxToRem(8)}`,
            fontSize: size$a.sm,
            color: text$2.main,
            textAlign: "left",
            backgroundColor: `${background$3.card} !important`,
            borderRadius: borderRadius$d.md,
        },
    },
};

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
const { dark: dark$3, white: white$d } = colors;
const { borderRadius: borderRadius$c } = borders;
const { size: size$9 } = typography;
const menuItem$1 = {
    styleOverrides: {
        root: {
            minWidth: pxToRem(160),
            minHeight: "unset",
            padding: `${pxToRem(4.8)} ${pxToRem(16)}`,
            borderRadius: borderRadius$c.md,
            fontSize: size$9.sm,
            color: rgba(white$d.main, 0.8),
            transition: "background-color 300ms ease, color 300ms ease",
            "&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus": {
                backgroundColor: dark$3.main,
                color: white$d.main,
            },
        },
    },
};

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
const { white: white$c, gradients: gradients$4, grey: grey$2, transparent: transparent$7 } = colors;
const { borderWidth: borderWidth$6 } = borders;
const { md: md$4 } = boxShadows;
const switchButton = {
    defaultProps: {
        disableRipple: false,
    },
    styleOverrides: {
        switchBase: {
            color: gradients$4.dark.main,
            "&:hover": {
                backgroundColor: transparent$7.main,
            },
            "&.Mui-checked": {
                color: gradients$4.dark.main,
                "&:hover": {
                    backgroundColor: transparent$7.main,
                },
                "& .MuiSwitch-thumb": {
                    borderColor: `${gradients$4.dark.main} !important`,
                },
                "& + .MuiSwitch-track": {
                    backgroundColor: `${gradients$4.dark.main} !important`,
                    borderColor: `${gradients$4.dark.main} !important`,
                    opacity: 1,
                },
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: "0.3 !important",
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
                backgroundImage: linearGradient(gradients$4.info.main, gradients$4.info.state),
            },
        },
        thumb: {
            backgroundColor: white$c.main,
            boxShadow: md$4,
            border: `${borderWidth$6[1]} solid ${grey$2[400]}`,
        },
        track: {
            width: pxToRem(32),
            height: pxToRem(15),
            backgroundColor: grey$2[400],
            border: `${borderWidth$6[1]} solid ${grey$2[400]}`,
            opacity: 1,
        },
        checked: {},
    },
};

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
const { dark: dark$2, transparent: transparent$6, white: white$b } = colors;
const divider = {
    styleOverrides: {
        root: {
            backgroundColor: transparent$6.main,
            backgroundImage: `linear-gradient(to right, ${rgba(dark$2.main, 0)}, ${white$b.main}, ${rgba(dark$2.main, 0)}) !important`,
            height: pxToRem(1),
            margin: `${pxToRem(16)} 0`,
            borderBottom: "none",
            opacity: 0.25,
        },
        vertical: {
            backgroundColor: transparent$6.main,
            backgroundImage: `linear-gradient(to bottom, ${rgba(dark$2.main, 0)}, ${white$b.main}, ${rgba(dark$2.main, 0)}) !important`,
            width: pxToRem(1),
            height: "100%",
            margin: `0 ${pxToRem(16)}`,
            borderRight: "none",
        },
        light: {
            backgroundColor: transparent$6.main,
            backgroundImage: `linear-gradient(to right, ${rgba(white$b.main, 0)}, ${rgba(dark$2.main, 0.4)}, ${rgba(white$b.main, 0)}) !important`,
            "&.MuiDivider-vertical": {
                backgroundImage: `linear-gradient(to bottom, ${rgba(white$b.main, 0)}, ${rgba(dark$2.main, 0.4)}, ${rgba(white$b.main, 0)}) !important`,
            },
        },
    },
};

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
const { background: background$2 } = colors;
const { md: md$3 } = boxShadows;
const { borderRadius: borderRadius$b } = borders;
const tableContainer = {
    styleOverrides: {
        root: {
            backgroundColor: background$2.card,
            boxShadow: md$3,
            borderRadius: borderRadius$b.xl,
        },
    },
};

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
const { borderRadius: borderRadius$a } = borders;
const tableHead = {
    styleOverrides: {
        root: {
            display: "block",
            padding: `${pxToRem(16)} ${pxToRem(16)} 0  ${pxToRem(16)}`,
            borderRadius: `${borderRadius$a.xl} ${borderRadius$a.xl} 0 0`,
        },
    },
};

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
const { borderWidth: borderWidth$5 } = borders;
const { light: light$2 } = colors;
const tableCell = {
    styleOverrides: {
        root: {
            padding: `${pxToRem(12)} ${pxToRem(16)}`,
            borderBottom: `${borderWidth$5[1]} solid ${light$2.main}`,
        },
    },
};

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
const { borderRadius: borderRadius$9 } = borders;
const { light: light$1 } = colors;
const linearProgress = {
    styleOverrides: {
        root: {
            height: pxToRem(6),
            borderRadius: borderRadius$9.md,
            overflow: "visible",
            position: "relative",
        },
        colorPrimary: {
            backgroundColor: light$1.main,
        },
        colorSecondary: {
            backgroundColor: light$1.main,
        },
        bar: {
            height: pxToRem(6),
            borderRadius: borderRadius$9.sm,
            position: "absolute",
            transform: `translate(0, 0) !important`,
            transition: "width 0.6s ease !important",
        },
    },
};

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
const { grey: grey$1 } = colors;
const { size: size$8 } = typography;
const breadcrumbs = {
    styleOverrides: {
        li: {
            lineHeight: 0,
        },
        separator: {
            fontSize: size$8.sm,
            color: grey$1[600],
        },
    },
};

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
const { grey, white: white$a, black: black$1, info: info$3 } = colors$1;
const { borderRadius: borderRadius$8, borderWidth: borderWidth$4 } = borders$1;
const { sliderBoxShadow } = boxShadows$1;
const slider = {
    styleOverrides: {
        root: {
            width: "100%",
            "& .MuiSlider-active, & .Mui-focusVisible": {
                boxShadow: "none !important",
            },
            "& .MuiSlider-valueLabel": {
                color: black$1.main,
            },
        },
        rail: {
            height: pxToRem$1(2),
            background: grey[200],
            borderRadius: borderRadius$8.sm,
            opacity: 1,
        },
        track: {
            background: info$3.main,
            height: pxToRem$1(2),
            position: "relative",
            border: "none",
            borderRadius: borderRadius$8.lg,
            zIndex: 1,
        },
        thumb: {
            width: pxToRem$1(14),
            height: pxToRem$1(14),
            backgroundColor: white$a.main,
            zIndex: 10,
            boxShadow: sliderBoxShadow.thumb,
            border: `${borderWidth$4[1]} solid ${info$3.main}`,
            transition: "all 200ms linear",
            "&:hover": {
                boxShadow: "none",
            },
            "&:active": {
                transform: "translate(-50%, -50%) scale(1.4)",
            },
            "&.Mui-active": { boxShadow: boxShadow$1([0, 0], [0, 14], info$3.main, 0.16) },
        },
    },
};

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
const { borderRadius: borderRadius$7 } = borders;
const avatar = {
    styleOverrides: {
        root: {
            transition: "all 200ms ease-in-out",
        },
        rounded: {
            borderRadius: borderRadius$7.lg,
        },
        img: {
            height: "auto",
        },
    },
};

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
const { black, white: white$9 } = colors;
const { size: size$7, fontWeightRegular: fontWeightRegular$2 } = typography;
const { borderRadius: borderRadius$6 } = borders;
const tooltip = {
    defaultProps: {
        arrow: true,
        TransitionComponent: Fade__default["default"],
    },
    styleOverrides: {
        tooltip: {
            maxWidth: pxToRem(200),
            backgroundColor: black.main,
            color: white$9.main,
            fontSize: size$7.sm,
            fontWeight: fontWeightRegular$2,
            textAlign: "center",
            borderRadius: borderRadius$6.md,
            opacity: 0.7,
            padding: `${pxToRem(5)} ${pxToRem(8)} ${pxToRem(4)}`,
        },
        arrow: {
            color: black.main,
        },
    },
};

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
const appBar = {
    defaultProps: {
        color: "transparent",
    },
    styleOverrides: {
        root: {
            boxShadow: "none",
        },
    },
};

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
const { background: background$1 } = colors;
const { borderRadius: borderRadius$5 } = borders;
const { md: md$2 } = boxShadows;
const tabs = {
    styleOverrides: {
        root: {
            position: "relative",
            backgroundColor: background$1.card,
            borderRadius: borderRadius$5.xl,
            minHeight: "unset",
            padding: pxToRem(4),
        },
        flexContainer: {
            height: "100%",
            position: "relative",
            zIndex: 10,
        },
        fixed: {
            overflow: "unset !important",
            overflowX: "unset !important",
        },
        vertical: {
            "& .MuiTabs-indicator": {
                width: "100%",
            },
        },
        indicator: {
            height: "100%",
            borderRadius: borderRadius$5.lg,
            backgroundColor: background$1.default,
            boxShadow: md$2,
            transition: "all 500ms ease",
        },
    },
};

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
const { size: size$6, fontWeightRegular: fontWeightRegular$1 } = typography;
const { borderRadius: borderRadius$4 } = borders;
const { white: white$8 } = colors;
const tab = {
    styleOverrides: {
        root: {
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            flex: "1 1 auto",
            textAlign: "center",
            maxWidth: "unset !important",
            minWidth: "unset !important",
            minHeight: "unset !important",
            fontSize: size$6.md,
            fontWeight: fontWeightRegular$1,
            textTransform: "none",
            lineHeight: "inherit",
            padding: pxToRem(4),
            borderRadius: borderRadius$4.lg,
            color: `${white$8.main} !important`,
            opacity: "1 !important",
            "& .material-icons, .material-icons-round": {
                marginBottom: "0 !important",
                marginRight: pxToRem(6),
            },
            "& svg": {
                marginBottom: "0 !important",
                marginRight: pxToRem(6),
            },
        },
        labelIcon: {
            paddingTop: pxToRem(4),
        },
    },
};

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
const { transparent: transparent$5, gradients: gradients$3 } = colors;
const { borderRadius: borderRadius$3 } = borders;
const { colored } = boxShadows;
const stepper = {
    styleOverrides: {
        root: {
            background: linearGradient(gradients$3.info.main, gradients$3.info.state),
            padding: `${pxToRem(24)} 0 ${pxToRem(16)}`,
            borderRadius: borderRadius$3.lg,
            boxShadow: colored.info,
            "&.MuiPaper-root": {
                backgroundColor: transparent$5.main,
            },
        },
    },
};

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
const step = {
    styleOverrides: {
        root: {
            padding: `0 ${pxToRem(6)}`,
        },
    },
};

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
const { white: white$7 } = colors;
const { borderWidth: borderWidth$3 } = borders;
const stepConnector = {
    styleOverrides: {
        root: {
            color: "#9fc9ff",
            transition: "all 200ms linear",
            "&.Mui-active": {
                color: white$7.main,
            },
            "&.Mui-completed": {
                color: white$7.main,
            },
        },
        alternativeLabel: {
            top: "14%",
            left: "-50%",
            right: "50%",
        },
        line: {
            borderWidth: `${borderWidth$3[2]} !important`,
            borderColor: "currentColor",
            opacity: 0.5,
        },
    },
};

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
const { size: size$5, fontWeightRegular } = typography;
const { white: white$6 } = colors;
const stepLabel = {
    styleOverrides: {
        label: {
            marginTop: `${pxToRem(8)} !important`,
            fontWeight: fontWeightRegular,
            fontSize: size$5.xs,
            color: "#9fc9ff",
            textTransform: "uppercase",
            "&.Mui-active": {
                fontWeight: `${fontWeightRegular} !important`,
                color: `${rgba(white$6.main, 0.8)} !important`,
            },
            "&.Mui-completed": {
                fontWeight: `${fontWeightRegular} !important`,
                color: `${rgba(white$6.main, 0.8)} !important`,
            },
        },
    },
};

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
const { white: white$5 } = colors;
const stepIcon = {
    styleOverrides: {
        root: {
            background: "#9fc9ff",
            fill: "#9fc9ff",
            stroke: "#9fc9ff",
            strokeWidth: pxToRem(10),
            width: pxToRem(13),
            height: pxToRem(13),
            borderRadius: "50%",
            zIndex: 99,
            transition: "all 200ms linear",
            "&.Mui-active": {
                background: white$5.main,
                fill: white$5.main,
                stroke: white$5.main,
                borderColor: white$5.main,
                boxShadow: boxShadow([0, 0], [0, 2], white$5.main, 1),
            },
            "&.Mui-completed": {
                background: white$5.main,
                fill: white$5.main,
                stroke: white$5.main,
                borderColor: white$5.main,
                boxShadow: boxShadow([0, 0], [0, 2], white$5.main, 1),
            },
        },
    },
};

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
const { transparent: transparent$4 } = colors;
const select = {
    styleOverrides: {
        select: {
            display: "grid",
            alignItems: "center",
            padding: `0 ${pxToRem(12)} !important`,
            "& .Mui-selected": {
                backgroundColor: transparent$4.main,
            },
        },
        selectMenu: {
            background: "none",
            height: "none",
            minHeight: "none",
            overflow: "unset",
        },
        icon: {
            display: "none",
        },
    },
};

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
const { white: white$4 } = colors;
const { size: size$4, fontWeightBold } = typography;
const formControlLabel = {
    styleOverrides: {
        root: {
            display: "block",
            minHeight: pxToRem(24),
            marginBottom: pxToRem(2),
        },
        label: {
            display: "inline-block",
            fontSize: size$4.sm,
            fontWeight: fontWeightBold,
            color: white$4.main,
            lineHeight: 1,
            transform: `translateY(${pxToRem(1)})`,
            marginLeft: pxToRem(4),
            "&.Mui-disabled": {
                color: white$4.main,
            },
        },
    },
};

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
const { text: text$1 } = colors;
const formLabel = {
    styleOverrides: {
        root: {
            color: text$1.main,
        },
    },
};

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
const { borderWidth: borderWidth$2, borderColor: borderColor$2 } = borders;
const { transparent: transparent$3, info: info$2 } = colors;
const checkbox = {
    styleOverrides: {
        root: {
            "& .MuiSvgIcon-root": {
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: pxToRem(20),
                height: pxToRem(20),
                color: transparent$3.main,
                border: `${borderWidth$2[1]} solid ${borderColor$2}`,
                borderRadius: pxToRem(5.6),
            },
            "&:hover": {
                backgroundColor: transparent$3.main,
            },
            "&.Mui-focusVisible": {
                border: `${borderWidth$2[2]} solid ${info$2.main} !important`,
            },
        },
        colorPrimary: {
            color: borderColor$2,
            "&.Mui-checked": {
                color: info$2.main,
                "& .MuiSvgIcon-root": {
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${linearGradient(info$2.main, info$2.main)}`,
                    borderColor: info$2.main,
                },
            },
        },
        colorSecondary: {
            color: borderColor$2,
            "& .MuiSvgIcon-root": {
                color: info$2.main,
                "&.Mui-checked": {
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${linearGradient(info$2.main, info$2.main)}`,
                    borderColor: info$2.main,
                },
            },
        },
    },
};

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
const { borderWidth: borderWidth$1, borderColor: borderColor$1 } = borders;
const { transparent: transparent$2, info: info$1 } = colors;
const radio = {
    styleOverrides: {
        root: {
            "& .MuiSvgIcon-root": {
                width: pxToRem(20),
                height: pxToRem(20),
                color: transparent$2.main,
                border: `${borderWidth$1[1]} solid ${borderColor$1}`,
                borderRadius: "50%",
            },
            "&:after": {
                transition: "opacity 250ms ease-in-out",
                content: `""`,
                position: "absolute",
                width: pxToRem(14),
                height: pxToRem(14),
                borderRadius: "50%",
                backgroundImage: linearGradient(info$1.main, info$1.main),
                opacity: 0,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: "auto",
            },
            "&:hover": {
                backgroundColor: transparent$2.main,
            },
            "&.Mui-focusVisible": {
                border: `${borderWidth$1[2]} solid ${info$1.main} !important`,
            },
        },
        colorPrimary: {
            color: borderColor$1,
            "&.Mui-checked": {
                color: info$1.main,
                "& .MuiSvgIcon-root": {
                    borderColor: info$1.main,
                },
                "&:after": {
                    opacity: 1,
                },
            },
        },
        colorSecondary: {
            color: borderColor$1,
            "&.Mui-checked": {
                color: info$1.main,
                "& .MuiSvgIcon-root": {
                    borderColor: info$1.main,
                },
                "&:after": {
                    opacity: 1,
                },
            },
        },
    },
};

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
const { md: md$1 } = boxShadows;
const { size: size$3 } = typography;
const { text, transparent: transparent$1, light, dark: dark$1, gradients: gradients$2, background, white: white$3 } = colors;
const { borderRadius: borderRadius$2 } = borders;
const autocompletle = {
    styleOverrides: {
        popper: {
            boxShadow: md$1,
            padding: pxToRem(8),
            fontSize: size$3.sm,
            color: text.main,
            textAlign: "left",
            backgroundColor: `${background.card} !important`,
            borderRadius: borderRadius$2.md,
        },
        paper: {
            boxShadow: "none",
            backgroundColor: transparent$1.main,
        },
        option: {
            padding: `${pxToRem(4.8)} ${pxToRem(16)}`,
            borderRadius: borderRadius$2.md,
            fontSize: size$3.sm,
            color: text.main,
            transition: "background-color 300ms ease, color 300ms ease",
            "&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus": {
                backgroundColor: rgba(light.main, 0.2),
                color: white$3.main,
            },
            '&[aria-selected="true"]': {
                backgroundColor: `${rgba(light.main, 0.2)} !important`,
                color: `${white$3.main} !important`,
            },
        },
        noOptions: {
            fontSize: size$3.sm,
            color: text.main,
        },
        groupLabel: {
            color: dark$1.main,
        },
        loading: {
            fontSize: size$3.sm,
            color: text.main,
        },
        tag: {
            display: "flex",
            alignItems: "center",
            height: "auto",
            padding: pxToRem(4),
            backgroundColor: gradients$2.dark.state,
            color: white$3.main,
            "& .MuiChip-label": {
                lineHeight: 1.2,
                padding: `0 ${pxToRem(10)} 0 ${pxToRem(4)}`,
            },
            "& .MuiSvgIcon-root, & .MuiSvgIcon-root:hover, & .MuiSvgIcon-root:focus": {
                color: white$3.main,
                marginRight: 0,
            },
        },
        popupIndicator: {
            color: text.main,
        },
        clearIndicator: {
            color: text.main,
        },
    },
};

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
const { info, white: white$2, gradients: gradients$1 } = colors;
const flatpickr = {
    ".flatpickr-day:hover, .flatpickr-day:focus, .flatpickr-day.nextMonthDay:hover, .flatpickr-day.nextMonthDay:focus": {
        background: rgba(info.main, 0.28),
        border: "none",
    },
    ".flatpickr-day.today": {
        background: info.main,
        color: white$2.main,
        border: "none",
        "&:hover, &:focus": {
            background: `${info.focus} !important`,
        },
    },
    ".flatpickr-day.selected, .flatpickr-day.selected:hover, .flatpickr-day.nextMonthDay.selected, .flatpickr-day.nextMonthDay.selected:hover, .flatpickr-day.nextMonthDay.selected:focus": {
        background: `${gradients$1.info.state} !important`,
        color: white$2.main,
        border: "none",
    },
    ".flatpickr-months .flatpickr-next-month:hover svg, .flatpickr-months .flatpickr-prev-month:hover svg": {
        color: `${info.main} !important`,
        fill: `${info.main} !important`,
    },
};

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
const { values: { sm, md, lg: lg$1, xl, xxl: xxl$1 }, } = breakpoints;
const SM = `@media (min-width: ${sm}px)`;
const MD = `@media (min-width: ${md}px)`;
const LG = `@media (min-width: ${lg$1}px)`;
const XL = `@media (min-width: ${xl}px)`;
const XXL = `@media (min-width: ${xxl$1}px)`;
const sharedClasses = {
    paddingRight: `${pxToRem(24)} !important`,
    paddingLeft: `${pxToRem(24)} !important`,
    marginRight: "auto !important",
    marginLeft: "auto !important",
    width: "100% !important",
    position: "relative",
};
const container = {
    [SM]: {
        ".MuiContainer-root": {
            ...sharedClasses,
            maxWidth: "540px !important",
        },
    },
    [MD]: {
        ".MuiContainer-root": {
            ...sharedClasses,
            maxWidth: "720px !important",
        },
    },
    [LG]: {
        ".MuiContainer-root": {
            ...sharedClasses,
            maxWidth: "960px !important",
        },
    },
    [XL]: {
        ".MuiContainer-root": {
            ...sharedClasses,
            maxWidth: "1140px !important",
        },
    },
    [XXL]: {
        ".MuiContainer-root": {
            ...sharedClasses,
            maxWidth: "1320px !important",
        },
    },
};

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
const { transparent } = colors;
const { lg } = boxShadows;
const { borderRadius: borderRadius$1 } = borders;
const popover = {
    styleOverrides: {
        paper: {
            backgroundColor: transparent.main,
            boxShadow: lg,
            borderRadius: borderRadius$1.md,
        },
    },
};

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
const buttonBase = {
    defaultProps: {
        disableRipple: false,
    },
};

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
const icon = {
    defaultProps: {
        baseClassName: "material-icons-round",
        fontSize: "inherit",
    },
    styleOverrides: {
        fontSizeInherit: {
            fontSize: "inherit !important",
        },
        fontSizeSmall: {
            fontSize: `${pxToRem(20)} !important`,
        },
        fontSizeLarge: {
            fontSize: `${pxToRem(36)} !important`,
        },
    },
};

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
const svgIcon = {
    defaultProps: {
        fontSize: "inherit",
    },
    styleOverrides: {
        fontSizeInherit: {
            fontSize: "inherit !important",
        },
        fontSizeSmall: {
            fontSize: `${pxToRem(20)} !important`,
        },
        fontSizeLarge: {
            fontSize: `${pxToRem(36)} !important`,
        },
    },
};

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
const link = {
    defaultProps: {
        underline: "none",
        color: "inherit",
    },
};

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
const { borderRadius } = borders;
const { xxl } = boxShadows;
const dialog = {
    styleOverrides: {
        paper: {
            borderRadius: borderRadius.lg,
            boxShadow: xxl,
        },
        paperFullScreen: {
            borderRadius: 0,
        },
    },
};

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
const { size: size$2 } = typography;
const dialogTitle = {
    styleOverrides: {
        root: {
            padding: pxToRem(16),
            fontSize: size$2.xl,
        },
    },
};

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
const { size: size$1 } = typography;
const { white: white$1 } = colors;
const { borderWidth, borderColor } = borders;
const dialogContent = {
    styleOverrides: {
        root: {
            padding: pxToRem(16),
            fontSize: size$1.md,
            color: rgba(white$1.main, 0.8),
        },
        dividers: {
            borderTop: `${borderWidth[1]} solid ${rgba(borderColor, 0.6)}`,
            borderBottom: `${borderWidth[1]} solid ${rgba(borderColor, 0.6)}`,
        },
    },
};

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
const { size } = typography;
const { white } = colors;
const dialogContentText = {
    styleOverrides: {
        root: {
            fontSize: size.md,
            color: rgba(white.main, 0.8),
        },
    },
};

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
const dialogActions = {
    styleOverrides: {
        root: {
            padding: pxToRem(16),
        },
    },
};

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
var themeDark = styles.createTheme({
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
        MuiMenuItem: { ...menuItem$1 },
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
        MuiAutocomplete: { ...autocompletle },
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
var themeDarkRTL = styles.createTheme({
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
        MuiMenuItem: { ...menuItem$1 },
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
        MuiAutocomplete: { ...autocompletle },
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

function DashboardLayout({ children }) {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav } = controller;
    const { pathname } = reactRouterDom.useLocation();
    react.useEffect(() => {
        setLayout(dispatch, "dashboard");
    }, [pathname]);
    return (jsxRuntime.jsx(MDBox, { sx: ({ breakpoints, transitions, functions: { pxToRem } }) => ({
            p: 3,
            position: "relative",
            [breakpoints.up("xl")]: {
                marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
                transition: transitions.create(["margin-left", "margin-right"], {
                    easing: transitions.easing.easeInOut,
                    duration: transitions.duration.standard,
                }),
            },
        }), children: children }));
}

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
var MDInputRoot = styles.styled(TextField__default["default"])(({ theme, ownerState }) => {
    const { palette, functions } = theme;
    const { error, success, disabled } = ownerState;
    const { grey, transparent, error: colorError, success: colorSuccess } = palette;
    const { pxToRem } = functions;
    // styles for the input with error={true}
    const errorStyles = () => ({
        backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23F44335' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23F44335' stroke='none'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: `right ${pxToRem(12)} center`,
        backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,
        "& .Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline, &:after": {
                borderColor: colorError.main,
            },
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: colorError.main,
        },
    });
    // styles for the input with success={true}
    const successStyles = () => ({
        backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8'%3E%3Cpath fill='%234CAF50' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: `right ${pxToRem(12)} center`,
        backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,
        "& .Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline, &:after": {
                borderColor: colorSuccess.main,
            },
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: colorSuccess.main,
        },
    });
    return {
        backgroundColor: disabled ? `${grey[200]} !important` : transparent.main,
        pointerEvents: disabled ? "none" : "auto",
        ...(error && errorStyles()),
        ...(success && successStyles()),
    };
});

const MDInput = react.forwardRef(({ error, success, disabled, ...rest }, ref) => (jsxRuntime.jsx(MDInputRoot, { ...rest, ref: ref, ownerState: { error, success, disabled } })));
// Declaring default props for MDInput
MDInput.defaultProps = {
    error: false,
    success: false,
    disabled: false,
};

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
var MDBadgeRoot = styles.styled(Badge__default["default"])(({ theme, ownerState }) => {
    const { palette, typography, borders, functions } = theme;
    const { color, circular, border, size, indicator, variant, container, children } = ownerState;
    const { white, dark, gradients, badgeColors } = palette;
    const { size: fontSize, fontWeightBold } = typography;
    const { borderRadius, borderWidth } = borders;
    const { pxToRem, linearGradient } = functions;
    // padding values
    const paddings = {
        xs: "0.45em 0.775em",
        sm: "0.55em 0.9em",
        md: "0.65em 1em",
        lg: "0.85em 1.375em",
    };
    // fontSize value
    const fontSizeValue = size === "xs" ? fontSize.xxs : fontSize.xs;
    // border value
    const borderValue = border ? `${borderWidth[3]} solid ${white.main}` : "none";
    // borderRadius value
    const borderRadiusValue = circular ? borderRadius.section : borderRadius.md;
    // styles for the badge with indicator={true}
    const indicatorStyles = (sizeProp) => {
        let widthValue = pxToRem(20);
        let heightValue = pxToRem(20);
        if (sizeProp === "medium") {
            widthValue = pxToRem(24);
            heightValue = pxToRem(24);
        }
        else if (sizeProp === "large") {
            widthValue = pxToRem(32);
            heightValue = pxToRem(32);
        }
        return {
            width: widthValue,
            height: heightValue,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            borderRadius: "50%",
            padding: 0,
            border: borderValue,
        };
    };
    // styles for the badge with variant="gradient"
    const gradientStyles = (colorProp) => {
        const backgroundValue = gradients[colorProp]
            ? linearGradient(gradients[colorProp].main, gradients[colorProp].state)
            : linearGradient(gradients.info.main, gradients.info.state);
        const colorValue = colorProp === "light" ? dark.main : white.main;
        return {
            background: backgroundValue,
            color: colorValue,
        };
    };
    // styles for the badge with variant="contained"
    const containedStyles = (colorProp) => {
        const backgroundValue = badgeColors[colorProp]
            ? badgeColors[colorProp].background
            : badgeColors.info.background;
        let colorValue = badgeColors[colorProp] ? badgeColors[colorProp].text : badgeColors.info.text;
        if (colorProp === "light") {
            colorValue = dark.main;
        }
        return {
            background: backgroundValue,
            color: colorValue,
        };
    };
    // styles for the badge with no children and container={false}
    const standAloneStyles = () => ({
        position: "static",
        marginLeft: pxToRem(8),
        transform: "none",
        fontSize: pxToRem(9),
    });
    // styles for the badge with container={true}
    const containerStyles = () => ({
        position: "relative",
        transform: "none",
    });
    return {
        "& .MuiBadge-badge": {
            height: "auto",
            padding: paddings[size] || paddings.xs,
            fontSize: fontSizeValue,
            fontWeight: fontWeightBold,
            textTransform: "uppercase",
            lineHeight: 1,
            textAlign: "center",
            whiteSpace: "nowrap",
            verticalAlign: "baseline",
            border: borderValue,
            borderRadius: borderRadiusValue,
            ...(indicator && indicatorStyles(size)),
            ...(variant === "gradient" && gradientStyles(color)),
            ...(variant === "contained" && containedStyles(color)),
            ...(!children && !container && standAloneStyles()),
            ...(container && containerStyles()),
        },
    };
});

const MDBadge = react.forwardRef(({ color, variant, size, circular, indicator, border, container, children, ...rest }, ref) => (jsxRuntime.jsx(MDBadgeRoot, { ...rest, ownerState: { color, variant, size, circular, indicator, border, container, children }, ref: ref, color: "default", children: children })));
// declaring default props for MDBadge
MDBadge.defaultProps = {
    color: "info",
    variant: "gradient",
    size: "sm",
    circular: false,
    indicator: false,
    border: false,
    container: false,
    children: false,
};

function Breadcrumbs({ icon, title, route, light }) {
    const routes = route.slice(0, -1);
    return (jsxRuntime.jsxs(MDBox, { mr: { xs: 0, xl: 8 }, children: [jsxRuntime.jsxs(material.Breadcrumbs, { sx: {
                    "& .MuiBreadcrumbs-separator": {
                        color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
                    },
                }, children: [jsxRuntime.jsx(reactRouterDom.Link, { to: "/", children: jsxRuntime.jsx(MDTypography, { component: "span", variant: "body2", color: light ? "white" : "dark", opacity: light ? 0.8 : 0.5, sx: { lineHeight: 0 }, children: jsxRuntime.jsx(Icon__default["default"], { children: icon }) }) }), routes.map((el) => (jsxRuntime.jsx(reactRouterDom.Link, { to: `/${el}`, children: jsxRuntime.jsx(MDTypography, { component: "span", variant: "button", fontWeight: "regular", textTransform: "capitalize", color: light ? "white" : "dark", opacity: light ? 0.8 : 0.5, sx: { lineHeight: 0 }, children: el }) }, el))), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", textTransform: "capitalize", color: light ? "white" : "dark", sx: { lineHeight: 0 }, children: title.replace("-", " ") })] }), jsxRuntime.jsx(MDTypography, { fontWeight: "bold", textTransform: "capitalize", variant: "h6", color: light ? "white" : "dark", noWrap: true, children: title.replace("-", " ") })] }));
}
// Declaring default props for Breadcrumbs
Breadcrumbs.defaultProps = {
    light: false,
};

function menuItem(theme) {
    const { palette, borders, transitions } = theme;
    const { secondary, light, dark } = palette;
    const { borderRadius } = borders;
    return {
        display: "flex",
        alignItems: "center",
        width: "100%",
        color: secondary.main,
        borderRadius: borderRadius.md,
        transition: transitions.create("background-color", {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
        }),
        "& *": {
            transition: "color 100ms linear",
        },
        "&:not(:last-child)": {
            mb: 1,
        },
        "&:hover": {
            backgroundColor: light.main,
            "& *": {
                color: dark.main,
            },
        },
    };
}

const NotificationItem = react.forwardRef(({ icon, title, ...rest }, ref) => (jsxRuntime.jsx(MenuItem__default["default"], { ...rest, ref: ref, sx: (theme) => menuItem(theme), children: jsxRuntime.jsxs(MDBox, { component: Link__default["default"], py: 0.5, display: "flex", alignItems: "center", lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "body1", color: "secondary", lineHeight: 0.75, children: icon }), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", sx: { ml: 1 }, children: title })] }) })));

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
function navbar(theme, ownerState) {
    const { palette, boxShadows, functions, transitions, breakpoints, borders } = theme;
    const { transparentNavbar, absolute, light, darkMode } = ownerState;
    const { dark, white, text, transparent, background } = palette;
    const { navbarBoxShadow } = boxShadows;
    const { rgba, pxToRem } = functions;
    const { borderRadius } = borders;
    return {
        boxShadow: transparentNavbar || absolute ? "none" : navbarBoxShadow,
        backdropFilter: transparentNavbar || absolute ? "none" : `saturate(200%) blur(${pxToRem(30)})`,
        backgroundColor: transparentNavbar || absolute
            ? `${transparent.main} !important`
            : rgba(darkMode ? background.default : white.main, 0.8),
        color: () => {
            let color;
            if (light) {
                color = white.main;
            }
            else if (transparentNavbar) {
                color = text.main;
            }
            else {
                color = dark.main;
            }
            return color;
        },
        top: absolute ? 0 : pxToRem(12),
        minHeight: pxToRem(75),
        display: "grid",
        alignItems: "center",
        borderRadius: borderRadius.xl,
        paddingTop: pxToRem(8),
        paddingBottom: pxToRem(8),
        paddingRight: absolute ? pxToRem(8) : 0,
        paddingLeft: absolute ? pxToRem(16) : 0,
        "& > *": {
            transition: transitions.create("all", {
                easing: transitions.easing.easeInOut,
                duration: transitions.duration.standard,
            }),
        },
        "& .MuiToolbar-root": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            [breakpoints.up("sm")]: {
                minHeight: "auto",
                padding: `${pxToRem(4)} ${pxToRem(16)}`,
            },
        },
    };
}
const navbarContainer = ({ breakpoints }) => ({
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    pt: 0.5,
    pb: 0.5,
    [breakpoints.up("md")]: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: "0",
        paddingBottom: "0",
    },
});
const navbarRow = ({ breakpoints }, { isMini }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    [breakpoints.up("md")]: {
        justifyContent: isMini ? "space-between" : "stretch",
        width: isMini ? "100%" : "max-content",
    },
    [breakpoints.up("xl")]: {
        justifyContent: "stretch !important",
        width: "max-content !important",
    },
});
const navbarIconButton = ({ typography: { size }, breakpoints }) => ({
    px: 1,
    "& .material-icons, .material-icons-round": {
        fontSize: `${size.xl} !important`,
    },
    "& .MuiTypography-root": {
        display: "none",
        [breakpoints.up("sm")]: {
            display: "inline-block",
            lineHeight: 1.2,
            ml: 0.5,
        },
    },
});
const navbarDesktopMenu = ({ breakpoints }) => ({
    display: "none !important",
    cursor: "pointer",
    [breakpoints.up("xl")]: {
        display: "inline-block !important",
    },
});
const navbarMobileMenu = ({ breakpoints }) => ({
    display: "inline-block",
    lineHeight: 0,
    [breakpoints.up("xl")]: {
        display: "none",
    },
});

function DashboardNavbar({ absolute, light, isMini }) {
    const [navbarType, setNavbarType] = react.useState();
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
    const [openMenu, setOpenMenu] = react.useState(false);
    const route = reactRouterDom.useLocation().pathname.split("/").slice(1);
    react.useEffect(() => {
        // Setting the navbar type
        if (fixedNavbar) {
            setNavbarType("sticky");
        }
        else {
            setNavbarType("static");
        }
        // A function that sets the transparent state of the navbar.
        function handleTransparentNavbar() {
            setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
        }
        /**
         The event listener that's calling the handleTransparentNavbar function when
         scrolling the window.
        */
        window.addEventListener("scroll", handleTransparentNavbar);
        // Call the handleTransparentNavbar function to set the state with the initial value.
        handleTransparentNavbar();
        // Remove event listener on cleanup
        return () => window.removeEventListener("scroll", handleTransparentNavbar);
    }, [dispatch, fixedNavbar]);
    const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
    const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
    const handleCloseMenu = () => setOpenMenu(false);
    // Render the notifications menu
    const renderMenu = () => (jsxRuntime.jsxs(Menu__default["default"], { anchorEl: openMenu, anchorReference: null, anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
        }, open: Boolean(openMenu), onClose: handleCloseMenu, sx: { mt: 2 }, children: [jsxRuntime.jsx(NotificationItem, { icon: jsxRuntime.jsx(Icon__default["default"], { children: "email" }), title: "Check new messages" }), jsxRuntime.jsx(NotificationItem, { icon: jsxRuntime.jsx(Icon__default["default"], { children: "podcasts" }), title: "Manage Podcast sessions" }), jsxRuntime.jsx(NotificationItem, { icon: jsxRuntime.jsx(Icon__default["default"], { children: "shopping_cart" }), title: "Payment successfully completed" })] }));
    // Styles for the navbar icons
    const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba }, }) => ({
        color: () => {
            let colorValue = light || darkMode ? white.main : dark.main;
            if (transparentNavbar && !light) {
                colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
            }
            return colorValue;
        },
    });
    return (jsxRuntime.jsx(AppBar__default["default"], { position: absolute ? "absolute" : navbarType, color: "inherit", sx: (theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode }), children: jsxRuntime.jsxs(Toolbar__default["default"], { sx: navbarContainer, children: [jsxRuntime.jsxs(MDBox, { color: "inherit", mb: { xs: 1, md: 0 }, sx: (theme) => navbarRow(theme, { isMini }), children: [jsxRuntime.jsx(Breadcrumbs, { icon: "home", title: route[route.length - 1], route: route, light: light }), jsxRuntime.jsx(IconButton__default["default"], { sx: navbarDesktopMenu, onClick: handleMiniSidenav, size: "small", disableRipple: true, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", sx: iconsStyle, children: miniSidenav ? "menu_open" : "menu" }) })] }), isMini ? null : (jsxRuntime.jsxs(MDBox, { sx: (theme) => navbarRow(theme, { isMini }), children: [jsxRuntime.jsx(MDBox, { pr: 1, children: jsxRuntime.jsx(MDInput, { label: "Search here" }) }), jsxRuntime.jsxs(MDBox, { color: light ? "white" : "inherit", children: [jsxRuntime.jsx(reactRouterDom.Link, { to: "/authentication/sign-in/basic", children: jsxRuntime.jsx(IconButton__default["default"], { sx: navbarIconButton, size: "small", disableRipple: true, children: jsxRuntime.jsx(Icon__default["default"], { sx: iconsStyle, children: "account_circle" }) }) }), jsxRuntime.jsx(IconButton__default["default"], { size: "small", disableRipple: true, color: "inherit", sx: navbarMobileMenu, onClick: handleMiniSidenav, children: jsxRuntime.jsx(Icon__default["default"], { sx: iconsStyle, fontSize: "medium", children: miniSidenav ? "menu_open" : "menu" }) }), jsxRuntime.jsx(IconButton__default["default"], { size: "small", disableRipple: true, color: "inherit", sx: navbarIconButton, onClick: handleConfiguratorOpen, children: jsxRuntime.jsx(Icon__default["default"], { sx: iconsStyle, children: "settings" }) }), jsxRuntime.jsx(IconButton__default["default"], { size: "small", color: "inherit", sx: navbarIconButton, onClick: handleOpenMenu, children: jsxRuntime.jsx(MDBadge, { badgeContent: 9, color: "error", size: "xs", circular: true, children: jsxRuntime.jsx(Icon__default["default"], { sx: iconsStyle, children: "notifications" }) }) }), renderMenu()] })] }))] }) }));
}
// Declaring default props for DashboardNavbar
DashboardNavbar.defaultProps = {
    absolute: false,
    light: false,
    isMini: false,
};

function Footer$1({ company, links }) {
    const { href, name } = company;
    const { size } = typography$1;
    const renderLinks = () => links.map((link) => (jsxRuntime.jsx(MDBox, { component: "li", px: 2, lineHeight: 1, children: jsxRuntime.jsx(Link__default["default"], { href: link.href, target: "_blank", children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: link.name }) }) }, link.name)));
    return (jsxRuntime.jsxs(MDBox, { width: "100%", display: "flex", flexDirection: { xs: "column", lg: "row" }, justifyContent: "space-between", alignItems: "center", px: 1.5, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", color: "text", fontSize: size.sm, px: 1.5, children: ["\u00A9 ", new Date().getFullYear(), ", made with", jsxRuntime.jsx(MDBox, { fontSize: size.md, color: "text", mb: -0.5, mx: 0.25, children: jsxRuntime.jsx(Icon__default["default"], { color: "inherit", fontSize: "inherit", children: "favorite" }) }), "by", jsxRuntime.jsx(Link__default["default"], { href: href, target: "_blank", children: jsxRuntime.jsxs(MDTypography, { variant: "button", fontWeight: "medium", children: ["\u00A0", name, "\u00A0"] }) }), "for a better web."] }), jsxRuntime.jsx(MDBox, { component: "ul", sx: ({ breakpoints }) => ({
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    listStyle: "none",
                    mt: 3,
                    mb: 0,
                    p: 0,
                    [breakpoints.up("lg")]: {
                        mt: 0,
                    },
                }), children: renderLinks() })] }));
}
// Declaring default props for Footer
Footer$1.defaultProps = {
    company: { href: "https://www.creative-tim.com/", name: "Creative Tim" },
    links: [
        { href: "https://www.creative-tim.com/", name: "Creative Tim" },
        { href: "https://www.creative-tim.com/presentation", name: "About Us" },
        { href: "https://www.creative-tim.com/blog", name: "Blog" },
        { href: "https://www.creative-tim.com/license", name: "License" },
    ],
};

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
function configs$4(labels, datasets) {
    return {
        data: {
            labels,
            datasets: [
                {
                    label: datasets.label,
                    tension: 0.4,
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    data: datasets.data,
                    maxBarThickness: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5],
                        color: "rgba(255, 255, 255, .2)",
                    },
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 500,
                        beginAtZero: true,
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                        color: "#fff",
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5],
                        color: "rgba(255, 255, 255, .2)",
                    },
                    ticks: {
                        display: true,
                        color: "#f8f9fa",
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                    },
                },
            },
        },
    };
}

function ReportsBarChart({ color, title, description, date, chart }) {
    const { data, options } = configs$4(chart.labels || [], chart.datasets || {});
    return (jsxRuntime.jsx(Card__default["default"], { sx: { height: "100%" }, children: jsxRuntime.jsxs(MDBox, { padding: "1rem", children: [react.useMemo(() => (jsxRuntime.jsx(MDBox, { variant: "gradient", bgColor: color, borderRadius: "lg", coloredShadow: color, py: 2, pr: 0.5, mt: -5, height: "12.5rem", children: jsxRuntime.jsx(reactChartjs2.Bar, { data: data, options: options }) })), [chart, color]), jsxRuntime.jsxs(MDBox, { pt: 3, pb: 1, px: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", textTransform: "capitalize", children: title }), jsxRuntime.jsx(MDTypography, { component: "div", variant: "button", color: "text", fontWeight: "light", children: description }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", lineHeight: 1, sx: { mt: 0.15, mr: 0.5 }, children: jsxRuntime.jsx(Icon__default["default"], { children: "schedule" }) }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "light", children: date })] })] })] }) }));
}
// Setting default values for the props of ReportsBarChart
ReportsBarChart.defaultProps = {
    color: "dark",
    description: "",
};

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
function configs$3(labels, datasets) {
    return {
        data: {
            labels,
            datasets: [
                {
                    label: datasets.label,
                    tension: 0,
                    pointRadius: 5,
                    pointBorderColor: "transparent",
                    pointBackgroundColor: "rgba(255, 255, 255, .8)",
                    borderColor: "rgba(255, 255, 255, .8)",
                    borderWidth: 4,
                    backgroundColor: "transparent",
                    fill: true,
                    data: datasets.data,
                    maxBarThickness: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5],
                        color: "rgba(255, 255, 255, .2)",
                    },
                    ticks: {
                        display: true,
                        color: "#f8f9fa",
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [5, 5],
                    },
                    ticks: {
                        display: true,
                        color: "#f8f9fa",
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                    },
                },
            },
        },
    };
}

function ReportsLineChart({ color, title, description, date, chart }) {
    const { data, options } = configs$3(chart.labels || [], chart.datasets || {});
    return (jsxRuntime.jsx(Card__default["default"], { sx: { height: "100%" }, children: jsxRuntime.jsxs(MDBox, { padding: "1rem", children: [react.useMemo(() => (jsxRuntime.jsx(MDBox, { variant: "gradient", bgColor: color, borderRadius: "lg", coloredShadow: color, py: 2, pr: 0.5, mt: -5, height: "12.5rem", children: jsxRuntime.jsx(reactChartjs2.Line, { data: data, options: options }) })), [chart, color]), jsxRuntime.jsxs(MDBox, { pt: 3, pb: 1, px: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", textTransform: "capitalize", children: title }), jsxRuntime.jsx(MDTypography, { component: "div", variant: "button", color: "text", fontWeight: "light", children: description }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", lineHeight: 1, sx: { mt: 0.15, mr: 0.5 }, children: jsxRuntime.jsx(Icon__default["default"], { children: "schedule" }) }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "light", children: date })] })] })] }) }));
}
// Declaring default props for ReportsLineChart
ReportsLineChart.defaultProps = {
    color: "dark",
    description: "",
};

function ComplexStatisticsCard({ color, title, count, percentage, icon }) {
    return (jsxRuntime.jsxs(Card__default["default"], { children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", pt: 1, px: 2, children: [jsxRuntime.jsx(MDBox, { variant: "gradient", bgColor: color, color: color === "light" ? "dark" : "white", coloredShadow: color, borderRadius: "xl", display: "flex", justifyContent: "center", alignItems: "center", width: "4rem", height: "4rem", mt: -3, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", color: "inherit", children: icon }) }), jsxRuntime.jsxs(MDBox, { textAlign: "right", lineHeight: 1.25, children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "light", color: "text", children: title }), jsxRuntime.jsx(MDTypography, { variant: "h4", children: count })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsx(MDBox, { pb: 2, px: 2, children: jsxRuntime.jsxs(MDTypography, { component: "p", variant: "button", color: "text", display: "flex", children: [jsxRuntime.jsx(MDTypography, { component: "span", variant: "button", fontWeight: "bold", color: percentage.color, children: percentage.amount }), "\u00A0", percentage.label] }) })] }));
}
// Declaring defualt props for ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
    color: "info",
    percentage: {
        color: "success",
        text: "",
        label: "",
    },
};

function BookingCard({ image, title, description, price, location, action }) {
    return (jsxRuntime.jsxs(Card__default["default"], { sx: {
            "&:hover .card-header": {
                transform: action && "translate3d(0, -50px, 0)",
            },
        }, children: [jsxRuntime.jsxs(MDBox, { position: "relative", borderRadius: "lg", mt: -3, mx: 2, className: "card-header", sx: { transition: "transform 300ms cubic-bezier(0.34, 1.61, 0.7, 1)" }, children: [jsxRuntime.jsx(MDBox, { component: "img", src: image, alt: title, borderRadius: "lg", shadow: "md", width: "100%", height: "100%", position: "relative", zIndex: 1 }), jsxRuntime.jsx(MDBox, { borderRadius: "lg", shadow: "md", width: "100%", height: "100%", position: "absolute", left: 0, top: "0", sx: {
                            backgroundImage: `url(${image})`,
                            transform: "scale(0.94)",
                            filter: "blur(12px)",
                            backgroundSize: "cover",
                        } })] }), jsxRuntime.jsxs(MDBox, { textAlign: "center", pt: 3, px: 3, children: [jsxRuntime.jsx(MDBox, { display: "flex", justifyContent: "center", alignItems: "center", mt: action ? -8 : -4.25, children: action }), jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "regular", sx: { mt: 4 }, children: title }), jsxRuntime.jsx(MDTypography, { variant: "body2", color: "text", sx: { mt: 1.5, mb: 1 }, children: description })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", pt: 0.5, pb: 3, px: 3, lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "body2", fontWeight: "regular", color: "text", children: price }), jsxRuntime.jsxs(MDBox, { color: "text", display: "flex", alignItems: "center", children: [jsxRuntime.jsx(Icon__default["default"], { color: "inherit", sx: { m: 0.5 }, children: "place" }), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "light", color: "text", children: location })] })] })] }));
}
// Declaring default props for BookingCard
BookingCard.defaultProps = {
    action: false,
};

function SalesTableCell({ title, content, image, noBorder, ...rest }) {
    let template;
    if (image) {
        template = (jsxRuntime.jsx(TableCell__default["default"], { ...rest, align: "left", width: "30%", sx: { border: noBorder && 0 }, children: jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", width: "max-content", children: [jsxRuntime.jsx(MDBox, { component: "img", src: image, alt: content.toString(), width: "1.5rem", height: "auto" }), " ", jsxRuntime.jsxs(MDBox, { display: "flex", flexDirection: "column", ml: 3, children: [jsxRuntime.jsxs(MDTypography, { variant: "caption", color: "text", fontWeight: "medium", textTransform: "capitalize", children: [title, ":"] }), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", textTransform: "capitalize", children: content })] })] }) }));
    }
    else {
        template = (jsxRuntime.jsx(TableCell__default["default"], { ...rest, align: "center", sx: { border: noBorder && 0 }, children: jsxRuntime.jsxs(MDBox, { display: "flex", flexDirection: "column", children: [jsxRuntime.jsxs(MDTypography, { variant: "caption", color: "text", fontWeight: "medium", textTransform: "capitalize", children: [title, ":"] }), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", textTransform: "capitalize", children: content })] }) }));
    }
    return template;
}
// Declaring default props for SalesTableCell
SalesTableCell.defaultProps = {
    image: "",
    noBorder: false,
};

function SalesTable({ title, rows, shadow }) {
    const renderTableCells = rows.map((row, key) => {
        const tableRows = [];
        const rowKey = `row-${key}`;
        Object.entries(row).map(([cellTitle, cellContent]) => Array.isArray(cellContent)
            ? tableRows.push(jsxRuntime.jsx(SalesTableCell, { title: cellTitle, content: cellContent[1], image: cellContent[0], noBorder: key === rows.length - 1 }, cellContent[1]))
            : tableRows.push(jsxRuntime.jsx(SalesTableCell, { title: cellTitle, content: cellContent, noBorder: key === rows.length - 1 }, cellContent)));
        return jsxRuntime.jsx(TableRow__default["default"], { children: tableRows }, rowKey);
    });
    return (jsxRuntime.jsx(TableContainer__default["default"], { sx: { height: "100%", boxShadow: !shadow && "none" }, children: jsxRuntime.jsxs(Table__default["default"], { children: [title ? (jsxRuntime.jsx(TableHead__default["default"], { children: jsxRuntime.jsx(MDBox, { component: "tr", width: "max-content", display: "block", mb: 1.5, children: jsxRuntime.jsx(MDTypography, { variant: "h6", component: "td", children: title }) }) })) : null, jsxRuntime.jsx(TableBody__default["default"], { children: react.useMemo(() => renderTableCells, [rows]) })] }) }));
}
// Declaring default props for SalesTable
SalesTable.defaultProps = {
    title: "",
    rows: [{}],
    shadow: true,
};

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
const salesTableData$1 = [
    {
        country: [US__default["default"], "united state"],
        sales: 2500,
        value: "$230,900",
        bounce: "29.9%",
    },
    {
        country: [DE__default["default"], "germany"],
        sales: "3.900",
        value: "$440,000",
        bounce: "40.22%",
    },
    {
        country: [GB__default["default"], "great britain"],
        sales: "1.400",
        value: "$190,700",
        bounce: "23.44%",
    },
    { country: [BR__default["default"], "brasil"], sales: 562, value: "$143,960", bounce: "32.14%" },
];

function SalesByCountry() {
    return (jsxRuntime.jsxs(Card__default["default"], { sx: { width: "100%" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", children: [jsxRuntime.jsx(MDBox, { display: "flex", justifyContent: "center", alignItems: "center", width: "4rem", height: "4rem", variant: "gradient", bgColor: "success", color: "white", shadow: "md", borderRadius: "xl", ml: 3, mt: -2, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", color: "inherit", children: "language" }) }), jsxRuntime.jsx(MDTypography, { variant: "h6", sx: { mt: 2, mb: 1, ml: 2 }, children: "Sales by Country" })] }), jsxRuntime.jsx(MDBox, { p: 2, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 7, lg: 6, children: jsxRuntime.jsx(SalesTable, { rows: salesTableData$1, shadow: false }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 5, lg: 6, sx: { mt: { xs: 5, lg: 0 } }, children: jsxRuntime.jsx(core.VectorMap, { map: world.worldMerc, zoomOnScroll: false, zoomButtons: false, markersSelectable: true, backgroundColor: "transparent", selectedMarkers: ["1", "3"], markers: [
                                    {
                                        name: "USA",
                                        latLng: [40.71296415909766, -74.00437720027804],
                                    },
                                    {
                                        name: "Germany",
                                        latLng: [51.17661451970939, 10.97947735117339],
                                    },
                                    {
                                        name: "Brazil",
                                        latLng: [-7.596735421549542, -54.781694323779185],
                                    },
                                    {
                                        name: "Russia",
                                        latLng: [62.318222797104276, 89.81564777631716],
                                    },
                                    {
                                        name: "China",
                                        latLng: [22.320178999475512, 114.17161225541399],
                                    },
                                ], regionStyle: {
                                    initial: {
                                        fill: "#dee2e7",
                                        "fill-opacity": 1,
                                        stroke: "none",
                                        "stroke-width": 0,
                                        "stroke-opacity": 0,
                                    },
                                }, markerStyle: {
                                    initial: {
                                        fill: "#e91e63",
                                        stroke: "#ffffff",
                                        "stroke-width": 5,
                                        "stroke-opacity": 0.5,
                                        r: 7,
                                    },
                                    hover: {
                                        fill: "E91E63",
                                        stroke: "#ffffff",
                                        "stroke-width": 5,
                                        "stroke-opacity": 0.5,
                                    },
                                    selected: {
                                        fill: "E91E63",
                                        stroke: "#ffffff",
                                        "stroke-width": 5,
                                        "stroke-opacity": 0.5,
                                    },
                                }, style: {
                                    marginTop: "-1.5rem",
                                }, onRegionTipShow: () => false, onMarkerTipShow: () => false }) })] }) })] }));
}

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
const reportsBarChartData = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
};

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
const reportsLineChartData = {
    sales: {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: { label: "Mobile apps", data: [50, 40, 300, 320, 500, 350, 200, 230, 500] },
    },
    tasks: {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: { label: "Desktop apps", data: [50, 40, 300, 220, 500, 250, 400, 230, 500] },
    },
};

function Analytics() {
    const { sales, tasks } = reportsLineChartData;
    // Action buttons for the BookingCard
    const actionButtons = (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Tooltip__default["default"], { title: "Refresh", placement: "bottom", children: jsxRuntime.jsx(MDTypography, { variant: "body1", color: "primary", lineHeight: 1, sx: { cursor: "pointer", mx: 3 }, children: jsxRuntime.jsx(Icon__default["default"], { color: "inherit", children: "refresh" }) }) }), jsxRuntime.jsx(Tooltip__default["default"], { title: "Edit", placement: "bottom", children: jsxRuntime.jsx(MDTypography, { variant: "body1", color: "info", lineHeight: 1, sx: { cursor: "pointer", mx: 3 }, children: jsxRuntime.jsx(Icon__default["default"], { color: "inherit", children: "edit" }) }) })] }));
    return (jsxRuntime.jsxs(DashboardLayout, { children: [jsxRuntime.jsx(DashboardNavbar, {}), jsxRuntime.jsxs(MDBox, { py: 3, children: [jsxRuntime.jsx(Grid__default["default"], { container: true, children: jsxRuntime.jsx(SalesByCountry, {}) }), jsxRuntime.jsx(MDBox, { mt: 6, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 4, children: jsxRuntime.jsx(MDBox, { mb: 3, children: jsxRuntime.jsx(ReportsBarChart, { color: "info", title: "website views", description: "Last Campaign Performance", date: "campaign sent 2 days ago", chart: reportsBarChartData }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 4, children: jsxRuntime.jsx(MDBox, { mb: 3, children: jsxRuntime.jsx(ReportsLineChart, { color: "success", title: "daily sales", description: jsxRuntime.jsxs(jsxRuntime.Fragment, { children: ["(", jsxRuntime.jsx("strong", { children: "+15%" }), ") increase in today sales."] }), date: "updated 4 min ago", chart: sales }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 4, children: jsxRuntime.jsx(MDBox, { mb: 3, children: jsxRuntime.jsx(ReportsLineChart, { color: "dark", title: "completed tasks", description: "Last Campaign Performance", date: "just updated", chart: tasks }) }) })] }) }), jsxRuntime.jsx(MDBox, { mt: 1.5, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 3, children: jsxRuntime.jsx(MDBox, { mb: 1.5, children: jsxRuntime.jsx(ComplexStatisticsCard, { color: "dark", icon: "weekend", title: "Bookings", count: 281, percentage: {
                                                color: "success",
                                                amount: "+55%",
                                                label: "than lask week",
                                            } }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 3, children: jsxRuntime.jsx(MDBox, { mb: 1.5, children: jsxRuntime.jsx(ComplexStatisticsCard, { icon: "leaderboard", title: "Today's Users", count: "2,300", percentage: {
                                                color: "success",
                                                amount: "+3%",
                                                label: "than last month",
                                            } }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 3, children: jsxRuntime.jsx(MDBox, { mb: 1.5, children: jsxRuntime.jsx(ComplexStatisticsCard, { color: "success", icon: "store", title: "Revenue", count: "34k", percentage: {
                                                color: "success",
                                                amount: "+1%",
                                                label: "than yesterday",
                                            } }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 3, children: jsxRuntime.jsx(MDBox, { mb: 1.5, children: jsxRuntime.jsx(ComplexStatisticsCard, { color: "primary", icon: "person_add", title: "Followers", count: "+91", percentage: {
                                                color: "success",
                                                amount: "",
                                                label: "Just updated",
                                            } }) }) })] }) }), jsxRuntime.jsx(MDBox, { mt: 2, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 4, children: jsxRuntime.jsx(MDBox, { mt: 3, children: jsxRuntime.jsx(BookingCard, { image: booking1__default["default"], title: "Cozy 5 Stars Apartment", description: 'The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.', price: "$899/night", location: "Barcelona, Spain", action: actionButtons }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 4, children: jsxRuntime.jsx(MDBox, { mt: 3, children: jsxRuntime.jsx(BookingCard, { image: booking2__default["default"], title: "Office Studio", description: 'The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the night life in London, UK.', price: "$1.119/night", location: "London, UK", action: actionButtons }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 4, children: jsxRuntime.jsx(MDBox, { mt: 3, children: jsxRuntime.jsx(BookingCard, { image: booking3__default["default"], title: "Beautiful Castle", description: 'The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Milan.', price: "$459/night", location: "Milan, Italy", action: actionButtons }) }) })] }) })] }), jsxRuntime.jsx(Footer$1, {})] }));
}

const MDBadgeDot = react.forwardRef(({ variant, color, size, badgeContent, font = {}, ...rest }, ref) => {
    let finalSize;
    let fontSize;
    let padding;
    if (size === "sm") {
        finalSize = "0.5rem";
        fontSize = "caption";
        padding = "0.45em 0.775em";
    }
    else if (size === "lg") {
        finalSize = "0.625rem";
        fontSize = "body2";
        padding = "0.85em 1.375em";
    }
    else if (size === "md") {
        finalSize = "0.5rem";
        fontSize = "button";
        padding = "0.65em 1em";
    }
    else {
        finalSize = "0.375rem";
        fontSize = "caption";
        padding = "0.45em 0.775em";
    }
    const validColors = [
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "light",
        "dark",
    ];
    const validColorIndex = validColors.findIndex((el) => el === color);
    return (jsxRuntime.jsxs(MDBox, { ref: ref, display: "flex", alignItems: "center", p: padding, ...rest, children: [jsxRuntime.jsx(MDBox, { component: "i", display: "inline-block", width: finalSize, height: finalSize, borderRadius: "50%", bgColor: validColors[validColorIndex], variant: variant, mr: 1 }), jsxRuntime.jsx(MDTypography, { variant: fontSize, fontWeight: font.weight ? font.weight : "regular", color: font.color ? font.color : "dark", sx: { lineHeight: 0 }, children: badgeContent })] }));
});
// Declaring default props for MDBadgeDot
MDBadgeDot.defaultProps = {
    variant: "contained",
    color: "info",
    size: "xs",
    font: {},
};

function DefaultStatisticsCard({ title, count, percentage, dropdown }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    return (jsxRuntime.jsx(Card__default["default"], { children: jsxRuntime.jsx(MDBox, { p: 2, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, children: [jsxRuntime.jsxs(Grid__default["default"], { item: true, xs: 7, children: [jsxRuntime.jsx(MDBox, { mb: 0.5, lineHeight: 1, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "medium", color: "text", textTransform: "capitalize", children: title }) }), jsxRuntime.jsxs(MDBox, { lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "bold", children: count }), jsxRuntime.jsxs(MDTypography, { variant: "button", fontWeight: "bold", color: percentage.color, children: [percentage.value, "\u00A0", jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: darkMode ? "text" : "secondary", children: percentage.label })] })] })] }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 5, children: dropdown && (jsxRuntime.jsxs(MDBox, { width: "100%", textAlign: "right", lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "caption", color: "secondary", fontWeight: "regular", sx: { cursor: "pointer" }, onClick: dropdown.action, children: dropdown.value }), dropdown.menu] })) })] }) }) }));
}
// Setting default values for the props of DefaultStatisticsCard
DefaultStatisticsCard.defaultProps = {
    percentage: {
        color: "success",
        value: "",
        label: "",
    },
    dropdown: false,
};

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
function configs$2(labels, datasets) {
    return {
        data: {
            labels,
            datasets: [...datasets],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5],
                        color: "#c1c4ce5c",
                    },
                    ticks: {
                        display: true,
                        padding: 10,
                        color: "#9ca2b7",
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: true,
                        borderDash: [5, 5],
                        color: "#c1c4ce5c",
                    },
                    ticks: {
                        display: true,
                        color: "#9ca2b7",
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                    },
                },
            },
        },
    };
}

function DefaultLineChart({ icon, title, description, height, chart }) {
    const chartDatasets = chart.datasets
        ? chart.datasets.map((dataset) => ({
            ...dataset,
            tension: 0,
            pointRadius: 3,
            borderWidth: 4,
            backgroundColor: "transparent",
            fill: true,
            pointBackgroundColor: colors$1[dataset.color]
                ? colors$1[dataset.color || "dark"].main
                : colors$1.dark.main,
            borderColor: colors$1[dataset.color]
                ? colors$1[dataset.color || "dark"].main
                : colors$1.dark.main,
            maxBarThickness: 6,
        }))
        : [];
    const { data, options } = configs$2(chart.labels || [], chartDatasets);
    const renderChart = (jsxRuntime.jsxs(MDBox, { py: 2, pr: 2, pl: icon.component ? 1 : 2, children: [title || description ? (jsxRuntime.jsxs(MDBox, { display: "flex", px: description ? 1 : 0, pt: description ? 1 : 0, children: [icon.component && (jsxRuntime.jsx(MDBox, { width: "4rem", height: "4rem", bgColor: icon.color || "info", variant: "gradient", coloredShadow: icon.color || "info", borderRadius: "xl", display: "flex", justifyContent: "center", alignItems: "center", color: "white", mt: -5, mr: 2, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", children: icon.component }) })), jsxRuntime.jsxs(MDBox, { mt: icon.component ? -2 : 0, children: [title && jsxRuntime.jsx(MDTypography, { variant: "h6", children: title }), jsxRuntime.jsx(MDBox, { mb: 2, children: jsxRuntime.jsx(MDTypography, { component: "div", variant: "button", color: "text", children: description }) })] })] })) : null, react.useMemo(() => (jsxRuntime.jsx(MDBox, { height: height, children: jsxRuntime.jsx(reactChartjs2.Line, { data: data, options: options }) })), [chart, height])] }));
    return title || description ? jsxRuntime.jsx(Card__default["default"], { children: renderChart }) : renderChart;
}
// Declaring default props DefaultLineChart
DefaultLineChart.defaultProps = {
    icon: { color: "info", component: "" },
    title: "",
    description: "",
    height: "19.125rem",
};

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
function configs$1(labels, datasets) {
    return {
        data: {
            labels,
            datasets: [...datasets],
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5],
                        color: "#c1c4ce5c",
                    },
                    ticks: {
                        display: true,
                        padding: 10,
                        color: "#9ca2b7",
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: true,
                        drawTicks: true,
                        color: "#c1c4ce5c",
                    },
                    ticks: {
                        display: true,
                        color: "#9ca2b7",
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: "normal",
                            lineHeight: 2,
                        },
                    },
                },
            },
        },
    };
}

function HorizontalBarChart({ icon, title, description, height, chart }) {
    const chartDatasets = chart.datasets
        ? chart.datasets.map((dataset) => ({
            ...dataset,
            weight: 5,
            borderWidth: 0,
            borderRadius: 4,
            backgroundColor: colors$1[dataset.color]
                ? colors$1[dataset.color || "dark"].main
                : colors$1.dark.main,
            fill: false,
            maxBarThickness: 35,
        }))
        : [];
    const { data, options } = configs$1(chart.labels || [], chartDatasets);
    const renderChart = (jsxRuntime.jsxs(MDBox, { py: 2, pr: 2, pl: icon.component ? 1 : 2, children: [title || description ? (jsxRuntime.jsxs(MDBox, { display: "flex", px: description ? 1 : 0, pt: description ? 1 : 0, children: [icon.component && (jsxRuntime.jsx(MDBox, { width: "4rem", height: "4rem", bgColor: icon.color || "info", variant: "gradient", coloredShadow: icon.color || "info", borderRadius: "xl", display: "flex", justifyContent: "center", alignItems: "center", color: "white", mt: -5, mr: 2, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", children: icon.component }) })), jsxRuntime.jsxs(MDBox, { mt: icon.component ? -2 : 0, children: [title && jsxRuntime.jsx(MDTypography, { variant: "h6", children: title }), jsxRuntime.jsx(MDBox, { mb: 2, children: jsxRuntime.jsx(MDTypography, { component: "div", variant: "button", color: "text", children: description }) })] })] })) : null, react.useMemo(() => (jsxRuntime.jsx(MDBox, { height: height, children: jsxRuntime.jsx(reactChartjs2.Bar, { data: data, options: options }) })), [chart, height])] }));
    return title || description ? jsxRuntime.jsx(Card__default["default"], { children: renderChart }) : renderChart;
}
// Declaring default props HorizontalBarChart
HorizontalBarChart.defaultProps = {
    icon: { color: "info", component: "" },
    title: "",
    description: "",
    height: "19.125rem",
};

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
// @ts-ignore
var MDPaginationItemRoot = styles.styled(MDButton)(({ theme, ownerState }) => {
    const { borders, functions, typography, palette } = theme;
    const { variant, paginationSize, active } = ownerState;
    const { borderColor } = borders;
    const { pxToRem } = functions;
    const { fontWeightRegular, size: fontSize } = typography;
    const { light } = palette;
    // width, height, minWidth and minHeight values
    let sizeValue = pxToRem(36);
    if (paginationSize === "small") {
        sizeValue = pxToRem(30);
    }
    else if (paginationSize === "large") {
        sizeValue = pxToRem(46);
    }
    return {
        borderColor,
        margin: `0 ${pxToRem(2)}`,
        pointerEvents: active ? "none" : "auto",
        fontWeight: fontWeightRegular,
        fontSize: fontSize.sm,
        width: sizeValue,
        minWidth: sizeValue,
        height: sizeValue,
        minHeight: sizeValue,
        "&:hover, &:focus, &:active": {
            transform: "none",
            boxShadow: (variant !== "gradient" || variant !== "contained") && "none !important",
            opacity: "1 !important",
        },
        "&:hover": {
            backgroundColor: light.main,
            borderColor,
        },
    };
});

// The Pagination main context
const Context = react.createContext(null);
const MDPagination = react.forwardRef(({ item, variant, color, size, active, children, ...rest }, ref) => {
    const context = react.useContext(Context);
    const paginationSize = context ? context.size : undefined;
    const providerValue = react.useMemo(() => ({
        variant,
        color,
        size,
    }), [variant, color, size]);
    return (jsxRuntime.jsx(Context.Provider, { value: providerValue, children: item ? (jsxRuntime.jsx(MDPaginationItemRoot, { ...rest, ref: ref, variant: active ? context.variant : "outlined", color: active ? context.color : "secondary", iconOnly: true, circular: true, ownerState: { variant, active, paginationSize }, children: children })) : (jsxRuntime.jsx(MDBox, { display: "flex", justifyContent: "flex-end", alignItems: "center", sx: { listStyle: "none" }, children: children })) }));
});
// Declaring default props for MDPagination
MDPagination.defaultProps = {
    item: false,
    variant: "gradient",
    color: "info",
    size: "medium",
    active: false,
};

function DataTableHeadCell({ width, children, sorted, align, ...rest }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    return (jsxRuntime.jsx(MDBox, { component: "th", width: width, py: 1.5, px: 3, sx: ({ palette: { light }, borders: { borderWidth } }) => ({
            borderBottom: `${borderWidth[1]} solid ${light.main}`,
        }), children: jsxRuntime.jsxs(MDBox, { ...rest, position: "relative", textAlign: align, color: darkMode ? "white" : "secondary", opacity: 0.7, sx: ({ typography: { size, fontWeightBold } }) => ({
                fontSize: size.xxs,
                fontWeight: fontWeightBold,
                textTransform: "uppercase",
                cursor: sorted && "pointer",
                userSelect: sorted && "none",
            }), children: [children, sorted && (jsxRuntime.jsxs(MDBox, { position: "absolute", top: 0, right: align !== "right" ? "16px" : 0, left: align === "right" ? "-5px" : "unset", sx: ({ typography: { size } }) => ({
                        fontSize: size.lg,
                    }), children: [jsxRuntime.jsx(MDBox, { position: "absolute", top: -6, color: sorted === "asce" ? "text" : "secondary", opacity: sorted === "asce" ? 1 : 0.5, children: jsxRuntime.jsx(Icon__default["default"], { children: "arrow_drop_up" }) }), jsxRuntime.jsx(MDBox, { position: "absolute", top: 0, color: sorted === "desc" ? "text" : "secondary", opacity: sorted === "desc" ? 1 : 0.5, children: jsxRuntime.jsx(Icon__default["default"], { children: "arrow_drop_down" }) })] }))] }) }));
}
// Declaring default props for DataTableHeadCell
DataTableHeadCell.defaultProps = {
    width: "auto",
    sorted: "none",
    align: "left",
};

function DataTableBodyCell({ noBorder, align, children }) {
    return (jsxRuntime.jsx(MDBox, { component: "td", textAlign: align, py: 1.5, px: 3, sx: ({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
            fontSize: size.sm,
            borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
        }), children: jsxRuntime.jsx(MDBox, { display: "inline-block", width: "max-content", color: "text", sx: { verticalAlign: "middle" }, children: children }) }));
}
// Declaring default props for DataTableBodyCell
DataTableBodyCell.defaultProps = {
    noBorder: false,
    align: "left",
};

function DataTable({ entriesPerPage, canSearch, showTotalEntries, table, pagination, isSorted, noEndBorder, }) {
    let defaultValue;
    let entries;
    if (entriesPerPage) {
        defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : "10";
        entries = entriesPerPage.entries ? entriesPerPage.entries : ["10", "25", "50", "100"];
    }
    const columns = react.useMemo(() => table.columns, [table]);
    const data = react.useMemo(() => table.rows, [table]);
    const tableInstance = reactTable.useTable({ columns, data, initialState: { pageIndex: 0 } }, reactTable.useGlobalFilter, reactTable.useSortBy, reactTable.usePagination);
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, page, pageOptions, canPreviousPage, canNextPage, gotoPage, nextPage, previousPage, setPageSize, setGlobalFilter, state: { pageIndex, pageSize, globalFilter }, } = tableInstance;
    // Set the default value for the entries per page when component mounts
    react.useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);
    // Set the entries per page value based on the select value
    const setEntriesPerPage = (value) => setPageSize(value);
    // Render the paginations
    const renderPagination = pageOptions.map((option) => (jsxRuntime.jsx(MDPagination, { item: true, onClick: () => gotoPage(Number(option)), active: pageIndex === option, children: option + 1 }, option)));
    // Handler for the input to set the pagination index
    const handleInputPagination = ({ target: { value } }) => value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));
    // Customized page options starting from 1
    const customizedPageOptions = pageOptions.map((option) => option + 1);
    // Setting value for the pagination input
    const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1));
    // Search input value state
    const [search, setSearch] = react.useState(globalFilter);
    // Search input state handle
    const onSearchChange = reactTable.useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 100);
    // A function that sets the sorted value for the table
    const setSortedValue = (column) => {
        let sortedValue;
        if (isSorted && column.isSorted) {
            sortedValue = column.isSortedDesc ? "desc" : "asce";
        }
        else if (isSorted) {
            sortedValue = "none";
        }
        else {
            sortedValue = false;
        }
        return sortedValue;
    };
    // Setting the entries starting point
    const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;
    // Setting the entries ending point
    let entriesEnd;
    if (pageIndex === 0) {
        entriesEnd = pageSize;
    }
    else if (pageIndex === pageOptions.length - 1) {
        entriesEnd = rows.length;
    }
    else {
        entriesEnd = pageSize * (pageIndex + 1);
    }
    return (jsxRuntime.jsxs(TableContainer__default["default"], { sx: { boxShadow: "none" }, children: [entriesPerPage || canSearch ? (jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, children: [entriesPerPage && (jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(Autocomplete__default["default"], { disableClearable: true, value: pageSize.toString(), options: entries, onChange: (event, newValue) => {
                                    setEntriesPerPage(parseInt(newValue, 10));
                                }, size: "small", sx: { width: "5rem" }, renderInput: (params) => jsxRuntime.jsx(MDInput, { ...params }) }), jsxRuntime.jsx(MDTypography, { variant: "caption", color: "secondary", children: "\u00A0\u00A0entries per page" })] })), canSearch && (jsxRuntime.jsx(MDBox, { width: "12rem", ml: "auto", children: jsxRuntime.jsx(MDInput, { placeholder: "Search...", value: search, size: "small", fullWidth: true, onChange: ({ currentTarget }) => {
                                setSearch(search);
                                onSearchChange(currentTarget.value);
                            } }) }))] })) : null, jsxRuntime.jsxs(Table__default["default"], { ...getTableProps(), children: [jsxRuntime.jsx(MDBox, { component: "thead", children: headerGroups.map((headerGroup) => (jsxRuntime.jsx(TableRow__default["default"], { ...headerGroup.getHeaderGroupProps(), children: headerGroup.headers.map((column) => (jsxRuntime.jsx(DataTableHeadCell, { ...column.getHeaderProps(isSorted && column.getSortByToggleProps()), width: column.width ? column.width : "auto", align: column.align ? column.align : "left", sorted: setSortedValue(column), children: column.render("Header") }))) }))) }), jsxRuntime.jsx(TableBody__default["default"], { ...getTableBodyProps(), children: page.map((row, key) => {
                            prepareRow(row);
                            return (jsxRuntime.jsx(TableRow__default["default"], { ...row.getRowProps(), children: row.cells.map((cell) => (jsxRuntime.jsx(DataTableBodyCell, { noBorder: noEndBorder && rows.length - 1 === key, align: cell.column.align ? cell.column.align : "left", ...cell.getCellProps(), children: cell.render("Cell") }))) }));
                        }) })] }), jsxRuntime.jsxs(MDBox, { display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, p: !showTotalEntries && pageOptions.length === 1 ? 0 : 3, children: [showTotalEntries && (jsxRuntime.jsx(MDBox, { mb: { xs: 3, sm: 0 }, children: jsxRuntime.jsxs(MDTypography, { variant: "button", color: "secondary", fontWeight: "regular", children: ["Showing ", entriesStart, " to ", entriesEnd, " of ", rows.length, " entries"] }) })), pageOptions.length > 1 && (jsxRuntime.jsxs(MDPagination, { variant: pagination.variant ? pagination.variant : "gradient", color: pagination.color ? pagination.color : "info", children: [canPreviousPage && (jsxRuntime.jsx(MDPagination, { item: true, onClick: () => previousPage(), children: jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "bold" }, children: "chevron_left" }) })), renderPagination.length > 6 ? (jsxRuntime.jsx(MDBox, { width: "5rem", mx: 1, children: jsxRuntime.jsx(MDInput, { inputProps: { type: "number", min: 1, max: customizedPageOptions.length }, value: customizedPageOptions[pageIndex], onChange: (event) => {
                                        handleInputPagination(event);
                                        handleInputPaginationValue(event);
                                    } }) })) : (renderPagination), canNextPage && (jsxRuntime.jsx(MDPagination, { item: true, onClick: () => nextPage(), children: jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "bold" }, children: "chevron_right" }) }))] }))] })] }));
}
// Declaring default props for DataTable
DataTable.defaultProps = {
    entriesPerPage: { defaultValue: 10, entries: ["5", "10", "15", "20", "25"] },
    canSearch: false,
    showTotalEntries: true,
    pagination: { variant: "gradient", color: "info" },
    isSorted: true,
    noEndBorder: false,
};

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
const { gradients, dark } = colors$1;
function configs(labels, datasets) {
    const backgroundColors = [];
    if (datasets.backgroundColors) {
        datasets.backgroundColors.forEach((color) => gradients[color]
            ? backgroundColors.push(gradients[color].state)
            : backgroundColors.push(dark.main));
    }
    else {
        backgroundColors.push(dark.main);
    }
    return {
        data: {
            labels,
            datasets: [
                {
                    label: datasets.label,
                    weight: 9,
                    cutout: 0,
                    tension: 0.9,
                    pointRadius: 2,
                    borderWidth: 2,
                    backgroundColor: backgroundColors,
                    fill: false,
                    data: datasets.data,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    };
}

function PieChart({ icon, title, description, height, chart }) {
    const { data, options } = configs(chart.labels || [], chart.datasets || {});
    const renderChart = (jsxRuntime.jsxs(MDBox, { py: 2, pr: 2, pl: icon.component ? 1 : 2, children: [title || description ? (jsxRuntime.jsxs(MDBox, { display: "flex", px: description ? 1 : 0, pt: description ? 1 : 0, children: [icon.component && (jsxRuntime.jsx(MDBox, { width: "4rem", height: "4rem", bgColor: icon.color || "info", variant: "gradient", coloredShadow: icon.color || "info", borderRadius: "xl", display: "flex", justifyContent: "center", alignItems: "center", color: "white", mt: -5, mr: 2, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", children: icon.component }) })), jsxRuntime.jsxs(MDBox, { mt: icon.component ? -2 : 0, children: [title && jsxRuntime.jsx(MDTypography, { variant: "h6", children: title }), jsxRuntime.jsx(MDBox, { mb: 2, children: jsxRuntime.jsx(MDTypography, { component: "div", variant: "button", color: "text", children: description }) })] })] })) : null, react.useMemo(() => (jsxRuntime.jsx(MDBox, { height: height, children: jsxRuntime.jsx(reactChartjs2.Pie, { data: data, options: options }) })), [chart, height])] }));
    return title || description ? jsxRuntime.jsx(Card__default["default"], { children: renderChart }) : renderChart;
}
// Declaring default props for PieChart
PieChart.defaultProps = {
    icon: { color: "info", component: "" },
    title: "",
    description: "",
    height: "19.125rem",
};

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
const channelChartData = {
    labels: ["Facebook", "Direct", "Organic", "Referral"],
    datasets: {
        label: "Projects",
        backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
        data: [15, 20, 12, 60],
    },
};

function ChannelsChart() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    return (jsxRuntime.jsxs(Card__default["default"], { sx: { height: "100%" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, px: 2, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", children: "Channels" }), jsxRuntime.jsx(Tooltip__default["default"], { title: "See traffic channels", placement: "bottom", arrow: true, children: jsxRuntime.jsx(MDButton, { variant: "outlined", color: "secondary", size: "small", circular: true, iconOnly: true, children: jsxRuntime.jsx(Icon__default["default"], { children: "priority_high" }) }) })] }), jsxRuntime.jsx(MDBox, { mt: 3, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, alignItems: "center", children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 7, children: jsxRuntime.jsx(PieChart, { chart: channelChartData, height: "12.5rem" }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 5, children: jsxRuntime.jsxs(MDBox, { pr: 1, children: [jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDBadgeDot, { color: "info", size: "sm", badgeContent: "Facebook" }) }), jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDBadgeDot, { color: "primary", size: "sm", badgeContent: "Direct" }) }), jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDBadgeDot, { color: "dark", size: "sm", badgeContent: "Organic" }) }), jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDBadgeDot, { color: "secondary", size: "sm", badgeContent: "Referral" }) })] }) })] }) }), jsxRuntime.jsxs(MDBox, { pt: 4, pb: 2, px: 2, display: "flex", flexDirection: { xs: "column", sm: "row" }, mt: "auto", children: [jsxRuntime.jsx(MDBox, { width: { xs: "100%", sm: "60%" }, lineHeight: 1, children: jsxRuntime.jsxs(MDTypography, { variant: "button", color: "text", fontWeight: "light", children: ["More than ", jsxRuntime.jsx("strong", { children: "1,200,000" }), " sales are made using referral marketing, and", " ", jsxRuntime.jsx("strong", { children: "700,000" }), " are from social media."] }) }), jsxRuntime.jsx(MDBox, { width: { xs: "100%", sm: "40%" }, textAlign: "right", mt: { xs: 2, sm: "auto" }, children: jsxRuntime.jsx(MDButton, { color: darkMode ? "white" : "light", children: "read more" }) })] })] }));
}

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
const defaultLineChartData = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Facebook Ads",
            color: "info",
            data: [50, 100, 200, 190, 400, 350, 500, 450, 700],
        },
        {
            label: "Google Ads",
            color: "dark",
            data: [10, 30, 40, 120, 150, 220, 280, 250, 280],
        },
    ],
};

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
const horizontalBarChartData = {
    labels: ["16-20", "21-25", "26-30", "31-36", "36-42", "42+"],
    datasets: [
        {
            label: "Sales by age",
            color: "dark",
            data: [15, 20, 12, 60, 20, 15],
        },
    ],
};

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
const salesTableData = [
    {
        country: [US__default["default"], "united state"],
        sales: 2500,
        bounce: "29.9%",
    },
    {
        country: [DE__default["default"], "germany"],
        sales: "3.900",
        bounce: "40.22%",
    },
    {
        country: [GB__default["default"], "great britain"],
        sales: "1.400",
        bounce: "23.44%",
    },
    { country: [BR__default["default"], "brasil"], sales: 562, bounce: "32.14%" },
    { country: [AU__default["default"], "australia"], sales: 400, bounce: "56.83%" },
];

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
var MDAvatarRoot = styles.styled(Avatar__default["default"])(({ theme, ownerState }) => {
    const { palette, functions, typography, boxShadows } = theme;
    const { shadow, bgColor, size } = ownerState;
    const { gradients, transparent, white } = palette;
    const { pxToRem, linearGradient } = functions;
    const { size: fontSize, fontWeightRegular } = typography;
    // backgroundImage value
    const backgroundValue = bgColor === "transparent"
        ? transparent.main
        : linearGradient(gradients[bgColor].main, gradients[bgColor].state);
    // size value
    let sizeValue;
    switch (size) {
        case "xs":
            sizeValue = {
                width: pxToRem(24),
                height: pxToRem(24),
                fontSize: fontSize.xs,
            };
            break;
        case "sm":
            sizeValue = {
                width: pxToRem(36),
                height: pxToRem(36),
                fontSize: fontSize.sm,
            };
            break;
        case "lg":
            sizeValue = {
                width: pxToRem(58),
                height: pxToRem(58),
                fontSize: fontSize.sm,
            };
            break;
        case "xl":
            sizeValue = {
                width: pxToRem(74),
                height: pxToRem(74),
                fontSize: fontSize.md,
            };
            break;
        case "xxl":
            sizeValue = {
                width: pxToRem(110),
                height: pxToRem(110),
                fontSize: fontSize.md,
            };
            break;
        default: {
            sizeValue = {
                width: pxToRem(48),
                height: pxToRem(48),
                fontSize: fontSize.md,
            };
        }
    }
    return {
        background: backgroundValue,
        color: white.main,
        fontWeight: fontWeightRegular,
        boxShadow: boxShadows[shadow],
        ...sizeValue,
    };
});

const MDAvatar = react.forwardRef(({ bgColor, size, shadow, ...rest }, ref) => (jsxRuntime.jsx(MDAvatarRoot, { ref: ref, ownerState: { shadow, bgColor, size }, ...rest })));
// Declaring default props for MDAvatar
MDAvatar.defaultProps = {
    bgColor: "transparent",
    size: "md",
    shadow: "none",
};

function ProductCell({ image, name, orders }) {
    return (jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", pr: 2, children: [jsxRuntime.jsx(MDBox, { mr: 2, children: jsxRuntime.jsx(MDAvatar, { src: image, alt: name }) }), jsxRuntime.jsxs(MDBox, { display: "flex", flexDirection: "column", children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "medium", children: name }), jsxRuntime.jsxs(MDTypography, { variant: "button", fontWeight: "regular", color: "secondary", children: [jsxRuntime.jsx(MDTypography, { component: "span", variant: "button", fontWeight: "regular", color: "success", children: orders }), " ", "orders"] })] })] }));
}

function RefundsCell({ value, icon }) {
    return (jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "center", alignItems: "center", px: 2, children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: value }), jsxRuntime.jsx(MDBox, { color: icon.color, lineHeight: 0, children: jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "bold" }, fontSize: "small", children: icon.name }) })] }));
}

function DefaultCell({ children }) {
    return (jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: children }));
}

const dataTableData$1 = {
    columns: [
        { Header: "product", accessor: "product", width: "55%" },
        { Header: "value", accessor: "value" },
        { Header: "ads spent", accessor: "adsSpent", align: "center" },
        { Header: "refunds", accessor: "refunds", align: "center" },
    ],
    rows: [
        {
            product: jsxRuntime.jsx(ProductCell, { image: nikeV22__default["default"], name: "Nike v22 Running", orders: 8.232 }),
            value: jsxRuntime.jsx(DefaultCell, { children: "$130.992" }),
            adsSpent: jsxRuntime.jsx(DefaultCell, { children: "$9.500" }),
            refunds: jsxRuntime.jsx(RefundsCell, { value: 13, icon: { color: "success", name: "keyboard_arrow_up" } }),
        },
        {
            product: (jsxRuntime.jsx(ProductCell, { image: businessKit__default["default"], name: "Business Kit (Mug + Notebook)", orders: 12.821 })),
            value: jsxRuntime.jsx(DefaultCell, { children: "$80.250" }),
            adsSpent: jsxRuntime.jsx(DefaultCell, { children: "$4.200" }),
            refunds: jsxRuntime.jsx(RefundsCell, { value: 40, icon: { color: "error", name: "keyboard_arrow_down" } }),
        },
        {
            product: jsxRuntime.jsx(ProductCell, { image: blackChair__default["default"], name: "Black Chair", orders: 2.421 }),
            value: jsxRuntime.jsx(DefaultCell, { children: "$40.600" }),
            adsSpent: jsxRuntime.jsx(DefaultCell, { children: "$9.430" }),
            refunds: jsxRuntime.jsx(RefundsCell, { value: 54, icon: { color: "success", name: "keyboard_arrow_up" } }),
        },
        {
            product: jsxRuntime.jsx(ProductCell, { image: wirelessCharger__default["default"], name: "Wireless Charger", orders: 5.921 }),
            value: jsxRuntime.jsx(DefaultCell, { children: "$91.300" }),
            adsSpent: jsxRuntime.jsx(DefaultCell, { children: "$7.364" }),
            refunds: jsxRuntime.jsx(RefundsCell, { value: 5, icon: { color: "error", name: "keyboard_arrow_down" } }),
        },
        {
            product: (jsxRuntime.jsx(ProductCell, { image: tripKit__default["default"], name: "Mountain Trip Kit (Camera + Backpack)", orders: 921 })),
            value: jsxRuntime.jsx(DefaultCell, { children: "$140.925" }),
            adsSpent: jsxRuntime.jsx(DefaultCell, { children: "$20.531" }),
            refunds: jsxRuntime.jsx(RefundsCell, { value: 121, icon: { color: "success", name: "keyboard_arrow_up" } }),
        },
    ],
};

function Sales() {
    // DefaultStatisticsCard state for the dropdown value
    const [salesDropdownValue, setSalesDropdownValue] = react.useState("6 May - 7 May");
    const [customersDropdownValue, setCustomersDropdownValue] = react.useState("6 May - 7 May");
    const [revenueDropdownValue, setRevenueDropdownValue] = react.useState("6 May - 7 May");
    // DefaultStatisticsCard state for the dropdown action
    const [salesDropdown, setSalesDropdown] = react.useState(null);
    const [customersDropdown, setCustomersDropdown] = react.useState(null);
    const [revenueDropdown, setRevenueDropdown] = react.useState(null);
    // DefaultStatisticsCard handler for the dropdown action
    const openSalesDropdown = ({ currentTarget }) => setSalesDropdown(currentTarget);
    const closeSalesDropdown = ({ currentTarget }) => {
        setSalesDropdown(null);
        setSalesDropdownValue(currentTarget.innerText || salesDropdownValue);
    };
    const openCustomersDropdown = ({ currentTarget }) => setCustomersDropdown(currentTarget);
    const closeCustomersDropdown = ({ currentTarget }) => {
        setCustomersDropdown(null);
        setCustomersDropdownValue(currentTarget.innerText || salesDropdownValue);
    };
    const openRevenueDropdown = ({ currentTarget }) => setRevenueDropdown(currentTarget);
    const closeRevenueDropdown = ({ currentTarget }) => {
        setRevenueDropdown(null);
        setRevenueDropdownValue(currentTarget.innerText || salesDropdownValue);
    };
    // Dropdown menu template for the DefaultStatisticsCard
    const renderMenu = (state, close) => (jsxRuntime.jsxs(Menu__default["default"], { anchorEl: state, transformOrigin: { vertical: "top", horizontal: "center" }, open: Boolean(state), onClose: close, keepMounted: true, disableAutoFocusItem: true, children: [jsxRuntime.jsx(MenuItem__default["default"], { onClick: close, children: "Last 7 days" }), jsxRuntime.jsx(MenuItem__default["default"], { onClick: close, children: "Last week" }), jsxRuntime.jsx(MenuItem__default["default"], { onClick: close, children: "Last 30 days" })] }));
    return (jsxRuntime.jsxs(DashboardLayout, { children: [jsxRuntime.jsx(DashboardNavbar, {}), jsxRuntime.jsxs(MDBox, { py: 3, children: [jsxRuntime.jsx(MDBox, { mb: 3, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 4, children: jsxRuntime.jsx(DefaultStatisticsCard, { title: "sales", count: "$230,220", percentage: {
                                            color: "success",
                                            value: "+55%",
                                            label: "since last month",
                                        }, dropdown: {
                                            action: openSalesDropdown,
                                            menu: renderMenu(salesDropdown, closeSalesDropdown),
                                            value: salesDropdownValue,
                                        } }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 4, children: jsxRuntime.jsx(DefaultStatisticsCard, { title: "customers", count: "3.200", percentage: {
                                            color: "success",
                                            value: "+12%",
                                            label: "since last month",
                                        }, dropdown: {
                                            action: openCustomersDropdown,
                                            menu: renderMenu(customersDropdown, closeCustomersDropdown),
                                            value: customersDropdownValue,
                                        } }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 4, children: jsxRuntime.jsx(DefaultStatisticsCard, { title: "avg. revenue", count: "$1.200", percentage: {
                                            color: "secondary",
                                            value: "+$213",
                                            label: "since last month",
                                        }, dropdown: {
                                            action: openRevenueDropdown,
                                            menu: renderMenu(revenueDropdown, closeRevenueDropdown),
                                            value: revenueDropdownValue,
                                        } }) })] }) }), jsxRuntime.jsx(MDBox, { mb: 3, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, lg: 4, children: jsxRuntime.jsx(ChannelsChart, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, lg: 8, children: jsxRuntime.jsx(DefaultLineChart, { title: "Revenue", description: jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", children: [jsxRuntime.jsxs(MDBox, { display: "flex", ml: -1, children: [jsxRuntime.jsx(MDBadgeDot, { color: "info", size: "sm", badgeContent: "Facebook Ads" }), jsxRuntime.jsx(MDBadgeDot, { color: "dark", size: "sm", badgeContent: "Google Ads" })] }), jsxRuntime.jsx(MDBox, { mt: -4, mr: -1, position: "absolute", right: "1.5rem", children: jsxRuntime.jsx(Tooltip__default["default"], { title: "See which ads perform better", placement: "left", arrow: true, children: jsxRuntime.jsx(MDButton, { variant: "outlined", color: "secondary", size: "small", circular: true, iconOnly: true, children: jsxRuntime.jsx(Icon__default["default"], { children: "priority_high" }) }) }) })] }), chart: defaultLineChartData }) })] }) }), jsxRuntime.jsx(MDBox, { mb: 3, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, lg: 8, children: jsxRuntime.jsx(HorizontalBarChart, { title: "Sales by age", chart: horizontalBarChartData }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, lg: 4, children: jsxRuntime.jsx(SalesTable, { title: "Sales by Country", rows: salesTableData }) })] }) }), jsxRuntime.jsx(Grid__default["default"], { container: true, spacing: 3, children: jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsxs(Card__default["default"], { children: [jsxRuntime.jsx(MDBox, { pt: 3, px: 3, children: jsxRuntime.jsx(MDTypography, { variant: "h6", fontWeight: "medium", children: "Top Selling Products" }) }), jsxRuntime.jsx(MDBox, { py: 1, children: jsxRuntime.jsx(DataTable, { table: dataTableData$1, entriesPerPage: false, showTotalEntries: false, isSorted: false, noEndBorder: true }) })] }) }) })] }), jsxRuntime.jsx(Footer$1, {})] }));
}

function ProfileInfoCard({ title, description, info, social, action, shadow }) {
    const labels = [];
    const values = [];
    const { socialMediaColors } = colors$1;
    const { size } = typography$1;
    // Convert this form `objectKey` of the object key in to this `object key`
    Object.keys(info).forEach((el) => {
        if (el.match(/[A-Z\s]+/)) {
            const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
            const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
            labels.push(newElement);
        }
        else {
            labels.push(el);
        }
    });
    // Push the object values into the values array
    Object.values(info).forEach((el) => values.push(el));
    // Render the card info items
    const renderItems = labels.map((label, key) => (jsxRuntime.jsxs(MDBox, { display: "flex", py: 1, pr: 2, children: [jsxRuntime.jsxs(MDTypography, { variant: "button", fontWeight: "bold", textTransform: "capitalize", children: [label, ": \u00A0"] }), jsxRuntime.jsxs(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: ["\u00A0", values[key]] })] }, label)));
    // Render the card social media icons
    const renderSocial = social.map(({ link, icon, color }) => (jsxRuntime.jsx(MDBox, { component: "a", href: link, target: "_blank", rel: "noreferrer", fontSize: size.lg, color: socialMediaColors[color].main, pr: 1, pl: 0.5, lineHeight: 1, children: icon }, color)));
    return (jsxRuntime.jsxs(Card__default["default"], { sx: { height: "100%", boxShadow: !shadow && "none" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, px: 2, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", fontWeight: "medium", textTransform: "capitalize", children: title }), jsxRuntime.jsx(MDTypography, { component: reactRouterDom.Link, to: action.route, variant: "body2", color: "secondary", children: jsxRuntime.jsx(Tooltip__default["default"], { title: action.tooltip, placement: "top", children: jsxRuntime.jsx(Icon__default["default"], { children: "edit" }) }) })] }), jsxRuntime.jsxs(MDBox, { p: 2, children: [jsxRuntime.jsx(MDBox, { mb: 2, lineHeight: 1, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "light", children: description }) }), jsxRuntime.jsx(MDBox, { opacity: 0.3, children: jsxRuntime.jsx(Divider__default["default"], {}) }), jsxRuntime.jsxs(MDBox, { children: [renderItems, jsxRuntime.jsxs(MDBox, { display: "flex", py: 1, pr: 2, children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "bold", textTransform: "capitalize", children: "social: \u00A0" }), renderSocial] })] })] })] }));
}
// Declaring default props for ProfileInfoCard
ProfileInfoCard.defaultProps = {
    shadow: true,
};

function ProfilesList({ title, profiles, shadow }) {
    const renderProfiles = profiles.map(({ image, name, description, action }) => (jsxRuntime.jsxs(MDBox, { component: "li", display: "flex", alignItems: "center", py: 1, mb: 1, children: [jsxRuntime.jsx(MDBox, { mr: 2, children: jsxRuntime.jsx(MDAvatar, { src: image, alt: "something here", shadow: "md" }) }), jsxRuntime.jsxs(MDBox, { display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "medium", children: name }), jsxRuntime.jsx(MDTypography, { variant: "caption", color: "text", children: description })] }), jsxRuntime.jsx(MDBox, { ml: "auto", children: action.type === "internal" ? (jsxRuntime.jsx(MDButton, { component: reactRouterDom.Link, to: action.route, variant: "text", color: "info", children: action.label })) : (jsxRuntime.jsx(MDButton, { component: "a", href: action.route, target: "_blank", rel: "noreferrer", variant: "text", color: action.color, children: action.label })) })] }, name)));
    return (jsxRuntime.jsxs(Card__default["default"], { sx: { height: "100%", boxShadow: !shadow && "none" }, children: [jsxRuntime.jsx(MDBox, { pt: 2, px: 2, children: jsxRuntime.jsx(MDTypography, { variant: "h6", fontWeight: "medium", textTransform: "capitalize", children: title }) }), jsxRuntime.jsx(MDBox, { p: 2, children: jsxRuntime.jsx(MDBox, { component: "ul", display: "flex", flexDirection: "column", p: 0, m: 0, children: renderProfiles }) })] }));
}
// Declaring defualt props for ProfilesList
ProfilesList.defaultProps = {
    shadow: true,
};

function DefaultProjectCard({ image, label, title, description, action, authors, }) {
    const renderAuthors = authors.map(({ image: media, name }) => (jsxRuntime.jsx(Tooltip__default["default"], { title: name, placement: "bottom", children: jsxRuntime.jsx(MDAvatar, { src: media, alt: name, size: "xs", sx: ({ borders: { borderWidth }, palette: { white } }) => ({
                border: `${borderWidth[2]} solid ${white.main}`,
                cursor: "pointer",
                position: "relative",
                ml: -1.25,
                "&:hover, &:focus": {
                    zIndex: "10",
                },
            }) }) }, name)));
    return (jsxRuntime.jsxs(Card__default["default"], { sx: {
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "visible",
        }, children: [jsxRuntime.jsx(MDBox, { position: "relative", width: "100.25%", shadow: "xl", borderRadius: "xl", children: jsxRuntime.jsx(CardMedia__default["default"], { src: image, component: "img", title: title, sx: {
                        maxWidth: "100%",
                        margin: 0,
                        boxShadow: ({ boxShadows: { md } }) => md,
                        objectFit: "cover",
                        objectPosition: "center",
                    } }) }), jsxRuntime.jsxs(MDBox, { mt: 1, mx: 0.5, children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", textTransform: "capitalize", children: label }), jsxRuntime.jsx(MDBox, { mb: 1, children: action.type === "internal" ? (jsxRuntime.jsx(MDTypography, { component: reactRouterDom.Link, to: action.route, variant: "h5", textTransform: "capitalize", children: title })) : (jsxRuntime.jsx(MDTypography, { component: "a", href: action.route, target: "_blank", rel: "noreferrer", variant: "h5", textTransform: "capitalize", children: title })) }), jsxRuntime.jsx(MDBox, { mb: 3, lineHeight: 0, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "light", color: "text", children: description }) }), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [action.type === "internal" ? (jsxRuntime.jsx(MDButton, { component: reactRouterDom.Link, to: action.route, variant: "outlined", size: "small", color: action.color, children: action.label })) : (jsxRuntime.jsx(MDButton, { component: "a", href: action.route, target: "_blank", rel: "noreferrer", variant: "outlined", size: "small", color: action.color, children: action.label })), jsxRuntime.jsx(MDBox, { display: "flex", children: renderAuthors })] })] })] }));
}
// Declaring default props for DefaultProjectCard
DefaultProjectCard.defaultProps = {
    authors: [],
};

function Header$1({ children }) {
    const [tabsOrientation, setTabsOrientation] = react.useState("horizontal");
    const [tabValue, setTabValue] = react.useState(0);
    react.useEffect(() => {
        // A function that sets the orientation state of the tabs.
        function handleTabsOrientation() {
            return window.innerWidth < breakpoints$1.values.sm
                ? setTabsOrientation("vertical")
                : setTabsOrientation("horizontal");
        }
        /**
         The event listener that's calling the handleTabsOrientation function when resizing the window.
        */
        window.addEventListener("resize", handleTabsOrientation);
        // Call the handleTabsOrientation function to set the state with the initial value.
        handleTabsOrientation();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleTabsOrientation);
    }, [tabsOrientation]);
    const handleSetTabValue = (event, newValue) => setTabValue(newValue);
    return (jsxRuntime.jsxs(MDBox, { position: "relative", mb: 5, children: [jsxRuntime.jsx(MDBox, { display: "flex", alignItems: "center", position: "relative", minHeight: "18.75rem", borderRadius: "xl", sx: {
                    backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) => `${linearGradient(rgba(gradients.info.main, 0.6), rgba(gradients.info.state, 0.6))}, url(${backgroundImage__default["default"]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50%",
                    overflow: "hidden",
                } }), jsxRuntime.jsxs(Card__default["default"], { sx: {
                    position: "relative",
                    mt: -8,
                    mx: 3,
                    py: 2,
                    px: 2,
                }, children: [jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, alignItems: "center", children: [jsxRuntime.jsx(Grid__default["default"], { item: true, children: jsxRuntime.jsx(MDAvatar, { src: burceMars__default["default"], alt: "profile-image", size: "xl", shadow: "sm" }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, children: jsxRuntime.jsxs(MDBox, { height: "100%", mt: 0.5, lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "medium", children: "Richard Davis" }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "regular", children: "CEO / Co-Founder" })] }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 4, sx: { ml: "auto" }, children: jsxRuntime.jsx(AppBar__default["default"], { position: "static", children: jsxRuntime.jsxs(Tabs__default["default"], { orientation: tabsOrientation, value: tabValue, onChange: handleSetTabValue, children: [jsxRuntime.jsx(Tab__default["default"], { label: "App", icon: jsxRuntime.jsx(Icon__default["default"], { fontSize: "small", sx: { mt: -0.25 }, children: "home" }) }), jsxRuntime.jsx(Tab__default["default"], { label: "Message", icon: jsxRuntime.jsx(Icon__default["default"], { fontSize: "small", sx: { mt: -0.25 }, children: "email" }) }), jsxRuntime.jsx(Tab__default["default"], { label: "Settings", icon: jsxRuntime.jsx(Icon__default["default"], { fontSize: "small", sx: { mt: -0.25 }, children: "settings" }) })] }) }) })] }), children] })] }));
}
// Declaring default props for Header
Header$1.defaultProps = {
    children: "",
};

function PlatformSettings() {
    const [followsMe, setFollowsMe] = react.useState(true);
    const [answersPost, setAnswersPost] = react.useState(false);
    const [mentionsMe, setMentionsMe] = react.useState(true);
    const [newLaunches, setNewLaunches] = react.useState(false);
    const [productUpdate, setProductUpdate] = react.useState(true);
    const [newsletter, setNewsletter] = react.useState(false);
    return (jsxRuntime.jsxs(Card__default["default"], { sx: { boxShadow: "none" }, children: [jsxRuntime.jsx(MDBox, { p: 2, children: jsxRuntime.jsx(MDTypography, { variant: "h6", fontWeight: "medium", textTransform: "capitalize", children: "platform settings" }) }), jsxRuntime.jsxs(MDBox, { pt: 1, pb: 2, px: 2, lineHeight: 1.25, children: [jsxRuntime.jsx(MDTypography, { variant: "caption", fontWeight: "bold", color: "text", textTransform: "uppercase", children: "account" }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mb: 0.5, ml: -1.5, children: [jsxRuntime.jsx(MDBox, { mt: 0.5, children: jsxRuntime.jsx(Switch__default["default"], { checked: followsMe, onChange: () => setFollowsMe(!followsMe) }) }), jsxRuntime.jsx(MDBox, { width: "80%", ml: 0.5, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: "Email me when someone follows me" }) })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mb: 0.5, ml: -1.5, children: [jsxRuntime.jsx(MDBox, { mt: 0.5, children: jsxRuntime.jsx(Switch__default["default"], { checked: answersPost, onChange: () => setAnswersPost(!answersPost) }) }), jsxRuntime.jsx(MDBox, { width: "80%", ml: 0.5, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: "Email me when someone answers on my post" }) })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mb: 0.5, ml: -1.5, children: [jsxRuntime.jsx(MDBox, { mt: 0.5, children: jsxRuntime.jsx(Switch__default["default"], { checked: mentionsMe, onChange: () => setMentionsMe(!mentionsMe) }) }), jsxRuntime.jsx(MDBox, { width: "80%", ml: 0.5, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: "Email me when someone mentions me" }) })] }), jsxRuntime.jsx(MDBox, { mt: 3, children: jsxRuntime.jsx(MDTypography, { variant: "caption", fontWeight: "bold", color: "text", textTransform: "uppercase", children: "application" }) }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mb: 0.5, ml: -1.5, children: [jsxRuntime.jsx(MDBox, { mt: 0.5, children: jsxRuntime.jsx(Switch__default["default"], { checked: newLaunches, onChange: () => setNewLaunches(!newLaunches) }) }), jsxRuntime.jsx(MDBox, { width: "80%", ml: 0.5, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: "New launches and projects" }) })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mb: 0.5, ml: -1.5, children: [jsxRuntime.jsx(MDBox, { mt: 0.5, children: jsxRuntime.jsx(Switch__default["default"], { checked: productUpdate, onChange: () => setProductUpdate(!productUpdate) }) }), jsxRuntime.jsx(MDBox, { width: "80%", ml: 0.5, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: "Monthly product updates" }) })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mb: 0.5, ml: -1.5, children: [jsxRuntime.jsx(MDBox, { mt: 0.5, children: jsxRuntime.jsx(Switch__default["default"], { checked: newsletter, onChange: () => setNewsletter(!newsletter) }) }), jsxRuntime.jsx(MDBox, { width: "80%", ml: 0.5, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: "Subscribe to newsletter" }) })] })] })] }));
}

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
const profileListData = [
    {
        image: kal__default["default"],
        name: "Sophie B.",
        description: "Hi! I need more information..",
        action: {
            type: "internal",
            route: "/pages/profile/profile-overview",
            color: "info",
            label: "reply",
        },
    },
    {
        image: marie__default["default"],
        name: "Anne Marie",
        description: "Awesome work, can you..",
        action: {
            type: "internal",
            route: "/pages/profile/profile-overview",
            color: "info",
            label: "reply",
        },
    },
    {
        image: ivana__default["default"],
        name: "Ivanna",
        description: "About files I can..",
        action: {
            type: "internal",
            route: "/pages/profile/profile-overview",
            color: "info",
            label: "reply",
        },
    },
    {
        image: team4__default["default"],
        name: "Peterson",
        description: "Have a great afternoon..",
        action: {
            type: "internal",
            route: "/pages/profile/profile-overview",
            color: "info",
            label: "reply",
        },
    },
    {
        image: team3__default["default"],
        name: "Nick Daniel",
        description: "Hi! I need more information..",
        action: {
            type: "internal",
            route: "/pages/profile/profile-overview",
            color: "info",
            label: "reply",
        },
    },
];

function Overview() {
    return (jsxRuntime.jsxs(DashboardLayout, { children: [jsxRuntime.jsx(DashboardNavbar, {}), jsxRuntime.jsx(MDBox, { mb: 2 }), jsxRuntime.jsxs(Header$1, { children: [jsxRuntime.jsx(MDBox, { mt: 5, mb: 3, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 1, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, xl: 4, children: jsxRuntime.jsx(PlatformSettings, {}) }), jsxRuntime.jsxs(Grid__default["default"], { item: true, xs: 12, md: 6, xl: 4, sx: { display: "flex" }, children: [jsxRuntime.jsx(Divider__default["default"], { orientation: "vertical", sx: { ml: -2, mr: 1 } }), jsxRuntime.jsx(ProfileInfoCard, { title: "profile information", description: "Hi, I\u2019m Alec Thompson, Decisions: If you can\u2019t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).", info: {
                                                fullName: "Alec M. Thompson",
                                                mobile: "(44) 123 1234 123",
                                                email: "alecthompson@mail.com",
                                                location: "USA",
                                            }, social: [
                                                {
                                                    link: "https://www.facebook.com/CreativeTim/",
                                                    icon: jsxRuntime.jsx(FacebookIcon__default["default"], {}),
                                                    color: "facebook",
                                                },
                                                {
                                                    link: "https://twitter.com/creativetim",
                                                    icon: jsxRuntime.jsx(TwitterIcon__default["default"], {}),
                                                    color: "twitter",
                                                },
                                                {
                                                    link: "https://www.instagram.com/creativetimofficial/",
                                                    icon: jsxRuntime.jsx(InstagramIcon__default["default"], {}),
                                                    color: "instagram",
                                                },
                                            ], action: { route: "", tooltip: "Edit Profile" }, shadow: false }), jsxRuntime.jsx(Divider__default["default"], { orientation: "vertical", sx: { mx: 0 } })] }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, xl: 4, children: jsxRuntime.jsx(ProfilesList, { title: "conversations", profiles: profileListData, shadow: false }) })] }) }), jsxRuntime.jsxs(MDBox, { pt: 2, px: 2, lineHeight: 1.25, children: [jsxRuntime.jsx(MDTypography, { variant: "h6", fontWeight: "medium", children: "Projects" }), jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Architects design houses" }) })] }), jsxRuntime.jsx(MDBox, { p: 2, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 6, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, xl: 3, children: jsxRuntime.jsx(DefaultProjectCard, { image: homeDecor1__default["default"], label: "project #2", title: "modern", description: "As Uber works through a huge amount of internal management turmoil.", action: {
                                            type: "internal",
                                            route: "/pages/profile/profile-overview",
                                            color: "info",
                                            label: "view project",
                                        }, authors: [
                                            { image: team1__default["default"], name: "Elena Morison" },
                                            { image: team2__default["default"], name: "Ryan Milly" },
                                            { image: team3__default["default"], name: "Nick Daniel" },
                                            { image: team4__default["default"], name: "Peterson" },
                                        ] }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, xl: 3, children: jsxRuntime.jsx(DefaultProjectCard, { image: homeDecor2__default["default"], label: "project #1", title: "scandinavian", description: "Music is something that everyone has their own specific opinion about.", action: {
                                            type: "internal",
                                            route: "/pages/profile/profile-overview",
                                            color: "info",
                                            label: "view project",
                                        }, authors: [
                                            { image: team3__default["default"], name: "Nick Daniel" },
                                            { image: team4__default["default"], name: "Peterson" },
                                            { image: team1__default["default"], name: "Elena Morison" },
                                            { image: team2__default["default"], name: "Ryan Milly" },
                                        ] }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, xl: 3, children: jsxRuntime.jsx(DefaultProjectCard, { image: homeDecor3__default["default"], label: "project #3", title: "minimalist", description: "Different people have different taste, and various types of music.", action: {
                                            type: "internal",
                                            route: "/pages/profile/profile-overview",
                                            color: "info",
                                            label: "view project",
                                        }, authors: [
                                            { image: team4__default["default"], name: "Peterson" },
                                            { image: team3__default["default"], name: "Nick Daniel" },
                                            { image: team2__default["default"], name: "Ryan Milly" },
                                            { image: team1__default["default"], name: "Elena Morison" },
                                        ] }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, xl: 3, children: jsxRuntime.jsx(DefaultProjectCard, { image: homeDecor4__default["default"], label: "project #4", title: "gothic", description: "Why would anyone pick blue over pink? Pink is obviously a better color.", action: {
                                            type: "internal",
                                            route: "/pages/profile/profile-overview",
                                            color: "info",
                                            label: "view project",
                                        }, authors: [
                                            { image: team4__default["default"], name: "Peterson" },
                                            { image: team3__default["default"], name: "Nick Daniel" },
                                            { image: team2__default["default"], name: "Ryan Milly" },
                                            { image: team1__default["default"], name: "Elena Morison" },
                                        ] }) })] }) })] }), jsxRuntime.jsx(Footer$1, {})] }));
}

function BaseLayout({ stickyNavbar, children }) {
    const [tabsOrientation, setTabsOrientation] = react.useState("horizontal");
    const [tabValue, setTabValue] = react.useState(0);
    react.useEffect(() => {
        // A function that sets the orientation state of the tabs.
        function handleTabsOrientation() {
            return window.innerWidth < breakpoints$1.values.sm
                ? setTabsOrientation("vertical")
                : setTabsOrientation("horizontal");
        }
        /**
         The event listener that's calling the handleTabsOrientation function when resizing the window.
        */
        window.addEventListener("resize", handleTabsOrientation);
        // Call the handleTabsOrientation function to set the state with the initial value.
        handleTabsOrientation();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleTabsOrientation);
    }, [tabsOrientation]);
    const handleSetTabValue = (event, newValue) => setTabValue(newValue);
    return (jsxRuntime.jsxs(DashboardLayout, { children: [jsxRuntime.jsx(DashboardNavbar, { absolute: !stickyNavbar, isMini: true }), jsxRuntime.jsxs(MDBox, { mt: stickyNavbar ? 3 : 10, children: [jsxRuntime.jsx(Grid__default["default"], { container: true, children: jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 8, lg: 4, children: jsxRuntime.jsx(AppBar__default["default"], { position: "static", children: jsxRuntime.jsxs(Tabs__default["default"], { orientation: tabsOrientation, value: tabValue, onChange: handleSetTabValue, children: [jsxRuntime.jsx(Tab__default["default"], { label: "Messages" }), jsxRuntime.jsx(Tab__default["default"], { label: "Social" }), jsxRuntime.jsx(Tab__default["default"], { label: "Notifications" }), jsxRuntime.jsx(Tab__default["default"], { label: "Backup" })] }) }) }) }), children] }), jsxRuntime.jsx(Footer$1, {})] }));
}
// Declaring default props for BaseLayout
BaseLayout.defaultProps = {
    stickyNavbar: false,
};

function Sidenav() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const sidenavItems = [
        { icon: "person", label: "profile", href: "profile" },
        { icon: "receipt_long", label: "basic info", href: "basic-info" },
        { icon: "lock", label: "change password", href: "change-password" },
        { icon: "security", label: "2FA", href: "2fa" },
        { icon: "badge", label: "accounts", href: "accounts" },
        { icon: "campaign", label: "notifications", href: "notifications" },
        { icon: "settings_applications", label: "sessions", href: "sessions" },
        { icon: "delete", label: "delete account", href: "delete-account" },
    ];
    const renderSidenavItems = sidenavItems.map(({ icon, label, href }, key) => {
        const itemKey = `item-${key}`;
        return (jsxRuntime.jsx(MDBox, { component: "li", pt: key === 0 ? 0 : 1, children: jsxRuntime.jsxs(MDTypography, { component: "a", href: `#${href}`, variant: "button", fontWeight: "regular", textTransform: "capitalize", sx: ({ borders: { borderRadius }, functions: { pxToRem }, palette: { light }, transitions, }) => ({
                    display: "flex",
                    alignItems: "center",
                    borderRadius: borderRadius.md,
                    padding: `${pxToRem(10)} ${pxToRem(16)}`,
                    transition: transitions.create("background-color", {
                        easing: transitions.easing.easeInOut,
                        duration: transitions.duration.shorter,
                    }),
                    "&:hover": {
                        backgroundColor: light.main,
                    },
                }), children: [jsxRuntime.jsx(MDBox, { mr: 1.5, lineHeight: 1, color: darkMode ? "white" : "dark", children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "small", children: icon }) }), label] }) }, itemKey));
    });
    return (jsxRuntime.jsx(Card__default["default"], { sx: {
            borderRadius: ({ borders: { borderRadius } }) => borderRadius.lg,
            position: "sticky",
            top: "1%",
        }, children: jsxRuntime.jsx(MDBox, { component: "ul", display: "flex", flexDirection: "column", p: 2, m: 0, sx: { listStyle: "none" }, children: renderSidenavItems }) }));
}

function Header() {
    const [visible, setVisible] = react.useState(true);
    const handleSetVisible = () => setVisible(!visible);
    return (jsxRuntime.jsx(Card__default["default"], { id: "profile", children: jsxRuntime.jsx(MDBox, { p: 2, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, alignItems: "center", children: [jsxRuntime.jsx(Grid__default["default"], { item: true, children: jsxRuntime.jsx(MDAvatar, { src: burceMars__default["default"], alt: "profile-image", size: "xl", shadow: "sm" }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, children: jsxRuntime.jsxs(MDBox, { height: "100%", mt: 0.5, lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "medium", children: "Alex Thompson" }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "medium", children: "CEO / Co-Founder" })] }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, lg: 3, sx: { ml: "auto" }, children: jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: { md: "flex-end" }, alignItems: "center", lineHeight: 1, children: [jsxRuntime.jsxs(MDTypography, { variant: "caption", fontWeight: "regular", children: ["Switch to ", visible ? "invisible" : "visible"] }), jsxRuntime.jsx(MDBox, { ml: 1, children: jsxRuntime.jsx(Switch__default["default"], { checked: visible, onChange: handleSetVisible }) })] }) })] }) }) }));
}

function FormField({ label, ...rest }) {
    return (jsxRuntime.jsx(MDInput, { variant: "standard", label: label, fullWidth: true, InputLabelProps: { shrink: true }, ...rest }));
}
// Declaring default props for FormField
FormField.defaultProps = {
    label: " ",
};

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
const selectData = {
    gender: ["Male", "Female"],
    birthDate: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    days: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
    ],
    years: [
        "1900",
        "1901",
        "1902",
        "1903",
        "1904",
        "1905",
        "1906",
        "1907",
        "1908",
        "1909",
        "1910",
        "1911",
        "1912",
        "1913",
        "1914",
        "1915",
        "1915",
        "1915",
        "1916",
        "1917",
        "1918",
        "1919",
        "1920",
        "1921",
        "1922",
        "1923",
        "1924",
        "1925",
        "1926",
        "1927",
        "1928",
        "1929",
        "1930",
        "1931",
        "1932",
        "1933",
        "1934",
        "1935",
        "1936",
        "1937",
        "1938",
        "1939",
        "1940",
        "1941",
        "1942",
        "1943",
        "1944",
        "1945",
        "1946",
        "1947",
        "1948",
        "1949",
        "1950",
        "1951",
        "1952",
        "1953",
        "1954",
        "1955",
        "1956",
        "1957",
        "1958",
        "1959",
        "1960",
        "1961",
        "1962",
        "1963",
        "1964",
        "1965",
        "1966",
        "1967",
        "1968",
        "1969",
        "1970",
        "1971",
        "1972",
        "1973",
        "1974",
        "1975",
        "1976",
        "1977",
        "1978",
        "1979",
        "1980",
        "1981",
        "1982",
        "1983",
        "1984",
        "1985",
        "1986",
        "1987",
        "1988",
        "1989",
        "1990",
        "1991",
        "1992",
        "1993",
        "1994",
        "1995",
        "1996",
        "1997",
        "1998",
        "1999",
        "2000",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
    ],
    skills: ["react", "vue", "angular", "svelte", "javascript"],
};

function BasicInfo() {
    return (jsxRuntime.jsxs(Card__default["default"], { id: "basic-info", sx: { overflow: "visible" }, children: [jsxRuntime.jsx(MDBox, { p: 3, children: jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Basic Info" }) }), jsxRuntime.jsx(MDBox, { component: "form", pb: 3, px: 3, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, children: jsxRuntime.jsx(FormField, { label: "First Name", placeholder: "Alec" }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, children: jsxRuntime.jsx(FormField, { label: "Last Name", placeholder: "Thompson" }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 4, children: jsxRuntime.jsx(Autocomplete__default["default"], { defaultValue: "Male", options: selectData.gender, renderInput: (params) => (jsxRuntime.jsx(FormField, { ...params, label: "I'm", InputLabelProps: { shrink: true } })) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 8, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 5, children: jsxRuntime.jsx(Autocomplete__default["default"], { defaultValue: "February", options: selectData.birthDate, renderInput: (params) => (jsxRuntime.jsx(FormField, { ...params, label: "Birth Date", InputLabelProps: { shrink: true } })) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 4, children: jsxRuntime.jsx(Autocomplete__default["default"], { defaultValue: "1", options: selectData.days, renderInput: (params) => (jsxRuntime.jsx(FormField, { ...params, InputLabelProps: { shrink: true } })) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 3, children: jsxRuntime.jsx(Autocomplete__default["default"], { defaultValue: "2021", options: selectData.years, renderInput: (params) => (jsxRuntime.jsx(FormField, { ...params, InputLabelProps: { shrink: true } })) }) })] }) })] }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, children: jsxRuntime.jsx(FormField, { label: "Email", placeholder: "example@email.com", inputProps: { type: "email" } }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, children: jsxRuntime.jsx(FormField, { label: "confirmation email", placeholder: "example@email.com", inputProps: { type: "email" } }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, children: jsxRuntime.jsx(FormField, { label: "your location", placeholder: "Sydney, A" }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, sm: 6, children: jsxRuntime.jsx(FormField, { label: "Phone Number", placeholder: "+40 735 631 620", inputProps: { type: "number" } }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, children: jsxRuntime.jsx(FormField, { label: "Language", placeholder: "English" }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, md: 6, children: jsxRuntime.jsx(Autocomplete__default["default"], { multiple: true, defaultValue: ["react", "angular"], options: selectData.skills, renderInput: (params) => jsxRuntime.jsx(FormField, { ...params, InputLabelProps: { shrink: true } }) }) })] }) })] }));
}

function ChangePassword() {
    const passwordRequirements = [
        "One special characters",
        "Min 6 characters",
        "One number (2 are recommended)",
        "Change it often",
    ];
    const renderPasswordRequirements = passwordRequirements.map((item, key) => {
        const itemKey = `element-${key}`;
        return (jsxRuntime.jsx(MDBox, { component: "li", color: "text", fontSize: "1.25rem", lineHeight: 1, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "regular", verticalAlign: "middle", children: item }) }, itemKey));
    });
    return (jsxRuntime.jsxs(Card__default["default"], { id: "change-password", children: [jsxRuntime.jsx(MDBox, { p: 3, children: jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Change Password" }) }), jsxRuntime.jsxs(MDBox, { component: "form", pb: 3, px: 3, children: [jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(MDInput, { fullWidth: true, label: "Current Password", inputProps: { type: "password", autoComplete: "" } }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(MDInput, { fullWidth: true, label: "New Password", inputProps: { type: "password", autoComplete: "" } }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(MDInput, { fullWidth: true, label: "Confirm New Password", inputProps: { type: "password", autoComplete: "" } }) })] }), jsxRuntime.jsx(MDBox, { mt: 6, mb: 1, children: jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Password requirements" }) }), jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDTypography, { variant: "body2", color: "text", children: "Please follow this guide for a strong password" }) }), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", children: [jsxRuntime.jsx(MDBox, { component: "ul", m: 0, pl: 3.25, mb: { xs: 8, sm: 0 }, children: renderPasswordRequirements }), jsxRuntime.jsx(MDBox, { ml: "auto", children: jsxRuntime.jsx(MDButton, { variant: "gradient", color: "dark", size: "small", children: "update password" }) })] })] })] }));
}

function Authentication() {
    return (jsxRuntime.jsxs(Card__default["default"], { id: "2fa", sx: { overflow: "visible" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Two-factor authentication" }), jsxRuntime.jsx(MDBadge, { variant: "contained", color: "success", badgeContent: "enabled", container: true })] }), jsxRuntime.jsxs(MDBox, { p: 3, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDTypography, { variant: "body2", color: "text", children: "Security keys" }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDBox, { mx: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "regular", children: "No Security keys" }) }), jsxRuntime.jsx(MDButton, { variant: "outlined", color: "dark", size: "small", children: "add" })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDTypography, { variant: "body2", color: "text", children: "SMS number" }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDBox, { mx: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "regular", children: "+3012374423" }) }), jsxRuntime.jsx(MDButton, { variant: "outlined", color: "dark", size: "small", children: "edit" })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDTypography, { variant: "body2", color: "text", children: "Authenticator app" }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDBox, { mx: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "regular", children: "Not Configured" }) }), jsxRuntime.jsx(MDButton, { variant: "outlined", color: "dark", size: "small", children: "set up" })] })] })] })] }));
}

function Accounts() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [slack2FA, setSlack2FA] = react.useState(true);
    const [spotify2FA, setSpotify2FA] = react.useState(true);
    const [atlassian2FA, setAtlassian2FA] = react.useState(true);
    const [asana2FA, setAsana2FA] = react.useState(false);
    const handleSetSlack2FA = () => setSlack2FA(!slack2FA);
    const handleSetSpotify2FA = () => setSpotify2FA(!spotify2FA);
    const handleSetAtlassian2FA = () => setAtlassian2FA(!atlassian2FA);
    const handleSetAsana2FA = () => setAsana2FA(!asana2FA);
    return (jsxRuntime.jsxs(Card__default["default"], { id: "accounts", children: [jsxRuntime.jsxs(MDBox, { p: 3, lineHeight: 1, children: [jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Accounts" }) }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Here you can setup and manage your integration settings." })] }), jsxRuntime.jsxs(MDBox, { pt: 2, pb: 3, px: 3, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDAvatar, { src: logoSlack__default["default"], alt: "Slack logo", variant: "rounded" }), jsxRuntime.jsxs(MDBox, { ml: 2, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "medium", children: "Slack" }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "flex-end", children: [jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Show less" }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", sx: { lineHeight: 0 }, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "small", children: "expand_less" }) })] })] })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", justifyContent: "flex-end", width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 }, children: [jsxRuntime.jsx(MDBox, { lineHeight: 0, mx: 2, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: slack2FA ? "Enabled" : "Disabled" }) }), jsxRuntime.jsx(MDBox, { mr: 1, children: jsxRuntime.jsx(Switch__default["default"], { checked: slack2FA, onChange: handleSetSlack2FA }) })] })] }), jsxRuntime.jsxs(MDBox, { ml: 2, pl: 6, pt: 2, lineHeight: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "You haven't added your Slack yet or you aren't authorized. Please add our Slack Bot to your account by clicking on here. When you've added the bot, send your verification code that you have received." }), jsxRuntime.jsxs(MDBox, { bgColor: darkMode ? "grey-900" : "grey-100", borderRadius: "lg", display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, my: 3, py: 1, pl: { xs: 1, sm: 2 }, pr: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "medium", color: "text", children: "Verification Code" }), jsxRuntime.jsx(MDBox, { width: { xs: "100%", sm: "25%", md: "15%" }, mt: { xs: 1, sm: 0 }, children: jsxRuntime.jsx(Tooltip__default["default"], { title: "Copy", placement: "top", children: jsxRuntime.jsx(MDInput, { size: "small", value: "1172913" }) }) })] }), jsxRuntime.jsxs(MDBox, { bgColor: darkMode ? "grey-900" : "grey-100", borderRadius: "lg", display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, my: 3, py: 1, pl: { xs: 1, sm: 2 }, pr: 1, children: [jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "medium", color: "text", children: "Connected account" }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDBox, { mr: 2, mb: { xs: 1, sm: 0 }, lineHeight: 0, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "medium", children: "hello@creative-tim.com" }) }), jsxRuntime.jsx(MDButton, { variant: "gradient", color: "dark", size: "small", children: "delete" })] })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDAvatar, { src: logoSpotify__default["default"], alt: "Slack logo", variant: "rounded" }), jsxRuntime.jsxs(MDBox, { ml: 2, lineHeight: 0, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "medium", children: "Spotify" }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Music" })] })] }), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "flex-end", alignItems: "center", width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 }, children: [jsxRuntime.jsx(MDBox, { lineHeight: 0, mx: 2, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: spotify2FA ? "Enabled" : "Disabled" }) }), jsxRuntime.jsx(MDBox, { mr: 1, children: jsxRuntime.jsx(Switch__default["default"], { checked: spotify2FA, onChange: handleSetSpotify2FA }) })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDAvatar, { src: logoAtlassian__default["default"], alt: "Slack logo", variant: "rounded" }), jsxRuntime.jsxs(MDBox, { ml: 2, lineHeight: 0, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "medium", children: "Atlassian" }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Payment vendor" })] })] }), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "flex-end", alignItems: "center", width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 }, children: [jsxRuntime.jsx(MDBox, { lineHeight: 0, mx: 2, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: atlassian2FA ? "Enabled" : "Disabled" }) }), jsxRuntime.jsx(MDBox, { mr: 1, children: jsxRuntime.jsx(Switch__default["default"], { checked: atlassian2FA, onChange: handleSetAtlassian2FA }) })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDAvatar, { src: logoAsana__default["default"], alt: "Slack logo", variant: "rounded" }), jsxRuntime.jsxs(MDBox, { ml: 2, lineHeight: 0, children: [jsxRuntime.jsx(MDTypography, { variant: "h5", fontWeight: "medium", children: "Asana" }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Organize your team" })] })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", justifyContent: "flex-end", width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 }, children: [jsxRuntime.jsx(MDBox, { lineHeight: 0, mx: 2, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: asana2FA ? "Enabled" : "Disabled" }) }), jsxRuntime.jsx(MDBox, { mr: 1, children: jsxRuntime.jsx(Switch__default["default"], { checked: asana2FA, onChange: handleSetAsana2FA }) })] })] })] })] }));
}

function TableCell({ width, align, padding, noBorder, children }) {
    return (jsxRuntime.jsx(MDBox, { component: "th", width: width, pt: padding[0], pr: padding[1], pb: padding[2], pl: padding[3], textAlign: align, sx: {
            border: ({ borders: { borderWidth }, palette: { light } }) => noBorder ? 0 : `${borderWidth[1]} solid ${light.main}`,
        }, children: jsxRuntime.jsx(MDTypography, { component: "div", variant: "body2", color: "text", children: children }) }));
}
// Declaring default props for TableCell
TableCell.defaultProps = {
    width: "auto",
    align: "left",
    padding: [],
    noBorder: false,
};

function Notifications() {
    return (jsxRuntime.jsxs(Card__default["default"], { id: "notifications", children: [jsxRuntime.jsxs(MDBox, { p: 3, lineHeight: 1, children: [jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Notifications" }) }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Choose how you receive notifications. These notification settings apply to the things you\u2019re watching." })] }), jsxRuntime.jsx(MDBox, { pb: 3, px: 3, children: jsxRuntime.jsx(MDBox, { minWidth: "auto", sx: { overflow: "scroll" }, children: jsxRuntime.jsxs(Table__default["default"], { sx: { minWidth: "36rem" }, children: [jsxRuntime.jsx(MDBox, { component: "thead", children: jsxRuntime.jsxs(TableRow__default["default"], { children: [jsxRuntime.jsx(TableCell, { width: "100%", padding: [1.5, 3, 1.5, 0.5], children: "Activity" }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1.5, 6, 1.5, 6], children: "Email" }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1.5, 6, 1.5, 6], children: "Push" }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1.5, 6, 1.5, 6], children: "SMS" })] }) }), jsxRuntime.jsxs(TableBody__default["default"], { children: [jsxRuntime.jsxs(TableRow__default["default"], { children: [jsxRuntime.jsx(TableCell, { padding: [1, 1, 1, 0.5], children: jsxRuntime.jsxs(MDBox, { lineHeight: 1.4, children: [jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", fontWeight: "regular", children: "Mentions" }), jsxRuntime.jsx(MDTypography, { variant: "caption", color: "text", fontWeight: "regular", children: "Notify when another user mentions you in a comment" })] }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], { defaultChecked: true }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], {}) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], {}) })] }), jsxRuntime.jsxs(TableRow__default["default"], { children: [jsxRuntime.jsx(TableCell, { padding: [1, 1, 1, 0.5], children: jsxRuntime.jsxs(MDBox, { lineHeight: 1.4, children: [jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", fontWeight: "regular", children: "Comments" }), jsxRuntime.jsx(MDTypography, { variant: "caption", color: "text", fontWeight: "regular", children: "Notify when another user comments your item." })] }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], { defaultChecked: true }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], { defaultChecked: true }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], {}) })] }), jsxRuntime.jsxs(TableRow__default["default"], { children: [jsxRuntime.jsx(TableCell, { padding: [1, 1, 1, 0.5], children: jsxRuntime.jsxs(MDBox, { lineHeight: 1.4, children: [jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", fontWeight: "regular", children: "Follows" }), jsxRuntime.jsx(MDTypography, { variant: "caption", color: "text", fontWeight: "regular", children: "Notify when another user follows you." })] }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], {}) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], { defaultChecked: true }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], children: jsxRuntime.jsx(Switch__default["default"], {}) })] }), jsxRuntime.jsxs(TableRow__default["default"], { children: [jsxRuntime.jsx(TableCell, { padding: [1, 1, 1, 0.5], noBorder: true, children: jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", color: "text", children: "Log in from a new device" }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], noBorder: true, children: jsxRuntime.jsx(Switch__default["default"], { defaultChecked: true }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], noBorder: true, children: jsxRuntime.jsx(Switch__default["default"], { defaultChecked: true }) }), jsxRuntime.jsx(TableCell, { align: "center", padding: [1, 1, 1, 0.5], noBorder: true, children: jsxRuntime.jsx(Switch__default["default"], { defaultChecked: true }) })] })] })] }) }) })] }));
}

function Sessions() {
    const actionButtonStyles = {
        "& .material-icons-round": {
            transform: `translateX(0)`,
            transition: "all 200ms cubic-bezier(0.34,1.61,0.7,1.3)",
        },
        "&:hover .material-icons-round, &:focus .material-icons-round": {
            transform: `translateX(4px)`,
        },
    };
    return (jsxRuntime.jsxs(Card__default["default"], { id: "sessions", children: [jsxRuntime.jsxs(MDBox, { p: 3, lineHeight: 1, children: [jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Sessions" }) }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", fontWeight: "regular", children: "This is a list of devices that have logged into your account. Remove those that you do not recognize." })] }), jsxRuntime.jsxs(MDBox, { pb: 3, px: 3, sx: { overflow: "auto" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", width: { xs: "max-content", sm: "100%" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDBox, { textAlign: "center", color: "text", px: { xs: 0, md: 1.5 }, opacity: 0.6, children: jsxRuntime.jsx(Icon__default["default"], { children: "desktop_windows" }) }), jsxRuntime.jsxs(MDBox, { height: "100%", ml: 2, lineHeight: 1, mr: 2, children: [jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", fontWeight: "regular", color: "text", children: "Bucharest 68.133.163.201" }), jsxRuntime.jsx(MDTypography, { variant: "caption", color: "text", children: "Your current session" })] })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDBadge, { variant: "contained", size: "xs", badgeContent: "active", color: "success", container: true }), jsxRuntime.jsx(MDBox, { mx: 2, lineHeight: 1, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "secondary", fontWeight: "regular", children: "EU" }) }), jsxRuntime.jsxs(MDTypography, { component: "a", href: "#", variant: "button", color: "info", fontWeight: "regular", sx: actionButtonStyles, children: ["See more\u00A0", jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "bold", verticalAlign: "middle" }, children: "arrow_forward" })] })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", width: { xs: "max-content", sm: "100%" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mr: 2, children: [jsxRuntime.jsx(MDBox, { textAlign: "center", color: "text", px: { xs: 0, md: 1.5 }, opacity: 0.6, children: jsxRuntime.jsx(Icon__default["default"], { children: "desktop_windows" }) }), jsxRuntime.jsx(MDBox, { ml: 2, children: jsxRuntime.jsx(MDTypography, { display: "block", variant: "body2", fontWeight: "regular", color: "text", children: "Chrome on macOS" }) })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDBox, { mx: 2, lineHeight: 1, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "secondary", fontWeight: "regular", children: "US" }) }), jsxRuntime.jsxs(MDTypography, { component: "a", href: "#", variant: "button", color: "info", fontWeight: "regular", sx: actionButtonStyles, children: ["See more\u00A0", jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "bold", verticalAlign: "middle" }, children: "arrow_forward" })] })] })] }), jsxRuntime.jsx(Divider__default["default"], {}), jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "center", width: { xs: "max-content", sm: "100%" }, children: [jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", mr: 2, children: [jsxRuntime.jsx(MDBox, { textAlign: "center", color: "text", px: { xs: 0, md: 1.5 }, opacity: 0.6, children: jsxRuntime.jsx(Icon__default["default"], { children: "phone_iphone" }) }), jsxRuntime.jsx(MDBox, { ml: 2, children: jsxRuntime.jsx(MDTypography, { display: "block", variant: "body2", fontWeight: "regular", color: "text", children: "Safari on iPhone" }) })] }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", children: [jsxRuntime.jsx(MDBox, { mx: 2, lineHeight: 1, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "secondary", fontWeight: "regular", children: "US" }) }), jsxRuntime.jsxs(MDTypography, { component: "a", href: "#", variant: "button", color: "info", fontWeight: "regular", sx: actionButtonStyles, children: ["See more\u00A0", jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "bold", verticalAlign: "middle" }, children: "arrow_forward" })] })] })] })] })] }));
}

function DeleteAccount() {
    return (jsxRuntime.jsx(Card__default["default"], { id: "delete-account", children: jsxRuntime.jsxs(MDBox, { pr: 3, display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsxs(MDBox, { p: 3, lineHeight: 1, children: [jsxRuntime.jsx(MDBox, { mb: 1, children: jsxRuntime.jsx(MDTypography, { variant: "h5", children: "Delete Account" }) }), jsxRuntime.jsx(MDTypography, { variant: "button", color: "text", children: "Once you delete your account, there is no going back. Please be certain." })] }), jsxRuntime.jsxs(MDBox, { display: "flex", flexDirection: { xs: "column", sm: "row" }, children: [jsxRuntime.jsx(MDButton, { variant: "outlined", color: "secondary", children: "deactivate" }), jsxRuntime.jsx(MDBox, { ml: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 }, children: jsxRuntime.jsx(MDButton, { variant: "gradient", color: "error", sx: { height: "100%" }, children: "delete account" }) })] })] }) }));
}

function Settings() {
    return (jsxRuntime.jsx(BaseLayout, { children: jsxRuntime.jsx(MDBox, { mt: 4, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, lg: 3, children: jsxRuntime.jsx(Sidenav, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, lg: 9, children: jsxRuntime.jsx(MDBox, { mb: 3, children: jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(Header, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(BasicInfo, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(ChangePassword, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(Authentication, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(Accounts, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(Notifications, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(Sessions, {}) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 12, children: jsxRuntime.jsx(DeleteAccount, {}) })] }) }) })] }) }) }));
}

function DefaultNavbarDropdown({ name, icon, children, collapseStatus, light, href, route, collapse, ...rest }) {
    const linkComponent = {
        component: "a",
        href,
        target: "_blank",
        rel: "noreferrer",
    };
    const routeComponent = {
        component: reactRouterDom.Link,
        to: route,
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(MDBox, { ...rest, mx: 1, p: 1, display: "flex", alignItems: "baseline", color: light ? "white" : "dark", opacity: light ? 1 : 0.6, sx: { cursor: "pointer", userSelect: "none" }, ...(route && routeComponent), ...(href && linkComponent), children: [jsxRuntime.jsx(MDTypography, { variant: "body2", lineHeight: 1, color: "inherit", sx: { alignSelf: "center", "& *": { verticalAlign: "middle" } }, children: icon }), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", textTransform: "capitalize", color: light ? "white" : "dark", sx: { fontWeight: "100%", ml: 1, mr: 0.25 }, children: name }), jsxRuntime.jsx(MDTypography, { variant: "body2", color: light ? "white" : "dark", ml: "auto", children: jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "normal", verticalAlign: "middle" }, children: collapse && "keyboard_arrow_down" }) })] }), children && (jsxRuntime.jsx(Collapse__default["default"], { in: Boolean(collapseStatus), timeout: 400, unmountOnExit: true, children: children }))] }));
}
// Declaring default props for DefaultNavbarDropdown
DefaultNavbarDropdown.defaultProps = {
    icon: false,
    children: false,
    collapseStatus: false,
    light: false,
    href: "",
    route: "",
};

function DefaultNavbarMobile({ routes, open }) {
    const [collapse, setCollapse] = react.useState("");
    const handleSetCollapse = (name) => collapse === name ? setCollapse(false) : setCollapse(name);
    const renderNavbarItems = routes.map(({ name, icon, collapse: routeCollapses, href, route, collapse: navCollapse }) => (jsxRuntime.jsx(DefaultNavbarDropdown, { name: name, icon: icon, collapseStatus: name === collapse, onClick: () => handleSetCollapse(name), href: href, route: route, collapse: Boolean(navCollapse), children: jsxRuntime.jsx(MDBox, { sx: { height: "15rem", maxHeight: "15rem", overflowY: "scroll" }, children: routeCollapses &&
                routeCollapses.map((item) => (jsxRuntime.jsx(MDBox, { px: 2, children: item.collapse ? (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", fontWeight: "bold", textTransform: "capitalize", py: 1, px: 0.5, children: item.name }), item.collapse.map((el) => (jsxRuntime.jsx(MDTypography, { component: el.route ? reactRouterDom.Link : Link__default["default"], to: el.route ? el.route : "", href: el.href ? el.href : "", target: el.href ? "_blank" : "", rel: el.href ? "noreferrer" : "noreferrer", minWidth: "11.25rem", display: "block", variant: "button", color: "text", textTransform: "capitalize", fontWeight: "regular", py: 0.625, px: 2, sx: ({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                                    borderRadius: borderRadius.md,
                                    cursor: "pointer",
                                    transition: "all 300ms linear",
                                    "&:hover": {
                                        backgroundColor: grey[200],
                                        color: dark.main,
                                    },
                                }), children: el.name }, el.name)))] })) : (jsxRuntime.jsxs(MDBox, { display: "block", component: item.route ? reactRouterDom.Link : Link__default["default"], to: item.route ? item.route : "", href: item.href ? item.href : "", target: item.href ? "_blank" : "", rel: item.href ? "noreferrer" : "noreferrer", sx: ({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                            borderRadius: borderRadius.md,
                            cursor: "pointer",
                            transition: "all 300ms linear",
                            py: 1,
                            px: 1.625,
                            "&:hover": {
                                backgroundColor: grey[200],
                                color: dark.main,
                                "& *": {
                                    color: dark.main,
                                },
                            },
                        }), children: [jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", fontWeight: "bold", textTransform: "capitalize", children: item.name }), jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", color: "text", fontWeight: "regular", sx: { transition: "all 300ms linear" }, children: item.description })] }, item.key)) }, item.name))) }) }, name)));
    return (jsxRuntime.jsx(Collapse__default["default"], { in: Boolean(open), timeout: "auto", unmountOnExit: true, children: jsxRuntime.jsx(MDBox, { width: "calc(100% + 1.625rem)", my: 2, ml: -2, children: renderNavbarItems }) }));
}

function NewGrow(props) {
    return jsxRuntime.jsx(Grow__default["default"], { ...props });
}
function DefaultNavbar({ routes, brand, transparent, light, action }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [dropdown, setDropdown] = react.useState("");
    const [dropdownEl, setDropdownEl] = react.useState("");
    const [dropdownName, setDropdownName] = react.useState("");
    const [nestedDropdown, setNestedDropdown] = react.useState("");
    const [nestedDropdownEl, setNestedDropdownEl] = react.useState("");
    const [nestedDropdownName, setNestedDropdownName] = react.useState("");
    const [arrowRef, setArrowRef] = react.useState(null);
    const [mobileNavbar, setMobileNavbar] = react.useState(false);
    const [mobileView, setMobileView] = react.useState(false);
    const openMobileNavbar = () => setMobileNavbar(!mobileNavbar);
    react.useEffect(() => {
        // A function that sets the display state for the DefaultNavbarMobile.
        function displayMobileNavbar() {
            if (window.innerWidth < breakpoints$1.values.lg) {
                setMobileView(true);
                setMobileNavbar(false);
            }
            else {
                setMobileView(false);
                setMobileNavbar(false);
            }
        }
        /**
         The event listener that's calling the displayMobileNavbar function when
         resizing the window.
        */
        window.addEventListener("resize", displayMobileNavbar);
        // Call the displayMobileNavbar function to set the state with the initial value.
        displayMobileNavbar();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", displayMobileNavbar);
    }, []);
    const renderNavbarItems = routes.map(({ name, icon, href, route, collapse }) => (jsxRuntime.jsx(DefaultNavbarDropdown, { name: name, icon: icon, href: href, route: route, collapse: Boolean(collapse), onMouseEnter: ({ currentTarget }) => {
            if (collapse) {
                setDropdown(currentTarget);
                setDropdownEl(currentTarget);
                setDropdownName(name);
            }
        }, onMouseLeave: () => collapse && setDropdown(null), light: light }, name)));
    // Render the routes on the dropdown menu
    const renderRoutes = routes.map(({ name, collapse, columns, rowsPerColumn }) => {
        let template;
        // Render the dropdown menu that should be display as columns
        if (collapse && columns && name === dropdownName) {
            const calculateColumns = collapse.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / rowsPerColumn);
                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [];
                }
                resultArray[chunkIndex].push(item);
                return resultArray;
            }, []);
            template = (jsxRuntime.jsx(Grid__default["default"], { container: true, spacing: 3, py: 1, px: 1.5, children: calculateColumns.map((cols, key) => {
                    const gridKey = `grid-${key}`;
                    const dividerKey = `divider-${key}`;
                    return (jsxRuntime.jsxs(Grid__default["default"], { item: true, xs: 12 / columns, sx: { position: "relative" }, children: [cols.map((col, index) => (jsxRuntime.jsxs(react.Fragment, { children: [jsxRuntime.jsxs(MDBox, { width: "100%", display: "flex", alignItems: "center", py: 1, mt: index !== 0 ? 2 : 0, children: [jsxRuntime.jsx(MDBox, { display: "flex", justifyContent: "center", alignItems: "center", width: "1.5rem", height: "1.5rem", borderRadius: "md", color: "text", mr: 1, fontSize: "1rem", lineHeight: 1, children: col.icon }), jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", fontWeight: "bold", textTransform: "capitalize", children: col.name })] }), col.collapse.map((item) => (jsxRuntime.jsx(MDTypography, { component: item.route ? reactRouterDom.Link : Link__default["default"], to: item.route ? item.route : "", href: item.href ? item.href : (e) => e.preventDefault(), target: item.href ? "_blank" : "", rel: item.href ? "noreferrer" : "noreferrer", minWidth: "11.25rem", display: "block", variant: "button", color: "text", textTransform: "capitalize", fontWeight: "regular", py: 0.625, px: 2, sx: ({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                                            borderRadius: borderRadius.md,
                                            cursor: "pointer",
                                            transition: "all 300ms linear",
                                            "&:hover": {
                                                backgroundColor: grey[200],
                                                color: dark.main,
                                            },
                                        }), children: item.name }, item.name)))] }, col.name))), key !== 0 && (jsxRuntime.jsx(Divider__default["default"], { orientation: "vertical", sx: {
                                    position: "absolute",
                                    top: "50%",
                                    left: "-4px",
                                    transform: "translateY(-45%)",
                                    height: "90%",
                                } }, dividerKey))] }, gridKey));
                }) }, name));
            // Render the dropdown menu that should be display as list items
        }
        else if (collapse && name === dropdownName) {
            template = collapse.map((item) => {
                const linkComponent = {
                    component: Link__default["default"],
                    href: item.href,
                    target: "_blank",
                    rel: "noreferrer",
                };
                const routeComponent = {
                    component: reactRouterDom.Link,
                    to: item.route,
                };
                return (jsxRuntime.jsxs(MDTypography, { ...(item.route ? routeComponent : linkComponent), display: "flex", justifyContent: "space-between", alignItems: "center", variant: "button", textTransform: "capitalize", minWidth: item.description ? "14rem" : "12rem", color: item.description ? "dark" : "text", fontWeight: item.description ? "bold" : "regular", py: item.description ? 1 : 0.625, px: 2, sx: ({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                        borderRadius: borderRadius.md,
                        cursor: "pointer",
                        transition: "all 300ms linear",
                        "&:hover": {
                            backgroundColor: grey[200],
                            color: dark.main,
                            "& *": {
                                color: dark.main,
                            },
                        },
                    }), onMouseEnter: ({ currentTarget }) => {
                        if (item.dropdown) {
                            setNestedDropdown(currentTarget);
                            setNestedDropdownEl(currentTarget);
                            setNestedDropdownName(item.name);
                        }
                    }, onMouseLeave: () => {
                        if (item.dropdown) {
                            setNestedDropdown(null);
                        }
                    }, children: [item.description ? (jsxRuntime.jsxs(MDBox, { display: "flex", py: 0.25, fontSize: "1rem", color: "text", children: [typeof item.icon === "string" ? (jsxRuntime.jsx(Icon__default["default"], { color: "inherit", children: item.icon })) : (jsxRuntime.jsx(MDBox, { color: "inherit", children: item.icon })), jsxRuntime.jsxs(MDBox, { pl: 1, lineHeight: 0, children: [jsxRuntime.jsx(MDTypography, { variant: "button", display: "block", fontWeight: "bold", textTransform: "capitalize", children: item.name }), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", children: item.description })] })] })) : (jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", color: "text", children: [jsxRuntime.jsx(Icon__default["default"], { sx: { mr: 1 }, children: item.icon }), item.name] })), item.collapse && (jsxRuntime.jsx(Icon__default["default"], { sx: { fontWeight: "normal", verticalAlign: "middle", mr: -0.5 }, children: "keyboard_arrow_right" }))] }, item.name));
            });
        }
        return template;
    });
    // Routes dropdown menu
    const dropdownMenu = (jsxRuntime.jsx(Popper__default["default"], { anchorEl: dropdown, popperRef: null, open: Boolean(dropdown), placement: "top-start", transition: true, style: { zIndex: 10 }, modifiers: [
            {
                name: "arrow",
                enabled: true,
                options: {
                    element: arrowRef,
                },
            },
        ], onMouseEnter: () => setDropdown(dropdownEl), onMouseLeave: () => {
            if (!nestedDropdown) {
                setDropdown(null);
                setDropdownName("");
            }
        }, children: ({ TransitionProps }) => (jsxRuntime.jsx(NewGrow, { ...TransitionProps, sx: {
                transformOrigin: "left top",
                background: ({ palette: { white } }) => white.main,
            }, children: jsxRuntime.jsxs(MDBox, { borderRadius: "lg", children: [jsxRuntime.jsx(MDTypography, { variant: "h1", color: "white", children: jsxRuntime.jsx(Icon__default["default"], { ref: setArrowRef, sx: { mt: -3 }, children: "arrow_drop_up" }) }), jsxRuntime.jsx(MDBox, { shadow: "lg", borderRadius: "lg", p: 1.625, mt: 1, children: renderRoutes })] }) })) }));
    // Render routes that are nested inside the dropdown menu routes
    const renderNestedRoutes = routes.map(({ collapse, columns }) => collapse && !columns
        ? collapse.map(({ name: parentName, collapse: nestedCollapse }) => {
            let template;
            if (parentName === nestedDropdownName) {
                template =
                    nestedCollapse &&
                        nestedCollapse.map((item) => {
                            const linkComponent = {
                                component: Link__default["default"],
                                href: item.href,
                                target: "_blank",
                                rel: "noreferrer",
                            };
                            const routeComponent = {
                                component: reactRouterDom.Link,
                                to: item.route,
                            };
                            return (jsxRuntime.jsxs(MDTypography, { ...(item.route ? routeComponent : linkComponent), display: "flex", justifyContent: "space-between", alignItems: "center", variant: "button", textTransform: "capitalize", minWidth: item.description ? "14rem" : "12rem", color: item.description ? "dark" : "text", fontWeight: item.description ? "bold" : "regular", py: item.description ? 1 : 0.625, px: 2, sx: ({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                                    borderRadius: borderRadius.md,
                                    cursor: "pointer",
                                    transition: "all 300ms linear",
                                    "&:hover": {
                                        backgroundColor: grey[200],
                                        color: dark.main,
                                        "& *": {
                                            color: dark.main,
                                        },
                                    },
                                }), children: [item.description ? (jsxRuntime.jsxs(MDBox, { children: [item.name, jsxRuntime.jsx(MDTypography, { display: "block", variant: "button", color: "text", fontWeight: "regular", sx: { transition: "all 300ms linear" }, children: item.description })] })) : (item.name), item.collapse && (jsxRuntime.jsx(Icon__default["default"], { fontSize: "small", sx: { fontWeight: "normal", verticalAlign: "middle", mr: -0.5 }, children: "keyboard_arrow_right" }))] }, item.name));
                        });
            }
            return template;
        })
        : null);
    // Dropdown menu for the nested dropdowns
    const nestedDropdownMenu = (jsxRuntime.jsx(Popper__default["default"], { anchorEl: nestedDropdown, popperRef: null, open: Boolean(nestedDropdown), placement: "right-start", transition: true, style: { zIndex: 10 }, onMouseEnter: () => {
            setNestedDropdown(nestedDropdownEl);
        }, onMouseLeave: () => {
            setNestedDropdown(null);
            setNestedDropdownName("");
            setDropdown(null);
        }, children: ({ TransitionProps }) => (jsxRuntime.jsx(NewGrow, { ...TransitionProps, sx: {
                transformOrigin: "left top",
                background: ({ palette: { white } }) => white.main,
            }, children: jsxRuntime.jsx(MDBox, { ml: 2.5, mt: -2.5, borderRadius: "lg", children: jsxRuntime.jsx(MDBox, { shadow: "lg", borderRadius: "lg", py: 1.5, px: 1, mt: 2, children: renderNestedRoutes }) }) })) }));
    return (jsxRuntime.jsxs(Container__default["default"], { children: [jsxRuntime.jsxs(MDBox, { py: 1, px: { xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }, my: 3, mx: 3, width: "calc(100% - 48px)", borderRadius: "lg", shadow: transparent ? "none" : "md", color: light ? "white" : "dark", display: "flex", justifyContent: "space-between", alignItems: "center", position: "absolute", left: 0, zIndex: 3, sx: ({ palette: { transparent: transparentColor, white, background }, functions: { rgba }, }) => ({
                    backgroundColor: transparent
                        ? transparentColor.main
                        : rgba(darkMode ? background.sidenav : white.main, 0.8),
                    backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
                }), children: [jsxRuntime.jsx(MDBox, { component: reactRouterDom.Link, to: "/", py: transparent ? 1.5 : 0.75, lineHeight: 1, pl: { xs: 0, lg: 1 }, children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "bold", color: light ? "white" : "dark", children: brand }) }), jsxRuntime.jsx(MDBox, { color: "inherit", display: { xs: "none", lg: "flex" }, m: 0, p: 0, children: renderNavbarItems }), action &&
                        (action.type === "internal" ? (jsxRuntime.jsx(MDBox, { display: { xs: "none", lg: "inline-block" }, children: jsxRuntime.jsx(MDButton, { component: reactRouterDom.Link, to: action.route, variant: "gradient", color: action.color ? action.color : "info", size: "small", children: action.label }) })) : (jsxRuntime.jsx(MDBox, { display: { xs: "none", lg: "inline-block" }, children: jsxRuntime.jsx(MDButton, { component: "a", href: action.route, target: "_blank", rel: "noreferrer", variant: "gradient", color: action.color ? action.color : "info", size: "small", sx: { mt: -0.3 }, children: action.label }) }))), jsxRuntime.jsx(MDBox, { display: { xs: "inline-block", lg: "none" }, lineHeight: 0, py: 1.5, pl: 1.5, color: "inherit", sx: { cursor: "pointer" }, onClick: openMobileNavbar, children: mobileView && jsxRuntime.jsx(DefaultNavbarMobile, { routes: routes, open: mobileNavbar }) })] }), dropdownMenu, nestedDropdownMenu] }));
}
// Declaring default props for DefaultNavbar
DefaultNavbar.defaultProps = {
    brand: "Material Dashboard PRO",
    transparent: false,
    light: false,
    action: false,
};

function PageLayout({ background, children }) {
    const [, dispatch] = useMaterialUIController();
    const { pathname } = reactRouterDom.useLocation();
    react.useEffect(() => {
        setLayout(dispatch, "page");
    }, [pathname]);
    return (jsxRuntime.jsx(MDBox, { width: "100vw", height: "100%", minHeight: "100vh", bgColor: background, sx: { overflowX: "hidden" }, children: children }));
}
// Declaring default props for PageLayout
PageLayout.defaultProps = {
    background: "default",
};

const pageRoutes = [
    {
        name: "pages",
        columns: 3,
        rowsPerColumn: 2,
        collapse: [
            {
                name: "dashboards",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "dashboard" }),
                collapse: [
                    {
                        name: "analytics",
                        route: "/dashboards/analytics",
                    },
                    {
                        name: "sales",
                        route: "/dashboards/sales",
                    },
                ],
            },
            {
                name: "users",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "people" }),
                collapse: [
                    {
                        name: "reports",
                        route: "/pages/users/reports",
                    },
                ],
            },
            {
                name: "extra",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "queue_play_next" }),
                collapse: [
                    {
                        name: "pricing page",
                        route: "/pages/pricing-page",
                    },
                    { name: "RTL", route: "/pages/rtl" },
                    { name: "widgets", route: "/pages/widgets" },
                    { name: "charts", route: "/pages/charts" },
                    {
                        name: "notfications",
                        route: "/pages/notifications",
                    },
                ],
            },
            {
                name: "projects",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "precision_manufacturing" }),
                collapse: [
                    {
                        name: "timeline",
                        route: "/pages/projects/timeline",
                    },
                ],
            },
            {
                name: "account",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "account_balance" }),
                collapse: [
                    {
                        name: "settings",
                        route: "/pages/account/setting",
                    },
                    {
                        name: "billing",
                        route: "/pages/account/billing",
                    },
                    {
                        name: "invoice",
                        route: "/pages/account/invoice",
                    },
                ],
            },
            {
                name: "profile",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "badge" }),
                collapse: [
                    {
                        name: "profile overview",
                        route: "/pages/profile/profile-overview",
                    },
                    {
                        name: "all projects",
                        route: "/pages/profile/all-projects",
                    },
                ],
            },
        ],
    },
    {
        name: "authenticaton",
        collapse: [
            {
                name: "sign in",
                dropdown: true,
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "login" }),
                collapse: [
                    {
                        name: "basic",
                        route: "/authentication/sign-in/basic",
                    },
                    {
                        name: "cover",
                        route: "/authentication/sign-in/cover",
                    },
                    {
                        name: "illustration",
                        route: "/authentication/sign-in/illustration",
                    },
                ],
            },
            {
                name: "sign up",
                dropdown: true,
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "assignment" }),
                collapse: [
                    {
                        name: "cover",
                        route: "/authentication/sign-up/cover",
                    },
                ],
            },
            {
                name: "reset password",
                dropdown: true,
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "restart_alt" }),
                collapse: [
                    {
                        name: "cover",
                        route: "/authentication/reset-password/cover",
                    },
                ],
            },
        ],
    },
    {
        name: "application",
        collapse: [
            {
                name: "kanban",
                route: "/applications/kanban",
                icon: "widgets",
            },
            {
                name: "wizard",
                route: "/applications/wizard",
                icon: "import_contacts",
            },
            {
                name: "data tables",
                route: "/applications/data-tables",
                icon: "backup_table",
            },
            {
                name: "calendar",
                route: "/applications/calendar",
                icon: "event",
            },
        ],
    },
    {
        name: "ecommerce",
        columns: 2,
        rowsPerColumn: 1,
        collapse: [
            {
                name: "orders",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "shopping_cart" }),
                collapse: [
                    {
                        name: "order list",
                        route: "/ecommerce/orders/order-list",
                    },
                    {
                        name: "order details",
                        route: "/ecommerce/orders/order-details",
                    },
                ],
            },
            {
                name: "products",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "memory" }),
                collapse: [
                    {
                        name: "new product",
                        route: "/ecommerce/products/new-product",
                    },
                    {
                        name: "edit product",
                        route: "/ecommerce/products/edit-product",
                    },
                    {
                        name: "product page",
                        route: "/ecommerce/products/product-page",
                    },
                ],
            },
        ],
    },
    {
        name: "docs",
        collapse: [
            {
                name: "getting started",
                href: "https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/",
                description: "All about overview, quick start, license and contents",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "article" }),
            },
            {
                name: "foundation",
                href: "https://www.creative-tim.com/learning-lab/react/colors/material-dashboard/",
                description: "See our colors, icons and typography",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "grading" }),
            },
            {
                name: "components",
                href: "https://www.creative-tim.com/learning-lab/react/alerts/material-dashboard/",
                description: "Explore our collection of fully designed components",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "apps" }),
            },
            {
                name: "plugins",
                href: "https://www.creative-tim.com/learning-lab/react/datepicker/material-dashboard/",
                description: "Check how you can integrate our plugins",
                icon: jsxRuntime.jsx(Icon__default["default"], { children: "extension" }),
            },
        ],
    },
];

function Footer({ light }) {
    const { size } = typography$1;
    return (jsxRuntime.jsx(MDBox, { position: "absolute", width: "100%", bottom: 0, py: 4, children: jsxRuntime.jsx(Container__default["default"], { children: jsxRuntime.jsxs(MDBox, { width: "100%", display: "flex", flexDirection: { xs: "column", lg: "row" }, justifyContent: "space-between", alignItems: "center", px: 1.5, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", color: light ? "white" : "text", fontSize: size.sm, children: ["\u00A9 ", new Date().getFullYear(), ", made with", jsxRuntime.jsx(MDBox, { fontSize: size.md, color: light ? "white" : "dark", mb: -0.5, mx: 0.25, children: jsxRuntime.jsx(Icon__default["default"], { color: "inherit", fontSize: "inherit", children: "favorite" }) }), "by", jsxRuntime.jsx(Link__default["default"], { href: "https://www.creative-tim.com/", target: "_blank", children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "medium", color: light ? "white" : "dark", children: "\u00A0Creative Tim\u00A0" }) }), "for a better web."] }), jsxRuntime.jsxs(MDBox, { component: "ul", sx: ({ breakpoints }) => ({
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            listStyle: "none",
                            mt: 3,
                            mb: 0,
                            p: 0,
                            [breakpoints.up("lg")]: {
                                mt: 0,
                            },
                        }), children: [jsxRuntime.jsx(MDBox, { component: "li", pr: 2, lineHeight: 1, children: jsxRuntime.jsx(Link__default["default"], { href: "https://www.creative-tim.com/", target: "_blank", children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: light ? "white" : "dark", children: "Creative Tim" }) }) }), jsxRuntime.jsx(MDBox, { component: "li", px: 2, lineHeight: 1, children: jsxRuntime.jsx(Link__default["default"], { href: "https://www.creative-tim.com/presentation", target: "_blank", children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: light ? "white" : "dark", children: "About Us" }) }) }), jsxRuntime.jsx(MDBox, { component: "li", px: 2, lineHeight: 1, children: jsxRuntime.jsx(Link__default["default"], { href: "https://www.creative-tim.com/blog", target: "_blank", children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: light ? "white" : "dark", children: "Blog" }) }) }), jsxRuntime.jsx(MDBox, { component: "li", pl: 2, lineHeight: 1, children: jsxRuntime.jsx(Link__default["default"], { href: "https://www.creative-tim.com/license", target: "_blank", children: jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: light ? "white" : "dark", children: "License" }) }) })] })] }) }) }));
}
// Declaring default props for Footer
Footer.defaultProps = {
    light: false,
};

function BasicLayout({ image, children }) {
    return (jsxRuntime.jsxs(PageLayout, { children: [jsxRuntime.jsx(DefaultNavbar, { routes: pageRoutes, action: {
                    type: "external",
                    route: "https://creative-tim.com/product/material-dashboard-2-pro-react-ts",
                    label: "buy now",
                    color: "info",
                }, transparent: true, light: true }), jsxRuntime.jsx(MDBox, { position: "absolute", width: "100%", minHeight: "100vh", sx: {
                    backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients }, }) => image &&
                        `${linearGradient(rgba(gradients.dark.main, 0.6), rgba(gradients.dark.state, 0.6))}, url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                } }), jsxRuntime.jsx(MDBox, { px: 1, width: "100%", height: "100vh", mx: "auto", children: jsxRuntime.jsx(Grid__default["default"], { container: true, spacing: 1, justifyContent: "center", alignItems: "center", height: "100%", children: jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 11, sm: 9, md: 5, lg: 4, xl: 3, children: children }) }) }), jsxRuntime.jsx(Footer, { light: true })] }));
}

function Basic() {
    const [rememberMe, setRememberMe] = react.useState(false);
    const handleSetRememberMe = () => setRememberMe(!rememberMe);
    return (jsxRuntime.jsx(BasicLayout, { image: bgImage__default["default"], children: jsxRuntime.jsxs(Card__default["default"], { children: [jsxRuntime.jsxs(MDBox, { variant: "gradient", bgColor: "info", borderRadius: "lg", coloredShadow: "info", mx: 2, mt: -3, p: 2, mb: 1, textAlign: "center", children: [jsxRuntime.jsx(MDTypography, { variant: "h4", fontWeight: "medium", color: "white", mt: 1, children: "Sign in" }), jsxRuntime.jsxs(Grid__default["default"], { container: true, spacing: 3, justifyContent: "center", sx: { mt: 1, mb: 2 }, children: [jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 2, children: jsxRuntime.jsx(MDTypography, { component: Link__default["default"], href: "#", variant: "body1", color: "white", children: jsxRuntime.jsx(FacebookIcon__default["default"], { color: "inherit" }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 2, children: jsxRuntime.jsx(MDTypography, { component: Link__default["default"], href: "#", variant: "body1", color: "white", children: jsxRuntime.jsx(GitHubIcon__default["default"], { color: "inherit" }) }) }), jsxRuntime.jsx(Grid__default["default"], { item: true, xs: 2, children: jsxRuntime.jsx(MDTypography, { component: Link__default["default"], href: "#", variant: "body1", color: "white", children: jsxRuntime.jsx(GoogleIcon__default["default"], { color: "inherit" }) }) })] })] }), jsxRuntime.jsx(MDBox, { pt: 4, pb: 3, px: 3, children: jsxRuntime.jsxs(MDBox, { component: "form", role: "form", children: [jsxRuntime.jsx(MDBox, { mb: 2, children: jsxRuntime.jsx(MDInput, { type: "email", label: "Email", fullWidth: true }) }), jsxRuntime.jsx(MDBox, { mb: 2, children: jsxRuntime.jsx(MDInput, { type: "password", label: "Password", fullWidth: true }) }), jsxRuntime.jsxs(MDBox, { display: "flex", alignItems: "center", ml: -1, children: [jsxRuntime.jsx(Switch__default["default"], { checked: rememberMe, onChange: handleSetRememberMe }), jsxRuntime.jsx(MDTypography, { variant: "button", fontWeight: "regular", color: "text", onClick: handleSetRememberMe, sx: { cursor: "pointer", userSelect: "none", ml: -1 }, children: "\u00A0\u00A0Remember me" })] }), jsxRuntime.jsx(MDBox, { mt: 4, mb: 1, children: jsxRuntime.jsx(MDButton, { variant: "gradient", color: "info", fullWidth: true, children: "sign in" }) }), jsxRuntime.jsx(MDBox, { mt: 3, mb: 1, textAlign: "center", children: jsxRuntime.jsxs(MDTypography, { variant: "button", color: "text", children: ["Don't have an account?", " ", jsxRuntime.jsx(MDTypography, { component: reactRouterDom.Link, to: "/authentication/sign-up/cover", variant: "button", color: "info", fontWeight: "medium", textGradient: true, children: "Sign up" })] }) })] }) })] }) }));
}

// import DefaultCell from "../../layouts/ecommerce/orders/order-list/components/DefaultCell";
// import team2 from "../../assets/images/team-2.jpg";
// import team3 from "../../assets/images/team-3.jpg";
const qController$1 = new QController.QController("http://localhost:8000");
console.log(qController$1);
/*
function entityCell({ value }: any) {
  const [name, data] = value;
  return (
    <DefaultCell value={typeof value === "string" ? value : name} suffix={data.suffix || false} />
  );
}

 */
let dataTableData = {
    columns: [],
    rows: [],
};
function EntityList({ table }) {
    const [menu, setMenu] = react.useState(null);
    const openMenu = (event) => setMenu(event.currentTarget);
    const closeMenu = () => setMenu(null);
    (async () => {
        await qController$1.loadTableMetaData(table.name).then((tableMetaData) => {
            // alert(typeof tableMetaData);
            // alert(typeof tableMetaData.fields);
            // alert(Object.keys(tableMetaData.fields));
            dataTableData = {
                columns: [],
                rows: [],
            };
            dataTableData.columns.push({ Header: "derp", accessor: "derp", width: "20%" });
            Object.keys(tableMetaData.fields).forEach((key) => {
                dataTableData.columns.push({
                    Header: key,
                    accessor: key,
                });
            });
            qController$1.query(table.name).then((results) => {
                alert(results.length);
                results.forEach((record) => {
                    alert(record);
                    const row = new Map();
                    Object.keys(record.values).forEach((key) => {
                        row.set(key, record.values.get(key));
                    });
                    alert(row);
                    dataTableData.rows.push(row);
                });
            });
            dataTableData.rows.push({
                id: "234",
                firstName: "tim",
                lastName: "chambers",
                modifyDate: "8/27/2020",
                email: "tim@tim.tim",
                createDate: "8/27/2020",
                birthDate: "8/27/2020",
            });
            /*
                        Object.keys(tableMetaData.fields).forEach((key) => {
                          dataTableData.columns.push({
                            Header: key,
                            accessor: key,
                            Cell: entityCell,
                          });
                        });
      
                        dataTableData.rows = [
                          {
                            id: "#10421",
                            date: "1 Nov, 10:20 AM",
                            status: "paid",
                            customer: ["Orlando Imieto", { image: team2 }],
                            product: "Nike Sport V2",
                            revenue: "$140,20",
                          },
                        ];
      
                        alert(dataTableData.rows.length);
      
                         */
        });
    })();
    const renderMenu = (jsxRuntime.jsxs(Menu__default["default"], { anchorEl: menu, anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, open: Boolean(menu), onClose: closeMenu, keepMounted: true, children: [jsxRuntime.jsx(MenuItem__default["default"], { onClick: closeMenu, children: "Status: Paid" }), jsxRuntime.jsx(MenuItem__default["default"], { onClick: closeMenu, children: "Status: Refunded" }), jsxRuntime.jsx(MenuItem__default["default"], { onClick: closeMenu, children: "Status: Canceled" }), jsxRuntime.jsx(Divider__default["default"], { sx: { margin: "0.5rem 0" } }), jsxRuntime.jsx(MenuItem__default["default"], { onClick: closeMenu, children: jsxRuntime.jsx(MDTypography, { variant: "button", color: "error", fontWeight: "regular", children: "Remove Filter" }) })] }));
    return (jsxRuntime.jsxs(DashboardLayout, { children: [jsxRuntime.jsx(DashboardNavbar, {}), jsxRuntime.jsxs(MDBox, { my: 3, children: [jsxRuntime.jsxs(MDBox, { display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, children: [jsxRuntime.jsxs(MDButton, { variant: "gradient", color: "info", children: ["new ", table.label] }), jsxRuntime.jsxs(MDBox, { display: "flex", children: [jsxRuntime.jsxs(MDButton, { variant: menu ? "contained" : "outlined", color: "dark", onClick: openMenu, children: ["filters\u00A0", jsxRuntime.jsx(Icon__default["default"], { children: "keyboard_arrow_down" })] }), renderMenu, jsxRuntime.jsx(MDBox, { ml: 1, children: jsxRuntime.jsxs(MDButton, { variant: "outlined", color: "dark", children: [jsxRuntime.jsx(Icon__default["default"], { children: "description" }), "\u00A0export csv"] }) })] })] }), jsxRuntime.jsx(Card__default["default"], { children: jsxRuntime.jsx(DataTable, { table: dataTableData, entriesPerPage: false, canSearch: true }) })] }), jsxRuntime.jsx(Footer$1, {})] }));
}

// import { QTableMetaData } from "qqq-frontend-core/lib/model/metaData/QTableMetaData";
// import thing from "qqq-frontend-core/lib/qqq-frontend-core.js";
// import QController from "qqq-frontend-core/lib/qqq-frontend-core.js";
// import {QTableMetaData} from "qqq-frontend-core/lib/model/metaData/QTableMetaData";
// import {QFieldMetaData} from "qqq-frontend-core/lib/model/metaData/QFieldMetaData";
// import {QFieldType} from "qqq-frontend-core/lib/model/metaData/QFieldType";
const qqqRoutes = [
    {
        type: "collapse",
        name: "Brooklyn Alice",
        key: "brooklyn-alice",
        icon: jsxRuntime.jsx(MDAvatar, { src: team3__default["default"], alt: "Brooklyn Alice", size: "sm" }),
        collapse: [
            {
                name: "My Profile",
                key: "my-profile",
                route: "/pages/profile/profile-overview",
                component: jsxRuntime.jsx(Overview, {}),
            },
            {
                name: "Settings",
                key: "profile-settings",
                route: "/pages/account/settings",
                component: jsxRuntime.jsx(Settings, {}),
            },
            {
                name: "Logout",
                key: "logout",
                route: "/authentication/sign-in/basic",
                component: jsxRuntime.jsx(Basic, {}),
            },
        ],
    },
    { type: "divider", key: "divider-0" },
    {
        type: "collapse",
        name: "Dashboards",
        key: "dashboards",
        icon: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", children: "dashboard" }),
        collapse: [
            {
                name: "Analytics",
                key: "analytics",
                route: "/dashboards/analytics",
                component: jsxRuntime.jsx(Analytics, {}),
            },
            {
                name: "Sales",
                key: "sales",
                route: "/dashboards/sales",
                component: jsxRuntime.jsx(Sales, {}),
            },
        ],
    },
    /*
    { type: "title", title: "Pages", key: "title-pages" },
    {
      type: "collapse",
      name: "Pages",
      key: "pages",
      icon: <Icon fontSize="medium">image</Icon>,
      collapse: [
        {
          name: "Profile",
          key: "profile",
          collapse: [
            {
              name: "Profile Overview",
              key: "profile-overview",
              route: "/pages/profile/profile-overview",
              component: <ProfileOverview />,
            },
            {
              name: "All Projects",
              key: "all-projects",
              route: "/pages/profile/all-projects",
              component: <AllProjects />,
            },
          ],
        },
        {
          name: "Users",
          key: "users",
          collapse: [
            {
              name: "New User",
              key: "new-user",
              route: "/pages/users/new-user",
              component: <NewUser />,
            },
          ],
        },
        {
          name: "Account",
          key: "account",
          collapse: [
            {
              name: "Settings",
              key: "settings",
              route: "/pages/account/settings",
              component: <Settings />,
            },
            {
              name: "Billing",
              key: "billing",
              route: "/pages/account/billing",
              component: <Billing />,
            },
            {
              name: "Invoice",
              key: "invoice",
              route: "/pages/account/invoice",
              component: <Invoice />,
            },
          ],
        },
        {
          name: "Projects",
          key: "projects",
          collapse: [
            {
              name: "Timeline",
              key: "timeline",
              route: "/pages/projects/timeline",
              component: <Timeline />,
            },
          ],
        },
        {
          name: "Pricing Page",
          key: "pricing-page",
          route: "/pages/pricing-page",
          component: <PricingPage />,
        },
        { name: "RTL", key: "rtl", route: "/pages/rtl", component: <RTL /> },
        { name: "Widgets", key: "widgets", route: "/pages/widgets", component: <Widgets /> },
        { name: "Charts", key: "charts", route: "/pages/charts", component: <Charts /> },
        {
          name: "Notfications",
          key: "notifications",
          route: "/pages/notifications",
          component: <Notifications />,
        },
      ],
    },
    {
      type: "collapse",
      name: "Applications",
      key: "applications",
      icon: <Icon fontSize="medium">apps</Icon>,
      collapse: [
        {
          name: "Kanban",
          key: "kanban",
          route: "/applications/kanban",
          component: <Kanban />,
        },
        {
          name: "Wizard",
          key: "wizard",
          route: "/applications/wizard",
          component: <Wizard />,
        },
        {
          name: "Data Tables",
          key: "data-tables",
          route: "/applications/data-tables",
          component: <DataTables />,
        },
        {
          name: "Calendar",
          key: "calendar",
          route: "/applications/calendar",
          component: <Calendar />,
        },
      ],
    },
    {
      type: "collapse",
      name: "Ecommerce",
      key: "ecommerce",
      icon: <Icon fontSize="medium">shopping_basket</Icon>,
      collapse: [
        {
          name: "Products",
          key: "products",
          collapse: [
            {
              name: "New Product",
              key: "new-product",
              route: "/ecommerce/products/new-product",
              component: <NewProduct />,
            },
            {
              name: "Edit Product",
              key: "edit-product",
              route: "/ecommerce/products/edit-product",
              component: <EditProduct />,
            },
            {
              name: "Product Page",
              key: "product-page",
              route: "/ecommerce/products/product-page",
              component: <ProductPage />,
            },
          ],
        },
        {
          name: "Orders",
          key: "orders",
          collapse: [
            {
              name: "Order List",
              key: "order-list",
              route: "/ecommerce/orders/order-list",
              component: <OrderList />,
            },
            {
              name: "Order Details",
              key: "order-details",
              route: "/ecommerce/orders/order-details",
              component: <OrderDetails />,
            },
          ],
        },
        {
          name: "Orders",
          key: "orders",
          collapse: [
            {
              name: "Order List",
              key: "order-list",
              route: "/ecommerce/orders/order-list",
              component: <OrderList />,
            },
            {
              name: "Order Details",
              key: "order-details",
              route: "/ecommerce/orders/order-details",
              component: <OrderDetails />,
            },
          ],
        },
      ],
    },
    {
      type: "collapse",
      name: "Authentication",
      key: "authentication",
      icon: <Icon fontSize="medium">content_paste</Icon>,
      collapse: [
        {
          name: "Sign In",
          key: "sign-in",
          collapse: [
            {
              name: "Basic",
              key: "basic",
              route: "/authentication/sign-in/basic",
              component: <SignInBasic />,
            },
            {
              name: "Cover",
              key: "cover",
              route: "/authentication/sign-in/cover",
              component: <SignInCover />,
            },
            {
              name: "Illustration",
              key: "illustration",
              route: "/authentication/sign-in/illustration",
              component: <SignInIllustration />,
            },
          ],
        },
        {
          name: "Sign Up",
          key: "sign-up",
          collapse: [
            {
              name: "Cover",
              key: "cover",
              route: "/authentication/sign-up/cover",
              component: <SignUpCover />,
            },
          ],
        },
        {
          name: "Reset Password",
          key: "reset-password",
          collapse: [
            {
              name: "Cover",
              key: "cover",
              route: "/authentication/reset-password/cover",
              component: <ResetCover />,
            },
          ],
        },
      ],
    },
       */
    { type: "divider", key: "divider-1" },
    { type: "title", title: "Tables", key: "title-docs" },
];
const qController = new QController.QController("http://localhost:8000");
console.log(qController);
(async () => {
    await qController.loadMetaData().then((metaData) => {
        console.log(`metaData: ${metaData}`);
        const tableList = [];
        metaData.forEach((value, key) => {
            const table = metaData.get(key);
            tableList.push({
                name: table.label,
                key: table.name,
                route: `/${table.name}/list`,
                component: jsxRuntime.jsx(EntityList, { table: table }),
            });
        });
        const tables = {
            type: "collapse",
            name: "Tables",
            key: "tables",
            icon: jsxRuntime.jsx(Icon__default["default"], { fontSize: "medium", children: "dashboard" }),
            collapse: tableList,
        };
        qqqRoutes.push(tables);
    });
})();

function App() {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, direction, layout, openConfigurator, sidenavColor, transparentSidenav, whiteSidenav, darkMode, } = controller;
    const [onMouseEnter, setOnMouseEnter] = react.useState(false);
    const [rtlCache, setRtlCache] = react.useState(null);
    const { pathname } = reactRouterDom.useLocation();
    // Cache for the rtl
    react.useMemo(() => {
        const pluginRtl = rtlPlugin__default["default"];
        const cacheRtl = createCache__default["default"]({
            key: "rtl",
            stylisPlugins: [pluginRtl],
        });
        setRtlCache(cacheRtl);
    }, []);
    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };
    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };
    // Change the openConfigurator state
    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
    // Setting the dir attribute for the body element
    react.useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);
    // Setting page scroll to 0 when changing the route
    react.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);
    const getRoutes = (allRoutes) => allRoutes.map((route) => {
        if (route.collapse) {
            return getRoutes(route.collapse);
        }
        if (route.route) {
            return jsxRuntime.jsx(reactRouterDom.Route, { path: route.route, element: route.component }, route.key);
        }
        return null;
    });
    const configsButton = (jsxRuntime.jsx(MDBox, { display: "flex", justifyContent: "center", alignItems: "center", width: "3.25rem", height: "3.25rem", bgColor: "white", shadow: "sm", borderRadius: "50%", position: "fixed", right: "2rem", bottom: "2rem", zIndex: 99, color: "dark", sx: { cursor: "pointer" }, onClick: handleConfiguratorOpen, children: jsxRuntime.jsx(Icon__default["default"], { fontSize: "small", color: "inherit", children: "settings" }) }));
    return direction === "rtl" ? (jsxRuntime.jsx(react$1.CacheProvider, { value: rtlCache, children: jsxRuntime.jsxs(styles.ThemeProvider, { theme: darkMode ? themeDarkRTL : themeRTL, children: [jsxRuntime.jsx(CssBaseline__default["default"], {}), layout === "dashboard" && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Sidenav$1, { color: sidenavColor, brand: (transparentSidenav && !darkMode) || whiteSidenav ? brandDark__default["default"] : brandWhite__default["default"], brandName: "Material Dashboard PRO", routes: qqqRoutes, onMouseEnter: handleOnMouseEnter, onMouseLeave: handleOnMouseLeave }), jsxRuntime.jsx(Configurator, {}), configsButton] })), layout === "vr" && jsxRuntime.jsx(Configurator, {}), jsxRuntime.jsxs(reactRouterDom.Routes, { children: [getRoutes(qqqRoutes), jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: jsxRuntime.jsx(reactRouterDom.Navigate, { to: "/dashboards/analytics" }) })] })] }) })) : (jsxRuntime.jsxs(styles.ThemeProvider, { theme: darkMode ? themeDark : theme, children: [jsxRuntime.jsx(CssBaseline__default["default"], {}), layout === "dashboard" && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Sidenav$1, { color: sidenavColor, brand: (transparentSidenav && !darkMode) || whiteSidenav ? brandDark__default["default"] : brandWhite__default["default"], brandName: "Material Dashboard PRO", routes: qqqRoutes, onMouseEnter: handleOnMouseEnter, onMouseLeave: handleOnMouseLeave }), jsxRuntime.jsx(Configurator, {}), configsButton] })), layout === "vr" && jsxRuntime.jsx(Configurator, {}), jsxRuntime.jsxs(reactRouterDom.Routes, { children: [getRoutes(qqqRoutes), jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: jsxRuntime.jsx(reactRouterDom.Navigate, { to: "/dashboards/analytics" }) })] })] }));
}

ReactDOM__default["default"].render(jsxRuntime.jsx(reactRouterDom.BrowserRouter, { children: jsxRuntime.jsx(MaterialUIControllerProvider, { children: jsxRuntime.jsx(App, {}) }) }), document.getElementById("root"));
