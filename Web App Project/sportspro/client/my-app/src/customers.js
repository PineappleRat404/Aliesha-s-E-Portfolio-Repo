import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 
import { Link } from 'react-router-dom';

export default function CustomerSearch() {
  const [lastname, setLastname] = useState('');
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [errorResults, setErrorResults] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [errorCustomer, setErrorCustomer] = useState(null);

  const [editForm, setEditForm] = useState({
    firstname: '',
    lastname: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    email: '',
    password: ''
  });

  // Handles last name input change
  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };

  // Searches for customers by last name with validation
  const handleSearch = async () => {
    if (!lastname.trim()) {
      alert('Please enter a last name to search.');
      return;
    }

    setLoadingResults(true);
    setErrorResults(null);
    setSelectedCustomer(null); 

    try {
      const response = await axios.get('http://localhost:8080/api/customers', {
        params: { lastname: lastname.trim() }, 
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      setResults(response.data);
    } catch (error) {
      setErrorResults(error.response?.data?.message || error.message);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  // Loads full customer data
  const handleSelectCustomer = async (customerId) => {
    setLoadingCustomer(true);
    setErrorCustomer(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      const data = response.data;

      setSelectedCustomer(data);
      setEditForm({
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        postalCode: data.postalcode || '', 
        country: data.country || '',
        phone: data.phone || '',
        email: data.email || '',
        password: '' 
      });
    } catch (error) {
      setErrorCustomer(error.response?.data?.message || error.message);
      setSelectedCustomer(null);
    } finally {
      setLoadingCustomer(false);
    }
  };

  // Handles edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Submits updated customer information with validation
  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) {
      alert('No customer selected for update.');
      return;
    }

    // Validation
    if (!editForm.firstname.trim()) {
      alert('First Name is required.');
      return;
    }
    if (!editForm.lastname.trim()) {
      alert('Last Name is required.');
      return;
    }
    
    if (!editForm.email.trim()) {
      alert('Email is required.');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      alert('Invalid email format.');
      return;
    }
    
    if (!editForm.phone.trim()) {
      alert('Phone Number is required.');
      return;
    } else {
      let cleanedPhone = editForm.phone.trim();
      if (cleanedPhone.startsWith('+')) {
        cleanedPhone = cleanedPhone.substring(1);
      }
      cleanedPhone = cleanedPhone.replace(/[\s\-\(\)]/g, '');
      
      if (cleanedPhone.length === 0 || isNaN(Number(cleanedPhone))) {
        alert('Invalid phone number format. Only digits, spaces, hyphens, parentheses, and an optional leading "+" are allowed.');
        return;
      }
    }

    if (editForm.password.trim() !== '' && editForm.password.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/customers/${selectedCustomer.customerid}`,
        editForm,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      alert('Customer updated successfully.');

      // Refresh the selected customer's data and the search results
      await handleSelectCustomer(selectedCustomer.customerid);
      const refreshedResults = await axios.get('http://localhost:8080/api/customers', {
        params: { lastname: lastname.trim() },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      setResults(refreshedResults.data);
    } catch (error) {
      alert('Error updating customer: ' + (error.response?.data?.message || error.message));
    }
  };

  // Cancels editing
  const handleCancel = () => {
    setSelectedCustomer(null);
    setErrorCustomer(null); 
  };

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
            <h2>Customer Search</h2>
            <Link to="/">Home</Link>
          </div>
          {/* Search Form */}
          <div className="search-panel mb-4">
            <div className="form-group">
              <label htmlFor="lastname">Last Name:</label>
              <div className="search-row">
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Enter last name"
                  value={lastname}
                  onChange={handleLastnameChange}
                />
                <button className="btn btn-primary" onClick={handleSearch} disabled={loadingResults}>
                  {loadingResults ? 'Searching...' : 'Search'}
                </button>
              </div>
              {errorResults && <p style={{ color: 'red' }}>{errorResults}</p>}
            </div>
          </div>
          {/* Search Results */}
          <div className="results-panel mb-4">
            <h3>Results</h3>
            {loadingResults && <p>Loading results...</p>}
            {!loadingResults && results.length === 0 && <p>No customers found.</p>}
            {results.length > 0 && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((customer) => (
                      <tr key={customer.customerid}>
                        <td>{customer.firstname} {customer.lastname}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSelectCustomer(customer.customerid)}
                            disabled={loadingCustomer}
                          >
                            View/Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Customer Edit Form */}
          {selectedCustomer && (
            <div className="form-panel">
              <h3>View/Update Customer</h3>
              {loadingCustomer && <p>Loading customer details...</p>}
              {errorCustomer && <p style={{ color: 'red' }}>{errorCustomer}</p>}
              {!loadingCustomer && !errorCustomer && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstname">First Name:</label>
                      <input type="text" id="firstname" name="firstname" value={editForm.firstname} onChange={handleEditInputChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastname">Last Name:</label>
                      <input type="text" id="lastname" name="lastname" value={editForm.lastname} onChange={handleEditInputChange}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" value={editForm.address} onChange={handleEditInputChange} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City:</label>
                      <input type="text" id="city" name="city" value={editForm.city} onChange={handleEditInputChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State:</label>
                      <input type="text" id="state" name="state" value={editForm.state} onChange={handleEditInputChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code:</label>
                      <input type="text" id="postalCode" name="postalCode" value={editForm.postalCode} onChange={handleEditInputChange}/>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="country">Country:</label>
                      <select id="country" name="country" value={editForm.country} onChange={handleEditInputChange}>
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                        <option value="AU">Australia</option>
                        <option value="NZ">New Zealand</option>
                        <option value="BR">Brazil</option>
                        <option value="CN">China</option>
                        <option value="DK">Denmark</option>
                        <option value="FR">France</option>
                        <option value="GR">Greece</option>
                        <option value="IE">Ireland</option>
                        <option value="JP">Japan</option>
                        <option value="GB">Great Britain</option>
                        <option value="NL">Netherlands</option>
                        <option value="PK">Pakistan</option>
                        <option value="PH">Phillipines</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="ZA">South Africa</option>
                        <option value="CH">Switzerland</option>
                        <option value="UA">Ukraine</option>
                        <option value="AQ">Antarctica</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone:</label>
                      <input type="tel" id="phone" name="phone" value={editForm.phone} onChange={handleEditInputChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input type="email" id="email" name="email" value={editForm.email} onChange={handleEditInputChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password:</label>
                      <input type="password" id="password" name="password" value={editForm.password} onChange={handleEditInputChange} placeholder="Enter new password to change"/>
                    </div>
                  </div>
                  <div className="button-group">
                    <button className="btn btn-primary" onClick={handleUpdateCustomer}>
                      Update Customer
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
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
