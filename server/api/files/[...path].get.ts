import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import mime from "mime";

export default defineEventHandler(async (event) => {
  const root = String(useRuntimeConfig().phpFileRoot || "");
  const path = String(event.context.params?._ ?? event.context.params?.path ?? "")
    .replace(/\.\./g, "")
    .replace(/^\/+/, "");
  const absolutePath = join(root, "files", path);

  if (!root || !existsSync(absolutePath)) {
    throw createError({ statusCode: 404, statusMessage: "Soubor nebyl nalezen" });
  }

  setResponseHeader(event, "Content-Type", mime.getType(path) || "application/octet-stream");
  setResponseHeader(event, "Cache-Control", "private, max-age=3600");
  return new Uint8Array(await readFile(absolutePath));
});
