// import LoyaltyPlan from "../components/LoyaltyPlan";
import PlanViewer from "../components/PlanViewer";
import ServicesAndPrices from "../components/ServicesAndPrices";
import UserManagement from "../components/UserManagement";

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
    path: "/admin",
    component: UserManagement,
    MediaMetadata: {
      title: "Administrar clientes",
      description: "Administrar clientes en Galaxia Glamour.",
      image: "/galaxia_glamour.png",
    },
  },
];

export default generalRoutes;
