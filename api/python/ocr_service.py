from flask import Flask, request, jsonify
import os
import fitz # PyMuPDF
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr():
    try:
        logger.info("Recibida petición OCR")
        data = request.get_json()
        logger.info(f"Datos recibidos: {data}")
        
        if not data:
            logger.error("No se recibieron datos JSON")
            return jsonify({'error': 'No se recibieron datos JSON'}), 400
            
        file_path = data.get('pdf_path')
        logger.info(f"Ruta del archivo: {file_path}")

        if not file_path:
            logger.error("No se proporcionó pdf_path")
            return jsonify({'error': 'No se proporcionó pdf_path'}), 400

        if not os.path.exists(file_path):
            logger.error(f"Archivo no encontrado: {file_path}")
            return jsonify({'error': f'Archivo no encontrado: {file_path}'}), 400

        logger.info(f"Procesando archivo: {file_path}")
        
        # Verificar que es un archivo PDF
        if not file_path.lower().endswith('.pdf'):
            logger.warning(f"Archivo no es PDF: {file_path}")
            # Por ahora permitimos otros formatos para testing

        text = ""
        with fitz.Document(file_path) as doc:
            logger.info(f"Documento abierto, páginas: {len(doc)}")
            for page_num, page in enumerate(doc):
                logger.info(f"Procesando página {page_num + 1}")
                text += page.get_text()

        logger.info(f"Texto extraído, longitud: {len(text)}")
        return jsonify({ 'texto': text })        

    except Exception as e:
        logger.error(f"Error en OCR: {str(e)}", exc_info=True)
        return jsonify({ 'error': str(e) }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    logger.info("Iniciando servicio OCR en puerto 5001")
    app.run(port=5001, debug=True)
