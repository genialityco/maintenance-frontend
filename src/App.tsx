import { AppShell, Burger, Center, Flex, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import NavbarLinks from "./layouts/NavbarLinks";
import generalRoutes from "./routes/generalRoutes";
import useAuthInitializer from "./hooks/useAuthInitializer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./app/store";
import { useEffect } from "react";
import { fetchOrganization } from "./features/organization/sliceOrganization";
import { CustomLoader } from "./components/customLoader/CustomLoader";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const organizationLoading = useSelector(
    (state: RootState) => state.organization.loading
  );
  const loading = useSelector((state: RootState) => state.organization.loading);
  const [opened, { toggle, close }] = useDisclosure(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/custom-sw.js')
        .then((registration) => {
          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                // Recarga la página automáticamente cuando se detecta una nueva versión del SW
                console.log("Nueva versión del Service Worker disponible. Recargando...");
                window.location.reload();
              };
            }
            };
          };
        })
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error);
        });
    }
    
  } , []);

  useEffect(() => {
    const organizationId = import.meta.env.VITE_ORGANIZATION_ID;
    dispatch(fetchOrganization(organizationId));
  }, [dispatch]);

  useAuthInitializer();

  if (loading || organizationLoading) {
    return (
      <Center style={{ height: "100vh", flexDirection: "column" }}>
        <Stack align="center" m="md">
          <CustomLoader />
          <Text size="xl" fw={700} c="dark">
            Cargando...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Router>
      <Analytics />

      <AppShell
        padding="md"
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: !opened, mobile: !opened },
        }}
        header={{ height: 50 }}
      >
        <AppShell.Header bg="#1A202C">
          <Flex align="center" px="sm">
            <Burger opened={opened} onClick={toggle} size="sm" color="white" />
            <Header />
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar p="md" bg="#1A202C">
          <NavbarLinks closeNavbar={close} />
        </AppShell.Navbar>
        <AppShell.Main style={{ height: "100vh", overflow: "auto" }}>
          <Routes>
            {generalRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </AppShell.Main>

        <Footer />
      </AppShell>
    </Router>
  );
}

export default App;
