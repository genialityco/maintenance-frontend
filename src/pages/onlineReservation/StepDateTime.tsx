import {
  Stack,
  Badge,
  Notification,
  Grid,
  Flex,
  Text,
  Card,
  Group,
  Divider,
  Button,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { BsExclamationCircle, BsClock } from "react-icons/bs";
import dayjs from "dayjs";
import { fetchAppointmentsAndAvailableTimes } from "./bookingUtils";
import { Appointment } from "../../services/appointmentService";
import { Service } from "../../services/serviceService";
import { useState } from "react";
import { Employee } from "../../services/employeeService";

export interface BookingData {
  serviceId: string | null;
  employeeId: string | null;
  date: Date | null; // Almacena fecha y hora combinadas
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface StepDateTimeProps {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  availableTimes: string[]; // Lista de horarios disponibles como strings
  setAvailableTimes: React.Dispatch<React.SetStateAction<string[]>>;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  services: Service[];
  employees: Employee[];
}

// Función para formatear la duración
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hoursText =
    hours > 0 ? `${hours} ${hours === 1 ? "hora" : "horas"}` : "";
  const minutesText =
    remainingMinutes > 0
      ? `${remainingMinutes} ${remainingMinutes === 1 ? "minuto" : "minutos"}`
      : "";

  return `${hoursText}${hoursText && minutesText ? " y " : ""}${minutesText}`;
};

const StepDateTime: React.FC<StepDateTimeProps> = ({
  bookingData,
  setBookingData,
  availableTimes,
  setAvailableTimes,
  setAppointments,
  services,
  employees,
}) => {
  const [service, setService] = useState<Service>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
    setShowConfirmation(false);

    const selectedService = services.find(
      (s) => s._id === bookingData.serviceId
    );

    if (selectedService) {
      setService(selectedService);
      fetchAppointmentsAndAvailableTimes(
        bookingData.employeeId,
        date,
        selectedService.duration,
        setAppointments,
        setAvailableTimes,
        employees
      );
    }
  };

  const handleTimeSelection = (time: string) => {
    if (!selectedDate) return;

    // Combinar la fecha seleccionada con la hora seleccionada
    const combinedDateTime = dayjs(
      `${dayjs(selectedDate).format("YYYY-MM-DD")} ${time}`,
      "YYYY-MM-DD h:mm A"
    ).toDate();

    setBookingData({ ...bookingData, date: combinedDateTime });
    setShowConfirmation(true);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        {/* Selección de Fecha */}
        <Group align="center">
          <Text size="lg" fw={600}>
            Selecciona una Fecha
          </Text>
          <BsClock size={24} />
        </Group>
        <Divider />
        <Flex justify="center">
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && handleDateSelection(date)}
            minDate={new Date()}
            size="sm"
          />
        </Flex>

        <Divider />

        {/* Horarios Disponibles */}
        {!showConfirmation && (
          <Text size="lg" fw={600}>
            Selecciona una Hora
          </Text>
        )}
        {service && (
          <Text c="dimmed" size="sm">
            Duración del procedimiento: {formatDuration(service.duration)}
          </Text>
        )}
        <Divider />

        {showConfirmation && bookingData.date ? (
          // Mensaje de Confirmación
          <Stack align="center" m="md">
            <Text size="lg" ta="center">
              Vas a agendar para el día{" "}
              <strong>
                {dayjs(bookingData.date).format("DD [de] MMMM [a las] h:mm A")}
              </strong>.
            </Text>
            <Button
              variant="subtle"
              color="blue"
              onClick={() => setShowConfirmation(false)}
            >
              Cambiar la hora
            </Button>
          </Stack>
        ) : selectedDate && availableTimes.length > 0 ? (
          // Horarios Disponibles
          <Grid gutter="md">
            {availableTimes.map((time) => (
              <Grid.Col key={time} span={{ base: 6, sm: 4, md: 3 }}>
                <Badge
                  fullWidth
                  variant={
                    bookingData.date &&
                    dayjs(bookingData.date).format("h:mm A") === time
                      ? "filled"
                      : "outline"
                  }
                  onClick={() => handleTimeSelection(time)}
                  size="lg"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  {time}
                </Badge>
              </Grid.Col>
            ))}
          </Grid>
        ) : selectedDate && availableTimes.length === 0 ? (
          // Mensaje de No Disponibilidad
          <Notification
            icon={<BsExclamationCircle />}
            color="red"
            title="No hay horarios disponibles"
            radius="md"
          >
            Selecciona otro día o verifica la disponibilidad.
          </Notification>
        ) : (
          // Mensaje Inicial
          <Text ta="center" size="md" c="dimmed">
            Selecciona una fecha para ver los horarios disponibles.
          </Text>
        )}
      </Stack>
    </Card>
  );
};

export default StepDateTime;
