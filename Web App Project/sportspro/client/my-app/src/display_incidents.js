import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function DisplayIncident() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [currentTechId, setCurrentTechId] = useState(null);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
 

  // Loads user role and current technician ID on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        if (decoded.role === 'TECHNICIAN') {
          setCurrentTechId(decoded.id || decoded.techid); 
        }
        if (decoded.role === 'CUSTOMER') {
          setCurrentCustomerId(decoded.id || decoded.customerid);
        }

      } catch (e) {
        console.error("Failed to decode token:", e);
        setError("Authentication error. Please log in again.");
      }
    } else {
      setError("Not authenticated. Please log in.");
    }
  }, []);

  // Fetches data based on user role
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [incidentRes, techRes, custRes, prodRes] = await Promise.all([
          axios.get('http://localhost:8080/api/incidents', config),
          axios.get('http://localhost:8080/api/technicians', config),
          axios.get('http://localhost:8080/api/customers', config),
          axios.get('http://localhost:8080/api/products', config),
        ]);

        setIncidents(incidentRes.data);
        setFilteredIncidents(incidentRes.data);
        setTechnicians(techRes.data);
        setCustomers(custRes.data);
        setProducts(prodRes.data);

      } catch (err) {
        setError('Error fetching data. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (incidents.length > 0 && userRole) {
      applyFilters();
    }
  }, [incidents, filters, userRole]);

  // Handles filter form changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Applies filters to incidents list
  const applyFilters = () => {
  const filtered = incidents.filter((incident) => {
    // For technicians: only assigned incidents for their own techid
    if (userRole === 'TECHNICIAN' && incident.techid !==currentTechId) {
      return false;
    }

    // For customers: only open incidents for their own customerid
    if (userRole === 'CUSTOMER' && incident.customerid !== currentCustomerId) {
      return false;
    }
    if (userRole === 'CUSTOMER' && incident.dateclosed) {
      return false; 
    }

    const matchesTech = !filters.technician || incident.techid == filters.technician;
    const matchesCust = !filters.customer || incident.customerid == filters.customer;
    const matchesProd = !filters.product || incident.productcode == filters.product;
    const matchesStatus =
      !filters.status ||
      (filters.status === 'open' && !incident.dateclosed) ||
      (filters.status === 'closed' && incident.dateclosed);

    return matchesTech && matchesCust && matchesProd && matchesStatus;
  });

  setFilteredIncidents(filtered);
  setSelectedIncident(null);
};


  // Helper to get information by id from a list
  const getCustomerNameById = (id) => {
    const customer = customers.find((c) => c.id === id || c.customerid === id);
    return customer ? `${customer.firstname} ${customer.lastname}` : '-';
  };

  const getTechnicianNameById = (id) => {
    const tech = technicians.find((t) => t.id === id || t.techid === id);
    return tech ? `${tech.firstname} ${tech.lastname}` : '-';
  };

  const getProductNameByCode = (code) => {
    const product = products.find((p) => p.code === code || p.productcode === code);
    if (!product) return '-';
    const version = product.version ? ` v${product.version}` : '';
    return `${product.code || product.productcode} (${product.name || ''}${version})`;
  };

  const hydrateIncident = (incident) => {
    if (!incident) return null;
    const hydrated = { ...incident };
    hydrated.customer = customers.find(c => c.id === incident.customerid || c.customerid === incident.customerid);
    hydrated.product = products.find(p => p.code === incident.productcode || p.productcode === incident.productcode);
    hydrated.technician = technicians.find(t => t.id === incident.techid || t.techid === incident.techid);
    return hydrated;
  };

  // Handle row click to set selected incident
  const handleIncidentSelect = (incident) => {
    setSelectedIncident(hydrateIncident(incident));
  };


  if (loading) {
    return (
      <main className="container">
        <div className="main-panel">
          <p>Loading incidents...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="main-panel">
          <p className="error">{error}</p>
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
    <main className="container">
      <div className="main-panel">
        <div className="header-section">
          <h2>Display Incidents</h2>
          <Link to="/">Home</Link>
        </div>
        {/* Filter Form */}
        <div className="filter-panel mb-4">
          <h3>Filter Incidents</h3>
          <div className="form-row">
            {/* Technician */}
            <div className="form-group">
              <label htmlFor="technician">Technician:</label>
              <select name="technician" value={filters.technician} onChange={handleFilterChange}>
                <option value="">All Technicians</option>
                  {technicians.map((t, index) => (
                    <option key={t.id || t.techid || index} value={t.id || t.techid}>
                      {t.firstname} {t.lastname}
                    </option>
                  ))}
              </select>
            </div>
            {/* Customer */}
            <div className="form-group">
              <label htmlFor="customer">Customer:</label>
              <select name="customer" value={filters.customer} onChange={handleFilterChange}>
                <option value="">All Customers</option>
                  {customers.map((c, index) => (
                    <option key={c.id || c.customerid || index} value={c.id || c.customerid}>
                      {c.firstname} {c.lastname}
                    </option>
                  ))}
              </select>
            </div>
            {/* Product */}
            <div className="form-group">
              <label htmlFor="product">Product:</label>
              <select name="product" value={filters.product} onChange={handleFilterChange}>
                <option value="">All Products</option>
                  {products.map((p, index) => (
                    <option key={p.code || p.productcode || index} value={p.code || p.productcode}>
                      {(p.code || p.productcode) ?? 'Unknown'} ({p.name ?? 'Unnamed'})
                    </option>
                  ))}
              </select>
            </div>
            {/* Status */}
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
        {/* Incident Table */}
        <div className="incidents-panel mb-4">
          <h3>Incidents</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Technician</th>
                  <th>Date Opened</th>
                  <th>Date Closed</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr key={incident.incidentid} onClick={() => setSelectedIncident(incident)}>
                    <td>{incident.incidentid}</td>
                    <td>{getCustomerNameById(incident.customerid)}</td>
                    <td>{getProductNameByCode(incident.productcode)}</td>
                    <td>{getTechnicianNameById(incident.techid)}</td>
                    <td>{incident.dateopened}</td>
                    <td>{incident.dateclosed || '-'}</td>
                    <td>{incident.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Selected Incident Details */}
        {selectedIncident && (
          <div className="incident-details-panel">
            <h3>Incident #{selectedIncident.incidentid} Details</h3>
            <div className="incident-details">
              <div className="detail-row">
                <div className="detail-label">Customer:</div>
                <div className="detail-value">
                  {selectedIncident.customer
                    ? `${selectedIncident.customer.firstname} ${selectedIncident.customer.lastname} (${selectedIncident.customer.email})`
                    : '-'}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Product:</div>
                <div className="detail-value">
                  {selectedIncident.product
                    ? `${selectedIncident.product.productcode} (${selectedIncident.product.name} v${selectedIncident.product.version})`
                    : '-'}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Technician:</div>
                <div className="detail-value">
                  {selectedIncident.technician
                    ? `${selectedIncident.technician.firstname} ${selectedIncident.technician.lastname}`
                    : '-'}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Date Opened:</div>
                <div className="detail-value">{selectedIncident.dateopened}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Date Closed:</div>
                <div className="detail-value">{selectedIncident.dateclosed || '-'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Title:</div>
                <div className="detail-value">{selectedIncident.title}</div>
              </div>
              <div className="detail-row full-width">
                <div className="detail-label">Description:</div>
                <div className="detail-value description-box">
                  {selectedIncident.description}
                </div>
              </div>
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
