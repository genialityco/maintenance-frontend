import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Divider,
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

  const [currentStep, setCurrentStep] = useState(1); // Controla el paso actual
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

  const handleBooking = async () => {
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

    try {
      setLoading(true);
      await createReservation(reservationPayload);
      setLoading(false);
      setIsBookingConfirmed(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError("Error al enviar la reserva. Intenta nuevamente.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepServiceEmployee
            services={services}
            employees={employees}
            filteredEmployees={filteredEmployees}
            setFilteredEmployees={setFilteredEmployees}
            bookingData={bookingData}
            setBookingData={setBookingData}
          />
        );
      case 2:
        return (
          <StepDateTime
            bookingData={bookingData}
            setBookingData={setBookingData}
            availableTimes={availableTimes}
            setAvailableTimes={setAvailableTimes}
            setAppointments={setAppointments}
            services={services}
            employees={employees}
          />
        );
      case 3:
        return (
          <StepCustomerData
            bookingData={bookingData}
            setBookingData={setBookingData}
          />
        );
      case 4:
        return isBookingConfirmed ? (
          <Notification
            icon={<BsExclamationCircleFill />}
            mt="md"
            color="green"
            title="Reserva confirmada"
            radius="md"
          >
            Tu reserva ha sido realizada con éxito.
          </Notification>
        ) : (
          <Notification
            icon={<BsExclamationCircleFill />}
            mt="md"
            color="red"
            title="Error"
            radius="md"
          >
            {error || "Algo salió mal. Intenta nuevamente."}
          </Notification>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid>
      <Paper shadow="md" p="lg" radius="lg" withBorder>
        <Title ta="center">Reserva en Línea</Title>
        <Divider my="xs" />
        {renderStep()}
        <Group justify="space-around" mt="xl">
          {currentStep > 1 && currentStep < 4 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Atrás
            </Button>
          )}
          {currentStep < 3 && (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={currentStep === 3 && !isBookingConfirmed}
            >
              Siguiente
            </Button>
          )}
          {currentStep === 3 && (
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
      </Paper>
    </Container>
  );
};

export default Booking;
