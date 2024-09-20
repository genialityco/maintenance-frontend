import { AppShell, Burger, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import NavbarLinks from "./layouts/NavbarLinks";
import generalRoutes from "./routes/generalRoutes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";

function App() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, role]);

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
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              color="white"
            />
            <Header />
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar p="md" bg="#1A202C">
          <NavbarLinks isAdmin={isAdmin} closeNavbar={close} />
        </AppShell.Navbar>
        <AppShell.Main style={{ height: "100vh", overflow: "auto" }} bg="#1A202C">
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
