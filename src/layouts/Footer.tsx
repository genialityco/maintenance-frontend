import { Text, Box, Center, ActionIcon } from "@mantine/core";
import { FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      bg="#1A202C"
      p="0.1rem 0"
      style={{
        width: "100%",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.2)",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1000, // Asegura que el footer esté por encima de otros elementos
      }}
    >
      <Center>
        <Text
          size="xs"
          style={{
            color: "#E2E8F0",
            fontWeight: 500,
          }}
        >
          © 2024 Galaxia Glamour. Belleza con Estilo y Elegancia.
        </Text>
      </Center>
      <ActionIcon
        style={{
          position: "absolute",
          right: "5px",
          bottom: "5px",
          color: "#E2E8F0",
        }}
        radius="lg"
        onClick={() => navigate("/admin")}
      >
        <FaUserShield size="1.5rem" />
      </ActionIcon>
    </Box>
  );
};

export default Footer;
