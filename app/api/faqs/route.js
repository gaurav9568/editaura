import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

const collection = "faqs";

export async function GET() {
  try {
    const snapshot = await db.collection(collection).get();
    const faqs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ faqs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await verifyAuth();

    const { question, answer } = await req.json();
    const docRef = await db.collection(collection).add({ question, answer });
    const faq = { id: docRef.id, question, answer };

    return NextResponse.json({ faq, message: "done" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(req) {
  try {
    await verifyAuth();

    const { id } = await req.json();
    await db.collection(collection).doc(id).delete();

    return NextResponse.json({ message: "done" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}