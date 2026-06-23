# Product Requirements Document (PRD)

## Project Overview

Build a modern e-commerce website for a spice business named 'Aura Masale'.

The website should allow customers to browse products, create accounts, add items to cart, place orders, and track order history. Administrators should be able to manage products, categories, orders, users, homepage content, and inquiries through a secure admin dashboard.

The website should be fast, mobile-first, SEO-friendly, and easy for non-technical administrators to manage.

---

# Technology Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Responsive Design

## Backend Services

* Supabase PostgreSQL Database
* Supabase Authentication
* Cloudinary Image Storage
* Razorpay Payment Gateway

---

# User Roles

## Guest User

Can:

* View homepage
* Browse products
* Search products
* Filter products
* View product details
* Register account
* Login

Cannot:

* Access account area
* Place orders

---

## Customer

Can:

* Register
* Login
* Logout
* Manage profile
* Manage address
* Add products to cart
* Place orders
* View current orders
* View order history
* Track order status

---

## Administrator

Can:

* Login to admin dashboard
* Manage categories
* Manage products
* Manage product variants
* Manage product images
* View customers
* Manage orders
* Update order status
* View inquiries
* Manage hero slides
* Toggle site-wide announcements

Admin Architecture:

The application will have a single Admin.

Requirements:

* Only one admin account exists.
* No admin registration page.
* No admin management functionality.
* Admin credentials are defined through environment variables.
* During application startup:
* Create database tables if they do not exist.
Check whether the admin account exists.
If not, automatically create the admin account.

Example Environment Variables:

```env
ADMIN_EMAIL=admin@auramasale.com
ADMIN_PASSWORD=admin123
```
---

# Public Website Pages

## Home Page

Sections:

* Hero Carousel
* Featured Categories
* Featured Products
* Promotional Banner
* About Brand Section
* Call To Action
* Footer

Hero slides must be configurable through admin dashboard.

---

## Shop Page

Features:

* Product Grid
* Category Filters
* Search
* Sorting

Filters:

* Category
* Price Range

Product Card:

* Product Image
* Product Name
* Current Price
* Original Price
* Discount Percentage
* Rating
* Add To Cart

---

## Product Detail Page

Sections:

### Product Information

* Breadcrumbs
* Product Images Gallery
* Product Name
* Ratings
* Current Price
* Original Price
* Discount Percentage
* Variant Selection

### Trust Indicators

Display:

* Secure Transaction
* Non-Refundable Product
* Free Delivery Above ₹500

### Product Description

Rich text description.

### Additional Information

Table format.

Examples:

* Brand
* Weight
* Ingredients
* Storage Instructions
* Shelf Life

### Reviews

Display customer reviews.

### FAQ Section

Product-specific FAQ.

### Related Products

Display recommended products.

---

## About Page

Sections:

* Company Story
* Mission
* Quality Commitment
* Manufacturing Information

---

## Contact Page

Sections:

* Contact Form
* Address
* Phone Number
* Email
* Google Map

Contact submissions should be stored in database.

---

# Authentication

## Registration

Fields:

* Full Name
* Email
* Phone Number
* Password

Email verification is NOT required for initial release.

Account becomes active immediately after registration.

---

## Login

Fields:

* Email
* Password

---

## Forgot Password

Can be implemented later.

Not required for initial release.

---

# Customer Account Area

## Profile

Display:

* Name
* Email
* Phone Number

Allow updates.

---

## Address Management

Allow:

* Add Address
* Edit Address
* Delete Address

One address can be selected as default.

---

## Order History

Display:

* Order Number
* Order Date
* Status
* Total Amount

---

## Order Detail

Display:

* Ordered Items
* Quantities
* Prices
* Shipping Address
* Payment Status
* Order Status

---

# Shopping Cart

Features:

* Add Item
* Remove Item
* Update Quantity
* Calculate Total
* Persist Cart for Logged-In Users

---

# Checkout

Steps:

1. Select Address
2. Review Order
3. Payment

---

# Payment Integration

Provider:

* Razorpay

Requirements:

* Create Razorpay Order
* Complete Payment
* Verify Payment Signature Server-Side
* Mark Order Paid Only After Successful Verification

Never trust frontend payment success alone.

---

# Order Management

Order Status Values:

* Pending
* Paid
* Processing
* Shipped
* Delivered
* Cancelled

Admin can update status.

Customers can view status.

---

# Admin Dashboard

## Dashboard Overview

Display:

* Total Orders
* Total Customers
* Total Products
* Recent Orders

---

## Category Management

CRUD Operations:

* Create Category
* Edit Category
* Delete Category
* Activate/Deactivate Category

---

## Product Management

CRUD Operations:

* Create Product
* Edit Product
* Delete Product

Fields:

* Category
* Name
* Slug
* Description
* Images
* Additional Information
* FAQ
* Status

---

## Product Variant Management

Each product can have multiple variants.

Examples:

* 100g
* 250g
* 500g
* 1kg

Each variant contains:

* Price
* Original Price
* Stock Quantity
* Active Status

---

## Product Image Management

Upload Images:

* Cloudinary

Store URLs in database.

Support:

* Multiple Images
* Sort Order
* Featured Image

---

## Customer Management

Display:

* Customer Information
* Registration Date
* Order Count

---

## Order Management

Display:

* Customer
* Products
* Total Amount
* Payment Status
* Order Status

Allow status updates.

---

## Inquiry Management

Display all contact form submissions.

Fields:

* Name
* Email
* Phone
* Message
* Date

---

## Hero Slide Management

CRUD Operations.

Fields:

* Title
* Subtitle
* Image
* Button Text
* Button Link
* Active Status

---

## Announcement Management

Single site-wide announcement banner.

Fields:

* Message
* Active Status

---

# SEO Requirements

All products must support:

* SEO Title
* SEO Description
* SEO Slug

Friendly URLs:

/products/turmeric-powder

instead of

/products/15

---

# Performance Requirements

* Mobile-first design
* Responsive layouts
* Optimized images
* Lazy-loaded images
* Fast page load times

---

# Out Of Scope (Version 1)

Do NOT implement:

* Coupons
* Discount Codes
* Wishlist
* Loyalty Programs
* Newsletter
* Blog
* Email Marketing
* Multi-Vendor Support
* Inventory Warehouses
* Advanced Analytics
* SMS Notifications
* Push Notifications
* Social Login
* OTP Login
* Multi-language Support

---

# Success Criteria

A customer should be able to:

1. Register account
2. Browse products
3. Select product variant
4. Add to cart
5. Complete Razorpay payment
6. View order history

An administrator should be able to:

1. Manage products
2. Manage categories
3. Manage orders
4. Manage homepage content
5. View inquiries

without requiring developer assistance.
