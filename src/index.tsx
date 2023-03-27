import React from "react";
import axios, { AxiosError } from "axios";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";

// add auth token
const authToken = localStorage.getItem("authorization_token");
if (authToken) {
  axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;
}

// alert failed requests
axios.interceptors.response.use(
  (successResponse) => successResponse,
  (error: AxiosError) => {
    if (!error.response || error.response.status >= 400) {
      alert(error.message);
    }
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

import("./mocks/browser").then(({ worker }) => {
  worker.start({ onUnhandledRequest: "bypass" });
});

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
