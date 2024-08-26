import React from 'react';
import { Box, Divider } from '@mantine/core';
import CreateUser from './CreateUser';
import UserTable from './UserTable';

const UserManagement: React.FC = () => {
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
