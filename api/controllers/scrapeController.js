import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeLinkedinTitle = async (req, res) => {
    try {
        const { url } = req.body;
        if(!url) {
            return res.status(400).json({ error: "Falta la URL" });
        }


        // Headers para Linkedin crea que somos de Chrome
        const headers = {
            "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
        };

        const response = await axios.get(url, { headers });

        const html = response.data;
        const $ = cheerio.load(html);

        // Obtener <title>
        const title = $("title").text();

        console.log("Titulo scrapeado: ", title);


        // responder algo simple
        res.json({ title });




    }
    catch(error) {
        console.error("❌Error al scrapear:", error.message);
        return res.status(500).json({
            error: "No se pudo obtener la página (LinkedIn puede bloquear requests sin headers correctos)",
            success: false,
        });
    }

}//scrapeUrl