import { Stack, Select } from "@mantine/core";
import { Service } from "../../services/serviceService";
import { Employee } from "../../services/employeeService";
import { Reservation} from "../../services/reservationService";
import { filterEmployeesByService } from "./bookingUtils";

interface StepServiceEmployeeProps {
  services: Service[];
  employees: Employee[];
  filteredEmployees: Employee[];
  setFilteredEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  bookingData: Partial<Reservation>;
  setBookingData: React.Dispatch<React.SetStateAction<Partial<Reservation>>>;
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
    setBookingData({
      ...bookingData,
      serviceId,
      employeeId: null,
    });
    setFilteredEmployees(filterEmployeesByService(employees, serviceId));
  };

  const handleEmployeeSelection = (employeeId: string | null) => {
    setBookingData({ ...bookingData, employeeId });
  };

  return (
    <Stack>
      <Select
        label="Selecciona un servicio"
        placeholder="Elige un servicio"
        data={services.map((service) => ({
          value: service._id,
          label: service.name,
        }))}
        value={bookingData.serviceId as string}
        onChange={(value) => handleServiceSelection(value!)}
      />
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
        value={bookingData.employeeId as string || "none"}
        disabled={!bookingData.serviceId}
        onChange={(value) =>
          handleEmployeeSelection(value === "none" ? null : value!)
        }
      />
    </Stack>
  );
};

export default StepServiceEmployee;
