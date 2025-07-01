import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Modal,
  TextInput,
  SimpleGrid,
  Card,
  Group,
  Loader,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import {
  createWhiteboard,
  getAllWhiteboards,
  type Whiteboard,
} from "../api/api";

const Dashboard = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
    },
  });

  const fetchWhiteboards = async () => {
    try {
      setLoading(true);
      const data = await getAllWhiteboards();
      setWhiteboards(data);
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch whiteboards. Make sure the backend server is running.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const handleCreateWhiteboard = async (values: { title: string }) => {
    try {
      await createWhiteboard(values.title);
      form.reset();
      close();
      // Refetch the list to include the new whiteboard
      await fetchWhiteboards();
    } catch (err) {
      // In a real app, you'd show a more specific error to the user
      console.error("Failed to create whiteboard:", err);
      setError("Failed to create the whiteboard.");
    }
  };

  const handleOpenWhiteboard = (whiteboardId: string) => {
    navigate(`/whiteboard/${whiteboardId}`);
  };

  const filteredWhiteboards = whiteboards.filter((wb) =>
    wb.title.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create a new whiteboard">
        <form onSubmit={form.onSubmit(handleCreateWhiteboard)}>
          <Stack>
            <TextInput
              withAsterisk
              label="Whiteboard Title"
              placeholder="e.g., Q3 Brainstorming"
              {...form.getInputProps("title")}
            />
            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </Modal>

      <Container>
        <Group justify="space-between" mb="xl">
          <Title order={1}>Dashboard</Title>
          <Button onClick={open}>Create New Whiteboard</Button>
        </Group>

        <TextInput
          placeholder="Filter by title..."
          value={filter}
          onChange={(event) => setFilter(event.currentTarget.value)}
          mb="xl"
        />

        {loading && <Loader />}

        {error && (
          <Alert
            title="Error"
            color="red"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {filteredWhiteboards.length === 0 ? (
              <Text c="dimmed">
                {filter
                  ? "No whiteboards match your filter."
                  : "No whiteboards found. Create one to get started!"}
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                {filteredWhiteboards.map((wb) => (
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    key={wb.id}
                  >
                    <Text fw={500}>{wb.title}</Text>
                    <Text size="sm" c="dimmed" mt="xs">
                      Created: {new Date(wb.createdAt).toLocaleDateString()}
                    </Text>
                    <Button
                      variant="light"
                      color="blue"
                      fullWidth
                      mt="md"
                      radius="md"
                      onClick={() => handleOpenWhiteboard(wb.id)}
                    >
                      Open Whiteboard
                    </Button>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
