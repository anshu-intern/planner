import fs from 'fs';
import yaml from 'yaml';
import chalk from 'chalk';
import path from 'path';
import { generateAIRespPlan } from './gpt.js';
import "dotenv/config";

// export const PLAN_FILE = 'plan.yaml';

// Task structure template
export interface Task {
  id: number;
  description: string;
}

// Plan structure template
export interface Plan {
  goal: string;
  createdAt: string;
  tasks: Task[];
}

// Generate plan for goal.
export async function generatePlan(goal: string): Promise<void> {

  // Shifting logic to real time task generation using LLMs for real life scenarios.....
  // const tasks: Task[] = [
  //   { id: 1, description: 'Set up project environment' },
  //   { id: 2, description: 'Design core data models' },
  //   { id: 3, description: 'Implement basic API routes' },
  //   { id: 4, description: 'Connect frontend with API' },
  //   { id: 5, description: 'Add authentication system' }
  // ];

  // const plan: Plan = {
  //   goal,
  //   createdAt: new Date().toISOString(),
  //   tasks
  // };

  // const yamlString = yaml.stringify(plan);

  try {
    const tasks: Task[] = await generateAIRespPlan(goal);
  
    const plan: Plan = {
      goal,
      createdAt: new Date().toISOString(),
      tasks
    };
    const yamlString = yaml.stringify(plan);
    fs.writeFileSync(process.env.PLAN_FILE!, yamlString);
    console.log(chalk.green(`✅ Plan saved to plan.yaml at ${path.resolve(process.env.PLAN_FILE!)}`));
  } catch (err) {
    console.error(chalk.red('❌ Failed to write plan.yaml'), err);
  }
}

// Read plan from file
export function readPlan(): Plan | null {
  try {
    const file = fs.readFileSync(process.env.PLAN_FILE!, 'utf8');
    const plan = yaml.parse(file) as Plan;
    return plan;
  } catch (err) {
    console.error(chalk.red('❌ Could not read plan.yaml — please run `npm start -- init <goal>` first.'));
    return null;
  }
}

// Save plan to file
export function savePlan(plan: Plan): void {
  try {
    const yamlString = yaml.stringify(plan);
    fs.writeFileSync(process.env.PLAN_FILE!, yamlString);
    console.log(chalk.green('✅ Plan updated in plan.yaml'));
  } catch (err) {
    console.error(chalk.red('❌ Failed to save updated plan.'), err);
  }
}

// Edit task in plan
export function editTask(taskId: number, newDescription: string): void {
  const plan = readPlan();
  if (!plan) return;

  const task = plan.tasks.find(t => t.id === taskId);
  if (!task) {
    console.error(chalk.red(`❌ Task with ID ${taskId} not found.`));
    return;
  }

  task.description = newDescription;
  savePlan(plan);
}