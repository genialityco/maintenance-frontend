import React, { useState } from "react";
import {
  Box,
  Text,
  List,
  Title,
  Card,
  Group,
  Divider,
  Flex,
  ThemeIcon,
  Modal,
  Image,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { BsEye } from "react-icons/bs";

// Constantes para estilos reutilizables
const gradientTextStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #FFD700, #7928CA)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const gradientPriceStyle = { from: "#FFD700", to: "#7928CA", deg: 182 };

// Definición de interfaces para los props
interface ServiceItemProps {
  name: string;
  price: string;
  description?: string;
  images?: string[]; // Propiedad para las imágenes del servicio
}

interface ServiceCategoryProps {
  title: string;
  services: ServiceItemProps[];
}

// Componente para un servicio individual
const ServiceItem: React.FC<ServiceItemProps> = ({
  name,
  price,
  description,
  images,
}) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <List.Item
        icon={
          <ThemeIcon
            variant="light"
            size={18}
            radius="xl"
            onClick={() => setOpened(true)}
            style={{ cursor: "pointer" }}
          >
            <BsEye />
          </ThemeIcon>
        }
      >
        <Text fw={500} style={{ color: "white" }}>
          {name}
        </Text>
        <Text size="xl" variant="gradient" gradient={gradientPriceStyle}>
          {price}
        </Text>
      </List.Item>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={` ${name}`}
        size="md"
        centered
      >
        <Flex direction="column" align="center">
          {images && images.length > 0 ? (
            <Carousel withIndicators style={{ width: "90%" }}>
              {images.map((image, index) => (
                <Carousel.Slide key={index}>
                  <Image
                    src={image}
                    alt={`${name} ${index + 1}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Text size="md" style={{ color: "#2A2E35" }}>
              No hay imágenes disponibles para este servicio.
            </Text>
          )}
          <Divider my="sm" />
          <Text size="md" style={{ color: "#2A2E35" }}>
            {description || "Descripción no disponible"}
          </Text>
          <Divider my="sm" />
          <Text
            size="lg"
            fw={700}
            variant="gradient"
            gradient={gradientPriceStyle}
          >
            Precio: {price}
          </Text>
        </Flex>
      </Modal>
    </>
  );
};

// Componente para una categoría de servicios
const ServiceCategory: React.FC<ServiceCategoryProps> = ({
  title,
  services,
}) => (
  <Card shadow="sm" my="sm" radius="md" withBorder bg="#2A2E35">
    <Title order={2}>
      <Text size="xl" fw={900} style={gradientTextStyle}>
        {title}
      </Text>
    </Title>
    <Divider my="sm" color="white" />
    <List spacing="sm" size="sm" center>
      {services.map((service, index) => (
        <ServiceItem
          key={index}
          name={service.name}
          price={service.price}
          description={service.description}
          images={service.images}
        />
      ))}
    </List>
  </Card>
);

const ServicesAndPrices: React.FC = () => {
  // Datos de los servicios
  const eyebrowServices: ServiceItemProps[] = [
    {
      name: "Depilación en hilo y sombreado en henna",
      price: "$25.000",
      description: "Esta es una descripción detallada del servicio de cejas.",
      images: [
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
      ],
    },
  ];

  const eyelashServicesClassic: ServiceItemProps[] = [
    {
      name: "Efecto Seminatural",
      price: "$50.000",
      description: "Este servicio incluye pestañas con un efecto natural.",
      images: [
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
      ],
    },
    {
      name: "Efecto Pestañina",
      price: "$60.000",
      description:
        "Este servicio da un efecto de pestañina sin la necesidad de usarla.",
      images: [
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
      ],
    },
  ];

  const eyelashServicesTechnological: ServiceItemProps[] = [
    {
      name: "Volumen (YY) / Efecto Hawaiano",
      price: "$70.000",
      description: "Pestañas con un volumen YY y un efecto hawaiano único.",
      images: [
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
      ],
    },
    {
      name: "Volumen (3D) / Efecto Griego",
      price: "$90.000",
      description: "Pestañas con volumen 3D y un impresionante efecto griego.",
      images: [
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
      ],
    },
    {
      name: "Volumen (6D) / Efecto Egipcio",
      price: "$100.000",
      description: "El máximo volumen 6D con un exótico efecto egipcio.",
      images: [
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
        "https://i.ibb.co/L0ZcZQk/No-Services.png",
      ],
    },
  ];

  return (
    <Box p="xl" bg="#1A202C" color="white">
      <Title order={1} mb="lg" style={gradientTextStyle}>
        Precios y servicios
      </Title>

      <Group justify="center" grow>
        <Flex direction="column">
          <ServiceCategory title="Cejas" services={eyebrowServices} />
          <ServiceCategory
            title="Pestañas Clásicas"
            services={eyelashServicesClassic}
          />
          <ServiceCategory
            title="Pestañas Fibras Tecnológicas"
            services={eyelashServicesTechnological}
          />
        </Flex>
      </Group>
    </Box>
  );
};

export default ServicesAndPrices;
