import React, { useState } from "react";
import { TextInput, Button, Text, Card, Flex } from "@mantine/core";
import colors from "../../theme/colores";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/sliceAuth";

interface LoginResponse {
  user: string;
  token: string;
  role: string;
}

const LoginAdmin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (username === "natysipq" && password === "0714") {
      const data: LoginResponse = {
        user: "natysipq",
        token: "0714",
        role: "admin",
      };
      dispatch(
        loginSuccess({ user: data.user, token: data.token, role: data.role })
      );
      navigation("/gestionar-usuarios");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Card
        style={{
          maxWidth: "80%",
          margin: "auto",
          padding: "2rem",
          backgroundColor: colors.cardBackground,
          color: colors.primaryText,
          borderRadius: "8px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
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
    </Flex>
  );
};

export default LoginAdmin;
