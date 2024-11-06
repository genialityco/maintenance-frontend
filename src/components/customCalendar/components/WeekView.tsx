import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Text,
  Button,
  Collapse,
  ScrollArea,
} from "@mantine/core";
import { startOfWeek, addDays, format, getHours, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "../../../services/appointmentService";
import AppointmentCard from "./AppointmentCard";
import {
  generateTimeIntervals,
  organizeAppointmentsInLayers,
  calculateAppointmentPosition,
} from "../utils/scheduleUtils";
import { useExpandAppointment } from "../hooks/useExpandAppointment";

interface WeekViewProps {
  currentDate: Date;
  isMobile: boolean;
  onOpenModal: () => void;
  getAppointmentsForDay: (day: Date) => Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  isMobile,
  onOpenModal,
  getAppointmentsForDay,
  onEditAppointment,
  onCancelAppointment,
  onConfirmAppointment,
}) => {
  const { handleToggleExpand, isExpanded } = useExpandAppointment();
  const startWeek = startOfWeek(currentDate, { locale: es });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));

  const [expandedDay, setExpandedDay] = useState<string | null>(
    weekDays.find((day) => isSameDay(day, currentDate))?.toISOString() || null
  );

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expandedDay && scrollAreaRef.current) {
      // Desplazar automáticamente al día expandido
      scrollAreaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [expandedDay]);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const HOUR_HEIGHT = 100;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
  const CARD_WIDTH = 180;

  return (
    <Grid gutter="xs">
      {weekDays.map((day) => {
        const dayKey = day.toISOString();
        const appointments = getAppointmentsForDay(day);

        const earliestAppointment = Math.min(
          ...appointments.map((app) => getHours(new Date(app.startDate)))
        );
        const latestAppointment = Math.max(
          ...appointments.map((app) => getHours(new Date(app.endDate)))
        );

        const startHour = Math.min(earliestAppointment, 5);
        const endHour = Math.max(22, latestAppointment);
        const timeIntervals = generateTimeIntervals(startHour, endHour, day);

        const layers = organizeAppointmentsInLayers(appointments);

        return (
          <Grid.Col span={12} key={dayKey}>
            <Paper
              shadow="sm"
              radius="md"
              p="xs"
              withBorder
              ref={expandedDay === dayKey ? scrollAreaRef : null}
            >
              <Button
                fullWidth
                variant="subtle"
                onClick={() => toggleDay(dayKey)}
                size={isMobile ? "xs" : "md"}
              >
                {format(day, "EEEE, d MMM", { locale: es })}
              </Button>
              <Collapse in={expandedDay === dayKey}>
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
                            day,
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
                              onClick={() =>
                                handleToggleExpand(appointment._id)
                              }
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
              </Collapse>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default WeekView;
