import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function ProductRegistration() {
  const [loggedInCustomer, setLoggedInCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedInCustomer(decoded);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setLoggedInCustomer(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:8080/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
          });
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRegisterProduct = async () => {
    if (!selectedProduct) {
      alert('Please select a product to register.');
      return;
    }

    if (!loggedInCustomer || !loggedInCustomer.id) {
      alert('Please login first to register a product.');
      return;
    }

    setLoadingRegister(true);
    setError('');
    try {
      await axios.post(
        'http://localhost:8080/api/registrations',
        {
          customerid: loggedInCustomer.id, 
          productcode: selectedProduct,
          registrationdate: new Date().toISOString().split('T')[0],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setRegistrationSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.message) {
        alert(`Registration failed: ${err.response.data.message}`);
      } else {
        alert('An error occurred during registration.');
      }
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleRegisterAnother = () => {
    setRegistrationSuccess(false);
    setSelectedProduct('');
  };

  if (!loggedInCustomer) {
    return (
      <main className="container">
        <p>Please log in first to register a product.</p>
        <Link to="/">Go to Login</Link>
      </main>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>SportsPro Technical Support</h1>
          <p>Sports management software for the sports enthusiast</p>
        </div>
      </header>
      {/* Main Content */}
      <main className="container">
        <div className="main-panel small-panel">
          <div className="header-section">
            <h2>Register Product</h2>
            <Link to="/">Home</Link>
          </div>
          <div className="registration-panel mb-4">
            <div className="customer-info mb-2">
              <p>
                Customer: <span className="customer-name">{loggedInCustomer.email || loggedInCustomer.id}</span>
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="product">Product:</label>
              <select
                id="product"
                name="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">-- Select a Product --</option>
                {products.map((prod) => (
                  <option key={prod.productcode} value={prod.productcode}>
                    {prod.name} {prod.version ? `(v${prod.version})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-primary full-width"
              onClick={handleRegisterProduct}
              disabled={loadingRegister}>
              {loadingRegister ? 'Registering...' : 'Register Product'}
            </button>
            {registrationSuccess && (
              <div className="success-panel">
                <div className="alert alert-success">
                  <p>Product ({selectedProduct}) was registered successfully.</p>
                </div>
                <button className="btn btn-primary full-width" onClick={handleRegisterAnother}>
                  Register Another Product
                </button>
              </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2025 SportsPro, Inc.</p>
        </div>
      </footer>
    </>
  );
}
