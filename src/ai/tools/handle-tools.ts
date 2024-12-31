import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { tools } from "./all-tools";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import OpenAI from "openai";

export async function handleRunToolCalls(run:Run, client: OpenAI, thread: Thread) {
    const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;
    if(!toolCalls) return run;

    const toolOutputs = await Promise.all(
        toolCalls.map(async (tool) => {
            const toolConfig = tools[tool.function.name];
            if(!toolConfig) {
                console.error(`Error: Tool ${tool.function.name} not found.`)
                return null;
            }

            try {
                const args = JSON.parse(tool.function.arguments);
                const output = await toolConfig.handler(args);
                return {
                    tool_call_id: tool.id,
                    output: String(output),
                };  
            } catch (error) {
                return {
                    tool_call_id: tool.id,
                    output: 'Error',
                }
            }
        })
    );

    const validOutputs = toolOutputs.filter(Boolean) as 
        OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[];
    
    return client.beta.threads.runs.submitToolOutputsAndPoll(thread.id, run.id, {tool_outputs: validOutputs});
    
}