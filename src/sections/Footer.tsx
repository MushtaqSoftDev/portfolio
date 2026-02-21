const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5">
      <div className="text-white-500 flex gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <p>Privacy Policy</p>
      </div>

      <div className="flex gap-3">
        <div className="social-icon">
          <a href="https://github.com/MushtaqSoftDev" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/assets/github.svg" alt="github" className="w-1/2 h-1/2" />
          </a>
        </div>
        <div className="social-icon">
          <a href="https://linkedin.com/in/mushtaq-ahmad-a37537151" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/assets/linkedin.png" alt="twitter" className="w-1/2 h-1/2" />
          </a>
        </div>
        <div className="social-icon">
          <a href="https://gitlab.com/mushtaq3/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/assets/gitlab.png" alt="instagram" className="w-1/2 h-1/2" />
          </a>
        </div>
      </div>

      <p className="text-white-500">© {currentYear} Mushtaq Ahmad. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
