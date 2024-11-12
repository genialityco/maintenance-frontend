import React, { useState, useEffect } from "react";
import PlanInfo from "./PlanInfo.tsx";
import { Box } from "@mantine/core";
import { getClientByPhoneNumberAndOrganization } from "../../services/clientService.ts";
import { Client as ClientType } from "../../services/clientService.ts";
import SearchClient from "./SearchClient.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store.ts";

const PlanViewer: React.FC = () => {
  const [client, setClient] = useState<ClientType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );

  // Efecto para verificar si hay un cliente guardado en el localStorage y actualizar su información
  useEffect(() => {
    const fetchUpdatedClient = async (phoneNumber: string) => {
      try {
        if (!organization) return;
        const updatedClient = await getClientByPhoneNumberAndOrganization(
          phoneNumber,
          organization._id as string
        );
        if (updatedClient) {
          const validClient = {
            ...updatedClient,
            servicesTaken: updatedClient.servicesTaken || 0,
            referralsMade: updatedClient.referralsMade || 0,
          };
          setClient(validClient);
          // localStorage.setItem("savedClient", JSON.stringify(validClient));
        }
      } catch (err) {
        console.error("Error fetching updated client:", err);
      } finally {
        setLoading(false);
      }
    };

    const savedClient = localStorage.getItem("savedClient");
    if (savedClient) {
      const parsedClient: ClientType = JSON.parse(savedClient);
      const validClient = {
        ...parsedClient,
        servicesTaken: parsedClient.servicesTaken || 0,
        referralsMade: parsedClient.referralsMade || 0,
      };
      setClient(validClient);
      fetchUpdatedClient(parsedClient.phoneNumber);
    } else {
      setLoading(false);
    }
  }, []);

  const handleClientFound = (client: ClientType) => {
    const validClient = {
      ...client,
      servicesTaken: client.servicesTaken || 0,
      referralsMade: client.referralsMade || 0,
    };
    setClient(validClient);
    // localStorage.setItem("savedClient", JSON.stringify(validClient));
  };

  const handleLogout = () => {
    setClient(null);
    localStorage.clear();
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box style={{ margin: "auto" }}>
      {!client ? (
        <SearchClient onClientFound={handleClientFound} />
      ) : (
        <PlanInfo client={client} onLogout={handleLogout} />
      )}
    </Box>
  );
};

export default PlanViewer;
