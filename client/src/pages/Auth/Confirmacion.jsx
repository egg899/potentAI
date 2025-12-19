import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

const Confirmacion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const allowed = sessionStorage.getItem('showConfirmacion');

    if (!allowed) {
      navigate('/'); // si no viene del registro, redirige
    } else {
      // esperar 3 segundos antes de ir a landing
      const timer = setTimeout(() => {
        sessionStorage.removeItem('showConfirmacion'); // limpiar flag
        navigate('/'); // ir a landing
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <Logo size={160} className="mr-2 w-32 mb-6" />
      <h2 className="text-xl font-semibold mb-4">Correo enviado</h2>
      <p className="text-slate-700 text-center">
        Por favor, revisa tu correo electrónico para confirmar tu cuenta.
      </p>
    </div>
  );
};

export { Confirmacion };
