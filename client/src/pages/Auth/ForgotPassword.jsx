import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Logo from '../../components/Logo';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
         <Logo size={160} className="mr-2 w-32 mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h3>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-semibold ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
          <button
            type="button"
            className="text-sm text-blue-600 underline mt-4 block mx-auto hover:text-blue-800"
            onClick={() => setCurrentPage && setCurrentPage('login')}
          >
            Volver al login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 