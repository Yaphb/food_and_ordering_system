import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`${API_URL}/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="staff-container">
      <h2>Staff Dashboard - Order Management</h2>
      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order._id || order.id} className="staff-order-card">
              <div className="order-header">
                <h3>Order #{(order._id || order.id)?.toString().slice(-6) || 'N/A'}</h3>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>
            <div className="order-details">
              <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
              <p><strong>Phone:</strong> {order.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {order.deliveryAddress || 'N/A'}</p>
              <p><strong>Total:</strong> RM{(order.totalPrice || 0).toFixed(2)}</p>
              <p><strong>Time:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="order-items">
              <strong>Items:</strong>
              <ul>
                {order.items?.map((item, idx) => (
                  <li key={idx}>{item.menuItem?.name || 'Item'} x {item.quantity}</li>
                )) || <li>No items</li>}
              </ul>
            </div>
            <div className="status-actions">
              <button onClick={() => updateOrderStatus(order._id || order.id, 'pending')} disabled={order.status === 'pending'}>Pending</button>
              <button onClick={() => updateOrderStatus(order._id || order.id, 'preparing')} disabled={order.status === 'preparing'}>Preparing</button>
              <button onClick={() => updateOrderStatus(order._id || order.id, 'ready')} disabled={order.status === 'ready'}>Ready</button>
              <button onClick={() => updateOrderStatus(order._id || order.id, 'delivered')} disabled={order.status === 'delivered'}>Delivered</button>
              <button onClick={() => updateOrderStatus(order._id || order.id, 'cancelled')} disabled={order.status === 'cancelled'} className="cancel">Cancel</button>
            </div>
          </div>
        ))
        ) : (
          <div className="no-orders">
            <p>No orders to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
