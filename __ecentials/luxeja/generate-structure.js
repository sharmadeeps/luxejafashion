const fs = require('fs');
const path = require('path');

const structure = {
  'luxury-fashion-ecommerce': {
    'backend': {
      'config': ['database.js', 'redis.js'],
      'controllers': [
        'auth.controller.js', 'product.controller.js', 'cart.controller.js',
        'order.controller.js', 'user.controller.js', 'reward.controller.js',
        'story.controller.js', 'admin.controller.js'
      ],
      'middleware': ['auth.middleware.js', 'error.middleware.js', 'upload.middleware.js', 'validation.middleware.js'],
      'models': ['User.js', 'Product.js', 'Order.js', 'Cart.js', 'Category.js', 'Review.js', 'Story.js', 'Reward.js', 'Coupon.js'],
      'routes': ['auth.routes.js',  'product.routes.js', 'cart.routes.js', 'order.routes.js', 'user.routes.js', 'reward.routes.js', 'story.routes.js', 'admin.routes.js'],
      'services': ['email.service.js', 'payment.service.js', 'cloudinary.service.js', 'analytics.service.js'],
      'utils': ['helpers.js', 'constants.js', 'validators.js'],
    },
    'frontend': {
      'app': {
        '(auth)': {
          'login': ['page.tsx'],
          'register': ['page.tsx'],
          'forgot-password': ['page.tsx']
        },
        // ... continue with all frontend folders/files
      }
      // ... continue with remaining structure
    },
    // ... root files
  }
};

function createStructure(base, obj) {
  for (const [key, value] of Object.entries(obj)) {
    const newPath = path.join(base, key);
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      fs.mkdirSync(newPath, { recursive: true });
      createStructure(newPath, value);
    } else if (Array.isArray(value)) {
      fs.mkdirSync(newPath, { recursive: true });
      value.forEach(file => {
        fs.writeFileSync(path.join(newPath, file), '');
      });
    } else {
      fs.writeFileSync(newPath, '');
    }
  }
}

createStructure('.', structure);