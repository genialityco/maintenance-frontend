import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Text,
  Badge,
  Stack,
  Loader,
  Menu,
  Button,
  CheckIcon,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  Reservation,
  getReservationsByOrganization,
  updateReservation,
  deleteReservation,
} from "../../../services/reservationService";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import { BiDotsVertical, BiTrash, BiXCircle } from "react-icons/bi";

const ReservationsList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );

  useEffect(() => {
    if (organization?._id) {
      fetchReservations(organization._id);
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

  const handleUpdateStatus = async (
    reservationId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      if (!organization?._id) {
        showNotification({
          title: "Error",
          message: "Ha ocurrido un error al cargar, refresca la página",
          color: "red",
          autoClose: 3000,
        });
        return;
      }
      await updateReservation(reservationId, { status: newStatus });
      fetchReservations(organization._id!);
    } catch (err) {
      console.error("Error al actualizar la reserva:", err);
    }
  };

  const handleDelete = async (reservationId: string) => {
    try {
      if (!organization?._id) {
        showNotification({
          title: "Error",
          message: "Ha ocurrido un error al cargar, refresca la página",
          color: "red",
          autoClose: 3000,
        });
        return;
      }
      await deleteReservation(reservationId);
      fetchReservations(organization._id!);
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

  const getBadgeColor = (status: "pending" | "approved" | "rejected"): string => {
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
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Cargando reservas...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack align="center" mt="xl">
        <Text c="red">{error}</Text>
      </Stack>
    );
  }

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Text size="xl" mb="lg">
        Reservas de la Organización
      </Text>
      <Table>
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
                <Badge color={getBadgeColor(reservation.status)}>
                  {translateStatus(reservation.status)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Menu withArrow position="bottom-end" shadow="sm">
                  <Menu.Target>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<BiDotsVertical size={16} />}
                    >
                      Acciones
                    </Button>
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
    </Card>
  );
};

export default ReservationsList;
