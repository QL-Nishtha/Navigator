import React from "react";
import { createRoot } from "react-dom/client";
import "./src/styles/index.css";
import App from "./src/app/App";

const root = document.getElementById("root");
if (root) createRoot(root).render(React.createElement(App));
