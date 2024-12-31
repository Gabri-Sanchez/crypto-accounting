import OpenAI from "openai";
import { createAssistant } from "./ai/assistant";
import { createThread } from "./ai/thread";
import { createRun, performRun } from "./ai/run";

require('dotenv').config();

async function main() {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_KEY,
    });
    const message = "Hello, Bitty";

    const assistant = await createAssistant(client);
    const thread = await createThread(client, message);
    const run = await createRun(client, thread, assistant.id);
    const result = await performRun(run, client, thread);
    console.log(result);

}

main();