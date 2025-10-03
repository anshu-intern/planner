import { InferenceClient } from '@huggingface/inference';
import type { Task } from './planner';
import 'dotenv/config';

const client = new InferenceClient(process.env.HF_TOKEN);

export async function generateAIRespPlan(goal: string): Promise<Task[]> {
    try{
        const chatCompletion  = await client.chatCompletion({
            provider: "hf-inference",
            model: "HuggingFaceTB/SmolLM3-3B",
            messages: [
                {
                    role: "system",
                    content: "You are an expert task planner.",
                },
                {
                    role: "user",
                    content: `List the tasks to achieve the following goal -  ${goal}. Give response in JSON only in the following format - { tasks: [{id:1 , description: task description}] }. make sure json is at the end of your response and dont add any character after json response. `,
                },
            ],
        });

        const resp = chatCompletion.choices[0]!.message;
        const cleanedContent = resp.content!.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        const tasks = extractTasksFromContent(cleanedContent!);
        return tasks;

    } catch (error) {
        console.error(error);
        return [];
    } 
}

function extractTasksFromContent(content: string): Array<{ id: number; description: string }> {

    const firstBraceIndex = content.indexOf('{');
    const possibleJson = content.slice(firstBraceIndex).trim();

    for(let i = possibleJson.length; i>0; i--){
        const substring = possibleJson.slice(0, i);
        try {
            const parsed = JSON.parse(substring);
            return parsed.tasks;
        } catch (err) {
            continue
        }
    }
    console.error('Failed to parse JSON from input.');
    return [];
}
