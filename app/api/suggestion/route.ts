export async function GET(request: Request) {
  // Connect to our Microsoft Azure Function endpoint
  const response = await fetch(
    // https://stackoverflow.com/questions/74410687/unable-to-call-http-localhost-azure-function-from-https-localhost-node-app
    // 在本地測試記得要把 localhost 改成 127.0.0.1 不然會 fetch failed
    // localhost 是主機名，127.0.0.1 本地電腦的 IPv4 地址，通常在本地的 hosts 文件會將 localhost 主機名對應到 127.0.0.1，但有時候不一定是，所以在測試的時候還是用 127.0.0.1 會比較精準不容易出錯
    "https://ai-image-generator-youtube-app-andygithub9.azurewebsites.net/api/getchatgptsuggestion",
    {
      cache: "no-store",
    }
  );

  // https://developer.mozilla.org/en-US/docs/Web/API/Response/text
  const textData = await response.text();

  return new Response(JSON.stringify(textData.trim()), {
    status: 200,
  });
}
