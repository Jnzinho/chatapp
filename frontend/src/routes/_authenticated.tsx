import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { queryClient } from "#/lib/query-client";
import { AUTH_QUERY_KEY } from "#/hooks/use-auth";
import { api } from "#/lib/api";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: () => api.get("/auth/me"),
      });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
