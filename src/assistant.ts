import OpenAI from "openai";

const openai = new OpenAI;

async function main() {
    const assistant = await openai.beta.assistants.create({
        name: "Tex",
        instructions: "You are an assistant that helps with the taxes of cryptocurrency and accounting",
        tools: [{ type: "function", function: {name: "hello"}}],
        model: "gpt-4o-mini"
    })
}