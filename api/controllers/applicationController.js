import Application from '../models/Application.js';
import Job from '../models/Job.js';

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
            .populate({
                path: 'resume',
                // populate trae todos los campos del resume, incluyendo template con theme y colorPalette
            });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener postulaciones', error: error.message });
    }
};

// Actualizar el estado de una aplicación (pending, accepted, rejected) - Solo para empleadores
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const employerId = req.user._id;

        console.log('Actualizando estado de aplicación:', { applicationId, status, employerId });

        // Validar que el status sea uno de los permitidos
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ 
                message: 'Estado inválido. Debe ser: pending, accepted o rejected.' 
            });
        }

        // Buscar la aplicación
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Aplicación no encontrada.' });
        }

        // Buscar el trabajo directamente para verificar el empleador
        const job = await Job.findById(application.job);

        if (!job) {
            console.error('El trabajo asociado no existe');
            return res.status(404).json({ message: 'Trabajo asociado no encontrado.' });
        }

        // Verificar que el empleador es dueño del trabajo
        const jobEmployerId = job.employer?.toString();
        const currentEmployerId = employerId?.toString();

        if (!jobEmployerId || jobEmployerId !== currentEmployerId) {
            console.error('Error de permisos:', { 
                jobEmployerId, 
                currentEmployerId,
                jobId: job._id,
                applicationId: application._id
            });
            return res.status(403).json({ 
                message: 'No tienes permiso para actualizar esta aplicación.' 
            });
        }

        // Actualizar el estado
        application.status = status;
        await application.save();

        // Retornar la aplicación actualizada con los datos poblados
        const updatedApplication = await Application.findById(applicationId)
            .populate('applicant', 'name email')
            .populate('resume')
            .populate({
                path: 'job',
                select: 'title employer'
            });

        res.json({
            message: `Estado de la aplicación actualizado a: ${status}`,
            application: updatedApplication
        });
    } catch (error) {
        console.error('Error completo al actualizar estado:', error);
        res.status(500).json({ 
            message: 'Error al actualizar el estado de la aplicación', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Obtener las aplicaciones del usuario actual (aplicante)
export const getMyApplications = async (req, res) => {
    try {
        const applicantId = req.user._id;
        
        const applications = await Application.find({ applicant: applicantId })
            .populate({
                path: 'job',
                select: 'title description location salary type employer status',
                populate: {
                    path: 'employer',
                    select: 'name email'
                }
            })
            .populate('resume', 'title')
            .sort({ appliedAt: -1 }); // Más recientes primero

        res.json(applications);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener tus aplicaciones', 
            error: error.message 
        });
    }
};

// Obtener una aplicación específica por ID
export const getApplicationById = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userId = req.user._id;

        const application = await Application.findById(applicationId)
            .populate('applicant', 'name email')
            .populate('resume')
            .populate({
                path: 'job',
                populate: {
                    path: 'employer',
                    select: 'name email'
                }
            });

        if (!application) {
            return res.status(404).json({ message: 'Aplicación no encontrada.' });
        }

        // Verificar que el usuario tiene permiso para ver esta aplicación
        // (debe ser el aplicante o el empleador dueño del trabajo)
        const isApplicant = application.applicant._id.toString() === userId.toString();
        const isJobOwner = application.job.employer._id.toString() === userId.toString();

        if (!isApplicant && !isJobOwner) {
            return res.status(403).json({ 
                message: 'No tienes permiso para ver esta aplicación.' 
            });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener la aplicación', 
            error: error.message 
        });
    }
}; 