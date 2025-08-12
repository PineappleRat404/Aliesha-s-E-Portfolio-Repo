import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';

export default function UpdateIncident() {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [description, setDescription] = useState('');
  const [closeIncident, setCloseIncident] = useState(false);

  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);
  const [isUpdatingIncident, setIsUpdatingIncident] = useState(false);

  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //Fetches technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      setIsLoadingTechnicians(true);
      try {
        const res = await axios.get('http://localhost:8080/api/technicians', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
          });
        setTechnicians(res.data);
        setErrorMessage('');
      } catch (err) {
        console.error(err);
        setErrorMessage('Failed to fetch technicians.');
      } finally {
        setIsLoadingTechnicians(false);
      }
    };

    fetchTechnicians();
  }, []);

  //Fetches incidents when technician changes
  useEffect(() => {
    const fetchIncidents = async () => {
      if (!selectedTechnician) {
        setIncidents([]);
        setSelectedIncident(null);
        return;
      }

      setIsLoadingIncidents(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/incidents/assigned?techid=${selectedTechnician}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
          });
        setIncidents(res.data);
        setErrorMessage('');
      } catch (err) {
        console.error(err);
        setIncidents([]);
        setErrorMessage('Failed to fetch incidents.');
      } finally {
        setIsLoadingIncidents(false);
      }
    };

    fetchIncidents();
  }, [selectedTechnician]);

  //Updates description and closeIncident when a new incident is selected
  useEffect(() => {
    if (selectedIncident) {
      setDescription(selectedIncident.description || '');
      setCloseIncident(Boolean(selectedIncident.closed));
    } else {
      setDescription('');
      setCloseIncident(false);
    }
  }, [selectedIncident]);

  const handleUpdate = async () => {
    if (!selectedIncident) {
      alert('Please select an incident to update.');
      return;
    }

    const updatePayload = {
      description,
      dateclosed: closeIncident ? new Date().toISOString() : null,
    };

    setIsUpdatingIncident(true);
    try {
      await axios.put(`http://localhost:8080/api/incidents/${selectedIncident.incidentid}`,updatePayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSuccessMessage(true);
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to update incident.');
    } finally {
      setIsUpdatingIncident(false);
    }
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
            <h2>Update Incident</h2>
            <Link to="/">Home</Link>
          </div>
          {/* Technician Content */}
          <div className="technician-panel mb-4">
            <h3>Select Technician</h3>
            <div className="form-row">
              <div className="form-group flex-grow">
                <label htmlFor="technician">Technician:</label>
                <select id="technician" name="technician" value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)}>
                  <option value="">-- Select a Technician --</option>
                  {technicians.map((tech) => (
                    <option key={tech.techid} value={tech.techid}>
                      {tech.firstname} {tech.lastname} ({tech.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => {
                    if (selectedTechnician) {
                      fetch(`http://localhost:3001/api/incidents/assigned?techid=${selectedTechnician}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                      })
                        .then((res) => {
                          if (!res.ok) throw new Error('Unauthorized or error fetching');
                          return res.json();
                        })
                        .then((data) => setIncidents(data))
                        .catch((err) => {
                          console.error(err);
                          setErrorMessage('Failed to fetch incidents.');
                        });
                    }
                  }}
                  disabled={!selectedTechnician}
                >
                  Get Incidents
                </button>
              </div>
            </div>
          </div>
          {/* Assign Incidents List */}
          <div className="incidents-panel mb-4">
            <h3>Select Incident</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Date Opened</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.length === 0 ? (
                    <tr>
                      <td colSpan="6">No incidents found for this technician.</td>
                    </tr>
                  ) : (
                    incidents.map((incident) => (
                      <tr key={incident.incidentid}>
                        <td>{incident.incidentid}</td>
                        <td>{incident.customer ? `${incident.customer.firstname} ${incident.customer.lastname}` : '-'}</td>
                        <td>{incident.product ? incident.product.productcode : '-'}</td>
                        <td>{incident.dateopened}</td>
                        <td>{incident.title}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Update Incident Form */}
          {selectedIncident && (
            <div className="update-panel">
              <h3>Update Incident</h3>
              <div className="incident-info mb-4">
                <div className="detail-row">
                  <div className="detail-label">Incident ID:</div>
                  <div className="detail-value">{selectedIncident.incidentid}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Customer:</div>
                  <div className="detail-value">{selectedIncident.customer
                    ? `${selectedIncident.customer.firstname} ${selectedIncident.customer.lastname}`
                    : '-'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Product:</div>
                  <div className="detail-value">
                    {selectedIncident.product ? selectedIncident.product.productcode : '-'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date Opened:</div>
                  <div className="detail-value">{selectedIncident.dateopened}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Title:</div>
                  <div className="detail-value">{selectedIncident.title}</div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="closeIncident"
                  name="closeIncident"
                  checked={closeIncident}
                  onChange={() => setCloseIncident(!closeIncident)}
                />
                <label htmlFor="closeIncident">Close this incident</label>
              </div>
              <div className="button-group">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Update Incident
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedIncident(null);
                    setDescription('');
                    setCloseIncident(false);
                    setSuccessMessage(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* Confirmation Message */}
          {successMessage && (
            <div className="success-panel mt-4">
              <div className="alert alert-success">
                <p>Incident was updated successfully.</p>
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
