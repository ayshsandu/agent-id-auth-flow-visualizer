import { GoogleGenAI } from "@google/genai";

// Helper to validate and get the API key safely
const getApiKey = async (): Promise<string> => {
  // Check if we need to prompt for a key (specifically for Veo/Paid models)
  if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      if (typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        // Assume success after dialog interaction, or handle re-check if needed.
        // In this environment, we proceed assuming the key is now injected.
      }
    }
  }
  return process.env.API_KEY || '';
};

export const generateArchitectureVideo = async (
  imageFile: File,
  prompt: string
): Promise<string> => {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error("API Key selection failed or was cancelled.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: base64Data,
        mimeType: imageFile.type,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("No video URI returned from generation.");
    }

    // Append API key for viewing/downloading
    return `${videoUri}&key=${apiKey}`;

  } catch (error: any) {
    console.error("Video generation failed:", error);
    throw new Error(error.message || "Failed to generate video");
  }
};
