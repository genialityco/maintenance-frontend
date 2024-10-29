import React, { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  Text,
  Button,
  Collapse,
  ScrollArea,
} from "@mantine/core";
import {
  startOfWeek,
  addDays,
  format,
  startOfDay,
  addHours,
  differenceInMinutes,
  isSameDay,
  getHours,
  setHours,
} from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "../../../services/appointmentService";
import AppointmentCard from "./AppointmentCard";

interface WeekViewProps {
  currentDate: Date;
  isMobile: boolean;
  getAppointmentsForDay: (day: Date) => Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  isMobile,
  getAppointmentsForDay,
  onEditAppointment,
  onCancelAppointment,
  onConfirmAppointment,
}) => {
  const startWeek = startOfWeek(currentDate, { locale: es });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));

  // Estado inicial para expandir el día actual
  const [expandedDay, setExpandedDay] = useState<string | null>(
    weekDays.find((day) => isSameDay(day, currentDate))?.toISOString() || null
  );

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Ajuste de la altura de una hora en la línea de tiempo
  const HOUR_HEIGHT = 100; // 100px por hora
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // 1.67px por minuto
  const CARD_WIDTH = 180; // Ancho de cada tarjeta de cita

  // Función para verificar si dos citas se superponen
  const isAppointmentOverlapping = (app1: Appointment, app2: Appointment) => {
    const start1 = new Date(app1.startDate);
    const end1 = new Date(app1.endDate);
    const start2 = new Date(app2.startDate);
    const end2 = new Date(app2.endDate);

    return (
      (start1 >= start2 && start1 < end2) || (start2 >= start1 && start2 < end1)
    );
  };

  return (
    <Grid gutter="xs">
      {weekDays.map((day) => {
        const dayKey = day.toISOString();
        const appointments = getAppointmentsForDay(day);

        // Encontrar la primera y última hora de las citas del día
        const earliestAppointment = Math.min(
          ...appointments.map((app) => getHours(new Date(app.startDate)))
        );
        const latestAppointment = Math.max(
          ...appointments.map((app) => getHours(new Date(app.endDate)))
        );

        // Ajustar el rango de horas dinámicamente para incluir citas tempranas
        const startHour = Math.min(earliestAppointment, 5); // Inicia desde la hora más temprana, al menos 5am
        const endHour = Math.max(22, latestAppointment); // Hasta las 10pm o más tarde si hay citas más tardías
        const timeIntervals = Array.from(
          { length: endHour - startHour + 1 },
          (_, i) => addHours(setHours(startOfDay(day), startHour), i)
        );

        // Agrupar citas por intervalos de tiempo y organizar su posición horizontal
        const appointmentPositions = appointments.map(
          (appointment, index, arr) => {
            const startTime = new Date(appointment.startDate);
            const endTime = new Date(appointment.endDate);

            if (!isSameDay(startTime, day)) return null;

            const startHourDiff = differenceInMinutes(
              startTime,
              startOfDay(day)
            );
            const duration = differenceInMinutes(endTime, startTime);

            // Verificar superposición con otras citas
            let column = 0;
            for (let i = 0; i < index; i++) {
              if (isAppointmentOverlapping(appointment, arr[i])) {
                column++;
              }
            }

            return {
              appointment,
              top: (startHourDiff - startHour * 60) * MINUTE_HEIGHT,
              height: duration * MINUTE_HEIGHT,
              column,
            };
          }
        );

        return (
          <Grid.Col span={12} key={dayKey}>
            <Paper shadow="sm" radius="md" p="xs" withBorder>
              <Button
                fullWidth
                variant="subtle"
                onClick={() => toggleDay(dayKey)}
                size={isMobile ? "xs" : "md"}
              >
                {format(day, "EEEE, d MMM", { locale: es })}
              </Button>
              <Collapse in={expandedDay === dayKey}>
                {/* Contenedor de desplazamiento para la vista semanal */}
                <ScrollArea
                  style={{
                    height: "600px",
                    overflowX: "auto",
                    overflowY: "auto",
                  }}
                  scrollbarSize={10}
                  offsetScrollbars
                >
                  <Box
                    style={{
                      position: "relative",
                      minHeight: `${(endHour - startHour + 1) * HOUR_HEIGHT}px`,
                      width: `${
                        CARD_WIDTH * (appointmentPositions.length + 1)
                      }px`,
                    }}
                  >
                    {/* Renderizar el eje de horas */}
                    <Box
                      style={{ position: "absolute", width: "100%", zIndex: 1 }}
                    >
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
                          <Text
                            size="sm"
                            style={{ minWidth: "60px", marginLeft: "10px" }}
                          >
                            {format(interval, "h a")}{" "}
                            {/* Formato de 12 horas */}
                          </Text>
                        </Box>
                      ))}
                    </Box>

                    {/* Contenedor de citas */}
                    <Box style={{ marginLeft: "70px", position: "relative" }}>
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
              </Collapse>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default WeekView;
