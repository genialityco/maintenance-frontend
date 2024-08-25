import React from 'react';
import { Box, Divider } from '@mantine/core';
import CreateUser from './CreateUser';
import UserTable from './UserTable';

const UserManagement: React.FC = () => {
  return (
    <Box
      bg="#1A202C"
      p="xl"
      m="auto"
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        color: '#E2E8F0',
        maxWidth: '800px',
      }}
    >
      <CreateUser />
      <Divider my="xl" />
      <UserTable />
    </Box>
  );
};

export default UserManagement;
