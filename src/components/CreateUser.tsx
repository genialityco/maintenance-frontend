import React, { useState } from 'react';
import { TextInput, Button, Box, Text, Notification } from '@mantine/core';
import { createUser } from '../services/userService';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  servicesTaken: number;
  referralsMade: number;
  // Otros campos relevantes para el usuario
}

const CreateUser: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    try {
      const newUser = { name, phoneNumber, email };
      const response = await createUser(newUser);
      setResponseMessage('Usuario creado con éxito');
      setError(null);
      // Limpiar campos
      setName('');
      setPhoneNumber('');
      setEmail('');
    } catch (err) {
      setError('Error al crear el usuario');
      setResponseMessage(null);
    }
  };

  return (
    <Box
      bg="#1A202C"
      p="xl"
      m="auto"
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        color: '#E2E8F0',
      }}
    >
      <Text size="xl" fw={700}>
        Crear Usuario
      </Text>
      <TextInput
        mt="md"
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextInput
        mt="md"
        label="Número de Teléfono"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <TextInput
        mt="md"
        label="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button mt="md" color="blue" onClick={handleCreateUser}>
        Crear Usuario
      </Button>
      {responseMessage && (
        <Notification color="green" mt="md">
          {responseMessage}
        </Notification>
      )}
      {error && (
        <Notification color="red" mt="md">
          {error}
        </Notification>
      )}
    </Box>
  );
};

export default CreateUser;
