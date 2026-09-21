import { createRequestHandler } from "react-router";
import { handleApi } from "./api";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    if (new URL(request.url).pathname.startsWith("/api/"))
      return handleApi(request, env, ctx);
    return requestHandler(request);
  },
} satisfies ExportedHandler<Env>;
