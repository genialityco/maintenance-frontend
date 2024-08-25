import React, { useState, useEffect } from 'react';
import SearchUser from './SearchUser';
import PlanInfo from './PlanInfo';
import { Box } from '@mantine/core';
import { getUserByPhoneNumber } from '../services/userService.tsx'; // Asegúrate de ajustar la importación según tu estructura de archivos
import { User as UserType } from '../services/userService.tsx'

const PlanViewer: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [setError] = useState<string>('');

  // Efecto para verificar si hay un usuario guardado en el localStorage y actualizar su información
  useEffect(() => {
    const fetchUpdatedUser = async (phoneNumber: string) => {
      try {
        const updatedUser = await getUserByPhoneNumber(phoneNumber) as UserType;
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
      const parsedUser: UserType = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchUpdatedUser(parsedUser.phoneNumber);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUserFound = (user: UserType) => {
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
