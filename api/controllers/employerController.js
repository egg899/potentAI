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

export const createJobPost = async (req, res) => {
    try {
        const { title, description, requirements, location, salary, type } = req.body;
        const employerId = req.user._id;

        const newJob = new Job({
            title,
            description,
            requirements,
            location,
            salary,
            type,
            employer: employerId
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        console.error('Error al crear publicación:', error);
        res.status(500).json({ message: 'Error al crear la publicación de trabajo' });
    }
};

export const getJobs = async (req, res) => {
    try {
        const employerId = req.user._id;
        const jobs = await Job.find({ employer: employerId });
        res.json(jobs);
    } catch (error) {
        console.error('Error al obtener trabajos:', error);
        res.status(500).json({ message: 'Error al obtener los trabajos' });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const employerId = req.user._id;

        const job = await Job.findOne({ _id: jobId, employer: employerId });
        
        if (!job) {
            return res.status(404).json({ message: 'Trabajo no encontrado o no tienes permiso para eliminarlo' });
        }

        await Job.findByIdAndDelete(jobId);
        res.status(200).json({ message: 'Trabajo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar trabajo:', error);
        res.status(500).json({ message: 'Error al eliminar el trabajo' });
    }
}; 