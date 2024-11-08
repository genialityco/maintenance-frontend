import React from "react";
import LoyaltyPlan from "./LoyaltyPlan.tsx";
import ReferredPlan from "./ReferredPlan.tsx";
import {
  Box,
  Card,
  Flex,
  Group,
  Text,
  Avatar,
  Divider,
  Badge,
  Button,
} from "@mantine/core";
import { Client as ClientType } from "../../services/clientService.ts";

interface PlanInfoProps {
  client: ClientType;
  onLogout: () => void;
}

const PlanInfo: React.FC<PlanInfoProps> = ({ client, onLogout }) => {
  return (
    <Box p="md">
      <Group justify="center" grow>
        <Flex direction="column" align="center">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Card.Section withBorder inheritPadding py="xs">
              <Flex justify="center" align="center" direction="column">
                <Avatar
                  radius="xl"
                  size="lg"
                  mb="sm"
                  color="blue"
                  variant="filled"
                >
                  {client.name[0].toUpperCase()}
                </Avatar>
                <Text size="xl" fw={700}>
                  {client.name}
                </Text>
                <Text c="dimmed" size="sm">
                  {client.phoneNumber}
                </Text>
                {client.email && (
                  <Text c="dimmed" size="xs" mt="xs">
                    {client.email}
                  </Text>
                )}
              </Flex>
            </Card.Section>

            <Divider my="sm" variant="dashed" />

            <Card.Section inheritPadding py="xs">
              <Badge color="teal" variant="light" size="lg">
                Servicios Tomados: {client.servicesTaken}
              </Badge>

              <LoyaltyPlan
                servicesTaken={client?.servicesTaken || 0}
                totalServices={7}
              />
            </Card.Section>

            <Divider my="sm" variant="dashed" />

            <Card.Section inheritPadding py="xs">
              <Badge color="indigo" variant="light" size="lg">
                Referidos Hechos: {client.referralsMade}
              </Badge>
              <ReferredPlan
                referralsMade={client.referralsMade}
                totalReferrals={5}
              />
            </Card.Section>
            <Divider my="sm" variant="dashed" />

            <Card.Section inheritPadding py="xs" mt="md">
              <Button fullWidth color="red" variant="light" onClick={onLogout}>
                Salir
              </Button>
            </Card.Section>
          </Card>
        </Flex>
      </Group>
    </Box>
  );
};

export default PlanInfo;
