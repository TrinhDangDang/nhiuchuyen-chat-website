import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // main application component
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { store } from "./app/store";
import { Provider } from "react-redux";
// store and Provider: For setting up Redux state management. store contains your app's state, and Provider makes it accessible throughout the app.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
