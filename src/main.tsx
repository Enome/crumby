import React from "react";
import ReactDOM from "react-dom/client";
import Application from "./application.tsx";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./state";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Application />
    </Provider>
  </React.StrictMode>,
);
