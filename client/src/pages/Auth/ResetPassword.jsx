import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || 'Contraseña actualizada correctamente.');
      setTimeout(() => {
        window.location.href = 'http://localhost:5173/';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black mb-2">Restablecer contraseña</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        {message && <p className="text-green-600 text-xs pb-2.5">{message}</p>}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword; 