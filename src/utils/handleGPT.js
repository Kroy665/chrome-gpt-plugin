
import axios from "axios";




async function createChatCompletion(
    messages,
    options,
    token
) {
    try {
        const openai = axios.create({
            baseURL: "https://api.openai.com/v1",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        
        const response = await openai.post("/chat/completions", {
            model: options.model,
            messages,
            ...options,
        });

        return response.data.choices;
    } catch (error) {
        console.error("Error creating chat completion:", error);
    }
}
async function handleGPT(messages, token) {
    // console.log("messages", messages);
    // console.log("token", token);
    const options = {
        temperature: 0.8,
        max_tokens: 700,
        model: "gpt-4"
    };

    const choices = await createChatCompletion(messages, options, token);

    // console.log(choices[0].message);
    return choices[0].message;
}

export {
    handleGPT
}