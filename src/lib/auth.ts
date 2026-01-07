// This ensures the secret is absolutely identical across both Node.js (API) and Edge (Middleware) runtimes.
const SECRET_VALUE = process.env.JWT_SECRET || 'agribid-secure-static-key-2026-v1';
export const JWT_SECRET = new TextEncoder().encode(SECRET_VALUE);
