const { Configuration, OpenAIApi } = require("openai");

// https://platform.openai.com/docs/api-reference/requesting-organization
const configuration = new Configuration({
  // 在 azure 這個專案下，環境設定在 local.settings.json 這個檔案裡，所以我們要將 openai 的 organization, apiKey 加進 local.settings.json
  organization: process.env.OPEN_AI_ORGANIZATION,
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
