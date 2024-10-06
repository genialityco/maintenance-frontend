import React, { useState, ChangeEvent } from "react";
import { TextInput, Button, Box, Modal } from "@mantine/core";
import { createUser } from "../../../api/userService";
import { showNotification } from "@mantine/notifications"; // Para mostrar notificación flotante

interface CreateUserProps {
  opened: boolean;
  onClose: () => void;
  fetchUsers: () => void; // Nueva prop para actualizar la tabla de usuarios
}

const CreateUser: React.FC<CreateUserProps> = ({ opened, onClose, fetchUsers }) => {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleCreateUser = async (): Promise<void> => {
    try {
      const newUser = { name, phoneNumber, email };
      await createUser(newUser);

      // Mostrar notificación flotante de éxito
      showNotification({
        title: "Éxito",
        message: "Usuario creado con éxito",
        color: "green",
        autoClose: 1000,
        position: "top-right",
      });

      // Resetear campos del formulario
      setName("");
      setPhoneNumber("");
      setEmail("");

      // Refrescar la lista de usuarios
      fetchUsers();

      // Cerrar el modal
      onClose();
    } catch (err) {
      console.log(err);

      // Mostrar notificación de error
      showNotification({
        title: "Error",
        message: "Error al crear el usuario",
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
    <Modal opened={opened} onClose={onClose} title="Crear Usuario">
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
        <Button mt="md" color="blue" onClick={handleCreateUser}>
          Crear Usuario
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateUser;
