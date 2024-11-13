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
import { createSubscription } from "./services/subscriptionService";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { userId, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const organizationLoading = useSelector(
    (state: RootState) => state.organization.loading
  );
  const loading = useSelector((state: RootState) => state.organization.loading);
  const [opened, { toggle, close }] = useDisclosure(false);

  useEffect(() => {
    const organizationId = import.meta.env.VITE_ORGANIZATION_ID;
    dispatch(fetchOrganization(organizationId));
  }, [dispatch]);

  useAuthInitializer();

  useEffect(() => {
    const requestNotificationPermission = async () => {
      // Verifica si el usuario está autenticado antes de crear la suscripción
      if (isAuthenticated && userId) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Crea la suscripción
          const registration = await navigator.serviceWorker.register("/service-worker.js");
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
          });

          // Enviar la suscripción al backend
          await createSubscription({
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.toJSON().keys?.p256dh ?? '',
              auth: subscription.toJSON().keys?.auth ?? '',
            },
            userId,
          });
        }
      }
    };

    requestNotificationPermission();
  }, [isAuthenticated, userId]);

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
