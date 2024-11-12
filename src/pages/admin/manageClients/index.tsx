import {
  Box,
  Flex,
  Divider,
  TextInput,
  Group,
  Title,
  Button,
} from "@mantine/core";
import { useState, useEffect } from "react";
import CreateClient from "./CreateClient";
import ClientTable from "./ClientTable";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import {
  deleteClient,
  registerReferral,
  registerService,
  Client,
  getClientsByOrganizationId,
} from "../../../services/clientService";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const organizationId = useSelector(
    (state: RootState) => state.auth.organizationId
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Función para obtener clientes
  const fetchClients = async () => {
    try {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const response = await getClientsByOrganizationId(organizationId);
      setClients(response);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Error al obtener la lista de clientes");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchTerm, clients]);

  const filterClients = () => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleRegisterService = async (clientId: string) => {
    try {
      await registerService(clientId);
      showNotification({
        title: "Servicio registrado",
        message: "El servicio ha sido registrado correctamente",
        color: "blue",
        autoClose: 1000,
        position: "top-right",
      });
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReferral = async (clientId: string) => {
    try {
      await registerReferral(clientId);
      showNotification({
        title: "Referido registrado",
        message: "El referido ha sido registrado correctamente",
        color: "blue",
        autoClose: 1000,
        position: "top-right",
      });
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);

      showNotification({
        title: "Cliente eliminado",
        message: "El cliente ha sido eliminado correctamente",
        color: "blue",
        autoClose: 1000,
        position: "top-right",
      });
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Flex
        gap="md"
        justify="space-between"
        align="center"
        direction="row"
        wrap="wrap"
        mb="md"
      >
        <Title order={1}>Gestionar clientes</Title>
        <Button leftSection={<IoAddCircleOutline />} onClick={handleOpenModal}>
          Crear cliente
        </Button>
      </Flex>

      <Divider mb="md" />

      <Group mb="md" justify="space-between">
        <TextInput
          leftSection={<BsSearch />}
          placeholder="Buscar por nombre o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />
      </Group>

      <CreateClient
        opened={openModal}
        onClose={handleCloseModal}
        fetchClients={fetchClients}
      />
      <div style={{ overflowX: "auto" }}>
        <ClientTable
          clients={filteredClients}
          handleDeleteClient={handleDeleteClient}
          handleRegisterService={handleRegisterService}
          handleReferral={handleReferral}
          error={error}
        />
      </div>
    </Box>
  );
};

export default Dashboard;
