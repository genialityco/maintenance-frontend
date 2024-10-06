import { Box, Text, Flex, ActionIcon, Divider } from "@mantine/core";
import { useState, useEffect } from "react";
import CreateUser from "./CreateUser";
import UserTable from "./UserTable";
import { IoAddCircleOutline } from "react-icons/io5";
import {
  deleteUser,
  getUsers,
  registerReferral,
  registerService,
  User,
} from "../../../api/userService";
import { showNotification } from "@mantine/notifications";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
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
  }

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
    <Box p="lg">
      <Divider mb="sm" />
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Text size="xl">
          Gestionar clientes
        </Text>
        <ActionIcon onClick={handleOpenModal} color="blue">
          <IoAddCircleOutline size={30} />
        </ActionIcon>
      </Flex>

      {/* Pasa la función fetchUsers como prop a CreateUser */}
      <CreateUser
        opened={openModal}
        onClose={handleCloseModal}
        fetchUsers={fetchUsers}
      />

      <Divider my="sm" />

      {/* Pasa los usuarios como prop a UserTable */}
      <UserTable
        users={users}
        fetchUsers={fetchUsers}
        handleDeleteUser={handleDeleteUser}
        handleRegisterService={handleRegisterService}
        handleReferal={handleReferal}
        error={error}
      />
    </Box>
  );
};

export default Dashboard;
