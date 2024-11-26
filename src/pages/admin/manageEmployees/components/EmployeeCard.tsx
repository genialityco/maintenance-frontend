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
} from "@mantine/core";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { Employee } from "../../../../services/employeeService";
import { RiUserReceivedFill } from "react-icons/ri";
import { FaUserCheck } from "react-icons/fa";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onActive: (employeeId: string) => void;
  onViewDetails: (employee: Employee) => void;
  onShowAdvanceModal: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onActive,
  onViewDetails,
  onShowAdvanceModal,
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
    <Box p="xs" mt="md">
      <Flex justify="space-between" align="center">
        <Title order={4}>{employee.names}</Title>
        {!employee.isActive && (
          <Badge color="red" variant="filled">
            Desactivado
          </Badge>
        )}
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
            gradient={{ from: "purple", to: "pink", deg: 90 }}
            onClick={() => onShowAdvanceModal(employee)}
          >
            <FaMoneyBillTransfer />
          </ActionIcon>
          <ActionIcon
            variant="gradient"
            gradient={{ from: "green", to: "cyan", deg: 90 }}
            onClick={() => onViewDetails(employee)}
          >
            <RiUserReceivedFill />
          </ActionIcon>
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
