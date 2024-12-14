import React, { useState } from "react";
import { TextInput, Button, Box, Modal } from "@mantine/core";
import { createClient } from "../../../../services/clientService"; // Servicio para crear clientes
import { showNotification } from "@mantine/notifications";

interface CreateClientModalProps {
  opened: boolean;
  onClose: () => void;
  fetchClients: () => void; // Función para actualizar la lista de clientes
}

const CreateClientModal: React.FC<CreateClientModalProps> = ({
  opened,
  onClose,
  fetchClients,
}) => {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleCreateClient = async (): Promise<void> => {
    try {
      if (!name.trim() || !phoneNumber.trim()) {
        showNotification({
          title: "Error",
          message: "Por favor, completa todos los campos obligatorios.",
          color: "red",
        });
        return;
      }

      await createClient({
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          organizationId: ""
      });

      showNotification({
        title: "Éxito",
        message: "Cliente creado con éxito",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });

      // Refrescar la lista de clientes y cerrar el modal
      fetchClients();
      onClose();
      setName("");
      setPhoneNumber("");
      setEmail("");
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al crear el cliente",
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Crear nuevo cliente" centered>
      <Box>
        <TextInput
          mt="md"
          label="Nombre"
          placeholder="Nombre del cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextInput
          mt="md"
          label="Número de Teléfono"
          placeholder="Teléfono del cliente"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <TextInput
          mt="md"
          label="Correo Electrónico"
          placeholder="Correo electrónico (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button mt="md" color="blue" fullWidth onClick={handleCreateClient}>
          Crear Cliente
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateClientModal;
