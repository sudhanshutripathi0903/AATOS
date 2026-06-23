import { Route, Switch } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      {/* Root path loads the Hacker Terminal */}
      <Route path="/" component={Home} />
      {/* Fallback for any other route */}
      <Route component={Home} />
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router />
    </ThemeProvider>
  );
}