import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [orderData, setOrderData] = useState({
    deliveryAddress: user?.address || '',
    phone: user?.phone || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(item => ({
        menuItem: item.id || item._id,
        quantity: item.quantity,
        price: parseFloat(item.price)
      }));

      await axios.post(`${API_URL}/api/orders`, {
        items,
        ...orderData
      });

      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart is Empty</h2>
        <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id || item._id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>RM{parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">RM{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
            <button onClick={() => removeFromCart(item.id || item._id)} className="btn-remove">Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: RM{getTotal().toFixed(2)}</h3>
      </div>
      <form onSubmit={handleSubmitOrder} className="checkout-form">
        <h3>Delivery Information</h3>
        <input
          type="text"
          placeholder="Delivery Address"
          value={orderData.deliveryAddress}
          onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={orderData.phone}
          onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
          required
        />
        <textarea
          placeholder="Order Notes (optional)"
          value={orderData.notes}
          onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Cart;
