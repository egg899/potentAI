import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-[#3cff52] mb-1">potentIA</span>
        <span className="text-sm text-gray-600 mb-1">Impulsando tu carrera con IA</span>
        <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} potentIA. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer; 