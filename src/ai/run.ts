import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { handleRunToolCalls } from "./tools/handle-tools";

export async function createRun(client: OpenAI, thread: Thread, assistantId: string): Promise<Run> {
    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId
    });
    while (run.status == "queued" || run.status == "in_progress") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    }
    return run;
}

export async function performRun(run: Run, client: OpenAI, thread: Thread ){
    while(run.status == "requires_action") {
        run = await handleRunToolCalls(run, client, thread);
    }

    if(run.status === "failed"){
        const errorMessage = `I found an error: ${run.last_error?.message || 'Unknown error'}`;
        await client.beta.threads.messages.create(thread.id, {
            role: "assistant",
            content: errorMessage,
        });

        return {
            type: "text",
            text: {
                value: errorMessage,
                annotations: []
            }
        }
    }

    const messages = await client.beta.threads.messages.list(thread.id);
    const assistantMessages = messages.data.find(message => message.role === "assistant");
    console.log("assistantMessages has: " + JSON.stringify(assistantMessages));
    const assistantLatestMessage = assistantMessages?.content[0];
    return assistantLatestMessage || {type: "text", text: {
        value: "Did not get any response from the assistant",
        annotations: []
    }}
}