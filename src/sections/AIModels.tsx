import { useState, useRef, useEffect } from 'react';
import * as ort from 'onnxruntime-web';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { preprocessImage } from '../utils/imagePreprocessing.ts';

interface Model {
  id: number;
  name: string;
  description: string;
  modelPath: string;
  classes: string[];
  inputShape: [number, number, number, number];
}

interface Prediction {
  class: string;
  confidence: string;
  isRejected: boolean;
}

const AIModels = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedModel, setExpandedModel] = useState<number>(0);
  const [wasmConfigured, setWasmConfigured] = useState<boolean>(false);
  /** 'classifier' = Cat & Dog (or other models); 'concepts' = Math & Concepts. Same content area, no extra page length. */
  const [currentView, setCurrentView] = useState<'classifier' | 'concepts'>('classifier');
  const desmosContainerRef = useRef<HTMLDivElement>(null);
  const desmosCalculatorRef = useRef<{ destroy: () => void } | null>(null);

  // Configure ONNX Runtime WASM paths on component mount
  useEffect(() => {
    // Use CDN for WASM files - more reliable than local files
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.1/dist/';
    ort.env.wasm.numThreads = 1; // Use single thread for better compatibility
    setWasmConfigured(true);
  }, []);

  // Desmos flying-bird graph: load by default with slider t (0–10), editable
  // For production (e.g. Cloudflare Pages): set VITE_DESMOS_API_KEY in env. Otherwise demo key is used (may have limits).
  const desmosApiKey =
    import.meta.env.VITE_DESMOS_API_KEY ?? 'dcb31709b452b1cf9dc26972add0fda6';
  const DESMOS_SCRIPT_URL = `https://www.desmos.com/api/v1.4/calculator.js?apiKey=${desmosApiKey}`;
  useEffect(() => {
    if (currentView !== 'concepts') {
      if (desmosCalculatorRef.current) {
        desmosCalculatorRef.current.destroy();
        desmosCalculatorRef.current = null;
      }
      return;
    }
    const elt = desmosContainerRef.current;
    if (!elt) return;

    const initCalculator = () => {
      const Desmos = (window as unknown as { Desmos: { GraphingCalculator: (el: HTMLElement, opts?: object) => { setExpressions: (e: object[]) => void; destroy: () => void } } }).Desmos;
      if (!Desmos || !elt.isConnected) return;
      const calculator = Desmos.GraphingCalculator(elt, {
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        lockViewport: false,
      });
      calculator.setExpressions([
        { id: 't', latex: 't=5', sliderBounds: { min: '0', max: '10' } },
        {
          id: 'bird',
          latex: 'y=\\left|x\\right|\\sin\\left(\\left|x\\right|-t\\right)\\left\\{-2<x<2\\right\\}',
        },
      ]);
      desmosCalculatorRef.current = calculator;
    };

    if ((window as unknown as { Desmos?: unknown }).Desmos) {
      initCalculator();
    } else {
      const script = document.createElement('script');
      script.src = DESMOS_SCRIPT_URL;
      script.async = true;
      script.onload = initCalculator;
      document.head.appendChild(script);
    }

    return () => {
      if (desmosCalculatorRef.current) {
        desmosCalculatorRef.current.destroy();
        desmosCalculatorRef.current = null;
      }
    };
  }, [currentView]);

  const models: Model[] = [
    {
      id: 0,
      name: 'Cat & Dog Classifier',
      description: 'A PyTorch-based image classification model trained to distinguish between cats and dogs. Built using a simple neural network architecture with Optuna hyperparameter optimization and Quantization-Aware Training (QAT) for efficient inference.',
      modelPath: '/cat-dog_classification.onnx',
      // 3-class model: Cat, Dog, Other (non-cat/dog)
      classes: ['Cat', 'Dog', 'Other'],
      inputShape: [1, 1, 28, 28],
    },
  ];

  const currentModel = models[expandedModel];

  useGSAP(() => {
    if (prediction !== null) {
      gsap.fromTo(
        '.prediction-result',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [prediction]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Wait for WASM to be configured
    if (!wasmConfigured) {
      setError('Model is still initializing. Please wait a moment and try again.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setPrediction(null);

    try {
      // Preprocess image
      const preprocessedData = await preprocessImage(file);

      // Create ONNX session with WASM execution provider
      // Using 'wasm' provider which is more reliable for browser environments
      const session = await ort.InferenceSession.create(currentModel.modelPath, {
        executionProviders: ['wasm'],
      });

      // Prepare input tensor
      const inputTensor = new ort.Tensor('float32', preprocessedData, currentModel.inputShape);

      // Run inference
      const feeds = { input: inputTensor };
      const results = await session.run(feeds);
      const output = results.output.data as Float32Array; // raw logits

      // 3-class model: logits for [Cat, Dog, Other]
      const [catLogit, dogLogit, otherLogit] = output;

      // Apply softmax over all three logits to get proper probabilities in [0,1]
      const maxLogit = Math.max(catLogit, dogLogit, otherLogit);
      const expCat = Math.exp(catLogit - maxLogit);
      const expDog = Math.exp(dogLogit - maxLogit);
      const expOther = Math.exp(otherLogit - maxLogit);
      const sumExp = expCat + expDog + expOther;

      const catProb = expCat / sumExp;
      const dogProb = expDog / sumExp;
      const otherProb = expOther / sumExp;

      // Pick the class with highest probability
      const probs = [catProb, dogProb, otherProb];
      const predictedClassIndex = probs.indexOf(Math.max(...probs));
      const predictedClass = currentModel.classes[predictedClassIndex];
      const confidence = probs[predictedClassIndex];

      setPrediction({
        class: predictedClass,
        confidence: (confidence * 100).toFixed(2),
        isRejected: false,
      });

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    } catch (err) {
      console.error('Inference error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleModelSelect = (modelId: number) => {
    setExpandedModel(modelId);
    setSelectedImage(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <section className="c-space my-20" id="ai-models">
      <p className="head-text">AI Models</p>
      <p className="text-white-600 mt-4 text-lg">
        Interactive deep learning models built with PyTorch. Upload images to see predictions in real-time.
      </p>

      {/* View tabs: Cat & Dog Classifier | Math & Concepts (same content area, no longer page) */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button
          type="button"
          onClick={() => setCurrentView('classifier')}
          className={`px-6 py-3 rounded-lg border transition-all ${
            currentView === 'classifier'
              ? 'border-purple-500 bg-purple-500/10 text-white'
              : 'border-black-300 bg-black-200 text-white-600 hover:border-purple-500/50'
          }`}>
          Cat & Dog Classifier
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('concepts')}
          className={`px-6 py-3 rounded-lg border transition-all ${
            currentView === 'concepts'
              ? 'border-cyan-500 bg-cyan-500/10 text-white'
              : 'border-black-300 bg-black-200 text-white-600 hover:border-cyan-500/50'
          }`}>
          Math & Concepts
        </button>
      </div>

      {/* Single content area: show classifier or concepts (swap, no stacking) */}
      {currentView === 'classifier' && (
      <div className="grid lg:grid-cols-2 grid-cols-1 mt-12 gap-5 w-full">
        {/* Upload Card */}
        <div className="flex flex-col gap-5 relative sm:p-10 py-10 px-5 shadow-2xl shadow-black-200 border border-black-300 bg-black-200 rounded-lg">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            {selectedImage ? (
              <div className="relative w-full">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPrediction(null);
                    setError(null);
                  }}
                  className="absolute top-2 right-2 bg-black-300 p-2 rounded-full hover:bg-black-400 transition-colors">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={handleCardClick}
                className="w-full h-[400px] border-2 border-dashed border-black-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors group">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-black-300 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <svg
                      className="w-8 h-8 text-white-600 group-hover:text-purple-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <p className="text-white-600 group-hover:text-white transition-colors">
                    Click to upload an image
                  </p>
                  <p className="text-sm text-white-600/70">Supports: JPG, PNG, WebP</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Loading State */}
            {isLoading && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white-600">Processing image...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Prediction Result */}
            {prediction && (
              <div className="prediction-result mt-6 w-full p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg">
                <p className="text-white-600 mb-2">
                  {prediction.isRejected ? 'Result:' : 'Prediction:'}
                </p>
                <p className="text-3xl font-bold text-white mb-2">{prediction.class}</p>
                <p className="text-white-600">
                  Confidence:{' '}
                  <span className="text-purple-400 font-semibold">{prediction.confidence}%</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Model Description Card */}
        <div className="flex flex-col gap-5 relative sm:p-10 py-10 px-5 shadow-2xl shadow-black-200 border border-black-300 bg-black-200 rounded-lg">
          <div className="p-3 backdrop-filter backdrop-blur-3xl w-fit rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <svg
              className="w-10 h-10 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-5 text-white-600 my-5">
            <p className="text-white text-2xl font-semibold">{currentModel.name}</p>
            <p className="leading-relaxed">{currentModel.description}</p>

            <div className="mt-4 p-4 bg-black-300/50 rounded-lg">
              <p className="text-white mb-2 font-semibold">Model Details:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Framework: PyTorch</li>
                <li>Optimization: Optuna (learning rate search) + Quantization-Aware Training (QAT)</li>
                <li>Input Size: 28×28 grayscale</li>
                {currentModel.classes && (
                  <li>Classes: {currentModel.classes.join(', ')}</li>
                )}
                <li>Dataset: Folder-based cats, dogs, and others with train/test splits</li>
                <li>Data Preparing: Resize → Grayscale → Tensor → DataLoader batches</li>
                <li>Model Training: Simple fully-connected network trained with CrossEntropyLoss + Adam</li>
                <li>Model Evaluating: Accuracy measured on test set after training/Optuna trials</li>
                <li>Model Testing: Single-image predictions verified from test dataset</li>
                <li>Export & Deploy: Converted to a single-file ONNX model and loaded in-browser with onnxruntime-web</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <div className="tech-logo">
              <span className="text-xs font-semibold text-white">PyTorch</span>
            </div>
            <div className="tech-logo">
              <span className="text-xs font-semibold text-white">ONNX</span>
            </div>
            <div className="tech-logo">
              <span className="text-xs font-semibold text-white">Optuna</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Math & Concepts content (same area as classifier, no extra page length) */}
      {currentView === 'concepts' && (
        <div className="mt-12">
          <p className="text-white text-xl font-semibold mb-2">Math & Concepts Behind AI</p>
          <p className="text-white-600 text-lg mb-6">
            From cosine similarity to embeddings, CNNs, and diffusion — the ideas that power language and vision models.
          </p>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 w-full">
            {/* Desmos sine graph card — full calculator so user can add/edit expressions */}
            <div className="flex flex-col gap-4 relative sm:p-6 p-5 shadow-2xl shadow-black-200 border border-black-300 bg-black-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-semibold">Sine wave — flying bird</p>
                  <p className="text-white-600 text-sm">
                    Equation: <span className="text-cyan-300 font-mono text-xs sm:text-sm">y = |x| sin(|x| − t)</span> with restriction <span className="text-cyan-300 font-mono text-xs sm:text-sm">−2 &lt; x &lt; 2</span>. Slider <span className="text-cyan-300 font-mono">t</span> is 0–10 by default — the graph loads below; you can edit expressions and click the slider to animate the bird.
                  </p>
                  <p className="text-white-600/80 text-xs font-mono bg-black-300/50 px-2 py-1.5 rounded border border-black-400/50">
                    y = |x| sin(|x| − t) {'  '} {'{'}−2 &lt; x &lt; 2{'}'}
                  </p>
                </div>
              </div>
              <div
                ref={desmosContainerRef}
                className="relative w-full rounded-lg overflow-hidden border border-black-300 bg-black-100"
                style={{ minHeight: '420px', height: '420px' }}
                aria-label="Desmos — flying bird: y = |x| sin(|x| − t), −2 < x < 2, t = 0 to 10"
              />
            </div>

          {/* Concepts card: Cosine similarity, CNN, Stable Diffusion */}
          <div className="flex flex-col gap-5 relative sm:p-6 py-6 px-5 shadow-2xl shadow-black-200 border border-black-300 bg-black-200 rounded-lg">
            <div className="p-3 backdrop-filter backdrop-blur-3xl w-fit rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <svg
                className="w-8 h-8 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <div className="flex flex-col gap-6 text-white-600">
              {/* Cosine similarity */}
              <div>
                <p className="text-white font-semibold mb-1">Cosine similarity & embeddings</p>
                <p className="leading-relaxed text-sm">
                  In NLP and language models, text is turned into vectors (embeddings). Cosine similarity measures how “alike” two vectors are by the angle between them — it’s widely used for semantic search, retrieval, and comparing sentences. The closer the angle to 0°, the more similar the meaning.
                </p>
              </div>

              {/* CNN for image classification */}
              <div>
                <p className="text-white font-semibold mb-1">How CNNs work for image classification</p>
                <p className="leading-relaxed text-sm">
                  A CNN slides small filters (kernels), e.g. 2×2 or 3×3, over the image. Each kernel runs over every pixel (or local patch), and after convolution we often apply <strong className="text-white">max pooling</strong>: take only the <strong className="text-white">highest value</strong> in each 2×2 or 3×3 region. That keeps the strongest features and shrinks the map. The final layer outputs <strong className="text-white">probabilities</strong> per class (e.g. cat vs dog); the class with the highest probability is the prediction.
                </p>
              </div>

              {/* Stable Diffusion */}
              <div>
                <p className="text-white font-semibold mb-1">Stable Diffusion — reverse of classification</p>
                <p className="leading-relaxed text-sm">
                  Classification goes from image → one label. Diffusion does the opposite: it starts from noise and gradually “undoes” the diffusion so that scattered particles come together into a coherent image. So it’s like the reverse process of classification — structure is built step by step from randomness into a clear picture.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </section>
  );
};

export default AIModels;
