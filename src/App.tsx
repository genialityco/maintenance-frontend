import { Flex } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import InstallPrompt from "./components/InstallPrompt";
import generalRoutes from "./routes/generalRoutes";

function App() {
  return (
    <Router>
      <Flex direction="column" mih="100vh" miw="100vw">
        <InstallPrompt />
        <Header />

        {/* Main Content */}
        <Routes>
          {generalRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>

        <Footer />
      </Flex>
    </Router>
  );
}

export default App;
