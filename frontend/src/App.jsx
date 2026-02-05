import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CrearReceta from './components/CrearReceta';
import ListarRecetas from './components/ListarRecetas';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/crear" replace />} />
          <Route path="/crear" element={<CrearReceta />} />
          <Route path="/listar" element={<ListarRecetas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
