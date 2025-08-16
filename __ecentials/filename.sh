#!/bin/bash

# Project root
mkdir -p luxury-fashion-ecommerce
cd luxury-fashion-ecommerce || exit

# ==========================
# Backend
# ==========================
mkdir -p backend/{config,controllers,middleware,models,routes,services,utils}
touch backend/{.env,.env.example,.gitignore,package.json,package-lock.json,server.js,Dockerfile}

# Backend config
touch backend/config/{database.js,redis.js}

# Backend controllers
touch backend/controllers/{auth.controller.js,product.controller.js,cart.controller.js,order.controller.js,user.controller.js,reward.controller.js,story.controller.js,admin.controller.js}

# Backend middleware
touch backend/middleware/{auth.middleware.js,error.middleware.js,upload.middleware.js,validation.middleware.js}

# Backend models
touch backend/models/{User.js,Product.js,Order.js,Cart.js,Category.js,Review.js,Story.js,Reward.js,Coupon.js}

# Backend routes
touch backend/routes/{auth.routes.js,product.routes.js,cart.routes.js,order.routes.js,user.routes.js,reward.routes.js,story.routes.js,admin.routes.js}

# Backend services
touch backend/services/{email.service.js,payment.service.js,cloudinary.service.js,analytics.service.js}

# Backend utils
touch backend/utils/{helpers.js,constants.js,validators.js}


# ==========================
# Frontend
# ==========================
mkdir -p frontend/{app,components,lib,store,styles,public/{images,fonts,icons}}
touch frontend/{.env.local,.env.local.example,.gitignore,next.config.js,tailwind.config.js,tsconfig.json,package.json,package-lock.json,Dockerfile}

# Frontend app structure
mkdir -p frontend/app/{(auth)/{login,register,forgot-password},(shop)/{products/[id],category/[slug],cart,checkout,wishlist},(user)/{profile,orders/[id],rewards},admin/{dashboard,products/{new,edit/[id]},orders,stories,users}}
touch frontend/app/{layout.tsx,page.tsx,globals.css}

# Auth pages
touch frontend/app/\(auth\)/login/page.tsx
touch frontend/app/\(auth\)/register/page.tsx
touch frontend/app/\(auth\)/forgot-password/page.tsx

# Shop pages
touch frontend/app/\(shop\)/products/page.tsx
touch frontend/app/\(shop\)/products/\[id\]/page.tsx
touch frontend/app/\(shop\)/category/\[slug\]/page.tsx
touch frontend/app/\(shop\)/cart/page.tsx
touch frontend/app/\(shop\)/checkout/page.tsx
touch frontend/app/\(shop\)/wishlist/page.tsx

# User pages
touch frontend/app/\(user\)/profile/page.tsx
touch frontend/app/\(user\)/orders/page.tsx
touch frontend/app/\(user\)/orders/\[id\]/page.tsx
touch frontend/app/\(user\)/rewards/page.tsx

# Admin pages
touch frontend/app/admin/dashboard/page.tsx
touch frontend/app/admin/products/page.tsx
touch frontend/app/admin/products/new/page.tsx
touch frontend/app/admin/products/edit/\[id\]/page.tsx
touch frontend/app/admin/orders/page.tsx
touch frontend/app/admin/stories/page.tsx
touch frontend/app/admin/users/page.tsx


# ==========================
# Frontend Components
# ==========================
mkdir -p frontend/components/{layout,home,product,cart,checkout,ui,admin}

# Layout components
touch frontend/components/layout/{Header.tsx,Footer.tsx,Navigation.tsx,MobileMenu.tsx}

# Home components
touch frontend/components/home/{HeroBanner.tsx,StoryReel.tsx,RewardsBar.tsx,FeaturedProducts.tsx,ShopByOccasion.tsx,BestSellers.tsx,InfluencerSection.tsx,Newsletter.tsx}

# Product components
touch frontend/components/product/{ProductCard.tsx,ProductGrid.tsx,ProductFilters.tsx,QuickViewModal.tsx,SizeGuide.tsx,ProductGallery.tsx,ReviewSection.tsx}

# Cart components
touch frontend/components/cart/{CartItem.tsx,CartSummary.tsx,CartDrawer.tsx}

# Checkout components
touch frontend/components/checkout/{ShippingForm.tsx,PaymentForm.tsx,OrderSummary.tsx,CheckoutSteps.tsx}

# UI components
touch frontend/components/ui/{Button.tsx,Input.tsx,Modal.tsx,Spinner.tsx,Badge.tsx,Toast.tsx}

# Admin components
touch frontend/components/admin/{StatsCard.tsx,RevenueChart.tsx,OrdersTable.tsx,ProductForm.tsx}


# ==========================
# Lib & Store
# ==========================
touch frontend/lib/{api.ts,utils.ts,constants.ts,hooks.ts}
touch frontend/store/{index.ts,authSlice.ts,cartSlice.ts,wishlistSlice.ts,types.ts}

# Styles
touch frontend/styles/globals.css


# ==========================
# Root files
# ==========================
touch docker-compose.yml
touch .gitignore
touch README.md

echo "✅ Luxury Fashion E-commerce folder structure created successfully!"