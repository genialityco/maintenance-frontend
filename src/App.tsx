import { Container, Flex } from "@mantine/core";
import "./App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import LoyaltyPlan from "./components/LoyaltyPlan";
import InstallPrompt from "./components/InstallPrompt";

function App() {
  return (
    <Flex direction="column" mih="100vh" miw="100vw">
      <InstallPrompt />
      <Header />

      {/* Main Content */}
      <Container my="auto">
        <LoyaltyPlan />
      </Container>

      <Footer />
    </Flex>
  );
}

export default App;
