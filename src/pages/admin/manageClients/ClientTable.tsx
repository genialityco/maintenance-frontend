import React from "react";
import { Box, Text, Table, Badge, Menu, ActionIcon } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { Client as ClientType } from "../../../services/clientService";
import { BiTrash } from "react-icons/bi";
import { CgAdd, CgOptions, CgUserAdd } from "react-icons/cg";
import { MdEdit } from "react-icons/md";

interface ClientTableProps {
  clients: ClientType[];
  handleDeleteClient: (id: string) => void;
  handleRegisterService: (clientId: string) => void;
  handleReferral: (clientId: string) => void;
  handleEditClient: (client: ClientType) => void;
  error: string | null;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  handleDeleteClient,
  handleRegisterService,
  handleReferral,
  handleEditClient,
  error,
}) => {
  const confirmAction = (
    action: () => void,
    title: string,
    message: string,
    actionType: "register" | "refer" | "delete" 
  ) => {
    openConfirmModal({
      title,
      children: <Text size="sm">{message}</Text>,
      labels: { confirm: "Confirmar", cancel: "Cancelar" },
      confirmProps: {
        color: actionType === "delete" ? "red" : "green", 
      },
      onConfirm: action,
    });
  };

  return (
    <Box m="auto" mb="lg">
      {error && (
        <Text mt="md" c="red">
          {error}
        </Text>
      )}
      <Table
        mt="md"
        withTableBorder
        withColumnBorders
        striped
        style={{ overflowX: "auto" }}
      >
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
                <Menu shadow="sm" width={200}>
                  <Menu.Target>
                    <ActionIcon radius="xl">
                      <CgOptions size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Acciones</Menu.Label>
                    <Menu.Item
                      leftSection={<CgAdd />}
                      onClick={() =>
                        confirmAction(
                          () => handleRegisterService(client._id),
                          "Registrar Servicio",
                          "¿Estás seguro de que deseas registrar un servicio para este cliente?",
                          "register"
                        )
                      }
                    >
                      Registrar Servicio
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<CgUserAdd />}
                      onClick={() =>
                        confirmAction(
                          () => handleReferral(client._id),
                          "Registrar Referido",
                          "¿Estás seguro de que deseas registrar un referido para este cliente?",
                          "refer"
                        )
                      }
                    >
                      Registrar Referido
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<MdEdit />}
                      onClick={() => handleEditClient(client)}
                    >
                      Editar Cliente
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<BiTrash />}
                      onClick={() =>
                        confirmAction(
                          () => handleDeleteClient(client._id),
                          "Eliminar Cliente",
                          "¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.",
                          "delete"
                        )
                      }
                    >
                      Eliminar Cliente
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default ClientTable;
