#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { editTask, generatePlan, readPlan, savePlan } from './planner.js';
import inquirer from 'inquirer';

const program = new Command();

program
  .name('planner')
  .description('🧠 Plan first, code second — Traycer-style CLI planning tool')
  .version('1.0.0');

// initialize a new plan
program
  .command('init')
  .description('Generate a plan from a high-level goal')
  .argument('<goal>', 'e.g., Build a task manager with login')
  .action((goal) => {
    console.log(chalk.blueBright(`🛠 Generating plan for: "${goal}"`));
    generatePlan(goal);
  });

// List tasks for the plan
program
  .command('list')
  .description('List tasks in current plan')
  .action(()=> {
    const plan = readPlan();
    if (!plan) {
        console.log(chalk.red('Error reading plan!'));
        return
    }
    console.log(chalk.yellow(`\n🗂 Plan: "${plan.goal}" (created at ${plan.createdAt})\n`));
    for (const task of plan.tasks) {
      console.log(`  [${chalk.cyan(task.id)}] ${task.description}`);
    }
    console.log('');
  });

// Edit a task for the plan
program
  .command('edit')
  .description('Edit task in plan')
  .argument('<taskId>', 'ID of the task to be edited')
  .argument('<newDescription>', 'New description of the task')
  .action((taskIdStr, newDescription)=>{
    const taskId = parseInt(taskIdStr, 10);
    if (isNaN(taskId)){
        console.error(chalk.red('❌ Task ID must be a number!'));
        return;
    }
    editTask(taskId, newDescription);
  });

// Edit tasks for a plan in interactive mode
program
  .command('edit-interactive')
  .description('Edit task in interactive mode')
  .action(async () => {
    const plan = readPlan();
    if (!plan){
      console.error(chalk.red('❌ Error reading plan!'));
      return;
    }

    const choices = plan.tasks.map(task => ({
      name  : `[${task.id}] ${task.description}`,
      value : task.id 
    }));

    const { taskId } = await inquirer.prompt<{ taskId : number }>(
      {
        type : 'list',
        name : 'taskId',
        message : 'Select a task to edit - ',
        choices
      }
    );

    const { newDescription } = await inquirer.prompt<{ newDescription : string }>([{
      type : 'input',
      name : 'newDescription',
      message : 'Enter new description for the task: ',
      validate : (input) => input.trim() === '' ? 'Description cannot be empty' : true , 
      default : plan.tasks.find(t => t.id === taskId)?.description ?? ''
    }]);

    const task = plan.tasks.find(t => t.id === taskId);
    if (!task) {
      console.error(chalk.red(`❌ Task with ID ${taskId} not found.`));
      return;
    }

    task.description = newDescription.trim();
    savePlan(plan);

  });

program.parse(process.argv);
