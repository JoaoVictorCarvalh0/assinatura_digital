import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VerificacaoPage from './pages/VerificacaoPage';
import DownloadPage from './pages/DownloadPage';
import AssinaturaPage from './pages/AssinaturaPage';

function App() {
  return (
    <Routes>
      {/* Página de assinatura isolada - sem sidebar por segurança */}
      <Route path="/assinatura" element={<AssinaturaPage />} />

      {/* Páginas com sidebar */}
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } />
      <Route path="/verify/:id?" element={
        <Layout>
          <VerificacaoPage />
        </Layout>
      } />
      <Route path="/download" element={
        <Layout>
          <DownloadPage />
        </Layout>
      } />
    </Routes>
  );
}

export default App;
