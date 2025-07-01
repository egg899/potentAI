import axios from 'axios';
import path from 'path';

export const extractTextFromCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const pdfPath = path.resolve(req.file.path); // ruta absoluta
    console.log('Ruta absoluta del PDF:', pdfPath);
    console.log('Archivo existe:', require('fs').existsSync(pdfPath));

    console.log('Enviando petición a Python con ruta:', pdfPath);
    
    const response = await axios.post('http://localhost:5001/ocr', {
      pdf_path: pdfPath
    });

    console.log('Respuesta de Flask:', response.data);
    console.log('Status de respuesta:', response.status);

    // Envía la respuesta al cliente frontend
    res.status(200).json({ textoExtraido: response.data.texto });

  } catch (error) {
    console.error('Error en extractTextFromCV:', error.message);
    console.error('Error completo:', error);
    
    // Si es un error de axios, mostrar más detalles
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      return res.status(500).json({ 
        error: 'Error al procesar el archivo', 
        details: error.response.data 
      });
    }
    
    // Si es un error de red
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: 'Error al procesar el archivo', 
        details: 'No se puede conectar al servicio de OCR' 
      });
    }
    
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
};
