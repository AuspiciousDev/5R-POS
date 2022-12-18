import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";
import { UsersContextProvider } from "./context/UserContext";
import { InventoryContextProvider } from "./context/InventoryContext";
import { RestocksContextProvider } from "./context/RestockContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UsersContextProvider>
        <InventoryContextProvider>
          <RestocksContextProvider>
            <App />
          </RestocksContextProvider>
        </InventoryContextProvider>
      </UsersContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
