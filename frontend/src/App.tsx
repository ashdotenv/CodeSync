import { Outlet } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
