const { client } = require('../completionsClient');

async function generateResponse(userMessage) {
    try {
        const result = await client.chat.completions.create({
              messages: [
                { role: "system", content: "You are a helpful assistant. You will talk professionally." },
                { role: "user", content: userMessage },
               ],
              model: 'gpt-4',
        });
    
        // To do: refactor the response, if there is a case that the completions object includes multiple choices?
        // const responseMessages = []
        // for (const choice of result.choices) {
        //   responseMessages.push(choice.message)
        //   // console.log(choice.message);
        // }

        const answer = result?.choices[0].message.content
        return answer
    } catch (error) {
          console.error("Error generating repsonse from model:", error);
          throw error
    }
}

module.exports = { generateResponse };
