
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'  
});

console.log('openai: ',openai);

export const mejorarYParsearCV = async (req, res) => {

//   res.json({ ok: true });
        try {
            const {textoExtraido} = req.body;

            if(!textoExtraido) {
                return res.status(400).json({ error:"No se recibió el texto del CV" });
            }


                    const prompt = `
                            Este es el texto de un CV extraído de un archivo PDF o DOCX.
                            Quiero que hagas dos cosas:

                            1. Mejora y reescribe el texto en forma de un resumen profesional con párrafos bien redactados, sin errores, fácil de leer para humanos.

                            2. También, extrae la información clave del CV y organízala en una estructura como la siguiente (en formato JSON):

                            {
                            "profileInfo": {
                                "fullName": "",
                                "designation": "",
                                "summary": "",
                                "profilePreviewUrl": ""
                            },
                            "contactInfo": {
                                "email": "",
                                "phone": "",
                                "location": "",
                                "linkedin": "",
                                "github": "",
                                "website": ""
                            },
                            "workExperience": [],
                            "education": [],
                            "skills": [],
                            "projects": [],
                            "certifications": [],
                            "languages": [],
                            "interests": []
                            }

                            Texto extraído:
                            """${textoExtraido}"""

                            Devuelve primero el texto mejorado como resumen, separalo con tres guiones (---), y luego el JSON estructurado.
                            `;


            const response = await openai.chat.completions.create({
                model: "meta-llama/llama-4-scout-17b-16e-instruct", // modelo gratuito de Groq
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
                });

            const textoMejorado = response.choices[0].message.content;
            console.log('Este es el texto mejorado', textoMejorado);

            return res.json({ textoMejorado });    
            // console.log(`Este es el texto Extraido de mejorarCVController: ${textoExtraido}`);

            // return res.status(200).json({
            //     mensaje:"Texto recibido y procesdo correctamente",
            //     textoMejorado: textoExtraido,
            // });

        } catch(error){
            console.error("Error en OpenAI", error.response?.data || error.message || error);
            res.status(500).json({ error: "Error al mejorar el CV con IA" });
        }

}//mejorarYParseaCV