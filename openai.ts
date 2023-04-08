import { Configuration, OpenAIApi } from "openai";

// https://platform.openai.com/docs/api-reference/requesting-organization
const config = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION,
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(config);

export default openai;
