import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

const collection = "videos";

export async function GET() {
  try {
    const snapshot = await db.collection(collection).get();
    const videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await verifyAuth();

    const { type, videos } = await req.json();

    // Use `type` as the document ID for easy lookup
    await db.collection(collection).doc(type).set({ type, videos });

    return NextResponse.json({ message: "done" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PATCH(req) {
  try {
    await verifyAuth();

    const { type, videos } = await req.json();

    // Update (or create) the document using `type` as ID
    await db.collection(collection).doc(type).set({ type, videos }, { merge: true });

    return NextResponse.json({ message: "done" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}