import React, { useState } from "react";
import { Box, Button, Modal, TextInput, Group, Text } from "@mantine/core";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const ScheduleView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
  });

  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setModalOpened(false);
  };

  return (
    <Box bg="#1A202C">
      <Group justify="space-around" mb="md">
        <Text size="xl" fw={700} c="white">
          Gestionar Agenda
        </Text>
        <Button color="blue" onClick={() => setModalOpened(true)}>
          Añadir Cita
        </Button>
      </Group>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Añadir nueva cita"
      >
        <TextInput
          label="Título"
          placeholder="Descripción de la cita"
          value={newEvent.title}
          onChange={(e) =>
            setNewEvent({ ...newEvent, title: e.currentTarget.value })
          }
          required
        />
        <TextInput
          label="Fecha de inicio"
          type="datetime-local"
          value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) =>
            setNewEvent({ ...newEvent, start: new Date(e.currentTarget.value) })
          }
          required
        />
        <TextInput
          label="Fecha de fin"
          type="datetime-local"
          value={format(newEvent.end, "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) =>
            setNewEvent({ ...newEvent, end: new Date(e.currentTarget.value) })
          }
          required
        />
        <Button fullWidth mt="md" onClick={handleAddEvent}>
          Añadir Cita
        </Button>
      </Modal>

      {/* Vista del calendario con vistas habilitadas */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, backgroundColor: "white", padding: "1rem" }}
        culture="es"
        messages={{
          week: "Semana",
          day: "Día",
          month: "Mes",
          today: "Hoy",
          previous: "Anterior",
          next: "Siguiente",
          noEventsInRange: "No hay eventos en este rango",
        }}
      />
    </Box>
  );
};

export default ScheduleView;
