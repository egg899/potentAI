import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getEmployerStats = async (req, res) => {
    try {
        const employerId = req.user._id;

        // Obtener estadísticas básicas
        const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });
        const totalApplications = await Application.countDocuments({ 
            job: { $in: await Job.find({ employer: employerId }).select('_id') }
        });
        const totalViews = await Job.aggregate([
            { $match: { employer: employerId } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);

        res.json({
            activeJobs,
            totalApplications,
            totalViews: totalViews[0]?.totalViews || 0
        });
    } catch (error) {
        console.error('Error al obtener estadísticas del empleador:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas del empleador' });
    }
}; 