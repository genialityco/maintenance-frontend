import { useState } from "react";
import { TextInput, Button, Checkbox, Box, Text, Flex } from "@mantine/core";
import { getClientByPhoneNumberAndOrganization } from "../../services/clientService";
import { Client as ClientType } from "../../services/clientService";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface SearchClientProps {
  onClientFound: (client: ClientType) => void;
}

const SearchClient: React.FC<SearchClientProps> = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [rememberClient, setRememberClient] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );

  const handleSearch = async () => {
    setError("");
    if (!organization) {
      setError("Organización no encontrada.");
      return;
    }
    try {
      const client = await getClientByPhoneNumberAndOrganization(
        phoneNumber,
        organization._id as string
      );
      if (client) {
        if (rememberClient) {
          localStorage.setItem("savedClient", JSON.stringify(client));
        }
      }
    } catch (error) {
      console.error("Error searching client:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Flex justify="center" align="center" style={{ height: "80vh" }}>
      <Box
        bg="#1A202C"
        p="xl"
        style={{
          borderRadius: "8px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
          color: "#E2E8F0",
          textAlign: "center",
        }}
      >
        <Text size="xl" fw={700}>
          Plan de fidelidad
        </Text>
        <TextInput
          mt="md"
          label="Número de Teléfono"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <Checkbox
          mt="md"
          label="Guardar mi información en este dispositivo"
          checked={rememberClient}
          onChange={(e) => setRememberClient(e.currentTarget.checked)}
        />
        {error && (
          <Text mt="md" c="red">
            {error}
          </Text>
        )}
        <Button mt="md" color="blue" onClick={handleSearch}>
          BUSCAR
        </Button>
      </Box>
    </Flex>
  );
};

export default SearchClient;
