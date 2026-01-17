"use client";

import { useEffect, useState } from "react";
import { ButtonSubmitStatus, renderStatusIcon } from "../../../../components/ui/button-submit";

export function LogoutButton() {
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");

  const logout = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("loading");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/admin/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setStatus("success");
      window.location.href = "/";
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <button
      onClick={logout}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
    >
      {status === "error" ? "Failed to log out" : "← Log out of admin"}
      {renderStatusIcon(status)}
    </button>
  );
}
