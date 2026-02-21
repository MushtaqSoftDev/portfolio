/**
 * Preprocess image for ONNX model inference
 * Converts image to grayscale and resizes to 28x28
 */
export const preprocessImage = (imageFile: File): Promise<Float32Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas to process image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Set canvas size to 28x28
        canvas.width = 28;
        canvas.height = 28;
        
        // Draw and resize image
        ctx.drawImage(img, 0, 0, 28, 28);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, 28, 28);
        const data = imageData.data;
        
        // Convert to grayscale and normalize to [0, 1]
        const grayscaleData: number[] = [];
        for (let i = 0; i < data.length; i += 4) {
          // Convert RGB to grayscale using luminance formula
          const gray = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255.0;
          grayscaleData.push(gray);
        }
        
        // Reshape to [1, 1, 28, 28] format (batch, channels, height, width)
        const tensorData = new Float32Array(1 * 1 * 28 * 28);
        for (let i = 0; i < grayscaleData.length; i++) {
          tensorData[i] = grayscaleData[i];
        }
        
        resolve(tensorData);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(imageFile);
  });
};
