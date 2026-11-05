import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

    const body = await req.json();
    const { type, videos, title, label, desc, icon, defaultType } = body;

    if (!type || typeof type !== "string" || !type.trim()) {
      return NextResponse.json({ error: "Folder type/key is required" }, { status: 400 });
    }

    const cleanType = type.trim().toLowerCase();
    const docData = {
      type: cleanType,
      title: (title || label || cleanType).trim(),
      label: (label || title || cleanType).trim(),
      desc: (desc || "").trim(),
      icon: (icon || "📁").trim(),
      defaultType: defaultType === "long" ? "long" : "short",
      videos: Array.isArray(videos) ? videos : [],
      updatedAt: new Date().toISOString(),
    };

    // Use `cleanType` as document ID
    await db.collection(collection).doc(cleanType).set(docData, { merge: true });

    return NextResponse.json({ message: "Folder created", folder: { id: cleanType, ...docData } });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" || error.message === "Invalid or expired token" ? 401 : 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await verifyAuth();

    const body = await req.json();
    const { type, videos, title, label, desc, icon, defaultType } = body;

    if (!type || typeof type !== "string" || !type.trim()) {
      return NextResponse.json({ error: "Folder type is required" }, { status: 400 });
    }

    const cleanType = type.trim().toLowerCase();
    const updateData = {
      type: cleanType,
      updatedAt: new Date().toISOString(),
    };

    if (videos !== undefined) updateData.videos = videos;
    if (title !== undefined) updateData.title = title.trim();
    if (label !== undefined) updateData.label = label.trim();
    if (desc !== undefined) updateData.desc = desc.trim();
    if (icon !== undefined) updateData.icon = icon.trim();
    if (defaultType !== undefined) updateData.defaultType = defaultType === "long" ? "long" : "short";

    await db.collection(collection).doc(cleanType).set(updateData, { merge: true });

    return NextResponse.json({ message: "done", folder: updateData });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" || error.message === "Invalid or expired token" ? 401 : 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await verifyAuth();

    const body = await req.json();
    const { type } = body;

    if (!type || typeof type !== "string" || !type.trim()) {
      return NextResponse.json({ error: "Folder type is required" }, { status: 400 });
    }

    const cleanType = type.trim().toLowerCase();
    await db.collection(collection).doc(cleanType).delete();

    return NextResponse.json({ message: "Folder deleted", type: cleanType });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" || error.message === "Invalid or expired token" ? 401 : 500 }
    );
  }
}