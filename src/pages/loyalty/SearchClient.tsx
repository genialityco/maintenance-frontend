import { useState } from "react";
import { TextInput, Button, Checkbox, Box, Text, Flex } from "@mantine/core";
import { getClientByPhoneNumber } from "../../services/clientService";
import { Client as ClientType } from "../../services/clientService";

interface SearchClientProps {
  onClientFound: (client: ClientType) => void;
}

const SearchClient: React.FC<SearchClientProps> = (props) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [rememberClient, setRememberClient] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
    setError("");
    try {
      const client = await getClientByPhoneNumber(phoneNumber);

      if (client) {
        console.log("Client found:", client);
        if (rememberClient) {
          localStorage.setItem("savedClient", JSON.stringify(client));
        }
        props.onClientFound(client);
      } else {
        setError("No se encontró un cliente con este número de teléfono.");
      }
    } catch (error) {
      console.error("Error searching client:", error);
      setError("Hubo un error al buscar el cliente.");
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
          <Text mt="md" color="red">
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
