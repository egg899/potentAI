import TEMPLATE_ONE_IMG from "../assets/template-one.png";
import TEMPLATE_TWO_IMG from "../assets/template-two.png";
import TEMPLATE_THREE_IMG from "../assets/template-three.png";
import ContactInfo from "../components/ResumeSections/ContactInfo";


export const resumeTemplates = [
    {
        id:'01',
        thumbnailImg:TEMPLATE_ONE_IMG,
        colorPaletteCode: 'themeOne'
    },
    {
        id:'02',
        thumbnailImg:TEMPLATE_TWO_IMG,
        colorPaletteCode: 'themeTwo'
    },
    {
        id:'03',
        thumbnailImg:TEMPLATE_THREE_IMG,
        colorPaletteCode: 'themeThree'
    },
]

export const themeColorPalette = {
  themeOne: [
    ["#EBFDFF", "#A1F4F0", "#CEFAFE", "#0288C8", "#4A5565"],
    ["#E5DFBF", "#B4EFE7", "#93E2DA", "#22AC9A", "#3D4C54"],
    ["#F5F4F7", "#E6E0FF", "#9C9CFF", "#8579D1", "#4B4C5C"],
    ["#FFFAF7", "#F0E6FF", "#BAF0FF", "#3391FF", "#4461D5"],
    ["#FFFCF7", "#FFECC6", "#FACD64", "#76792C", "#545A3A"],
    ["#F5FAFB", "#E4E7EB", "#BCC5DE", "#7F9FC5", "#20374F"],

     ["#F4FFFD", "#F03FD2", "#E082D4", "#B4C709", "#384C48"],
    ["#FFF7F0", "#FFE609", "#FFE0AA", "#FF6951", "#84C743"],
    ["#F9FCFF", "#E3F1F9", "#C0E0EC", "#86CACF", "#46455C"],
    ["#FFFDf6", "#FFF4D7", "#FFEFA2", "#FFD08B", "#57534E"],
    ["#F8FCFF", "#C8F8FF", "#99E0FF", "#80D7A3", "#2B3A2F"],

    ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#AAAAAA", "#222222"],
    ["#E3F2F0", "#96CAF9", "#8A6214", "#E1BBE5", "#0047A1"],
    
  ]
};


export const DUMMY_RESUME_DATA = {
  profileInfo: {
    profileImg: null,
    profilePreviewUrl: "",
    fullName: "John Doe",
    designation: "Desarrollador Full Stack",
    summary: "Apasionado por la tecnología, con más de 3 años de experiencia desarrollando aplicaciones web modernas y eficientes. Me destaco por la escritura de código limpio y soluciones centradas en el usuario."
  },
//   template: {
//     theme: "modern",
//     colorPalette: "themeOne",
//   },
  contactInfo: {
    email: "john.doe@example.com",
    phone: "+54 9 11 2345 6789",
    location: "#12 Anywhere, Any City, Any COuntry",
    linkedin: "https://linkedin.com/in/juanperez",
    github: "https://github.com/juanperez",
    website: "https://juanperez.dev",
  },
  workExperience: [
    {
      company: "Tech Solutions SA",
      role: "Desarrollador Frontend",
      startDate: "2022-3",
      endDate: "2025-2",
      description: "Desarrollo de interfaces modernas con React, integración con APIs REST y colaboración en equipos ágiles usando metodologías Scrum.",
    },
    {
      company: "Digital Agency SRL",
      role: "Desarrollador Web",
      startDate: "2020-01",
      endDate: "2022-02",
      description: "Mantenimiento de sitios WordPress, diseño de componentes en JavaScript y soporte técnico para clientes empresariales.",
    }
  ],
  education: [
    {
      degree: "Maestría en Ingeniería de Software",
      institution: "UTN - Universidad Tecnológica Nacional",
      startDate: "2021",
      endDate: "2023"
    },
    {
      degree: "Licenciatura en Desarrollo de Software",
      institution: "UTN - Universidad Tecnológica Nacional",
      startDate: "2017",
      endDate: "2021"
    }
  ],
  skills: [
    { name: "JavaScript", progress: 90 },
    { name: "React", progress: 85 },
    { name: "Node.js", progress: 80 },
    { name: "MongoDB", progress: 75 },
    { name: "Git", progress: 85 }
  ],
  projects: [
    {
      title: "Gestor de Tareas",
      description: "Aplicación web para gestionar tareas personales con autenticación y filtros por estado.",
      github: "https://github.com/juanperez/task-manager",
      liveDemo: "https://taskmanager.juanperez.dev"
    },
    {
      title: "E-commerce de Guitarras",
      description: "Tienda en línea con carrito, login de usuarios y administración de productos.",
      github: "https://github.com/juanperez/guitar-store",
      liveDemo: "https://guitarstore.juanperez.dev"
    }
  ],
  certifications: [
    {
      title: "Full Stack Developer",
      issuer: "Academia Coderhouse",
      year: "2022"
    },
    {
      title: "JavaScript Avanzado",
      issuer: "Platzi",
      year: "2021"
    }
  ],
  languages: [
    {
      name: "Español",
      progress: 100
    },
    {
      name: "Inglés",
      progress: 80
    }
  ],
  interests: ["Música", "Videojuegos", "Lectura de ciencia ficción", "Hackathons"]
};
