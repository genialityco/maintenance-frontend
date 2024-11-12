import React, { useState, useEffect } from "react";
import { TextInput, Button, Text, Card, Flex, Checkbox } from "@mantine/core";
import colors from "../../theme/colores";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/sliceAuth";
import { login } from "../../services/authService";

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Cargar el email guardado en localStorage al cargar el componente
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      if (data) {
        const organizationId =
          data.userType === "admin" ? data.userId : data.organizationId;
        console.log(organizationId);
        // Autenticación exitosa
        dispatch(
          loginSuccess({
            userId: data.userId,
            organizationId,
            token: data.token,
            role: data.userType,
            permissions: data.userPermissions,
          })
        );
        navigation("/gestionar-agenda");

        // Guardar o eliminar el email de localStorage según el estado de rememberMe
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Card
        w={{ xs: "70%", sm: "60%", md: "50%", lg: "40%" }}
        style={{
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
          placeholder="Ingresa tu correo *"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
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
        <Checkbox
          label="Recordar mis datos"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.currentTarget.checked)}
          mb="md"
        />
        {error && (
          <Text color={colors.errorText} mb="md">
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
