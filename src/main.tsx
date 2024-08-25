import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createTheme, MantineProvider } from "@mantine/core";
import "./index.css";
import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';

const theme = createTheme({
  fontFamily: "Playfair Display, serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: "Playfair Display, serif" },
});

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  // </StrictMode>
);
