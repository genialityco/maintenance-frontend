import React from "react";
import {
  Box,
  Text,
  Table,
  Group,
  ActionIcon,
  Flex,
  Badge,
} from "@mantine/core";
import { User as UserType } from "../../../api/userService";
import { BiTrash } from "react-icons/bi";
import { CgAdd, CgUserAdd } from "react-icons/cg";

interface UserTableProps {
  users: UserType[];
  fetchUsers: () => void;
  handleDeleteUser: (id: string) => void;
  handleRegisterService: (userId: string) => void;
  handleReferal: (userId: string) => void;
  error: string | null;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  handleDeleteUser,
  handleRegisterService,
  handleReferal,
  error,
}) => {
  return (
    <Box m="auto">
      {error && (
        <Text mt="md" c="red">
          {error}
        </Text>
      )}
      <Table mt="md" withTableBorder withColumnBorders striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: "center" }}>Nombre</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Teléfono</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>
              Servicios Tomados
            </Table.Th>
            <Table.Th style={{ textAlign: "center" }}>
              Referidos Hechos
            </Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user._id}>
              <Table.Td>
                <Text ta="center" tt="capitalize" fw={500}>
                  {user.name}
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: "center" }}>
                {user.phoneNumber}
              </Table.Td>
              <Table.Td>
                <Badge fullWidth variant="light" color="dark" size="lg">
                  {user.servicesTaken}
                </Badge>
              </Table.Td>
              <Table.Td style={{ textAlign: "center" }}>
                <Badge fullWidth variant="light" color="dark" size="lg">
                  {user.referralsMade}
                </Badge>
              </Table.Td>
              <Table.Td style={{ textAlign: "center" }}>
                <Group justify="center">
                  <Flex justify="center" align="center" gap="xs">
                    <ActionIcon onClick={() => handleRegisterService(user._id)}>
                      <CgAdd />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => handleReferal(user._id)}
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
