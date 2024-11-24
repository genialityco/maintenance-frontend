import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Title,
  Badge,
  Center,
  TextInput,
  Button,
  Stack,
  Flex,
  Container,
  Divider,
  Group,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  getOrganizationById,
  updateOrganization,
  Organization,
} from "../../services/organizationService";
import { showNotification } from "@mantine/notifications";
import { IoAlertCircle } from "react-icons/io5";
import CustomLoader from "../../components/customLoader/CustomLoader";

const OrganizationInfo = () => {
  const [organization, setOrganization] = useState<Organization>(
    {} as Organization
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);

  const organizationId = useSelector(
    (state: RootState) => state.auth.organizationId
  );

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (organizationId) {
          const response = await getOrganizationById(organizationId);
          if (response) {
            setOrganization(response);
          } else {
            setError(true);
            showNotification({
              title: "Error",
              message: "Organización no encontrada",
              color: "red",
              position: "top-right",
              icon: <IoAlertCircle size={16} />,
            });
          }
        }
      } catch (error) {
        console.error(
          "Error al cargar la información de la organización:",
          error
        );
        setError(true);
        showNotification({
          title: "Error",
          message: "Error al cargar la información de la organización",
          color: "red",
          position: "top-right",
          icon: <IoAlertCircle size={16} />,
        });
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const handleInputChange = (field: keyof Organization, value: string) => {
    setOrganization((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (organizationId) {
        const updatedOrganization = { ...organization };
        if (!updatedOrganization.password) {
          delete updatedOrganization.password;
        }
        await updateOrganization(organizationId, updatedOrganization);
      }
      showNotification({
        title: "Éxito",
        message: "Información actualizada correctamente",
        color: "green",
        position: "top-right",
        icon: <IoAlertCircle size={16} />,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la organización:", error);
      showNotification({
        title: "Error",
        message: "Error al actualizar la información de la organización",
        color: "red",
        position: "top-right",
        icon: <IoAlertCircle size={16} />,
      });
    }
  };

  if (loading) return <CustomLoader />;
  if (error)
    return (
      <Center style={{ height: "100vh" }}>
        <Text c="red" size="xl">
          Error al cargar la información de la organización
        </Text>
      </Center>
    );

  return (
    <Container>
      <Card shadow="sm" radius="md" m="md" withBorder>
        <Flex justify="space-between" align="center" mb="md">
          <Group mt="lg" justify="space-between" align="center">
            <Title order={2} ta="center">
              Información de la Organización
            </Title>
            <Text>
              {organization.isActive ? (
                <Badge color="green">Activa</Badge>
              ) : (
                <Badge color="red">Inactiva</Badge>
              )}
            </Text>
          </Group>
          <Button
            color={isEditing ? "green" : "blue"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? "Guardar Cambios" : "Editar Información"}
          </Button>
        </Flex>

        <Divider my="lg" />

        <Stack m="lg">
          <TextInput
            label="Nombre"
            value={organization.name || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <TextInput
            label="Email"
            value={organization.email || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <TextInput
            label="Teléfono"
            value={organization.phoneNumber || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
          <TextInput
            label="Instagram URL"
            value={organization.instagramUrl || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
          />
          <TextInput
            label="Facebook URL"
            value={organization.facebookUrl || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
          />
          <TextInput
            label="WhatsApp URL"
            value={organization.whatsappUrl || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("whatsappUrl", e.target.value)}
          />
          <TextInput
            label="TikTok URL"
            value={organization.tiktokUrl || ""}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
          />
        </Stack>
      </Card>
    </Container>
  );
};

export default OrganizationInfo;
