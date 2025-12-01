import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeLinkedinJob = async (req, res) => {
    try {
        const { url } = req.body;

        // 1) Validar que venga la URL
        if (!url) {
            return res.status(400).json({
                error: "Falta la URL",
                success: false
            });
        }

        // 2) Validar que sea Linkedin
        if (!url.includes("linkedin.com")) {
            return res.status(400).json({
                error: "Solo se pueden procesar URLs de LinkedIn",
                success: false
            });
        }

        // Headers anti bloqueo
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

        const title = $("title").text();

        const jobTitle =
            $('h1[class*="topcard__title"]').text().trim() ||
            $('h1[data-test-job-title]').text().trim();

        const company =
            $('a[class*="topcard__org-name"]').text().trim() ||
            $('a[data-test-employer-name]').text().trim();

        const location =
            $('span[class*="topcard__flavor--bullet"]').text().trim() ||
            $('span[data-test-job-location]').text().trim();

        const descriptionHTML =
            $('div[class*="description__text"]').html() ||
            $('div[data-test-description"]').html();

        const descriptionText =
            $('div[class*="description__text"]').text().trim() ||
            $('div[data-test-description"]').text().trim();

        res.json({
            success: true,
            title,
            jobTitle,
            company,
            location,
            descriptionHTML,
            descriptionText
        });
    } catch (error) {
        console.error("❌ Error al scrapear:", error.message);
        return res.status(500).json({
            error: "No se pudo obtener la página (LinkedIn puede bloquear requests sin headers correctos)",
            success: false,
        });
    }
};
