import { useState, useContext, useEffect } from "react";
import axios from "axios";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import Logo from "../components/Logo";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const ProcesarUrl = () => {
  const [url, setUrl] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  // Protección de la RUTA
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ ERROR: URL VACÍA
    if (!url) {
      setResultado({ error: "Falta la URL" });
      return;
    }

    setCargando(true);

    try {
      // Llamada al backend
      const response = await axios.post(
        "http://localhost:3000/api/scrape",
        { url }
      );

      setResultado(response.data);
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        "Error al procesar la URL";
      setResultado({ error: msg });
    }

    setCargando(false);
  };
  console.log('User: ', user);
  console.log('El resultadito viejita: ', resultado);

  const handleCTA = () => {
    //const laburoLinkedin = localStorage.setItem("LaburoLinkedin", JSON.stringify(resultado));
    navigate(`/analisis/${user._id}`);
  }// handleCta




  return (
    <div>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <Logo size={160} className="mr-2" />
            </div>
            <ProfileInfoCard />
          </header>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-xl font-semibold mb-4">Empleos de LinkedIn</h1>
        <h2>Ingresar la URL del Post de LinkedIn que estés interesado</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Pegá una URL"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            {cargando ? "Cargando..." : "Procesar"}
          </button>
        </form>

        {/* ❌ Mostrar ERRORES */}
        {resultado?.error && (
          <div className="mt-4 p-3 bg-red-200 border border-red-400 text-red-800 rounded">
            <strong>Error:</strong> {resultado.error}
          </div>
        )}

        {/* ✔ Mostrar RESULTADOS si NO hay error */}
        {resultado && !resultado.error && (
            <>
          <div className="mt-4 p-3 bg-gray-100 rounded border">
            <h3 className="font-bold">Titulo del TAB:</h3>
            <p>{resultado.title}</p>

            <h3 className="font-bold mt-3">Título del Puesto:</h3>
            <p>{resultado.jobTitle}</p>

            <h3 className="font-bold mt-3">Empresa:</h3>
            <p>{resultado.company}</p>

            <h3 className="font-bold mt-3">Ubicación:</h3>
            <p>{resultado.location}</p>

            <h3 className="font-bold mt-3">Descripción:</h3>
            <p className="whitespace-pre-line">{resultado.descriptionText}</p>
          </div>
          <button className="bg-[#32baa5] text-white px-4 py-2 rounded hover:bg-[#32baa5]/90 transition-colors w-full mt-2 cursor-pointer"
        onClick={handleCTA}> Crear CV para esta posición
        </button>
          </>
        )}
        
      </div>
    </div>
  );
};

export { ProcesarUrl };
