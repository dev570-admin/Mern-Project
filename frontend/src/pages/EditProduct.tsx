import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  _id: string;
  productId: string | number;
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  gallery: string[];
  discount?: number;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    gallery: [],
    discount: 0
  });
  
  const [previewImage, setPreviewImage] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/addproduct/${id}`, {
          withCredentials: true
        });

        console.log('Product data received:', response.data);

        if (isMounted) {
          setProduct(response.data);
          // Set initial previews immediately
          if (response.data.image && typeof response.data.image === 'string') {
            setPreviewImage(`http://localhost:5000${response.data.image}`);
          }
          if (response.data.gallery && response.data.gallery.length > 0) {
            setGalleryPreviews(response.data.gallery.map((img: string) => `http://localhost:5000${img}`));
          }
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        console.error('Error response:', error.response?.data);
        toast.error('Failed to load product details');
        if (isMounted) {
          navigate('/home');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    } else {
      console.error('No product ID provided');
      toast.error('No product ID provided');
      navigate('/home');
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // Handle text/select input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discount' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Handle main image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate image type
    if (!file.type.startsWith('image/')) {
      setValidationErrors(prev => ({
        ...prev,
        image: 'Please upload a valid image file'
      }));
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Update product state
    setProduct(prev => ({
      ...prev,
      image: file
    }));
  };
  
  // Handle gallery images
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      setValidationErrors(prev => ({
        ...prev,
        gallery: 'Please upload valid image files'
      }));
      return;
    }
    
    // Create previews
    const readers = validFiles.map(file => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(readers).then(previews => {
      setGalleryPreviews(prev => [...prev, ...previews]);
    });
    
    // Update product state
    setProduct(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), ...validFiles]
    }));
  };
  
  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setProduct(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!product.title?.trim()) errors.title = 'Title is required';
    if (!product.description?.trim()) errors.description = 'Description is required';
    if (!product.price || Number(product.price) <= 0) errors.price = 'Valid price is required';
    if (!product.category?.trim()) errors.category = 'Category is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    if (!id) {
      toast.error('No product ID provided');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      
      // Add all product fields to formData
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'gallery' && Array.isArray(value)) {
          // Handle gallery files
          value.forEach((file, index) => {
            if (file instanceof File) {
              formData.append('gallery', file);
            }
          });
        } else if (value !== null && value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      const response = await axios.put(
        `http://localhost:5000/api/addproduct/${id}`, 
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success('Product updated successfully!', {
        onClose: () => navigate('/home')
      });
      
    } catch (error: any) {
      console.error('Error updating product:', error);
      
      // Handle validation errors from server
      if (error.response?.status === 400 && error.response.data?.errors) {
        const serverErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.path) serverErrors[err.path] = err.msg;
        });
        setValidationErrors(serverErrors);
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to update product';
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  // Remove the duplicate loading check and useEffect for previews
  // Set up initial previews when product data loads
  useEffect(() => {
    if (product.image && typeof product.image === 'string') {
      setPreviewImage(`http://localhost:5000${product.image}`);
    }

    if (product.gallery && product.gallery.length > 0 && typeof product.gallery[0] === 'string') {
      setGalleryPreviews((product.gallery as string[]).map(img => `http://localhost:5000${img}`));
    }
  }, [product.image, product.gallery]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product details...</p>
        <p className="text-muted small">Fetching product with ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Product</h2>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate(-1)}
        >
          ← Back to Products
        </button>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={product.title || ''}
                    onChange={handleInputChange}
                    className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                    placeholder="Enter product title"
                  />
                  {validationErrors.title && (
                    <div className="invalid-feedback">{validationErrors.title}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Description <span className="text-danger">*</span></label>
                  <textarea
                    name="description"
                    value={product.description || ''}
                    onChange={handleInputChange}
                    className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                    rows={6}
                    placeholder="Enter product description"
                  />
                  {validationErrors.description && (
                    <div className="text-danger small mt-1">{validationErrors.description}</div>
                  )}
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Price (₹) <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          name="price"
                          value={product.price || ''}
                          onChange={handleInputChange}
                          className={`form-control ${validationErrors.price ? 'is-invalid' : ''}`}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                      </div>
                      {validationErrors.price && (
                        <div className="text-danger small mt-1">{validationErrors.price}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Discount (%)</label>
                      <div className="input-group">
                        <input
                          type="number"
                          name="discount"
                          value={product.discount || 0}
                          onChange={handleInputChange}
                          className={`form-control ${validationErrors.discount ? 'is-invalid' : ''}`}
                          min="0"
                          max="100"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      {validationErrors.discount && (
                        <div className="text-danger small mt-1">{validationErrors.discount}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Category <span className="text-danger">*</span></label>
                  <select
                    name="category"
                    value={product.category || ''}
                    onChange={handleInputChange}
                    className={`form-select ${validationErrors.category ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                  {validationErrors.category && (
                    <div className="text-danger small mt-1">{validationErrors.category}</div>
                  )}
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="mb-4">
                  <label className="form-label fw-bold">Main Image <span className="text-danger">*</span></label>
                  <div className="border rounded p-3 text-center">
                    {previewImage ? (
                      <div className="position-relative">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="img-fluid rounded mb-2" 
                          style={{ maxHeight: '200px' }}
                        />
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                          onClick={() => {
                            setPreviewImage('');
                            setProduct(prev => ({ ...prev, image: '' }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 bg-light rounded text-center">
                        <i className="bi bi-image fs-1 text-muted mb-2"></i>
                        <p className="text-muted mb-0">No image selected</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="form-control mt-3"
                      accept="image/*"
                    />
                    {validationErrors.image && (
                      <div className="text-danger small mt-2">{validationErrors.image}</div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold">Gallery Images</label>
                  <div className="border rounded p-3">
                    <div className="row g-2 mb-3">
                      {galleryPreviews.map((img, index) => (
                        <div key={index} className="col-4 col-md-3 position-relative">
                          <img 
                            src={img} 
                            alt={`Gallery ${index + 1}`} 
                            className="img-thumbnail"
                            style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                          />
                          <button 
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-1"
                            onClick={() => removeGalleryImage(index)}
                            style={{ lineHeight: '1', padding: '0.15rem 0.3rem' }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        <i className="bi bi-plus-lg me-1"></i> Add Images
                      </button>
                      <span className="text-muted small">
                        {galleryPreviews.length} image(s) selected
                      </span>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        onChange={handleGalleryChange}
                        className="d-none"
                        accept="image/*"
                        multiple
                      />
                    </div>
                    {validationErrors.gallery && (
                      <div className="text-danger small mt-2">{validationErrors.gallery}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
