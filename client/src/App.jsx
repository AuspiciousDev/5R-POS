import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { ColorModeContext, useMode } from "./themes";
import { CssBaseline, ThemeProvider } from "@mui/material";

// * PUBLIC ROUTES
import Login from "./pages/public/Login";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import Unauthorized from "./pages/public/Unauthorized";
import NotFound404 from "./pages/public/NotFound404";

// * PRIVATE ROUTES
import PersistLogin from "./pages/components/PersistLogin";
import RequireAuth from "./pages/components/RequireAuth";

// * ADMIN ROUTES
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Cashier from "./pages/admin/Cashier/Cashier";
import Inventory from "./pages/admin/Inventory/Inventory";
import InventoryAdd from "./pages/admin/Inventory/InventoryAdd";

import Employee from "./pages/admin/Employee/Employee";
import EmployeeAdd from "./pages/admin/Employee/EmployeeAdd";

import Restock from "./pages/admin/Restock/Restock";
import Sales from "./pages/admin/Sales/Sales";
import Archived from "./pages/admin/Archived/Archived";

// * EMPLOYEE ROUTES
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmpDashboard from "./pages/employee/EmpDashboard";
import RestockAdd from "./pages/admin/Restock/RestockAdd";
EmployeeLayout;
const USER_TYPE = {
  ADMIN: "admin",
  EMP: "employee",
};

const App = () => {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/auth/reset-password/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound404 />} />
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[USER_TYPE.ADMIN]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="cashier" element={<Cashier />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="inventory/add" element={<InventoryAdd />} />
                  <Route path="employee" element={<Employee />} />
                  <Route path="employee/add" element={<EmployeeAdd />} />
                  <Route path="restock" element={<Restock />} />
                  <Route path="restock/add" element={<RestockAdd />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="archived" element={<Archived />} />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[USER_TYPE.EMP]} />}>
                <Route path="/employee" element={<EmployeeLayout />}>
                  <Route index element={<EmpDashboard />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
