import { Box, Text, Flex, ActionIcon, Divider } from "@mantine/core";
import { useState, useEffect } from "react";
import CreateUser from "./CreateUser";
import UserTable from "./UserTable";
import { IoAddCircleOutline } from "react-icons/io5";
import { getUsers, User } from "../../../api/userService";

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

  return (
    <Box p="lg">
      <Divider mb="md" />
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Text size="xl" c="white">
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

      <Divider my="md" />

      {/* Pasa los usuarios como prop a UserTable */}
      <UserTable users={users} fetchUsers={fetchUsers} error={error} />
    </Box>
  );
};

export default Dashboard;
