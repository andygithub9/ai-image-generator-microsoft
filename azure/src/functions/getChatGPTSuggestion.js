const { app } = require("@azure/functions");
// 下面這行是錯的，因為我們在 azure 這個專案裡面，所以我們不能 access 到這個專案外面，如果我們引入了一個在這專案外面的 module 會發生 Cannot find module 'xxxxxxx' 的錯誤
// const openai = require("../../../openai");
const openai = require("../../lib/openai");

app.http("getChatGPTSuggestion", {
  methods: ["GET"],
  authLevel: "anonymous",
  // https://platform.openai.com/docs/guides/error-codes/api-errors
  handler: async (request, context) => {
    // Response Error codes
    // https://platform.openai.com/docs/api-reference/completions/create
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "Write a random text prompt for DALL·E to generate an image, this prompt will be shown to the user, include details such as the genre and what type of painting it should be, options can include: oil painting, watercolor, photot-realistic, 4k , abstract, modern, black and white etc. Do not wrap the answer in quotes.",
      max_tokens: 100,
      temperature: 0.8,
    });

    context.log(`Http function processed request for url "${request.url}"`);

    const responseText = response.data.choices[0].text;

    return { body: responseText };
  },
});
