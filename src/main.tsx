import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "@vkontakte/vkui/dist/cssm/styles/themes.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
