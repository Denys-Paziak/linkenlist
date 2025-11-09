"use client";

import { useEffect } from "react";
import { useAdminContext } from "../../contexts/admin-context";

export function HasUnsavedChanges() {
  const { hasUnsavedChanges } = useAdminContext();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (hasUnsavedChanges) {
    return (
      <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
        Unsaved changes
      </span>
    );
  } else {
    return <></>;
  }
}
