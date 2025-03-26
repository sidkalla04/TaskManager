import React, { useState } from 'react';
import axios from 'axios';
import './TaskManagement.css';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:5001';

function TaskManagementApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks 
  const handleShowTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllTasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks');
    }
  };

  // Hide tasks
  const handleHideTasks = () => {
    setTasks([]);
    setEditingTask(null);
  };

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/createTask`, {
        title: newTask.title,
        description: newTask.description
      });
      
      // Update tasks list 
      const updatedTasks = [...tasks, response.data];
      setTasks(updatedTasks);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  // Update an existing task
  const handleUpdateTask = async (task) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/updateTask/${task.id}`, {
        title: task.title,
        description: task.description,
        completed: task.completed
      });
      
      const updatedTasks = tasks.map(t => t.id === task.id ? response.data : t);
      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  // Delete a specific task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteTask/${taskId}`);
      
      // Remove deleted task from the list
      const remainingTasks = tasks.filter(task => task.id !== taskId);
      setTasks(remainingTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const response = await axios.put(`${API_BASE_URL}/updateTask/${task.id}`, updatedTask);
      
      const updatedTasks = tasks.map(t => t.id === task.id ? response.data : t);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Failed to update task');
    }
  };

  return (
    <div className="task-management-container">
      <h1 className="app-title">Task Management</h1>
      
      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} className="task-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            className="task-input"
            required
          />
          <input
            type="text"
            placeholder="Task Description (Optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            className="task-input"
          />
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Show Tasks Button */}
      <div className="task-management-buttons">
        {tasks.length === 0 && (
          <button 
            onClick={handleShowTasks}
            className="btn btn-show-tasks"
          >
            Show All Tasks
          </button>
        )}

        {/* Hide Tasks Button (appears when tasks are displayed) */}
        {tasks.length > 0 && (
          <button 
            onClick={handleHideTasks}
            className="btn btn-hide-tasks"
          >
            Hide Tasks
          </button>
        )}
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item 
                ${task.completed ? 'completed' : ''}`}
            >
              {editingTask && editingTask.id === task.id ? (
                // Edit Mode
                <div className="task-edit-form">
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="task-input"
                  />
                  <input
                    type="text"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className="task-input"
                  />
                  <div className="task-edit-actions">
                    <button 
                      onClick={() => handleUpdateTask(editingTask)}
                      className="btn btn-success"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingTask(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="task-content">
                  <div className="task-header">
                    {/* Checkbox for completion */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task)}
                      className="task-checkbox"
                    />

                    <span className="task-title">{task.title}</span>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="task-actions">
                    <button 
                      onClick={() => setEditingTask(task)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // No Tasks Message
        <div className="no-tasks-message">
          <p>No tasks found. Click "Show All Tasks" to view existing tasks or add a new task.</p>
        </div>
      )}
    </div>
  );
}

export default TaskManagementApp;