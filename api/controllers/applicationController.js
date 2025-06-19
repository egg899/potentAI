import Application from '../models/Application.js';

// Crear una postulación
export const createApplication = async (req, res) => {
    try {
        const { jobId, resumeId, coverLetter } = req.body;
        const applicantId = req.user._id;
        if (!jobId || !resumeId) {
            return res.status(400).json({ message: 'Faltan datos requeridos.' });
        }
        // Verificar si ya existe una postulación para este trabajo y usuario
        const existing = await Application.findOne({ job: jobId, applicant: applicantId });
        if (existing) {
            return res.status(409).json({ message: 'Ya has aplicado a este trabajo.' });
        }
        const application = new Application({
            job: jobId,
            applicant: applicantId,
            resume: resumeId,
            coverLetter: coverLetter || ''
        });
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la postulación', error: error.message });
    }
};

// Obtener postulaciones de un trabajo (para el empleador)
export const getApplicationsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ job: jobId })
            .populate('applicant', 'name email')
            .populate('resume');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener postulaciones', error: error.message });
    }
}; 