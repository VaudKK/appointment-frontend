export function redirectToAdminSignIn() {
    if (typeof window !== "undefined") {
        window.location.href = "/admin/me/signin";
    }
}

export function enforceAdminAuthOrRedirect(response: Response) {
    if (response.status === 401 || response.status === 403) {
        redirectToAdminSignIn();
        throw new Error("Unauthorized");
    }
}
