import express from 'express';
import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
const router = express.Router();

router.get('/inventory/item', isAuthenticated, getInventory);
router.get('/inventory/item/:id', isAuthenticated, getInventory);
router.post('/inventory/item', isAuthenticated, createInventoryItem);
router.patch('/inventory/item/:id', isAuthenticated, updateInventoryItem);
router.delete('/inventory/item/:id', isAuthenticated, deleteInventoryItem);

export default router;