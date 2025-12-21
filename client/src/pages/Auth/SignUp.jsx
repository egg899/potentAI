import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from "../../components/Inputs/Input";
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = ({ setCurrentPage, setOpenAuthModal }) => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'job_seeker'
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (file) => {
    setProfileImage(file);
    // Ya no necesitamos guardar la URL blob en formData
    // La imagen se enviará directamente como archivo
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setIsLoading(true);

    try {
      // Validaciones
      if (!formData.name.trim()) {
        setError('El nombre completo es requerido');
        setIsLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('El email es requerido');
        setIsLoading(false);
        return;
      }

      if (!formData.password) {
        setError('La contraseña es requerida');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        setIsLoading(false);
        return;
      }

      // Crear FormData para enviar la imagen junto con los otros datos
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('userType', formData.userType);
      
      // Agregar la imagen si existe
      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      console.log('Enviando datos de registro:', {
        name: formData.name,
        email: formData.email,
        userType: formData.userType,
        hasImage: !!profileImage
      });

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        updateUser(response.data);
        setOpenAuthModal(false);
        navigate('/');
      } else 
        {
          setMessage('Esperando por la confirmación');
          sessionStorage.setItem('showConfirmacion', 'true'); // <-- bandera temporal
          // Redirigir después de 1 segundo
         
            navigate('/confirmacion'); // Ruta de confirmación
          


        }
      // else {
      //   setError('Error en el registro: No se recibió el token');
      // }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response) {
        console.error('Datos de la respuesta:', error.response.data);
        setError(error.response.data.message || 'Error en el registro');
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
        setError('No se pudo conectar con el servidor');
      } else {
        console.error('Error en la configuración de la petición:', error.message);
        setError('Error en la configuración de la petición');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="  p-6 m-2 overflow-y-auto rounded-lg">

    <div className="p-4 sm:p-6 md:p-7 mx-auto space-y-3">
      <h3 className="text-lg font-semibold text-black">Crea una cuenta</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Únase hoy mismo ingresando sus datos a continuación
      </p>

      <form onSubmit={handleSignUp} onClick={(e) => e.stopPropagation()}>
        <ProfilePhotoSelector image={profileImage} setImage={handleImageChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={formData.name}
            onChange={(e) => handleChange(e)}
            name="name"
            label="Nombre Completo"
            placeholder="John"
            type="text"
            helperText="Ej: John Doe"
          />

          <Input
            value={formData.email}
            onChange={(e) => handleChange(e)}
            name="email"
            label="Dirección Electrónica"
            placeholder="john@example.com"
            type="email"
            helperText="Ej: juan@ejemplo.com"
          />

          <Input
            value={formData.password}
            onChange={(e) => handleChange(e)}
            name="password"
            label="Contraseña"
            placeholder="Mínimo 8 caracteres, por favor"
            helperText="Mínimo 8 caracteres"
            type="password"
          />

          <div className="mt-4">
            <label className="text-[13px] text-slate-800 mb-2 block">Tipo de Usuario</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="job_seeker">Busco empleo</option>
              <option value="employer">Quiero dar empleo</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        {message && <p className="text-green-500 text-xs pb-2.5">{message}</p>}

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "REGISTRANDO..." : "REGISTRARSE"}
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage('login')}
          >
            ENTRAR
          </button>
        </p>
      </form>
    </div>
    </div>
  );
};

export { SignUp };