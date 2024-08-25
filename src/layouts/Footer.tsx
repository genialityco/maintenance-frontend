import { Text, Box, Center } from "@mantine/core";

export const Footer = () => {
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
    </Box>
  );
};

export default Footer;
