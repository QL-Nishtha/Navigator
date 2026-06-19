import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./src/styles/index.css";
import App from "./src/app/App";
import LoginPage from "./src/app/pages/LoginPage";
import RegisterPage from "./src/app/pages/RegisterPage";

const root = document.getElementById("root");
if (root) createRoot(root).render(
  React.createElement(BrowserRouter, null,
    React.createElement(Routes, null,
      React.createElement(Route, { path: "/", element: React.createElement(App) }),
      React.createElement(Route, { path: "/login", element: React.createElement(LoginPage) }),
      React.createElement(Route, { path: "/register", element: React.createElement(RegisterPage) }),
    )
  )
);
