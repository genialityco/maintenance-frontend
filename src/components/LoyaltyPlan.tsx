import React from 'react';
import { Progress, Text, Box } from '@mantine/core';

interface LoyaltyPlanProps {
  servicesTaken: number;
  totalServices: number;
}

const LoyaltyPlan: React.FC<LoyaltyPlanProps> = ({ servicesTaken, totalServices }) => {
  const progress = (servicesTaken / totalServices) * 100;

  return (
    <Box
      bg="#1A202C"
      p="md"
      m="md"
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        color: '#E2E8F0',
        maxWidth: 400,
      }}
    >
      <Text size="lg" fw={700} mb="sm">
        Plan de Lealtad
      </Text>
      <Text>Servicios Tomados: {servicesTaken}</Text>
      <Text>Servicios Totales: {totalServices}</Text>
      <Progress value={progress} mt="sm" />
    </Box>
  );
};

export default LoyaltyPlan;
