# ⌚ The Watch Lab - Luxury Watch Dropshipping Fullstack App

A modern, high-converting fullstack e-commerce web application built for watch dropshipping.

---

## 🌟 Key Features

### 🛒 Frontend Storefront (`/client`)
- **Luxury Aesthetic**: Dark metallic theme with gold accents, tailored for watches.
- **Product Catalog & Filtering**: Filter by category (*Chronograph, Automatic, Minimalist, Diver, Smart Hybrid*), gender (*Men, Women, Unisex*), price sorting, and live search.
- **Interactive Product Modal**: Detailed technical spec sheet (*Movement, Case Diameter, Water Resistance, Glass Crystal*), customer reviews, and quantity selector.
- **Slide-over Shopping Cart**: Automated promo coupon support (`WATCHLAB20` for 20% OFF), dynamic free shipping progress bar, and currency conversion ($ USD, € EUR, DH MAD).
- **Checkout Flow**: Complete shipping form, Cash on Delivery (COD) / Credit Card / PayPal selection, and automated tracking code generator.
- **Live Order Tracker**: Real-time shipment status tracker (*Order Placed ➔ Processing ➔ Shipped ➔ Out for Delivery ➔ Delivered*).
- **Seller Admin Dashboard**: Total revenue metrics, order count, catalog metrics, and shipment status update controls.

### ⚙️ Backend API & Database (`/server`)
- **Express.js API**: RESTful API endpoints for products, orders, search, and tracking.
- **MongoDB Atlas Integration**: Mongoose ORM models for `Product` and `Order`.
- **In-Memory Fallback Mode**: Gracefully works even if offline or before database connection.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
Edit `server/.env` and insert your MongoDB Atlas URI:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/the_watch_lab?retryWrites=true&w=majority
```

### 3. Seed Initial Watches Catalog (Optional)
```bash
npm run seed --prefix server
```

### 4. Launch Application
In two terminal windows:

- **Terminal 1 (Backend API)**:
  ```bash
  cd server
  npm run dev
  ```

- **Terminal 2 (Frontend React App)**:
  ```bash
  cd client
  npm run dev
  ```

Open your browser at `http://localhost:3000` to view **The Watch Lab**.

---

## 🏷️ Test Promo Coupon
- Enter coupon **`WATCHLAB20`** in the cart drawer for **20% OFF**.
