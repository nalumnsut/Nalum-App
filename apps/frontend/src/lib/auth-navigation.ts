import type { User } from "@/lib/api";

export type AuthRoute = "/sign-in" | "/verify" | "/profile" | "/directory";

export function getAuthRoute(user: User | null): AuthRoute {
  if (!user) return "/sign-in";
  if (!user.emailVerified) return "/verify";
  if (!user.profileCompleted) return "/profile";
  return "/directory";
}
