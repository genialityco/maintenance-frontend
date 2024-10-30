import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Table,
  Text,
  Divider,
  ScrollArea,
  Title,
  Button,
  Group,
  Loader,
  NumberInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  Appointment,
  getAppointmentsByEmployee,
} from "../../../../services/appointmentService";
import { Employee } from "../../../../services/employeeService";

// Interfaz para el modal de detalles del empleado
interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

// Interfaz para la nómina
interface PayrollSummary {
  totalAppointments: number;
  totalEarnings: number;
  finalEarnings: number; // Nómina ajustada con adelantos
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payroll, setPayroll] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [advanceFactor, setAdvanceFactor] = useState<number>(0);

  useEffect(() => {
    if (employee && isOpen) {
      fetchAppointments();
    }
  }, [employee, isOpen, startDate, endDate]);

  // Obtener las citas del empleado dentro del rango seleccionado
  const fetchAppointments = async () => {
    if (!employee || !startDate || !endDate) return;

    setLoading(true);
    try {
      const employeeAppointments = await getAppointmentsByEmployee(employee._id);

      // Filtrar citas por rango de fechas
      const filteredAppointments = employeeAppointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.startDate);
        return (
          appointmentDate >= startDate &&
          appointmentDate <= endDate
        );
      });

      setAppointments(filteredAppointments);
      calculatePayroll(filteredAppointments);
    } catch (error) {
      console.error("Error al cargar citas del empleado", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular la nómina del empleado con el factor de adelantos
  const calculatePayroll = (appointments: Appointment[]) => {
    const totalEarnings = appointments.reduce((total, appointment) => {
      return total + (appointment.service?.price || 0);
    }, 0);

    // Ajustar el cálculo de la nómina con adelantos
    const finalEarnings = totalEarnings - advanceFactor;

    const payrollSummary: PayrollSummary = {
      totalAppointments: appointments.length,
      totalEarnings,
      finalEarnings,
    };

    setPayroll(payrollSummary);
  };

  // Formatear la moneda para la nómina
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  // Estilo para resaltar citas según el estado
  const getRowStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return { backgroundColor: "#e0f7e9" };
      case "pending":
        return { backgroundColor: "#fff8e1" };
      default:
        return {};
    }
  };

  // Función para convertir texto inglés a español
  const translateStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Detalles del Empleado"
      size="xl"
      centered
    >
      <Box>
        <Title order={2}>{employee?.names}</Title>
        <Text c="dimmed">{employee?.position}</Text>
        <Divider my="sm" />

        {/* Selección de rango de fechas */}
        <Group justify="space-around" mt="md" mb="sm">
          <DatePickerInput
            label="Fecha de inicio del corte"
            placeholder="Seleccionar fecha"
            value={startDate}
            onChange={setStartDate}
          />
          <DatePickerInput
            label="Fecha de fin del corte"
            placeholder="Seleccionar fecha"
            value={endDate}
            onChange={setEndDate}
          />
          <NumberInput
            label="Adelantos"
            value={advanceFactor}
            onChange={(value) => setAdvanceFactor(Number(value) || 0)}
            min={0}
          />
        </Group>

        {/* Contenedor de citas */}
        <ScrollArea style={{ height: "300px" }} scrollbarSize={10}>
          {loading ? (
            <Loader size="md" mt="md" />
          ) : (
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Servicio</Table.Th>
                  <Table.Th>Precio</Table.Th>
                  <Table.Th>Estado</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <Table.Tr
                      key={appointment._id}
                      style={getRowStyle(appointment.status)}
                    >
                      <Table.Td>
                        {new Date(appointment.startDate).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>{appointment.user?.name}</Table.Td>
                      <Table.Td>{appointment.service?.name}</Table.Td>
                      <Table.Td>
                        {formatCurrency(appointment.service?.price || 0)}
                      </Table.Td>
                      <Table.Td>{translateStatus(appointment.status)}</Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text ta="center">No hay citas registradas</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          )}
        </ScrollArea>

        {/* Resumen de nómina */}
        <Divider my="sm" />
        <Title order={3}>Resumen de Nómina</Title>
        <Group mt="sm" justify="space-between">
          <Text>Total de Citas: {payroll?.totalAppointments || 0}</Text>
          <Text>Total Ganado: {formatCurrency(payroll?.totalEarnings || 0)}</Text>
          <Text>Total Ajustado: {formatCurrency(payroll?.finalEarnings || 0)}</Text>
        </Group>

        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cerrar
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};

export default EmployeeDetailsModal;
