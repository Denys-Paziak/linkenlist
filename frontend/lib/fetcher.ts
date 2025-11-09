export async function fetcher(url: string, options: RequestInit = {}) {
  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  };

  const fullUrl = process.env.NEXT_PUBLIC_API_URL + url;

  let response = await fetch(fullUrl, config);

  if (response.status === 401) {
    const refreshed = await refreshToken();

    if (refreshed) {
      response = await fetch(fullUrl, config);
    } else {
      //window.location.href = "/admin/signin";
      throw new Error("Session expired");
    }
  }

  if (!response.ok) {
    let message = `API Error: ${response.status}`;
    try {
      const data = await response.json();

      if (data?.message) {
        if (Array.isArray(data.message)) {
          message = data.message[0];
        } else if (typeof data.message === "string") {
          message = data.message;
        }
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

async function refreshToken() {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/auth/refresh",
      {
        method: "POST",
        credentials: "include",
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
