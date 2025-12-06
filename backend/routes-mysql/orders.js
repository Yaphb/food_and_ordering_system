const express = require('express');
const router = express.Router();
const Order = require('../models-mysql/Order');
const { auth, authorize } = require('../middleware/auth-mysql');

router.post('/', auth, async (req, res) => {
  try {
    const { items, deliveryAddress, phone, notes } = req.body;

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderItems = items.map(item => ({
      menuItemId: item.menuItem || item._id,
      quantity: item.quantity,
      price: item.price
    }));

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalPrice,
      deliveryAddress,
      phone,
      notes
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'customer') {
      orders = await Order.findByUserId(req.user.id);
    } else {
      orders = await Order.findAll();
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role === 'customer' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/:id/status', auth, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.updateStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
