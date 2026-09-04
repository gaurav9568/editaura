import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await verifyAuth();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file to a base64 data URI for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "editaura/thumbnails",
      resource_type: "image",
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      message: "Upload successful",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
