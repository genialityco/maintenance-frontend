import PlanViewer from "../pages/loyalty/PlanViewer";
import ServicesAndPrices from "../components/ServicesAndPrices";
import LoginAdmin from "../pages/admin/LoginAdmin";
import UserManagement from "../pages/admin/manageUsers";
import ScheduleView from "../pages/admin/manageAgenda";
import ProtectedRoute from "../components/ProtectedRoute";
import { JSX } from "react/jsx-runtime";
import AdminServices from "../pages/admin/manageServices";
import AdminEmployees from "../pages/admin/manageEmployees";

const generalRoutes = [
  {
    path: "/",
    component: PlanViewer,
    MediaMetadata: {
      title: "Plan de fidelidad",
      description: "Sección plan fidelidad.",
      image: "/galaxia_glamour.png",
    },
  },
  {
    path: "/servicios-precios",
    component: ServicesAndPrices,
    MediaMetadata: {
      title: "Servicios y Precios",
      description: "Consulta nuestros servicios y precios en Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  },
  {
    path: "/login-admin",
    component: LoginAdmin,
    MediaMetadata: {
      title: "Administrar clientes",
      description: "Administrar clientes en Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  },
  {
    path: "/gestionar-usuarios",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <UserManagement {...props} />
      </ProtectedRoute>
    ),
    MediaMetadata: {
      title: "Dashboard",
      description: "Dashboard de Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  },
  {
    path: "/gestionar-agenda",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <ScheduleView {...props} />
      </ProtectedRoute>
    ),
    MediaMetadata: {
      title: "Gestionar Agenda",
      description: "Gestiona la agenda de Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  },
  {
    path: "/gestionar-servicios",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <AdminServices {...props} />
      </ProtectedRoute>
    ),
    MediaMetadata: {
      title: "Gestionar Servicios",
      description: "Gestiona los servicios de Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  },
  {
    path: "/gestionar-empleados",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <AdminEmployees {...props} />
      </ProtectedRoute>
    ),
    MediaMetadata: {
      title: "Gestionar Empleados",
      description: "Gestiona los empleados de Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  }
];

export default generalRoutes;
