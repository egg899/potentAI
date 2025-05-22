import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

const ProtectedEmployerRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user || user.userType !== 'employer') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedEmployerRoute; 