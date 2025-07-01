import { Excalidraw } from "@excalidraw/excalidraw";
import { Box, LoadingOverlay, Text } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getWhiteboardData, saveWhiteboardData } from "../api/api";

const Whiteboard = () => {
  const { id } = useParams<{ id: string }>();
  // Using `any` to avoid type import issues with Excalidraw's API ref
  const excalidrawRef = useRef<any>(null);
  const debounceTimer = useRef<number | null>(null);

  // Using `any` to avoid type import issues with InitialDataState
  const [initialData, setInitialData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No whiteboard ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWhiteboardData(id);
        // Ensure that even if data is null/undefined, we provide a valid structure
        setInitialData({
          elements: data?.elements || [],
          appState: data?.appState || {},
        });
      } catch (err: unknown) {
        setError(
          "Failed to load whiteboard data. Please try refreshing the page.",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Using `any` to avoid type import issues with elements and appState
  const saveData = useCallback(
    (elements: any, appState: any) => {
      if (!id || isLoading) return; // Do not save while loading initial data

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = window.setTimeout(() => {
        const dataToSave = {
          elements: elements,
          appState: {
            // Only save view-related appState, not transient UI state
            viewBackgroundColor: appState.viewBackgroundColor,
            gridSize: appState.gridSize,
            zoom: appState.zoom,
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
          },
        };

        // Fire-and-forget save operation
        saveWhiteboardData(id, dataToSave).catch((err: unknown) => {
          // In a real app, you might want to show a non-intrusive toast notification
          console.error("Failed to save whiteboard data:", err);
        });
      }, 500); // 500ms debounce delay
    },
    [id, isLoading],
  );

  if (error && !isLoading) {
    return (
      <Box p="md">
        <Text c="red">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box w="100%" h="90vh" pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {/* Render Excalidraw only after initial data is fetched to prevent flicker */}
      {!isLoading && initialData && (
        <Excalidraw
          // Use the excalidrawAPI prop to get the API instance, as `ref` is not supported
          excalidrawAPI={(api) => (excalidrawRef.current = api)}
          initialData={initialData}
          theme="dark"
          UIOptions={{
            canvasActions: {
              loadScene: false,
              export: false,
              saveToActiveFile: false,
            },
          }}
          onChange={saveData}
        />
      )}
    </Box>
  );
};

export default Whiteboard;
