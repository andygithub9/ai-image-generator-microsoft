// we can't have random users generated images, so we have to authenticate our requests to make sure they are valid requests, so that we don't destroying the backend,this way we don't break the backend, so one way of doing this is we can use SAS(Shared Access Signatures) token, this will allow us to access backend service for a limited time.

// https://www.npmjs.com/package/@azure/storage-blob#with-storagesharedkeycredential
// 1. use StorageSharedKeyCredential class to get a key credential and log into the account
// 2. use BlobServiceClient class to create a blob service client and this allows us to connent to the blob account
// https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/?view=azure-node-latest#@azure-storage-blob-generateblobsasqueryparameters
// 3. Generate service level SAS(shared access signatures) for a container
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");

// Enter your storage account name and shared key
const accountName = process.env.accountName;
const accountKey = process.env.accountKey;
const containerName = "images";

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

async function generateSASToken() {
  // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/blobserviceclient?view=azure-node-latest#@azure-storage-blob-blobserviceclient-getcontainerclient
  // connect to blob container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/blobsaspermissions?view=azure-node-latest
  const permissions = new BlobSASPermissions();
  permissions.write = true;
  permissions.create = true;
  permissions.read = true;

  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 1);

  // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/?view=azure-node-latest#@azure-storage-blob-generateblobsasqueryparameters
  // Generate service level SAS(shared access signatures) for a container
  const sasToken = generateBlobSASQueryParameters(
    {
      // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest#@azure-storage-blob-containerclient-containername
      containerName: containerClient.containerName,
      // https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/blobsaspermissions?view=azure-node-latest#@azure-storage-blob-blobsaspermissions-tostring
      permissions: permissions.toString(),
      expiresOn: expiryDate,
    },
    sharedKeyCredential
  ).toString();

  return sasToken;
}

module.exports = generateSASToken;
