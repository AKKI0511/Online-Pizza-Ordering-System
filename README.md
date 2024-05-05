# QUICKBITE: Online Pizza Ordering System

## Demo:
https://youtu.be/N2tgaoicEms

## Project Overview

This application facilitates online ordering for Quickbite’s Pizza store, offering interfaces for customers to place orders and administrators to manage the menu and orders.

### Features

- User registration and authentication.
- Menu browsing with dynamic item pricing.
- Shopping cart functionality with custom item additions.
- Order placement and history viewing for logged-in users.
- Admin panel for managing menu items and orders.

## Installation

### Prerequisites

- Python 3.8+
- Node.js 12+
- PostgreSQL 12+

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AKKI0511/Online-Pizza-Ordering-System.git
   cd Online-Pizza-Ordering-System
   ```

2. **Set up the virtual environment and activate it:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database:**
   ```bash
   python manage.py migrate
   ```

5. **Run the development server:**
   ```bash
   python manage.py runserver
   ```


### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```


## Stripe API Setup

1. Navigate to backend/backend/settings.py
   ```bash
   STRIPE_SECRET_KEY = '[YOUR STRIPE SECRET KEY]'
   STRIPE_PUBLISHABLE_KEY = '[YOUR STRIPE PUBLIC KEY]'

   ```
2. Navigate to frontend/src/constants.js
   ```bash
   export const STRIPE_PUBLIC_KEY = '[YOUR STRIPE PUBLIC KEY]';
   ```

## Models Documentation

### UserProfile
- Extends Django's default User model.
- **Fields**:
  - `user`: OneToOneField linked to Django's User model.
  - `phone`: CharField, optional.
  - `address`: TextField, optional.

### MenuItem
- Represents an item available for order.
- **Fields**:
  - `name`: CharField, max length 100.
  - `price_small`: DecimalField, max digits 6, decimal places 2, optional.
  - `price_large`: DecimalField, max digits 6, decimal places 2, optional.
  - `category`: CharField, max length 50, choices: Pizza, Breads, Deserts.
  - `description`: TextField, optional.
  - `image`: ImageField, upload to 'menu_items/', optional. Path relative to MEDIA_ROOT.

### Topping
- Represents a topping option for menu items.
- **Fields**:
  - `name`: CharField, max length 100.
  - `price`: DecimalField, max digits 5, decimal places 2.

### Order
- Represents an order placed by a user.
- **Fields**:
  - `user`: ForeignKey linked to Django's User model.
  - `status`: CharField, max length 20, choices: Pending, Completed. Default: Pending.
  - `total_price`: DecimalField, max digits 8, decimal places 2, default 0.00.
  - `created_at`: DateTimeField, default timezone.now.
  - `updated_at`: DateTimeField, auto_now=True.

### OrderItem
- Represents an item in an order.
- **Fields**:
  - `order`: ForeignKey linked to Order model, related name 'items', on delete CASCADE.
  - `item`: ForeignKey linked to MenuItem model, on delete CASCADE.
  - `size`: CharField, max length 10, choices: Small, Large.
  - `quantity`: IntegerField, default 1.
  - `toppings`: ManyToManyField linked to Topping model, blank=True.

### Transaction
- Represents a transaction made by a user.
- **Fields**:
  - `user`: ForeignKey linked to Django's User model, related name 'transactions', on delete CASCADE.
  - `amount`: DecimalField, max digits 10, decimal places 2.
  - `timestamp`: DateTimeField, auto_now_add=True.
  - `stripe_charge_id`: CharField, max length 50.
  - `description`: CharField, max length 255, blank=True.
  - `paid`: BooleanField, default False. Set to True when payment is confirmed.


## Serializers

- **UserSerializer**: Handles user registration and data serialization.
- **ToppingSerializer**: Serializes Topping data.
- **MenuItemSerializer**: Serializes menu item data.
- **OrderSerializer**: Serializes order data including related order items.
- **OrderItemSerializer**: Serializes individual order items with customizations like toppings.
- **TransactionSerializer**: Serializes transaction objects, including fields such as id, user, amount, timestamp, stripe_charge_id, description, and paid. The user, timestamp, stripe_charge_id, and paid fields are read-only.


## Views

- **UserCreate**: Handles new user registration.
- **MenuItemViewSet**: CRUD operations on menu items, restricted to admin users.
- **ToppingViewSet**: Allows CRUD operations on toppings. Requires admin privileges for creating, updating, and deleting toppings.
- **OrderViewSet**: Manages orders, accessible only to authenticated users.
- **OrderItemViewSet**: Manages individual order items, ensures users can only modify their own orders.
- **StripeChargeView**: Allows authenticated users to make a payment using the Stripe API. The view accepts a POST request with the necessary payment information, such as the amount, payment method token (obtained with Stripe.js), and return URL. The view creates a PaymentIntent with the provided information and confirms the payment. If the payment is successful, a transaction record is created and returned as a response. If the payment fails, an error message is returned.


## API Endpoints

- `/api/users/` - POST for user registration.
- `/api/menuitems/` - GET for retrieving menu items, POST for adding new items (admin only).
- `/api/menuitems/<int:pk>/` - GET for retrieving menu item details.
- `/api/orders/` - GET and POST for managing orders.
- `/api/orderitems/` - POST for adding new order items, DELETE for removing items.
- `/api/charge/` - POST for payments using Stripe

## Security Measures

- Utilizes JWT for secure authentication across all endpoints.
- Permissions are set to restrict sensitive endpoints to authorized users only.

