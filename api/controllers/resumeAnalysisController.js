import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';

// Carga variables de entorno desde .env
dotenv.config();

export const extractTextFromCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    console.log('Archivo recibido:', originalName);
    console.log('Ruta temporal:', filePath);

    // Crear FormData para OCR.space
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), { filename: originalName });
    formData.append('language', 'spa');           // idioma español
    formData.append('isOverlayRequired', 'false'); 
    formData.append('OCREngine', '2');           // OCR Engine 2
    // opcional: filetype si quieres forzar
    // formData.append('filetype', 'PDF');

    console.log('Enviando archivo a OCR.space...');
    const response = await axios.post(
      'https://api.ocr.space/parse/image',
      formData,
      { headers: { ...formData.getHeaders(), apikey: process.env.OCR_API_KEY } }
    );

    fs.unlinkSync(filePath); // borrar archivo temporal

    console.log('Respuesta completa OCR.space:', response.data);

    const parsedResults = response.data.ParsedResults;
    const texto = parsedResults && parsedResults.length > 0
      ? parsedResults.map(p => p.ParsedText).join("\n")
      : '';

    res.status(200).json({ textoExtraido: texto });

  } catch (error) {
    console.error('Error procesando CV:', error);
    res.status(500).json({ error: 'Error procesando el archivo', details: error.message });
  }
};
