import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = await request.json(); // res now contains body
  const prompt = res.prompt;

  const response = await fetch(
    "https://ai-image-generator-youtube-app-andygithub9.azurewebsites.net/api/generateimage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      // 記得這邊不要 cache, 如果 cache 的話, 前端傳一樣的 request 過來, 這邊會直接回應 cache 裡的值, 不會執行 fetch。 但是我們要的是 fetch http://127.0.0.1:7071/api/generateImage 這支 api 去觸發 azure function 並拿到新的圖片, 所以這邊要選擇不要 cache , 否則他會一直回應 cache 中的值, 不會 fetch http://127.0.0.1:7071/api/generateImage
      cache: "no-store",
    }
  );

  const textData = await response.text();

  return NextResponse.json(textData);
}
