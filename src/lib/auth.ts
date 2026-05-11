import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE = process.env.COOKIE_NAME || "session";

export type Session = {
  userId: string;
  username: string;
};

export async function createSession(s: Session) {
  const token = await new SignJWT(s)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return token;
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  console.log({ token });

  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Session;
  } catch {
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

// export async function throw401(
//   reason: "session-expired" | "insufficient-role" | "not-authenticated",
// ) {
//   const locale = await getLocale();
//   redirect(`/${locale}/unauthorized?reason=${reason}`);
// }

// export async function throw403(
//   reason: "insufficient-role" | "admin-only" | "suspended",
// ) {
//   const locale = await getLocale();
//   redirect(`/${locale}/forbidden?reason=${reason}`);
// }
