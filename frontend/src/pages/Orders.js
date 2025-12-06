import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
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

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      preparing: '#2196f3',
      ready: '#4caf50',
      delivered: '#8bc34a',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h2>No orders yet</h2>
        <p>Start ordering from our menu!</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Order History</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id || order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-MY', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <span className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span className="item-name">{item.menuItem?.name || 'Item'} <span className="item-qty">x{item.quantity}</span></span>
                  <span className="item-price">RM{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <div className="order-details">
                <div><strong>Delivery Address:</strong> {order.deliveryAddress}</div>
                <div><strong>Contact:</strong> {order.phone}</div>
              </div>
              <div className="order-total">
                <strong>Total:</strong> <span className="total-amount">RM{parseFloat(order.totalPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
