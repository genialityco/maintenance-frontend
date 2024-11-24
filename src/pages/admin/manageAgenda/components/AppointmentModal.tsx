import React, { useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Grid,
  Select,
  Text,
  Group,
  Checkbox,
  ComboboxItem,
  OptionsFilter,
} from "@mantine/core";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import { addMinutes } from "date-fns";
import { Service } from "../../../../services/serviceService";
import { Employee } from "../../../../services/employeeService";
import { Client } from "../../../../services/clientService";
import { Appointment } from "../../../../services/appointmentService";

interface AppointmentModalProps {
  opened: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  newAppointment: Partial<Appointment>;
  setNewAppointment: React.Dispatch<React.SetStateAction<Partial<Appointment>>>;
  services: Service[];
  employees: Employee[];
  clients: Client[];
  onServiceChange: (value: string | null) => void;
  onEmployeeChange: (value: string | null) => void;
  onClientChange: (value: string | null) => void;
  onSave: () => void;
}

interface CustomComboboxItem extends ComboboxItem {
  searchValue: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  opened,
  onClose,
  appointment,
  newAppointment,
  setNewAppointment,
  services,
  employees,
  clients,
  onServiceChange,
  onEmployeeChange,
  onClientChange,
  onSave,
}) => {
  useEffect(() => {
    if (appointment) {
      // Convertir startDate y endDate a instancias de Date para edición
      setNewAppointment({
        ...appointment,
        startDate: new Date(appointment.startDate),
        endDate: new Date(appointment.endDate),
      });
    }
  }, [appointment, setNewAppointment]);

  // Recalcular la hora de fin al cambiar la hora de inicio o el servicio
  useEffect(() => {
    if (newAppointment.startDate && newAppointment.service) {
      const selectedService = services.find(
        (s) => s._id === newAppointment.service?._id
      );

      // Recalcular solo si hay un servicio con duración definida
      if (selectedService?.duration) {
        const endDate = addMinutes(
          newAppointment.startDate,
          selectedService.duration
        );

        setNewAppointment((prev) => ({
          ...prev,
          endDate: new Date(endDate),
        }));
      }
    }
  }, [
    newAppointment.startDate,
    newAppointment.service,
    services,
    setNewAppointment,
  ]);

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const splittedSearch = search.toLowerCase().trim().split(" ");
    return (options as CustomComboboxItem[]).filter((option) => {
      const words = option.searchValue.toLowerCase().trim().split(" ");
      return splittedSearch.every((searchWord) =>
        words.some((word: string | string[]) => word.includes(searchWord))
      );
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={appointment ? "Editar Cita" : "Añadir nueva cita"}
      zIndex={300}
      centered
      size="lg"
    >
      <Box>
        <Select
          label="Cliente"
          placeholder="Selecciona un cliente"
          searchable
          filter={optionsFilter}
          data={clients.map((client) => ({
            value: client._id,
            label: client.name,
            searchValue: `${client.name} ${client.phoneNumber}`,
          }))}
          value={newAppointment.client?._id || ""}
          onChange={(value) => onClientChange(value)}
          nothingFoundMessage="No se encontraron clientes"
        />

        <Select
          label="Empleado"
          placeholder="Selecciona un empleado"
          comboboxProps={{ zIndex: 300 }}
          data={employees.map((employee) => ({
            value: employee._id,
            label: employee.names,
          }))}
          value={newAppointment.employee?._id || ""}
          onChange={(value) => onEmployeeChange(value)}
          searchable
          required
          nothingFoundMessage="No se encontraron empleados"
        />

        <Checkbox
          size="xs"
          my="xs"
          mb="md"
          label="Empleado solicitado por el cliente"
          checked={!!newAppointment.employeeRequestedByClient}
          onChange={(event) =>
            setNewAppointment({
              ...newAppointment,
              employeeRequestedByClient: event.currentTarget.checked,
            })
          }
        />

        <Select
          label="Servicio"
          placeholder="Selecciona un servicio"
          comboboxProps={{ zIndex: 300 }}
          data={services.map((service) => ({
            value: service._id,
            label: service.name,
          }))}
          value={newAppointment.service?._id || ""}
          onChange={(value) => onServiceChange(value)}
          searchable
          required
          nothingFoundMessage="No se encontraron servicios"
        />

        {newAppointment.service && (
          <Box mt="sm">
            <Text size="sm" c="dimmed">
              <strong>Precio:</strong> $
              {newAppointment.service.price.toLocaleString()}
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Duración:</strong> {newAppointment.service.duration}{" "}
              minutos
            </Text>
          </Box>
        )}

        <Grid mt="md" gutter="sm">
          <Grid.Col span={6}>
            <DateSelector
              label="Fecha de inicio"
              value={newAppointment.startDate}
              onChange={(date) =>
                setNewAppointment({ ...newAppointment, startDate: date })
              }
            />
            <TimeSelector
              label="Hora de inicio"
              date={newAppointment.startDate}
              onChange={(date) => {
                setNewAppointment({ ...newAppointment, startDate: date });
              }}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <DateSelector
              label="Fecha de fin"
              value={newAppointment.endDate}
              onChange={(date) =>
                setNewAppointment({ ...newAppointment, endDate: date })
              }
            />
            <TimeSelector
              label="Hora de fin"
              date={newAppointment.endDate}
              onChange={(date) =>
                setNewAppointment({ ...newAppointment, endDate: date })
              }
            />
          </Grid.Col>
        </Grid>

        <Group mt="lg" justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {appointment ? "Actualizar Cita" : "Crear Cita"}
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};

export default AppointmentModal;
