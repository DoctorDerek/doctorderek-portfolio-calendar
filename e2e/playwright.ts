import { test as base, expect } from "@playwright/test"

const trustedOidcHeader = "x-vercel-trusted-oidc-idp-token"

const requestFreshGitHubOidcToken = async () => {
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN

  if (!requestUrl || !requestToken) {
    return process.env.PLAYWRIGHT_VERCEL_TRUSTED_OIDC_TOKEN
  }

  const response = await fetch(requestUrl, {
    headers: { authorization: `Bearer ${requestToken}` },
  })

  if (!response.ok) {
    throw new Error(
      `GitHub OIDC token request failed with status ${response.status}`,
    )
  }

  const responseBody: unknown = await response.json()
  if (
    typeof responseBody !== "object" ||
    responseBody === null ||
    !("value" in responseBody) ||
    typeof responseBody.value !== "string"
  ) {
    throw new Error("GitHub OIDC token response is missing its token value")
  }

  return responseBody.value
}

export const test = base.extend<{ authenticateProtectedPreview: void }>({
  authenticateProtectedPreview: [
    async ({ context }, use) => {
      const trustedOidcToken = await requestFreshGitHubOidcToken()

      if (trustedOidcToken) {
        await context.setExtraHTTPHeaders({
          [trustedOidcHeader]: trustedOidcToken,
        })
      }

      await use()
    },
    { auto: true },
  ],
})

export { expect }
export type { Page } from "@playwright/test"
