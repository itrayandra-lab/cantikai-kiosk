import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import kioskApi from './services/api';

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const DEVICE_ID = import.meta.env.VITE_KIOSK_DEVICE_ID || 'kiosk-001';
const IDLE_TIMEOUT_MS = Number(import.meta.env.VITE_KIOSK_IDLE_TIMEOUT_SECONDS || 180) * 1000;
const AUTO_RESET_MS = Number(import.meta.env.VITE_KIOSK_AUTO_RESET_SECONDS || 90) * 1000;
const ANALYZE_RETRY_LIMIT = Number(import.meta.env.VITE_KIOSK_ANALYZE_RETRY_LIMIT || 10);
const ANALYZE_RETRY_DELAY_MS = Number(import.meta.env.VITE_KIOSK_ANALYZE_RETRY_MS || 1200);
const RESULT_SYNC_RETRY_LIMIT = Number(import.meta.env.VITE_KIOSK_RESULT_SYNC_RETRY_LIMIT || 30);
const RESULT_SYNC_RETRY_MS = Number(import.meta.env.VITE_KIOSK_RESULT_SYNC_RETRY_MS || 1200);
const AUTO_CAPTURE_DELAY_SECONDS = Number(import.meta.env.VITE_KIOSK_AUTO_CAPTURE_COUNTDOWN || 3);
const AUTO_CAPTURE_STABILITY_FRAMES = Number(import.meta.env.VITE_KIOSK_AUTO_CAPTURE_STABILITY_FRAMES || 18);

const BRIGHTNESS_MIN = Number(import.meta.env.VITE_KIOSK_MIN_BRIGHTNESS || 35);
const BRIGHTNESS_MAX = Number(import.meta.env.VITE_KIOSK_MAX_BRIGHTNESS || 225);
const FACE_AREA_MIN = Number(import.meta.env.VITE_KIOSK_FACE_AREA_MIN || 0.1);
const FACE_AREA_MAX = Number(import.meta.env.VITE_KIOSK_FACE_AREA_MAX || 0.72);

const STEP_PATHS = {
  onboarding: '/onboard',
  guide: '/guide',
  system: '/system',
  identity: '/identity',
  scan: '/scan',
  processing: '/processing',
  result: '/analysis'
};

const FLOW_STEPS = [
  { key: 'onboarding', title: 'Mulai' },
  { key: 'identity', title: 'Data Diri' },
  { key: 'scan', title: 'Scan' },
  { key: 'result', title: 'Hasil' }
];

const DEFAULT_FORM = {
  name: '',
  gender: 'female',
  whatsapp: ''
};

const MODE_CATALOG = [
  { key: 'rgb_pores', title: 'RGB Pores', parameter: 'Pores', detail: 'Kerapatan pori yang terlihat pada area T-zone.' },
  { key: 'rgb_color_spot', title: 'RGB Color Spot', parameter: 'Pigmentasi', detail: 'Noda warna dan ketidakseimbangan tone pada cahaya normal.' },
  { key: 'rgb_texture', title: 'RGB Texture', parameter: 'Tekstur', detail: 'Tekstur permukaan kulit dan kehalusan area wajah.' },
  { key: 'pl_roughness', title: 'PL Roughness', parameter: 'Roughness', detail: 'Estimasi tingkat kekasaran dari pencahayaan terpolarisasi.' },
  { key: 'uv_acne', title: 'UV Acne', parameter: 'Acne', detail: 'Potensi area jerawat aktif atau bekas inflamasi.' },
  { key: 'uv_color_spot', title: 'UV Color Spot', parameter: 'Color Spot', detail: 'Noda bawah permukaan yang terbaca pada mode UV.' },
  { key: 'uv_roughness', title: 'UV Roughness', parameter: 'Roughness', detail: 'Tekstur halus sampai kasar pada lapisan luar kulit.' },
  { key: 'skin_color_evenness', title: 'Skin Color Evenness', parameter: 'Evenness', detail: 'Kemerataan warna kulit di seluruh wajah.' },
  { key: 'brown_area', title: 'Brown Area', parameter: 'Brown Area', detail: 'Area kecoklatan dan hiperpigmentasi.' },
  { key: 'uv_spot', title: 'UV Spot', parameter: 'UV Spot', detail: 'Persebaran spot yang lebih tampak di mode UV.' },
  { key: 'skin_aging', title: 'Skin Aging', parameter: 'Aging', detail: 'Indikasi penuaan kulit dari kerutan dan elastisitas.' },
  { key: 'skin_whitening', title: 'Skin Whitening', parameter: 'Brightness', detail: 'Kecerahan kulit dan indikasi tampak kusam.' },
  { key: 'wrinkle', title: 'Wrinkle', parameter: 'Wrinkle', detail: 'Garis halus dan kerutan utama pada area ekspresi.' },
  { key: 'pore', title: 'Pore', parameter: 'Pore', detail: 'Visualisasi pori secara umum pada wajah.' },
  { key: 'overall_analysis', title: 'Overall Analysis', parameter: 'Overall', detail: 'Ringkasan komprehensif dari seluruh mode analisa.' }
];

const clampScore = (value, fallback = 60) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const loadExternalScript = (src) => new Promise((resolve, reject) => {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    if (existing.dataset.loaded === 'true') {
      resolve();
      return;
    }
    existing.addEventListener('load', () => resolve(), { once: true });
    existing.addEventListener('error', () => reject(new Error(`Gagal memuat script ${src}`)), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.dataset.loaded = 'false';
  script.onload = () => {
    script.dataset.loaded = 'true';
    resolve();
  };
  script.onerror = () => reject(new Error(`Gagal memuat script ${src}`));
  document.body.appendChild(script);
});

const calculateBrightness = (videoElement, width, height) => {
  if (!videoElement || !width || !height) return 0;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return 0;
  ctx.drawImage(videoElement, 0, 0, width, height);
  const frame = ctx.getImageData(0, 0, width, height).data;
  let luminance = 0;
  for (let index = 0; index < frame.length; index += 4) {
    luminance += frame[index] * 0.299 + frame[index + 1] * 0.587 + frame[index + 2] * 0.114;
  }
  return Math.round(luminance / (frame.length / 4));
};

const checkFaceDistance = (landmarks, width, height) => {
  const xs = landmarks.map((item) => item.x);
  const ys = landmarks.map((item) => item.y);
  const faceWidth = (Math.max(...xs) - Math.min(...xs)) * width;
  const faceHeight = (Math.max(...ys) - Math.min(...ys)) * height;
  const faceArea = (faceWidth * faceHeight) / (width * height);
  const isGood = faceArea >= FACE_AREA_MIN && faceArea <= FACE_AREA_MAX;
  let status = 'Pas';
  if (faceArea < FACE_AREA_MIN) status = 'Mendekat';
  if (faceArea > FACE_AREA_MAX) status = 'Menjauh';
  return { isGood, status, faceArea: Number(faceArea.toFixed(3)) };
};

const detectGlasses = (landmarks) => {
  try {
    const leftEye = landmarks.slice(33, 42);
    const rightEye = landmarks.slice(263, 272);
    const eyeVariance = [...leftEye, ...rightEye].reduce((sum, point) => sum + Math.abs(point.z), 0) / 18;
    const leftDepth = leftEye.reduce((sum, point) => sum + point.z, 0) / leftEye.length;
    const rightDepth = rightEye.reduce((sum, point) => sum + point.z, 0) / rightEye.length;
    const avgDepth = Math.abs((leftDepth + rightDepth) / 2);
    return eyeVariance > 0.032 && avgDepth > 0.013;
  } catch {
    return false;
  }
};

const detectFilter = (videoElement, landmarks, width, height) => {
  try {
    const xs = landmarks.map((item) => item.x);
    const ys = landmarks.map((item) => item.y);
    const centerX = Math.floor((Math.min(...xs) + Math.max(...xs)) * 0.5 * width);
    const centerY = Math.floor((Math.min(...ys) + Math.max(...ys)) * 0.5 * height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(videoElement, 0, 0, width, height);
    const sample = 56;
    const imageData = ctx.getImageData(
      Math.max(0, centerX - sample / 2),
      Math.max(0, centerY - sample / 2),
      sample,
      sample
    );
    let saturation = 0;
    let total = 0;
    for (let index = 0; index < imageData.data.length; index += 4) {
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max > 0) {
        saturation += (max - min) / max;
        total += 1;
      }
    }
    const avgSaturation = total > 0 ? saturation / total : 0;
    return avgSaturation > 0.58;
  } catch {
    return false;
  }
};

const drawFaceMeshOverlay = (canvas, landmarks, isOptimal) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  if (!landmarks || landmarks.length === 0) return;

  const dotColor = isOptimal ? 'rgba(255, 176, 220, 0.98)' : 'rgba(255, 224, 240, 0.88)';
  const lineColor = isOptimal ? 'rgba(255, 186, 226, 0.58)' : 'rgba(255, 255, 255, 0.36)';
  const outlineColor = isOptimal ? 'rgba(255, 220, 240, 0.95)' : 'rgba(255, 255, 255, 0.82)';

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = 1;
  ctx.strokeStyle = lineColor;
  if (window.drawConnectors && window.FACEMESH_TESSELATION) {
    window.drawConnectors(ctx, landmarks, window.FACEMESH_TESSELATION, { color: lineColor, lineWidth: 0.6 });
  }
  if (window.drawConnectors && window.FACEMESH_FACE_OVAL) {
    window.drawConnectors(ctx, landmarks, window.FACEMESH_FACE_OVAL, { color: outlineColor, lineWidth: 1.8 });
  }

  if (window.drawLandmarks) {
    window.drawLandmarks(ctx, landmarks, {
      color: dotColor,
      lineWidth: 0.3,
      radius: isOptimal ? 1.55 : 1.2
    });
  } else {
    ctx.fillStyle = dotColor;
    for (let index = 0; index < landmarks.length; index += 1) {
      const point = landmarks[index];
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, isOptimal ? 1.55 : 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
};

const getScoreStatus = (score) => {
  if (score >= 86) return { label: 'Excellent', tone: 'excellent' };
  if (score >= 71) return { label: 'Good', tone: 'good' };
  if (score >= 56) return { label: 'Moderate', tone: 'moderate' };
  if (score >= 41) return { label: 'Needs Care', tone: 'warning' };
  return { label: 'High Concern', tone: 'alert' };
};

const formatDeliveryStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'sent') return 'Terkirim ke WhatsApp';
  if (normalized === 'pending') return 'Menunggu pengiriman';
  if (normalized === 'failed') return 'Gagal kirim, gunakan QR code';
  if (normalized === 'skipped') return 'WhatsApp tidak diisi';
  return status || 'Tidak tersedia';
};

const genderLabel = (value) => {
  if (value === 'female') return 'Perempuan';
  if (value === 'male') return 'Laki-laki';
  if (value === 'other') return 'Lainnya';
  return '-';
};

const normalizeWhatsappInput = (value) => String(value || '').replace(/[^\d+]/g, '').slice(0, 20);

const getStepFromPath = (pathname) => {
  const normalized = String(pathname || '').toLowerCase();
  if (normalized === '/analysis') return 'result';
  if (normalized === '/processing') return 'processing';
  if (normalized === '/scan') return 'scan';
  if (normalized === '/identity') return 'identity';
  if (normalized === '/guide') return 'guide';
  if (normalized === '/system') return 'system';
  return 'onboarding';
};

const getFlowStepKey = (step) => {
  if (step === 'processing') return 'scan';
  if (step === 'guide' || step === 'system') return 'onboarding';
  return step;
};

const readViewport = () => ({
  width: window.innerWidth || document.documentElement.clientWidth || 0,
  height: window.innerHeight || document.documentElement.clientHeight || 0
});

const statusLabel = (value, trueLabel = 'Siap', falseLabel = 'Belum siap') => (value ? trueLabel : falseLabel);

const resolveAssetUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('data:image/')) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${API_BASE_URL}/${raw.replace(/^\/+/, '')}`;
};

const deriveModeScores = (analysis) => {
  const scores = analysis?.scores || {};
  const acne = clampScore(scores.acne, 62);
  const wrinkles = clampScore(scores.wrinkles, 64);
  const pigmentation = clampScore(scores.pigmentation, 63);
  const pores = clampScore(scores.pores, 61);
  const hydration = clampScore(scores.hydration, 65);
  const redness = clampScore(scores.redness, 64);
  const overall = clampScore(analysis?.overall_score, 66);

  return {
    rgb_pores: pores,
    rgb_color_spot: pigmentation,
    rgb_texture: clampScore((wrinkles + pores + hydration) / 3),
    pl_roughness: clampScore((wrinkles + hydration) / 2),
    uv_acne: acne,
    uv_color_spot: clampScore((pigmentation + redness) / 2),
    uv_roughness: clampScore((wrinkles + redness + hydration) / 3),
    skin_color_evenness: clampScore((pigmentation + redness + hydration) / 3),
    brown_area: pigmentation,
    uv_spot: clampScore((pigmentation + redness) / 2),
    skin_aging: clampScore((wrinkles + hydration) / 2),
    skin_whitening: clampScore((hydration + pigmentation) / 2),
    wrinkle: wrinkles,
    pore: pores,
    overall_analysis: overall
  };
};

const buildAnalysisModes = (analysis, insights) => {
  const serverModes = Array.isArray(analysis?.analysis_modes) ? analysis.analysis_modes : [];
  const concernList = Array.isArray(insights?.priority_concerns) ? insights.priority_concerns : [];
  const fallbackInsight = concernList[0]?.advice || 'Jaga rutinitas skincare konsisten setiap hari.';

  if (serverModes.length > 0) {
    const mapByKey = new Map();
    serverModes.forEach((mode) => {
      const key = String(mode?.key || '').toLowerCase();
      if (key) mapByKey.set(key, mode);
    });

    return MODE_CATALOG.map((baseMode) => {
      const mode = mapByKey.get(baseMode.key) || {};
      const value = clampScore(mode.score ?? mode.value, 60);
      const derivedStatus = getScoreStatus(value);
      return {
        ...baseMode,
        value,
        statusLabel: String(mode.status || derivedStatus.label),
        tone: derivedStatus.tone,
        detail: String(mode.detail || mode.description || baseMode.detail),
        detailText: String(mode.insight || mode.ai_insight || fallbackInsight)
      };
    });
  }

  const scoreMap = deriveModeScores(analysis);
  return MODE_CATALOG.map((mode) => {
    const value = scoreMap[mode.key] ?? 60;
    const status = getScoreStatus(value);
    return {
      ...mode,
      value,
      statusLabel: status.label,
      tone: status.tone,
      detail: mode.detail,
      detailText: fallbackInsight
    };
  });
};

function App() {
  const [step, setStep] = useState(() => getStepFromPath(window.location.pathname));
  const [viewport, setViewport] = useState(() => readViewport());
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [processingText, setProcessingText] = useState('Memproses analisa kulit...');
  const [error, setError] = useState('');
  const [selectedModeKey, setSelectedModeKey] = useState(null);
  const [stabilityFrames, setStabilityFrames] = useState(0);
  const [autoResetCountdown, setAutoResetCountdown] = useState(0);
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemLoading, setSystemLoading] = useState(false);
  const [systemError, setSystemError] = useState('');
  const [systemUpdatedAt, setSystemUpdatedAt] = useState('');
  const [cameraState, setCameraState] = useState({
    ready: false,
    lighting: false,
    framing: false,
    brightness: 0
  });
  const [scanSignal, setScanSignal] = useState({
    faceDetected: false,
    distanceGood: false,
    distanceStatus: 'Memeriksa',
    hasGlasses: false,
    hasFilter: false,
    faceArea: 0
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaPipeCameraRef = useRef(null);
  const faceMeshRef = useRef(null);
  const idleTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const autoResetRef = useRef(null);
  const autoResetIntervalRef = useRef(null);
  const analyzeInFlightRef = useRef(false);
  const sessionStartInFlightRef = useRef(false);
  const resultTransitionRef = useRef(false);
  const resultRecoveryRef = useRef(false);
  const qualityProbeIntervalRef = useRef(null);
  const lightingRef = useRef(false);
  const brightnessRef = useRef(0);
  const stabilityFrameRef = useRef(0);

  const analysis = result?.analysis || null;
  const analysisInsights = analysis?.insights || {};
  const analysisModes = useMemo(() => buildAnalysisModes(analysis, analysisInsights), [analysis, analysisInsights]);
  const selectedMode = useMemo(
    () => analysisModes.find((mode) => mode.key === selectedModeKey) || null,
    [analysisModes, selectedModeKey]
  );

  const faceResultImage = useMemo(() => {
    return (
      resolveAssetUrl(analysis?.visualization_url_full)
      || resolveAssetUrl(analysis?.image_url_full)
      || resolveAssetUrl(analysis?.visualization_url)
      || resolveAssetUrl(analysis?.image_url)
      || resolveAssetUrl(capturedPreview)
    );
  }, [analysis, capturedPreview]);

  const validation = analysis?.input_validation || null;
  const activeFlowStepKey = getFlowStepKey(step);
  const activeFlowStepIndex = Math.max(0, FLOW_STEPS.findIndex((item) => item.key === activeFlowStepKey));
  const forcePortraitLayout = import.meta.env.VITE_KIOSK_FORCE_PORTRAIT_LAYOUT !== 'false';
  const isPortraitViewport = viewport.height > viewport.width;
  const usePortraitLayout = forcePortraitLayout || isPortraitViewport;
  const isLargePortraitViewport = usePortraitLayout && viewport.height >= 700;
  const stageWidth = useMemo(() => {
    const availableWidth = Math.max(320, viewport.width - 24);
    if (!usePortraitLayout) {
      return Math.min(1180, availableWidth);
    }
    const availableHeight = Math.max(520, viewport.height - 24);
    const portraitTarget = Math.round(availableHeight * (9 / 16));
    return Math.max(360, Math.min(availableWidth, portraitTarget));
  }, [viewport.height, viewport.width, usePortraitLayout]);
  const stageStyle = useMemo(() => ({ '--kiosk-target-width': `${stageWidth}px` }), [stageWidth]);
  const stageMetaText = session?.session_uuid
    ? `Sesi ${String(session.session_uuid).slice(-8)} • ${session.visitor_name || formData.name || 'Guest'}`
    : 'Mode publik layar sentuh • 32" portrait ready';
  const canStart = useMemo(() => formData.name.trim().length >= 2, [formData.name]);
  const canAnalyze = cameraState.ready
    && cameraState.framing
    && cameraState.lighting
    && scanSignal.faceDetected
    && scanSignal.distanceGood
    && !scanSignal.hasGlasses
    && !scanSignal.hasFilter
    && !isBusy
    && countdown === 0;
  const showRoutePill = import.meta.env.DEV && import.meta.env.VITE_KIOSK_SHOW_ROUTE_PILL !== 'false';
  const scanBlockers = useMemo(() => {
    const blockers = [];
    if (!cameraState.ready) {
      blockers.push('Kamera belum siap, izinkan akses kamera terlebih dahulu.');
    }
    if (!scanSignal.faceDetected) {
      blockers.push('Wajah belum terdeteksi penuh. Hadapkan wajah ke kamera.');
    }
    if (!cameraState.lighting) {
      blockers.push('Pencahayaan belum ideal. Tambahkan cahaya agar detail kulit terbaca.');
    }
    if (scanSignal.faceDetected && !scanSignal.distanceGood) {
      if (scanSignal.distanceStatus === 'Mendekat') {
        blockers.push('Wajah terlalu jauh, silakan mendekat ke frame.');
      } else if (scanSignal.distanceStatus === 'Menjauh') {
        blockers.push('Wajah terlalu dekat, silakan mundur sedikit.');
      } else {
        blockers.push('Sesuaikan jarak wajah agar pas di dalam oval.');
      }
    }
    if (scanSignal.hasGlasses) {
      blockers.push('Lepas kacamata agar area mata dan pori dapat dianalisa akurat.');
    }
    if (scanSignal.hasFilter) {
      blockers.push('Filter kamera terdeteksi. Nonaktifkan efek kamera lalu ulangi.');
    }
    return blockers;
  }, [
    cameraState.ready,
    cameraState.lighting,
    scanSignal.faceDetected,
    scanSignal.distanceGood,
    scanSignal.distanceStatus,
    scanSignal.hasGlasses,
    scanSignal.hasFilter
  ]);
  const readinessStable = stabilityFrames >= AUTO_CAPTURE_STABILITY_FRAMES;
  const scanReadinessMessage = countdown > 0
    ? `Auto-capture dalam ${countdown} detik... tetap diam dan lihat kamera.`
    : canAnalyze
      ? (readinessStable
        ? 'Kondisi optimal. Auto-capture siap dijalankan.'
        : `Menstabilkan posisi wajah ${stabilityFrames}/${AUTO_CAPTURE_STABILITY_FRAMES}...`)
      : (scanBlockers[0] || 'Menyesuaikan kondisi kamera...');
  const scanQualityScore = useMemo(() => {
    let score = 0;
    if (cameraState.ready) score += 25;
    if (cameraState.lighting) score += 20;
    if (scanSignal.faceDetected) score += 20;
    if (scanSignal.distanceGood) score += 20;
    if (!scanSignal.hasGlasses) score += 7.5;
    if (!scanSignal.hasFilter) score += 7.5;
    return Math.round(score);
  }, [
    cameraState.ready,
    cameraState.lighting,
    scanSignal.faceDetected,
    scanSignal.distanceGood,
    scanSignal.hasGlasses,
    scanSignal.hasFilter
  ]);

  const goToStep = (nextStep, replace = false) => {
    const targetPath = STEP_PATHS[nextStep] || STEP_PATHS.onboarding;
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({}, '', targetPath);
      } else {
        window.history.pushState({}, '', targetPath);
      }
    }
    setStep(nextStep);
  };

  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      goToStep('onboarding', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => setViewport(readViewport());
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const clearAllTimers = () => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    if (autoResetRef.current) window.clearTimeout(autoResetRef.current);
    if (autoResetIntervalRef.current) window.clearInterval(autoResetIntervalRef.current);
    if (qualityProbeIntervalRef.current) window.clearInterval(qualityProbeIntervalRef.current);
    idleTimerRef.current = null;
    countdownRef.current = null;
    autoResetRef.current = null;
    autoResetIntervalRef.current = null;
    qualityProbeIntervalRef.current = null;
  };

  const stopMediaPipeCamera = async () => {
    if (mediaPipeCameraRef.current) {
      try {
        await mediaPipeCameraRef.current.stop();
      } catch {
        // ignore camera stop errors
      }
      mediaPipeCameraRef.current = null;
    }
    if (faceMeshRef.current) {
      try {
        await faceMeshRef.current.close();
      } catch {
        // ignore close errors
      }
      faceMeshRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    lightingRef.current = false;
    brightnessRef.current = 0;
    stabilityFrameRef.current = 0;
    setStabilityFrames(0);
    setCameraState({ ready: false, lighting: false, framing: false, brightness: 0 });
    setScanSignal({
      faceDetected: false,
      distanceGood: false,
      distanceStatus: 'Memeriksa',
      hasGlasses: false,
      hasFilter: false,
      faceArea: 0
    });
  };

  const resetFlow = async (shouldCloseSession = true) => {
    clearAllTimers();
    await stopMediaPipeCamera();

    if (shouldCloseSession && session?.session_uuid) {
      try {
        await kioskApi.closeSession(session.session_uuid);
      } catch {
        // best effort
      }
    }

    setFormData(DEFAULT_FORM);
    setSession(null);
    setResult(null);
    setCapturedPreview('');
    setCountdown(0);
    setStabilityFrames(0);
    setAutoResetCountdown(0);
    setIsBusy(false);
    setProcessingText('Memproses analisa kulit...');
    setError('');
    setSelectedModeKey(null);
    analyzeInFlightRef.current = false;
    sessionStartInFlightRef.current = false;
    resultTransitionRef.current = false;
    resultRecoveryRef.current = false;
    goToStep('onboarding', true);
  };

  const restartIdleTimer = () => {
    if (step === 'result' || step === 'processing') return;
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      resetFlow();
    }, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    const handlePopState = () => {
      setStep(getStepFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const expectedPath = STEP_PATHS[step] || STEP_PATHS.onboarding;
    if (window.location.pathname !== expectedPath) {
      window.history.replaceState({}, '', expectedPath);
    }
  }, [step]);

  useEffect(() => {
    if ((step === 'scan' || step === 'processing') && !session?.session_uuid) {
      goToStep('onboarding', true);
      return;
    }

    if (step === 'result' && result) {
      resultTransitionRef.current = false;
      return;
    }

    if (step === 'result' && !result) {
      if (analyzeInFlightRef.current || resultTransitionRef.current || isBusy) {
        goToStep('processing', true);
        return;
      }
      goToStep(session?.session_uuid ? 'scan' : 'onboarding', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, session?.session_uuid, result, isBusy]);

  useEffect(() => {
    const events = ['pointerdown', 'pointermove', 'keydown', 'touchstart'];
    const handler = () => restartIdleTimer();

    events.forEach((eventName) => window.addEventListener(eventName, handler));
    restartIdleTimer();

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, handler));
      clearAllTimers();
      stopMediaPipeCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, session?.session_uuid]);

  useEffect(() => {
    if (step !== 'scan') return undefined;
    if (!session?.session_uuid || result || isBusy || resultRecoveryRef.current) return undefined;

    let cancelled = false;
    resultRecoveryRef.current = true;

    const recoverFinishedResult = async () => {
      try {
        const response = await kioskApi.getSessionResult(session.session_uuid);
        if (cancelled) return;
        if (response?.analysis) {
          setResult(response);
          resultTransitionRef.current = false;
          goToStep('result', true);
        }
      } catch {
        // Best effort recovery: ignore and continue normal scan flow.
      } finally {
        if (!cancelled) {
          resultRecoveryRef.current = false;
        }
      }
    };

    recoverFinishedResult();
    return () => {
      cancelled = true;
      resultRecoveryRef.current = false;
    };
  }, [step, session?.session_uuid, result, isBusy]);

  useEffect(() => {
    if (step !== 'scan') return undefined;

    let mounted = true;
    stabilityFrameRef.current = 0;
    setStabilityFrames(0);
    const stopCountdownNow = () => {
      if (countdownRef.current) {
        window.clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setCountdown(0);
    };

    const initCamera = async () => {
      try {
        setError('');
        await loadExternalScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadExternalScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
        await loadExternalScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');

        if (!mounted) return;
        if (!window.FaceMesh || !window.Camera) {
          throw new Error('FaceMesh tidak tersedia pada perangkat ini.');
        }

        const faceMesh = new window.FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });
        faceMeshRef.current = faceMesh;

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.65
        });

        faceMesh.onResults((results) => {
          if (!mounted || !videoRef.current || !canvasRef.current) return;

          const vw = videoRef.current.videoWidth;
          const vh = videoRef.current.videoHeight;
          if (!vw || !vh) return;

          if (canvasRef.current.width !== vw || canvasRef.current.height !== vh) {
            canvasRef.current.width = vw;
            canvasRef.current.height = vh;
          }

          const faces = Array.isArray(results?.multiFaceLandmarks) ? results.multiFaceLandmarks : [];
          if (faces.length === 0) {
            drawFaceMeshOverlay(canvasRef.current, null, false);
            stabilityFrameRef.current = 0;
            setStabilityFrames(0);
            setScanSignal({
              faceDetected: false,
              distanceGood: false,
              distanceStatus: 'Tidak terdeteksi',
              hasGlasses: false,
              hasFilter: false,
              faceArea: 0
            });
            setCameraState((prev) => ({ ...prev, framing: false }));
            stopCountdownNow();
            return;
          }

          const landmarks = faces[0];
          const distanceCheck = checkFaceDistance(landmarks, vw, vh);
          const glassesDetected = detectGlasses(landmarks);
          const filterDetected = detectFilter(videoRef.current, landmarks, vw, vh);
          const optimal = distanceCheck.isGood
            && lightingRef.current
            && !glassesDetected
            && !filterDetected;

          if (optimal) {
            const nextStableFrames = Math.min(
              AUTO_CAPTURE_STABILITY_FRAMES,
              stabilityFrameRef.current + 1
            );
            if (nextStableFrames !== stabilityFrameRef.current) {
              stabilityFrameRef.current = nextStableFrames;
              setStabilityFrames(nextStableFrames);
            }
          } else if (stabilityFrameRef.current !== 0) {
            stabilityFrameRef.current = 0;
            setStabilityFrames(0);
          }

          drawFaceMeshOverlay(canvasRef.current, landmarks, optimal);

          setScanSignal({
            faceDetected: true,
            distanceGood: distanceCheck.isGood,
            distanceStatus: distanceCheck.status,
            hasGlasses: glassesDetected,
            hasFilter: filterDetected,
            faceArea: distanceCheck.faceArea
          });
          setCameraState((prev) => ({ ...prev, framing: distanceCheck.isGood }));

          if (
            optimal
            && stabilityFrameRef.current >= AUTO_CAPTURE_STABILITY_FRAMES
            && !countdownRef.current
            && !analyzeInFlightRef.current
            && !isBusy
          ) {
            startCountdownAndAnalyze({
              force: true,
              signal: {
                ready: true,
                lighting: lightingRef.current,
                faceDetected: true,
                distanceGood: distanceCheck.isGood,
                hasGlasses: glassesDetected,
                hasFilter: filterDetected
              }
            });
          } else if (!optimal && countdownRef.current) {
            stopCountdownNow();
          }
        });

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (!mounted || !faceMeshRef.current || !videoRef.current?.videoWidth) return;
            await faceMeshRef.current.send({ image: videoRef.current });
          },
          width: 720,
          height: 1280
        });

        mediaPipeCameraRef.current = camera;
        await camera.start();
        if (!mounted) return;

        streamRef.current = videoRef.current?.srcObject || null;
        setCameraState((prev) => ({ ...prev, ready: true }));

        qualityProbeIntervalRef.current = window.setInterval(() => {
          if (!mounted || !videoRef.current?.videoWidth) return;
          const brightness = calculateBrightness(
            videoRef.current,
            Math.min(240, videoRef.current.videoWidth),
            Math.min(320, videoRef.current.videoHeight)
          );
          const isLightingGood = brightness >= BRIGHTNESS_MIN && brightness <= BRIGHTNESS_MAX;
          brightnessRef.current = brightness;
          lightingRef.current = isLightingGood;
          setCameraState((prev) => ({
            ...prev,
            lighting: isLightingGood,
            brightness
          }));
        }, 420);
      } catch (cameraError) {
        setError(`Kamera tidak tersedia: ${cameraError.message}`);
        setCameraState({ ready: false, lighting: false, framing: false, brightness: 0 });
      }
    };

    initCamera();

    return () => {
      mounted = false;
      stopCountdownNow();
      stopMediaPipeCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step !== 'result') return undefined;

    const totalSeconds = Math.max(1, Math.round(AUTO_RESET_MS / 1000));
    setAutoResetCountdown(totalSeconds);

    autoResetRef.current = window.setTimeout(() => {
      resetFlow(false);
    }, AUTO_RESET_MS);
    autoResetIntervalRef.current = window.setInterval(() => {
      setAutoResetCountdown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (autoResetRef.current) window.clearTimeout(autoResetRef.current);
      if (autoResetIntervalRef.current) window.clearInterval(autoResetIntervalRef.current);
      autoResetIntervalRef.current = null;
      setAutoResetCountdown(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const startSession = async () => {
    if (sessionStartInFlightRef.current || isBusy) return;
    try {
      sessionStartInFlightRef.current = true;
      setIsBusy(true);
      setError('');
      const response = await kioskApi.startSession({
        name: formData.name.trim(),
        gender: formData.gender,
        whatsapp: normalizeWhatsappInput(formData.whatsapp),
        device_id: DEVICE_ID
      });
      setSession(response.session);
      goToStep('scan');
    } catch (sessionError) {
      setError(sessionError.message || 'Gagal membuat sesi kiosk');
    } finally {
      sessionStartInFlightRef.current = false;
      setIsBusy(false);
    }
  };

  const loadSystemHealth = async () => {
    try {
      setSystemLoading(true);
      setSystemError('');
      const response = await kioskApi.getSystemHealth(DEVICE_ID);
      setSystemHealth(response);
      setSystemUpdatedAt(new Date().toLocaleString('id-ID'));
    } catch (healthError) {
      setSystemError(healthError.message || 'Gagal memuat status sistem kiosk.');
    } finally {
      setSystemLoading(false);
    }
  };

  useEffect(() => {
    if (step !== 'system') return;
    if (!systemHealth && !systemLoading) {
      loadSystemHealth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleEmergencyReset = () => {
    const confirmed = window.confirm('Reset sesi sekarang dan kembali ke halaman awal?');
    if (!confirmed) return;
    resetFlow(true);
  };

  const captureFrame = () => {
    if (!videoRef.current) return '';

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1080;
    canvas.height = videoRef.current.videoHeight || 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const analyzeWithRetry = async (sessionUuid, imageBase64, captureQuality = {}) => {
    let lastError = null;

    for (let attempt = 1; attempt <= ANALYZE_RETRY_LIMIT; attempt += 1) {
      try {
        return await kioskApi.analyzeSession(sessionUuid, {
          image_base64: imageBase64,
          capture_quality: captureQuality
        });
      } catch (requestError) {
        lastError = requestError;

        if (requestError?.status === 422) {
          break;
        }

        const message = String(requestError?.message || '').toLowerCase();
        const code = String(requestError?.code || '').toLowerCase();
        const isProcessingConflict = requestError?.status === 409 && (message.includes('processing') || code.includes('processing'));

        if (!isProcessingConflict || attempt === ANALYZE_RETRY_LIMIT) {
          break;
        }

        const retryDelay = Number(requestError?.retryAfterMs || ANALYZE_RETRY_DELAY_MS);
        setProcessingText(`Sesi sedang diproses, mencoba ulang (${attempt + 1}/${ANALYZE_RETRY_LIMIT})...`);
        await wait(retryDelay);
      }
    }

    throw lastError || new Error('Analisa gagal diproses');
  };

  const waitForSessionResult = async (sessionUuid) => {
    for (let attempt = 1; attempt <= RESULT_SYNC_RETRY_LIMIT; attempt += 1) {
      try {
        const response = await kioskApi.getSessionResult(sessionUuid);
        if (response?.analysis) {
          return response;
        }
        const statusText = String(response?.status || '').toLowerCase();
        if (statusText === 'closed') {
          break;
        }
        setProcessingText(`Menunggu sinkronisasi hasil analisa... (${attempt}/${RESULT_SYNC_RETRY_LIMIT})`);
        await wait(RESULT_SYNC_RETRY_MS);
      } catch (pollError) {
        if (attempt === RESULT_SYNC_RETRY_LIMIT) {
          throw pollError;
        }
        await wait(RESULT_SYNC_RETRY_MS);
      }
    }
    return null;
  };

  const runAnalyze = async () => {
    if (!session?.session_uuid || analyzeInFlightRef.current) return;

    analyzeInFlightRef.current = true;
    resultTransitionRef.current = true;
    setIsBusy(true);
    setError('');
    setProcessingText('Menganalisis kondisi kulit Anda...');
    goToStep('processing');

    let resolvedToResult = false;
    try {
      const imageBase64 = captureFrame();
      if (!imageBase64) {
        throw new Error('Gagal mengambil gambar dari kamera, silakan ulangi scan.');
      }

      setCapturedPreview(imageBase64);
      await stopMediaPipeCamera();

      const response = await analyzeWithRetry(session.session_uuid, imageBase64, {
        brightness: brightnessRef.current,
        lighting_ok: cameraState.lighting,
        face_detected: scanSignal.faceDetected,
        distance_ok: scanSignal.distanceGood,
        distance_status: scanSignal.distanceStatus,
        face_area: scanSignal.faceArea,
        has_glasses: scanSignal.hasGlasses,
        has_filter: scanSignal.hasFilter,
        auto_capture: true
      });
      setResult(response);
      resolvedToResult = true;
      goToStep('result');
    } catch (analyzeError) {
      const isRecoverableStatus = [409, 500, 502, 503, 504].includes(Number(analyzeError?.status || 0));
      if (isRecoverableStatus && session?.session_uuid) {
        try {
          const syncedResult = await waitForSessionResult(session.session_uuid);
          if (syncedResult?.analysis) {
            setResult(syncedResult);
            resolvedToResult = true;
            goToStep('result');
            return;
          }
        } catch {
          // continue to standard error handling
        }
      }

      const reasons = Array.isArray(analyzeError?.payload?.validation?.reasons)
        ? analyzeError.payload.validation.reasons.filter(Boolean)
        : [];

      const message = analyzeError?.status === 422
        ? (analyzeError.message || 'Foto tidak valid untuk analisa. Silakan scan ulang.')
        : analyzeError?.status === 409
          ? 'Sesi sebelumnya masih diproses. Silakan tunggu sebentar lalu coba lagi.'
          : (analyzeError.message || 'Analisa gagal. Silakan ulangi scan.');

      setError(reasons.length > 0 ? `${message} (${reasons.slice(0, 2).join(' | ')})` : message);
      resultTransitionRef.current = false;
      goToStep('scan', true);
    } finally {
      setIsBusy(false);
      setCountdown(0);
      if (!resolvedToResult) {
        resultTransitionRef.current = false;
      }
      analyzeInFlightRef.current = false;
    }
  };

  const startCountdownAndAnalyze = ({ force = false, signal = null } = {}) => {
    const source = signal || {
      ready: cameraState.ready,
      lighting: cameraState.lighting,
      faceDetected: scanSignal.faceDetected,
      distanceGood: scanSignal.distanceGood,
      hasGlasses: scanSignal.hasGlasses,
      hasFilter: scanSignal.hasFilter
    };
    const canAutoRun = source.ready
      && source.lighting
      && source.faceDetected
      && source.distanceGood
      && !source.hasGlasses
      && !source.hasFilter;

    if (!session?.session_uuid) return;
    if (!force && !canAnalyze) return;
    if (force && !canAutoRun) return;
    if (force && stabilityFrameRef.current < AUTO_CAPTURE_STABILITY_FRAMES) return;
    if (analyzeInFlightRef.current || countdownRef.current || countdown > 0) return;

    setError('');
    setCountdown(AUTO_CAPTURE_DELAY_SECONDS);

    let remaining = AUTO_CAPTURE_DELAY_SECONDS;
    if (countdownRef.current) window.clearInterval(countdownRef.current);

    countdownRef.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(countdownRef.current);
        countdownRef.current = null;
        setCountdown(0);
        runAnalyze();
        return;
      }
      setCountdown(remaining);
    }, 1000);
  };

  const renderStageHeader = () => (
    <header className="kiosk-stage-header" aria-label="Progress alur kiosk">
      <div className="stage-meta">
        <span className="stage-chip">{isLargePortraitViewport ? '32" Portrait' : 'Kiosk Mode'}</span>
        <strong>Cantik AI Kiosk</strong>
        <small>{stageMetaText}</small>
      </div>

      <div className="stage-stepper">
        {FLOW_STEPS.map((flow, index) => {
          const done = index < activeFlowStepIndex;
          const active = index === activeFlowStepIndex;
          return (
            <div key={flow.key} className={`step-pill ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
              <span>{index + 1}</span>
              <small>{flow.title}</small>
            </div>
          );
        })}
      </div>
    </header>
  );

  const renderOnboarding = () => (
    <div className="screen-card onboarding-card fade-up">
      <div className="onboard-grid">
        <section className="onboard-hero">
          <div className="brand-pill">Cantik AI Kiosk</div>
          <h1>Skin Analyzer Publik</h1>
          <p>
            Analisa wajah real-time berbasis AI dermatology. Hasil lengkap 15 parameter,
            rekomendasi personal, serta akses via QR atau WhatsApp dalam satu alur cepat.
          </p>

          <div className="hero-badges">
            <span>Real-time FaceMesh</span>
            <span>Evidence-based Insight</span>
            <span>QR + PDF Result</span>
          </div>
        </section>

        <section className="onboard-action-panel">
          <h3>Alur 3 Langkah</h3>
          <div className="flow-steps">
            <div className="flow-step">
              <span>1</span>
              <strong>Data Singkat</strong>
              <small>Nama, gender, WA opsional</small>
            </div>
            <div className="flow-step">
              <span>2</span>
              <strong>Scan Otomatis</strong>
              <small>Auto-capture saat posisi valid</small>
            </div>
            <div className="flow-step">
              <span>3</span>
              <strong>Laporan Lengkap</strong>
              <small>15 mode + QR + rekomendasi AI</small>
            </div>
          </div>

          <button className="btn-primary large" onClick={() => goToStep('identity')}>
            Mulai Analisa Sekarang
          </button>

          <div className="row compact onboard-actions">
            <button className="btn-ghost" onClick={() => goToStep('guide')}>
              Panduan Scan
            </button>
            <button className="btn-ghost" onClick={() => goToStep('system')}>
              System Check
            </button>
          </div>

          <p className="onboard-footnote">
            Data dipakai hanya untuk sesi analisa ini dan tersimpan aman di dashboard admin.
          </p>
        </section>
      </div>
    </div>
  );

  const renderGuide = () => (
    <div className="screen-card guide-card fade-up">
      <div className="section-heading">
        <h2>Panduan Scan Akurat</h2>
        <p>
          Ikuti checklist ini agar AI menghasilkan analisa lebih presisi dan hasil tidak ditolak karena kualitas gambar.
        </p>
      </div>

      <div className="guide-grid">
        <div className="guide-item">
          <strong>1. Pencahayaan Stabil</strong>
          <p>Gunakan cahaya depan wajah. Hindari backlight, ruangan gelap, atau cahaya terlalu silau.</p>
        </div>
        <div className="guide-item">
          <strong>2. Posisi Wajah Penuh</strong>
          <p>Pastikan dahi, mata, pipi, hidung, bibir, dan dagu seluruhnya masuk ke dalam frame oval.</p>
        </div>
        <div className="guide-item">
          <strong>3. Lepas Penghalang</strong>
          <p>Lepas masker, kacamata, serta nonaktifkan filter kamera agar tekstur kulit terbaca jelas.</p>
        </div>
        <div className="guide-item">
          <strong>4. Diam 2-3 Detik</strong>
          <p>Saat indikator hijau, tetap diam dan lihat kamera sampai auto-capture selesai.</p>
        </div>
      </div>

      <div className="guide-notes">
        <div>
          <strong>Validasi Cerdas AI</strong>
          <p>
            Sistem akan menolak foto non-wajah, multi-wajah, blur berat, wajah tertutup, atau kondisi pencahayaan buruk.
          </p>
        </div>
      </div>

      <div className="row compact">
        <button className="btn-ghost" onClick={() => goToStep('onboarding')}>
          Kembali
        </button>
        <button className="btn-primary" onClick={() => goToStep(session?.session_uuid ? 'scan' : 'identity')}>
          {session?.session_uuid ? 'Kembali ke Scan' : 'Lanjut Isi Data'}
        </button>
      </div>
    </div>
  );

  const renderSystem = () => {
    const checks = systemHealth?.checks || {};
    const services = systemHealth?.services || {};
    const diagnostics = [
      {
        title: 'Backend API',
        ok: Boolean(checks.backend_ok),
        detail: checks.backend_ok ? 'Service aktif' : 'Service belum siap'
      },
      {
        title: 'Database SQLite',
        ok: Boolean(checks.database_ok),
        detail: checks.database_ok ? 'Terhubung dan siap query' : 'Koneksi database bermasalah'
      },
      {
        title: 'Kiosk Tables',
        ok: Boolean(checks.kiosk_tables_ok),
        detail: checks.kiosk_tables_ok ? 'Schema kiosk tersedia' : 'Tabel kiosk belum lengkap'
      },
      {
        title: 'Storage Upload',
        ok: Boolean(checks.uploads_writable),
        detail: checks.uploads_writable ? 'Folder uploads dapat ditulis' : 'Folder uploads tidak writable'
      },
      {
        title: 'Gemini AI',
        ok: Boolean(services.gemini_configured),
        detail: services.gemini_configured ? 'API key terpasang' : 'GEMINI_API_KEY belum terpasang'
      },
      {
        title: 'Groq AI',
        ok: Boolean(services.groq_configured),
        detail: services.groq_configured ? 'API key terpasang' : 'GROQ_API_KEY belum terpasang'
      },
      {
        title: 'WhatsApp Delivery',
        ok: Boolean(services.whatsapp_configured),
        detail: services.whatsapp_configured ? 'Webhook WA aktif' : 'Webhook WA belum dikonfigurasi'
      }
    ];

    return (
      <div className="screen-card system-card fade-up">
        <div className="section-heading">
          <h2>System Check Kiosk</h2>
          <p>Halaman operator untuk memastikan backend, AI, database, dan storage berjalan normal.</p>
        </div>

        {systemLoading ? (
          <div className="system-loading">
            <div className="spinner small" />
            <p>Memuat status sistem...</p>
          </div>
        ) : null}

        {systemError ? <div className="system-error">{systemError}</div> : null}

        {!systemLoading && !systemError ? (
          <div className="system-grid">
            {diagnostics.map((item) => (
              <div key={item.title} className={`system-item ${item.ok ? 'ok' : 'off'}`}>
                <strong>{item.title}</strong>
                <span>{statusLabel(item.ok)}</span>
                <small>{item.detail}</small>
              </div>
            ))}
          </div>
        ) : null}

        <div className="system-meta">
          <span>Device ID: {DEVICE_ID}</span>
          <span>Last update: {systemUpdatedAt || '-'}</span>
        </div>

        <div className="row compact">
          <button className="btn-ghost" onClick={() => goToStep('onboarding')}>
            Kembali
          </button>
          <button className="btn-primary" onClick={loadSystemHealth} disabled={systemLoading}>
            {systemLoading ? 'Memuat...' : 'Refresh Status'}
          </button>
        </div>
      </div>
    );
  };

  const renderIdentity = () => (
    <div className="screen-card identity-card fade-up">
      <div className="identity-grid">
        <div className="identity-info">
          <div className="section-heading">
            <h2>Data Diri Singkat</h2>
            <p>Nama wajib diisi. WhatsApp opsional untuk kirim hasil otomatis.</p>
          </div>

          <div className="identity-highlights">
            <div>
              <strong>Privasi</strong>
              <small>Nomor WA hanya untuk pengiriman hasil sesi ini.</small>
            </div>
            <div>
              <strong>Kecepatan</strong>
              <small>Rata-rata proses scan sampai laporan di bawah 1 menit.</small>
            </div>
            <div>
              <strong>Akurasi</strong>
              <small>AI memvalidasi kualitas foto sebelum analisa klinis.</small>
            </div>
          </div>
        </div>

        <div className="identity-form-panel">
          <label htmlFor="kiosk-name">Nama</label>
          <input
            id="kiosk-name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Contoh: Reni"
            maxLength={60}
          />

          <label htmlFor="kiosk-gender">Gender</label>
          <select
            id="kiosk-gender"
            value={formData.gender}
            onChange={(event) => setFormData((prev) => ({ ...prev, gender: event.target.value }))}
          >
            <option value="female">Perempuan</option>
            <option value="male">Laki-laki</option>
            <option value="other">Lainnya</option>
          </select>

          <label htmlFor="kiosk-wa">WhatsApp (Opsional)</label>
          <input
            id="kiosk-wa"
            value={formData.whatsapp}
            onChange={(event) => setFormData((prev) => ({ ...prev, whatsapp: normalizeWhatsappInput(event.target.value) }))}
            placeholder="628xxxxxxx"
            maxLength={20}
          />

          <div className="row compact">
            <button className="btn-ghost" onClick={() => goToStep('onboarding')}>
              Kembali
            </button>
            <button className="btn-primary" onClick={startSession} disabled={!canStart || isBusy}>
              {isBusy ? 'Menyimpan Data...' : 'Lanjut ke Scan'}
            </button>
          </div>
          <div className="inline-link-wrap">
            <button type="button" className="inline-link" onClick={() => goToStep('guide')}>
              Lihat panduan scan akurat
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScan = () => (
    <div className="screen-card scan-card fade-up">
      <div className="section-heading">
        <h2>Posisikan Wajah dalam Frame</h2>
        <p>Auto-capture aktif: setelah posisi wajah stabil beberapa detik, foto akan diambil otomatis.</p>
      </div>

      <div className="scan-layout">
        <div className="scan-camera-col">
          <div className="camera-wrapper">
            <video ref={videoRef} autoPlay muted playsInline className="camera-video" />
            <canvas ref={canvasRef} className="mesh-overlay" />
            <div className="face-frame" />
            <div className="camera-hint">Posisikan mata, hidung, dagu di dalam oval</div>
            {countdown > 0 ? <div className="countdown">{countdown}</div> : null}
          </div>
        </div>

        <div className="scan-info-col">
          <div className="quality-grid">
            <div className={`quality-chip ${cameraState.ready ? 'ok' : 'off'}`}>
              <strong>Kamera</strong>
              <span>{cameraState.ready ? 'Aktif' : 'Belum siap'}</span>
            </div>
            <div className={`quality-chip ${cameraState.lighting ? 'ok' : 'off'}`}>
              <strong>Cahaya</strong>
              <span>{cameraState.lighting ? 'Bagus' : 'Perlu lebih terang'}</span>
            </div>
            <div className={`quality-chip ${scanSignal.faceDetected ? 'ok' : 'off'}`}>
              <strong>Wajah</strong>
              <span>{scanSignal.faceDetected ? 'Terdeteksi' : 'Belum terdeteksi'}</span>
            </div>
            <div className={`quality-chip ${scanSignal.distanceGood ? 'ok' : 'off'}`}>
              <strong>Jarak</strong>
              <span>{scanSignal.distanceStatus}</span>
            </div>
            <div className={`quality-chip ${!scanSignal.hasGlasses ? 'ok' : 'off'}`}>
              <strong>Kacamata</strong>
              <span>{scanSignal.hasGlasses ? 'Lepas dulu' : 'Aman'}</span>
            </div>
            <div className={`quality-chip ${!scanSignal.hasFilter ? 'ok' : 'off'}`}>
              <strong>Filter</strong>
              <span>{scanSignal.hasFilter ? 'Nonaktifkan' : 'Aman'}</span>
            </div>
          </div>

          <p className="muted small">
            Brightness: {cameraState.brightness} · Area wajah: {scanSignal.faceArea || 0} ·
            {canAnalyze ? ' Siap auto-capture' : ' Menunggu kondisi optimal'}
          </p>

          <div className={`scan-guidance ${(canAnalyze || countdown > 0) ? 'ready' : 'waiting'}`}>
            {scanReadinessMessage}
          </div>

          <div className="scan-quality-meter" aria-label="Skor kualitas scan">
            <div className="scan-quality-meter__track">
              <div className="scan-quality-meter__bar" style={{ width: `${scanQualityScore}%` }} />
            </div>
            <span>Skor kualitas capture: {scanQualityScore}/100</span>
          </div>
          <div className="stability-badge" aria-label="Stabilitas auto-capture">
            Stabilitas posisi: {stabilityFrames}/{AUTO_CAPTURE_STABILITY_FRAMES}
          </div>

          <div className="row">
            <button className="btn-ghost" onClick={() => resetFlow()}>
              Batalkan
            </button>
            <button className="btn-primary" onClick={() => startCountdownAndAnalyze()} disabled={!canAnalyze}>
              {countdown > 0 ? 'Mempersiapkan...' : 'Scan Sekarang'}
            </button>
          </div>

          <div className="scan-links">
            <button type="button" className="inline-link" onClick={() => goToStep('guide')}>
              Lihat Panduan
            </button>
            <button type="button" className="inline-link" onClick={() => goToStep('system')}>
              Cek Sistem
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="screen-card processing-card fade-up">
      <div className="spinner" />
      <h2>Analisa Sedang Diproses</h2>
      <p>{processingText}</p>
      <div className="processing-points">
        <div>1. Validasi foto dan kualitas wajah</div>
        <div>2. Analisa klinis AI (dermatology evidence-based)</div>
        <div>3. Menyiapkan hasil + QR code + dashboard admin</div>
      </div>
      <small>Mohon tetap di depan layar sampai hasil tampil.</small>
    </div>
  );

  const renderResult = () => {
    const score = clampScore(analysis?.overall_score, 0);
    const insights = analysis?.insights || {};
    const concerns = Array.isArray(insights.priority_concerns) ? insights.priority_concerns : [];
    const recommendations = Array.isArray(insights.recommendations) ? insights.recommendations : [];
    const products = Array.isArray(analysis?.recommended_products) ? analysis.recommended_products : [];
    const urls = result?.urls || {};
    const qrValue = urls.public_result_url || urls.public_pdf_url || window.location.href;

    return (
      <div className="screen-card result-card fade-up">
        <div className="result-header">
          <div>
            <small>Laporan Kulit</small>
            <h2>Kulit Anda</h2>
          </div>
          <button className="close-circle" onClick={() => resetFlow(false)} aria-label="Tutup hasil">
            ×
          </button>
        </div>

        <div className="summary-grid">
          <div className="score-ring" style={{ '--score': score }}>
            <div>
              <strong>{score}%</strong>
              <span>Kesehatan Kulit</span>
            </div>
          </div>

          <div className="summary-info">
            <p>{analysis?.summary || 'Ringkasan belum tersedia.'}</p>
            <div className="badges">
              <span>{analysis?.skin_type || '-'}</span>
              <span>Fitzpatrick {analysis?.fitzpatrick_type || '-'}</span>
              <span>Usia Kulit {analysis?.predicted_age || '-'}</span>
              <span>{genderLabel(session?.gender)}</span>
            </div>
            {validation ? (
              <div className={`validation-box ${validation.is_valid_for_skin_analysis ? 'valid' : 'invalid'}`}>
                <strong>
                  {validation.is_valid_for_skin_analysis ? 'Kualitas Foto Valid' : 'Perlu Ulang Scan'}
                </strong>
                <p>{validation.retake_instruction || 'Tidak ada catatan.'}</p>
              </div>
            ) : null}
          </div>
        </div>

        {faceResultImage ? (
          <section className="panel-block">
            <h3>Foto Analisa Wajah</h3>
            <div className="analysis-face-wrap">
              <img src={faceResultImage} alt="Hasil analisa wajah" className="analysis-face-image" loading="lazy" />
            </div>
          </section>
        ) : null}

        <section className="panel-block">
          <h3>15 Analisis Modes</h3>
          <div className="modes-grid">
            {analysisModes.map((mode) => (
              <button
                type="button"
                key={mode.key}
                className={`mode-card tone-${mode.tone}`}
                onClick={() => setSelectedModeKey(mode.key)}
              >
                <div className="mode-title">{mode.title}</div>
                <div className="mode-score">{mode.value}</div>
                <div className="mode-status">{mode.statusLabel}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel-block two-col">
          <div>
            <h3>Prioritas Perawatan</h3>
            {concerns.length > 0 ? (
              <ul className="list-clean">
                {concerns.slice(0, 5).map((item, index) => (
                  <li key={`${item.concern}-${index}`}>
                    <strong>{item.concern}</strong>
                    <span>{item.advice || 'Butuh perhatian rutin.'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Belum ada concern spesifik.</p>
            )}
          </div>

          <div>
            <h3>Rekomendasi AI</h3>
            {recommendations.length > 0 ? (
              <ul className="list-clean">
                {recommendations.slice(0, 6).map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <strong>Tip {index + 1}</strong>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Rekomendasi belum tersedia.</p>
            )}
          </div>
        </section>

        <section className="panel-block">
          <h3>Produk Rekomendasi</h3>
          {products.length > 0 ? (
            <div className="products-grid">
              {products.slice(0, 4).map((item, index) => (
                <div key={`${item.id || item.name || index}`} className="product-card">
                  <div
                    className="product-thumb"
                    style={{
                      backgroundImage: item.image_url
                        ? `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(39,24,30,0.18)), url(${resolveAssetUrl(item.image_url)})`
                        : 'linear-gradient(140deg, rgba(157,90,118,0.3), rgba(89,54,69,0.25))'
                    }}
                  />
                  <strong>{item.name || 'Produk Perawatan'}</strong>
                  <small>{item.brand || 'Cantik AI'}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Produk rekomendasi belum tersedia.</p>
          )}
        </section>

        <section className="panel-block qr-block">
          <div className="qr-box">
            <QRCodeSVG value={qrValue} size={170} bgColor="transparent" fgColor="#593645" />
          </div>
          <div>
            <h3>Akses Hasil di HP</h3>
            <p>Scan QR ini untuk membuka hasil lengkap dan PDF di perangkat pribadi.</p>
            <p className="muted">Status WA: <strong>{formatDeliveryStatus(result?.delivery?.status)}</strong></p>
            <div className="row compact">
              <a
                className={`btn-ghost ${urls.public_pdf_url ? '' : 'disabled'}`}
                href={urls.public_pdf_url || '#'}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  if (!urls.public_pdf_url) event.preventDefault();
                }}
              >
                Unduh PDF
              </a>
              <button className="btn-primary" onClick={() => resetFlow(false)}>
                Tutup & Kembali
              </button>
            </div>
            <p className="muted small">Kembali otomatis dalam {autoResetCountdown || 0} detik.</p>
          </div>
        </section>
      </div>
    );
  };

  return (
    <main
      className={`kiosk-shell step-${step} ${usePortraitLayout ? 'viewport-portrait' : 'viewport-landscape'} ${isLargePortraitViewport ? 'portrait-large' : ''}`}
      style={stageStyle}
    >
      <section className="kiosk-stage">
        {renderStageHeader()}
        {step === 'onboarding' && renderOnboarding()}
        {step === 'guide' && renderGuide()}
        {step === 'system' && renderSystem()}
        {step === 'identity' && renderIdentity()}
        {step === 'scan' && renderScan()}
        {step === 'processing' && renderProcessing()}
        {step === 'result' && renderResult()}
      </section>

      {step !== 'onboarding' ? (
        <button type="button" className="panic-reset-btn" onClick={handleEmergencyReset}>
          Reset Sesi
        </button>
      ) : null}

      {showRoutePill ? <div className="route-pill">{window.location.pathname || '/onboard'}</div> : null}

      {error ? <div className="error-banner">{error}</div> : null}

      {selectedMode ? (
        <div className="mode-modal-backdrop" onClick={() => setSelectedModeKey(null)}>
          <div className="mode-modal" onClick={(event) => event.stopPropagation()}>
            <div className="mode-modal-head">
              <div>
                <h3>{selectedMode.title}</h3>
                <p>Parameter: {selectedMode.parameter}</p>
              </div>
              <button className="close-circle" onClick={() => setSelectedModeKey(null)} aria-label="Tutup detail">
                ×
              </button>
            </div>

            <div className="mode-modal-score">
              <span>{selectedMode.value}</span>
              <small>/100</small>
              <strong className={`tone-${selectedMode.tone}`}>{selectedMode.statusLabel}</strong>
            </div>

            <div className="mode-modal-body">
              <p>{selectedMode.detail}</p>
              <div className="insight-box">
                <strong>AI Insight</strong>
                <p>{selectedMode.detailText}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
