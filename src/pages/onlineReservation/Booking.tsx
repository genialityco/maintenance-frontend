import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Divider,
  Stepper,
  Button,
  Group,
  Loader,
  Notification,
} from "@mantine/core";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { Appointment } from "../../services/appointmentService";
import { Employee } from "../../services/employeeService";
import { Service } from "../../services/serviceService";
import { fetchServicesAndEmployees } from "./bookingUtils";
import StepServiceEmployee from "./StepServiceEmployee";
import StepDateTime from "./StepDateTime";
import StepCustomerData from "./StepCustomerData";
import BookingCompleted from "./BookingCompleted";
import { createReservation } from "../../services/reservationService";
import dayjs from "dayjs";
import { BsExclamationCircleFill } from "react-icons/bs";

export interface BookingData {
  serviceId: string | null;
  employeeId: string | null;
  date: Date | null;
  time: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

const Booking = () => {
  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );

  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [, setAppointments] = useState<Appointment[]>([]);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: null,
    employeeId: null,
    date: null,
    time: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (organization?._id) {
      fetchServicesAndEmployees(organization?._id, setServices, setEmployees);
    }
  }, [organization]);

  const logToDebugDiv = (message: string | object) => {
    const debugDiv = document.getElementById("debug-logs");
    if (!debugDiv) return;

    // Formatear el mensaje si es un objeto
    const formattedMessage =
      typeof message === "object" ? JSON.stringify(message, null, 2) : message;

    // Crear una nueva línea de log
    const logLine = document.createElement("div");
    logLine.textContent = `[${new Date().toLocaleTimeString()}] ${formattedMessage}`;
    debugDiv.appendChild(logLine);

    // Mostrar el contenedor si está oculto
    debugDiv.style.display = "block";

    // Desplazarse al final
    debugDiv.scrollTop = debugDiv.scrollHeight;
  };

  const handleBooking = async () => {
    logToDebugDiv("Inicio de reserva: Validando información ingresada.");

    const {
      serviceId,
      employeeId,
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
    } = bookingData;

    if (
      !serviceId ||
      !date ||
      !time ||
      !customerName ||
      !customerPhone ||
      !organization?._id
    ) {
      const missingFields = [];
      if (!serviceId) missingFields.push("servicio");
      if (!date) missingFields.push("fecha");
      if (!time) missingFields.push("hora");
      if (!customerName) missingFields.push("nombre");
      if (!customerPhone) missingFields.push("teléfono");

      setError(
        `Por favor, completa los siguientes campos requeridos: ${missingFields.join(
          ", "
        )}.`
      );

      logToDebugDiv(
        `Error en validación: Faltan campos requeridos - ${missingFields.join(
          ", "
        )}.`
      );
      return;
    }

    const startDateTime = dayjs(
      `${dayjs(date).format("YYYY-MM-DD")} ${time}`,
      "YYYY-MM-DD h:mm A"
    ).toISOString();

    const reservationPayload = {
      serviceId,
      employeeId: employeeId || null,
      startDate: startDateTime,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phoneNumber: customerPhone,
      },
      organizationId: organization?._id,
    };

    logToDebugDiv("Payload preparado:");
    logToDebugDiv(reservationPayload);

    try {
      setLoading(true);
      logToDebugDiv("Enviando solicitud al servidor...");
      await createReservation(reservationPayload);
      setLoading(false);

      setIsBookingConfirmed(true);

      logToDebugDiv("Reserva creada con éxito.");
    } catch (error) {
      setLoading(false);
      logToDebugDiv(`Error al enviar la reserva: ${error}`);
    }
  };

  const validateCustomerData = () => {
    const { customerName, customerEmail, customerPhone } = bookingData;
    const isPhoneValid = customerPhone && customerPhone.trim().length >= 10;
    const isNameValid = customerName && customerName.trim() !== "";
    const isEmailValid =
      typeof customerEmail === "string" && /\S+@\S+\.\S+/.test(customerEmail);

    return isPhoneValid && isNameValid && isEmailValid;
  };

  return (
    <Container fluid>
      <Paper shadow="md" p="lg" radius="lg" withBorder>
        <Title ta="center">Reserva en Línea</Title>
        <Divider my="xs" />
        <Stepper active={activeStep} onStepClick={setActiveStep} size="sm">
          <Stepper.Step label="Servicio y empleado">
            <StepServiceEmployee
              services={services}
              employees={employees}
              filteredEmployees={filteredEmployees}
              setFilteredEmployees={setFilteredEmployees}
              bookingData={bookingData}
              setBookingData={setBookingData}
            />
          </Stepper.Step>
          <Stepper.Step label="Fecha y horario">
            <StepDateTime
              bookingData={bookingData}
              setBookingData={setBookingData}
              availableTimes={availableTimes}
              setAvailableTimes={setAvailableTimes}
              setAppointments={setAppointments}
              services={services}
              employees={employees}
            />
          </Stepper.Step>
          <Stepper.Step label="Datos del cliente">
            <StepCustomerData
              bookingData={bookingData}
              setBookingData={setBookingData}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <BookingCompleted isBookingConfirmed={isBookingConfirmed} />
          </Stepper.Completed>
        </Stepper>
        <Group justify="space-around" mt="xl">
          {activeStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Atrás
            </Button>
          )}
          {activeStep < 3 && (
            <Button
              onClick={() => setActiveStep((prev) => prev + 1)}
              disabled={
                activeStep === 2 && !validateCustomerData() ? true : false
              }
            >
              Siguiente
            </Button>
          )}
          {activeStep === 3 && (
            <Button
              color="green"
              onClick={handleBooking}
              disabled={loading}
              leftSection={loading && <Loader size="xs" />}
            >
              {loading ? "Procesando..." : "Enviar Reserva"}
            </Button>
          )}
        </Group>
        {error && (
          <Notification
            icon={<BsExclamationCircleFill />}
            mt="md"
            color="red"
            title="Error"
            radius="md"
          >
            {error}
          </Notification>
        )}
      </Paper>
    </Container>
  );
};

export default Booking;
