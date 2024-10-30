import { useState } from "react";
import { Appointment } from "../../../services/appointmentService";

export const useExpandAppointment = () => {
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  const handleToggleExpand = (appointmentId: string) => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
  };

  const isExpanded = (appointment: Appointment) => expandedAppointment === appointment._id;

  return {
    expandedAppointment,
    handleToggleExpand,
    isExpanded,
  };
};
