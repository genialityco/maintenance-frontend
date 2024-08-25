import React, { useState, useEffect } from 'react';
import SearchUser from './SearchUser';
import PlanInfo from './PlanInfo';
import { Box } from '@mantine/core';
import { getUserByPhoneNumber } from '../services/userService.tsx'; // Asegúrate de ajustar la importación según tu estructura de archivos

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  servicesTaken: number;
  referralsMade: number;
  // Otros campos relevantes para el usuario
}

const PlanViewer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Efecto para verificar si hay un usuario guardado en el localStorage y actualizar su información
  useEffect(() => {
    const fetchUpdatedUser = async (phoneNumber: string) => {
      try {
        const updatedUser = await getUserByPhoneNumber(phoneNumber);
        if (updatedUser) {
          setUser(updatedUser);
          localStorage.setItem('savedUser', JSON.stringify(updatedUser));
        }
      } catch (err) {
        setError('Hubo un error al actualizar la información del usuario.');
        console.error('Error fetching updated user:', err);
      } finally {
        setLoading(false);
      }
    };

    const savedUser = localStorage.getItem('savedUser');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchUpdatedUser(parsedUser.phoneNumber);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUserFound = (user: User) => {
    setUser(user);
    localStorage.setItem('savedUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear()
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box style={{ margin: 'auto' }}>
      {!user ? (
        <SearchUser onUserFound={handleUserFound} />
      ) : (
        <PlanInfo user={user} onLogout={handleLogout} />
      )}
    </Box>
  );
};

export default PlanViewer;
