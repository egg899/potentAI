
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'  
});

// console.log('openai: ',openai);

export const mejorarYParsearCV = async (req, res) => {

//   res.json({ ok: true });
        try {
            const { textoExtraido, laburo } = req.body;

            if(!textoExtraido) {
                return res.status(400).json({ error:"No se recibió el texto del CV" });
            }

            let extraPrompt = "";

            if(laburo) {
                const { title, description, requirements, location, salary, type } = laburo;
                
                extraPrompt= `
                Además, el CV debe estar adaptado a un puesto específico con los siguientes detalles:

                    🧾 Título del puesto: ${title}
                    📍 Ubicación: ${location}
                    💼 Tipo de contrato: ${type}
                    💲 Salario estimado: ${salary}

                    📋 Descripción del puesto:
                    ${description}

                    🎯 Requisitos del perfil ideal:
                    ${requirements}

                    Teniendo en cuenta esa oferta laboral, adapta el currículum del candidato resaltando logros, habilidades y experiencias que estén relacionadas directamente con los requisitos y tareas del puesto.

                    Si hay puntos clave en el empleo que no se cubren con el CV, sugerí habilidades que podrían ser desarrolladas.
                    Pon Arriba de todo algo como 'CV adaptado al puesto de ${title}' o algo como eso
                    `;
                
            }


            const prompt = `
                        Este es el texto de un CV extraído de un archivo PDF o DOCX.

                        Tu tarea es realizar dos cosas:

                        1. Reescribe el texto como una ficha profesional clara, organizada y fácil de leer, usando un formato de texto plano estructurado. 
                        Utiliza etiquetas como: "Nombre completo:", "Puesto:", "Resumen:", "Contacto:", "Experiencia laboral:", "Educación:", "Habilidades:", "Idiomas:", etc. 
                        Presenta cada bloque en líneas separadas, con formato limpio y legible, como si fuera un resumen tipo ficha técnica.
                        Me gustaría que también pongas antes de todas las etiquetas un resumen de los cambios que vas a hacer y el porqué son buenos.

                        2. Extrae la información clave del CV y devuélvela en un objeto JSON con la siguiente estructura EXACTA. No incluyas nada antes ni después del JSON (no agregues explicaciones, etiquetas como "json", bloques de código con \`\`\`, ni ningún texto adicional).

                        Formato del JSON:
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
                        "workExperience": [
                            {
                            "company": "",
                            "role": "",
                            "startDate": "",
                            "endDate": "",
                            "description": ""
                            }
                        ],
                        "education": [
                            {
                            "degree": "",
                            "Institution": "",
                            "startDate": "",
                            "endDate": ""
                            }
                        ],
                        "skills": [
                            {
                            "name": "",
                            "progress": 0
                            }
                        ],
                        "projects": [
                            {
                            "title": "",
                            "description": "",
                            "github": "",
                            "liveDemo": ""
                            }
                        ],
                        "certifications": [
                            {
                            "title": "",
                            "issuer": "",
                            "year": ""
                            }
                        ],
                        "languages": [
                            {
                            "name": "",
                            "progress": 0
                            }
                        ],
                        "interests": [""]
                        }

                        Texto extraído:
                        """${textoExtraido}"""
                        ${extraPrompt}

                        Devuelve el resumen redactado primero, luego escribe tres guiones (---) en una línea sola, y luego únicamente el JSON limpio, sin ningún otro contenido.
                        Otra cosa, en contactInfo.email, solo pon un email, si pones mas que eso, este se rompe.
                        `;



            const response = await openai.chat.completions.create({
                model: "meta-llama/llama-4-scout-17b-16e-instruct", // modelo gratuito de Groq
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
                });

           


            const textoIA = response.choices[0].message.content;

                    // Si no hay separador, lanzar error
                    if (!textoIA.includes('---')) {
                    return res.status(500).json({ error: "El texto de la IA no tiene el separador ---" });
                    }

                    const [resumenLegibleRaw, jsonTextoRaw] = textoIA.split('---');
                    const cleanedJson = jsonTextoRaw.trim().replace(/^```(json)?|```$/g, '').trim();

                    let jsonEstructurado = null;
                    try {
                    // jsonEstructurado = JSON.parse(cleanedJson);
                     jsonEstructurado =  JSON.parse(cleanedJson);
                     console.log(jsonEstructurado);
                    } catch (e) {
                    return res.status(500).json({ error: "Error al parsear JSON desde IA", detalle: e.message });
                    }

                    res.json({ resumen: resumenLegibleRaw.trim(), estructura: jsonEstructurado });

            
            

} catch(error){
            console.error("Error en OpenAI", error.response?.data || error.message || error);
            res.status(500).json({ error: "Error al mejorar el CV con IA" });
  }

}//mejorarYParseaCV