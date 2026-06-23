# Database Schema Design

## Overview

This document defines the database schema for the Spice E-Commerce Platform.

Technology:

* Supabase PostgreSQL
* Supabase Auth
* Cloudinary (image storage)

Notes:

* Only one Admin exists.
* Customer authentication is handled by Supabase Auth.
* Product images are stored in Cloudinary; only image URLs are stored in the database.
* Product variants are stored separately to support multiple sizes and prices.

---

# Authentication

## auth.users (Supabase Managed)

Managed by Supabase Auth.

Stores:

* User ID
* Email
* Password Hash
* Authentication Metadata

Do not modify directly.

---

# User Profiles

## profiles

Stores customer profile information.

| Column     | Type         | Notes                    |
| ---------- | ------------ | ------------------------ |
| id         | UUID PK      | References auth.users.id |
| full_name  | VARCHAR(255) | Required                 |
| email      | VARCHAR(255) | Required                 |
| phone      | VARCHAR(20)  | Required                 |
| role       | VARCHAR(20)  | customer / admin         |
| is_active  | BOOLEAN      | Default true             |
| created_at | TIMESTAMP    |                          |
| updated_at | TIMESTAMP    |                          |

### Notes

* Every authenticated user has one profile.
* Only one profile should have role = admin.
* Admin account is seeded during application startup.

---

# Customer Addresses

## addresses

Stores customer shipping addresses.

| Column         | Type         | Notes |
| -------------- | ------------ | ----- |
| id             | UUID PK      |       |
| user_id        | UUID FK      |       |
| full_name      | VARCHAR(255) |       |
| phone          | VARCHAR(20)  |       |
| address_line_1 | TEXT         |       |
| address_line_2 | TEXT         |       |
| city           | VARCHAR(100) |       |
| state          | VARCHAR(100) |       |
| postal_code    | VARCHAR(20)  |       |
| country        | VARCHAR(100) |       |
| is_default     | BOOLEAN      |       |
| created_at     | TIMESTAMP    |       |
| updated_at     | TIMESTAMP    |       |

### Relationships

* One User → Many Addresses

---

# Categories

## categories

| Column      | Type                | Notes |
| ----------- | ------------------- | ----- |
| id          | UUID PK             |       |
| name        | VARCHAR(255)        |       |
| slug        | VARCHAR(255) UNIQUE |       |
| description | TEXT                |       |
| is_active   | BOOLEAN             |       |
| created_at  | TIMESTAMP           |       |
| updated_at  | TIMESTAMP           |       |

### Examples

* Whole Spices
* Ground Spices
* Spice Blends

---

# Products

## products

| Column             | Type                | Notes |
| ------------------ | ------------------- | ----- |
| id                 | UUID PK             |       |
| category_id        | UUID FK             |       |
| name               | VARCHAR(255)        |       |
| slug               | VARCHAR(255) UNIQUE |       |
| short_description  | TEXT                |       |
| description        | TEXT                |       |
| featured_image_url | TEXT                |       |
| average_rating     | DECIMAL(3,2)        |       |
| review_count       | INTEGER             |       |
| is_active          | BOOLEAN             |       |
| seo_title          | VARCHAR(255)        |       |
| seo_description    | TEXT                |       |
| created_at         | TIMESTAMP           |       |
| updated_at         | TIMESTAMP           |       |

### Notes

* One product belongs to one category.
* One product can have many variants.
* One product can have many images.
* Ratings are calculated from reviews.

---

# Product Variants

## product_variants

Stores size-based variants.

| Column         | Type          | Notes |
| -------------- | ------------- | ----- |
| id             | UUID PK       |       |
| product_id     | UUID FK       |       |
| variant_name   | VARCHAR(100)  |       |
| price          | DECIMAL(10,2) |       |
| original_price | DECIMAL(10,2) |       |
| stock_quantity | INTEGER       |       |
| is_active      | BOOLEAN       |       |
| created_at     | TIMESTAMP     |       |
| updated_at     | TIMESTAMP     |       |

### Examples

| Variant |
| ------- |
| 100g    |
| 250g    |
| 500g    |
| 1kg     |

### Notes

* Each variant has independent pricing.
* Each variant has independent stock.

---

# Product Images

## product_images

Stores multiple Cloudinary images per product.

| Column     | Type      | Notes |
| ---------- | --------- | ----- |
| id         | UUID PK   |       |
| product_id | UUID FK   |       |
| image_url  | TEXT      |       |
| sort_order | INTEGER   |       |
| created_at | TIMESTAMP |       |

### Notes

* Images stored in Cloudinary.
* URLs stored in database.
* Supports gallery display.

---

# Additional Product Information

## product_information

Used for specifications table.

| Column        | Type         | Notes |
| ------------- | ------------ | ----- |
| id            | UUID PK      |       |
| product_id    | UUID FK      |       |
| label         | VARCHAR(255) |       |
| value         | TEXT         |       |
| display_order | INTEGER      |       |

### Examples

| Label      | Value            |
| ---------- | ---------------- |
| Brand      | SpiceCo          |
| Shelf Life | 12 Months        |
| Storage    | Cool & Dry Place |

---

# Product FAQs

## product_faqs

| Column        | Type    | Notes |
| ------------- | ------- | ----- |
| id            | UUID PK |       |
| product_id    | UUID FK |       |
| question      | TEXT    |       |
| answer        | TEXT    |       |
| display_order | INTEGER |       |

---

# Product Reviews

## reviews

| Column      | Type      | Notes |
| ----------- | --------- | ----- |
| id          | UUID PK   |       |
| product_id  | UUID FK   |       |
| user_id     | UUID FK   |       |
| rating      | INTEGER   |       |
| review_text | TEXT      |       |
| is_approved | BOOLEAN   |       |
| created_at  | TIMESTAMP |       |

### Notes

* Rating range: 1-5
* Reviews require admin approval before display.

---

# Shopping Cart

## cart_items

| Column     | Type      | Notes |
| ---------- | --------- | ----- |
| id         | UUID PK   |       |
| user_id    | UUID FK   |       |
| variant_id | UUID FK   |       |
| quantity   | INTEGER   |       |
| created_at | TIMESTAMP |       |
| updated_at | TIMESTAMP |       |

### Relationships

* One User → Many Cart Items

---

# Orders

## orders

| Column              | Type               | Notes |
| ------------------- | ------------------ | ----- |
| id                  | UUID PK            |       |
| order_number        | VARCHAR(50) UNIQUE |       |
| user_id             | UUID FK            |       |
| address_id          | UUID FK            |       |
| subtotal            | DECIMAL(10,2)      |       |
| shipping_cost       | DECIMAL(10,2)      |       |
| total_amount        | DECIMAL(10,2)      |       |
| payment_status      | VARCHAR(20)        |       |
| order_status        | VARCHAR(20)        |       |
| payment_method      | VARCHAR(50)        |       |
| razorpay_order_id   | VARCHAR(255)       |       |
| razorpay_payment_id | VARCHAR(255)       |       |
| created_at          | TIMESTAMP          |       |
| updated_at          | TIMESTAMP          |       |

### Payment Status Values

* pending
* paid
* failed
* refunded

### Order Status Values

* pending
* processing
* shipped
* delivered
* cancelled

---

# Order Items

## order_items

| Column            | Type          | Notes |
| ----------------- | ------------- | ----- |
| id                | UUID PK       |       |
| order_id          | UUID FK       |       |
| product_id        | UUID FK       |       |
| variant_id        | UUID FK       |       |
| product_name      | VARCHAR(255)  |       |
| variant_name      | VARCHAR(100)  |       |
| price_at_purchase | DECIMAL(10,2) |       |
| quantity          | INTEGER       |       |
| line_total        | DECIMAL(10,2) |       |

### Notes

Store product and variant names at purchase time.

This preserves order history even if products change later.

---

# Contact Inquiries

## inquiries

| Column      | Type         | Notes |
| ----------- | ------------ | ----- |
| id          | UUID PK      |       |
| name        | VARCHAR(255) |       |
| email       | VARCHAR(255) |       |
| phone       | VARCHAR(20)  |       |
| message     | TEXT         |       |
| is_resolved | BOOLEAN      |       |
| created_at  | TIMESTAMP    |       |

---

# Hero Slides

## hero_slides

| Column        | Type         | Notes |
| ------------- | ------------ | ----- |
| id            | UUID PK      |       |
| title         | VARCHAR(255) |       |
| subtitle      | TEXT         |       |
| image_url     | TEXT         |       |
| button_text   | VARCHAR(100) |       |
| button_link   | VARCHAR(255) |       |
| display_order | INTEGER      |       |
| is_active     | BOOLEAN      |       |
| created_at    | TIMESTAMP    |       |
| updated_at    | TIMESTAMP    |       |

---

# Announcement Banner

## announcements

Single active announcement.

| Column     | Type      | Notes |
| ---------- | --------- | ----- |
| id         | UUID PK   |       |
| message    | TEXT      |       |
| is_active  | BOOLEAN   |       |
| created_at | TIMESTAMP |       |
| updated_at | TIMESTAMP |       |

---

# Relationships Summary

profiles
└── addresses

categories
└── products

products
├── product_variants
├── product_images
├── product_information
├── product_faqs
└── reviews

profiles
├── cart_items
├── orders
└── reviews

orders
└── order_items

---

# Initial Seed Data

## Admin User

Automatically create during startup if not found.

Role:

* admin

## Default Categories

Optionally seed:

* Whole Spices
* Ground Spices
* Spice Blends

---

# Future Expansion (Not Required in V1)

Potential future tables:

* coupons
* wishlists
* inventory_transactions
* newsletters
* blog_posts
* shipping_providers
* order_tracking_events
* loyalty_points

These are intentionally excluded from Version 1.
