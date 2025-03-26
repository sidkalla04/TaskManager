// utils/tasksData.js
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/tasks.json');

async function readTasks() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(dataFilePath, JSON.stringify(tasks, null, 2));
}

module.exports = { readTasks, writeTasks };
