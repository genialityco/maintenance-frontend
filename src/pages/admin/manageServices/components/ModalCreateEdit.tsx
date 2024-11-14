import React, { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  Chip,
  Button,
  Flex,
  Image,
  ActionIcon,
  Group,
  Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { BiImageAdd, BiSolidXCircle } from "react-icons/bi";

interface Service {
  _id: string;
  images?: (File | string)[]; 
  name: string;
  type: string;
  description?: string;
  price: number;
  duration: number;
}

interface ModalCreateEditProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (service: Service) => void;
}

const ModalCreateEdit: React.FC<ModalCreateEditProps> = ({
  isOpen,
  onClose,
  service,
  onSave,
}) => {
  const [editingService, setEditingService] = useState<Service>({
    _id: "",
    name: "",
    type: "",
    description: "",
    price: 0,
    duration: 0,
    images: [],
  });
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (service) {
      setEditingService(service);
      setImageFiles(service.images || []);
    } else {
      setEditingService({
        _id: "",
        name: "",
        type: "",
        description: "",
        price: 0,
        duration: 0,
        images: [],
      });
      setImageFiles([]);
    }
  }, [service]);

  const handleDrop = (files: File[]) => {
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  const handleSave = () => {
    onSave({ ...editingService, images: imageFiles });
    onClose();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={service ? "Editar Servicio" : "Agregar Servicio"}
      size="md"
      centered
    >
      <Stack gap="xs">
        <TextInput
          label="Nombre del servicio"
          value={editingService.name}
          onChange={(e) =>
            setEditingService({
              ...editingService,
              name: e.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Tipo de servicio"
          value={editingService.type}
          onChange={(e) =>
            setEditingService({
              ...editingService,
              type: e.currentTarget.value,
            })
          }
        />
        <NumberInput
          label="Precio"
          prefix="$ "
          thousandSeparator=","
          value={editingService.price}
          onChange={(value) =>
            setEditingService({
              ...editingService,
              price: typeof value === "number" ? value : 0,
            })
          }
        />
        <div>
          <NumberInput
            label="Duración (minutos)"
            value={editingService.duration}
            onChange={(value) =>
              setEditingService({
                ...editingService,
                duration: typeof value === "number" ? value : 0,
              })
            }
          />
          <Flex justify="center">
            <Chip.Group>
              {[15, 30, 60, 90].map((duration) => (
                <Chip
                  key={duration}
                  size="xs"
                  onChange={() =>
                    setEditingService({ ...editingService, duration })
                  }
                >
                  {duration} minutos
                </Chip>
              ))}
            </Chip.Group>
          </Flex>
        </div>
        <Textarea
          label="Descripción"
          value={editingService.description}
          onChange={(e) =>
            setEditingService({
              ...editingService,
              description: e.currentTarget.value,
            })
          }
        />
        <Dropzone
          onDrop={handleDrop}
          accept={IMAGE_MIME_TYPE}
          multiple
          style={{
            border: "2px dashed #ced4da",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.3s",
          }}
          onDragEnter={(e) => (e.currentTarget.style.borderColor = "#228be6")}
          onDragLeave={(e) => (e.currentTarget.style.borderColor = "#ced4da")}
        >
          <Group justify="center">
            <BiImageAdd size={50} color="#228be6" />
            <div>
              <Text size="lg" inline>
                Arrastra las imágenes del servicio aquí o haz clic para cargar
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Solo se permiten archivos de imagen (jpeg, png, etc.)
              </Text>
            </div>
          </Group>
        </Dropzone>
        <div>
          {imageFiles.length > 0 && (
            <Flex wrap="wrap" gap="sm">
              {imageFiles.map((file, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <Image
                    src={
                      typeof file === "string"
                        ? file
                        : URL.createObjectURL(file)
                    }
                    alt={`Imagen ${index + 1}`}
                    width={80}
                    height={80}
                    radius="sm"
                  />
                  <ActionIcon
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                    variant="white"
                    radius="lg"
                    size="sm"
                    color="red"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <BiSolidXCircle />
                  </ActionIcon>
                </div>
              ))}
            </Flex>
          )}
        </div>
        <Button onClick={handleSave}>
          {service ? "Guardar Cambios" : "Agregar Servicio"}
        </Button>
      </Stack>
    </Modal>
  );
};

export default ModalCreateEdit;
