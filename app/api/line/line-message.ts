import { IProfile } from "@/models/profile";
import { messagingApi } from "@line/bot-sdk";

import userRepository from "@/repository/user_repository";

export async function lineMessage(user: IProfile, event: any, client: any) {
  const text = event.message.text;
  const twoChar = text.trimEnd().slice(-2);
  const userId = user.id;
  const userName = user.full_name;
  //const role = user.role;
}

export async function lineRegister(lineId: string, event: any, client: any) {
  const text = event.message.text;
  const twoChar = text.trimEnd().slice(-2);
  const repo = new userRepository();
  const email = getName(text);
  if (email) {
    const { data, error } = await repo.register(email, lineId);
    if (!error) {
      return reply(client, event, `คุณ ${data?.full_name} ลงทะเบียนเรียบร้อย`);
    } else {
      return reply(client, event, `email ไม่ถูกต้องกรุณาลงทะเบียนใหม่ ใหม่`);
    }
  } else {
    return reply(client, event, "กรุณาลงทะเบียนด้วย email xxxx@xxx.com ทบ");
  }
}

export function reply(client: any, event: any, text: any) {
  return client.replyMessage(event.replyToken, [
    {
      type: "text",
      text: text,
    },
  ]);
}


export async function pushFlex(client: messagingApi.MessagingApiClient,event:any, title: string, url: string) {
  return await client.pushMessage({
    to: event.source.userId,
    messages: [
      {
        type: "flex",
        altText: "This is a Flex message",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: title,
                weight: "bold",
                size: "xl",
              },
              {
                type: "text",
                text: "กดปุ่มเพื่อลงทะเบียนสมาชิก",
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                action: {
                  type: "uri",
                  label: "เปิดโปรแกรม",
                  uri: url,
                },
              },
            ],
          },
        },
      },
    ],
  });
}


export async function replyFlex(client: messagingApi.MessagingApiClient,event:any, title: string, url: string) {
  return await client.replyMessage({
    replyToken: event.source.us,
    messages: [
      {
        type: "flex",
        altText: "This is a Flex message",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: title,
                weight: "bold",
                size: "xl",
              },
              {
                type: "text",
                text: "กดปุ่มเพื่อลงทะเบียนสมาชิก",
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                action: {
                  type: "uri",
                  label: "เปิดโปรแกรม",
                  uri: url,
                },
              },
            ],
          },
        },
      },
    ],
  });
}

export function getName(text: string) {
  if (text.includes("\n")) {
    return null;
  } else {
    const name = text.replace("ทบ", "").trim();

    return name;
  }

}