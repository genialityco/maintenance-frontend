import React from "react";
import { Modal, Box, Text, ScrollArea } from "@mantine/core";
import { format, getHours } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "../../../services/appointmentService";
import AppointmentCard from "./AppointmentCard";
import {
  generateTimeIntervals,
  organizeAppointmentsInLayers,
  calculateAppointmentPosition,
} from "../utils/scheduleUtils";
import { useExpandAppointment } from "../hooks/useExpandAppointment";

interface DayModalProps {
  opened: boolean;
  selectedDay: Date | null;
  onClose: () => void;
  onOpenModal: () => void;
  getAppointmentsForDay: (day: Date) => Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
}

const DayModal: React.FC<DayModalProps> = ({
  opened,
  selectedDay,
  onClose,
  onOpenModal,
  getAppointmentsForDay,
  onEditAppointment,
  onCancelAppointment,
  onConfirmAppointment,
}) => {
  const { handleToggleExpand, isExpanded } = useExpandAppointment();

  if (!selectedDay) return null;

  const appointments = getAppointmentsForDay(selectedDay);

  const earliestAppointment = Math.min(
    ...appointments.map((app) => getHours(new Date(app.startDate)))
  );
  const latestAppointment = Math.max(
    ...appointments.map((app) => getHours(new Date(app.endDate)))
  );

  const startHour = Math.min(earliestAppointment, 5);
  const endHour = Math.max(22, latestAppointment);
  const timeIntervals = generateTimeIntervals(startHour, endHour, selectedDay);

  const layers = organizeAppointmentsInLayers(appointments);

  const HOUR_HEIGHT = 100;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
  const CARD_WIDTH = 180;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen
      title={`Agenda para el ${format(selectedDay, "EEEE, d MMMM", {
        locale: es,
      })}`}
      size="xl"
      styles={{ body: { padding: 0 } }}
    >
      <ScrollArea
        style={{
          width: "100%",
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
            width: `${CARD_WIDTH * (layers.length + 1)}px`,
          }}
        >
          {timeIntervals.map((interval, index) => (
            <Box
              key={index}
              style={{
                position: "absolute",
                top: `${index * HOUR_HEIGHT}px`,
                height: `${HOUR_HEIGHT}px`,
                width: "100%",
                borderTop: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => onOpenModal()}
            >
              <Text size="sm" style={{ minWidth: "60px", marginLeft: "10px" }}>
                {format(interval, "h a")}
              </Text>
            </Box>
          ))}

          <Box style={{ marginLeft: "70px", position: "relative" }}>
            {layers.map((layer, layerIndex) =>
              layer.map((appointment, index) => {
                const { top, height } = calculateAppointmentPosition(
                  appointment,
                  startHour,
                  selectedDay,
                  MINUTE_HEIGHT
                );

                return (
                  <Box
                    key={index}
                    style={{
                      position: "absolute",
                      top: `${top}px`,
                      left: `${layerIndex * (CARD_WIDTH + 10)}px`,
                      width: `${CARD_WIDTH}px`,
                      height: isExpanded(appointment) ? "auto" : `${height}px`,
                      zIndex: isExpanded(appointment) ? 1 : 0,
                      backgroundColor: "#e0f7fa",
                      border: "1px solid #00acc1",
                      borderRadius: "4px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => handleToggleExpand(appointment._id)}
                  >
                    <AppointmentCard
                      appointment={appointment}
                      onEditAppointment={onEditAppointment}
                      onCancelAppointment={onCancelAppointment}
                      onConfirmAppointment={onConfirmAppointment}
                    />
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </ScrollArea>
    </Modal>
  );
};

export default DayModal;
