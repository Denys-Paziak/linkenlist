import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initPromise: Promise<void> | null = null;

function ensureConfigured() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");

    setOptions({
      key,
      v: "weekly",
      language: "en",
      region: "US",
    });
  })();

  return initPromise;
}

export async function loadGoogleMaps() {
  await ensureConfigured();

  const mapsLib = (await importLibrary("maps")) as google.maps.MapsLibrary;
  await importLibrary("marker");
  await importLibrary("places");

  return mapsLib;
}
