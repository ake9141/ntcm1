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

   const imagePath = path.join(process.cwd(), "public/images", "richmenu.png");
   const imageBuffer = fs.readFileSync(imagePath);
  


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

    console.log("Rich Menu created with ID:", richMenuId);

    // STEP 2: Upload Image
    const imagePath = path.join(process.cwd(), "public/images", "richmenu.png");
    console.log("Image path:", imagePath);
    const imageBuffer = fs.readFileSync(imagePath);
    console.log("Image buffer size:", imageBuffer.length); // ขนาดไฟล์
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
      console.log(err);
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



export async function DELETE() {
  try {
    // STEP 1: Get all rich menus
    const listRes = await fetch(`${LINE_API_BASE}/richmenu/list`, {
      method: "GET",
      headers,
    });

    const listJson = await listRes.json();
    if (!listRes.ok) throw listJson;

    const { richmenus } = listJson;
    if (!richmenus || richmenus.length === 0) {
      return NextResponse.json({ message: "No richmenus found." });
    }

    const deleted = [];

    // STEP 2: Loop and delete each rich menu
    for (const menu of richmenus) {
      const res = await fetch(`${LINE_API_BASE}/richmenu/${menu.richMenuId}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        deleted.push(menu.richMenuId);
      } else {
        const err = await res.text();
        console.error(`Failed to delete ${menu.richMenuId}:`, err);
      }
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error("Error deleting richmenus:", error);
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }
}