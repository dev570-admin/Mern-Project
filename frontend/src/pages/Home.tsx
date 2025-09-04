
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Product = {
  title: string;
  description: string;
  category: string;
  price: number;
  discount:number;
  id?: string | number;
};

export default function Home() {
  const [CurrentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of products per page
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setLoggedInUser(name);
    }
    fetchProducts();  // Try fetching products regardless of cookie
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/getallproducts', {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await res.json();
      console.log('📦 API Product Response:', data); // 👈 LOG THIS

      setProducts(data);
    } catch (err) {
      console.error('❌ Failed to fetch products:', err);
    }
  };
 // calculate indexes for pagination
 
 const indexOfLastItem = CurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  //change page 
  const TotalPages = Math.ceil(products.length / itemsPerPage);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        credentials: "include"
      });

      localStorage.clear(); // Clears name/email/token

      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="container">
      {/* Header Row */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h2>✅ Hello: {loggedInUser}</h2>
        {/* Logout button removed, use common header button */}
      </div>

      {/* Product Title and Add Button */}
      <div className="row justify-content-md-center mt-4 align-items-center">
        <h2 className="col-md-6 text-center">Product Dashboard</h2>
        <div className="col-md-6 text-end">
          <p> <b> Default Sattic products are sets </b></p>
          <button className="btn btn-success me-2" onClick={()=> navigate('/addproducts')}>➕ Add Product</button>
        </div>
      </div>

      {/* Product List */}
      <div className="row mt-3">
        {products.length > 0 ? (
          currentProducts.map((product,index) => (
            <div className="col-md-4" key={product.id}> 
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                   <p className="card-text"> Product ID: {product.productId}</p>
                  <p className="card-text">Description: {product.description.split("").slice(0,50).join("")}...</p>
                  <p className="card-text"><strong>Category:</strong> {product.category}</p>
                  <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                  <p className="card-text"><strong>Discount:</strong> ${product.discount} %</p>
                </div>
              </div>
              <div className="mb-4">
                <button className="btn btn-primary me-2">✏️ Edit Product</button>
                <button className="btn btn-danger">🗑️ Delete Product</button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted mt-4">
            No products retives ! Due to network  connection or less products. 
            <p>Wait or logged out and logged in again</p>
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="d-flex justify-content-center my-4 align-items-center">
        <button className="btn btn-secondary me-2" 
          onClick={()=> setCurrentPage((prev) => Math.max(prev- 1,1))}
          disabled={CurrentPage === 1}
        > ◀ Prev</button>

        {/* Page number buttons */}
        {Array.from({ length: TotalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`btn btn-outline-primary mx-1${CurrentPage === i + 1 ? ' active' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-secondary ms-2"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, TotalPages))}
          disabled={CurrentPage === TotalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

