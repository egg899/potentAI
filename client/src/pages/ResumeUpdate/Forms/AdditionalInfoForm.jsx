import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from "react-icons/lu";
import RatingInput from '../../../components/ResumeSections/RatingInput';

const AdditionalInfoForm = (
   { languages,
    interests,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
}) => {
  return (
    <div className="px-5 pt-5">
        <h2 className="text-lg font-semibold text-gray-900">Información Adicional</h2>

        {/* Sección de Lenguajes */}
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Lenguajes</h3>
            <div className="flex flex-col gap-4">
                {languages?.map((lang, index) =>(
                    <div
                    key={index}
                    className="border border-gray-200 p-4 rounded-lg relative"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 items-start">
                            <Input
                                label="Lenguaje"
                                placeholder="Ej: Inglés"
                                value={lang.name || ""}
                                onChange={({ target }) => 
                                updateArrayItem("languages", index, "name", target.value)
                  }
                  />
                    <div>
                  {/* <div className="flex flex-col"> */}
                        <label className="text-[13px] text-slate-800 mb-1">
                          Proficiencia ({ lang.progress  || 0 })
                        </label> 
                      <div className="mt-5">
                        <RatingInput
                          value={lang.progress || 0}
                          
                          onChange={(value) => 
                            updateArrayItem("languages", index, "progress", value)
                          }
                          total={5}
                          activeColor="#0eca5e9"
                          inactiveColor="#e0f2fe"
                        />
                            
                            </div>    
                        </div> 

                          {languages.length > 1 && (
                            <button type="button"
                               className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                                onClick={()=>removeArrayItem("languages", index)}>
                                <LuTrash2/>
                                </button> )}


                   </div>      

                    </div>
                
                ))}

             <button 
                         type="button" 
                         className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 font-medium hover:bg-purple cursor-pointer"
                         onClick={() =>
                         addArrayItem("languages",{
                          name: "",
                          progress: 0,
                      
                          
                            })}
                                                  >
                                                  <LuPlus /> Adherir Lenguaje
                                              </button>
            
            
            
            </div>

        </div>
{console.log(interests)}

{/*Seccion de Intereses*/}
    <div className="mt-8 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Intereses</h3>
        {interests?.map((interest, index) => (
            <div
                key={index}
                className="relative rounded-lg"
            >
                <Input 
                    
                    placeholder="Ej. Lectura"
                    type="text"
                    value={interest || ""}
                    onChange={({target}) => {
                            updateArrayItem("interests", index, null, target.value)
                          }}
                        />


                  {interests.length > 1 && (
                            <button type="button"
                               className="top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                                onClick={()=>removeArrayItem("interests", index)}>
                                <LuTrash2/>
                                </button> )}

            </div>
            
        ))}
        <button 
                       type="button" 
                       className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 font-medium hover:bg-purple cursor-pointer"
                        onClick={() =>
                        addArrayItem("interests","")}
                        >
                        <LuPlus /> Adherir Interés
                    </button>
        
    </div>
        </div>
  )
}

export default AdditionalInfoForm