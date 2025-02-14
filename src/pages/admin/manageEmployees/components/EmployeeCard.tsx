import React from "react";
import {
  Card,
  Box,
  Title,
  Text,
  Divider,
  Flex,
  ActionIcon,
  Badge,
  Avatar,
} from "@mantine/core";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Employee } from "../../../../services/employeeService";
import { FaUserCheck } from "react-icons/fa";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onActive: (employeeId: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onActive,
}) => (
  <Card
    shadow="md"
    radius="md"
    withBorder
    style={{
      backgroundColor: employee.isActive ? "" : "#f8d7da",
      borderColor: employee.isActive ? "" : "#f5c6cb",
    }}
  >
    <Box >
      <Flex justify="space-between" align="center">
        <Avatar
          src={employee.profileImage || "https://ik.imagekit.io/6cx9tc1kx/default_smile.png?updatedAt=1732716506174"}
          alt={employee.names}
          size={80}
          radius="xl"
          style={{ marginRight: "1rem" }}
        />
        <Box>
          <Title order={4}>{employee.names}</Title>
          {!employee.isActive && (
            <Badge color="red" variant="filled" mt="xs">
              Desactivado
            </Badge>
          )}
        </Box>
      </Flex>
      <Divider my="sm" />
      <Text fw={500} c="dimmed">
        {employee.position}
      </Text>
      <Text size="sm" c="dimmed" mt="xs">
        {employee.email}
      </Text>
      <Text size="sm" c="dimmed" mt="xs">
        {employee.phoneNumber}
      </Text>
      <Flex justify="flex-end" mt="sm">
        <ActionIcon.Group>
          <ActionIcon
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
            onClick={() => onEdit(employee)}
          >
            <BsPencil />
          </ActionIcon>
          {employee.isActive ? (
            <ActionIcon
              variant="gradient"
              gradient={{ from: "red", to: "orange", deg: 90 }}
              onClick={() => onDelete(employee._id)}
            >
              <BsTrash />
            </ActionIcon>
          ) : (
            <ActionIcon
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
              onClick={() => onActive(employee._id)}
            >
              <FaUserCheck />
            </ActionIcon>
          )}
        </ActionIcon.Group>
      </Flex>
    </Box>
  </Card>
);

export default EmployeeCard;
