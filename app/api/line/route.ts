
import { NextRequest, NextResponse } from "next/server";
import * as line from '@line/bot-sdk';
import {lineHandleEvents} from '@/app/api/line/linebot';


/*
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.LINE_CHANNEL_SECRET!,
  };


const client = new line.Client(config); */

export async function GET(req: NextRequest) {
  try {
    // สำหรับทดสอบว่า env ใช้ได้ไหม
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    console.log("LINE_TOKEN =", token);

    // ดึง query มาดู (ถ้าต้องการ)
    const { searchParams } = new URL(req.url);
    const echo = searchParams.get('echo') || 'Hello from GET';

    return NextResponse.json({
      ok: true,
      tokenSet: !!token,
      echo,
    });
  } catch (error) {
    console.error('GET test error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {

    const body = await req.text(); // Get raw request body as text
    

    // Parse the events from the body
    const parsedBody = JSON.parse(body);
    const events = parsedBody.events;

    // Handle events asynchronously
    const results = await Promise.all(
      events.map(async (event: any) => {
      
        lineHandleEvents(event);
       /* if (event.type === 'message' && event.message.type === 'text') {
          // Reply to the user
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `You said: ${event.message.text}`,
          });
        }*/
      })
    );

     console.log(process.env.LINE_CHANNEL_ACCESS_TOKEN)

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error handling LINE events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



