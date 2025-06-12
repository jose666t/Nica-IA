
import React, { useState } from 'react';
import { generateImageWithDeepAI } from '../services/deepAiService';
import Input from './Input';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

const ImageGeneratorPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt for the image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const response = await generateImageWithDeepAI(prompt);
      setImageUrl(response.output_url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">DeepAI Image Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="prompt"
          label="Describe Your Desired Image"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cyberpunk cat DJing in a neon-lit alley"
          disabled={isLoading}
          className="text-lg"
        />
        <Button type="submit" isLoading={isLoading} disabled={isLoading || !prompt.trim()} variant="primary" className="w-full py-3 text-lg">
          {isLoading ? 'Conjuring Image...' : 'Generate Image'}
        </Button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 rounded-lg shadow-md text-sm">
          <p className="font-semibold text-red-100">Oops, something went wrong:</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && !imageUrl && (
        <div className="mt-8 flex flex-col items-center justify-center space-y-3 p-6">
          <LoadingSpinner size="12" color="pink-500" />
          <p className="text-gray-400 animate-pulse">Your vision is materializing...</p>
        </div>
      )}

      {imageUrl && !error && (
        <div className="mt-8 p-1 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg shadow-xl">
            <div className="p-4 bg-gray-800 rounded-md">
                <h3 className="text-xl font-semibold mb-4 text-center text-gray-200">Behold! Your Creation:</h3>
                <div className="flex justify-center items-center overflow-hidden rounded-lg shadow-lg border-2 border-gray-700">
                    <img 
                        src={imageUrl} 
                        alt={prompt || 'Generated AI Image'} 
                        className="max-w-full h-auto object-contain"
                        style={{ maxHeight: '60vh' }} // Ensure image fits well
                    />
                </div>
            </div>
        </div>
      )}
       {!isLoading && !error && !imageUrl && (
         <div className="mt-8 text-center text-gray-500 p-6 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-lg">Let your imagination run wild!</p>
            <p className="mt-2 text-sm">Enter a prompt above and watch the AI bring it to life.</p>
            <p className="mt-2 text-xs">Example: "A serene bioluminescent forest at night"</p>
         </div>
       )}
    </div>
  );
};

export default ImageGeneratorPage;
