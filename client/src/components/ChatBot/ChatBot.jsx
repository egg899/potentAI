import { useEffect, useState, useRef } from "react";

const faq = [
  {
    q: "¿Cómo me registro?",
    a: "Hacé clic en «Ingresar / Registrarse» y, a continuación, seleccioná la opción «Registrarse» para crear tu cuenta."
  },
  {
    q: "¿Cómo subo mi CV?",
    a: "Desde el menú principal, ingresá a «Analizar CV». Luego seleccioná el archivo desde tu dispositivo, hacé clic en «Extraer CV» y finalizá el proceso con la opción «Mejorar CV»."
  },
  {
    q: "¿Dónde puedo ver mis CV?",
    a: "Accedé a «Dashboard» desde el menú principal para visualizar todos los CV que hayas creado."
  },
  {
    q: "¿Cómo edito mi perfil?",
    a: "Ingresá a tu perfil y seleccioná la opción «Editar CV» para actualizar tu información."
  },
  {
    q: "¿Cómo descargo mi CV?",
    a: "Dentro de «Dashboard», seleccioná el CV que desees y hacé clic en «Vista previa y descarga» para obtener el archivo."
  }
];


export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  
  // 🚀 Hooks dentro del componente
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // scroll cuando cambian los mensajes

  const handleSelect = (item) => {
    setMessages((prev) => [
      // ...prev,
      { from: "user", text: item.q },
      { from: "bot", text: item.a }
    ]);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-blue-700 transition z-50 flex items-center justify-center text-3xl cursor-pointer"
      >
        💬
      </button>

      {/* VENTANA DEL CHAT */}
      {open && (
        <div className="fixed bottom-28 right-6 w-90 h-120 bg-white rounded-2xl shadow-2xl p-4 flex flex-col z-50">
                
                <button
              onClick={() => setOpen(!open)}
              className="relative left-60 bg-blue-600 text-white w-7 h-7 rounded-full shadow-xl hover:bg-blue-700 transition z-50 flex items-center justify-center text-1xl cursor-pointer"
            >✖
            </button>
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-2">
            Asistente Virtual
          </h2>

          {/* MENSAJES */}
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-3 mb-3 space-y-3 border border-gray-200">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl text-sm max-w-[85%] ${
                  m.from === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 text-gray-900"
                }`}
              >
                {m.text}
              </div>
            ))}
            {/* Mantener scroll abajo */}
            <div ref={messagesEndRef} />
          </div>

          {/* OPCIONES */}
          <div className="space-y-2 overflow-y-auto max-h-40">
            {faq.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer"
              >
                {item.q}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
