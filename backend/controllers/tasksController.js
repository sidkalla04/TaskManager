const { readTasks, writeTasks } = require('../utils/tasksData.js');

// Retrieve all tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    console.log('[CONTROLLER] Retrieving all tasks');
    const tasks = await readTasks();
    console.log(`[CONTROLLER] Retrieved ${tasks.length} tasks`);
    res.json(tasks);
  } catch (error) {
    console.error('[CONTROLLER] Error retrieving tasks:', error);
    next(error);
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    console.log('[CONTROLLER] Creating new task');
    console.log('[CONTROLLER] Task Data:', { title, description });

    if (!title) {
      console.warn('[CONTROLLER] Task creation failed: No title provided');
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const tasks = await readTasks();
    const newTask = {
      id: Date.now().toString(),  // Using a timestamp as a unique identifier
      title,
      description: description || '',
      completed: false,
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    console.log(`[CONTROLLER] Task created successfully. ID: ${newTask.id}`);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('[CONTROLLER] Error creating task:', error);
    next(error);
  }
};

// Update an existing task
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    console.log(`[CONTROLLER] Updating task. ID: ${id}`);
    console.log('[CONTROLLER] Update Data:', { title, description, completed });

    const tasks = await readTasks();
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      console.warn(`[CONTROLLER] Update failed: Task not found. ID: ${id}`);
      return res.status(404).json({ error: 'Task not found.' });
    }

    tasks[index] = {
      ...tasks[index],
      title: title !== undefined ? title : tasks[index].title,
      description: description !== undefined ? description : tasks[index].description,
      completed: completed !== undefined ? completed : tasks[index].completed,
    };

    await writeTasks(tasks);

    console.log(`[CONTROLLER] Task updated successfully. ID: ${id}`);
    res.json(tasks[index]);
  } catch (error) {
    console.error(`[CONTROLLER] Error updating task. ID: ${id}`, error);
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`[CONTROLLER] Deleting task. ID: ${id}`);

    const tasks = await readTasks();
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      console.warn(`[CONTROLLER] Delete failed: Task not found. ID: ${id}`);
      return res.status(404).json({ error: 'Task not found.' });
    }

    const removedTask = tasks.splice(index, 1)[0];
    await writeTasks(tasks);

    console.log(`[CONTROLLER] Task deleted successfully. ID: ${id}`);
    res.json(removedTask);
  } catch (error) {
    console.error(`[CONTROLLER] Error deleting task. ID: ${id}`, error);
    next(error);
  }
};