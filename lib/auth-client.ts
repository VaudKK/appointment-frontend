import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [jwtClient(),inferAdditionalFields({
      user: {
        organizationId: {
          type: "string",
          required: true,
        },
        organizationSlug: {
          type: "string",
          required: true,
        }
      }
    })],
  })
