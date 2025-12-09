import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from "react-icons/lu";

const CertificationInfoForm = ({certifications,
  updateArrayItem, 
  addArrayItem, 
  removeArrayItem,
}) => {
  return (
    <div className="px-5 pt-5">
        <h2>Certificaciones</h2>

        <div className="mt-4 flex flex-col gap-4 mb-3">
          {certifications.map((cert, index) =>(
            <div 
              key={index}
              className="border border-gray-200/80 p-4 rounded-lg relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Titulo del Certificado"
                  placeholder="FullStack Web Developer"
                  type="text"
                  value={cert.title || ""}
                  onChange={({ target }) => 
                  updateArrayItem(index, "title", target.value)
                  }
                  />


                  <Input
                  label="Emitido por: "
                  placeholder="Coursera / Google / etc."
                  type="text"
                  value={cert.issuer || ""}
                  onChange={({ target }) => 
                  updateArrayItem(index, "issuer", target.value)
                  }
                  />


                  <Input
                  label="Año "
                  placeholder="2024"
                  type="text"
                  value={cert.year || ""}
                  onChange={({ target }) => 
                  updateArrayItem(index, "year", target.value)
                  }
                  />

              </div>

                  {certifications.length > 0 && (
                    <button type="button"
                      className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                      onClick={()=>removeArrayItem(index)}>
                      <LuTrash2/>
                    </button>
                      )}
            </div>
          ))}



           <button 
             type="button" 
             className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 font-medium hover:bg-purple cursor-pointer"
             onClick={() =>
             addArrayItem({
              title:"",
              issuer:"",
              year: "",
              
                })}
                                      >
                                      <LuPlus /> Adherir Certificado
                                  </button>
        </div>
    </div>
  )
}

export default CertificationInfoForm