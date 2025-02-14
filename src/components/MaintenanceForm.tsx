import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Textarea,
  Button,
  FileInput,
  Group,
  Image,
  Select,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { BiUpload } from "react-icons/bi";
import { showNotification } from "@mantine/notifications";
import { CreateMaintenanceRequestPayload } from "../services/maintenanceRequestService";
import { uploadImage } from "../services/imageService";

interface MaintenanceFormProps {
  initialValues?: CreateMaintenanceRequestPayload;
  onSubmit: (values: CreateMaintenanceRequestPayload) => Promise<void>;
  isEditing?: boolean;
}

const MaintenanceForm = ({
  initialValues,
  onSubmit,
  isEditing = false,
}: MaintenanceFormProps) => {
  const [preview, setPreview] = useState<string | null>(
    isEditing && initialValues?.photo ? initialValues.photo : null
  );
  const [uploading, setUploading] = useState<boolean>(false);
  const [anonymous, setAnonymous] = useState<boolean>(false);

  const form = useForm<CreateMaintenanceRequestPayload>({
    initialValues: initialValues || {
      reporterName: "",
      phoneNumber: "",
      location: "",
      damagedItem: "" as "WALL" | "FLOOR" | "WINDOW" | "BULB",
      description: "",
      photo: undefined,
      isAnonymous: false,
    },

    validate: {
      reporterName: (value) =>
        anonymous || value.trim().length > 0
          ? null
          : "El nombre es obligatorio",
      phoneNumber: (value) =>
        anonymous || value.trim().length > 0
          ? null
          : "El número de teléfono es obligatorio",
      location: (value) =>
        value.trim().length > 0 ? null : "Debes seleccionar una zona",
      damagedItem: (value) =>
        value.trim().length > 0 ? null : "Debes seleccionar el tipo de daño",
      description: (value) =>
        value.trim().length > 0 ? null : "La descripción es obligatoria",
    },
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setPreview(isEditing && initialValues?.photo ? initialValues.photo : null); // Restaurar la imagen cargada si no se selecciona una nueva
      form.setFieldValue("photo", initialValues?.photo || undefined);
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      form.setFieldValue("photo", imageUrl ?? "");
      setPreview(imageUrl ?? null);
    } catch (error) {
      console.error("Error al subir la imagen", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: CreateMaintenanceRequestPayload) => {
    try {
      const payload = anonymous
        ? {
            ...values,
            reporterName: "Anónimo",
            phoneNumber: "N/A",
            isAnonymous: true,
          }
        : { ...values, isAnonymous: false };

      await onSubmit(payload);
      form.reset();
      setPreview(null);

      showNotification({
        title: "Éxito",
        message: isEditing
          ? "Solicitud de mantenimiento actualizada."
          : "Solicitud de mantenimiento enviada.",
        color: "green",
        autoClose: 2000,
        position: "top-right",
      });

      setAnonymous(false);
    } catch (error) {
      console.error(
        isEditing
          ? "Error al actualizar la solicitud de mantenimiento"
          : "Error al enviar la solicitud de mantenimiento",
        error
      );
    }
  };

  return (
    <Container size="sm">
      <Title ta="center" mb="lg">
        {isEditing ? "Editar Solicitud" : "Solicitud de Mantenimiento"}
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Describe el problema, selecciona la zona y adjunta una foto para
        ayudarnos a resolverlo rápidamente.
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Checkbox
          label="Reportar de forma anónima"
          checked={anonymous}
          onChange={(event) => {
            setAnonymous(event.currentTarget.checked);
            form.setValues({
              ...form.values,
              reporterName: event.currentTarget.checked
                ? ""
                : form.values.reporterName,
              phoneNumber: event.currentTarget.checked
                ? ""
                : form.values.phoneNumber,
            });
          }}
          mb="md"
        />

        {!anonymous && (
          <>
            <TextInput
              label="Nombre del reportante"
              placeholder="Tu nombre"
              {...form.getInputProps("reporterName")}
              mb="md"
            />

            <TextInput
              label="Número de teléfono"
              placeholder="Tu número de contacto"
              {...form.getInputProps("phoneNumber")}
              mb="md"
            />
          </>
        )}

        <Select
          label="Zona del problema"
          placeholder="Selecciona una zona"
          data={[
            { value: "S1", label: "[S1] QUEEN ROOM" },
            { value: "S2", label: "[S2] GALACTIC SQUARE" },
            { value: "S3", label: "[S3] CAFETERIA" },
          ]}
          {...form.getInputProps("location")}
          required
          mb="md"
        />

        <Select
          label="Elemento dañado"
          placeholder="Selecciona el elemento dañado"
          data={[
            { value: "WALL", label: "Pared" },
            { value: "FLOOR", label: "Piso" },
            { value: "WINDOW", label: "Ventana" },
            { value: "BULB", label: "Bombilla" },
          ]}
          {...form.getInputProps("damagedItem")}
          required
          mb="md"
        />

        <Textarea
          label="Descripción del problema"
          placeholder="Describe el problema aquí..."
          {...form.getInputProps("description")}
          required
          mb="md"
        />

        <FileInput
          label="Sube una foto"
          placeholder="Selecciona una imagen"
          leftSection={<BiUpload size={16} />}
          onChange={handleFileChange}
          accept="image/*"
          mb="md"
          disabled={uploading}
        />

        {preview && (
          <Image
            src={preview}
            alt="Vista previa"
            radius="md"
            mb="md"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        <Group justify="center">
          <Button type="submit" size="lg" mb="lg" disabled={uploading}>
            {uploading
              ? "Subiendo imagen..."
              : isEditing
              ? "Actualizar Solicitud"
              : "Enviar Solicitud"}
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default MaintenanceForm;