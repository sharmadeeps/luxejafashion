const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  occasionTags: [{
    type: String,
    enum: ['wedding', 'party', 'casual', 'work', 'cocktail', 'formal']
  }],
  sizes: [{
    size: String,
    stock: Number
  }],
  colors: [{
    name: String,
    hex: String,
    images: [String]
  }],
  materials: [String],
  careInstructions: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  images: [String],
  videoUrls: [String],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  influencerTags: [{
    influencerName: String,
    videoUrl: String
  }],
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ occasionTags: 1 });
productSchema.index({ basePrice: 1, salePrice: 1 });

module.exports = mongoose.model('Product', productSchema);