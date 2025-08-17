const Product = require('../models/Product');
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      occasion,
      minPrice,
      maxPrice,
      size,
      color,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;
    
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (occasion) filter.occasionTags = occasion;
    if (minPrice || maxPrice) {
      filter.$or = [
        { salePrice: { $gte: minPrice || 0, $lte: maxPrice || 999999 } },
        { basePrice: { $gte: minPrice || 0, $lte: maxPrice || 999999 } }
      ];
    }
    if (size) filter['sizes.size'] = size;
    if (color) filter['colors.name'] = new RegExp(color, 'i');
    
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category');
    
    const count = await Product.countDocuments(filter);
    
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'firstName lastName' }
      });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Increment views
    product.views += 1;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const cacheKey = 'featured_products';
    
    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .limit(8)
    .populate('category');
    
    // Cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));
    
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ 
      isBestSeller: true, 
      isActive: true 
    })
    .limit(12)
    .populate('category');
    
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const products = await Product.find({
      'influencerTags.videoUrl': videoId,
      isActive: true
    }).populate('category');
    
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};