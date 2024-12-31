import OpenAI from "openai";

export async function createThread(client: OpenAI, message: string) {
  const thread = await client.beta.threads.create();

  await client.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  })
  console.log("CREATED THREAD WITH ID " + thread.id + "\n");
  
  return thread;

}

