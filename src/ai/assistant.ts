import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants.mjs";

export async function createAssistant(client: OpenAI) : Promise<Assistant> {
    const assistant = await client.beta.assistants.create({
        name: "Bitty",
        instructions: "You are an assistant that helps with the taxes of cryptocurrency and accounting",
        tools: [],
        model: "gpt-4o-mini"
    })
    console.log(assistant);
    return assistant;
}

