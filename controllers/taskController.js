const Task = require('../models/Task');

// Create a new task (ensure task is associated with the logged-in user)
exports.createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user.id }); // Associate task with user
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tasks for the authenticated user (filter by user)
exports.getTasks = async (req, res) => {
  try {
    const { priority, status, sortBy } = req.query;

    let query = {};
    if (priority) query.priority = Number(priority);
    if (status) query.status = status;

    const tasks = await Task.find(query).sort(sortBy ? { [sortBy]: 1 } : {});
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message); // Log the error
    res.status(500).json({ error: 'An error occurred while fetching tasks.' });
  }
};

// Update a task (only allow update for the task belonging to the authenticated user)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure task belongs to user
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a task (only allow delete for the task belonging to the authenticated user)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Ensure task belongs to user
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
