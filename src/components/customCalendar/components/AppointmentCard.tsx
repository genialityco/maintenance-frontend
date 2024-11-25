import React from "react";
import { Paper, Group, Text, Badge, Menu, ActionIcon } from "@mantine/core";
import {
  BiDotsVertical,
  BiEdit,
  BiTrash,
  BiCheck,
  BiLock,
  BiUser,
} from "react-icons/bi";
import { format } from "date-fns";
import { Appointment } from "../../../services/appointmentService";
import { usePermissions } from "../../../hooks/usePermissions";
import { RiUserSmileLine } from "react-icons/ri";

interface AppointmentCardProps {
  appointment: Appointment;
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "confirmed":
      return { backgroundColor: "#d4edda", borderColor: "#28a745" };
    case "pending":
      return { backgroundColor: "#fff3cd", borderColor: "#ffc107" };
    case "cancelled":
      return { backgroundColor: "#f8d7da", borderColor: "#dc3545" };
    default:
      return { backgroundColor: "#f0f4f8", borderColor: "#007bff" };
  }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEditAppointment,
  onCancelAppointment,
  onConfirmAppointment,
}) => {
  const { backgroundColor, borderColor } = getStatusStyles(appointment.status);
  const { hasPermission } = usePermissions();

  return (
    <Paper
      shadow="xs"
      p="sm"
      radius="sm"
      style={{
        backgroundColor: backgroundColor,
        color: "#333",
        borderLeft: `4px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Badge flotante a la izquierda */}
      {appointment.employeeRequestedByClient && (
        <Badge
          color="violet"
          size="xs"
          radius="xxs"
          style={{
            position: "absolute",
            top: "-1px",
            left: "0px",
            fontSize: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          🌟Cita con {appointment.employee.names}
        </Badge>
      )}

      {/* Contenido principal */}
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm" truncate>
          {appointment.service.name}
        </Text>
        <Badge color="blue" variant="light">
          {format(appointment.startDate, "h:mm a")} -{" "}
          {format(appointment.endDate, "h:mm a")}
        </Badge>
      </Group>
      <Text size="smd" c="dimmed" truncate>
        <RiUserSmileLine size={16} /> {appointment.employee.names}
      </Text>
      <Text size="xs" c="dimmed" truncate>
        <BiUser size={16} /> {appointment.client.name}
      </Text>

      {/* Menú de acciones */}
      <Menu
        disabled={appointment.status === "confirmed"}
        position="top-end"
        withArrow
      >
        <Menu.Target>
          <ActionIcon
            variant="transparent"
            color="dark"
            style={{ position: "absolute", bottom: 5, right: 5, zIndex: 10 }}
          >
            {appointment.status === "confirmed" ? (
              <BiLock />
            ) : (
              <BiDotsVertical />
            )}
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<BiEdit size={16} />}
            disabled={!hasPermission("appointments:update")}
            onClick={() => onEditAppointment(appointment)}
          >
            Editar Cita
          </Menu.Item>
          <Menu.Item
            leftSection={<BiTrash size={16} />}
            disabled={!hasPermission("appointments:cancel")}
            onClick={() => onCancelAppointment(appointment._id)}
            color="red"
          >
            Cancelar Cita
          </Menu.Item>
          <Menu.Item
            leftSection={<BiCheck size={16} />}
            disabled={!hasPermission("appointments:confirm")}
            onClick={() => onConfirmAppointment(appointment._id)}
            color="green"
          >
            Confirmar Cita Realizada
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
};

export default AppointmentCard;
