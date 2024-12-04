import { Stack, Select } from "@mantine/core";
import { Employee } from "../../services/employeeService";
import { Service } from "../../services/serviceService";

export interface BookingData {
  serviceId: string | null;
  employeeId: string | null;
  date: Date | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

import { filterEmployeesByService } from "./bookingUtils";

interface StepServiceEmployeeProps {
  services: Service[];
  employees: Employee[];
  filteredEmployees: Employee[];
  setFilteredEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

const StepServiceEmployee: React.FC<StepServiceEmployeeProps> = ({
  services,
  employees,
  filteredEmployees,
  setFilteredEmployees,
  bookingData,
  setBookingData,
}) => {
  const handleServiceSelection = (serviceId: string) => {
    setBookingData({ ...bookingData, serviceId, employeeId: null }); // Resetea el empleado seleccionado
    setFilteredEmployees(filterEmployeesByService(employees, serviceId));
  };

  const handleEmployeeSelection = (employeeId: string | null) => {
    setBookingData({ ...bookingData, employeeId });
  };

  return (
    <Stack>
      {/* Selector de Servicio */}
      <Select
        label="Selecciona un servicio"
        placeholder="Elige un servicio"
        data={services.map((service) => ({
          value: service._id,
          label: service.name,
        }))}
        value={bookingData.serviceId}
        onChange={(value) => handleServiceSelection(value!)}
      />

      {/* Selector de Empleado */}
      <Select
        label="Selecciona un empleado"
        placeholder="Elige un empleado o selecciona 'Sin preferencia'"
        data={[
          { value: "none", label: "Sin preferencia" },
          ...filteredEmployees.map((employee) => ({
            value: employee._id,
            label: employee.names,
          })),
        ]}
        value={bookingData.employeeId || "none"}
        disabled={!bookingData.serviceId}
        onChange={(value) =>
          handleEmployeeSelection(value === "none" ? null : value!)
        }
      />
    </Stack>
  );
};

export default StepServiceEmployee;
