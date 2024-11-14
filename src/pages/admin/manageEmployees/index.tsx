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
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByOrganizationId,
} from "../../../services/employeeService";
import ModalCreateEdit from "./components/ModalCreateEditEmployee";
import {
  getServicesByOrganizationId,
  Service,
} from "../../../services/serviceService";
import { Employee } from "../../../services/employeeService";
import EmployeeCard from "./components/EmployeeCard";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";
import AdvanceModal from "./components/AdvanceModal";
import { openConfirmModal } from "@mantine/modals";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import CustomLoader from "../../../components/customLoader/CustomLoader";

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const organizationId = useSelector(
    (state: RootState) => state.auth.organizationId
  );

  useEffect(() => {
    loadEmployees();
    fetchServices();
  }, [organizationId]);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const employeesData = await getEmployeesByOrganizationId(organizationId);
      const sortedEmployees = employeesData.sort((_a, b) =>
        b.isActive ? 1 : -1
      );
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al cargar los empleados",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const servicesData = await getServicesByOrganizationId(organizationId);
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
    } finally {
      setIsLoading(false);
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
        if (!organizationId) {
          showNotification({
            title: "Error",
            message:
              "No se ha podido agregar el empleado, la organización no está definida",
            color: "red",
            autoClose: 2000,
            position: "top-right",
          });
          return;
        }
        await createEmployee({
          ...employee,
          organizationId: organizationId,
          password: employee.password || "",
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

  const handleDesactivateEmployee = async (employeeId: string) => {
    openConfirmModal({
      title: "Confirmar desactivación",
      children: (
        <p>
          Desactivar el usuario lo ocultará de la lista de empleados para
          agendar citas, ¿Estas seguro de desactivarlo?
        </p>
      ),
      centered: true,
      labels: { confirm: "Confirmar", cancel: "Cancelar" },
      confirmProps: { color: "green" },
      onConfirm: async () => {
        try {
          await updateEmployee(employeeId, { isActive: false });
          loadEmployees();
          showNotification({
            title: "Empleado desactivado",
            message: "El empleado ha sido desactivado correctamente",
            color: "green",
            autoClose: 2000,
            position: "top-right",
          });
        } catch (error) {
          console.error(error);
          showNotification({
            title: "Error",
            message: "Error al desactivar el empleado",
            color: "red",
            autoClose: 2000,
            position: "top-right",
          });
        }
      },
    });
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    openConfirmModal({
      title: "Confirmar eliminación",
      children: <p>¿Estás seguro de que deseas eliminar este empleado?</p>,
      centered: true,
      labels: { confirm: "Confirmar", cancel: "Cancelar" },
      confirmProps: { color: "green" },
      onConfirm: async () => {
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
          if (
            error instanceof Error &&
            error.message ===
              "No puedes eliminar un empleado con citas asignadas"
          ) {
            showNotification({
              title: "Error",
              message: "No puedes eliminar este usuario, tiene citas asignadas",
              color: "red",
              autoClose: 4000,
              position: "top-right",
            });
            handleDesactivateEmployee(employeeId);
            return;
          }
          showNotification({
            title: "Error",
            message: "Error al eliminar el empleado",
            color: "red",
            autoClose: 2000,
            position: "top-right",
          });
        }
      },
    });
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

  const handleActiveEmployee = async (employeeId: string) => {
    openConfirmModal({
      title: "Confirmar activación",
      children: (
        <p>
          Activar el usuario lo mostrará en la lista de empleados para agendar
          citas, ¿Estas seguro de activarlo?
        </p>
      ),
      centered: true,
      labels: { confirm: "Confirmar", cancel: "Cancelar" },
      confirmProps: { color: "green" },
      onConfirm: async () => {
        try {
          await updateEmployee(employeeId, { isActive: true });
          loadEmployees();
          showNotification({
            title: "Empleado activado",
            message: "El empleado ha sido activado correctamente",
            color: "green",
            autoClose: 2000,
            position: "top-right",
          });
        } catch (error) {
          console.error(error);
          showNotification({
            title: "Error",
            message: "Error al activar el empleado",
            color: "red",
            autoClose: 2000,
            position: "top-right",
          });
        }
      },
    });
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const showEmployeeDetailsModal = (employee: Employee) => {
    setShowEmployeeDetails(true);
    setSelectedEmployee(employee);
  };

  const onCloseModalEmployeeDetails = () => {
    setShowEmployeeDetails(false);
  };

  const handleShowAdvanceModal = (employee: Employee) => {
    setShowAdvanceModal(true);
    setSelectedEmployee(employee);
  };

  const onCloseAdvanceModal = () => {
    setShowAdvanceModal(false);
  };

  if( isLoading ) {
    return (
      <CustomLoader />
    )
  }

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

      <Grid>
        {filteredEmployees.map((employee) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={employee._id}>
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onActive={handleActiveEmployee}
              onViewDetails={showEmployeeDetailsModal}
              onShowAdvanceModal={handleShowAdvanceModal}
            />
          </Grid.Col>
        ))}
      </Grid>

      <ModalCreateEdit
        isOpen={isModalOpen}
        onClose={onCloseModal}
        employee={editingEmployee}
        services={services}
        onSave={handleSaveEmployee}
      />

      <EmployeeDetailsModal
        isOpen={showEmployeeDetails}
        onClose={onCloseModalEmployeeDetails}
        employee={selectedEmployee}
      />

      <AdvanceModal
        isOpen={showAdvanceModal}
        onClose={onCloseAdvanceModal}
        employee={selectedEmployee}
      />
    </Box>
  );
};

export default AdminEmployees;
