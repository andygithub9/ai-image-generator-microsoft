# Create A Azure Function App

1. install VSCode Extension - Azure Tools (這個擴充套件是一個組合包，包含我們要用到的 Azure Functions 這個擴充套件)
2. in VSCode -> press command + shift + P -> type this: Azure Functions: Create Function App in Azure -> enter your function app name -> select node 18 -> select the AZ you like
3. in VSCode -> press command + shift + P -> type: Azure Functions: Create Function -> select Browse and press ENTER -> selete /azure folder -> selete HTTP trigger -> enter your function name and presss ENTER
4. install Azure Functions Core Tools https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools
5. press command + shift + P -> Azure Functions: Download Remote Settings
6. go to terminal -> cd azure/ -> npm start

# Builda azure function generateImage

1. Dependencies needed to install: `yarn add @azure/storage-blob axios openai`
2. Find your Storage accounts in _azure/local.settings.json_
   ```json
   {
     "Values": {
       "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=[This is your Account Name];"
     }
   }
   ```
3. goto https://portal.azure.com/ -> login -> click **Storage accounts** -> click on the **Account Name** you found in step 2 -> click on the **Access keys** on the right side of the dashboard
4. copy key1 > Key
5. add to _azure/local.settings.json_

   ```json
   {
     "Values": {
       "accountKey": "W+hZ4epJXE6gBk9wtoqCAeN4Cm5/frgX2bvzp+tEG7mAkZttOtU7MzRdFq08bMWiwJk0T+6CWM0u+AStDGJQQA=="
     }
   }
   ```

6. copy Storage account name
7. add to _azure/local.settings.json_

```json
{
  "Values": {
    "accountName": "aiimagegeneratoryo2d3f34"
  }
}
```

8. press command + shift + P -> type: Azure Storage: Create Blob Container -> select the Storage accounts you want to use -> enter a name for your blob container -> press ENTER
9. on your right side of VSCode -> click on AZUER ->click on Storage accounts -> click on your Storage account -> click Blob Containers -> you will found the blob container you just created
10. see _azure/lib/generateSASToken.js_
11. see _azure/src/functions/generateImage.js_

# Blob Container Concept

| Account<br />(BlobServiceClient) | Container<br />(blobServiceClient.getContainerClient) | Blob<br />(containerClient.getBlockBlobClient) |
| -------------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| [your account]                   | pictures                                              | img001.png                                     |
|                                  |                                                       | img002.png                                     |
|                                  | movies                                                | mov1.avi                                       |

# fetch azure function 的注意事項

在前端 fetch 的緩存策略要設置 `cache: "no-store"` 不緩存我們的資料，因為我們在 access 進 blob (圖片) 的 url 時，後面都會帶 SAS Token，如果我們 access blob 用的是緩存的 SAS Token，則可能用到的事已經失效的 SAS Token，所以在 access blob 的時候可能會被擋掉， error code 403。所以緩存策略要設定成不緩存，每次都拿新的 SAS Token 去 access blob

# Deploy the Azure Functions
1. go to https://portal.azure.com/ -> Function App -> 你的 Function App -> 左側蘭點擊 Configuration ，會看到目前在雲端上的環境變數，會發現雲端上的和我們本地端的不一樣，本地端的環境變數在azure/local.settings.json，因為我們在本地端加了幾項環境變數上去，所以我們要先將本地的環境變數推上雲端
2. push 本地端的 local.settings.json 到雲端  
   command + shift + P -> type in: `Azure Functions: Upload Local Settings` -> hit ENTER -> select your function app -> hit ENTER -> 回到步驟一的 azure 控制台會發現我們已經將我們的 local.settings.json 中的設定推送至雲端
3. Deploy to Funciton App
  command + shift + P -> type in: `Azure Functions: Deploy to Function App` -> Select resource you want to deploy -> hit Enter -> click Deploy
4. command + J -> select OUTPUT tab -> select Azure Functions -> 你可以看到部署的狀態
5. 部署成功後，在 VSCode 左側點擊 AZURE -> 點擊 Subscriptions -> 點擊 Function App -> 點擊你的 Function App -> 點擊 Functions -> 右鍵點擊你選擇的 Function -> 點擊 Copy Function Url -> 之後就可以用部署到雲端的 Url 替換掉程式裡的本地 Url 

# Deploy next.js app on vercel 
1. into treminal -> cd to project root -> type in `vercel` -> 到 vercel 選擇你剛才部署的專案，把 .env.local 裡的變數貼到 vercel 的你的專案的 Settings 的 Environment Variables -> 到專案的 Deployments 選擇剛剛的 deployment 點 '...'，點擊 'Redeploy'，這是你在 vercel 上已經有專案需要的環境變數，所以這次的部屬就會成功了