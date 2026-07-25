import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The real passcode lives only in the server environment variable
// ADMIN_PASSCODE — it is never shipped to the client bundle. The admin
// login form calls this endpoint instead of comparing against a hardcoded
// string in client-side code.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    const expected = process.env.ADMIN_PASSCODE;

    if (!expected) {
      console.error("ADMIN_PASSCODE environment variable is not set.");
      return NextResponse.json(
        { error: "Server misconfigured: ADMIN_PASSCODE not set." },
        { status: 500 },
      );
    }

    if (typeof passcode !== "string" || passcode !== expected) {
      return NextResponse.json(
        { error: "Falsches Passwort / Yanlış Şifre / Incorrect Password" },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
