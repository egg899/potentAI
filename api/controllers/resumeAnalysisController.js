import fs from 'fs';
import Tesseract from 'tesseract.js';

export const extractTextFromCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    console.log('Archivo recibido desde resumeAnalysisController:', req.file.originalname);
    console.log('El path: ',req.file.path);
    // Borramos el archivo para no dejarlo guardado (opcional)
    fs.unlinkSync(req.file.path);

    res.json({ message: `Archivo '${req.file.originalname}' recibido correctamente desde resumeAnalysisController` });
  } catch (error) {
    console.error('Error en resumeAnalysisController:', error);
    res.status(500).json({ error: 'Error al procesar el archivo en resumeAnalysisController' });
  }
};