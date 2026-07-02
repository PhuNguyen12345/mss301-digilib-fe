// PKCE utilities and OAuth2 helpers

/**
 * Generates a random alphanumeric string for the code verifier and state.
 */
export function generateRandomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  const randomValues = new Uint8Array(length)
  window.crypto.getRandomValues(randomValues)
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length]
  }
  return result
}

/**
 * Generates a SHA-256 base64url-encoded code challenge from a verifier.
 */
export async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  
  // Convert ArrayBuffer to base64url string
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export const OAUTH_CONFIG = {
  clientId: 'digilib-auth',
  keycloakUrl: 'https://keycloak.huynq.space/realms/digilib-realm/protocol/openid-connect',
  redirectUri: window.location.origin + '/oauth2/callback',
}
