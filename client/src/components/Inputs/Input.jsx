import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, name, label, placeholder, type, helperText }) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className="flex flex-col">
            <label className="text-[13px] text-slate-800 mb-1">{label}</label>
            {helperText && (
                <p className="text-xs text-slate-500 mt-1">{helperText}</p>
            )}
            <div className="input-box relative border border-slate-300 rounded-md px-3 py-2 flex items-center ">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}    
                    className="w-full bg-transparent outline-none text-sm"
                    value={value}
                    name={name}
                    onChange={onChange}
                />

                {type === "password" && (
                    showPassword ? (
                        <FaRegEye
                            size={20}
                            className="text-primary cursor-pointer"
                            onClick={toggleShowPassword}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={20}
                            className="text-slate-400 cursor-pointer"
                            onClick={toggleShowPassword}
                        />
                    )
                )}
            </div>

            
        </div>
    )
}

export default Input;
