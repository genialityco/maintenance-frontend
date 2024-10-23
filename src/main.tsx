import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createTheme, MantineProvider } from "@mantine/core";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";

const theme = createTheme({
  fontFamily: "Playfair Display, serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: "Playfair Display, serif" },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
