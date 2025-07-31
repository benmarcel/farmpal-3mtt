import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, AlertCircle, CheckCircle, X } from 'lucide-react';
import useFetch from '../hooks/useFetch'; 

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    unit: '',
    category: ''
  });
    
    const { request, loading, error } = useFetch();
  
  const fetchInventory = async () => {
    try {
      const data = await request('/inventory/item', 'GET');
      setInventory(data.data || []);
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  };

  // Create new inventory item
  const createItem = async (itemData) => {
    try {
      const data = await request('/inventory/item', 'POST', itemData);
      setInventory(prev => [...prev, data.data]);
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  // Update inventory item
  const updateItem = async (id, itemData) => {
    try {
      const data = await request(`/inventory/item/${id}`, 'PATCH', itemData);
      setInventory(prev => prev.map(item => 
        item._id === id ? data.data : item
      ));
      setEditingItem(null);
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  // Delete inventory item
  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await request(`/inventory/item/${id}`, 'DELETE');
      setInventory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      price: '',
      unit: '',
      category: ''
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.quantity || !formData.price) {
      alert('Name, quantity, and price are required fields');
      return;
    }

    // Validate numeric fields
    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price);
    
    if (isNaN(quantity) || quantity < 0) {
      alert('Quantity must be a valid non-negative number');
      return;
    }
    
    if (isNaN(price) || price < 0) {
      alert('Price must be a valid non-negative number');
      return;
    }

    const submitData = {
      name: formData.name.trim().toLowerCase(),
      quantity: quantity,
      price: price,
      unit: formData.unit.trim().toLowerCase(),
      category: formData.category.trim().toLowerCase()
    };

    if (editingItem) {
      updateItem(editingItem._id, submitData);
    } else {
      createItem(submitData);
    }
  };

  // Start editing
  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      unit: item.unit || '',
      category: item.category || ''
    });
    setShowAddForm(true);
  };

  // Cancel form
  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    resetForm();
  };

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-4 ">
      <div className="max-w-7xl mx-auto mt-[100px]">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Farm Inventory Management</h1>
                <p className="text-gray-600">Manage your farm supplies and equipment</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error.message}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inventory by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={cancelForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Fertilizer, Seeds, Tools"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity 
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Unit
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., kg, liters, pieces"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Seeds, Tools, Fertilizers"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
                <button
                  onClick={cancelForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory Items ({filteredInventory.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No inventory items found.</p>
              {searchTerm && <p className="text-sm">Try adjusting your search terms.</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.unit && <div className="text-sm text-gray-500">Unit: {item.unit}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦ {item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₦ {(item.quantity * item.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Edit item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {inventory.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Items</h3>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Quantity</h3>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.reduce((sum, item) => sum + item.quantity, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
              <p className="text-2xl font-bold text-green-600">
                ₦ {inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;