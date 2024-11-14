import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Text, Flex, Divider, ScrollArea } from "@mantine/core";
import { MdOutlineLoyalty, MdPriceCheck } from "react-icons/md";
// import { RiReservedLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import { BiCalendarCheck } from "react-icons/bi";
import { GiClawSlashes } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { usePermissions } from "../hooks/usePermissions";

interface NavbarLinksProps {
  closeNavbar: () => void;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ closeNavbar }) => {
  const { hasPermission } = usePermissions();

  return (
    <ScrollArea>
      <Box>
        <Flex direction="column" align="center" justify="center">
          <NavLink
            to="/servicios-precios"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <MdPriceCheck size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Precios y servicios
              </Text>
            </Flex>
          </NavLink>

          <NavLink
            to="/"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <MdOutlineLoyalty size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Plan de fidelidad
              </Text>
            </Flex>
          </NavLink>

          {/* <NavLink
            to="/reservar"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <RiReservedLine size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Reserva en linea
              </Text>
            </Flex>
          </NavLink> */}
        </Flex>

        {(hasPermission("clients:read") ||
          hasPermission("appointments:view_all") ||
          hasPermission("services:read") ||
          hasPermission("employees:read") ||
          hasPermission("appointments:view_own")) && (
          <Divider
            my="xs"
            label="Sección administrativa"
            labelPosition="center"
          />
        )}

        <Flex direction="column" align="center" justify="center">
          {hasPermission("clients:read") && (
            <NavLink
              to="/gestionar-clientes"
              onClick={closeNavbar}
              style={{ textDecoration: "none" }}
            >
              <Flex align="center" justify="center" gap="sm">
                <GrUserSettings size={20} color="white" />
                <Text c="white" fw={600} my="md">
                  Gestionar clientes
                </Text>
              </Flex>
            </NavLink>
          )}

          {(hasPermission("appointments:view_all") ||
            hasPermission("appointments:view_own")) && (
            <NavLink
              to="/gestionar-agenda"
              onClick={closeNavbar}
              style={{ textDecoration: "none" }}
            >
              <Flex align="center" justify="center" gap="sm">
                <BiCalendarCheck size={20} color="white" />
                <Text c="white" fw={600} my="md">
                  Gestionar agenda
                </Text>
              </Flex>
            </NavLink>
          )}

          {hasPermission("services:read") && (
            <NavLink
              to="/gestionar-servicios"
              onClick={closeNavbar}
              style={{ textDecoration: "none" }}
            >
              <Flex align="center" justify="center" gap="sm">
                <GiClawSlashes size={20} color="white" />
                <Text c="white" fw={600} my="md">
                  Gestionar servicios
                </Text>
              </Flex>
            </NavLink>
          )}

          {hasPermission("employees:read") && (
            <NavLink
              to="/gestionar-empleados"
              onClick={closeNavbar}
              style={{ textDecoration: "none" }}
            >
              <Flex align="center" justify="center" gap="sm">
                <FaUsers size={20} color="white" />
                <Text c="white" fw={600} my="md">
                  Gestionar empleados
                </Text>
              </Flex>
            </NavLink>
          )}
        </Flex>
        {hasPermission("businessInformation:read") && (
          <Divider my="xs" label="Gestión de cuenta" labelPosition="center" />
        )}
        {hasPermission("businessInformation:read") && (
          <NavLink
            to="/informacion-negocio"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <MdOutlineLoyalty size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Información del negocio
              </Text>
            </Flex>
          </NavLink>
        )}
        {hasPermission("employeeInformation:read") && (
          <NavLink
            to="/informacion-empleado"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <MdOutlineLoyalty size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Información del empleado
              </Text>
            </Flex>
          </NavLink>
        )}
      </Box>
    </ScrollArea>
  );
};

export default NavbarLinks;
