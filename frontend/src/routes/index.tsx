import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "#/lib/query-client";
import { AUTH_QUERY_KEY } from "#/hooks/use-auth";
import { api } from "#/lib/api";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: () => api.get("/auth/me"),
      });
      throw redirect({ to: "/chat" });
    } catch (e) {
      if (e instanceof Error && e.name === "ApiError") {
        throw redirect({ to: "/login" });
      }
      throw e;
    }
  },
});
