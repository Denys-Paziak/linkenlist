export async function login(body: { email: string; password: string }) {
  const response = await fetch(
    process.env.API_INTERNAL_URL + "/admin/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json();

  return data;
}
