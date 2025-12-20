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
    <div className="fixed inset-0 z-50 flex justify-center items-start md:items-center w-full h-full bg-black/40 backdrop-blur-sm p-4">
  <div
    className="relative flex flex-col bg-white shadow-lg rounded-lg w-full max-w-md md:max-w-lg max-h-[90vh] overflow-hidden animate-fadeIn"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Close Button */}
    <button
      type="button"
      className="absolute top-3.5 right-3.5 flex justify-center items-center w-8 h-8 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm cursor-pointer"
      onClick={onClose}
    >
      <svg
        className="w-3 h-3"
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
          d="M1 1L6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>

    {/* Modal Body */}
    <div className="p-4 overflow-y-auto max-h-[calc(90vh-40px)] flex-1">
      {children}
    </div>
  </div>
</div>

  );
};

export default Modal;
