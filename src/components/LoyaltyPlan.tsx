import { useState } from 'react';
import { Box, Group, Text, Progress, Button } from '@mantine/core';

const LoyaltyPlan = () => {
  const [servicesTaken, setServicesTaken] = useState(3);
  const totalServices = 5;

  const handleService = () => {
    if (servicesTaken < totalServices) {
      setServicesTaken((prev) => prev + 1);
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
      <Group >
        <Text size="xl" fw={700}>
          Plan de Fidelidad
        </Text>
        <Text size="md" c="dimmed">
          {servicesTaken} de {totalServices} servicios tomados
        </Text>
      </Group>

      <Progress
        value={(servicesTaken / totalServices) * 100}
        size="lg"
        mt="md"
        color={servicesTaken === totalServices ? 'green' : 'blue'}
      />

      {servicesTaken === totalServices ? (
        <Text mt="md" color="green" fw={500}>
          ¡Felicidades! Has alcanzado 5 servicios. Recibe tu descuento o regalo especial.
        </Text>
      ) : (
        <Text mt="md" color="dimmed">
          Completa {totalServices - servicesTaken} servicio(s) más para obtener un beneficio especial.
        </Text>
      )}

      <Button
        mt="lg"
        color="blue"
        onClick={handleService}
        disabled={servicesTaken === totalServices}
      >
        Registrar Servicio
      </Button>
    </Box>
  );
};

export default LoyaltyPlan;
