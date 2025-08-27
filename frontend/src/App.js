import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [step, setStep] = useState('register');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [text, setText] = useState('');
  const [signatureId, setSignatureId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:4000/api/register', form);
    setUser(res.data);
    setStep('sign');
  };

  const handleSign = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:4000/api/sign', { userId: user.id, text });
    setSignatureId(res.data.signatureId);
    setStep('verify');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await axios.get(`http://localhost:4000/api/verify/${signatureId}`);
    setVerifyResult(res.data);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h1>Assinador Digital Web</h1>
      {step === 'register' && (
        <form onSubmit={handleRegister}>
          <h2>Cadastro</h2>
          <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Senha" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit">Registrar</button>
        </form>
      )}
      {step === 'sign' && (
        <form onSubmit={handleSign}>
          <h2>Assinar Texto</h2>
          <textarea rows={5} value={text} onChange={e => setText(e.target.value)} required />
          <button type="submit">Assinar</button>
        </form>
      )}
      {step === 'verify' && (
        <div>
          <h2>Verificar Assinatura</h2>
          <form onSubmit={handleVerify}>
            <input placeholder="ID da assinatura" value={signatureId} onChange={e => setSignatureId(e.target.value)} required />
            <button type="submit">Verificar</button>
          </form>
          {verifyResult && (
            <div style={{ marginTop: 20 }}>
              <strong>Status:</strong> {verifyResult.status}<br />
              <strong>Signatário:</strong> {verifyResult.signatario}<br />
              <strong>Algoritmo:</strong> {verifyResult.algoritmo}<br />
              <strong>Data/Hora:</strong> {verifyResult.dataHora}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
