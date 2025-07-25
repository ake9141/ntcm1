
import { NextRequest, NextResponse } from "next/server";
import * as line from '@line/bot-sdk';
import {lineHandleEvents} from '@/app/api/line/linebot';


/*
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.LINE_CHANNEL_SECRET!,
  };


const client = new line.Client(config); */

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

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error handling LINE events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



