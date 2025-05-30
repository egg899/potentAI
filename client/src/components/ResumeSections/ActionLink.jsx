import React from 'react'
import { Link } from 'react-router-dom';
const ActionLink = ({icon, link, bgColor}) => {
  return (
    <div
        className="flex items-center gap-3">
            <div className="w-[25] h-[25px] flex items-center justify-center rounded-full"
            style={{ backgroundColor: bgColor }}>
                {icon}</div>
            
            <p className="text-[13px] font-medium underline cursor-pointer break-all">
                 <a href={link} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full ${bgColor}`}>
                                                     {link} </a></p>
            </div>
  )
}

export default ActionLink