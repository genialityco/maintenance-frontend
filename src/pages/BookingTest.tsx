import { Container, Button } from "@mantine/core";
import dayjs from "dayjs";

const BookingTest = () => {

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
      const response = await fetch("https://api.tuservidor.com/reservations", {
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
      <Button onClick={handleBooking}>Enviar reserva</Button>
    </Container>
  );
};

export default BookingTest;
