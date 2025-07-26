// app/api/richmenu/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LINE_API_BASE = "https://api.line.me/v2/bot";
const headers = {
  Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

export async function GET() {

  const res = await fetch("https://api.line.me/v2/bot/richmenu/list", {
    method: "GET",
    headers,
  });

  const data = await res.json();

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    // STEP 1: Create Rich Menu
    const createRes = await fetch(`${LINE_API_BASE}/richmenu`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        size: { width: 2500, height: 843 },
        selected: true,
        name: "Menu1",
        chatBarText: "เปิดเมนู",
        areas: [
          {
            bounds: { x: 0, y: 0, width: 1250, height: 843 },
            action: {
              type: "uri",
              uri: "https://liff.line.me/2007818124-WopDJgx5",
            },
          },
          {
            bounds: { x: 1250, y: 0, width: 1250, height: 843 },
            action: {
              type: "message",
              text: "ติดต่อแอดมิน",
            },
          },
        ],
      }),
    });

    const createJson = await createRes.json();
    if (!createRes.ok) throw createJson;

    const richMenuId = createJson.richMenuId;

    // STEP 2: Upload Image
    const imagePath = path.join(process.cwd(), "public/images", "richmenu.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const uploadRes = await fetch(`${LINE_API_BASE}/richmenu/${richMenuId}/content`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        "Content-Type": "image/png",
      },
      body: imageBuffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      throw new Error("Image upload failed: " + err);
    }

    // STEP 3: Set as default
    const setDefaultRes = await fetch(`${LINE_API_BASE}/user/all/richmenu/${richMenuId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    });

    if (!setDefaultRes.ok) {
      const err = await setDefaultRes.text();
      throw new Error("Set default failed: " + err);
    }

    return NextResponse.json({ success: true, richMenuId });
  } catch (err: any) {
    console.error("Error creating rich menu:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}