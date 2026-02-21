import { useState } from 'react';
import Globe from 'react-globe.gl';

import Button from '../components/Button.tsx';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

const locations: Location[] = [
  {
    lat: 41.38,
    lng: 2.15,
    label: 'Barcelona, Spain',
  },
];

const About = () => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(' adrian@jsmastery.pro');
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <section className="c-space py-32" id="about">
      <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img src="assets/Profile.png" alt="ProfilePic" className="w-full sm:h-[276px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">Hi, I'm Mushtaq Ahmad</p>
              <p className='grid-headtext'>Web Application Developer</p>
              <p className="grid-subtext">
                With 4 years of experience, I develop dynamic, data-driven web apps using modern frontend & backend technologies for seamless performance.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img src="assets/techStack.png" alt="TechStack" className="w-full sm:h-[276px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">Tech Stack</p>
              <p className="grid-subtext">
                Specialized in MERN stack & also work with Vue.js, PHP, Laravel, Python, Flask, PyTorch, Java, Spring/Spring Boot and CMS platform like Wordpress to build scalable and user-friendly apps.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-4">
          <div className="grid-container">
            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
              <Globe 
                height={326}
                width={326}
                backgroundColor="rgba(0, 0, 0, 0)"
                backgroundImageOpacity={0.5}
                showAtmosphere
                showGraticules
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                htmlElement={(d: Location) => {
                  const el = document.createElement('div');
                  el.innerHTML = '📍';
                  el.style.fontSize = '28px';
                  el.style.cursor = 'pointer';
                  el.title = d.label;
                  return el;
                }}
              />
            </div>
            <div>
              <p className="grid-headtext">Flexible with time zones and collaboration across locations.</p>
              <p className="grid-subtext">I&apos;m based in Barcelona Spain and available for remote work worldwide.</p>
              <a href='#contact' className='w-fit'>
                <Button name="Contact Me" isBeam containerClass="w-full mt-10"/>
              </a>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 xl:row-span-3">
          <div className="grid-container">
            <img src="assets/grid3.png" alt="grid-3" className="w-full sm:h-[266px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">Certification</p>
              <p className="grid-subtext">
                Passionate about coding and problem-solving, continuously explore new technologies. I've recently achieved (ORACLE Cloud Infrastructure) OCI AI Foundation & OCI GEN AI Professional certifications to level up my skills.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container">
            <img
              src="assets/grid4.png"
              alt="grid-4"
              className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"
            />

            <div className="space-y-2">
              <p className="grid-subtext text-center">Contact me</p>
              <div className="copy-container" onClick={handleCopy}>
                <img src={hasCopied ? 'assets/tick.svg' : 'assets/copy.svg'} alt="copy" />
                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">mushtaquok70@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
