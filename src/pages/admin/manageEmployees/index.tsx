import React, { useEffect, useState } from "react";
import {
  Box,
  Title,
  Group,
  Divider,
  Button,
  Grid,
  TextInput,
} from "@mantine/core";
import { BsSearch } from "react-icons/bs";
import { showNotification } from "@mantine/notifications";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../services/employeeService";
import ModalCreateEdit from "./components/ModalCreateEditEmployee";
import { getServices, Service } from "../../../services/serviceService";
import { Employee } from "../../../services/employeeService";
import EmployeeCard from "./components/EmployeeCard";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
    fetchServices();
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

  const fetchServices = async () => {
    try {
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al cargar los servicios",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  // Funciones para empleado
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
      if (employee._id) {
        await updateEmployee(employee._id, employee);
      } else {
        await createEmployee({
          ...employee,
          password: "defaultPassword",
        });
      }

      fetchServices();
      loadEmployees();

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

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
      loadEmployees();
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

  const handleEditEmployee = (employee: Employee) => {
    if (!employee.services) return;
    const employeeWithServices = {
      ...employee,
      services: employee.services.map(
        (service) => services.find((s) => s._id === service._id) as Service
      ),
    };
    setEditingEmployee(employeeWithServices);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const showEmployeeDetailsModal = (employee : Employee) => {
    setShowEmployeeDetails(true);
    setSelectedEmployee(employee);
  };

  const onCloseModalEmployeeDetails = () => {
    setShowEmployeeDetails(false);
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
        services={services}
        onSave={handleSaveEmployee}
      />

      <Grid>
        {filteredEmployees.map((employee) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={employee._id}>
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onViewDetails={showEmployeeDetailsModal}
            />
          </Grid.Col>
        ))}
      </Grid>

      <EmployeeDetailsModal
        isOpen={showEmployeeDetails}
        onClose={onCloseModalEmployeeDetails}
        employee={selectedEmployee}
      />
    </Box>
  );
};

export default AdminEmployees;
