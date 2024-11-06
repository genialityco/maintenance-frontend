import React, { useEffect, useState } from "react";
import { Box, Button, Group, Title } from "@mantine/core";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomCalendar from "../../../components/customCalendar/CustomCalendar";
import {
  Appointment,
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "../../../services/appointmentService";
import AppointmentModal from "./components/AppointmentModal";
import { Employee, getEmployees } from "../../../services/employeeService";
import { getUsers, User } from "../../../services/userService";
import { Service } from "../../../services/serviceService";
import { showNotification } from "@mantine/notifications";
import { openConfirmModal } from "@mantine/modals";

interface CreateAppointmentPayload {
  service: Service;
  user: User;
  employee: Employee;
  startDate: Date;
  endDate: Date;
  status: string;
}

const ScheduleView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState<
    Partial<CreateAppointmentPayload>
  >({});
  const [modalOpenedAppointment, setModalOpenedAppointment] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (newAppointment.employee) {
      const selectedEmployee = employees.find(
        (employee) => employee._id === newAppointment.employee?._id
      );
      if (selectedEmployee) {
        setFilteredServices(selectedEmployee.services as unknown as Service[]);
      }
    } else {
      setFilteredServices([]);
    }
  }, [newAppointment.employee, employees, setFilteredServices]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments();
      setAppointments(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleServiceChange = (serviceId: string | null) => {
    const selectedService = filteredServices.find(
      (service) => service._id === serviceId
    );
    setNewAppointment({ ...newAppointment, service: selectedService });
  };

  const handleEmployeeChange = (value: string | null) => {
    const selectedEmployee = employees.find((emp) => emp._id === value);
    if (selectedEmployee) {
      setNewAppointment({ ...newAppointment, employee: selectedEmployee });
      setFilteredServices(selectedEmployee.services as unknown as Service[]);
    } else {
      setNewAppointment({ ...newAppointment, employee: undefined });
      setFilteredServices([]);
    }
  };

  const handleUserChange = (userId: string | null) => {
    const selectedUser = users.find((user) => user._id === userId);
    setNewAppointment({ ...newAppointment, user: selectedUser });
  };

  const openModal = () => {
    // Verifica que la data esté disponible antes de abrir el modal
    if (users.length > 0 && employees.length > 0) {
      if (!newAppointment.startDate) {
        setNewAppointment({ ...newAppointment, startDate: new Date() });
      }
      setModalOpenedAppointment(true);
    } else {
      showNotification({
        title: "Error",
        message: "Los datos aún no se han cargado",
        color: "red",
        autoClose: 3000,
        position: "top-right",
      });
    }
  };

  const closeModal = () => {
    setNewAppointment({});
    setModalOpenedAppointment(false);
    setSelectedAppointment(null);
    setFilteredServices([]);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewAppointment({
      service: appointment.service,
      user: appointment.user,
      employee: appointment.employee,
      startDate: new Date(appointment.startDate),
      endDate: new Date(appointment.endDate),
      status: appointment.status,
    });
    setModalOpenedAppointment(true);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    openConfirmModal({
      title: "Cancelar cita",
      children: (
        <p>
          Al cancelar se <strong>elimina</strong> el registro de la cita ¿Estás
          seguro de que deseas cancelar esta cita?
        </p>
      ),
      centered: true,
      labels: { confirm: "Cancelar y eliminar", cancel: "Volver" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await updateAppointment(appointmentId, {
            status: "cancelled",
          });
          if (response && response.status === "cancelled") {
            await deleteAppointment(appointmentId);
            showNotification({
              title: "Éxito",
              message: "La cita ha sido cancelada y eliminada.",
              color: "green",
              autoClose: 3000,
              position: "top-right",
            });
            fetchAppointments();
          }
        } catch (error) {
          showNotification({
            title: "Error",
            message: "No se pudo cancelar la cita.",
            color: "red",
            autoClose: 3000,
            position: "top-right",
          });
          console.error(error);
        }
      },
    });
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    openConfirmModal({
      title: "Confirmar cita",
      children: <p>¿Estás seguro de que deseas confirmar esta cita?</p>,
      centered: true,
      labels: { confirm: "Confirmar", cancel: "Cancelar" },
      confirmProps: { color: "green" },
      onConfirm: async () => {
        try {
          await updateAppointment(appointmentId, { status: "confirmed" });
          showNotification({
            title: "Éxito",
            message: "La cita ha sido confirmada.",
            color: "green",
            autoClose: 3000,
            position: "top-right",
          });
          fetchAppointments();
        } catch (error) {
          showNotification({
            title: "Error",
            message: "No se pudo confirmar la cita.",
            color: "red",
            autoClose: 3000,
            position: "top-right",
          });
          console.error(error);
        }
      },
    });
  };

  const addOrUpdateAppointment = async () => {
    try {
      const { service, employee, user, startDate, endDate, status } =
        newAppointment;

      if (service && employee && user && startDate && endDate) {
        const appointmentPayload: CreateAppointmentPayload = {
          service,
          employee,
          user,
          startDate,
          endDate,
          status: status || "pending",
        };

        if (selectedAppointment) {
          try {
            const response = await updateAppointment(
              selectedAppointment._id,
              appointmentPayload
            );
            if (response) {
              showNotification({
                title: "Éxito",
                message: "Cita actualizada correctamente",
                color: "green",
                autoClose: 3000,
                position: "top-right",
              });
              closeModal();
            }
          } catch (error) {
            showNotification({
              title: "Error",
              message: (error as Error).message,
              color: "red",
              autoClose: 3000,
              position: "top-right",
            });
            console.error(error);
          }
        } else {
          try {
            const response = await createAppointment(appointmentPayload);
            if (response) {
              showNotification({
                title: "Éxito",
                message: "Cita creada correctamente",
                color: "green",
                autoClose: 3000,
                position: "top-right",
              });
              closeModal();
            }
          } catch (error) {
            showNotification({
              title: "Error",
              message: (error as Error).message,
              color: "red",
              autoClose: 3000,
              position: "top-right",
            });
            console.error(error);
          }
        }
        fetchAppointments();
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: (error as Error).message,
        color: "red",
        autoClose: 3000,
        position: "top-right",
      });
      console.error(error);
    }
  };

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Title order={2}>Gestionar Agenda</Title>
        <Button color="blue" onClick={openModal}>
          Añadir Cita
        </Button>
      </Group>
      <CustomCalendar
        appointments={appointments}
        onOpenModal={openModal}
        onEditAppointment={handleEditAppointment}
        onCancelAppointment={handleCancelAppointment}
        onConfirmAppointment={handleConfirmAppointment}
      />
      <AppointmentModal
        opened={modalOpenedAppointment}
        onClose={closeModal}
        appointment={selectedAppointment}
        newAppointment={newAppointment}
        setNewAppointment={setNewAppointment}
        services={filteredServices}
        employees={employees}
        users={users}
        onServiceChange={handleServiceChange}
        onEmployeeChange={handleEmployeeChange}
        onUserChange={handleUserChange}
        onSave={addOrUpdateAppointment}
      />
    </Box>
  );
};

export default ScheduleView;
