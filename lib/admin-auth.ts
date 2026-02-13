import { auth } from "@/lib/auth";

type AuthFailureReason = "unauthenticated" | "forbidden";

type AdminAuthResult =
    | {
          authorized: true;
          session: Awaited<ReturnType<typeof auth.api.getSession>>;
      }
    | {
          authorized: false;
          reason: AuthFailureReason;
      };

function getAdminEmailAllowList(): string[] {
    const raw = process.env.ADMIN_EMAILS ?? "";
    return raw
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

function isAdminEmail(email?: string | null): boolean {
    const allowList = getAdminEmailAllowList();
    if (allowList.length === 0) {
        // If no allow-list is configured, any authenticated user can access admin routes.
        return true;
    }

    if (!email) {
        return false;
    }

    return allowList.includes(email.toLowerCase());
}

export async function authorizeAdminRequest(requestHeaders: Headers): Promise<AdminAuthResult> {
    const session = await auth.api.getSession({
        headers: requestHeaders,
    });

    if (!session?.user) {
        return { authorized: false, reason: "unauthenticated" };
    }

    if (!isAdminEmail(session.user.email)) {
        return { authorized: false, reason: "forbidden" };
    }

    return { authorized: true, session };
}
