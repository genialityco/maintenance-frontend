import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Text, Flex, Divider } from "@mantine/core";
import { MdOutlineLoyalty, MdPriceCheck } from "react-icons/md";
import { RiReservedLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import { BiCalendarCheck } from "react-icons/bi";

interface NavbarLinksProps {
  isAdmin: boolean;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ isAdmin }) => {
  return (
    <Box>
      <Flex direction="column" align="center" justify="center">
        <NavLink to="/servicios-precios" style={{ textDecoration: "none" }}>
          <Flex align="center" justify="center" gap="sm">
            <MdPriceCheck size={20} color="white" />
            <Text c="white" fw={600} my="md">
              Precios y servicios
            </Text>
          </Flex>
        </NavLink>

        <NavLink to="/" style={{ textDecoration: "none" }}>
          <Flex align="center" justify="center" gap="sm">
            <MdOutlineLoyalty size={20} color="white" />
            <Text c="white" fw={600} my="md">
              Plan de fidelidad
            </Text>
          </Flex>
        </NavLink>

        <NavLink to="/reservar" style={{ textDecoration: "none" }}>
          <Flex align="center" justify="center" gap="sm">
            <RiReservedLine size={20} color="white" />
            <Text c="white" fw={600} my="md">
              Reserva en linea
            </Text>
          </Flex>
        </NavLink>
      </Flex>
      {isAdmin && (
        <Divider my="xs" label="Sección administrativa" labelPosition="center" />
      )}
      {isAdmin && (
        <Flex direction="column" align="center" justify="center">
          <NavLink to="/gestionar-usuarios" style={{ textDecoration: "none" }}>
            <Flex align="center" justify="center" gap="sm">
              <GrUserSettings size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Gestionar usuarios
              </Text>
            </Flex>
          </NavLink>

          <NavLink to="/gestionar-agenda" style={{ textDecoration: "none" }}>
            <Flex align="center" justify="center" gap="sm">
              <BiCalendarCheck size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Gestionar agenda
              </Text>
            </Flex>
          </NavLink>
        </Flex>
      )}
    </Box>
  );
};

export default NavbarLinks;
