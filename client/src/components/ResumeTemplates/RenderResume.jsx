import React from 'react';
import TemplateOne from './TemplateOne';

const RenderResume = ({
        templateId,
        resumeData,
        colorPalette,
        containerWidth,
}) => {{console.log('RESUME-DATA de Render: ', resumeData.contactInfo)}
   switch (templateId) {
        case "01":
            return (
                 
             <TemplateOne  
                resumeData={resumeData}
                colorPalette={colorPalette}
                containerWidth={containerWidth}/>
            );
            default:
                 return (
             <TemplateOne  
                resumeData={resumeData}
                colorPalette={colorPalette}
                containerWidth={containerWidth}/>
            );
           
    }
}

export default RenderResume