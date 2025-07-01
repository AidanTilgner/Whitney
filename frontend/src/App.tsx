import "@mantine/core/styles.css";
import "@excalidraw/excalidraw/index.css";
import { MantineProvider, AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Whiteboard from "./pages/Whiteboard";

function AppLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const location = useLocation();
  const isFullscreen =
    new URLSearchParams(location.search).get("fullscreen") === "true" &&
    location.pathname.startsWith("/whiteboard/");

  const mainContent = (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/whiteboard/:id" element={<Whiteboard />} />
    </Routes>
  );

  if (isFullscreen) {
    return mainContent;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Text
            size="xl"
            fw={700}
            component={Link}
            to="/"
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Whitney
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text>Navigation</Text>
        <Text
          component={Link}
          to="/"
          style={{
            display: "block",
            padding: "8px 16px",
            marginTop: "16px",
            borderRadius: "4px",
            textDecoration: "none",
            backgroundColor:
              location.pathname === "/"
                ? "var(--mantine-primary-color-filled)"
                : "transparent",
            color: location.pathname === "/" ? "white" : "inherit",
          }}
        >
          Dashboard
        </Text>
      </AppShell.Navbar>

      <AppShell.Main>{mainContent}</AppShell.Main>
    </AppShell>
  );
}

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Router>
        <AppLayout />
      </Router>
    </MantineProvider>
  );
}

export default App;
