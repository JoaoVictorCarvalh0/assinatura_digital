import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from './components/Cadastro';
import Assinatura from './components/Assinatura';
import Verificacao from './components/Verificacao';

function App() {
  const [user, setUser] = useState(null);
  const [signatureId, setSignatureId] = useState('');

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleSign = (id) => {
    setSignatureId(id);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/assinatura" replace />
          ) : (
            <Cadastro onRegister={handleRegister} />
          )
        }
      />
      <Route
        path="/assinatura"
        element={
          user ? (
            <Assinatura user={user} onSign={handleSign} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/verify/:id?"
        element={<Verificacao signatureId={signatureId} />}
      />
    </Routes>
  );
}

export default App;
