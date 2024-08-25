import LoyaltyPlan from "../components/LoyaltyPlan";
import ServicesAndPrices from "../components/ServicesAndPrices";

const generalRoutes = [
  {
    path: "/",
    component: LoyaltyPlan,
    MediaMetadata: {
      title: "Plan de fidelidad",
      description: "Sección plan fidelidad.",
      image: "/galaxia_glamour.png",
    },
  },
  {
    path: "/plan-fidelidad",
    component: LoyaltyPlan,
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
];

export default generalRoutes;
