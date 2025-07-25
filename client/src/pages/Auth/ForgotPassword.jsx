import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const ForgotPassword = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axiosInstance.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error al solicitar recuperación. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black mb-2">Recuperar contraseña</h3>
      <p className="text-xs text-slate-700 mb-6">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        {message && <p className="text-green-600 text-xs pb-2.5">{message}</p>}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
        <button
          type="button"
          className="text-xs text-primary underline mt-3 block mx-auto"
          onClick={() => setCurrentPage && setCurrentPage('login')}
        >
          Volver al login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword; 