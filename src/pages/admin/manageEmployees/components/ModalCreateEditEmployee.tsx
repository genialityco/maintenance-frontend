import React, { useState, useEffect } from "react";
import { Modal, Stack, TextInput, Button, Flex } from "@mantine/core";

interface Employee {
  _id: string;
  names: string;
  position: string;
  email: string;
  phoneNumber: string;
  username: string;
  password?: string;
}

interface ModalCreateEditEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSave: (employee: Employee) => void;
}

const ModalCreateEditEmployee: React.FC<ModalCreateEditEmployeeProps> = ({
  isOpen,
  onClose,
  employee,
  onSave,
}) => {
  const [editingEmployee, setEditingEmployee] = useState<Employee>({
    _id: "",
    names: "",
    position: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (employee) {
      setEditingEmployee(employee);
    } else {
      setEditingEmployee({
        _id: "",
        names: "",
        position: "",
        email: "",
        phoneNumber: "",
        username: "",
        password: "",
      });
    }
  }, [employee]);

  const handleSave = () => {
    onSave(editingEmployee);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Función para restablecer los campos del formulario
  const resetForm = () => {
    setEditingEmployee({
      _id: "",
      names: "",
      position: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
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
          label="Número de teléfono"
          value={editingEmployee.phoneNumber}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              phoneNumber: e.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Nombre de usuario"
          value={editingEmployee.username}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              username: e.currentTarget.value,
            })
          }
        />
        {!employee && (
          <TextInput
            label="Contraseña"
            type="password"
            value={editingEmployee.password}
            onChange={(e) =>
              setEditingEmployee({
                ...editingEmployee,
                password: e.currentTarget.value,
              })
            }
          />
        )}
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
