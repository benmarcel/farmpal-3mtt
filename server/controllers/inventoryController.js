import Inventory from '../models/inventory.js';
import mongoose from 'mongoose';

/**
 * Get inventory item(s)
 * - If `req.params.id` is provided, fetch that specific item.
 * - If no ID, fetch all inventory items.
 */
export const getInventory = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch specific item
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: 'Invalid inventory ID format.',
          status: 'error',
        });
      }

      const item = await Inventory.findById(id);
      if (!item) {
        return res.status(404).json({
          message: 'Inventory item not found.',
          status: 'error',
        });
      }

      return res.status(200).json({
        message: 'Inventory item retrieved successfully.',
        status: 'success',
        data: item,
      });
    }

    // Fetch all items
    const items = await Inventory.find({});
    return res.status(200).json({
      message: 'Inventory fetched successfully.',
      status: 'success',
      data: items,
    });
  } catch (err) {
    console.error('Error in getInventory:', err);
    return res.status(500).json({
      message: 'Server error while fetching inventory.',
      status: 'error',
    });
  }
};

/**
 * Create a new inventory item
 */
export const createInventoryItem = async (req, res) => {
  try {
    const { name, quantity, price, unit, category } = req.body;

    // Validation
    if (
      typeof name !== 'string' || name.trim() === '' ||
      typeof quantity !== 'number' || quantity < 0 ||
      typeof price !== 'number' || price < 0 ||
      (unit && typeof unit !== 'string') ||
      (category && typeof category !== 'string')
    ) {
      return res.status(400).json({
        message: 'Invalid input. Ensure name is a string, quantity and price are non-negative numbers, unit/category (if provided) are strings.',
        status: 'error',
      });
    }

    // Check for duplicate name
    const existing = await Inventory.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({
        message: 'Inventory item with this name already exists.',
        status: 'error',
      });
    }

    const item = await Inventory.create({
      name: name.trim(),
      quantity,
      price,
      unit: unit?.trim() || '',
      category: category?.trim() || '',
    });

    return res.status(201).json({
      message: 'Inventory item created successfully.',
      status: 'success',
      data: item,
    });
  } catch (err) {
    console.error('Error in createInventoryItem:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: err.message,
        status: 'error',
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate entry. Inventory name must be unique.',
        status: 'error',
      });
    }

    return res.status(500).json({
      message: 'Server error while creating inventory item.',
      status: 'error',
    });
  }
};

/**
 * Update an existing inventory item (partial update allowed)
 */
export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid inventory ID format.',
        status: 'error',
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No update fields provided.',
        status: 'error',
      });
    }

    // Validate and sanitize fields
    const validFields = {};
    if ('name' in updates) {
      if (typeof updates.name !== 'string' || updates.name.trim() === '') {
        return res.status(400).json({
          message: 'Invalid name field.',
          status: 'error',
        });
      }
      validFields.name = updates.name.trim();
    }

    if ('quantity' in updates) {
      if (typeof updates.quantity !== 'number' || updates.quantity < 0) {
        return res.status(400).json({
          message: 'Quantity must be a non-negative number.',
          status: 'error',
        });
      }
      validFields.quantity = updates.quantity;
    }

    if ('price' in updates) {
      if (typeof updates.price !== 'number' || updates.price < 0) {
        return res.status(400).json({
          message: 'Price must be a non-negative number.',
          status: 'error',
        });
      }
      validFields.price = updates.price;
    }

    if ('unit' in updates) {
      if (typeof updates.unit !== 'string') {
        return res.status(400).json({
          message: 'Unit must be a string.',
          status: 'error',
        });
      }
      validFields.unit = updates.unit.trim();
    }

    if ('category' in updates) {
      if (typeof updates.category !== 'string') {
        return res.status(400).json({
          message: 'Category must be a string.',
          status: 'error',
        });
      }
      validFields.category = updates.category.trim();
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      validFields,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: 'Inventory item not found.',
        status: 'error',
      });
    }

    return res.status(200).json({
      message: 'Inventory item updated successfully.',
      status: 'success',
      data: updatedItem,
    });
  } catch (err) {
    console.error('Error in updateInventoryItem:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: err.message,
        status: 'error',
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate entry. Inventory name must be unique.',
        status: 'error',
      });
    }

    return res.status(500).json({
      message: 'Server error while updating inventory item.',
      status: 'error',
    });
  }
};

/**
 * Delete an inventory item
 */
export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid inventory ID format.',
        status: 'error',
      });
    }

    const deleted = await Inventory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        message: 'Inventory item not found.',
        status: 'error',
      });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Error in deleteInventoryItem:', err);
    return res.status(500).json({
      message: 'Server error while deleting inventory item.',
      status: 'error',
    });
  }
};


