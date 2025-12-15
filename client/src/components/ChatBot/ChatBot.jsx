import { useEffect, useState, useRef } from "react";

const faq = [
  { q: "¿Cómo me registro?", a: "Hacé clic en «Ingresar / Registrarse»..." },
  { q: "¿Cómo subo mi CV?", a: "Desde el menú principal, ingresá a «Analizar CV»..." },
  { q: "¿Dónde puedo ver mis CV?", a: "Accedé a «Dashboard» desde el menú principal..." },
  { q: "¿Cómo edito mi perfil?", a: "Ingresá a tu perfil y seleccioná la opción «Editar CV»..." },
  { q: "¿Cómo descargo mi CV?", a: "Dentro de «Dashboard», seleccioná el CV que desees..." }
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [iconVisible, setIconVisible] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animación del icono
  useEffect(() => {
    const timeout = setTimeout(() => setIconVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Animación ventana del chat
  useEffect(() => {
    if (open) setShowChat(true);
    else {
      const timeout = setTimeout(() => setShowChat(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Manejo de mensajes con transición
  const handleSelect = (item) => {
    const newMessages = [
      { from: "user", text: item.q, visible: false },
      { from: "bot", text: item.a, visible: false }
    ];
    // setMessages((prev) => [...prev, ...newMessages]);
    setMessages((prev) => [ ...newMessages]);


    // Activar visibilidad con delay para animación
    newMessages.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          const msgIndex = prev.findIndex(m => m === msg);
          if (msgIndex !== -1) updated[msgIndex].visible = true;
          return updated;
        });
      }, 80 + index * 300); // pequeña demora entre mensajes
    });
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl 
          hover:bg-blue-700 transition-all duration-300 ease-out
          flex items-center justify-center text-3xl cursor-pointer
          transform
          ${iconVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
          ${open ? "scale-90" : "scale-100"}
        `}
      >
        💬
      </button>

      {/* VENTANA DEL CHAT */}
      {showChat && (
        <div
          className={`
            fixed bottom-28 right-6 w-90 h-120 bg-white rounded-2xl shadow-2xl p-4 flex flex-col z-50
            transform transition-all duration-300 ease-out
            ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
          `}
        >
          {/* BOTÓN CERRAR */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 bg-blue-600 text-white w-7 h-7 rounded-full shadow-xl hover:bg-blue-700 transition flex items-center justify-center text-1xl cursor-pointer"
          >
            ✖
          </button>

          <h2 className="text-lg font-semibold text-gray-700 text-center mb-2">
            Asistente Virtual
          </h2>

          {/* MENSAJES CON TRANSICIÓN */}
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-3 mb-3 space-y-3 border border-gray-200">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`
                  p-2 rounded-xl text-sm max-w-[85%]
                  transform transition-all duration-300 ease-out
                  ${m.from === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-200 text-gray-900"}
                  ${m.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                `}
              >
                {m.text}
              </div>
            ))}
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
