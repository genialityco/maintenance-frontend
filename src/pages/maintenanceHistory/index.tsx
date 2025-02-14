import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Table,
  Badge,
  Modal,
  ActionIcon,
  Group,
  Select,
  Button,
} from "@mantine/core";
import {
  getMaintenanceRequests,
  MaintenanceRequest,
  updateMaintenanceRequestStatus,
  assignEmployeeToRequest,
  deleteMaintenanceRequest,
  updateMaintenanceRequest,
} from "../../services/maintenanceRequestService";
import { showNotification } from "@mantine/notifications";
import { Employee, getEmployees } from "../../services/employeeService";
import CustomLoader from "../../components/customLoader/CustomLoader";
import { BiEdit, BiTrash, BiUserCircle, BiCheckCircle } from "react-icons/bi";
import MaintenanceForm from "../../components/MaintenanceForm";
import dayjs from "dayjs"

const statusColors: Record<string, string> = {
  Pending: "red",
  "In process": "yellow",
  Complete: "green",
};

const MaintenanceHistory = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchRequests();
    fetchEmployees();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getMaintenanceRequests();
      // Filtrar solo las solicitudes en estado "Complete"
      const completedRequests = response.filter(
        (request) => request.status === "Complete"
      );
      setRequests(completedRequests);
    } catch (error) {
      console.error("Error al obtener el historial de mantenimientos:", error);
      showNotification({
        title: "Error",
        message: "Error al cargar las solicitudes completadas.",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error("Error al cargar los empleados:", error);
      showNotification({
        title: "Error",
        message: "Error al cargar los empleados.",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta solicitud?")) {
      try {
        await deleteMaintenanceRequest(id);
        fetchRequests(); // Recargar las solicitudes después de eliminar
        showNotification({
          title: "Éxito",
          message: "Solicitud eliminada correctamente.",
          color: "green",
          autoClose: 2000,
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al eliminar la solicitud:", error);
        showNotification({
          title: "Error",
          message: "Error al eliminar la solicitud.",
          color: "red",
          autoClose: 2000,
          position: "top-right",
        });
      }
    }
  };

  const handleEdit = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedRequest) return;
    try {
      await updateMaintenanceRequestStatus(
        selectedRequest._id,
        status as "Pending" | "In process" | "Complete"
      );
      setShowStatusModal(false);
      fetchRequests(); // Recargar las solicitudes después de actualizar el estado
      showNotification({
        title: "Éxito",
        message: "Estado de la solicitud actualizado correctamente.",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      showNotification({
        title: "Error",
        message: "Error al actualizar el estado de la solicitud.",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedRequest) return;
    try {
      await assignEmployeeToRequest(selectedRequest._id, employeeId);
      setShowEmployeeModal(false);
      fetchRequests(); // Recargar las solicitudes después de asignar un empleado
      showNotification({
        title: "Éxito",
        message: "Empleado asignado correctamente.",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error al asignar empleado:", error);
      showNotification({
        title: "Error",
        message: "Error al asignar empleado.",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedRequest) return;
    try {
      await updateMaintenanceRequest(selectedRequest._id, selectedRequest);
      setShowEditModal(false);
      fetchRequests();
      showNotification({
        title: "Éxito",
        message: "Solicitud actualizada correctamente.",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      showNotification({
        title: "Error",
        message: "Error al actualizar la solicitud.",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  return (
    <Container size="md">
      <Title ta="center" mb="lg">
        Historial de Mantenimientos Completados
      </Title>

      {loading ? (
        <CustomLoader />
      ) : (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Fecha solicitud</Table.Th>
              <Table.Th>Fecha finalización</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Empleado Asignado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <Table.Tr key={request._id}>
                  <Table.Td>
                    {dayjs(request.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </Table.Td>
                  <Table.Td>
                    {dayjs(request.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </Table.Td>
                  <Table.Td>{request.description}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[request.status] || "gray"}>
                      {request.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {request.assignedEmployee
                      ? request.assignedEmployee.names
                      : "Sin asignar"}
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      <ActionIcon
                        color="blue"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowStatusModal(true);
                        }}
                      >
                        <BiCheckCircle size={18} />
                      </ActionIcon>
                      <ActionIcon
                        color="green"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowEmployeeModal(true);
                        }}
                      >
                        <BiUserCircle size={18} />
                      </ActionIcon>
                      <ActionIcon
                        color="yellow"
                        onClick={() => handleEdit(request)}
                      >
                        <BiEdit size={18} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(request._id)}
                      >
                        <BiTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                  No hay registros de mantenimiento completados.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      )}

      {/* Modal para actualizar estado */}
      <Modal
        opened={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Actualizar Estado"
      >
        <Select
          label="Estado"
          data={[
            { value: "Pending", label: "Pendiente" },
            { value: "In process", label: "En Proceso" },
            { value: "Complete", label: "Completado" },
          ]}
          value={status}
          onChange={(value) => setStatus(value || "")}
        />
        <Button fullWidth mt="md" onClick={handleStatusUpdate}>
          Guardar
        </Button>
      </Modal>

      {/* Modal para asignar empleado */}
      <Modal
        opened={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title="Asignar Empleado"
      >
        <Select
          label="Selecciona un empleado"
          placeholder="Empleado"
          data={employees.map((e) => ({ value: e._id, label: e.names }))}
          value={employeeId}
          onChange={(value) => setEmployeeId(value || "")}
        />
        <Button fullWidth mt="md" onClick={handleAssignEmployee}>
          Asignar
        </Button>
      </Modal>

      {/* Modal para editar la solicitud */}
      <Modal
        opened={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Solicitud"
        size="lg"
      >
        {selectedRequest && (
          <MaintenanceForm
            initialValues={selectedRequest}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        )}
      </Modal>
    </Container>
  );
};

export default MaintenanceHistory;
