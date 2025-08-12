import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';

export default function AssignIncident() {
  const [incidents, setIncidents] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [loadingTechnicians, setLoadingTechnicians] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //Fetches unassigned incidents
  const fetchUnassignedIncidents = async () => {
    setLoadingIncidents(true);
    setErrorMessage('');
    try {
      const res = await axios.get('http://localhost:8080/api/incidents/unassigned', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      setIncidents(res.data);
    } catch (error) {
      setErrorMessage('Failed to load unassigned incidents.');
      console.error(error);
    } finally {
      setLoadingIncidents(false);
    }
  };

  //Fetches technicians
  const fetchTechnicians = async () => {
    setLoadingTechnicians(true);
    setErrorMessage('');
    try {
      const res = await axios.get('http://localhost:8080/api/technicians' , {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      setTechnicians(res.data);
    } catch (error) {
      setErrorMessage('Failed to load technicians.');
      console.error(error);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  useEffect(() => {
    fetchUnassignedIncidents();
    fetchTechnicians();
  }, []);

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    setSelectedTechnicianId('');
  };

  const handleTechnicianChange = (e) => {
    setSelectedTechnicianId(e.target.value);
  };

  const handleAssign = async () => {
    if (!selectedTechnicianId) {
      alert('Please select a technician to assign.');
      return;
    }

    setAssigning(true);
    try {
        await axios.put(
          `http://localhost:8080/api/incidents/${selectedIncident.incidentid}`,
          {
            techid: selectedTechnicianId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      alert(`Incident #${selectedIncident.incidentid} assigned successfully!`);
      setSelectedIncident(null);
      setSelectedTechnicianId('');
      await fetchUnassignedIncidents(); //Refreshes the incident list
    } catch (err) {
      alert(`Failed to assign incident: ${err.message}`);
      console.error(err);
    } finally {
      setAssigning(false);
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
      <main className="container">
        <div className="main-panel">
          <div className="header-section">
            <h2>Assign Incident</h2>
            <Link to="/">Home</Link>
          </div>
          {/* Error Banner */}
          {errorMessage && (
            <div className="error-banner" style={{ color: 'red', marginBottom: '1rem' }}>
              {errorMessage}
            </div>
          )}
          {/* Incidents Table */}
          <div className="incidents-panel mb-4">
            <h3>Select Incident</h3>
            {loadingIncidents ? (
              <p>Loading incidents...</p>
            ) : (
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
                        <td colSpan="6" style={{ textAlign: 'center' }}>
                          No unassigned incidents found.
                        </td>
                      </tr>
                    ) : (
                      incidents.map((incident) => (
                        <tr key={incident.incidentid}>
                          <td>{incident.incidentid}</td>
                          <td>{incident.customer?.firstname} {incident.customer?.lastname}</td>
                          <td>{incident.productcode}</td>
                          <td>{new Date(incident.dateopened).toLocaleDateString()}</td>
                          <td>{incident.title}</td>
                          <td>
                            <button className="btn btn-primary" onClick={() => handleSelectIncident(incident)}>Select</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Assignment Form */}
          {selectedIncident && (
            <div className="assignment-panel">
              <h3>Assign to Technician</h3>
              <div className="incident-details mb-4">
                <div className="detail-row">
                  <div className="detail-label">Incident ID:</div>
                  <div className="detail-value">{selectedIncident.incidentid}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Customer:</div>
                  <div className="detail-value">
                    {selectedIncident.customer?.firstname} {selectedIncident.customer?.lastname}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Product:</div>
                  <div className="detail-value">
                    {selectedIncident.productcode} {selectedIncident.productName}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date Opened:</div>
                  <div className="detail-value">
                    {new Date(selectedIncident.dateopened).toLocaleDateString()}
                  </div>
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
              <div className="form-group">
                <label htmlFor="technician">Technician:</label>
                {loadingTechnicians ? (
                  <p>Loading technicians...</p>
                ) : (
                  <select id="technician" name="technician" value={selectedTechnicianId} onChange={handleTechnicianChange}>
                    <option value="">-- Select a Technician --</option>
                    {technicians.map((tech) => (
                      <option key={tech.techid} value={tech.techid}>
                        {tech.firstName} {tech.lastName} ({tech.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="button-group">
                <button className="btn btn-primary" onClick={handleAssign} disabled={assigning || loadingTechnicians}>{assigning ? 'Assigning...' : 'Assign Incident'}</button>
                <button className="btn btn-secondary" onClick={() => setSelectedIncident(null)} disabled={assigning}>Cancel</button>
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
