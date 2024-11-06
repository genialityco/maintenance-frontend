import React, { useRef, useEffect } from "react";
import { Grid, Paper, Box, Text, ScrollArea } from "@mantine/core";
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

interface DayViewProps {
  currentDate: Date;
  isMobile: boolean;
  onOpenModal: () => void;
  getAppointmentsForDay: (day: Date) => Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  isMobile,
  onOpenModal,
  getAppointmentsForDay,
  onEditAppointment,
  onCancelAppointment,
  onConfirmAppointment,
}) => {
  const { handleToggleExpand, isExpanded } = useExpandAppointment();

  const appointments = getAppointmentsForDay(currentDate);

  const earliestAppointment = Math.min(
    ...appointments.map((app) => getHours(new Date(app.startDate)))
  );
  const latestAppointment = Math.max(
    ...appointments.map((app) => getHours(new Date(app.endDate)))
  );

  const startHour = Math.min(earliestAppointment, 5);
  const endHour = Math.max(22, latestAppointment);
  const timeIntervals = generateTimeIntervals(startHour, endHour, currentDate);

  const layers = organizeAppointmentsInLayers(appointments);

  const HOUR_HEIGHT = 100;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
  const CARD_WIDTH = 180;

  // Ref para centrar la vista en la agenda del día
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // Desplazar automáticamente para centrar la vista
      scrollAreaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <Grid gutter="xs">
      <Grid.Col span={12}>
        <Paper shadow="sm" radius="md" p="xs" withBorder ref={scrollAreaRef}>
          <Text size={isMobile ? "xs" : "md"} ta="center" fw={500} c="blue">
            {format(currentDate, "EEEE, d MMMM yyyy", { locale: es })}
          </Text>

          <ScrollArea
            style={{ height: "600px", overflowX: "auto", overflowY: "auto" }}
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
                  <Text
                    size="sm"
                    style={{ minWidth: "60px", marginLeft: "10px" }}
                  >
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
                      currentDate,
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
                          height: isExpanded(appointment)
                            ? "auto"
                            : `${height}px`,
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
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default DayView;
