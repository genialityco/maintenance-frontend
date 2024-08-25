import {
  Text,
  Box,
  Group,
  ActionIcon,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

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
      <Group justify="space-between" px="sm" style={{ flexWrap: "wrap" }}>
        <Text
          size="xl"
          fw={900}
          variant="gradient"
          gradient={{ from: "#FFD700", to: "#7928CA", deg: 182 }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Galaxia Glamour
          </Link>
        </Text>

        <Group
          gap="xl"
          className="menu-links"
          style={{
            display: menuOpened ? "flex" : "none",
            alignItems: "center",
          }}
        >
          <Text c="white" fw={600}>
            <Link
              to="/servicios-precios"
              style={{ textDecoration: "none", color: "white" }}
            >
              Precios y servicios
            </Link>
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
          <a
            href="https://www.instagram.com/galaxia.glamour27/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon radius="xl" size="lg" variant="light" color="pink">
              <FaInstagram size="1.3rem" />
            </ActionIcon>
          </a>
          <a
            href="https://wa.me/573218104634"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon radius="xl" size="lg" variant="light" color="green">
              <FaWhatsapp size="1.3rem" />
            </ActionIcon>
          </a>
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
