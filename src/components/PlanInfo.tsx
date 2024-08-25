import React from "react";
import LoyaltyPlan from "./LoyaltyPlan";
import ReferredPlan from "./ReferredPlan";
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
import { User as UserType } from '../services/userService.tsx'

interface PlanInfoProps {
  user: UserType;
  onLogout: () => void;
}

const PlanInfo: React.FC<PlanInfoProps> = ({ user, onLogout }) => {
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
                  {user.name[0].toUpperCase()}
                </Avatar>
                <Text size="xl" fw={700}>
                  {user.name}
                </Text>
                <Text c="dimmed" size="sm">
                  {user.phoneNumber}
                </Text>
                {user.email && (
                  <Text c="dimmed" size="xs" mt="xs">
                    {user.email}
                  </Text>
                )}
              </Flex>
            </Card.Section>

            <Divider my="sm" variant="dashed" />

            <Card.Section inheritPadding py="xs">
              <Badge color="teal" variant="light" size="lg">
                Servicios Tomados: {user.servicesTaken}
              </Badge>
              {user.servicesTaken && (
                <LoyaltyPlan
                  servicesTaken={user.servicesTaken}
                  totalServices={7}
                />
              )}
            </Card.Section>

            <Divider my="sm" variant="dashed" />

            <Card.Section inheritPadding py="xs">
              <Badge color="indigo" variant="light" size="lg">
                Referidos Hechos: {user.referralsMade}
              </Badge>
              <ReferredPlan
                referralsMade={user.referralsMade}
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
