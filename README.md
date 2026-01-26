Frontend (React + TypeScript)
==========================================
Built an admin dashboard using React.

Products are displayed in a table with:

Main image

Gallery thumbnails

Product details (title, category, price, discount)

Used state management to handle:

Product listing

Pagination

Loading & delete states

On user actions (Add / Edit / Delete), the frontend:

Calls REST APIs using fetch / axios
==========================================================================
Backend (Node.js + Express)
=================================================
Created REST APIs for:

Add product

Fetch products

Update product

Delete product

Used Multer middleware to handle:

Single product image

Multiple gallery images

Images are stored in the uploads folder

Image paths are saved in the database and returned to frontend

Updates UI instantly after API success
--------------------------------------------------------------------------------------
On delete:

Product record is removed

Related images are also removed from storage
==============================================================
Image Rendering Flow
Backend sends image paths (e.g. /uploads/img.jpg)

Frontend dynamically builds full URLs

Gallery images are rendered as thumbnails

Fallback images are shown if any image fails to load
