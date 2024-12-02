import { Container, Button } from "@mantine/core";
import dayjs from "dayjs";

const BookingTest = () => {
  const logToDebugDiv = (message: string | object) => {
    const debugDiv = document.getElementById("debug-logs");
    if (!debugDiv) return;

    const formattedMessage =
      typeof message === "object" ? JSON.stringify(message, null, 2) : message;

    const logLine = document.createElement("div");
    logLine.textContent = `[${new Date().toLocaleTimeString()}] ${formattedMessage}`;
    debugDiv.appendChild(logLine);
    debugDiv.style.display = "block";
    debugDiv.scrollTop = debugDiv.scrollHeight;
  };

  const handleBooking = async () => {
    logToDebugDiv("Inicio de reserva: Validando información ingresada.");

    const organizationId = "6730cbcdee1f12ea45bfc6bb";
    logToDebugDiv(`Organization ID: ${organizationId}`);

    const bookingData = {
      serviceId: "6709203e3fde4132d82d5b1a",
      employeeId: "6731729ab254219efc60ee11",
      date: new Date(),
      time: "08:00 AM",
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

    // Asegurar el formato correcto para la hora y la fecha
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const formattedDateTime = dayjs(`${formattedDate} ${time}`, "YYYY-MM-DD h:mm A").toISOString();
      logToDebugDiv(`Fecha y hora formateadas: ${formattedDateTime}`);

      const reservationPayload = {
        serviceId,
        employeeId: employeeId || null,
        startDate: formattedDateTime,
        customerDetails: {
          name: customerName,
          email: customerEmail,
          phoneNumber: customerPhone,
        },
        organizationId,
      };

      logToDebugDiv("Payload preparado:");
      logToDebugDiv(JSON.stringify(reservationPayload, null, 2));

      logToDebugDiv("Enviando solicitud al servidor...");
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
      logToDebugDiv(`Error al procesar la fecha o enviar la reserva: ${error}`);
    }
  };

  return (
    <Container fluid>
      <div
        id="debug-logs"
        style={{ height: "200px", overflowY: "auto", border: "1px solid #ddd", marginBottom: "10px" }}
      ></div>
      <Button onClick={handleBooking}>Enviar reserva</Button>
    </Container>
  );
};

export default BookingTest;
