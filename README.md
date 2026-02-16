## Portfolio

An interactive 3D developer portfolio built with **React**, **Three.js / React Three Fiber**, and **TailwindCSS**.  
It showcases projects, experience, and a built‑in AI chatbot powered by **LangChain** and **Diff LLM Google Gemini, Groq & Llama**.

### Live Features
- **3D Hero & Scenes**: Interactive 3D models rendered with React Three Fiber and Drei.
- **Project Showcase**: Cards with descriptions, tech stack, and links.
- **Experience Timeline**: Work history and skills overview.
- **AI Chatbot**: RAG‑style assistant that answers questions about the portfolio.
- **Responsive UI**: TailwindCSS and `react-responsive` for mobile, tablet, and desktop layouts.
- **Notifications**: Toast messages for user feedback (e.g. contact form).

### Tech Stack
- **Framework**: React 18 + Vite
- **Language**: JavaScript (with some TypeScript components)
- **Styling**: TailwindCSS + custom theme
- **3D & Graphics**: Three.js, React Three Fiber, Drei, maath, react-globe.gl
- **Animations**: GSAP + @gsap/react
- **AI / Backend**: LangChain, @langchain/google-genai, Render web service (RAG API)
- **Email**: EmailJS (@emailjs/browser)

### Project Structure (High Level)
- `src/sections/` – Page sections (Hero, About, Projects, Experience, Contact, Footer, Navbar, Chatbot).
- `src/components/` – Reusable UI and 3D components (Developer, DemoComputer, HeroSymbols, Button, Alert, Loading, etc.).
- `src/hooks/` – Custom hooks such as `useAlert` for managing alert/notification state.
- `src/constants/index.js` – Static data for navigation, projects, and work experience.
- `rag-portfolio-bot` (separate service, deployed to Render) – RAG chatbot backend consumed by the portfolio via HTTP.
- `public/` – Static assets (images, textures, videos, icons).
- `vite.config.js`, `tailwind.config.js`, `eslint.config.js` – Tooling and configuration.

### Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create `.env` file**
   Add the required keys (see Environment Variables section below).
3. **Run the development server**
   ```bash
   npm run dev
   ```
4. Open the printed URL (usually `http://localhost:5173`) in your browser.

### Available Scripts
- `npm run dev` – Start the Vite development server.
- `npm run build` – Create a production build.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run ESLint.

### Environment Variables
Create a `.env` file in the project root and configure:
- `VITE_PORTFOLIO_EMAILJS_SERVICE_ID`
- `VITE_PORTFOLIO_EMAILJS_TEMPLATE_ID`
- `VITE_PORTFOLIO_EMAILJS_PUBLIC_KEY`

For the AI chatbot backend, configure provider keys (e.g. Google, Groq, Llama) in the **Render** service environment, not in this frontend project.

### Backend / Chatbot Notes
- The frontend chatbot sends user questions to a RAG API hosted on **Render** at `https://rag-portfolio-bot.onrender.com/chat`.
- That backend is implemented with **LangChain** and provider LLMs (Google Gemini, Groq, Llama, etc.).
- Knowledge/RAG data is handled entirely in the Render backend.

### 3D Models & Assets
- 3D models are downloaded from the **Sketchfab** open‑source 3D model community.
- Please make sure to respect the original authors’ licenses and attributions if you redistribute or modify this project.


