import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';  

type Product = {
  title: string;
  description: string;
  category: string;
  price: number;
  discount:number;

};

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
 // const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();


=======
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

>>>>>>> 59685a40d071d0ca8a7d5ffd171ba8f9c5d06362
  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setLoggedInUser(name);
    }
<<<<<<< HEAD

    fetchProducts();  // Try fetching products regardless of cookie
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/product', {
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
 fetchProducts();
 
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
          products.map((product,index) => (
          
            <div className="col-md-4" key={product.id}> 
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                   <p className="card-text"> Product ID: {product.id}</p>
                  <p className="card-text">{product.description}</p>
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
      
=======
  }, []);

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "GET",
      credentials: "include" // ✅ To include the cookie in request
    });

    // Clear frontend data (optional but good)
    localStorage.removeItem('name');
    localStorage.removeItem('email');

    // Redirect after short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);

  } catch (error) {
    console.error("Logout failed", error);
  }
};

  return (
    <div container>
      <h2>✅ Helo: {loggedInUser}</h2>
      
        <button type="button" className="btn btn-danger mt-3" onClick={handleLogout} style={{ marginLeft: '15px',}}>Logout</button>
      <div className='row justify-content-md-center '> 
        <h2 className='col-md-6 text-center'> Product Data </h2>
        </div>
>>>>>>> 59685a40d071d0ca8a7d5ffd171ba8f9c5d06362
    </div>
  );
}
