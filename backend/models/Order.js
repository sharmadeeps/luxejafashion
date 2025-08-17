const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    size: String,
    color: String,
    quantity: Number,
    price: Number,
    salePrice: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    required: true
  },
  shippingAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  rewardPointsEarned: {
    type: Number,
    default: 0
  },
  rewardPointsUsed: {
    type: Number,
    default: 0
  },
  couponCode: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentId: String,
  trackingNumber: String,
  notes: String,
  statusHistory: [{
    status: String,
    date: Date,
    note: String
  }]
}, {
  timestamps: true
});

orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    this.rewardPointsEarned = Math.floor(this.totalAmount / 100) * 10;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);