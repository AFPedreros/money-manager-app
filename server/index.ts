import { serve } from "@hono/node-server";
import { handle } from "hono/vercel";

import app from "./app";

export const runtime = "edge";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on port ${port}`);

export default handle(app);
