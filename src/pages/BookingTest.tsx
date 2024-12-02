import { useState } from "react";
import { Container, Button } from "@mantine/core";
import dayjs from "dayjs";

const BookingTest = () => {
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const logToDebugDiv = (message: string | object) => {
    const formattedMessage =
      typeof message === "object" ? JSON.stringify(message, null, 2) : message;

    const logEntry = `[${new Date().toLocaleTimeString()}] ${formattedMessage}`;
    setDebugLogs((prevLogs) => [...prevLogs, logEntry]);

    // Opcionalmente, imprimir también en la consola para duplicar el log
    console.log(logEntry);
  };

  const handleBooking = async () => {
    logToDebugDiv("Inicio de reserva: Validando información ingresada.");

    const organizationId = "6730cbcdee1f12ea45bfc6bb"; // Simulación del ID de organización
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

    const { serviceId, employeeId, date, time, customerName, customerEmail, customerPhone } = bookingData;

    logToDebugDiv("Validando datos de entrada...");
    if (!serviceId || !date || !time || !customerName || !customerPhone || !organizationId) {
      logToDebugDiv("Error: Datos de entrada faltantes.");
      return;
    }

    const startDateTime = dayjs(`${dayjs(date).format("YYYY-MM-DD")} ${time}`, "YYYY-MM-DD h:mm A").toISOString();
    logToDebugDiv(`Fecha y hora formateadas: ${startDateTime}`);

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

    // Intentar deshabilitar temporalmente el Service Worker
    try {
      logToDebugDiv("Desactivando Service Worker (si está activo)...");
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach((registration) => registration.unregister());
      logToDebugDiv("Service Worker desactivado.");
    } catch (swError) {
      logToDebugDiv(`Error al desactivar el Service Worker: ${swError}`);
    }

    // Intentar enviar la solicitud
    try {
      logToDebugDiv("Enviando solicitud al servidor...");

      // Usar fetch para aislar problemas con axios
      const response = await fetch("https://api.galaxiaglamour.com/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify(reservationPayload),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      logToDebugDiv("Reserva creada con éxito:");
      logToDebugDiv(JSON.stringify(data, null, 2));
    } catch (error) {
      logToDebugDiv(`Error al enviar la reserva: ${error}`);
    }
  };

  return (
    <Container fluid>
      <div
        id="debug-logs"
        style={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "10px",
          background: "#f8f9fa",
          fontFamily: "monospace",
          fontSize: "12px",
        }}
      >
        {debugLogs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
      <Button onClick={handleBooking}>Enviar reserva</Button>
    </Container>
  );
};

export default BookingTest;
