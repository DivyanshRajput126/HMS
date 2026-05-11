import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Rooms from "../pages/Rooms";
import Customers from "../pages/Customers";
import Expenses from "../pages/Expenses";
import Reports from "../pages/Reports";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../utils/roles";
import Guests from "../pages/Guests";
import PendingPayments from "../pages/PendingPayments";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        }
      />

      {/* Admin + Manager */}
      <Route
        path="/rooms"
        element={
          <PrivateRoute>
            <Layout><Rooms /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/expenses"
        element={
          <PrivateRoute>
            <Layout><Expenses /></Layout>
          </PrivateRoute>
        }
      />

      {/* Admin only */}
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout><Customers /></Layout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/pending-payments"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout><PendingPayments /></Layout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/guests"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout><Guests /></Layout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout><Reports /></Layout>
            </RoleRoute>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;