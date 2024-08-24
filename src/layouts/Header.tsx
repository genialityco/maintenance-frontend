import { Text, Box, Group, ActionIcon, Burger, useMantineTheme } from "@mantine/core";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const Header = () => {
  const theme = useMantineTheme();
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <Box
      component="header"
      bg="#1A202C"
      p="0.5rem 0"
      style={{
        width: "100vw",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Group
        justify="space-between"
        px="sm"
        style={{ flexWrap: "wrap" }}
      >
        <Text
          size="xl"
          fw={900}
          style={{
            background: "linear-gradient(90deg, #FF0080, #7928CA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Galaxia Glamour
        </Text>

        <Group
          gap="xl"
          className="menu-links"
          style={{
            display: menuOpened ? "flex" : "none",
            alignItems: "center",
          }}
        >
          <Text c="white" fw={500}>
            Servicios
          </Text>
          <Text c="white" fw={500}>
            Precios
          </Text>
        </Group>

        <Group
          gap="md"
          className="social-icons"
          style={{
            marginTop: menuOpened ? "1rem" : "0",
            justifyContent: "center",
          }}
        >
          <ActionIcon radius="xl" size="lg" variant="light" color="blue">
            <FaFacebook size="1.3rem" />
          </ActionIcon>
          <ActionIcon radius="xl" size="lg" variant="light" color="pink">
            <FaInstagram size="1.3rem" />
          </ActionIcon>
          <ActionIcon radius="xl" size="lg" variant="light" color="green">
            <FaWhatsapp size="1.3rem" />
          </ActionIcon>
        </Group>
        
        <Burger
          opened={menuOpened}
          onClick={() => setMenuOpened((o) => !o)}
          size="md"
          color={theme.white}
          className="burger-menu"
        />
      </Group>
    </Box>
  );
};

export default Header;
