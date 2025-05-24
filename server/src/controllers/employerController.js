// const User = require('../models/User');
// const Job = require('../models/Job');
// const Application = require('../models/Application');

// const getEmployerStats = async (req, res) => {
//     try {
//         const employerId = req.user._id;

//         // Obtener estadísticas básicas
//         const stats = {
//             totalApplications: 0,
//             activeJobs: 0,
//             totalViews: 0
//         };

//         // Contar trabajos activos
//         const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });
//         stats.activeJobs = activeJobs;

//         // Contar aplicaciones totales
//         const jobs = await Job.find({ employer: employerId });
//         const jobIds = jobs.map(job => job._id);
//         const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
//         stats.totalApplications = totalApplications;

//         // Contar visualizaciones totales (suma de views de todos los trabajos)
//         const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
//         stats.totalViews = totalViews;

//         res.json(stats);
//     } catch (error) {
//         console.error('Error al obtener estadísticas del empleador:', error);
//         res.status(500).json({ message: 'Error al obtener estadísticas' });
//     }
// };

// // Crear una nueva publicación de trabajo
// const createJobPost = async (req, res) => {
//     try {
//         const { title, description, requirements, location, salary, type } = req.body;
//         const employerId = req.user.id;

//         const newJob = new Job({
//             title,
//             description,
//             requirements,
//             location,
//             salary,
//             type,
//             employer: employerId
//         });

//         await newJob.save();
//         res.status(201).json(newJob);
//     } catch (error) {
//         console.error('Error al crear publicación:', error);
//         res.status(500).json({ message: 'Error al crear la publicación de trabajo' });
//     }
// };

// module.exports = {
//     getEmployerStats,
//     createJobPost
// }; 

// controllers/employerController.js

import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getEmployerStats = async (req, res) => {
    try {
        const employerId = req.user._id;

        const stats = {
            totalApplications: 0,
            activeJobs: 0,
            totalViews: 0
        };

        const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });
        stats.activeJobs = activeJobs;

        const jobs = await Job.find({ employer: employerId });
        const jobIds = jobs.map(job => job._id);
        const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
        stats.totalApplications = totalApplications;

        const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
        stats.totalViews = totalViews;

        res.json(stats);
    } catch (error) {
        console.error('Error al obtener estadísticas del empleador:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};

export const createJobPost = async (req, res) => {
    try {
        const { title, description, requirements, location, salary, type } = req.body;
        const employerId = req.user.id;

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
