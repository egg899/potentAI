import fetch from "node-fetch";
import RemoteJob from "../models/RemoteJob.js";

// Trayendo Trabajos de Remotive
export const getRemoteJobs = async (req, res) => {
    const { search, category } = req.query;
    let url = "https://remotive.com/api/remote-jobs?";

    if(search)  url += `search=${encodeURIComponent(search)}&`;
    if(category) url += `category=${encodeURIComponent(category)}&`;



    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // devuelve array de trabajos
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo trabajos" });
    };

};// export getRemoteJobs
// Termina Trayendo Trabajos de Remotive




// Guardar o devolver un trabajo remoto en MongoDB
export const getOrCreateRemoteJob = async(req, res) => {
    const jobData = req.body;
    console.log("Backend recibió:", jobData); // 🔹 log de depuración

    if(!jobData || !jobData.id) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    try {
        // Buscar si ya existe
        let job = await RemoteJob.findOne({ remoteId: jobData.id });

        if(!job) {
            // Si no existe, crear
            job = await RemoteJob.create({
                remoteId: jobData.id,
                title: jobData.title,
                company_name: jobData.company_name,
                candidate_required_location: jobData.candidate_required_location,
                description: jobData.description,
                job_type: jobData.job_type,
                salary: jobData.salary,
                url: jobData.url,
                company_logo: jobData.company_logo, // 🔹 corregido typo
            });
        }
        console.log("Trabajo remoto final: ", job);
        return res.json({ success: true, jobId: job._id });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Error creando o buscando trabajo remoto" });
    }
};

//getOrCreateRemoteJob




// Obtener trabajo remoto por remoteId
export const getRemoteJobByRemoteId = async (req, res) => {
    try {
        const { remoteId } = req.params;
        console.log("Buscando RemoteJon con remoteId: ", remoteId);

        const remoteJob = await RemoteJob.findOne({ remoteId });

        if(!remoteJob) {
            return res.status(404).json({ message: "Trabajo remoto no encontrado" });
        }



        res.json(remoteJob);
        //return res.json({ ok:true, remoteRecibido: remoteId });

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Error al buscar trabajo remoto", error: error.message });


    }

}//getRemoteJobByRemoteId