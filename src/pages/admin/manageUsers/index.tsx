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
import CreateUser from "./CreateUser";
import UserTable from "./UserTable";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import {
  deleteUser,
  getUsers,
  registerReferral,
  registerService,
  User,
} from "../../../services/userService";
import { showNotification } from "@mantine/notifications";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Error al obtener la lista de usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const filterUsers = () => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleRegisterService = async (userId: string) => {
    try {
      await registerService(userId);
      showNotification({
        title: "Servicio registrado",
        message: "El servicio ha sido registrado correctamente",
        color: "blue",
        autoClose: 1000,
        position: "top-right",
      });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReferal = async (userId: string) => {
    try {
      await registerReferral(userId);
      showNotification({
        title: "Referido registrado",
        message: "El referido ha sido registrado correctamente",
        color: "blue",
        autoClose: 1000,
        position: "top-right",
      });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);

      showNotification({
        title: "Usuario eliminado",
        message: "El usuario ha sido eliminado correctamente",
        color: "blue",
        autoClose: 1000,
        position: "top-right",
      });
      fetchUsers();
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
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />
      </Group>

      <CreateUser
        opened={openModal}
        onClose={handleCloseModal}
        fetchUsers={fetchUsers}
      />
      <div style={{ overflowX: "auto" }}>
        <UserTable
          users={filteredUsers}
          fetchUsers={fetchUsers}
          handleDeleteUser={handleDeleteUser}
          handleRegisterService={handleRegisterService}
          handleReferal={handleReferal}
          error={error}
        />
      </div>
    </Box>
  );
};

export default Dashboard;
