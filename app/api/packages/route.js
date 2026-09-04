import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

const collection = "packages";

export async function GET() {
  try {
    const snapshot = await db.collection(collection).get();
    const packages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ packages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await verifyAuth();

    const body = await req.json();
    const docRef = await db.collection(collection).add(body);
    const pkg = { id: docRef.id, ...body };

    return NextResponse.json({ message: "Package created", pkg });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(req) {
  try {
    await verifyAuth();

    const { id } = await req.json();
    await db.collection(collection).doc(id).delete();

    return NextResponse.json({ message: "Package deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
