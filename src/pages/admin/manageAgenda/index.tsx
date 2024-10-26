import React, { useEffect, useState } from "react";
import { Box, Button, Group, Title } from "@mantine/core";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomCalendar from "../../../components/customCalendar/CustomCalendar";
import {
  Appointment,
  createAppointment,
  getAppointments,
} from "../../../services/appointmentService";
import AppointmentModal from "./components/AppointmentModal";
import { Employee, getEmployees } from "../../../services/employeeService";
import { getUsers, User } from "../../../services/userService";
import { Service } from "../../../services/serviceService";

interface CreateAppointmentPayload {
  service: Service;
  user: User;
  employee: Employee;
  startDate: Date;
  endDate: Date;
}

const ScheduleView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState<Partial<CreateAppointmentPayload>>({});
  const [modalOpenedAppointment, setModalOpenedAppointment] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
    fetchAppointments();
  }, []);

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
    const selectedService = filteredServices.find((service) => service._id === serviceId);
    setNewAppointment({ ...newAppointment, service: selectedService });
  };

  const handleEmployeeChange = (employeeId: string | null) => {
    const selectedEmployee = employees.find((employee) => employee._id === employeeId);
    if (selectedEmployee) {
      setNewAppointment({ ...newAppointment, employee: selectedEmployee });
      // Filtrar servicios según los que ofrece el empleado seleccionado
      const availableServices = selectedEmployee.services || [];
      setFilteredServices(availableServices as unknown as Service[]);
    } else {
      setFilteredServices([]);
    }
  };

  const handleUserChange = (userId: string | null) => {
    const selectedUser = users.find((user) => user._id === userId);
    setNewAppointment({ ...newAppointment, user: selectedUser });
  };

  const openModal = () => {
    if (!newAppointment.startDate) {
      setNewAppointment({ ...newAppointment, startDate: new Date() });
    }
    setModalOpenedAppointment(true);
  };

  const closeModal = () => {
    setNewAppointment({});
    setModalOpenedAppointment(false);
    setFilteredServices([]);
  };

  const addAppointment = async () => {
    try {
      const { service, employee, user, startDate, endDate } = newAppointment;

      if (service && employee && user && startDate && endDate) {
        const appointmentPayload: CreateAppointmentPayload = {
          service,
          employee,
          user,
          startDate,
          endDate,
        };

        await createAppointment(appointmentPayload);
        closeModal();
        fetchAppointments();
      }
    } catch (error) {
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
      <CustomCalendar appointments={appointments} />
      <AppointmentModal
        opened={modalOpenedAppointment}
        onClose={closeModal}
        newAppointment={newAppointment}
        setNewAppointment={setNewAppointment}
        services={filteredServices} 
        employees={employees}
        users={users}
        onServiceChange={handleServiceChange}
        onEmployeeChange={handleEmployeeChange}
        onUserChange={handleUserChange}
        onSave={addAppointment}
      />
    </Box>
  );
};

export default ScheduleView;
