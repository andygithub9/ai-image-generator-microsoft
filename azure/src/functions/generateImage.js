const { app } = require("@azure/functions");
const generateSASToken = require("../../lib/generateSASToken");
const openai = require("../../lib/openai");
const axios = require("axios");
const { BlobServiceClient } = require("@azure/storage-blob");

const accountName = process.env.accountName;

const containerName = "images";

app.http("generateImage", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    const { prompt } = await request.json();

    console.log(`Prompt is ${prompt}`);

    // https://platform.openai.com/docs/guides/images/generations
    const response = await openai.createImage({
      prompt: prompt,
      n: 1, // 你要生成幾張圖片
      size: "1024x1024", // 你要的圖片解析度
    });

    // console.log("response.data.data", response.data.data);

    // download image
    // image_url 的 reponse 拿到的會是一個 blob 格式的 array buffer, 我們拿到的這個 array buffer 代表著一張 png 圖片
    image_url = response.data.data[0].url;

    // https://axios-http.com/docs/req_config
    // 這裡用 axios 是因為 fetch 不支援 arraybuffer 這種格式的 response
    // Download the image and return it as a arraybuffer
    const res = await axios.get(image_url, { responseType: "arraybuffer" });

    // get arraybuffer
    const arrayBuffer = res.data;

    // generateSASToken
    sasToken = await generateSASToken();

    /*
    | Account<br />(BlobServiceClient) | Container<br />(blobServiceClient.getContainerClient) | Blob<br />(containerClient.getBlockBlobClient) |
    | -------------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
    | [your account]                   | pictures                                              | img001.png                                     |
    |                                  |                                                       | img002.png                                     |
    |                                  | movies                                                | mov1.avi                                       |
    1. access Account
    2. access Container
    3. access Blob
     */
    // BlobServiceClient
    // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/blobserviceclient?view=azure-node-latest
    // instantiate a BlobServiceClient with a shared access signatures (SAS)
    // ---
    // BlobServiceClient class Constructors: BlobServiceClient(string, PipelineLike)
    // Creates an instance of BlobServiceClient.
    // new BlobServiceClient(url: string, pipeline: PipelineLike)
    // Parameters url: string
    // A Client string pointing to Azure Storage blob service, such as "https://myaccount.blob.core.windows.net". You can append a SAS if using AnonymousCredential, such as "https://myaccount.blob.core.windows.net?sasString".
    // 1. access Account
    const blobServiceClient = new BlobServiceClient(
      // url 中 sasToken 是 query string 所以前面要記得加問號
      // 否則會出現錯誤: Exception: Invalid URL
      // Stack: TypeError [ERR_INVALID_URL]: Invalid URL
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );

    // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/blobserviceclient?view=azure-node-latest#@azure-storage-blob-blobserviceclient-getcontainerclient
    // Creates a ContainerClient object
    // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest
    // ContainerClient object is A ContainerClient represents a URL to the Azure Storage container allowing you to manipulate its blobs.
    // 2. access Container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // generate current timestamp
    const timestamp = new Date().getTime();
    const file_name = `${prompt}_${timestamp}.png`;

    // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest#@azure-storage-blob-containerclient-getblockblobclient
    // Creates a BlockBlobClient
    // Returns BlockBlobClient
    // 3. access Blob
    const blockBlobClient = containerClient.getBlockBlobClient(file_name);

    try {
      // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/blockblobclient?view=azure-node-latest
      // BlockBlobClient defines a set of operations applicable to block blobs.
      // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/blockblobclient?view=azure-node-latest#@azure-storage-blob-blockblobclient-uploaddata
      // uploadData(Blob | ArrayBuffer | ArrayBufferView | Buffer, BlockBlobParallelUploadOptions)
      // Uploads a Buffer(Node.js)/Blob(browsers)/ArrayBuffer/ArrayBufferView object to a BlockBlob.
      await blockBlobClient.uploadData(arrayBuffer);
      console.log("File uploaded successfully!");
    } catch (error) {
      console.log("Error uploading file: ", error.message);
    }

    // 記得要 return 東西回去，否則前端執行 res.json() 的時候會發生錯誤
    return { body: "Successfully Uploaded Image" };
  },
});
