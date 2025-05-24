import Job from '../models/Job.js';

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'active' })
            .populate('employer', 'companyName')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error al obtener trabajos:', error);
        res.status(500).json({ message: 'Error al obtener los trabajos' });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employer', 'companyName');

        if (!job) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }

        // Incrementar el contador de vistas
        job.views += 1;
        await job.save();

        res.json(job);
    } catch (error) {
        console.error('Error al obtener trabajo:', error);
        res.status(500).json({ message: 'Error al obtener el trabajo' });
    }
}; 