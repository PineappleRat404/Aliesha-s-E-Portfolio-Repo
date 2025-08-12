import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './home';
import ProductList from './products';
import TechnicianList from './technicians';
import CustomerSearch from './customers';
import AssignIncident from './assign_incident';
import UpdateIncident from './update_incident';
import CreateIncident from './create_incident';
import DisplayIncident from './display_incidents';
import RegisterProduct from './register_product';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/technicians" element={<TechnicianList />} />
        <Route path="/customers" element={<CustomerSearch />} />
        <Route path="/create-incident" element={<CreateIncident />} />
        <Route path="/assign-incident" element={<AssignIncident />} />
        <Route path="/display-incidents" element={<DisplayIncident />} />
        <Route path="/update-incident" element={<UpdateIncident />} />
        <Route path="/register-product" element={<RegisterProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
