import { ThemeProvider } from "./theme";
import { AppRouter } from "./router/AppRouter";
import { ToastProvider } from "./components/ui/Toast";
import { TooltipProvider } from "./components/ui/Tooltip";

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider />
        <AppRouter />
      </TooltipProvider>
    </ThemeProvider>
  );
}