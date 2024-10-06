import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextInput,
  Group,
  Text,
  SegmentedControl,
  Paper,
  Container,
  Title,
  Grid,
} from "@mantine/core";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek as startOfCalendarWeek,
  endOfWeek as endOfCalendarWeek,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { useMediaQuery } from "@mantine/hooks";
import { BiArrowBack } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { createAppointment, getAppointments } from "../api/appointmentService";

interface Appointment {
  service: string;
  startDate: Date;
  endDate: Date;
}

const CustomCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalOpenedAppointment, setModalOpenedAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>(
    {}
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">("day");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Detectar si es pantalla móvil
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const handleNavigation = (direction: "prev" | "next") => {
    const dateAdjustments = {
      month: { prev: subMonths, next: addMonths },
      week: { prev: subWeeks, next: addWeeks },
      day: { prev: subDays, next: addDays },
    };

    const adjustDate = dateAdjustments[view][direction];
    setCurrentDate(adjustDate(currentDate, 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setModalOpened(true);
  };

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

  const getAppointmentsForDay = (day: Date) =>
    appointments.filter((event) => isSameDay(event.startDate, day));

  // Vista de mes
  const renderMonthView = () => {
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({
      start: startOfCalendarWeek(startMonth),
      end: endOfCalendarWeek(endMonth),
    });

    return (
      <Box>
        <Grid>
          {daysOfWeek.map((day, index) => (
            <Grid.Col span={1.7} key={index}>
              <Text ta="center" fw={500} size={isMobile ? "xs" : "md"}>
                {day}
              </Text>
            </Grid.Col>
          ))}
        </Grid>
        <Grid gutter="xs">
          {daysInMonth.map((day) => (
            <Grid.Col span={1.7} key={day.toISOString()}>
              <Paper
                shadow="sm"
                radius="md"
                p="xs"
                withBorder
                onClick={() => handleDayClick(day)}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  height: "100%",
                }}
              >
                <Text
                  size={isMobile ? "xs" : "sm"}
                  mb="xs"
                  ta="center"
                  fw={500}
                >
                  {format(day, "d", { locale: es })}
                </Text>
                {getAppointmentsForDay(day).length > 0 && (
                  <Text
                    ta="center"
                    size="xs"
                    c="dimmed"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                    }}
                  >
                    {getAppointmentsForDay(day).length} citas
                  </Text>
                )}
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    );
  };

  // Vista de semana
  const renderWeekView = () => {
    const startWeek = startOfWeek(currentDate, { locale: es });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));

    return (
      <Grid gutter="xs">
        {weekDays.map((day) => (
          <Grid.Col span={12} key={day.toISOString()}>
            <Paper shadow="sm" radius="md" p="xs" withBorder>
              <Text size={isMobile ? "xs" : "md"} ta="center" fw={500}>
                {format(day, "EEEE, d MMM", { locale: es })}
              </Text>
              {getAppointmentsForDay(day).length > 0 ? (
                getAppointmentsForDay(day).map((event, index) => (
                  <Paper
                    key={index}
                    shadow="xs"
                    p="sm"
                    radius="sm"
                    style={{
                      backgroundColor: "#007bff",
                      color: "#fff",
                      marginTop: "0.5rem",
                    }}
                  >
                    {event.service} -{" "} {format(event.startDate, "HH:mm")} -{" "} {format(event.endDate, "HH:mm")}
                  </Paper>
                ))
              ) : (
                <Text ta="center" size="sm">
                  No hay eventos
                </Text>
              )}
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  // Vista de día
  const renderDayView = () => {
    return (
      <Grid gutter="xs">
        <Grid.Col span={12}>
          <Paper shadow="sm" radius="md" p="xs" withBorder>
            <Text size={isMobile ? "xs" : "md"} ta="center" fw={500}>
              {format(currentDate, "EEEE, d MMMM yyyy", { locale: es })}
            </Text>
            <Box>
              {getAppointmentsForDay(currentDate).length > 0 ? (
                getAppointmentsForDay(currentDate).map((event, index) => (
                  <Paper
                    key={index}
                    shadow="xs"
                    p="sm"
                    radius="sm"
                    style={{
                      backgroundColor: "#007bff",
                      color: "#fff",
                      marginTop: "0.5rem",
                    }}
                  >
                    {event.service} -{" "} {format(event.startDate, "HH:mm")} -{" "} {format(event.endDate, "HH:mm")}
                  </Paper>
                ))
              ) : (
                <Text size={isMobile ? "xs" : "sm"} ta="center">
                  No hay eventos para hoy
                </Text>
              )}
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    );
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

  // Modal para mostrar citas del día
  const renderDayModal = () => {
    if (!selectedDay) return null;

    const appointmentsForSelectedDay = getAppointmentsForDay(selectedDay);

    return (
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={`Agenda para el ${format(selectedDay, "EEEE, d MMMM", {
          locale: es,
        })}`}
        size="lg"
      >
        {appointmentsForSelectedDay.length > 0 ? (
          appointmentsForSelectedDay.map((event, index) => (
            <Paper
              key={index}
              shadow="xs"
              p="sm"
              radius="sm"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                marginBottom: "0.5rem",
              }}
            >
              {event.service} -{" "} {format(event.startDate, "HH:mm")} -{" "} {format(event.endDate, "HH:mm")}
            </Paper>
          ))
        ) : (
          <Text ta="center" size="sm">
            No hay eventos para este día
          </Text>
        )}
      </Modal>
    );
  };

  return (
    <Container size="lg" mt="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Gestionar Agenda</Title>
        <Button color="blue" onClick={() => setModalOpenedAppointment(true)}>
          Añadir Cita
        </Button>
      </Group>

      <SegmentedControl
        value={view}
        onChange={(value) => setView(value as "month" | "week" | "day")}
        data={[
          { label: "Mes", value: "month" },
          { label: "Semana", value: "week" },
          { label: "Día", value: "day" },
        ]}
        fullWidth
        mb="md"
      />

      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}

      {/* Botones de navegación */}
      <Group justify="center" mt="md">
        <Button
          variant="light"
          leftSection={<BiArrowBack />}
          onClick={() => handleNavigation("prev")}
        >
          {view === "month"
            ? "Mes Anterior"
            : view === "week"
            ? "Semana Anterior"
            : "Día Anterior"}
        </Button>
        <Button
          variant="light"
          rightSection={<BsArrowRight />}
          onClick={() => handleNavigation("next")}
        >
          {view === "month"
            ? "Mes Siguiente"
            : view === "week"
            ? "Semana Siguiente"
            : "Día Siguiente"}
        </Button>
      </Group>

      {/* Modal de citas del día */}
      {renderDayModal()}

      {/* Modal para añadir cita */}
      {renderAddAppointmentModal()}
    </Container>
  );
};

export default CustomCalendar;
