import React, { useState } from 'react';
import axios from '../axios';
import 'trix/dist/trix.css';
import 'trix';

function AddProducts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImgurl] = useState('');
  const [gallery, setGalImgurl] = useState('');

  // ✅ Update hidden input directly from Trix editor
  const handleTrixChange = (e) => {
    setDescription(e.target.innerHTML);
  };

  const addProduct = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/addproduct", {
      title,
      description,
      price,
      category,
      image,
      gallery
    })
    .then((response) => {
      console.log("✅ Product added:", response.data);

      // Resetting input values
      setTitle('');
      setDescription('');
      setPrice(0);
      setCategory('');
      setImgurl('');
      setGalImgurl('');
    })
    .catch((error) => {
      console.error("❌ Error adding product:", error.message);
    });
  };

  return (
    <div>
      <h1 className="text-center mt-4">Add Products</h1>

      <form className="w-50 mx-auto mt-4" onSubmit={addProduct}>
        <div className="mb-3">
          <label className="form-label">Add Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            autoFocus
          />
        </div>

            <div className="mb-3">
          <label className="form-label">Product Description</label>
          <textarea
            className="form-control"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
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
          <label className="form-label">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImgurl(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gallery Image URL</label>
          <input
            type="text"
            value={gallery}
            onChange={(e) => setGalImgurl(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default AddProducts;
