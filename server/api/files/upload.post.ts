export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const filePart = parts?.find((part) => part.name === "file" && part.data);
  if (!filePart?.data) {
    throw createError({ statusCode: 422, statusMessage: "Chybí soubor" });
  }

  const session = await getUserSession(event).catch(() => null);
  const token = (session as any)?.token || (session as any)?.tokens?.access_token;
  const frontendHost = String(useRuntimeConfig().public.frontendHost || "");
  const host = frontendHost ? new URL(frontendHost).hostname : "";
  const form = new FormData();
  form.append(
    "file",
    new Blob([filePart.data], { type: filePart.type || "application/octet-stream" }),
    filePart.filename || "upload.bin",
  );

  return await $fetch(`${String(useRuntimeConfig().phpApiBaseUrl)}/files/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(host ? { "X-Forwarded-Host": host } : {}),
    },
    body: form,
  });
});
