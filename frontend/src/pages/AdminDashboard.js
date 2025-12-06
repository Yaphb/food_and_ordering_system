import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: '',
    available: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menu`);
      // Ensure price is a number
      const items = response.data.map(item => ({
        ...item,
        price: parseFloat(item.price)
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemId = editingItem?.id || editingItem?._id;
      if (editingItem) {
        await axios.put(`${API_URL}/api/menu/${itemId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/menu`, formData);
      }
      fetchMenuItems();
      resetForm();
    } catch (error) {
      alert('Error saving menu item: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      price: parseFloat(item.price)
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/api/menu/${id}`);
        fetchMenuItems();
      } catch (error) {
        alert('Error deleting item: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main',
      image: '',
      available: true
    });
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? 'Cancel' : 'Add New Item'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="appetizer">Appetizer</option>
            <option value="main">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
          </select>
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            Available
          </label>
          <button type="submit" className="btn-primary">
            {editingItem ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="admin-items">
        <h3>Menu Items</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id || item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>RM{parseFloat(item.price).toFixed(2)}</td>
                <td>{item.available ? '✓' : '✗'}</td>
                <td>
                  <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(item.id || item._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
