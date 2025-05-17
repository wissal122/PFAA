import React, { useState } from 'react';
import './App.css';
import ReCAPTCHA from 'react-google-recaptcha';

const App = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'tracker'>('home');
  const [verified, setVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(true);

  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Efface l'image sélectionnée et le résultat de l'analyse
  const handleDeleteImage = () => {
    setImagePreview(null);
    setAnalysisResult(null);
  };

  // Change de page (Home ou Tracker)
  const handlePageChange = (page: 'home' | 'tracker') => {
    setCurrentPage(page);
  };

  // Gestion du changement dans reCAPTCHA
  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      console.log('reCAPTCHA token:', value);
      setTimeout(() => {
        setVerified(true);
        setCaptchaError(false);
      }, 500);
    } else {
      setVerified(false);
    }
  };

  const handleCaptchaError = (error: any) => {
    console.error('reCAPTCHA error:', error);
    setCaptchaError(true);
  };

  const handleCaptchaLoad = () => {
    setCaptchaLoading(false);
  };

  // Convertir l'image en un fichier
  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Analyser l'image avec l'API FastAPI
  const handleAnalyzeImage = async () => {
    if (!imagePreview) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('image', dataURLtoFile(imagePreview, 'image.jpg'));

    try {
      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data.emotion);  // Suppose que le serveur retourne l'émotion détectée
    } catch (error) {
      console.error('Erreur pendant l’analyse :', error);
      setAnalysisResult("Erreur pendant l'analyse.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (!verified) {
    return (
      <div className="captcha-container">
        <div className="captcha-content">
          <h1 className="captcha-title">🤖 I'm not a robot</h1>
          {captchaError && (
            <div className="error-message text-red-500 mb-2">
              There was an issue with the reCAPTCHA. Please try again.
            </div>
          )}
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"  // Remplace par ta propre clé reCAPTCHA
            onChange={handleCaptchaChange}
            onLoad={handleCaptchaLoad}
            onError={handleCaptchaError}
            onExpired={() => setVerified(false)}
          />
          {captchaLoading && <div className="loading-message">Loading reCAPTCHA...</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-4 text-center text-2xl font-bold text-gray-800 bg-white shadow">
        <img src="/images/logo.jpg" alt="MoodTracker Logo" className="logo" />
        MoodTracker
      </header>

      <nav className="text-center py-4">
        <button
          className={`px-6 py-2 mx-2 ${currentPage === 'home' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handlePageChange('home')}
        >
          Home
        </button>
        <button
          className={`px-6 py-2 mx-2 ${currentPage === 'tracker' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handlePageChange('tracker')}
        >
          Tracker
        </button>
      </nav>

      {currentPage === 'home' && (
        <section className="description text-center py-6">
          <h2 className="text-xl font-semibold mb-2">Track Your Emotional Journey</h2>
          <img src="/gif/download.gif" alt="MoodTracker Animation" className="gif-image" />
          <p className="mb-2">
            Welcome to MoodTracker, your personal companion for emotional wellness. Capture and visualize your daily moods through images, helping you gain a deeper understanding of your emotional journey.
          </p>
          <p className="mb-4">
            Express yourself by uploading images that reflect your current mood. Let your photos speak for your feelings and tell your unique story.
          </p>
        </section>
      )}

      {currentPage === 'tracker' && (
        <main className="max-w-4xl mx-auto p-6 bg-white rounded shadow my-8">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Track Your Emotions</h2>
            <p className="text-gray-600">
              Upload an image that represents how you feel right now.
            </p>
          </section>

          <section className="upload-section">
            <p className="mb-2 text-gray-700">Select an image:</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                    setAnalysisResult(null);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="input mb-4"
            />
            {imagePreview && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-gray-600 mb-2">Preview:</p>
                <div className="relative w-full max-w-sm">
                  <img
                    src={imagePreview}
                    alt="Selected preview"
                    className="mx-auto max-h-64 object-contain rounded shadow w-full"
                  />
                </div>

                <button
                  onClick={handleDeleteImage}
                  className="delete-button"
                >
                  Delete Image
                </button>

                <button
                  onClick={handleAnalyzeImage}
                  className="analyse-button"
                >
                  Analyse image
                </button>

                {analyzing && (
                  <p className="mt-2 text-blue-600">Analysis in progress...</p>
                )}

                {analysisResult && (
                  <p className="mt-2 text-purple-700 font-semibold">
                    Result: {analysisResult}
                  </p>
                )}
              </div>
            )}
          </section>
        </main>
      )}

      <footer className="text-center py-4 text-sm text-gray-500">
        © 2025 MoodTracker. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
