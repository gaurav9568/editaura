import { adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST — Client sends Firebase ID token, we verify it and set a cookie
export async function POST(req) {
  try {
    const { idToken } = await req.json();

    // Verify the Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken);

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      message: "Session created",
      email: decoded.email,
    });

    response.cookies.set("token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid credentials", error: error.message },
      { status: 401 }
    );
  }
}
