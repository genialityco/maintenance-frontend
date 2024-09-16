import { useState } from "react";
import { TextInput, Button, Checkbox, Box, Text, Flex } from "@mantine/core";
import { getUserByPhoneNumber } from "../../services/userService.tsx";
import { User as UserType } from "../../services/userService.tsx";

interface SearchUserProps {
  onUserFound: (user: UserType) => void;
}

const SearchUser: React.FC<SearchUserProps> = (props) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [rememberUser, setRememberUser] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
    setError("");
    try {
      const user = (await getUserByPhoneNumber(phoneNumber)) as UserType;

      if (user) {
        console.log("User found:", user);
        if (rememberUser) {
          localStorage.setItem("savedUser", JSON.stringify(user));
        }
        props.onUserFound(user);
      } else {
        setError("No se encontró un usuario con este número de teléfono.");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setError("Hubo un error al buscar el usuario.");
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
          checked={rememberUser}
          onChange={(e) => setRememberUser(e.currentTarget.checked)}
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

export default SearchUser;
