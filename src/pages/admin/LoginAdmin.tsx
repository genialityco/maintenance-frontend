import React, { useEffect, useState } from "react";
import { Box, Divider, TextInput, Button, Text, Card } from "@mantine/core";
import colors from "../../theme/colores";
import CreateUser from "./CreateUser";
import UserTable from "./UserTable";
import { useNavigate } from "react-router-dom";

const LoginAdmin: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authenticated")) {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (username === "natysipq" && password === "0714") {
      localStorage.setItem("authenticated", "true");
      setAuthenticated(true);
      navigation("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  if (!authenticated) {
    return (
      <Card
        style={{
          maxWidth: "80%",
          margin: "auto",
          padding: "2rem",
          backgroundColor: colors.cardBackground,
          color: colors.primaryText,
          borderRadius: "8px",
          boxShadow: colors.cardShadow,
        }}
      >
        <Text size="xl" mb="xl">
          ¡Bienvenido!
        </Text>
        <TextInput
          placeholder="Ingresa tu usuario *"
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          required
          mb="md"
        />
        <TextInput
          placeholder="Ingresa tu contraseña *"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
          mb="md"
        />
        {error && (
          <Text c={colors.errorText} mb="md">
            {error}
          </Text>
        )}
        <Button fullWidth onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </Card>
    );
  }

  return (
    <Box
      bg={colors.primaryBackground}
      p="lg"
      m="auto"
      style={{
        maxWidth: "1200px",
        width: "100%",
        padding: "1rem",
        "@media (maxWidth: 768px)": {
          padding: "0.5rem",
        },
      }}
    >
      <CreateUser />
      <Divider my="xl" />
      <UserTable />
    </Box>
  );
};

export default LoginAdmin;
