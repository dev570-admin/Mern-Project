import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../axios';
import { toast } from 'react-toastify';
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

// Define the Product type
type Product = {
  id?: string | number;
  productId?: string | number;
  title: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  image?: string;
  gallery?: string[];
};

export default function Home() {
  console.log('Rendering Home component');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [loggedInUser, setLoggedInUser] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Debug mount
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    console.log('Starting to fetch products...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('Making API request to get products');
      const response = await axios.get(`${getApiUrl()}/api/getallproducts`, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('API Response:', {
        status: response.status,
        data: response.data ? 'Data received' : 'No data',
        isArray: Array.isArray(response.data)
      });
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Loaded ${response.data.length} products`);
        setProducts(response.data);
      } else {
        console.warn('Unexpected response format:', response.data);
        setError('Unexpected response format from server');
      }
    } catch (err: any) {
      const errorMsg = err.response 
        ? `Server responded with ${err.response.status}: ${err.response.statusText}`
        : err.message || 'Network error';
      
      console.error('Error fetching products:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(`Failed to load products: ${errorMsg}`);
      toast.error(`Failed to load products: ${errorMsg}`);
    } finally {
      console.log('Finished loading, setting loading to false');
      setLoading(false);
    }
  }, []);

  // Handle product edit
  const handleEdit = (productId: string | number | undefined) => {
    if (!productId) return;
    navigate(`/edit-product/${productId}`);
  };

  // Handle product delete
  const handleDelete = async (productId: string | number | undefined) => {
    if (!productId) {
      toast.error('No product ID provided');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setIsDeleting(String(productId));
      await axios.delete(`${getApiUrl()}/api/addproduct/${productId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Update the products list
      fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  // Load products on component mount
  useEffect(() => {
    console.log('useEffect - Component mounted or fetchProducts changed');
    
    const name = localStorage.getItem("name");
    console.log('User from localStorage:', name || 'Not found');
    
    if (name) {
      setLoggedInUser(name);
    }
    
    // Add a small delay to help with debugging
    const timer = setTimeout(() => {
      console.log('Starting to fetch products...');
      fetchProducts().catch(err => {
        console.error('Error in fetchProducts:', err);
      });
    }, 100);
    
    return () => {
      console.log('Cleaning up...');
      clearTimeout(timer);
    };
  }, [fetchProducts]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Format price helper function
  const formatPrice = (price: any): string => {
    if (price === null || price === undefined) return 'N/A';
    const num = Number(price);
    return isNaN(num) ? 'N/A' : `₹${num.toFixed(2)}`;
  };

  // Debug render
  console.log('Rendering with state:', {
    loading,
    productsCount: products.length,
    currentPage,
    totalPages,
    error
  });

  // Simple loading and error states
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Error Loading Products</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h2>✅ Hello: {loggedInUser}</h2>
      </div>

      {/* Product Dashboard Header */}
      <div className="row justify-content-md-center mt-4 align-items-center">
        <h2 className="col-md-6 text-center">Product Dashboard</h2>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/addproducts")}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <>
          {/* Products Table */}
          <div className="table-responsive mt-3">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Gallery</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id || product.productId}>
                    <td>
                      <img
                        src={
                          product.image 
                            ? `${getApiUrl()}${product.image}`
                            : 'https://via.placeholder.com/40x40?text=No+Image'
                        }
                        alt={product.title}
                        width="40"
                        height="40"
                        className="rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=No+Image';
                        }}
                      />
                    </td>
                    <td>
                      {product.gallery?.length ? (
                        <div className="d-flex flex-wrap gap-1">
                          {product.gallery.slice(0, 3).map((img, i) => (
                            <img
                              key={i}
                              src={`${getApiUrl()}${img}`}
                              alt={`Gallery ${i + 1}`}
                              width="30"
                              height="30"
                              className="rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/30x30?text=No+Img';
                              }}
                            />
                          ))}
                          {product.gallery.length > 3 && (
                            <span className="badge bg-secondary">+{product.gallery.length - 3} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">No images</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <strong>{product.title}</strong>
                        <p className="text-muted small mb-0">
                          {product.description?.slice(0, 50)}
                          {product.description && product.description.length > 50 && '...'}
                        </p>
                        <small className="text-secondary">ID: {product.productId || product.id}</small>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.discount}%</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(product.id || product.productId)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product.id || product.productId)}
                          disabled={isDeleting === String(product.id || product.productId)}
                        >
                          {isDeleting === String(product.id || product.productId) ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="d-flex justify-content-center my-4">
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <li key={pageNum} className="page-item">
                        <button
                          className={`page-link ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-info mt-4">
          No products found. Click 'Add Product' to add your first product.
        </div>
      )}
    </div>
  );
}
