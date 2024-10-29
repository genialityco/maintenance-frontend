import React from "react";
import { Modal, Box, Text, ScrollArea } from "@mantine/core";
import { format, startOfDay, addHours, differenceInMinutes, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "../../../services/appointmentService";
import AppointmentCard from "./AppointmentCard";

interface DayModalProps {
  opened: boolean;
  selectedDay: Date | null;
  onClose: () => void;
  getAppointmentsForDay: (day: Date) => Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
}

const DayModal: React.FC<DayModalProps> = ({
  opened,
  selectedDay,
  onClose,
  getAppointmentsForDay,
  onEditAppointment,
  onCancelAppointment,
  onConfirmAppointment,
}) => {
  if (!selectedDay) return null;

  // Obtener las citas para el día seleccionado
  const appointmentsForSelectedDay = getAppointmentsForDay(selectedDay);

  // Generar intervalos de 6am a 10pm
  const startHour = 6; // 6am
  const endHour = 22; // 10pm
  const timeIntervals = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => addHours(startOfDay(selectedDay), startHour + i)
  );

  // Definir el alto de una hora en la línea de tiempo
  const HOUR_HEIGHT = 100; // 100px por hora
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // 1px por minuto
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

  // Agrupar citas por intervalos de tiempo y organizar su posición horizontal
  const appointmentPositions = appointmentsForSelectedDay.map((appointment, index, arr) => {
    const startTime = new Date(appointment.startDate);
    const endTime = new Date(appointment.endDate);

    if (!isSameDay(startTime, selectedDay)) return null;

    const startHourDiff = differenceInMinutes(startTime, startOfDay(selectedDay));
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
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen
      title={`Agenda para el ${format(selectedDay, "EEEE, d MMMM", { locale: es })}`}
      size="xl"
      styles={{ body: { padding: 0 } }}
    >
      <ScrollArea
        style={{ width: "100%", height: "600px", overflowX: "hidden" }}
        scrollbarSize={10}
        offsetScrollbars
      >
        <Box style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {/* Renderizar el eje de horas y líneas de guía */}
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
          <Box style={{ marginLeft: "70px", position: "relative", width: "100%" }}>
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
    </Modal>
  );
};

export default DayModal;
