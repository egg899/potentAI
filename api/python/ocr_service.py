from flask import Flask, request, jsonify
import os
import  fitz # PyMuPDF

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr():
    data = request.get_json()
    file_path = data.get('pdf_path')

    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Archivo no encontrado'}), 400

    # Por ahora solo devuelvo la ruta para probar
    #return jsonify({'texto': f'Ruta recibida: {file_path}'})

    try:
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()

        return jsonify({ 'texto':text })        

    except Exception as e:
        return jsonify({ 'error' : str(e) }), 500    

if __name__ == '__main__':
    app.run(port=5001)
