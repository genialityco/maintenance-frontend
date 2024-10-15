import React, { useEffect, useState } from "react";
import { Box, Button, Group, Modal, TextInput, Title } from "@mantine/core";
import { format } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomCalendar from "../../../components/customCalendar/CustomCalendar";
import {
  createAppointment,
  getAppointments,
} from "../../../services/appointmentService";

interface Appointment {
  service: string;
  startDate: Date;
  endDate: Date;
}

const ScheduleView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>(
    {}
  );
  const [modalOpenedAppointment, setModalOpenedAppointment] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments();
      setAppointments(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = async () => {
    try {
      await createAppointment(newAppointment as Appointment);
      setModalOpenedAppointment(false);
      setNewAppointment({});
      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  // Modal para añadir citas
  const renderAddAppointmentModal = () => {
    return (
      <Modal
        opened={modalOpenedAppointment}
        onClose={() => setModalOpenedAppointment(false)}
        title="Añadir nueva cita"
      >
        <TextInput
          label="Servicio"
          placeholder="Descripción del servicio"
          value={newAppointment?.service || ""}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              service: e.currentTarget.value,
            })
          }
          required
        />
        <TextInput
          label="Inicio de la cita"
          type="datetime-local"
          value={
            newAppointment?.startDate
              ? format(newAppointment.startDate, "yyyy-MM-dd'T'HH:mm")
              : ""
          }
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              startDate: new Date(e.currentTarget.value),
            })
          }
          required
        />
        <TextInput
          label="Fin de la cita"
          type="datetime-local"
          value={
            newAppointment?.endDate
              ? format(newAppointment.endDate, "yyyy-MM-dd'T'HH:mm")
              : ""
          }
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              endDate: new Date(e.currentTarget.value),
            })
          }
          required
        />
        <Button fullWidth mt="md" onClick={addAppointment}>
          Añadir Cita
        </Button>
      </Modal>
    );
  };

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Title order={2}>Gestionar Agenda</Title>
        <Button color="blue" onClick={() => setModalOpenedAppointment(true)}>
          Añadir Cita
        </Button>
      </Group>
      <CustomCalendar appointments={appointments} />

      {/* Modal para añadir cita */}
      {renderAddAppointmentModal()}
    </Box>
  );
};

export default ScheduleView;
