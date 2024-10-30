import { addHours, differenceInMinutes, startOfDay } from 'date-fns';
import { Appointment } from '../../../services/appointmentService';

// Generar intervalos de tiempo para un rango específico
export const generateTimeIntervals = (startHour: number, endHour: number, baseDate: Date) => {
  return Array.from({ length: endHour - startHour + 1 }, (_, i) => addHours(startOfDay(baseDate), startHour + i));
};

// Detectar y organizar citas en capas para manejar superposiciones
export const organizeAppointmentsInLayers = (appointments: Appointment[]) => {
  const layers: Appointment[][] = [];

  appointments.forEach((appointment) => {
    const startTime = new Date(appointment.startDate);
    const endTime = new Date(appointment.endDate);

    let placed = false;

    // Verificar cada capa existente para colocar la cita
    for (const layer of layers) {
      const hasOverlap = layer.some((existingAppointment) => {
        const existingStart = new Date(existingAppointment.startDate);
        const existingEnd = new Date(existingAppointment.endDate);
        return (
          (startTime >= existingStart && startTime < existingEnd) ||
          (existingStart >= startTime && existingStart < endTime)
        );
      });

      // Si no hay superposición en la capa actual, agregar la cita a esa capa
      if (!hasOverlap) {
        layer.push(appointment);
        placed = true;
        break;
      }
    }

    // Si hay superposición en todas las capas existentes, crear una nueva capa
    if (!placed) {
      layers.push([appointment]);
    }
  });

  return layers;
};

// Calcular la posición y altura de una cita
export const calculateAppointmentPosition = (
  appointment: Appointment,
  startHour: number,
  baseDate: Date,
  MINUTE_HEIGHT: number
) => {
  const startTime = new Date(appointment.startDate);
  const endTime = new Date(appointment.endDate);

  const startHourDiff = differenceInMinutes(startTime, startOfDay(baseDate));
  const duration = differenceInMinutes(endTime, startTime);

  return {
    top: (startHourDiff - startHour * 60) * MINUTE_HEIGHT,
    height: duration * MINUTE_HEIGHT,
  };
};
