import React, { useEffect, useState } from "react";
import {
  Card,
  Box,
  Table,
  Text,
  ScrollArea,
  Title,
  Loader,
  Flex,
  Stack,
  Badge,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Appointment, getAppointmentsByEmployee } from "../../services/appointmentService";
import { Advance, getAdvancesByEmployee } from "../../services/advanceService";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface PayrollSummary {
  totalAppointments: number;
  totalEarnings: number;
  totalAdvances: number;
  finalEarnings: number;
}

const EmployeeInfo: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [payroll, setPayroll] = useState<PayrollSummary | null>(null);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingAdvances, setLoadingAdvances] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      fetchAppointments();
      fetchAdvances();
    }
  }, [userId, startDate, endDate]);

  const fetchAppointments = async () => {
    if (!startDate || !endDate) return;

    setLoadingAppointments(true);
    try {
      const employeeAppointments = await getAppointmentsByEmployee(userId!);
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
      setLoadingAppointments(false);
    }
  };

  const fetchAdvances = async () => {
    if (!startDate || !endDate) return;

    setLoadingAdvances(true);
    try {
      const employeeAdvances = await getAdvancesByEmployee(userId!);
      const filteredAdvances = employeeAdvances.filter((advance) => {
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
    const totalEarnings = appointments.reduce(
      (total, appointment) => total + (appointment.service?.price || 0),
      0
    );
    const totalAdvances = advances.reduce(
      (total, advance) => total + advance.amount,
      0
    );
    setPayroll({
      totalAppointments: appointments.length,
      totalEarnings,
      totalAdvances,
      finalEarnings: totalEarnings - totalAdvances,
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmado", color: "#28a745" };
      case "pending":
        return { label: "Pendiente", color: "#ffc107" };
      case "cancelled":
        return { label: "Cancelado", color: "#dc3545" };
      default:
        return { label: "Sin estado", color: "#007bff" };
    }
  };

  return (
    <Box px="xs" mt="lg">
      <Title order={2} ta="center" mb="md">Detalles del Empleado</Title>
      
      <Card shadow="lg" radius="md" p="xl" withBorder>
        <Flex justify="space-between" align="center">
          <Stack m={0}>
            <DatePickerInput
              label="Fecha de inicio"
              placeholder="Seleccionar fecha"
              value={startDate}
              onChange={setStartDate}
            />
            <DatePickerInput
              label="Fecha de fin"
              placeholder="Seleccionar fecha"
              value={endDate}
              onChange={setEndDate}
            />
          </Stack>
          <Box style={{ textAlign: "right" }}>
            <Title order={4}>Resumen de Nómina</Title>
            <Text>Total Ganado: {formatCurrency(payroll?.totalEarnings || 0)}</Text>
            <Text>Total Restado (Avances): {formatCurrency(payroll?.totalAdvances || 0)}</Text>
            <Text c="blue" fw={500}>Total a Recibir: {formatCurrency(payroll?.finalEarnings || 0)}</Text>
          </Box>
        </Flex>
      </Card>

      {/* Citas agendadas */}
      <Card shadow="lg" radius="md" p="xl" withBorder mt="xl">
        <Title order={3} c="dark">Citas Agendadas</Title>
        <ScrollArea style={{ height: "200px" }} scrollbarSize={10}>
          {loadingAppointments ? (
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
                    <Table.Tr key={appointment._id}>
                      <Table.Td>{new Date(appointment.startDate).toLocaleDateString()}</Table.Td>
                      <Table.Td>{appointment.client?.name}</Table.Td>
                      <Table.Td>{appointment.service?.name}</Table.Td>
                      <Table.Td>{formatCurrency(appointment.service?.price || 0)}</Table.Td>
                      <Table.Td>
                        <Badge color={getStatusStyles(appointment.status).color}>
                          {getStatusStyles(appointment.status).label}
                        </Badge>
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
      </Card>

      {/* Avances / Descuentos */}
      <Card shadow="lg" radius="md" p="xl" mb="md" withBorder mt="xl">
        <Title order={3} c="dark">Avances / Descuentos</Title>
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
                      <Table.Td>{new Date(advance.date).toLocaleDateString()}</Table.Td>
                      <Table.Td>{formatCurrency(advance.amount)}</Table.Td>
                      <Table.Td>{advance.description || "Sin descripción"}</Table.Td>
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
      </Card>
    </Box>
  );
};

export default EmployeeInfo;
