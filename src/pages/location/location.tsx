import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Text, Title, Container, Stack, Center } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getOrganizationById } from "../../services/organizationService";
import CustomLoader from "../../components/customLoader/CustomLoader";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 6.2442, lng: -75.5812 };

const Location: React.FC = () => {
  // Obtener el `id` de la organización desde Redux
  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );

  // Estados para la información de la organización
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState<string>("");

  // Efecto para cargar la información de la organización
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!organization?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await getOrganizationById(organization._id);
        if (response) {
          // Configura la ubicación y dirección desde la respuesta
          setLocation(response.location);
          setAddress(response.address || "Dirección no disponible");
        }
      } catch (error) {
        console.error("Error al cargar la organización:", error);
        setAddress("No se pudo cargar la dirección");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [organization]);

  if (loading) return <CustomLoader />;

  return (
    <Container>
      <Stack>
        <Title order={3}>Ubicación</Title>
        <Text>Dirección: {address}</Text>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location || defaultCenter}
          zoom={15}
        >
          {/* Marcador en la ubicación */}
          {location && <Marker position={location} />}
        </GoogleMap>
        {!location && (
          <Center>
            <Text c="red">No se pudo cargar la ubicación</Text>
          </Center>
        )}
      </Stack>
    </Container>
  );
};

export default Location;
