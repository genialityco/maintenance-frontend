import React, { useEffect, useState } from "react";
import {
  Box,
  Title,
  Card,
  Group,
  Divider,
  Flex,
  Button,
  Text,
  ActionIcon,
  Grid,
  TextInput,
} from "@mantine/core";
import { BsTrash, BsPencil, BsSearch } from "react-icons/bs";
import { showNotification } from "@mantine/notifications";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../services/employeeService";
import ModalCreateEdit from "./components/ModalCreateEditEmployee";

interface Employee {
  _id: string;
  names: string;
  position: string;
  email: string;
  phoneNumber: string;
  username: string;
}

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const loadEmployees = async () => {
    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al cargar los empleados",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const filterEmployees = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phoneNumber.includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  };

  const handleSaveEmployee = async (employee: Employee) => {
    try {
      let updatedEmployees;

      if (employee._id) {
        const updatedEmployee = await updateEmployee(employee._id, employee);
        updatedEmployees = employees.map((e) =>
          e._id === employee._id ? updatedEmployee : e
        );
      } else {
        const createdEmployee = await createEmployee({ ...employee, password: "defaultPassword" });
        updatedEmployees = [...employees, createdEmployee];
      }

      setEmployees(
        updatedEmployees.filter(
          (employee): employee is Employee => employee !== undefined
        )
      );

      setIsModalOpen(false);
      setEditingEmployee(null);

      showNotification({
        title: employee._id ? "Empleado actualizado" : "Empleado agregado",
        message: "El empleado ha sido guardado correctamente",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al guardar el empleado",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string, index: number) => {
    try {
      await deleteEmployee(employeeId);
      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees);
      showNotification({
        title: "Empleado eliminado",
        message: "El empleado ha sido eliminado correctamente",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al eliminar el empleado",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };
  

  return (
    <Box>
      <Group justify="space-between" mt="xl">
        <Title order={1}>Administrar Empleados</Title>

        <Button
          onClick={() => {
            setIsModalOpen(true);
            setEditingEmployee(null);
          }}
        >
          Agregar Nuevo Empleado
        </Button>
      </Group>

      <Divider my="md" />

      <TextInput
        leftSection={<BsSearch />}
        placeholder="Buscar empleado..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        mb="md"
      />

      <ModalCreateEdit
        isOpen={isModalOpen}
        onClose={onCloseModal}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />

      <Grid>
        {filteredEmployees.map((employee, index) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={employee._id}>
            <Card shadow="md" radius="md" withBorder>
              <Box p="xs" mt="md">
                <Title order={4}>{employee.names}</Title>
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
                <Flex justify="space-between" mt="sm">
                  <ActionIcon
                    variant="gradient"
                    radius="lg"
                    gradient={{ from: "blue", to: "cyan", deg: 90 }}
                    onClick={() => {
                      setIsModalOpen(true);
                      setEditingEmployee(employee);
                    }}
                  >
                    <BsPencil />
                  </ActionIcon>
                  <ActionIcon
                    variant="gradient"
                    radius="lg"
                    gradient={{ from: "red", to: "orange", deg: 90 }}
                    onClick={() => handleDeleteEmployee(employee._id, index)}
                  >
                    <BsTrash />
                  </ActionIcon>
                </Flex>
              </Box>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminEmployees;
