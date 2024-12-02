import {
  Container,

  Button,

} from "@mantine/core";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

import { createReservation } from "../services/reservationService";
import dayjs from "dayjs";

export interface BookingData {
  serviceId: string | null;
  employeeId: string | null;
  date: Date | null;
  time: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

const BookingTest = () => {
  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );


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

    const bookingData ={
        serviceId: "6709203e3fde4132d82d5b1a",
        employeeId: "6731729ab254219efc60ee11",
        date: new Date(),
        time: "8:00 AM",
        customerName: "Nataly Martinez",
        customerEmail: "3132735116",
        customerPhone: "3132735116"
    }

    const {
      serviceId,
      employeeId,
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
    } = bookingData;


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
      organizationId: organization?._id as string, 
    };

    logToDebugDiv("Payload preparado:");
    logToDebugDiv(reservationPayload);

    try {
      logToDebugDiv("Enviando solicitud al servidor...");
      await createReservation(reservationPayload);
      logToDebugDiv("Respuesta del servidor:");

      logToDebugDiv("Reserva creada con éxito.");
    } catch (error) {
      logToDebugDiv(`Error al enviar la reserva: ${error}`);
    }
  };

  return (
    <Container fluid>
        <Button onClick={handleBooking} >
            EWnviar reserva
        </Button>
    </Container>
  );
};

export default BookingTest;
