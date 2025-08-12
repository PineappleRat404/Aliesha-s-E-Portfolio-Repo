import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productcode: '',
    name: '',
    version: '',
    releasedate: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetches products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err);
        alert('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  // Form input change handler
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Submits new product with frontend validation
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Validation logic
    if (!formData.productcode.trim()) {
      alert('Product Code is required.');
      return;
    }
    if (!formData.name.trim()) {
      alert('Product Name is required.');
      return;
    }
    if (!formData.version.trim()) {
      alert('Version is required.');
      return;
    } else if (isNaN(parseFloat(formData.version))) {
      alert('Version must be a number.');
      return;
    }
    if (!formData.releasedate) {
      alert('Release Date is required.');
      return;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; 
      if (!dateRegex.test(formData.releasedate)) {
        alert('Invalid date format.');
        return;
      }
    }

    // If validation passes, proceed with API call
    setSubmitting(true);
    try {
      const res = await axios.post('http://localhost:8080/api/products', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(prev => [...prev, res.data.product]); 
      setFormData({ productcode: '', name: '', version: '', releasedate: '' }); 
      alert('Product added successfully!');
    } catch (err) {
      console.error('Failed to add product:', err);
      alert('Failed to add product: ' + (err.response?.data?.message || err.message || 'Unknown error.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Deletes product
  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return; 
    }

    try {
      await axios.delete(`http://localhost:8080/api/products/${code}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(prev => prev.filter(p => p.productcode !== code));
      alert(`Product ${code} deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product: ' + (err.response?.data?.message || err.message || 'Unknown error.'));
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="main-panel">
          <p>Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <h1>SportsPro Technical Support</h1>
          <p>Sports management software for the sports enthusiast</p>
        </div>
      </header>
      <main className="container">
        <div className="main-panel">
          <div className="header-section">
            <h2>Product List</h2>
            <Link to="/">Home</Link>
          </div>
          <div className="table-container mb-4">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Version</th>
                  <th>Release Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5">No products found.</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.productcode}>
                      <td>{product.productcode}</td>
                      <td>{product.name}</td>
                      <td>{product.version}</td>
                      <td>{product.releasedate}</td>
                      <td>
                        <button className="btn danger" onClick={() => handleDelete(product.productcode)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="form-panel">
            <h3>Add Product</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="productcode">Code:</label>
                <input 
                  type="text" 
                  id="productcode" 
                  name="productcode" 
                  value={formData.productcode} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="version">Version:</label>
                <input 
                  type="text" 
                  id="version" 
                  name="version" 
                  value={formData.version} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="releasedate">Release Date:</label>
                <input 
                  type="date" 
                  id="releasedate" 
                  name="releasedate" 
                  value={formData.releasedate} 
                  onChange={handleChange} 
                />
              </div>
              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2025 SportsPro, Inc.</p>
        </div>
      </footer>
    </>
  );
}
