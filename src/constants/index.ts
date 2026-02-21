export interface NavLink {
  id: number;
  name: string;
  href: string;
}

export interface ProjectTag {
  id: number;
  name: string;
  path: string;
}

export interface Project {
  title: string;
  desc: string;
  subdesc: string;
  href: string;
  texture: string;
  logo: string;
  logoStyle: {
    backgroundColor: string;
    border: string;
    boxShadow: string;
  };
  spotlight: string;
  tags: ProjectTag[];
}

export interface WorkExperience {
  id: number;
  name: string;
  pos: string;
  duration: string;
  title: string;
  icon: string;
  animation: string;
}

export interface Sizes {
  deskScale: number;
  deskPosition: [number, number, number];
  cubePosition: [number, number, number];
  reactLogoPosition: [number, number, number];
  ringPosition: [number, number, number];
  targetPosition: [number, number, number];
}

export const navLinks: NavLink[] = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Work',
    href: '#work',
  },
  {
    id: 4,
    name: 'AI Models',
    href: '#ai-models',
  },
  {
    id: 5,
    name: 'Contact',
    href: '#contact',
  },
];


export const myProjects: Project[] = [
  {
    title: 'Event Management System Using NextJS',
    desc: 'EMS is a full stack event management web application built with NextJS and MongoDB. It allows users to create, manage, and attend events seamlessly through an intuitive interface.',
    subdesc:
      'Built with NextJS, TailwindCSS, and MongoDB, EMS offers features like event creation, user authentication, and real-time updates. The application is designed for scalability and performance, ensuring a smooth user experience.',
    href: 'https://github.com/MushtaqSoftDev/event-scheduler',
    texture: '/textures/project/project2.mp4',
    logo: '/assets/project-logo5.png',
    logoStyle: {
      backgroundColor: '#1C1A43',
      border: '0.2px solid #252262',
      boxShadow: '0px 0px 60px 0px #635BFF4D',
    },
    spotlight: '/assets/spotlight5.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'MongoDB',
        path: '/assets/mongodb.png',
      },
      {
        id: 5,
        name: 'NextJS', 
        path: '/assets/nextjs.png',
      }
    ],
  },
  {
    title: 'MasterJob Portal - AI-Powered Job Portal',
    desc: 'MJP is a smart recruitment platform built with Flask that streamlines the job application process. After sign-up/login users can apply for published jobs & instantly receive confirmation of their submission.',
    subdesc:
      'Built with Flask, Bootstrap & Pandas, MJP extracts the skills from the resume and generates a graphical representation of the candidate. It also features an interactive admin dashboard that visualizes candidate data through dynamic graphs. Recruiters can analyze top applicants & download resumes for hiring decisions.',
    href: 'https://github.com/MushtaqSoftDev/PythonFlask',
    texture: '/textures/project/project1.mp4',
    logo: '/assets/project-logo2.png',
    logoStyle: {
      backgroundColor: '#13202F',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.png',
    tags: [
      {
        id: 1,
        name: 'Flask',
        path: '/assets/flask.jpeg',
      },
      {
        id: 2,
        name: 'Bootstrap',
        path: 'assets/bootstrap.png',
      },
      {
        id: 3,
        name: 'Pandas',
        path: '/assets/pandas.png',
      }
    ],
  },
  {
    title: 'FinchMotion - Java Robotics Control System',
    desc: 'FinchMotion is an interactive robotics project built with Core Java and JDBC API, developed collaboratively with colleagues. It enables the Finch Robot to move, turn & respond dynamically to programmed movement commands.',
    subdesc:
      'Using Java-based logic and database-driven instructions, FinchMotion demonstrates the power of algorithmic motion control. The projects highlights teamwork, hardware integration and real-time execution for intelligent robotic movement.',
    href: 'https://github.com/MushtaqSoftDev/JavaFinchRobot',
    texture: '/textures/project/project2.mp4',
    logo: '/assets/project-logo4.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    tags: [
      {
        id: 1,
        name: 'Java',
        path: '/assets/java.jpeg',
      },
      {
        id: 2,
        name: 'JDBC',
        path: 'assets/jdbc.jpeg',
      }
    ],
  },
  {
    title: 'Betflix - Laravel Streaming Platform',
    desc: 'Betflix is an innovative streaming web app inspired by Netflix, develped project with my colleague. It allows to sign up, log in and manage personalized watchlists with favorites and subscriptions.',
    subdesc:
      'Built using Laravel, Eloquent ORM, Blade with Bootstrap, Betflix offers a full-featured platform for streaming and content management. Admins can perform complete CRUD operations on movies & series, ensuring smooth performance and scalability.',
    href: 'https://github.com/MushtaqSoftDev',
    texture: '/textures/project/project1.mp4',
    logo: '/assets/project-logo1.png',
    logoStyle: {
      backgroundColor: '#2A1816',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      {
        id: 1,
        name: 'Laravel',
        path: '/assets/laravel.png',
      },
      {
        id: 2,
        name: 'Bootstrap',
        path: 'assets/bootstrap.png',
      },
    ],
  },
  {
    title: 'RAG - AI Virtual Assistant',
    desc: 'MAI is a revolutionary AI-powered chatbot that transforms static documents into an  interactive knowledge base using open-source technology. Integrating RAG for hallucination-free responses and a scalable architecture for handling complex domain-specific inquiries.',
    subdesc:
      'Built with Python, Hugging Face, and React, MAI leverages advanced NLP techniques to provide accurate and context-aware answers. Its modular design allows easy integration with various data sources, making it a versatile solution for knowledge management.',
    href: 'https://github.com/MushtaqSoftDev/RagChat',
    texture: '/textures/project/project3.mp4',
    logo: '/assets/project-logo5.png',
    logoStyle: {
      backgroundColor: '#1C1A43',
      border: '0.2px solid #252262',
      boxShadow: '0px 0px 60px 0px #635BFF4D',
    },
    spotlight: '/assets/spotlight5.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Hugging Face',
        path: '/assets/huggingface.png',
      },
      {
        id: 5,
        name: 'Python', 
        path: '/assets/python.jpeg',
      }
    ],
  },
];

export const calculateSizes = (isSmall: boolean, isMobile: boolean, isTablet: boolean): Sizes => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
    ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
    targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
  };
};

export const workExperiences: WorkExperience[] = [
  {
    id: 1,
    name: 'KNITERATE S.L.',
    pos: 'Web Developer (Frontend Focus)',
    duration: '2025 - Feb 2026',
    title: "At Kniterate, I work as a Web Developer for developing and maintaining knitting software. Work closely with designers to implement new features based on their specific requirements, translating visual concepts into technical funcionality. Dedicated to imporve the codebase and optimizing performance to ensure smooth workflow for digital knitting production.",
    icon: '/assets/kniterate.png',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'Freelance',
    pos: 'Web Developer',
    duration: '2023 - 2024',
    title: "As a Freelance Web Developer, built a dynamic ROI calculator web app using MERN Stack that instantly generates year-wise profit & agency commission breakdowns, enable clients to visualize investment returns in real-time. Developed a real-time AI chatbot app using Node/Express/MongoDB with Socket.io integration and OpenAI API. ",
    icon: '/assets/freelance.jpeg',
    animation: 'salute',
  },
  {
    id: 3,
    name: 'Mega Star',
    pos: 'IT Technician',
    duration: '2019 - 2024',
    title: "During my tenure at Mega Star, I was responsible for maintaining and troubleshooting IT systems. My duties included hardware and software support, and providing technical assistance to client, which honed my problem-solving skills and technical expertise.",
    icon: '/assets/megastar.jpeg',
    animation: 'clapping',
  },
  {
    id: 4,
    name: 'Global Coaching Center',
    pos: 'Mathematics Tutor',
    duration: '2014 - 2018',
    title: "As a Mathematics Tutor at Global Coaching Center, I provided personalized instruction to students, helping them grasp complex mathematical concepts and improve their academic performance. My approach focused on fostering a supportive learning environment that encouraged critical thinking and problem-solving skills.",
    icon: '/assets/global.png',
    animation: 'salute',
  },
];
