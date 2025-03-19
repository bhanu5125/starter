// Import Dependencies
import { Outlet } from "react-router";
import { useState } from "react";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { useIsomorphicEffect } from "hooks";

// ----------------------------------------------------------------------

const dataset = document?.body?.dataset;

export function AppLayout() {
  const { themeLayout } = useThemeContext();
  const [isMounted, setIsMounted] = useState(false);

  useIsomorphicEffect(() => {
    dataset.layout = "main-layout";

    // Fix flicker layout
    queueMicrotask(() => {
      dataset.layout = "main-layout";
    });

    return () => {
      if (dataset) {
        dataset.layout = themeLayout;
      }
    };
  }, [themeLayout]);

  useIsomorphicEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <Outlet />;
}
