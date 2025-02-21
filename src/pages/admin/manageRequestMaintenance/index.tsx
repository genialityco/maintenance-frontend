import React, { useEffect, useState } from "react";
import {
  assignEmployeeToRequest,
  deleteMaintenanceRequest,
  getMaintenanceRequests,
  MaintenanceRequest,
  updateMaintenanceRequestStatus,
  updateMaintenanceRequest,
} from "../../../services/maintenanceRequestService";
import { showNotification } from "@mantine/notifications";
import { Employee, getEmployees } from "../../../services/employeeService";
import {
  ActionIcon,
  Button,
  CheckIcon,
  Container,
  Group,
  Modal,
  Select,
  Table,
} from "@mantine/core";
import CustomLoader from "../../../components/customLoader/CustomLoader";
import { BiEdit, BiTrash, BiUserCircle } from "react-icons/bi";
import dayjs from "dayjs";
import MaintenanceForm from "../../../components/MaintenanceForm";
import { usePermissions } from "../../../hooks/usePermissions";

const ManageRequestMaintenance: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [status, setStatus] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    fetchRequests();
    fetchEmployees();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getMaintenanceRequests();
      setRequests(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al cargar los solicitudes de mantenimiento.",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error(error);
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
      await deleteMaintenanceRequest(id);
      fetchRequests();
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedRequest) return;
    await updateMaintenanceRequestStatus(
      selectedRequest._id,
      status as "Pending" | "In process" | "Complete"
    );
    setShowStatusModal(false);
    fetchRequests();
  };

  const handleSubmit = async () => {
    if (!selectedRequest) return;
    await updateMaintenanceRequest(selectedRequest._id, selectedRequest);
  };

  const handleAssignEmployee = async () => {
    if (!selectedRequest) return;
    await assignEmployeeToRequest(selectedRequest._id, employeeId);
    setShowEmployeeModal(false);
    fetchRequests();
  };

  return (
    <Container size="lg">
      <h2>Solicitudes de Mantenimiento</h2>

      {loading ? (
        <CustomLoader />
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Image</Table.Th>
              <Table.Th>Fecha de solicitud</Table.Th>
              <Table.Th>Ubicación</Table.Th>
              <Table.Th>Elemento</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Empleado Asignado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((request) => (
              <Table.Tr key={request._id}>
                <Table.Td>
                  <img
                    src={request.photo || "/placeholder.jpg"} 
                    alt="Miniatura"
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 5,
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  {dayjs(request.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </Table.Td>
                <Table.Td>{request.location}</Table.Td>
                <Table.Td>{request.damagedItem}</Table.Td>
                <Table.Td>{request.description}</Table.Td>
                <Table.Td>{request.status}</Table.Td>
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
                      <CheckIcon size={18} />
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

                    {hasPermission("businessInformation:read") && (
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(request._id)}
                      >
                        <BiTrash size={18} />
                      </ActionIcon>
                    )}

                    <ActionIcon
                      color="yellow"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowEditModal(true);
                      }}
                    >
                      <BiEdit size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
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

      {/* Modal para editar solicitud */}
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

export default ManageRequestMaintenance;
