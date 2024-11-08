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
  Flex,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  Appointment,
  getAppointmentsByEmployee,
} from "../../../../services/appointmentService";
import { Employee } from "../../../../services/employeeService";
import {
  Advance,
  getAdvancesByEmployee,
} from "../../../../services/advanceService";

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

interface PayrollSummary {
  totalAppointments: number;
  totalEarnings: number;
  totalAdvances: number;
  finalEarnings: number;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [payroll, setPayroll] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAdvances, setLoadingAdvances] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (employee && isOpen) {
      fetchAppointments();
      fetchAdvances();
    }
  }, [employee, isOpen, startDate, endDate]);

  const fetchAppointments = async () => {
    if (!employee || !startDate || !endDate) return;

    setLoading(true);
    try {
      const employeeAppointments = await getAppointmentsByEmployee(
        employee._id
      );
      const filteredAppointments = employeeAppointments.filter(
        (appointment) => {
          const appointmentDate = new Date(appointment.startDate);
          return appointmentDate >= startDate && appointmentDate <= endDate;
        }
      );

      setAppointments(filteredAppointments);
      calculatePayroll(filteredAppointments, advances);
    } catch (error) {
      console.error("Error al cargar citas del empleado", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvances = async () => {
    if (!employee || !startDate || !endDate) return;

    setLoadingAdvances(true);
    try {
      const employeeId = employee?._id;
      const response = await getAdvancesByEmployee(employeeId);
      const filteredAdvances = response.filter((advance: Advance) => {
        const advanceDate = new Date(advance.date);
        return advanceDate >= startDate && advanceDate <= endDate;
      });

      setAdvances(filteredAdvances);
      calculatePayroll(appointments, filteredAdvances);
    } catch (error) {
      console.error("Error al cargar avances del empleado", error);
    } finally {
      setLoadingAdvances(false);
    }
  };

  const calculatePayroll = (
    appointments: Appointment[],
    advances: Advance[]
  ) => {
    const totalEarnings = appointments.reduce((total, appointment) => {
      return total + (appointment.service?.price || 0);
    }, 0);

    const totalAdvances = advances.reduce((total, advance) => {
      return total + advance.amount;
    }, 0);

    const finalEarnings = totalEarnings - totalAdvances;

    const payrollSummary: PayrollSummary = {
      totalAppointments: appointments.length,
      totalEarnings,
      totalAdvances,
      finalEarnings,
    };

    setPayroll(payrollSummary);
  };

  const handleOnClose = () => {
    setAppointments([]);
    setAdvances([]);
    setPayroll(null);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmado",
          styles: { backgroundColor: "#d4edda", borderColor: "#28a745" },
        };
      case "pending":
        return {
          label: "Pendiente",
          styles: { backgroundColor: "#fff3cd", borderColor: "#ffc107" },
        };
      case "cancelled":
        return {
          label: "Cancelado",
          styles: { backgroundColor: "#f8d7da", borderColor: "#dc3545" },
        };
      default:
        return {
          label: "Sin estado",
          styles: { backgroundColor: "#f0f4f8", borderColor: "#007bff" },
        };
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleOnClose}
      title="Detalles del Empleado"
      size="xl"
      centered
    >
      <Box>
        <Title order={2}>{employee?.names}</Title>
        <Text c="dimmed">{employee?.position}</Text>
        <Divider my="sm" />

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
        </Group>

        {/* Contenedor de citas */}
        <Divider my="sm" />
        <Title order={3}>Citas agendadas</Title>
        <ScrollArea style={{ height: "200px" }} scrollbarSize={10}>
          {loading ? (
            <Flex justify="center" align="center" direction="column">
              <Loader size={40} />
              <Text mt="xl">Cargando citas...</Text>
            </Flex>
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
                      style={getStatusStyles(appointment.status).styles}
                    >
                      <Table.Td>
                        {new Date(appointment.startDate).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>{appointment.client?.name}</Table.Td>
                      <Table.Td>{appointment.service?.name}</Table.Td>
                      <Table.Td>
                        {formatCurrency(appointment.service?.price || 0)}
                      </Table.Td>
                      <Table.Td>
                        {getStatusStyles(appointment.status).label}
                      </Table.Td>
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

        {/* Contenedor de avances */}
        <Divider my="sm" />
        <Title order={3}>Avances / Descuentos</Title>
        <ScrollArea style={{ height: "150px" }} scrollbarSize={10}>
          {loadingAdvances ? (
            <Flex justify="center" align="center" direction="column">
              <Loader size={40} />
              <Text mt="xl">Cargando avances y descuentos...</Text>
            </Flex>
          ) : (
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Monto</Table.Th>
                  <Table.Th>Descripción</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {advances.length > 0 ? (
                  advances.map((advance) => (
                    <Table.Tr key={advance._id}>
                      <Table.Td>
                        {new Date(advance.date).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>{formatCurrency(advance.amount)}</Table.Td>
                      <Table.Td>
                        {advance.description || "Sin descripción"}
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <Text ta="center">No hay avances registrados</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          )}
        </ScrollArea>

        {/* Resumen de nómina con detalle vertical */}
        <Divider my="sm" />
        <Title order={3}>Resumen de Nómina</Title>
        <Box mt="sm">
          <Text>
            Total Ganado: {formatCurrency(payroll?.totalEarnings || 0)}
          </Text>
          <Text>
            Total Restado (Avances):{" "}
            {formatCurrency(payroll?.totalAdvances || 0)}
          </Text>
          <Text>
            Total a Recibir: {formatCurrency(payroll?.finalEarnings || 0)}
          </Text>
        </Box>

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
