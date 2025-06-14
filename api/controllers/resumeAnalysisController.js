import axios from 'axios';
import path from 'path';

export const extractTextFromCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const pdfPath = path.resolve(req.file.path); // ruta absoluta
    console.log('Ruta absoluta del PDF:', pdfPath);

    const response = await axios.post('http://localhost:5001/ocr', {
      pdf_path: pdfPath
    });

    console.log('Respuestas de Flask:', response.data);
    // console.log(response);

    // Envía la respuesta al cliente frontend
    res.status(200).json({ textoExtraido: response.data.texto });

  } catch (error) {
    console.error('Error en extractTextFromCV:', error.message);
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
};
