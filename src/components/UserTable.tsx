import React, { useEffect, useState } from 'react';
import { Box, Text, Table, Button, Group } from '@mantine/core';
import { getUsers, registerService, registerReferral } from '../services/userService';

interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  servicesTaken: number;
  referralsMade: number;
  // Otros campos relevantes para el usuario
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
        setError(null);
      } catch (err) {
        setError('Error al obtener la lista de usuarios');
      }
    };

    fetchUsers();
  }, []);

  const handleRegisterService = async (userId: string) => {
    try {
      await registerService(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, servicesTaken: user.servicesTaken + 1 }
            : user
        )
      );
    } catch (err) {
      console.error('Error al registrar el servicio', err);
    }
  };

  const handleRegisterReferral = async (userId: string) => {
    try {
      await registerReferral(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                referralsMade: user.referralsMade + 1,
                servicesTaken: user.servicesTaken + 1,
              }
            : user
        )
      );
    } catch (err) {
      console.error('Error al registrar el referido', err);
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
        Lista de Usuarios
      </Text>
      {error && (
        <Text mt="md" color="red">
          {error}
        </Text>
      )}
      <Table mt="md">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Servicios Tomados</th>
            <th>Referidos Hechos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.email || 'No proporcionado'}</td>
              <td>{user.servicesTaken}</td>
              <td>{user.referralsMade}</td>
              <td>
                <Group spacing="xs">
                  <Button
                    size="xs"
                    color="blue"
                    onClick={() => handleRegisterService(user._id)}
                  >
                    Registrar Servicio
                  </Button>
                  <Button
                    size="xs"
                    color="green"
                    onClick={() => handleRegisterReferral(user._id)}
                  >
                    Registrar Referido
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default UserTable;
