import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.IMAGE_UPLOAD_API_KEY || process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: { message: "Upload API key not configured" } }, { status: 500 });
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof File)) {
      return NextResponse.json({ success: false, error: { message: "No image file provided" } }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString("base64");

    const params = new URLSearchParams();
    params.append("key", apiKey);
    params.append("image", base64);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: params,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json({ success: false, error: { message: "Image upload failed" } }, { status: 500 });
  }
}
