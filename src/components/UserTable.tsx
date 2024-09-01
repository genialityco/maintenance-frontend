import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Table,
  Group,
  ActionIcon,
  Flex,
} from "@mantine/core";
import {
  getUsers,
  registerService,
  registerReferral,
  deleteUser,
} from "../services/userService";
import { User as UserType } from "../services/userService";
import { BiRefresh, BiTrash } from "react-icons/bi";
import { CgAdd, CgUserAdd } from "react-icons/cg";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleRegisterService = async (userId: string) => {
    try {
      await registerService(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, servicesTaken: user.servicesTaken + 1 }
            : user
        )
      );
    } catch (err) {
      console.error("Error al registrar el servicio", err);
    }
  };

  const handleRegisterReferral = async (userId: string) => {
    try {
      await registerReferral(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                referralsMade: user.referralsMade + 1,
                servicesTaken: user.servicesTaken + 1,
              }
            : user
        )
      );
    } catch (err) {
      console.error("Error al registrar el referido", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error("Error al registrar el referido", err);
    }
  };

  return (
    <Box
      bg="#1A202C"
      p="xl"
      m="auto"
      style={{
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        color: "#E2E8F0",
        maxWidth: "100%",
        width: "100%",
        overflowX: "auto",
        "@media (maxWidth: 768px)": {
          padding: "1rem",
        },
      }}
    >
      <Group justify="center">
        <Text size="xl" fw={700}>
          Lista de Usuarios
        </Text>
        <ActionIcon radius="xl" onClick={fetchUsers}>
          <BiRefresh />
        </ActionIcon>
      </Group>
      {error && (
        <Text mt="md" c="red">
          {error}
        </Text>
      )}
      <Table mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Teléfono</Table.Th>
            {/* <Table.Th>Email</Table.Th> */}
            <Table.Th>Servicios Tomados</Table.Th>
            <Table.Th>Referidos Hechos</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user._id}>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.phoneNumber}</Table.Td>
              {/* <Table.Td>{user.email || "No proporcionado"}</Table.Td> */}
              <Table.Td>{user.servicesTaken}</Table.Td>
              <Table.Td>{user.referralsMade}</Table.Td>
              <Table.Td>
                <Group justify="between">
                  <Flex>
                    <ActionIcon
                      mr="xs"
                      onClick={() => handleRegisterService(user._id)}
                    >
                      <CgAdd />
                    </ActionIcon>
                    <ActionIcon
                      mr="xs"
                      onClick={() => handleRegisterReferral(user._id)}
                    >
                      <CgUserAdd />
                    </ActionIcon>
                    <ActionIcon onClick={() => handleDeleteUser(user._id)}>
                      <BiTrash />
                    </ActionIcon>
                  </Flex>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default UserTable;
