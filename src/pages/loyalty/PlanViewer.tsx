import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mantine/core";
import PlanInfo from "./PlanInfo";
import { Client as ClientType } from "../../services/clientService";

const PlanViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientType | null>(null);

  useEffect(() => {
    if (location.state && location.state.client) {
      setClient(location.state.client);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const handleLogout = () => {
    setClient(null);
    localStorage.removeItem("savedClientData");
    navigate("/");
  };

  if (!client) {
    return <div>Cargando...</div>;
  }

  return (
    <Box style={{ margin: "auto" }}>
      <PlanInfo client={client} onLogout={handleLogout} />
    </Box>
  );
};

export default PlanViewer;
