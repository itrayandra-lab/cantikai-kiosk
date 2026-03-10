import { useEffect, useMemo, useRef, useState } from 'react';
import desktopApi from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [savedAnalysisId, setSavedAnalysisId] = useState(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const heroBanner = useMemo(() => banners[0] || null, [banners]);

  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, pRes, aRes] = await Promise.all([
          desktopApi.getBanners(),
          desktopApi.getProducts(),
          desktopApi.getArticles()
        ]);
        setBanners(Array.isArray(bRes) ? bRes : []);
        setProducts(Array.isArray(pRes) ? pRes : []);
        setArticles(Array.isArray(aRes) ? aRes : []);
      } catch (loadError) {
        setError(loadError.message);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (activeTab !== 'scan') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (cameraError) {
        setError(`Kamera gagal aktif: ${cameraError.message}`);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [activeTab]);

  const captureImage = () => {
    if (!videoRef.current) return '';
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const runAnalysis = async (imageBase64) => {
    if (!imageBase64) return;
    try {
      setIsAnalyzing(true);
      setError('');
      const response = await desktopApi.analyzeImage(imageBase64);
      const analysisResult = response.analysis || {};
      setAnalysis(analysisResult);
      setRecommendedProducts(Array.isArray(response.recommended_products) ? response.recommended_products : []);

      const userId = await desktopApi.getOrCreateDesktopUser();
      const saved = await desktopApi.saveAnalysis({
        user_id: userId,
        image_base64: imageBase64,
        overall_score: analysisResult.overall_score,
        skin_type: analysisResult.skin_type,
        fitzpatrick_type: analysisResult.fitzpatrick_type,
        predicted_age: analysisResult.predicted_age,
        analysis_version: 'desktop-1.0',
        engine: 'backend-gemini-public',
        processing_time_ms: 0,
        analysis_data: {
          scores: analysisResult.scores,
          priority_concerns: analysisResult.priority_concerns,
          recommendations: analysisResult.recommendations,
          summary: analysisResult.summary
        },
        ai_insights: {
          summary: analysisResult.summary,
          priority_concerns: analysisResult.priority_concerns,
          recommendations: analysisResult.recommendations
        }
      });
      setSavedAnalysisId(saved.id || null);
      setActiveTab('result');
    } catch (analyzeError) {
      setError(analyzeError.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onUploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      await runAnalysis(String(e.target?.result || ''));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="desktop-shell">
      <header className="desktop-header">
        <div>
          <h1>Cantik AI Desktop</h1>
          <p>Website desktop untuk pengalaman layar laptop/PC.</p>
        </div>
        <nav>
          <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</button>
          <button className={activeTab === 'scan' ? 'active' : ''} onClick={() => setActiveTab('scan')}>Scan</button>
          <button className={activeTab === 'result' ? 'active' : ''} onClick={() => setActiveTab('result')}>Result</button>
        </nav>
      </header>

      {error ? <div className="error-box">{error}</div> : null}

      {activeTab === 'home' ? (
        <section className="home-grid">
          <article className="hero-card">
            <img src={heroBanner?.image_url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80'} alt="Banner" />
            <div>
              <h2>{heroBanner?.title || 'Skin Analyzer untuk Desktop'}</h2>
              <p>{heroBanner?.description || 'Lakukan analisa kulit dari kamera laptop dan lihat rekomendasi produk.'}</p>
              <button onClick={() => setActiveTab('scan')}>Mulai Analisa</button>
            </div>
          </article>

          <article className="panel">
            <h3>Produk Rekomendasi</h3>
            <div className="list">
              {products.slice(0, 6).map((item) => (
                <div className="list-item" key={item.id}>
                  <img src={item.image_url} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.brand || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <h3>Artikel Edukasi</h3>
            <div className="list">
              {articles.slice(0, 6).map((item) => (
                <div className="article-item" key={item.id}>
                  <strong>{item.title}</strong>
                  <p>{item.excerpt || 'Artikel edukasi skincare.'}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'scan' ? (
        <section className="scan-grid">
          <div className="camera-card">
            <video ref={videoRef} autoPlay muted playsInline className="camera" />
          </div>
          <div className="action-card">
            <h2>Ambil Foto Wajah</h2>
            <p>Pastikan pencahayaan cukup dan wajah berada di tengah frame.</p>
            <div className="actions">
              <button disabled={isAnalyzing} onClick={() => runAnalysis(captureImage())}>
                {isAnalyzing ? 'Menganalisa...' : 'Capture dari Kamera'}
              </button>
              <button disabled={isAnalyzing} onClick={() => fileInputRef.current?.click()}>
                Upload Foto
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onUploadFile} hidden />
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'result' ? (
        <section className="result-grid">
          <article className="result-card">
            <h2>Hasil Analisa</h2>
            {analysis ? (
              <>
                <div className="result-score">{Math.round(Number(analysis.overall_score || 0))}/100</div>
                <p><strong>Skin Type:</strong> {analysis.skin_type || '-'}</p>
                <p><strong>Fitzpatrick:</strong> {analysis.fitzpatrick_type || '-'}</p>
                <p><strong>Prediksi Usia Kulit:</strong> {analysis.predicted_age || '-'}</p>
                <p><strong>Ringkasan:</strong> {analysis.summary || '-'}</p>
                {savedAnalysisId ? <p className="saved">Tersimpan ke database (analysis_id: {savedAnalysisId})</p> : null}
              </>
            ) : (
              <p>Belum ada hasil. Lakukan scan terlebih dahulu.</p>
            )}
          </article>

          <article className="result-card">
            <h3>Prioritas Perawatan</h3>
            <ul>
              {(analysis?.priority_concerns || []).slice(0, 6).map((item, index) => (
                <li key={`${item.concern}-${index}`}>
                  <strong>{item.concern}</strong> ({item.severity}) - {item.advice}
                </li>
              ))}
            </ul>
          </article>

          <article className="result-card">
            <h3>Produk Terkait</h3>
            <div className="list">
              {recommendedProducts.map((item) => (
                <div key={item.id} className="list-item">
                  <img src={item.image_url} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.brand || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}

export default App;
