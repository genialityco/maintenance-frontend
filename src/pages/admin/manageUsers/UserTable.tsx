import React from "react";
import { Box, Text, Table, Group, ActionIcon, Flex } from "@mantine/core";
import { User as UserType } from "../../../api/userService";
import { BiTrash } from "react-icons/bi";
import { CgAdd, CgUserAdd } from "react-icons/cg";

interface UserTableProps {
  users: UserType[]; // Recibe los usuarios como prop
  fetchUsers: () => void; // Recibe la función para actualizar los usuarios
  error: string | null;
}

const UserTable: React.FC<UserTableProps> = ({ users, error }) => {
  return (
    <Box
      bg="#1A202C"
      m="auto"
      style={{
        color: "#E2E8F0",
      }}
    >
      {error && (
        <Text mt="md" c="red">
          {error}
        </Text>
      )}
      <Table mt="md" withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: "center" }}>Nombre</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Teléfono</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Servicios Tomados</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Referidos Hechos</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user._id}>
              <Table.Td style={{ textAlign: "center" }}>{user.name}</Table.Td>
              <Table.Td style={{ textAlign: "center" }}>{user.phoneNumber}</Table.Td>
              <Table.Td style={{ textAlign: "center" }}>{user.servicesTaken}</Table.Td>
              <Table.Td style={{ textAlign: "center" }}>{user.referralsMade}</Table.Td>
              <Table.Td style={{ textAlign: "center" }}>
                <Group justify="center">
                  <Flex justify="center" align="center" gap="xs">
                    <ActionIcon
                      onClick={() => console.log("Register service")}
                    >
                      <CgAdd />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => console.log("Register referral")}
                    >
                      <CgUserAdd />
                    </ActionIcon>
                    <ActionIcon onClick={() => console.log("Delete user")}>
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
