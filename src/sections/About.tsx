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
              <p className='grid-headtext'>Applied AI Engineer</p>
              <p className="grid-subtext">
              With 4 years of experience, I build intelligent, data-driven applications by bridging the gap between AI models and production software. I focus on architecting end-to-end automation, integrating LLMs and RAG pipelines, and deploying scalable, containerized solutions on Azure to solve complex real-world business challenges.
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
                Specialized in Python (FastAPI), React, and Docker for AI-driven systems. Proficient in the MERN stack, Java (Spring Boot), and PHP (Laravel), with additional experience in PyTorch and Vue.js. I combine modern AI tools with deep full-stack expertise to build, containerize, and deploy scalable enterprise apps.
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
            <div className="cert-badges">
              <div className="cert-badge cert-badge--oci" title="AGENTIC AI Foundation">
                <span className="cert-badge__icon">OCI</span>
                <span className="cert-badge__label">AGENTIC AI Foundation</span>
              </div>
              <div className="cert-badge cert-badge--oci" title="OCI AI Foundation">
                <span className="cert-badge__icon">OCI</span>
                <span className="cert-badge__label">AI Foundation</span>
              </div>
              <div className="cert-badge cert-badge--oci" title="OCI Gen AI Professional">
                <span className="cert-badge__icon">OCI</span>
                <span className="cert-badge__label">Gen AI Professional</span>
              </div>
              <div className="cert-badge cert-badge--aws" title="AWS Serverless">
                <span className="cert-badge__icon">AWS</span>
                <span className="cert-badge__label">Serverless</span>
              </div>
              <div className="cert-badge cert-badge--aws" title="AWS Cloud Practitioner Essentials">
                <span className="cert-badge__icon">AWS</span>
                <span className="cert-badge__label">Cloud Practitioner</span>
              </div>
            </div>

            <div>
              <p className="grid-headtext">Certification</p>
              <p className="grid-subtext">
                Passionate about coding and problem-solving, continuously exploring new technologies. I&apos;ve achieved (Oracle Cloud Infrastructure) OCI AI Foundation, OCI Gen AI Professional, AWS Serverless, and AWS Cloud Practitioner Essentials certifications to level up my skills.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container">
            <div className="contact-hero-icon" aria-hidden>
              <span className="contact-hero-icon__envelope" />
            </div>

            <div className="space-y-2">
              <p className="grid-subtext text-center">Contact me</p>
              <div className="copy-container" onClick={handleCopy}>
                <div className={`copy-icon ${hasCopied ? 'copy-icon--tick' : 'copy-icon--email'}`} aria-hidden>
                  {hasCopied ? (
                    <span className="copy-icon__tick" />
                  ) : (
                    <span className="copy-icon__email" />
                  )}
                </div>
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
