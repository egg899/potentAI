import { useState, useContext, useEffect } from "react";
import axios from "axios";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import Logo from "../components/Logo";
import { UserContext } from "../context/userContext";
import {  useNavigate  } from "react-router-dom";


const ProcesarUrl = () => {
    const [ url, setUrl ] = useState("");
    const [ resultado, setResultado ] = useState("");
    const [cargando, setCargando] = useState(false);

    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    // Protección de la RUTA
    useEffect(() => {
        if(!loading && !user) {
            navigate("/"); // redirige si NO esta Logueado
        }
    }, [loading, user, navigate]);




    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!url) return;

        setCargando(true);
    
    
        try {
            //Solo para traer algo simple
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
            const html = response.data.contents;


            //Buscar título con regex simple
            const tituloMatch = html.match(/<title>(.*?)<\/title>/i);
            const titulo = tituloMatch ? tituloMatch[1]: "No se encontró titulo";

            setResultado(`El título de la página es: "${titulo}"`);
        }
        catch (error) {
            console.error(error);
            setResultado("Error al obtener la página. ¿La URL es correcta?");
        }//catch
    
        setCargando(false);
    
    };// handleSubmit


    return (
<div>
         <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}> 
              <Logo size={160} className="mr-2" />
            </div>
            <ProfileInfoCard />
          </header>
        </div>
      </div>




        <div className="p-4 max-w-lg mx-auto">

         





            <h2 className="text-xl font-semibold mb-4">Probarl URL</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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


            {resultado && (
                <div className="mt-4 p-3 bg-gray-100 rounded border">
                    {resultado}
                </div>
            )}
        </div></div>
    );//return

}//ProcearUrl

export {ProcesarUrl};