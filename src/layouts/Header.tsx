import { Text, Box, Group, ActionIcon } from "@mantine/core";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpened] = useState(false);

  return (
    <Box
      component="header"
      p="0.5rem 0"
      style={{
        width: "100%",
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
          <Text c="white" fw={600}>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              Plan de fidelidad
            </Link>
          </Text>
        </Group>

        <Group
          gap="xs"
          className="social-icons"
          style={{
            marginTop: menuOpened ? "1rem" : "0",
            justifyContent: "center",
          }}
        >
          <ActionIcon radius="xl" size="md" variant="light" color="blue">
            <FaFacebook />
          </ActionIcon>
          <a
            href="https://www.instagram.com/galaxia.glamour27/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon radius="xl" size="md" variant="light" color="pink">
              <FaInstagram />
            </ActionIcon>
          </a>
          <a
            href="https://wa.me/573218104634"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon radius="xl" size="md" variant="light" color="green">
              <FaWhatsapp />
            </ActionIcon>
          </a>
        </Group>
      </Group>
    </Box>
  );
};

export default Header;
