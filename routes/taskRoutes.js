const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const router = express.Router();

// Create a Task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user.id }); // Assign task to logged-in user
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Tasks with filtering and sorting
router.get('/', authMiddleware, async (req, res) => { // Apply middleware
  try {
    const { priority, status, sort } = req.query;
    let filter = { user: req.user.id }; // Filter tasks by user

    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    let tasks = Task.find(filter);

    if (sort === 'start_asc') tasks = tasks.sort({ startTime: 1 });
    if (sort === 'start_desc') tasks = tasks.sort({ startTime: -1 });
    if (sort === 'end_asc') tasks = tasks.sort({ endTime: 1 });
    if (sort === 'end_desc') tasks = tasks.sort({ endTime: -1 });

    const results = await tasks;
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Task
router.put('/:id', authMiddleware, async (req, res) => { // Apply middleware
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure task belongs to user
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Task
router.delete('/:id', authMiddleware, async (req, res) => { // Apply middleware
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Ensure task belongs to user
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
