import React, { useEffect, useState } from "react";
import {
  Box,
  Title,
  Card,
  Group,
  Divider,
  Flex,
  Button,
  Text,
  ActionIcon,
  Image,
  Grid,
  TextInput,
} from "@mantine/core";
import { BsTrash, BsPencil, BsSearch } from "react-icons/bs";
import { showNotification } from "@mantine/notifications";
import {
  createService,
  updateService,
  deleteService,
  getServicesByOrganizationId,
} from "../../../services/serviceService";
import ModalCreateEdit from "./components/ModalCreateEdit";
import { uploadImage } from "../../../services/imageService";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface Service {
  _id: string;
  images?: (File | string)[];
  name: string;
  type: string;
  description?: string;
  price: number;
  duration: number;
}

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const organizationId = useSelector(
    (state: RootState) => state.auth.organizationId
  );

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, services]);

  const loadServices = async () => {
    try {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const servicesData = await getServicesByOrganizationId(organizationId);
      setServices(servicesData);
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al cargar los servicios",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const filterServices = () => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description &&
          service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredServices(filtered);
  };

  const handleSaveService = async (service: Service) => {
    try {
      let updatedServices;

      service.images = service.images || [];

      const filesToUpload = service.images.filter(
        (image) => image instanceof File
      ) as File[];

      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map((file) => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        const validUploadedUrls = uploadedUrls.filter(
          (url): url is string => url !== undefined
        );

        service.images = [
          ...service.images.filter((image) => typeof image === "string"),
          ...validUploadedUrls,
        ];
      }

      if (service._id) {
        const updatedService = await updateService(service._id, {
          ...service,
          images: service.images?.filter(
            (image): image is string => typeof image === "string"
          ),
        });
        updatedServices = services.map((s) =>
          s._id === service._id ? updatedService : s
        );
      } else {
        const newService = {
          ...service,
          images: service.images?.filter(
            (image): image is string => typeof image === "string"
          ),
          organizationId: organizationId,
        };
        const createdService = await createService(newService);
        updatedServices = [...services, createdService];
      }

      setServices(
        updatedServices.filter(
          (service): service is Service => service !== undefined
        )
      );

      setIsModalOpen(false);
      setEditingService(null);

      showNotification({
        title: service._id ? "Servicio actualizado" : "Servicio agregado",
        message: "El servicio ha sido guardado correctamente",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al guardar el servicio",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const handleDeleteService = async (serviceId: string, index: number) => {
    try {
      await deleteService(serviceId);
      const updatedServices = services.filter((_, i) => i !== index);
      setServices(updatedServices);
      showNotification({
        title: "Servicio eliminado",
        message: "El servicio ha sido eliminado correctamente",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Error al eliminar el servicio",
        color: "red",
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <Box>
      <Group justify="space-between" mt="xl">
        <Title order={1}>Administrar Servicios</Title>

        <Button
          onClick={() => {
            setIsModalOpen(true);
            setEditingService(null);
          }}
        >
          Agregar Nuevo Servicio
        </Button>
      </Group>

      <Divider my="md" />

      <TextInput
        leftSection={<BsSearch />}
        placeholder="Buscar servicio..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        mb="md"
      />

      <ModalCreateEdit
        isOpen={isModalOpen}
        onClose={onCloseModal}
        service={editingService}
        onSave={handleSaveService}
      />

      <Grid>
        {filteredServices.map((service, index) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={service._id}>
            <Card
              shadow="md"
              radius="md"
              withBorder
              style={{ position: "relative" }}
            >
              {service.images &&
                service.images.length > 0 &&
                typeof service.images[0] === "string" && (
                  <Card.Section>
                    <Image
                      src={service.images[0] as string}
                      height={160}
                      alt={service.name}
                      fit="cover"
                    />
                  </Card.Section>
                )}

              {/* Botones en la esquina superior derecha */}
              <Box
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: "8px",
                }}
              >
                <ActionIcon
                  variant="gradient"
                  radius="lg"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  onClick={() => {
                    setIsModalOpen(true);
                    setEditingService(service);
                  }}
                >
                  <BsPencil />
                </ActionIcon>
                <ActionIcon
                  variant="gradient"
                  radius="lg"
                  gradient={{ from: "red", to: "orange", deg: 90 }}
                  onClick={() => handleDeleteService(service._id, index)}
                >
                  <BsTrash />
                </ActionIcon>
              </Box>

              <Box p="xs" mt="md">
                <Title order={4}>{service.name}</Title>
                <Divider my="sm" />
                <Text fw={500} c="dimmed">
                  {service.type}
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {service.description}
                </Text>
                <Flex justify="space-between">
                  <Text fw={600}>${service.price.toLocaleString()}</Text>
                  <Text>{service.duration} min</Text>
                </Flex>
              </Box>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminServices;
