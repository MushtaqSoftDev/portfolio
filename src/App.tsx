import Hero from './sections/Hero.tsx';
import About from './sections/About.tsx';
import Footer from './sections/Footer.tsx';
import Navbar from './sections/Navbar.tsx';
import Contact from './sections/Contact.tsx';
import Projects from './sections/Projects.tsx';
import WorkExperience from './sections/Experience.tsx';
import AIModels from './sections/AIModels.tsx';
import Chatbot from './sections/Chatbot.tsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <main className="max-w-7xl mx-auto relative">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <WorkExperience />
      <AIModels />
      <Contact />
      <Footer />
      <Chatbot />

      {/** Toast outlet */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme="dark" 
      />
    </main>
  );
};

export default App;
