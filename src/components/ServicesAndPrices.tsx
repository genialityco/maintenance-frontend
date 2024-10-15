import React, { useEffect, useState } from "react";
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
import { getServices, Service } from "../services/serviceService";

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
            {description || ""}
          </Text>
          <Divider my="sm" />
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
  <Card
    shadow="sm"
    my="sm"
    radius="md"
    withBorder
    bg="#2A2E35"
    style={{ textAlign: "center" }}
  >
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
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener servicios desde la API
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      const data = await getServices();
      setServices(data);
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  // Filtrar los servicios por tipo
  const filterServicesByType = (type: string) => {
    return services
      .filter((service) => service.type === type)
      .map((service) => ({
        name: service.name,
        price: `$${service.price.toLocaleString()}`,
        description: service.description || "",
        images: service.images || [],
      }));
  };

  if (isLoading) {
    return <Text>Cargando servicios...</Text>;
  }

  return (
    <Box color="white">
      <Title order={1} mb="lg" ta="center">
        Precios y servicios
      </Title>

      <Group justify="center" grow>
        <Flex direction="column">
          <ServiceCategory
            title="Pestañas Clásicas"
            services={filterServicesByType("Pestañas Clásicas")}
          />
          <ServiceCategory
            title="Pestañas Fibras Tecnológicas"
            services={filterServicesByType("Pestañas Fibras Tecnológicas")}
          />
          <ServiceCategory
            title="Retoques pestañas"
            services={filterServicesByType("Retoques pestañas")}
          />
          <ServiceCategory
            title="Insumos para cejas y pestañas"
            services={[
              {
                name: "¿Eres artista de pestañas y cejas? - ¡Clic en el enlace!",
                price: "www.zybizobazar.com",
                description:
                  "Consulta el catálogo y realiza tu pedido en el enlace siguiente",
                images: ["https://i.ibb.co/FhpJkcH/Presentaci-n.jpg"],
              },
            ]}
          />
        </Flex>
      </Group>
    </Box>
  );
};

export default ServicesAndPrices;
