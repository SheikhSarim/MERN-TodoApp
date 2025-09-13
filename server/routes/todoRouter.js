const { Router } = require("express");
const router = Router();
const { body } = require("express-validator");
const TodoController = require("../controllers/TodoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/todos",
  authMiddleware, // Protect the route
  TodoController.getAllTodos
);

// Get a single todo by ID
router.get("/todos/:id", authMiddleware, TodoController.getTodoById);

// Create a new todo
router.post(
  "/todos/create",
  [
    body("title")
      .exists()
      .withMessage("Title is required.")
      .bail()
      .isString()
      .withMessage("Title must be a string."),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string."),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean value."),
  ],
  authMiddleware,
  TodoController.createTodo
);

// Update a todo by ID
router.put(
  "/todos/:id",
  authMiddleware,
  [
    body("title").optional().isString().withMessage("Title must be a string."),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string."),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean value."),
  ],
  TodoController.updateTodo
);

// Delete a todo by ID
router.delete("/todos/:id", authMiddleware, TodoController.deleteTodo);

module.exports = router;
