# Planner CLI — Plan First, Code Second 🧠

A Traycer-inspired command-line tool to **plan tasks before coding**.  
- Generate, list, and interactively edit project plans stored in YAML format.
- Traycer acts as a planning layer on top of other coding agents This is a simplified version of Traycer that captures the same core idea.




## Features

- **Initialize a new plan** from a high-level goal
- **List tasks** in the current plan  
- **Edit tasks** by ID or interactively via prompts  
- Plans are saved to a human-readable `plan.yaml` file  
- Clean TypeScript + modern ES Modules + Node.js + LLM integration



## Tech Stack

* Node.js
* TypeScript (ES Modules)
* Commander (CLI)
* Inquirer (Interactive prompts)
* YAML (Plan serialization)
* Chalk (Colored terminal output)
* Dotenv (environment variables)
* huggingface/inference (LLM integration)



## Installation

Clone the repo and install dependencies:

1. git clone https://github.com/anshu-intern/planner.git
2. cd planner
3. npm install
4. Add .env file for environment variables - HF_TOKEN (LLM API key) and PLAN_FILE (output file destination)

For global package installation follow the additional steps below:

1. npm run build
2. npm install -g .




## Usage

Run commands with:
npm start -- <command> [args]

Commands:
* init <goal> - Generate a new plan based on the provided goal string.
    e.g. - npm start -- init "Build a blog app with authentication"

* list - Display the current plan tasks.
    e.g. - npm start -- list

* edit <taskId> <newDescription> - Edit a task's description by ID.
    e.g. - npm start -- edit 3 "Implement REST API with authentication"

* edit-interactive - Select and edit a task interactively with prompts.
    e.g. - npm start -- edit-interactive




## Sample Plan Output (plan.yaml)

goal: Build a blog app with authentication
createdAt: 2025-10-02T16:30:00.000Z
tasks:
  - id: 1
    description: Set up project environment
  - id: 2
    description: Design core data models
  - id: 3
    description: Implement basic API routes
  - id: 4
    description: Connect frontend with API
  - id: 5
    description: Add authentication system

