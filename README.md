## Portfolio

An interactive 3D developer portfolio built with **React**, **Three.js / React Three Fiber**, and **TailwindCSS**.  
It showcases projects, experience, and a built‑in AI chatbot powered by **LangChain** and **Diff LLM Google Gemini, Groq & Llama**.

### Live Features
- **3D Hero & Scenes**: Interactive 3D models rendered with React Three Fiber and Drei.
- **Project Showcase**: Cards with descriptions, tech stack, and links.
- **Experience Timeline**: Work history and skills overview.
- **AI Models**: Interactive deep learning models with browser-based inference. Upload images for real-time classification (Cat/Dog/Other) using ONNX Runtime Web.
- **AI Chatbot**: RAG‑style assistant that answers questions about the portfolio.
- **Responsive UI**: TailwindCSS and `react-responsive` for mobile, tablet, and desktop layouts.
- **Notifications**: Toast messages for user feedback (e.g. contact form).

### Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript (fully migrated from JavaScript)
- **Styling**: TailwindCSS + custom theme
- **3D & Graphics**: Three.js, React Three Fiber, Drei, maath, react-globe.gl
- **Animations**: GSAP + @gsap/react
- **AI / ML**: ONNX Runtime Web (browser-based model inference), PyTorch (model training)
- **AI / Backend**: LangChain, @langchain/google-genai, Render web service (RAG API)
- **Email**: EmailJS (@emailjs/browser)

### Project Structure (High Level)
- `src/sections/` – Page sections (Hero, About, Projects, Experience, AIModels, Contact, Footer, Navbar, Chatbot).
- `src/components/` – Reusable UI and 3D components (Developer, DemoComputer, HeroSymbols, Button, Alert, Loading, etc.).
- `src/hooks/` – Custom hooks such as `useAlert` for managing alert/notification state.
- `src/utils/` – Utility functions (e.g., `imagePreprocessing.ts` for ONNX model input preparation).
- `src/constants/index.ts` – Static data for navigation, projects, and work experience.
- `src/ImageClassifier/` – PyTorch training notebooks and ONNX model files.
- `rag-portfolio-bot` (separate service, deployed to Render) – RAG chatbot backend consumed by the portfolio via HTTP.
- `public/` – Static assets (images, textures, videos, icons, ONNX models).
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

#### Local Development
Create a `.env` file in the project root and configure:
- `VITE_PORTFOLIO_EMAILJS_SERVICE_ID`
- `VITE_PORTFOLIO_EMAILJS_TEMPLATE_ID`
- `VITE_PORTFOLIO_EMAILJS_PUBLIC_KEY`

#### Cloudflare Pages Deployment
For production deployment on Cloudflare Pages, set the same environment variables in **Cloudflare Dashboard**:

1. Go to your Cloudflare Pages project → **Settings** → **Environment Variables**
2. Add these three variables (for Production environment):
   - `VITE_PORTFOLIO_EMAILJS_SERVICE_ID`
   - `VITE_PORTFOLIO_EMAILJS_TEMPLATE_ID`
   - `VITE_PORTFOLIO_EMAILJS_PUBLIC_KEY`
3. Trigger a new deployment for the variables to take effect

**Note**: These are set as **Environment Variables** (not Secrets) since they're used client-side. The contact form will display an error if any are missing.

#### Backend Environment Variables
For the AI chatbot backend, configure provider keys (e.g. Google, Groq, Llama) in the **Render** service environment, not in this frontend project.

### AI Models Section

The **AI Models** section showcases interactive deep learning models that run entirely in the browser using **ONNX Runtime Web**. Currently features:

#### Cat & Dog Classifier
- **Model**: PyTorch-based image classification model trained to distinguish between cats, dogs, and other objects.
- **Training Pipeline**: 
  - Data preparation: Resize → Grayscale → Tensor conversion → DataLoader batches
  - Model training: Fully-connected neural network with CrossEntropyLoss + Adam optimizer
  - Hyperparameter optimization: Optuna for learning rate tuning
  - Model evaluation: Accuracy measured on test set
  - Quantization-Aware Training (QAT): Model optimization for efficient inference
  - Export: Converted to single-file ONNX format for browser deployment
- **Inference**: Runs directly in the browser using ONNX Runtime Web (WASM backend)
- **Input**: 28×28 grayscale images
- **Output**: Classification results (Cat, Dog, or Other) with confidence percentages
- **Model File**: `public/cat-dog_classification.onnx` (single-file, no external dependencies)

#### Technical Details
- **Framework**: PyTorch (training), ONNX Runtime Web (inference)
- **Preprocessing**: Client-side image preprocessing (resize, grayscale conversion, normalization)
- **Deployment**: Model runs entirely client-side, no backend required for inference
- **Expandable**: Architecture supports adding more models via the model selector

#### Training Notebook
- Location: `src/ImageClassifier/ImageClassificationOptuna+QAT.ipynb`
- Includes complete ML pipeline: data preparation → training → evaluation → testing → ONNX export
- Model supports 3-class classification (cats, dogs, others)

### Backend / Chatbot Notes
- The frontend chatbot sends user questions to a RAG API hosted on **Render** at `https://rag-portfolio-bot.onrender.com/chat`.
- That backend is implemented with **LangChain** and provider LLMs (Google Gemini, Groq, Llama, etc.).
- Knowledge/RAG data is handled entirely in the Render backend.

### 3D Models & Assets
- 3D models are downloaded from the **Sketchfab** open‑source 3D model community.
- Please make sure to respect the original authors’ licenses and attributions if you redistribute or modify this project.


