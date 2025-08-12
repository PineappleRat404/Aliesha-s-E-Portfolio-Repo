import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css'; 

export default function CreateIncident() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerid: '',
    productcode: '',
    title: '',
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  //Loads customers and products
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/customers', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        setCustomers(res.data);
      } catch (err) {
        setErrorMessage('Failed to load customers');
        console.error(err);
      } finally {
        setLoadingCustomers(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/products' , {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        setProducts(res.data);
      } catch (err) {
        setErrorMessage('Failed to load products');
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  //Handles form input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  //Handles form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!formData.customerid) {
      alert('Customer is required.');
      return;
    }
    if (!formData.productcode) {
      alert('Product is required.');
      return;
    }
    if (!formData.title.trim()) {
      alert('Title is required.');
      return;
    }
    if (!formData.description.trim()) {
      alert('Description is required.');
      return;
    }

    const formDataToSend = {
      customerid: Number(formData.customerid),
      productcode: formData.productcode,
      title: formData.title,
      description: formData.description,
      techid: null, 
      dateopened: new Date().toISOString().split('T')[0],
      dateclosed: null,
    };

    setSubmitting(true);
    try {
      const res = await axios.post('http://localhost:8080/api/incidents', formDataToSend, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      const incident = res.data.incident;

      setSuccessMessage(`Incident was successfully created and assigned incident ID #${incident.incidentid}.`);
      setFormData({
        customerid: '',
        productcode: '',
        title: '',
        description: '',
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create incident';
      setErrorMessage(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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
            <h2>Create Incident</h2>
            <Link to="/">Home</Link>
          </div>
          <form className="form-panel" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group form-group-half">
                <label htmlFor="customerid">Customer:</label>
                {loadingCustomers ? (
                  <p>Loading customers...</p>
                ) : (
                  <select id="customerid" name="customerid" value={formData.customerid} onChange={handleChange}>
                    <option value="">-- Select a Customer --</option>
                    {customers.map(c => (
                      <option key={c.customerid} value={c.customerid}>
                        {c.firstname} {c.lastname} ({c.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="form-group form-group-half">
                <label htmlFor="productcode">Product:</label>
                {loadingProducts ? (
                  <p>Loading products...</p>
                ) : (
                  <select id="productcode" name="productcode" value={formData.productcode} onChange={handleChange}>
                    <option value="">-- Select a Product --</option>
                    {products.map(p => (
                      <option key={p.productcode} value={p.productcode}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" name="title" placeholder="Brief description of the issue" value={formData.title} onChange={handleChange}/> {/* Removed required */}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea id="description" name="description" rows="4" placeholder="Detailed description of the incident" value={formData.description} onChange={handleChange}/>
            </div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Incident'}
            </button>
          </form>
          {successMessage && (
            <div className="success-panel">
              <div className="alert alert-success">
                <p>{successMessage}</p>
              </div>
            </div>
          )}
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
