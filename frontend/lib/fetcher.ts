type ResponseType = "json" | "text" | "blob";

type FetcherOptions = RequestInit & {
  responseType?: ResponseType;
};

export async function fetcherAdmin<T = any>(
  url: string,
  options: FetcherOptions = {},
) {
  const { responseType = "json", ...requestInit } = options;

  const config: RequestInit = {
    ...requestInit,
    credentials: "include",
    headers: {
      ...requestInit.headers,
    },
  };

  const fullUrl = process.env.NEXT_PUBLIC_API_URL + url;

  let response = await fetch(fullUrl, config);

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      response = await fetch(fullUrl, config);
    } else {
      window.location.href = "/admin/signin";
      throw new Error("Session expired");
    }
  }

  if (!response.ok) {
    // помилка часто приходить JSON-ом, але може бути і text
    let message: any = `API Error: ${response.status}`;
    const ct = response.headers.get("content-type") || "";

    try {
      if (ct.includes("application/json")) {
        const data = await response.json();
        const m = data?.message;
        if (Array.isArray(m)) message = m;
        else if (typeof m === "string") message = m;
      } else {
        const text = await response.text();
        if (text) message = text;
      }
    } catch {}

    throw new Error(message);
  }

  // успішна відповідь
  if (responseType === "blob") return (await response.blob()) as any as T;
  if (responseType === "text") return (await response.text()) as any as T;

  // json за замовчуванням, але підстрахуємось якщо раптом прилетів не json
  const ct = response.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return (await response.text()) as any as T;
  }

  return (await response.json()) as T;
}

export async function fetcherUser(url: string, options: RequestInit = {}) {
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
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}
