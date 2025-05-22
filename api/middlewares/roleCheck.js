import User from '../models/User.js';

export const isEmployer = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user || user.userType !== 'employer') {
            return res.status(403).json({ message: 'Acceso denegado. Solo para empleadores.' });
        }
        
        next();
    } catch (error) {
        console.error('Error al verificar rol de empleador:', error);
        res.status(500).json({ message: 'Error al verificar rol de empleador' });
    }
}; 