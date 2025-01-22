import { Container, Title, Grid, Button, Group, Text } from "@mantine/core";
import { BiCalendar, BiStore } from "react-icons/bi";
import { FaIdeal } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import { GrLocation } from "react-icons/gr";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      title: "Reserva en Línea",
      icon: <BiCalendar size={24} />,
      link: "/online-reservation",
      external: false,
    },
    {
      title: "Servicios y Precios",
      icon: <GiPriceTag size={24} />,
      link: "/servicios-precios",
      external: false,
    },
    {
      title: "Plan de Fidelidad",
      icon: <FaIdeal size={24} />,
      link: "/search-client",
      external: false,
    },
    {
      title: "Ubicación",
      icon: <GrLocation size={24} />,
      link: "location",
      external: false,
    },
    {
      title: "Insumos de Pestañas",
      icon: <BiStore size={24} />,
      link: "https://zybizobazar.com",
      external: true,
    },
  ];

  return (
    <Container size="sm">
      <Title ta="center" mb="lg">
        ¡Holaaa! Bienvenido
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Estamos felices de tenerte aquí. Dale a tus uñas y pestañas el cuidado
        que merecen. 🌟
      </Text>

      <Grid>
        {features.map((feature, index) => (
          <Grid.Col key={index} span={12}>
            {feature.external ? (
              <Button
                component="a"
                href={feature.link}
                target="_blank"
                fullWidth
                size="lg"
                variant="light"
                leftSection={feature.icon}
                styles={(theme) => ({
                  root: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: `1px solid ${theme.colors.gray[3]}`,
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.gray[0],
                    "&:hover": {
                      backgroundColor: theme.colors.gray[1],
                    },
                  },
                })}
              >
                <Group justify="space-around" grow>
                  <Text size="lg" fw={500}>
                    {feature.title}
                  </Text>
                </Group>
              </Button>
            ) : (
              <Button
                component={Link}
                to={feature.link}
                fullWidth
                size="lg"
                variant="light"
                leftSection={feature.icon}
                styles={(theme) => ({
                  root: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: `1px solid ${theme.colors.gray[3]}`,
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.gray[0],
                    "&:hover": {
                      backgroundColor: theme.colors.gray[1],
                    },
                  },
                })}
              >
                <Group justify="space-around" grow>
                  <Text size="lg" fw={500}>
                    {feature.title}
                  </Text>
                </Group>
              </Button>
            )}
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
