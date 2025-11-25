import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware.js';
import { 
  taskCreateSchema, 
  taskUpdateSchema, 
  taskQueryFiltersSchema, 
  taskParamsSchema 
} from '../types/task.schema.js';

const router = Router();

router.get('/tasks', validateQuery(taskQueryFiltersSchema), getAllTasks);
router.get('/tasks/:id', validateParams(taskParamsSchema), getTaskById);
router.post('/tasks', validateBody(taskCreateSchema), createTask);
router.put('/tasks/:id', validateParams(taskParamsSchema), validateBody(taskUpdateSchema), updateTask);
router.delete('/tasks/:id', validateParams(taskParamsSchema), deleteTask);

export default router;





