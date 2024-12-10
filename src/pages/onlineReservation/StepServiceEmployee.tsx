/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Stack,
  Select,
  Avatar,
  Group,
  Text,
  Box,
  Center,
  SelectProps,
} from "@mantine/core";
import { Service } from "../../services/serviceService";
import { Employee } from "../../services/employeeService";
import { Reservation } from "../../services/reservationService";
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

  const renderEmployeeOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      {/* Ignorar el error relacionado con `option.image` */}
      {/* @ts-expect-error */}
      <Avatar src={option.image || ""} radius="xl" />
      <Text>{option.label}</Text>
      {checked && (
        <Text c="green" style={{ marginInlineStart: "auto" }}>
          ✔
        </Text>
      )}
    </Group>
  );

  const selectedEmployee = filteredEmployees.find(
    (employee) => employee._id === bookingData.employeeId
  );

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
          { value: "none", label: "Sin preferencia", image: "" },
          ...filteredEmployees.map((employee) => ({
            value: employee._id,
            label: employee.names,
            image: employee.profileImage || "",
          })),
        ]}
        value={(bookingData.employeeId as string) || "none"}
        disabled={!bookingData.serviceId}
        onChange={(value) =>
          handleEmployeeSelection(value === "none" ? null : value!)
        }
        searchable
        renderOption={renderEmployeeOption}
      />
      {selectedEmployee && (
        <Box
          p="md"
          style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
        >
          <Center>
            <Avatar src={selectedEmployee.profileImage} size="xl" radius="xl" />
          </Center>
          <Text ta="center" fw={500} size="lg" mt="sm">
            {selectedEmployee.names}
          </Text>
          <Text ta="center" size="sm" color="dimmed">
            {selectedEmployee.position || "Sin posición especificada"}
          </Text>
        </Box>
      )}
    </Stack>
  );
};

export default StepServiceEmployee;
