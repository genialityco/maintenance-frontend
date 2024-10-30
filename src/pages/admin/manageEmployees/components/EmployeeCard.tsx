import React from "react";
import { Card, Box, Title, Text, Divider, Flex, ActionIcon } from "@mantine/core";
import { BsPencil, BsTrash } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { Employee } from "../../../../services/employeeService";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onViewDetails: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete, onViewDetails }) => (
  <Card shadow="md" radius="md" withBorder>
    <Box p="xs" mt="md">
      <Title order={4}>{employee.names}</Title>
      <Divider my="sm" />
      <Text fw={500} c="dimmed">{employee.position}</Text>
      <Text size="sm" c="dimmed" mt="xs">{employee.email}</Text>
      <Text size="sm" c="dimmed" mt="xs">{employee.phoneNumber}</Text>
      <Flex justify="flex-end" gap="sm" mt="sm">
        <ActionIcon
          variant="gradient"
          radius="lg"
          gradient={{ from: "green", to: "cyan", deg: 90 }}
          onClick={() => onViewDetails(employee)}
        >
          <CgProfile />
        </ActionIcon>
        <ActionIcon
          variant="gradient"
          radius="lg"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
          onClick={() => onEdit(employee)}
        >
          <BsPencil />
        </ActionIcon>
        <ActionIcon
          variant="gradient"
          radius="lg"
          gradient={{ from: "red", to: "orange", deg: 90 }}
          onClick={() => onDelete(employee._id)}
        >
          <BsTrash />
        </ActionIcon>
      </Flex>
    </Box>
  </Card>
);

export default EmployeeCard;
