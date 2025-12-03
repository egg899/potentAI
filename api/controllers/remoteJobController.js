import fetch from "node-fetch";

export const getRemoteJobs = async (req, res) => {
    const { search, category } = req.query;
    // let url = "https://remotive.com/api/remote-jobs?";

    // if(search)  url += `search=${encodeURIComponent(search)}&`;
    // if(category) url += `cateory=${encodeURIComponent(category)}&`;


    try {
        const response = await fetch("https://remotive.com/api/remote-jobs");
        const data = await response.json();
        res.json(data); // devuelve array de trabajos
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo trabajos" });
    };

};// export getRemoteJobs