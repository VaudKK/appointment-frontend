import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"

const baseUrl = process.env.BETTER_AUTH_URL

export const authClient = createAuthClient({
    baseURL: baseUrl,
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
