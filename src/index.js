import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import Storage from "./store";

import App from "./containers/app";
import { Spinner } from "./components/spinner";
import { ThemeProvider } from "styled-components";
import themes from "./style/themes";

const store = Storage().store;
const persistor = Storage().persistor;
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Spinner />} persistor={persistor}>
      <ThemeProvider theme={themes.light}>
        <Router history={history}>
          <Route component={App} />
        </Router>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
