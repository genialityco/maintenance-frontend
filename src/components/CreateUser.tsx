import React, { useState, ChangeEvent } from 'react';
import { TextInput, Button, Box, Text, Notification } from '@mantine/core';
import { createUser } from '../services/userService';

const CreateUser: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async (): Promise<void> => {
    try {
      const newUser = { name, phoneNumber, email };
      await createUser(newUser); 
      setResponseMessage('Usuario creado con éxito');
      setError(null);
      setName('');
      setPhoneNumber('');
      setEmail('');
    } catch (err) {
      console.log(err);
      setError('Error al crear el usuario');
      setResponseMessage(null);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (event: ChangeEvent<HTMLInputElement>): void => {
      setter(event.target.value);
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
        maxWidth: '600px',
        width: '100%',
        '@media (maxWidth: 768px)': {
          padding: '1rem',
        },
      }}
    >
      <Text size="xl" fw={700}>
        Crear Usuario
      </Text>
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
