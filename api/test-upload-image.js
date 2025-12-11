import dotenv from 'dotenv';
import cloudinary from './config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Probando subida de imagen a Cloudinary...\n');

// Crear una imagen de prueba simple (1x1 pixel PNG en base64)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const testImageBuffer = Buffer.from(testImageBase64, 'base64');

// Guardar temporalmente
const tempPath = path.join(__dirname, 'test-image.png');
fs.writeFileSync(tempPath, testImageBuffer);

try {
    console.log('📤 Subiendo imagen de prueba a la carpeta "potentai"...');
    
    const result = await cloudinary.uploader.upload(tempPath, {
        folder: 'potentai',
        public_id: `test-${Date.now()}`,
        overwrite: false
    });
    
    console.log('✅ ¡Imagen subida exitosamente!');
    console.log('\n📋 Detalles:');
    console.log('   URL:', result.secure_url);
    console.log('   Public ID:', result.public_id);
    console.log('   Folder:', result.folder || 'potentai');
    console.log('   Tamaño:', result.bytes, 'bytes');
    console.log('\n🔍 Verifica en Cloudinary:');
    console.log('   1. Ve a tu Media Library');
    console.log('   2. Busca la carpeta "potentai"');
    console.log('   3. Deberías ver la imagen de prueba');
    console.log('\n💡 Si no ves la carpeta "potentai":');
    console.log('   - Haz clic en "Folders" en el menú lateral');
    console.log('   - O busca "potentai" en la barra de búsqueda');
    
} catch (error) {
    console.error('❌ Error al subir imagen:');
    console.error('   Mensaje:', error.message);
    if (error.http_code) {
        console.error('   Código HTTP:', error.http_code);
    }
} finally {
    // Limpiar archivo temporal
    if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
        console.log('\n🧹 Archivo temporal eliminado');
    }
}

