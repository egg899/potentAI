import React from 'react'
import { LuTrash2 } from 'react-icons/lu';
import { FiCheckCircle } from 'react-icons/fi';

const ResumeSummaryCard = ({children, title, lastUpdated, onSelect, onDelete, onSelectButtonClick}) => {
    const handleDelete = (e) => {
        e.stopPropagation(); // Evita que se active el onClick del contenedor
        onDelete();
    };

    const handleSelectButtonClick = (e) => {
        e.stopPropagation(); // Evita que se active el onClick del contenedor principal
        if (onSelectButtonClick) onSelectButtonClick();
    };

    return (
    <div 
    className="h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer relative" 
    onClick={onSelect}>
        {/* Ícono de selección en la parte superior */}
        <button
            className="absolute top-2 left-2 p-1 bg-white text-blue-500 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors z-10 shadow"
            onClick={handleSelectButtonClick}
            title="Seleccionar"
        >
            <FiCheckCircle className="w-5 h-5 cursor-pointer" />
        </button>
        <div className="p-4 w-full h-[200px] flex items-center justify-center overflow-hidden">
            {children}
        </div>

        <div className="w-full bg-white px-4 py-3">
            <h5 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">{title}</h5>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
                Last Updated: {lastUpdated}
            </p>
        </div>

        <button 
            onClick={handleDelete}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
            <LuTrash2 className="w-4 h-4" />
        </button>
    </div>
  )
}

export default ResumeSummaryCard;