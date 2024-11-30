import { useState } from "react";
import { Stack, TextInput, Loader } from "@mantine/core";
import { getClientByPhoneNumberAndOrganization } from "../../services/clientService";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export interface BookingData {
  serviceId: string | null;
  employeeId: string | null;
  date: Date | null;
  time: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface StepCustomerDataProps {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

const StepCustomerData: React.FC<StepCustomerDataProps> = ({
  bookingData,
  setBookingData,
}) => {
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handlePhoneBlur = async () => {
    if (
      !bookingData.customerPhone ||
      bookingData.customerPhone.trim().length < 10
    )
      return;

    setIsCheckingPhone(true);

    try {
      const client = await getClientByPhoneNumberAndOrganization(
        bookingData.customerPhone.trim(),
        organization?._id as string
      );

      if (client) {
        setBookingData({
          ...bookingData,
          customerName: client.name,
          customerEmail: client.email || "",
        });
      }
    } catch (error) {
      console.error("Error al verificar el cliente:", error);
    } finally {
      setIsCheckingPhone(false);
    }
  };

  return (
    <Stack>
      {/* Campo de Teléfono */}
      <TextInput
        label="Teléfono"
        placeholder="Ingresa tu número de teléfono"
        value={bookingData.customerPhone}
        onChange={(e) =>
          handleInputChange("customerPhone", e.currentTarget.value)
        }
        onBlur={handlePhoneBlur}
        rightSection={isCheckingPhone ? <Loader size="xs" /> : null}
      />

      {/* Campo de Nombre */}
      <TextInput
        label="Nombre completo"
        placeholder="Ingresa tu nombre"
        value={bookingData.customerName}
        onChange={(e) =>
          handleInputChange("customerName", e.currentTarget.value)
        }
        disabled={isCheckingPhone}
      />

      {/* Campo de Correo Electrónico */}
      <TextInput
        label="Correo electrónico"
        placeholder="Ingresa tu correo"
        type="email"
        value={bookingData.customerEmail}
        onChange={(e) =>
          handleInputChange("customerEmail", e.currentTarget.value)
        }
        disabled={isCheckingPhone}
      />
    </Stack>
  );
};

export default StepCustomerData;
