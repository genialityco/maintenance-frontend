import PlanViewer from "../pages/loyalty/PlanViewer";
import ServicesAndPrices from "../components/ServicesAndPrices";
import LoginAdmin from "../pages/admin/LoginAdmin";
import ClientManagement from "../pages/admin/manageClients";
import ScheduleView from "../pages/admin/manageAgenda";
import ProtectedRoute from "../components/ProtectedRoute";
import { JSX } from "react/jsx-runtime";
import AdminServices from "../pages/admin/manageServices";
import AdminEmployees from "../pages/admin/manageEmployees";
import OrganizationInfo from "../pages/account/OrganizationInfo";
import EmployeeInfo from "../pages/account/EmployeeInfo";

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
    path: "/gestionar-clientes",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <ClientManagement {...props} />
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
  },
  {
    path: "/informacion-negocio",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <OrganizationInfo {...props} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/informacion-empleado",
    component: (props: JSX.IntrinsicAttributes) => (
      <ProtectedRoute>
        <EmployeeInfo {...props} />
      </ProtectedRoute>
    )
  }
];

export default generalRoutes;
