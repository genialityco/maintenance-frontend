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
import { Client as ClientType } from "../../../services/clientService";
import { BiTrash } from "react-icons/bi";
import { CgAdd, CgUserAdd } from "react-icons/cg";

interface ClientTableProps {
  clients: ClientType[];
  handleDeleteClient: (id: string) => void;
  handleRegisterService: (clientId: string) => void;
  handleReferral: (clientId: string) => void;
  error: string | null;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  handleDeleteClient,
  handleRegisterService,
  handleReferral,
  error,
}) => {
  return (
    <Box m="auto">
      {error && (
        <Text mt="md" color="red">
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
          {clients.map((client) => (
            <Table.Tr key={client._id}>
              <Table.Td>
                <Text ta="center" tt="capitalize" fw={500}>
                  {client.name}
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: "center" }}>
                {client.phoneNumber}
              </Table.Td>
              <Table.Td>
                <Badge fullWidth variant="light" color="dark" size="lg">
                  {client.servicesTaken}
                </Badge>
              </Table.Td>
              <Table.Td style={{ textAlign: "center" }}>
                <Badge fullWidth variant="light" color="dark" size="lg">
                  {client.referralsMade}
                </Badge>
              </Table.Td>
              <Table.Td style={{ textAlign: "center" }}>
                <Group justify="center">
                  <Flex justify="center" align="center" gap="xs">
                    <ActionIcon
                      onClick={() => handleRegisterService(client._id)}
                    >
                      <CgAdd />
                    </ActionIcon>
                    <ActionIcon onClick={() => handleReferral(client._id)}>
                      <CgUserAdd />
                    </ActionIcon>
                    <ActionIcon onClick={() => handleDeleteClient(client._id)}>
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

export default ClientTable;
