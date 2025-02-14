import LoginAdmin from "../pages/admin/LoginAdmin";
import ProtectedRoute from "../components/ProtectedRoute";
import { JSX } from "react/jsx-runtime";
import AdminEmployees from "../pages/admin/manageEmployees";
import Home from "../pages/Home";
import MaintenanceHistory from "../pages/maintenanceHistory";
import ManageRequestMaintenance from "../pages/admin/manageRequestMaintenance";

const generalRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login-admin",
    component: LoginAdmin,
  },
  {
    path: "/maintenance-history",
    component: MaintenanceHistory,
  },
  {
    path: "/gestionar-empleados",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <AdminEmployees {...props} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage-requests",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <ManageRequestMaintenance {...props} />
      </ProtectedRoute>
    ),
  },
];

export default generalRoutes;
