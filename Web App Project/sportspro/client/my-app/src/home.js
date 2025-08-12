import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInCustomer, setLoggedInCustomer] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleLogin = async () => {
    // Basic Email Validation
    if (!email) {
      alert('Email is required.'); 
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Invalid email format.'); 
      return;
    }

    // Password Length Validation (min 8 characters)
    if (!password) {
      alert('Password is required.'); 
      return;
    } else if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    // If validation passes, proceed with API call
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      const text = await response.text();
      console.log('Raw response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        alert('Server did not return valid JSON. Check the console for more info.');
        return;
      }

      console.log('Parsed response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        setUserRole(decoded.role);
        setLoggedInCustomer(true);
        setEmail('');
        setPassword('');
      } else {
        alert(data.message || 'Login failed'); 
      }

    } catch (err) {
      console.error('Login request failed:', err);
      alert('An error occurred while logging in.'); 
    }
  };

  // Allows user to go back to their Dashboard page without having to log in again
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setLoggedInCustomer(true);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        alert('Your session has expired. Please log in again.'); 
      }
    }
  }, []);

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
          {/* Login Section - visible only if not logged in */}
          {!loggedInCustomer && (
            <div className="login-panel mb-4">
              <div className="header-section">
                <h2>User Login</h2>
              </div>
              <p>Please login to continue</p>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary full-width" onClick={handleLogin}>Login</button>
            </div>
          )}

          {/* Main Content - visible only if logged in */}
          {loggedInCustomer && (
            <div className="main-panel">
              <h2>SportsPro Technical Support</h2>
              {/* Admin Section */}
              {userRole === 'ADMIN' && (
                <div className="menu-section">
                  <h3>Admin Menu</h3>
                  <ul className="menu-list">
                    <li><Link to="/products">Manage Products</Link></li>
                    <li><Link to="/technicians">Manage Technicians</Link></li>
                    <li><Link to="/customers">Manage Customers</Link></li>
                    <li><Link to="/create-incident">Create Incident</Link></li>
                    <li><Link to="/assign-incident">Assign Incident</Link></li>
                    <li><Link to="/display-incidents">Display Incidents</Link></li>
                    <li><Link to="/update-incident">Update Incidents</Link></li>
                  </ul>
                </div>
              )}
              {/* Technician Section */}
              {userRole === 'TECHNICIAN' && (
                <div className="menu-section">
                  <h3>Technician Menu</h3>
                  <ul className="menu-list">
                    <li><Link to="/update-incident">Update Incident</Link></li>
                    <li><Link to="/display-incidents">Display Incidents</Link></li>
                  </ul>
                </div>
              )}
              {/* Customer Section */}
              {userRole === 'CUSTOMER' && (
                <div className="menu-section">
                  <h3>Customer Menu</h3>
                  <ul className="menu-list">
                    <li><Link to="/register-product">Register Product</Link></li>
                    <li><Link to="/display-incidents">Display Incidents</Link></li>
                  </ul>
                </div>
              )}
              {/* Logout Button */}
              <div className="customer-info mb-2">
                <p>
                  <button
                    className="btn btn-secondary full-width mt-2"
                    onClick={() => {
                      localStorage.removeItem('token');
                      setLoggedInCustomer(false);
                      setUserRole('');
                      setEmail('');
                      setPassword('');
                    }}>Logout</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer>
        <div className="container">
          <p>© 2025 SportsPro, Inc.</p>
        </div>
      </footer>
    </>
  );
}
