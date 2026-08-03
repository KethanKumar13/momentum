import { ThemeProvider } from "./theme";
import { AppRouter } from "./router/AppRouter";

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}