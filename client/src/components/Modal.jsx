import React from 'react';

const Modal = ({
    children,
    isOpen, 
    onClose, 
    title, 
    hideHeader,
    showActionBtn, 
    actionBtnIcon = null,
    actionBtnText, 
    onActionClick
}
    
) => {

    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start md:items-center w-full h-full bg-black/50 backdrop-blur-sm p-4" style={{ overflow: 'hidden' }}>
  <div
    className={`relative flex flex-col shadow-2xl rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-5xl max-h-[90vh] overflow-hidden animate-fadeIn ${
      hideHeader ? 'bg-transparent' : 'bg-white'
    }`}
    style={{ overflowX: 'hidden' }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header con título */}
    {!hideHeader && title && (
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
    )}

    {/* Close Button */}
    <button
      type="button"
      className="absolute top-4 right-4 z-50 flex justify-center items-center w-8 h-8 text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm cursor-pointer transition-colors"
      onClick={onClose}
    >
      <svg
        className="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>

    {/* Modal Body */}
    <div className={`overflow-y-auto overflow-x-hidden flex-1 ${hideHeader || !title ? 'p-0' : 'p-6'}`} style={{ maxHeight: hideHeader ? '90vh' : 'calc(90vh - 80px)' }}>
      {children}
    </div>
  </div>
</div>

  );
};

export default Modal