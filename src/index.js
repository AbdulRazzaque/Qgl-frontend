import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, Persister } from "./components/redux/Store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  palette: {
    primary: { main: "#5a1e96" },
    secondary: { main: "#fc0303" },
    tertiary: { main: "#b66dff" },
  },
  components: {
    MuiButton: { styleOverrides: { root: { "&:focus": { outline: "none" } } } },
    MuiIconButton: { styleOverrides: { root: { "&:focus": { outline: "none" } } } },
    MuiTab: { styleOverrides: { root: { "&:focus": { outline: "none" } } } },
    MuiPagination: { styleOverrides: { root: { "&:focus": { outline: "none" } } } },
    MuiPaginationItem: { styleOverrides: { root: { "&:focus": { outline: "none" } } } },
  },
});

const queryClient = new QueryClient();
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={Persister}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
