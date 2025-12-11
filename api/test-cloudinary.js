import dotenv from 'dotenv';
import cloudinary from './config/cloudinary.js';

dotenv.config();

console.log('🔍 Verificando configuración de Cloudinary...\n');

// Verificar que las variables estén configuradas
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Variables de entorno:');
console.log('  CLOUDINARY_CLOUD_NAME:', cloudName ? '✓ Configurado' : '✗ Faltante');
console.log('  CLOUDINARY_API_KEY:', apiKey ? '✓ Configurado' : '✗ Faltante');
console.log('  CLOUDINARY_API_SECRET:', apiSecret ? '✓ Configurado' : '✗ Faltante');
console.log('');

if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Error: Faltan variables de entorno de Cloudinary');
    process.exit(1);
}

// Probar la conexión con Cloudinary
console.log('🔗 Probando conexión con Cloudinary...');

try {
    // Hacer una prueba simple: obtener información de la cuenta
    const result = await cloudinary.api.ping();
    console.log('✅ Conexión exitosa con Cloudinary!');
    console.log('   Status:', result.status);
    console.log('\n🎉 ¡Cloudinary está funcionando correctamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Inicia el servidor con: npm start o npm run dev');
    console.log('   2. Prueba subir una imagen desde tu frontend');
    console.log('   3. Verifica en el dashboard de Cloudinary que las imágenes se suban');
} catch (error) {
    console.error('❌ Error al conectar con Cloudinary:');
    console.error('   Mensaje:', error.message);
    console.error('\n💡 Verifica:');
    console.error('   1. Que las credenciales en .env sean correctas');
    console.error('   2. Que tu cuenta de Cloudinary esté activa');
    console.error('   3. Que tengas conexión a internet');
    process.exit(1);
}

