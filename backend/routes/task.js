const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController.js');

// Logging middleware for routes
router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.path}`);
  next();
});

// Each endpoint is defined separately, but all logic is in tasksController
router.get('/getAllTasks', (req, res, next) => {
  console.log('[ROUTE] Attempting to get all tasks');
  tasksController.getAllTasks(req, res, next);
});

router.post('/createTask', (req, res, next) => {
  console.log('[ROUTE] Attempting to create task');
  console.log('[ROUTE] Task Data:', req.body);
  tasksController.createTask(req, res, next);
});

router.put('/updateTask/:id', (req, res, next) => {
  console.log(`[ROUTE] Attempting to update task with ID: ${req.params.id}`);
  console.log('[ROUTE] Update Data:', req.body);
  tasksController.updateTask(req, res, next);
});

router.delete('/deleteTask/:id', (req, res, next) => {
  console.log(`[ROUTE] Attempting to delete task with ID: ${req.params.id}`);
  tasksController.deleteTask(req, res, next);
});

module.exports = router;