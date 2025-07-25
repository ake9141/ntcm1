import { messagingApi } from "@line/bot-sdk";

import { lineMessage, replyflex } from "@/app/api/line/line-message";

import userRepository from "@/repository/user_repository";
import { NextResponse } from "next/server";

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

const client = new messagingApi.MessagingApiClient(config);

//const repo = new userRepository();
async function lineHandleEvents(event: any) {
  const lineId = event.source.userId;
  const repo = new userRepository();
  //const { data, error } = await repo.findByLineId(lineId);

  if (event.type == "message") {
    const text = event.message.text;

    if (text == "/register") {
      return replyflex(
        client,
        event,
        `ลงทะเบียนสมาชิก`,
        "https://ntcm1-ake5nenes-projects.vercel.app/auth/sign-up"
      );
    }
  }

  /*
  const {data,error} = await repo.findByLineId(lineId);

  console.log("data", event.message.text);

  
  if (event.type == "message") {
    const text = event.message.text;
   // const twoChar = text.trimEnd().slice(-2);
    console.log("error", error);

    if (error) {
      return client.replyMessage(event.replyToken, [
        {
          type: "text",
          text: `error ติดต่อ admin`,
        },
      ]);

    } else {
      if (data === null) {
        if (text == "/register") {
          return replyflex(
      client,
      event,
      `ลงทะเบียนสมาชิก`,
      "https://ntcm1-ake5nenes-projects.vercel.app/auth/sign-up"
    );
          
        } else {
          return client.replyMessage(event.replyToken, [
            {
              type: "text",
              text: `กรุณาลงทะเบียนก่อน`,
            },
          ]);
        }
      } else {
        const user = data;

        if (!user?.is_neta_member) {
          return client.replyMessage(event.replyToken, [
            {
              type: "text",
              text: `คุณ ${user?.full_name ?? ''} รอการยืนยันจาก admin`,
            },
          ]);
        } else {
          
            lineMessage(user, event, client);
          
        }
      }
    }
  }*/
}

/*function lineConfig() {
  return line.middleware(config);
}*/

export { lineHandleEvents };
