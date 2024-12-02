import {
    Container,
    Button,
  } from "@mantine/core";
  import { RootState } from "../app/store";
  import { useSelector } from "react-redux";
  import { createReservation } from "../services/reservationService";
  import dayjs from "dayjs";
  
  export const BookingTest = () => {
    const organization = useSelector(
      (state: RootState) => state.organization.organization
    );
  
    const logToDebugDiv = (message: string) => {
      const debugDiv = document.getElementById("debug-logs");
      if (!debugDiv) return;
  
      const logLine = document.createElement("div");
      logLine.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      debugDiv.appendChild(logLine);
      debugDiv.scrollTop = debugDiv.scrollHeight;
    };
  
    const handleBooking = async () => {
      logToDebugDiv("Inicio de reserva: Validando información ingresada.");
  
      const organizationId = organization?._id || "id-prueba"; // Valor predeterminado
      logToDebugDiv(`Organization ID: ${organizationId}`);
  
      const bookingData = {
        serviceId: "6709203e3fde4132d82d5b1a",
        employeeId: "6731729ab254219efc60ee11",
        date: new Date(),
        time: "8:00 AM",
        customerName: "Nataly Martinez",
        customerEmail: "nataly@mail.com",
        customerPhone: "3132735116",
      };
  
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
        organizationId,
      };
  
      logToDebugDiv("Payload preparado:");
      logToDebugDiv(JSON.stringify(reservationPayload, null, 2));
  
      try {
        logToDebugDiv("Enviando solicitud al servidor...");
        await createReservation(reservationPayload);
        logToDebugDiv("Reserva creada con éxito.");
      } catch (error) {
        logToDebugDiv(`Error al enviar la reserva: ${error}`);
      }
    };
  
    return (
      <Container fluid>
        <div id="debug-logs" style={{ height: "200px", overflowY: "auto", border: "1px solid #ddd", marginBottom: "10px" }}></div>
        <Button onClick={handleBooking}>
          Enviar reserva
        </Button>
      </Container>
    );
  };
  