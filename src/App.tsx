import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview';
import Shops from './pages/Shops';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Products from './pages/Products';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;