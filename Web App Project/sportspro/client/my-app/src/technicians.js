import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css'; 

export default function TechnicianList() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: ''
  });

  // Fetches technicians on mount
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8080/api/technicians', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTechnicians(res.data);
      } catch (err) {
        console.error('Failed to fetch technicians:', err);
        alert('Failed to load technicians.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit handler with frontend validation
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Validation
    if (!formData.firstname.trim()) {
      alert('First Name is required.');
      return;
    }
    if (!formData.lastname.trim()) {
      alert('Last Name is required.');
      return;
    }
    
    // Email Validation 
    if (!formData.email.trim()) {
      alert('Email is required.');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Invalid email format.');
      return;
    }
    
    // Phone Number Validation
    if (!formData.phone.trim()) {
      alert('Phone Number is required.');
      return;
    } else {
      let cleanedPhone = formData.phone.trim();
      if (cleanedPhone.startsWith('+')) {
        cleanedPhone = cleanedPhone.substring(1);
      }
      cleanedPhone = cleanedPhone.replace(/[\s\-\(\)]/g, '');
      
      if (cleanedPhone.length === 0 || isNaN(Number(cleanedPhone))) {
        alert('Invalid phone number format. Only digits, spaces, hyphens, parentheses, and an optional leading "+" are allowed.');
        return;
      }
    }
    
    if (!formData.password) {
      alert('Password is required.');
      return;
    } else if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    // If validation passes, proceed with API call
    setFormSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/technicians', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Re-fetch technicians to update the list
      const updatedRes = await axios.get('http://localhost:8080/api/technicians', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTechnicians(updatedRes.data);
      setFormData({ firstname: '', lastname: '', email: '', phone: '', password: '' }); 
      alert('Technician added successfully!');
    } catch (err) {
      console.error('Failed to add technician:', err);
      alert('Failed to add technician: ' + (err.response?.data?.message || err.message || 'Unknown error.'));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete handle (using window.confirm as per your preference)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technician?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/technicians/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTechnicians(prev => prev.filter(t => t.techid !== id));
      alert('Technician deleted successfully!');
    } catch (err) {
      console.error('Error deleting technician:', err);
      alert('Failed to delete technician: ' + (err.response?.data?.message || err.message || 'Unknown error.'));
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="main-panel">
          <p>Loading technicians...</p>
        </div>
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
        <div className="main-panel">
          <div className="header-section">
            <h2>Technician List</h2>
            <Link to="/">Home</Link>
          </div>
          {/* Technician Table */}
          <div className="table-container mb-4">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {technicians.length === 0 ? (
                  <tr><td colSpan="5">No technicians found.</td></tr>
                ) : (
                  technicians.map(tech => (
                    <tr key={tech.techid}>
                      <td>{tech.firstname}</td>
                      <td>{tech.lastname}</td>
                      <td>{tech.email}</td>
                      <td>{tech.phone}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(tech.techid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Add Technician Form */}
          <div className="form-panel">
            <h3>Add Technician</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstname">First Name:</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name:</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                {formSubmitting ? 'Adding...' : 'Add Technician'}
              </button>
            </form>
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
