import React, { useState, ChangeEvent } from "react";
import { TextInput, Button, Box, Modal } from "@mantine/core";
import { createClient } from "../../../services/clientService";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface CreateClientProps {
  opened: boolean;
  onClose: () => void;
  fetchClients: () => void; // Prop para actualizar la tabla de clientes
}

const CreateClient: React.FC<CreateClientProps> = ({
  opened,
  onClose,
  fetchClients,
}) => {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  
  const organizationId = useSelector(
    (state: RootState) => state.auth.organizationId
  );

  const handleCreateClient = async (): Promise<void> => {
    try {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const newClient = { name, phoneNumber, email, organizationId: organizationId as string };
      await createClient(newClient);

      // Mostrar notificación flotante de éxito
      showNotification({
        title: "Éxito",
        message: "Cliente creado con éxito",
        color: "green",
        autoClose: 1000,
        position: "top-right",
      });

      // Resetear campos del formulario
      setName("");
      setPhoneNumber("");
      setEmail("");

      // Refrescar la lista de clientes
      fetchClients();

      // Cerrar el modal
      onClose();
    } catch (err) {
      console.error(err);

      // Mostrar notificación de error
      showNotification({
        title: "Error",
        message: "Error al crear el cliente",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setter(event.target.value);
    };

  return (
    <Modal opened={opened} onClose={onClose} title="Crear Cliente">
      <Box>
        <TextInput
          mt="md"
          label="Nombre"
          value={name}
          onChange={handleInputChange(setName)}
          required
        />
        <TextInput
          mt="md"
          label="Número de Teléfono"
          value={phoneNumber}
          onChange={handleInputChange(setPhoneNumber)}
          required
        />
        <TextInput
          mt="md"
          label="Correo Electrónico"
          value={email}
          onChange={handleInputChange(setEmail)}
        />
        <Button mt="md" color="blue" onClick={handleCreateClient}>
          Crear Cliente
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateClient;
