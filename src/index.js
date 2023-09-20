import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import ReactGA from "react-ga";
import { injectGlobal, ThemeProvider } from "styled-components";
import createHistory from "history/createBrowserHistory";

import App from "./components/App";

import store from "./redux/store";
import {
  createMuiTheme,
  jssPreset,
  createGenerateClassName
} from "@material-ui/core/styles";
import rtl from "jss-rtl";
import JssProvider from "react-jss/lib/JssProvider";
import { ConnectedRouter } from "react-router-redux";

import "whatwg-fetch";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { create } from "jss";
import i18next from "i18next";
import IL from "./translations/il/common.json";
import EN from "./translations/en/common.json";
import { CookiesProvider } from "react-cookie";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  direction: "ltr" // Both here and <body dir="rtl">
});
i18next.init({
  interpolation: { escapeValue: false },
  lng: "en", // language to use
  resources: {
    en: {
      common: EN // 'common' is our custom namespace
    },
    il: {
      common: IL
    }
  } // React already does escaping
});

ReactGA.initialize("UA-131353482-1");
ReactGA.set({ page: window.location.pathname + window.location.search });
ReactGA.pageview(window.location.pathname + window.location.search);
const history = createHistory();
injectGlobal`
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 14px;
    margin: 0;
    text-align: center;
  }
`;
/*
      <LoadingContainer>
      </LoadingContainer>
*/
// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// Custom Material-UI class name generator.
const generateClassName = createGenerateClassName();

ReactDOM.render(
  <Provider store={store}>
    <CookiesProvider>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <I18nextProvider i18n={i18next}>
              <Router>
                <Fragment>
                  {/*<HashRouter>*/}
                  <Route component={App} />
                  {/*</HashRouter>*/}
                </Fragment>
              </Router>
            </I18nextProvider>
          </ConnectedRouter>
        </ThemeProvider>
      </JssProvider>
    </CookiesProvider>
  </Provider>,
  document.getElementById("app")
);
