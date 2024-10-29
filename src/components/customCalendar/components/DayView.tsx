import React from "react";
import { Grid, Paper, Box, Text, ScrollArea } from "@mantine/core";
import { format, startOfDay, addHours, differenceInMinutes, getHours } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "../../../services/appointmentService";
import AppointmentCard from "./AppointmentCard";

interface DayViewProps {
  currentDate: Date;
  isMobile: boolean;
  getAppointmentsForDay: (day: Date) => Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  isMobile,
  getAppointmentsForDay,
  onEditAppointment,
  onCancelAppointment,
  onConfirmAppointment,
}) => {
  const appointments = getAppointmentsForDay(currentDate);

  // Encontrar la primera y última hora de las citas del día
  const earliestAppointment = Math.min(...appointments.map((app) => getHours(new Date(app.startDate))));
  const latestAppointment = Math.max(...appointments.map((app) => getHours(new Date(app.endDate))));

  // Ajustar el rango de horas dinámicamente para incluir citas tempranas
  const startHour = Math.min(earliestAppointment, 5); // Inicia desde la hora más temprana, al menos 5am
  const endHour = Math.max(22, latestAppointment); // Hasta las 10pm o más tarde si hay citas más tardías
  const timeIntervals = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => addHours(startOfDay(currentDate), startHour + i)
  );

  // Ajuste de la altura de una hora en la línea de tiempo
  const HOUR_HEIGHT = 100; // 100px por hora
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // 1.67px por minuto
  const CARD_WIDTH = 180; // Ancho de cada tarjeta de cita

  // Agrupar citas por intervalos de tiempo y organizar su posición horizontal
  const appointmentPositions = appointments.map((appointment, index, arr) => {
    const startTime = new Date(appointment.startDate);
    const endTime = new Date(appointment.endDate);

    const startHourDiff = differenceInMinutes(startTime, startOfDay(currentDate));
    const duration = differenceInMinutes(endTime, startTime);

    // Verificar superposición con otras citas
    let column = 0;
    for (let i = 0; i < index; i++) {
      if (
        (startTime >= new Date(arr[i].startDate) && startTime < new Date(arr[i].endDate)) ||
        (new Date(arr[i].startDate) >= startTime && new Date(arr[i].startDate) < endTime)
      ) {
        column++;
      }
    }

    return {
      appointment,
      top: (startHourDiff - startHour * 60) * MINUTE_HEIGHT,
      height: duration * MINUTE_HEIGHT,
      column,
    };
  });

  return (
    <Grid gutter="xs">
      <Grid.Col span={12}>
        <Paper shadow="sm" radius="md" p="xs" withBorder>
          <Text size={isMobile ? "xs" : "md"} ta="center" fw={500}>
            {format(currentDate, "EEEE, d MMMM yyyy", { locale: es })}
          </Text>

          {/* Contenedor de desplazamiento */}
          <ScrollArea
            style={{ height: "600px", overflowX: "auto", overflowY: "auto" }}
            scrollbarSize={10}
            offsetScrollbars
          >
            {/* Contenedor de la línea de tiempo */}
            <Box style={{ position: "relative", minHeight: `${(endHour - startHour + 1) * HOUR_HEIGHT}px` }}>
              {/* Renderizar el eje de horas */}
              <Box style={{ position: "absolute", width: "100%", zIndex: 1 }}>
                {timeIntervals.map((interval, index) => (
                  <Box
                    key={index}
                    style={{
                      position: "absolute",
                      top: `${index * HOUR_HEIGHT}px`,
                      height: `${HOUR_HEIGHT}px`,
                      width: "100%",
                      borderTop: "1px solid #ccc", // Línea de guía
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text size="sm" style={{ minWidth: "60px", marginLeft: "10px" }}>
                      {format(interval, "h a")} {/* Formato de 12 horas */}
                    </Text>
                  </Box>
                ))}
              </Box>

              {/* Contenedor de citas */}
              <Box
                style={{
                  marginLeft: "70px",
                  position: "relative",
                  width: `${CARD_WIDTH * (appointmentPositions.length + 1)}px`,
                }}
              >
                {appointmentPositions.map((position, index) => {
                  if (!position) return null;

                  const { appointment, top, height, column } = position;

                  return (
                    <Box
                      key={index}
                      style={{
                        position: "absolute",
                        top: `${top}px`,
                        left: `${column * (CARD_WIDTH + 10)}px`, // Separación entre columnas
                        width: `${CARD_WIDTH}px`,
                        height: `${height}px`,
                        backgroundColor: "#e0f7fa",
                        border: "1px solid #00acc1",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        onEditAppointment={onEditAppointment}
                        onCancelAppointment={onCancelAppointment}
                        onConfirmAppointment={onConfirmAppointment}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default DayView;
