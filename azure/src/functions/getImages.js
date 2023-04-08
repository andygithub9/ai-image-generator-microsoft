const { app } = require("@azure/functions");
const generateSASToken = require("../../lib/generateSASToken");
const {
  StorageSharedKeyCredential,
  BlobServiceClient,
} = require("@azure/storage-blob");

const accountName = process.env.accountName;
const accountKey = process.env.accountKey;

const containerName = "images";

// https://www.npmjs.com/package/@azure/storage-blob#with-storagesharedkeycredential
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

app.http("getImages", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    // get the images container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageUrls = [];
    const sasToken = await generateSASToken();

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
    // https://pjchender.dev/javascript/js-async-await/
    // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest#@azure-storage-blob-containerclient-listblobsflat
    // 取回 images 這個 blob container 裡所有的 blobs
    // 我們用 for await 等待每個 blob
    for await (const blob of containerClient.listBlobsFlat()) {
      // https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-create-user-delegation-sas-javascript#blob-use-sas-token
      const imageUrl = `${blob.name}?${sasToken}`;
      const url = `https://${accountName}.blob.core.windows.net/images/${imageUrl}`;
      imageUrls.push({ url, name: blob.name });
    }

    const sortedImageUrls = imageUrls.sort((a, b) => {
      // draw-a-dinasour_1626120000000.png
      // split("_") 以 "_" 切割字符串城陣列 ['draw-a-dinasour','1626120000000.png']
      // pop() 拿到陣列的最後一個元素 '1626120000000.png'
      // toString() 轉型成字符串 '1626120000000.png'
      // split(".") 以 "." 切割字符串城陣列 ['1626120000000','png']
      // shift() 拿到陣列的第一個元素 '1626120000000'
      const aName = a.name.split("_").pop().toString().split(".").shift();
      const bName = b.name.split("_").pop().toString().split(".").shift();
      return bName - aName;
    });

    context.log(`Http function processed request for url "${request.url}"`);

    return {
      jsonBody: {
        imageUrls: sortedImageUrls,
      },
    };
  },
});
