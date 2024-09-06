import React, { useState } from 'react';
import { Box, Divider, TextInput, Button, Text } from '@mantine/core';
import CreateUser from './CreateUser';
import UserTable from './UserTable';

const UserManagement: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'natysipq' && password === '0714') {
      setAuthenticated(true);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  if (!authenticated) {
    return (
      <Box
        style={{
          maxWidth: '400px',
          margin: 'auto',
          padding: '2rem',
          backgroundColor: '#1A202C',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Text size="xl" mb="xl">
          Iniciar sesión
        </Text>
        <TextInput
          label="Usuario"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          required
          mb="md"
        />
        <TextInput
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
          mb="md"
        />
        {error && (
          <Text color="red" mb="md">
            {error}
          </Text>
        )}
        <Button fullWidth onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  return (
    <Box
      bg="#1A202C"
      p="lg"
      m="auto"
      style={{
        maxWidth: '1200px',
        width: '100%',
        padding: '1rem',
        '@media (maxWidth: 768px)': {
          padding: '0.5rem',
        },
      }}
    >
      <CreateUser />
      <Divider my="xl" />
      <UserTable />
    </Box>
  );
};

export default UserManagement;
