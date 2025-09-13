const TodoModel = require("../models/Todo"); // Ensure you have a Todo model
const { validationResult } = require("express-validator");

// Get all todos for the logged-in user
exports.getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await TodoModel.find({ userId });

    if (!todos || todos.length === 0) {
      return res
        .status(200)
        .json({ message: "No tasks available for the user.", todos: [] });
    }

    res.status(200).json({ todos }); 
  } catch (error) {
    console.error("Error fetching todos:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

// Get a single todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const todo = await TodoModel.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, completed } = req.body;
    const userId = req.user.id;
    const newTodo = await TodoModel.create({
      title,
      description,
      completed,
      userId,
    });

    return res.status(201).json({
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update a todo by ID
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updateData = { title, description, completed };

    const todo = await TodoModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a todo by ID
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await TodoModel.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
