import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Text, Flex, Divider, ScrollArea } from "@mantine/core";

import { BiCalendarCheck } from "react-icons/bi";
import { GiPriceTag } from "react-icons/gi";
import { FaIdeal, FaUsers } from "react-icons/fa";
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
            to="/consult-requests"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <GiPriceTag size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Consultar solicitudes
              </Text>
            </Flex>
          </NavLink>

          <NavLink
            to="/maintenance-history"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <FaIdeal size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Historial de mantenimientos
              </Text>
            </Flex>
          </NavLink>
        </Flex>

        {(hasPermission("businessInformation:read") ||
          hasPermission("appointments:view_own") ||
          hasPermission("appointments:view_all")) && (
          <Divider my="xs" label="Gestión de solicitudes" labelPosition="center" />
        )}

        {(hasPermission("appointments:view_all") ||
          hasPermission("appointments:view_own")) && (
          <NavLink
            to="/manage-requests"
            onClick={closeNavbar}
            style={{ textDecoration: "none" }}
          >
            <Flex align="center" justify="center" gap="sm">
              <BiCalendarCheck size={20} color="white" />
              <Text c="white" fw={600} my="md">
                Gestionar solicitudes
              </Text>
            </Flex>
          </NavLink>
        )}
        {(hasPermission("clients:read") ||
          hasPermission("services:read") ||
          hasPermission("employees:read")) && (
          <Divider
            my="xs"
            label="Sección administrativa"
            labelPosition="center"
          />
        )}

        <Flex direction="column" align="center" justify="center">
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
      </Box>
    </ScrollArea>
  );
};

export default NavbarLinks;
