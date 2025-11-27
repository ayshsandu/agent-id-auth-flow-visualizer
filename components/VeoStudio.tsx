import React, { useState, useRef } from 'react';
import { generateArchitectureVideo } from '../services/geminiService';
import { VideoGenerationState } from '../types';

const VeoStudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("Cinematic, futuristic visualization of data packets flowing through a secure network, glowing lines connecting server nodes, 4k quality, highly detailed.");
  const [state, setState] = useState<VideoGenerationState>({
    isGenerating: false,
    progressMessage: '',
    videoUri: null,
    error: null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      // Reset state on new file
      setState(prev => ({ ...prev, videoUri: null, error: null }));
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setState(prev => ({ ...prev, error: "Please upload an image first." }));
      return;
    }

    setState({
      isGenerating: true,
      progressMessage: 'Initializing Veo model...',
      videoUri: null,
      error: null,
    });

    try {
      const videoUrl = await generateArchitectureVideo(file, prompt);
      setState({
        isGenerating: false,
        progressMessage: 'Done!',
        videoUri: videoUrl,
        error: null,
      });
    } catch (err: any) {
      setState({
        isGenerating: false,
        progressMessage: '',
        videoUri: null,
        error: err.message || "An unknown error occurred",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="material-icons-outlined text-purple-600">movie_creation</span>
        Veo Animator
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Turn your static architecture diagrams into animated visualizations using Google's Veo model.
      </p>

      <div className="space-y-6">
        {/* Upload Area */}
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              previewUrl ? 'border-purple-200 bg-purple-50' : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
            }`}
          >
            {previewUrl ? (
              <div className="relative h-48 w-full flex items-center justify-center">
                 <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain shadow-md rounded" />
                 <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity rounded">
                    Click to change
                 </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-600 font-medium">Click to upload diagram</span>
                <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Animation Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none h-24"
            placeholder="Describe how you want the diagram to move..."
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={state.isGenerating || !file}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md ${
            state.isGenerating || !file
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98]'
          }`}
        >
          {state.isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {state.progressMessage || 'Processing...'}
            </div>
          ) : (
            'Generate Video with Veo'
          )}
        </button>

        {/* Error Message */}
        {state.error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
            <span className="font-bold">Error:</span> {state.error}
          </div>
        )}

        {/* Result */}
        {state.videoUri && (
          <div className="mt-6 animate-fade-in">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Generated Result</h3>
            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md">
              <video 
                src={state.videoUri} 
                controls 
                autoPlay 
                loop 
                className="w-full h-auto bg-black"
              />
            </div>
            <a 
              href={state.videoUri} 
              download="veo-animation.mp4"
              className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeoStudio;
