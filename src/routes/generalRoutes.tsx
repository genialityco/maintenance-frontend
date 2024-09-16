// import LoyaltyPlan from "../components/LoyaltyPlan";
import PlanViewer from "../pages/loyalty/PlanViewer";
import ServicesAndPrices from "../components/ServicesAndPrices";
import LoginAdmin from "../pages/admin/LoginAdmin";
import Dashboard from "../pages/admin/Dashboard";

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
  // {
  //   path: "/plan-fidelidad",
  //   component: LoyaltyPlan,
  //   MediaMetadata: {
  //     title: "Plan de fidelidad",
  //     description: "Sección plan fidelidad.",
  //     image: "/galaxia_glamour.png",
  //   },
  // },
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
    path: "/dashboard",
    component: Dashboard,
    MediaMetadata: {
      title: "Dashboard",
      description: "Dashboard de Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  }
];

export default generalRoutes;
