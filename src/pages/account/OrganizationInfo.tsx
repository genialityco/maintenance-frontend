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
        } else {
          setError(true);
          showNotification({
            title: "Error",
            message: "ID de organización no disponible",
            color: "red",
            position: "top-right",
            icon: <IoAlertCircle size={16} />,
          });
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

    fetchOrganization();
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
      } else {
        showNotification({
          title: "Error",
          message: "ID de organización no disponible",
          color: "red",
          position: "top-right",
          icon: <IoAlertCircle size={16} />,
        });
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

  if (loading) return <Text>Cargando...</Text>;
  if (error)
    return (
      <Center style={{ height: "100vh" }}>
        <Text color="red" size="xl">
          Error al cargar la información de la organización
        </Text>
      </Center>
    );

  return (
    <Card shadow="sm" padding="lg">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Información de la Organización</Title>
        {isEditing ? (
          <Button color="green" onClick={handleSave}>
            Guardar cambios
          </Button>
        ) : (
          <Button color="blue" onClick={() => setIsEditing(true)}>
            Editar información
          </Button>
        )}
      </Flex>

      <Stack m="xs" mt="md">
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
        <Text>
          Estado:{" "}
          {organization.isActive ? (
            <Badge color="green">Activo</Badge>
          ) : (
            <Badge color="red">Inactivo</Badge>
          )}
        </Text>
      </Stack>
    </Card>
  );
};

export default OrganizationInfo;
