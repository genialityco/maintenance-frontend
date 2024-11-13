import React, { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Button,
  Flex,
  MultiSelect,
  ActionIcon,
} from "@mantine/core";
import { Service } from "../../../../services/serviceService";
import { Employee } from "../../../../services/employeeService";
import { IoEyeOff } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

interface ModalCreateEditEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  services: Service[];
  onSave: (employee: Employee) => void;
}

const ModalCreateEditEmployee: React.FC<ModalCreateEditEmployeeProps> = ({
  isOpen,
  onClose,
  employee,
  services,
  onSave,
}) => {
  const [editingEmployee, setEditingEmployee] = useState<Employee>({
    _id: "",
    names: "",
    position: "",
    phoneNumber: "",
    services: [],
    organizationId: "",
    email: "",
    password: "",
    role: {
      name: "",
      permissions: [],
    },
    customPermissions: [],
    isActive: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (employee) {
      setEditingEmployee({
        _id: employee._id || "",
        names: employee.names || "",
        position: employee.position || "",
        phoneNumber: employee.phoneNumber || "",
        services: employee.services || [],
        email: employee.email || "",
        organizationId: employee.organizationId || "",
        password: employee.password || "",
        role: {
          name: employee.role?.name || "",
          permissions: employee.role?.permissions || [],
        },
        customPermissions: employee.customPermissions || [],
        isActive: employee.isActive ?? true,
      });
    } else {
      resetForm();
    }
  }, [employee]);

  const handleSave = () => {
    // Guardar el empleado con servicios como IDs
    onSave(editingEmployee);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setEditingEmployee({
      _id: "",
      names: "",
      position: "",
      phoneNumber: "",
      services: [],
      email: "",
      organizationId: "",
      password: "",
      role: {
        name: "",
        permissions: [],
      },
      customPermissions: [],
      isActive: true,
    });
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={employee ? "Editar Empleado" : "Agregar Empleado"}
      size="md"
      centered
    >
      <Stack gap="xs">
        <TextInput
          label="Nombre completo"
          value={editingEmployee.names}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              names: e.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Posición"
          value={editingEmployee.position}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              position: e.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Número de teléfono"
          value={editingEmployee.phoneNumber}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              phoneNumber: e.currentTarget.value,
            })
          }
        />

        <MultiSelect
          label="Servicios"
          placeholder="Selecciona los servicios"
          data={services.map((service) => ({
            value: service._id,
            label: service.name,
          }))}
          value={(editingEmployee.services || []).map((service) => service._id)}
          onChange={(selectedServiceIds) => {
            setEditingEmployee({
              ...editingEmployee,
              services: selectedServiceIds.map(
                (id) => services.find((service) => service._id === id)!
              ),
            });
          }}
          searchable
          clearable
        />

        <TextInput
          label="Correo electrónico"
          type="email"
          value={editingEmployee.email}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              email: e.currentTarget.value,
            })
          }
        />

        <TextInput
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={editingEmployee.password}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              password: e.currentTarget.value,
            })
          }
          rightSection={
            <ActionIcon
              variant="transparent"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <IoEyeOff size={16} /> : <FaEye size={16} />}
            </ActionIcon>
          }
        />

        <Flex justify="end">
          <Button onClick={handleSave}>
            {employee ? "Guardar Cambios" : "Agregar Empleado"}
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
};

export default ModalCreateEditEmployee;
