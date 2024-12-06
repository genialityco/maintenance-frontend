import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Text,
  Badge,
  Stack,
  Menu,
  CheckIcon,
  ActionIcon,
  Modal,
  Select,
  Button,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  Reservation,
  getReservationsByOrganization,
  updateReservation,
  deleteReservation,
} from "../../../services/reservationService";
import { getEmployeesByOrganizationId, Employee } from "../../../services/employeeService";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import { BiDotsVertical, BiTrash, BiXCircle, BiUser } from "react-icons/bi";
import CustomLoader from "../../../components/customLoader/CustomLoader";

const ReservationsList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState<string | null>(null);

  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );

  useEffect(() => {
    if (organization?._id) {
      fetchReservations(organization._id);
      fetchEmployees(organization._id);
    }
  }, [organization]);

  const fetchReservations = async (organizationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReservationsByOrganization(organizationId);
      const sortedReservations = data.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setReservations(sortedReservations);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las reservas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (organizationId: string) => {
    try {
      const data = await getEmployeesByOrganizationId(organizationId);
      setEmployees(data);
    } catch (err) {
      console.error("Error al cargar los empleados:", err);
    }
  };

  const handleUpdateStatus = async (
    reservationId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const reservation = reservations.find((r) => r._id === reservationId);
      if (!reservation) {
        showNotification({
          title: "Error",
          message: "Reserva no encontrada",
          color: "red",
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (newStatus === "approved" && !reservation.employeeId) {
        setModalOpen(true);
        setCurrentReservationId(reservationId);
        return;
      }

      await updateReservation(reservationId, { status: newStatus });
      fetchReservations(organization!._id!);
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Error",
        message: `${err}`,
        color: "red",
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleEmployeeAssign = async () => {
    if (!selectedEmployee || !currentReservationId) return;

    try {
      await updateReservation(currentReservationId, { employeeId: selectedEmployee });
      setModalOpen(false);
      setSelectedEmployee(null);
      setCurrentReservationId(null);
      fetchReservations(organization!._id!);
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Error",
        message: "Error al asignar empleado",
        color: "red",
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (reservationId: string) => {
    try {
      await deleteReservation(reservationId);
      fetchReservations(organization!._id!);
    } catch (err) {
      console.error("Error al eliminar la reserva:", err);
    }
  };

  const translateStatus = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "approved":
        return "Aprobada";
      case "rejected":
        return "Rechazada";
      default:
        return "Desconocido";
    }
  };

  const getBadgeColor = (
    status: "pending" | "approved" | "rejected"
  ): string => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <Stack align="center" mt="xl">
        <Text c="red">{error}</Text>
      </Stack>
    );
  }

  return (
    <>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Asignar Empleado"
      >
        <Select
          label="Selecciona un empleado"
          placeholder="Empleado"
          data={employees.map((e) => ({ value: e._id, label: e.names }))}
          value={selectedEmployee}
          onChange={setSelectedEmployee}
        />
        <Button
          mt="md"
          fullWidth
          onClick={handleEmployeeAssign}
          disabled={!selectedEmployee}
        >
          Asignar
        </Button>
      </Modal>

      <Card shadow="sm" radius="md" withBorder>
        <Text size="xl" mb="lg">
          Reservas de la Organización
        </Text>
        <Table.ScrollContainer minWidth={500}>
          <Table withTableBorder withColumnBorders striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Servicio</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reservations.map((reservation) => (
                <Table.Tr key={reservation._id}>
                  <Table.Td>
                    {dayjs(reservation.startDate).format("DD/MM/YYYY HH:mm")}
                  </Table.Td>
                  <Table.Td>
                    {typeof reservation.serviceId === "string"
                      ? reservation.serviceId
                      : reservation.serviceId?.name || "Sin especificar"}
                  </Table.Td>
                  <Table.Td>{reservation.customerDetails.name}</Table.Td>
                  <Table.Td>
                    <Badge fullWidth color={getBadgeColor(reservation.status)}>
                      {translateStatus(reservation.status)}
                    </Badge>
                  </Table.Td>
                  <Table.Td align="center">
                    <Menu withArrow position="bottom-end" shadow="sm">
                      <Menu.Target>
                        <ActionIcon variant="light" radius="md">
                          <BiDotsVertical />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {reservation.status === "pending" && (
                          <>
                            <Menu.Item
                              leftSection={<CheckIcon size={16} />}
                              onClick={() =>
                                handleUpdateStatus(reservation._id!, "approved")
                              }
                            >
                              Aprobar
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<BiXCircle size={16} />}
                              color="red"
                              onClick={() =>
                                handleUpdateStatus(reservation._id!, "rejected")
                              }
                            >
                              Rechazar
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item
                          leftSection={<BiUser size={16} />}
                          onClick={() => {
                            setModalOpen(true);
                            setCurrentReservationId(reservation._id!);
                          }}
                        >
                          Cambiar Empleado
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<BiTrash size={16} />}
                          color="gray"
                          onClick={() => handleDelete(reservation._id!)}
                        >
                          Eliminar
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </>
  );
};

export default ReservationsList;
