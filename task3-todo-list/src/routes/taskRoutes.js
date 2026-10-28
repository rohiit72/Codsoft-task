const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  queryTaskSchema
} = require('../validators/taskValidator');

// Protect all task endpoints with JWT authentication
router.use(authenticate);

// Analytics and metrics summary (must be before /:id)
router.get('/stats', taskController.getTaskStats);

// Task CRUD endpoints
router.post('/', validate(createTaskSchema, 'body'), taskController.createTask);
router.get('/', validate(queryTaskSchema, 'query'), taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema, 'body'), taskController.updateTask);
router.patch('/:id/status', validate(updateStatusSchema, 'body'), taskController.updateStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
