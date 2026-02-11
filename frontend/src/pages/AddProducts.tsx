import React, { useState } from 'react';
import axios from '../axios';
import 'trix/dist/trix.css';
import 'trix';
import { ToastContainer,toast } from 'react-toastify';// used for error /suss msg on poup
import 'react-toastify/dist/ReactToastify.css';

// Get API base URL from environment or use localhost
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  return window.location.origin;
};

function AddProducts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<FileList | null>(null);

  // ✅ Update hidden input directly from Trix editor
  const handleTrixChange = (e) => {
    setDescription(e.target.innerHTML);
  };
   
  const addProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }
    if (gallery) {
      Array.from(gallery).forEach((file) => {
        formData.append('gallery', file);
      });
    }

    axios.post(`${getApiUrl()}/api/addproduct`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        toast.success(" Product added Successfully!");
        console.log("✅ Product added:", response.data);
        // Resetting input values
        setTitle('');
        setDescription('');
        setPrice(0);
        setCategory('');
        setImage(null);
        setGallery(null);
      })
      .catch((error) => {
       
        toast.error("❌  Product information is missing");
        console.error("❌ Error adding product:", error.message);
      });
  };

  return (
    <div>
      <ToastContainer position="top-right"  />
      <h1 className="text-center mt-4">Add new product</h1>

      <form className="w-50 mx-auto mt-4" onSubmit={addProduct}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            autoFocus
            placeholder='Product name'
          />
        </div>

            <div className="mb-3">
          <label className="form-label">Product Description</label>
          <textarea
            className="form-control"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
           
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGallery(e.target.files)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default AddProducts;
